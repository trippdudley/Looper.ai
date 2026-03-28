/**
 * Pre-Lesson Brief Edge Function — generates the AI context card shown to a coach
 * before a lesson starts. This is the "Context phase" card in the Lesson Sidebar.
 *
 * POST /functions/v1/pre-lesson-brief
 * Headers: Authorization: Bearer <supabase_jwt>
 * Body: { player_id: string }
 *
 * Returns: {
 *   player_name: string,
 *   handicap_index: number | null,
 *   sessions_together: number,
 *   last_session: LastSessionSummary | null,
 *   practice_compliance: PracticeCompliance,
 *   data_trends: DataTrend[],
 *   recommended_focus: string,
 *   carry_forward: string[],
 *   confidence: number,      // 0-100
 *   generated_at: string,
 * }
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

    // ── Parse body ──────────────────────────────────────────────────
    const body = await req.json().catch(() => ({})) as { player_id?: string };
    if (!body.player_id) {
      return new Response(
        JSON.stringify({ error: 'player_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // ── Fetch coach ─────────────────────────────────────────────────
    const { data: coach } = await serviceClient
      .from('coaches')
      .select('id, name')
      .eq('auth_id', user.id)
      .single();

    if (!coach) {
      return new Response(
        JSON.stringify({ error: 'Coach profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Fetch player ─────────────────────────────────────────────────
    const { data: player } = await serviceClient
      .from('players')
      .select('id, name, handicap_index, goal, home_club')
      .eq('id', body.player_id)
      .single();

    if (!player) {
      return new Response(
        JSON.stringify({ error: 'Player not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Fetch session history ────────────────────────────────────────
    const [sessionsRes, roundsRes] = await Promise.all([
      serviceClient
        .from('coaching_sessions')
        .select('id, date, type, focus, summary, coaching_cues, drills, key_changes, practice_plan, duration_min, status')
        .eq('player_id', player.id)
        .eq('coach_id', coach.id)
        .eq('status', 'completed')
        .order('date', { ascending: false })
        .limit(5),
      serviceClient
        .from('rounds')
        .select('date, score, differential, sg_total, sg_off_tee, sg_approach, sg_around_green, sg_putting')
        .eq('player_id', player.id)
        .order('date', { ascending: false })
        .limit(10),
    ]);

    const sessions = sessionsRes.data ?? [];
    const rounds = roundsRes.data ?? [];

    // Check for practice sessions since last coaching session
    let practiceSessions: Array<{ date: string; type: string | null; total_shots: number | null }> = [];
    if (sessions.length > 0) {
      const lastSessionDate = sessions[0].date;
      const { data: practiceData } = await serviceClient
        .from('practice_sessions')
        .select('date, type, total_shots, focus_area')
        .eq('player_id', player.id)
        .gte('date', lastSessionDate)
        .order('date', { ascending: false })
        .limit(10);
      practiceSessions = practiceData ?? [];
    }

    // ── Build brief with Claude ──────────────────────────────────────
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const prompt = buildPreLessonPrompt({
      coach,
      player,
      sessions,
      rounds,
      practiceSessions,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const rawText = textBlock?.type === 'text' ? textBlock.text : '';

    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let brief;
    try {
      brief = JSON.parse(cleanJson);
    } catch {
      // Fallback: minimal brief if Claude's JSON is malformed
      brief = {
        player_name: player.name,
        handicap_index: player.handicap_index,
        sessions_together: sessions.length,
        last_session: null,
        practice_compliance: { status: 'unknown', summary: 'Could not assess practice data.' },
        data_trends: [],
        recommended_focus: player.goal ?? 'Continue working on previous session objectives',
        carry_forward: [],
        confidence: 40,
        generated_at: new Date().toISOString(),
      };
    }

    // Always stamp generated_at server-side regardless of Claude output
    brief.generated_at = new Date().toISOString();

    return new Response(JSON.stringify(brief), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ── Prompt builder ───────────────────────────────────────────────────────────

type Session = {
  id: string;
  date: string;
  type: string;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  drills: unknown;
  key_changes: unknown;
  practice_plan: unknown;
  duration_min: number | null;
};

type Round = {
  date: string;
  score: number;
  differential: number | null;
  sg_total: number | null;
  sg_off_tee: number | null;
  sg_approach: number | null;
  sg_around_green: number | null;
  sg_putting: number | null;
};

function buildPreLessonPrompt(input: {
  coach: { id: string; name: string };
  player: { name: string; handicap_index: number | null; goal: string | null; home_club: string | null };
  sessions: Session[];
  rounds: Round[];
  practiceSessions: Array<{ date: string; type: string | null; total_shots: number | null }>;
}): string {
  const { player, sessions, rounds, practiceSessions } = input;

  const hcp = player.handicap_index != null ? player.handicap_index.toFixed(1) : 'unknown';
  const lastSession = sessions[0] ?? null;

  // Format last session context
  let lastSessionContext = 'No previous sessions recorded.';
  if (lastSession) {
    const cues = Array.isArray(lastSession.coaching_cues) ? lastSession.coaching_cues : [];
    const drills = Array.isArray(lastSession.drills) ? lastSession.drills : [];
    lastSessionContext = `
Last session: ${lastSession.date} (${lastSession.type}, ${lastSession.duration_min ?? '?'} min)
Focus: ${lastSession.focus ?? 'not specified'}
Summary: ${lastSession.summary ?? 'no summary recorded'}
Coaching cues given: ${cues.length > 0 ? cues.join(' | ') : 'none recorded'}
Drills prescribed: ${drills.length > 0 ? JSON.stringify(drills).slice(0, 400) : 'none recorded'}
`;
  }

  // Format session history (last 5)
  const sessionHistoryLines = sessions.slice(0, 5).map((s) =>
    `  ${s.date}: ${s.type}${s.focus ? ` — ${s.focus}` : ''}${s.summary ? ` | ${s.summary.slice(0, 80)}` : ''}`
  ).join('\n');

  // Practice compliance check
  let practiceContext = '';
  if (practiceSessions.length === 0 && lastSession) {
    practiceContext = `Player has NOT recorded any practice sessions since the last lesson (${lastSession.date}).`;
  } else if (practiceSessions.length > 0) {
    const totalShots = practiceSessions.reduce((sum, s) => sum + (s.total_shots ?? 0), 0);
    practiceContext = `Player recorded ${practiceSessions.length} practice session(s) since last lesson, ${totalShots} total shots.`;
    practiceContext += `\nSessions: ${practiceSessions.map((s) => `${s.date} (${s.type ?? 'range'}, ${s.total_shots ?? '?'} shots)`).join('; ')}`;
  }

  // SG trends
  let sgContext = 'No strokes gained data available.';
  const sgRounds = rounds.filter((r) => r.sg_total != null);
  if (sgRounds.length >= 3) {
    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length > 0 ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2) : 'N/A';
    };
    sgContext = `
SG data over last ${sgRounds.length} rounds:
- Off the Tee: ${avg(sgRounds.map((r) => r.sg_off_tee))}
- Approach: ${avg(sgRounds.map((r) => r.sg_approach))}
- Around the Green: ${avg(sgRounds.map((r) => r.sg_around_green))}
- Putting: ${avg(sgRounds.map((r) => r.sg_putting))}
- Total: ${avg(sgRounds.map((r) => r.sg_total))}
`;
  } else if (rounds.length > 0) {
    const scores = rounds.filter((r) => r.score > 0);
    if (scores.length > 0) {
      const avgScore = (scores.reduce((sum, r) => sum + r.score, 0) / scores.length).toFixed(1);
      sgContext = `No SG data. Average score over ${scores.length} rounds: ${avgScore}.`;
    }
  }

  return `You are Looper, an AI golf coaching intelligence system. A coach is about to start a lesson with a student. Generate a pre-lesson brief to give the coach context.

Player: ${player.name}, ${hcp} handicap
Goal: "${player.goal ?? 'not specified'}"
Sessions together: ${sessions.length}

${lastSessionContext}

Session history (most recent first):
${sessionHistoryLines || '  None recorded.'}

Practice since last lesson:
${practiceContext || 'Unknown — no data connected.'}

Performance data:
${sgContext}

Generate a pre-lesson brief as JSON. Return ONLY valid JSON, no markdown:

{
  "player_name": "${player.name}",
  "handicap_index": ${player.handicap_index ?? null},
  "sessions_together": ${sessions.length},
  "last_session": ${lastSession ? `{
    "date": "${lastSession.date}",
    "focus": ${JSON.stringify(lastSession.focus)},
    "summary": ${JSON.stringify(lastSession.summary ?? '')},
    "top_cues": ${JSON.stringify(Array.isArray(lastSession.coaching_cues) ? lastSession.coaching_cues.slice(0, 3) : [])}
  }` : 'null'},
  "practice_compliance": {
    "status": "<none | low | good | excellent>",
    "sessions_since_last_lesson": <number>,
    "summary": "<1-2 sentence assessment — did they practice what was prescribed?>"
  },
  "data_trends": [
    {
      "metric": "<e.g. 'SG: Off the Tee', 'Handicap Index', 'SG: Approach'>",
      "trend": "<improving | declining | stable | insufficient_data>",
      "value": "<formatted value, e.g. '-1.8 avg over 8 rounds'>",
      "flag": <true if this metric needs coach attention today, else false>
    }
  ],
  "recommended_focus": "<specific focus for today's lesson based on all context — be direct, e.g. 'Driver path has been worsening across 5 sessions — address the over-the-top move from S8'>",
  "carry_forward": [
    "<specific item from last session the coach should check on today, e.g. 'Did the trail arm drill transfer to on-course? Check early in lesson.'>",
    "<another carry-forward item>"
  ],
  "confidence": <number 40-90 — how confident is the AI in this brief, based on data richness>,
  "generated_at": "${new Date().toISOString()}"
}

Rules:
1. recommended_focus: be direct and specific. Reference actual data/session numbers if available. This should tell the coach exactly what to look at first.
2. data_trends: only include metrics where you have real data. Flag=true if a metric is clearly declining or hasn't been addressed.
3. carry_forward: max 3 items. Reference specific cues or drills from the last session.
4. practice_compliance: be honest — if there's no data, status is "unknown", not "none".
5. confidence: higher confidence when you have SG data + multiple sessions + practice records. Lower when data is sparse.
6. The brief must be actionable — the coach reads this in 30 seconds before the lesson starts.`;
}
