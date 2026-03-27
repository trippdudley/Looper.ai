/**
 * Practice Brief Edge Function — generates an AI-powered, SG-proportional practice plan.
 *
 * POST /functions/v1/practice-brief
 * Headers: Authorization: Bearer <supabase_jwt>
 * Body: { duration_minutes?: number }  (default: 60)
 *
 * Returns: JSON with structured practice plan
 */

import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── Auth ────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Parse request ───────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const durationMin = (body as { duration_minutes?: number }).duration_minutes ?? 60;

    // ── Fetch player data ───────────────────────────────────────────
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: player } = await serviceClient
      .from('players')
      .select('id, name, handicap_index, goal, home_club, connected_sources')
      .eq('auth_id', user.id)
      .single();

    if (!player) {
      return new Response(
        JSON.stringify({ error: 'Player profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch rounds with SG data, practice sessions, and shot stats
    const [roundsRes, sessionsRes, shotsRes] = await Promise.all([
      serviceClient
        .from('rounds')
        .select('date, course_name, score, differential, sg_total, sg_off_tee, sg_approach, sg_around_green, sg_putting, source')
        .eq('player_id', player.id)
        .order('date', { ascending: false })
        .limit(30),
      serviceClient
        .from('practice_sessions')
        .select('date, source, total_shots, clubs_used, type, focus_area')
        .eq('player_id', player.id)
        .order('date', { ascending: false })
        .limit(20),
      serviceClient
        .from('shots')
        .select('club, carry, ball_speed, offline, spin_rate')
        .eq('player_id', player.id)
        .limit(500),
    ]);

    const rounds = roundsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];
    const shots = shotsRes.data ?? [];

    // Compute club stats
    const clubMap = new Map<string, { carries: number[]; offlines: number[] }>();
    for (const s of shots) {
      const club = s.club ?? 'Unknown';
      if (!clubMap.has(club)) clubMap.set(club, { carries: [], offlines: [] });
      const entry = clubMap.get(club)!;
      if (s.carry != null) entry.carries.push(s.carry);
      if (s.offline != null) entry.offlines.push(Math.abs(s.offline));
    }

    const clubStats = [...clubMap.entries()].map(([club, data]) => {
      const avgCarry = data.carries.length > 0
        ? Math.round(data.carries.reduce((a, b) => a + b, 0) / data.carries.length)
        : null;
      const avgOffline = data.offlines.length > 0
        ? Math.round(data.offlines.reduce((a, b) => a + b, 0) / data.offlines.length * 10) / 10
        : null;
      return { club, shots: data.carries.length, avgCarry, avgOffline };
    }).sort((a, b) => b.shots - a.shots);

    // Check data availability
    const hasSG = rounds.some(r => r.sg_total != null);
    const hasRounds = rounds.length > 0;
    const hasShots = shots.length > 0;

    // ── Build the prompt ────────────────────────────────────────────
    const prompt = buildPracticeBriefPrompt({
      player,
      rounds,
      sessions,
      clubStats,
      hasSG,
      hasRounds,
      hasShots,
      durationMin,
    });

    // ── Call Claude ──────────────────────────────────────────────────
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const rawText = textBlock?.type === 'text' ? textBlock.text : '';

    // Parse the JSON response
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let brief;
    try {
      brief = JSON.parse(cleanJson);
    } catch {
      // If JSON parsing fails, return a structured error with the raw text
      brief = {
        title: 'Practice Brief',
        duration: `${durationMin} minutes`,
        summary: rawText,
        blocks: [],
        generated_at: new Date().toISOString(),
      };
    }

    return new Response(
      JSON.stringify(brief),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

// ── Prompt builder ──────────────────────────────────────────────────

interface PromptInput {
  player: {
    name: string;
    handicap_index: number | null;
    goal: string | null;
    home_club: string | null;
  };
  rounds: Array<{
    date: string;
    course_name: string;
    score: number;
    differential: number | null;
    sg_total: number | null;
    sg_off_tee: number | null;
    sg_approach: number | null;
    sg_around_green: number | null;
    sg_putting: number | null;
  }>;
  sessions: Array<{
    date: string;
    total_shots: number | null;
    clubs_used: string[] | null;
    type: string | null;
  }>;
  clubStats: Array<{
    club: string;
    shots: number;
    avgCarry: number | null;
    avgOffline: number | null;
  }>;
  hasSG: boolean;
  hasRounds: boolean;
  hasShots: boolean;
  durationMin: number;
}

function buildPracticeBriefPrompt(input: PromptInput): string {
  const { player, rounds, sessions, clubStats, hasSG, hasRounds, hasShots, durationMin } = input;

  const hcp = player.handicap_index != null ? player.handicap_index.toFixed(1) : 'unknown';

  let dataContext = '';

  if (hasSG) {
    const sgRounds = rounds.filter(r => r.sg_total != null);
    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length > 0 ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : 'N/A';
    };
    dataContext += `
## Strokes Gained Data (${sgRounds.length} rounds)
- SG Total: ${avg(sgRounds.map(r => r.sg_total))}
- SG Off the Tee: ${avg(sgRounds.map(r => r.sg_off_tee))}
- SG Approach: ${avg(sgRounds.map(r => r.sg_approach))}
- SG Around the Green: ${avg(sgRounds.map(r => r.sg_around_green))}
- SG Putting: ${avg(sgRounds.map(r => r.sg_putting))}

IMPORTANT: Allocate practice time proportionally to the BIGGEST SG LOSSES. The category losing the most strokes gets the most time. Categories at or above scratch baseline get minimal maintenance time.
`;
  }

  if (hasRounds && !hasSG) {
    const scores = rounds.filter(r => r.score > 0).map(r => r.score);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
    dataContext += `
## Scoring Data (${rounds.length} rounds, no SG breakdown available)
- Average Score: ${avgScore}
- Recent rounds: ${rounds.slice(0, 5).map(r => `${r.date}: ${r.score} at ${r.course_name}`).join('; ')}

Without strokes gained data, use general guidelines for a ${hcp}-handicap player. Encourage importing Arccos data for a precise SG-proportional plan.
`;
  }

  if (hasShots && clubStats.length > 0) {
    dataContext += `
## Launch Monitor Data (${clubStats.reduce((sum, c) => sum + c.shots, 0)} total shots)
${clubStats.slice(0, 10).map(c => `- ${c.club}: ${c.shots} shots${c.avgCarry ? `, ${c.avgCarry}yd avg carry` : ''}${c.avgOffline ? `, ${c.avgOffline}yd avg offline` : ''}`).join('\n')}

## Practice History
${sessions.length > 0
  ? sessions.slice(0, 8).map(s => `- ${s.date}: ${s.total_shots ?? '?'} shots, ${s.type ?? 'range'}${s.clubs_used?.length ? `, clubs: ${s.clubs_used.join(', ')}` : ''}`).join('\n')
  : 'No previous practice sessions recorded.'}

Look at the practice allocation — is the player practicing what they need, or over-practicing strengths? Flag any imbalance.
`;
  }

  if (!hasRounds && !hasShots) {
    dataContext = `
## Data Status
This player has not imported any performance data yet. Generate a GENERAL practice brief appropriate for a ${hcp}-handicap golfer with the goal "${player.goal ?? 'improvement'}". Note that importing data will unlock a personalized, SG-proportional plan.
`;
  }

  return `You are Looper, an AI golf intelligence system. Generate a structured practice brief for ${player.name}.

Player: ${player.name}, ${hcp} handicap, goal: "${player.goal ?? 'not set'}", home club: ${player.home_club ?? 'not set'}
Duration: ${durationMin} minutes

${dataContext}

Generate a practice plan as JSON with this EXACT structure. Return ONLY valid JSON, no markdown, no explanation:

{
  "title": "Practice Brief",
  "subtitle": "<one line summary of focus, e.g. 'Attack your approach game'>",
  "duration": "${durationMin} min",
  "generated_at": "${new Date().toISOString()}",
  "data_basis": "<what data this plan is based on, e.g. '12 rounds with SG data + 156 launch monitor shots'>",
  "blocks": [
    {
      "category": "<e.g. Approach 150-200yd>",
      "time_minutes": <number>,
      "percentage": <number 0-100>,
      "sg_value": <number or null if no SG data>,
      "priority": "<high|medium|low|maintenance>",
      "rationale": "<why this block — reference specific data>",
      "drills": [
        {
          "name": "<drill name>",
          "reps": "<e.g. 15 balls, 10 putts, 5 minutes>",
          "focus": "<what to focus on>",
          "success_criteria": "<measurable outcome>"
        }
      ]
    }
  ],
  "insight": "<one paragraph connecting this practice plan to the player's goal and data trends>",
  "next_session_note": "<what to focus on next time>"
}

Rules:
1. Blocks must sum to ${durationMin} minutes
2. If SG data exists, allocate proportionally — biggest losses get most time
3. Each block needs 2-3 specific drills with measurable success criteria
4. Reference the player's actual numbers (carry distances, offline, SG values)
5. Include a "maintenance" block for areas that are already strong (5-10% of time max)
6. Drills should be practical — things a player can do alone at a range or practice green
7. Be opinionated — tell them exactly what to do, don't list options`;
}
