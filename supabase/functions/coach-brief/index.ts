/**
 * Coach Brief Edge Function — generates a pre-lesson brief for the coach.
 *
 * Different from player-facing practice-brief. This is for the coach, summarizing:
 *   - Player's persistent record (goal, handicap trend, SG summary)
 *   - What was worked on in previous sessions + outcomes
 *   - Recent practice compliance (did the player do the drills?)
 *   - Recommended focus for today's session
 *   - Key AI flag if any metric is trending the wrong way
 *
 * POST /functions/v1/coach-brief
 * Headers: Authorization: Bearer <coach_supabase_jwt>
 * Body: { player_id: string }
 *
 * Returns: JSON CoachBrief
 */

import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

interface CoachBriefRequest {
  player_id: string;
}

interface SessionSummary {
  date: string;
  type: string;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  key_changes: unknown[];
  drills: unknown[];
}

interface CoachBrief {
  player_name: string;
  handicap_index: number | null;
  goal: string | null;
  sessions_with_coach: number;
  last_session_date: string | null;
  practice_compliance: {
    score: 'high' | 'medium' | 'low' | 'unknown';
    label: string;
    detail: string;
  };
  strokes_gained_summary: {
    off_tee: number | null;
    approach: number | null;
    around_green: number | null;
    putting: number | null;
    trend_alert: string | null;
  };
  session_history_summary: string;
  recommended_focus: string;
  key_questions: string[];
  ai_flag: string | null;
  generated_at: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
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

    // ── Verify caller is a coach ──────────────────────────────────────────────
    const { data: coachRow } = await anonClient
      .from('coaches')
      .select('id, name')
      .eq('auth_id', user.id)
      .single();

    if (!coachRow) {
      return new Response(
        JSON.stringify({ error: 'Caller is not a registered coach' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Parse request body ────────────────────────────────────────────────────
    const body = await req.json() as CoachBriefRequest;
    const { player_id } = body;

    if (!player_id) {
      return new Response(
        JSON.stringify({ error: 'player_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Use service-role client for cross-user data reads (coach reading player data)
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // ── Fetch player profile ──────────────────────────────────────────────────
    const { data: player } = await serviceClient
      .from('players')
      .select('id, name, handicap_index, goal, archetype, strengths, weaknesses, connected_sources')
      .eq('id', player_id)
      .single();

    if (!player) {
      return new Response(
        JSON.stringify({ error: 'Player not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Fetch coaching sessions (most recent 10) ──────────────────────────────
    const { data: sessions } = await serviceClient
      .from('coaching_sessions')
      .select('date, type, focus, summary, coaching_cues, key_changes, drills, status')
      .eq('player_id', player_id)
      .eq('coach_id', coachRow.id)
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(10);

    const completedSessions: SessionSummary[] = sessions ?? [];

    // ── Fetch recent rounds (last 10) ─────────────────────────────────────────
    const { data: rounds } = await serviceClient
      .from('rounds')
      .select('date, score, differential, sg_total, sg_off_tee, sg_approach, sg_around_green, sg_putting')
      .eq('player_id', player_id)
      .order('date', { ascending: false })
      .limit(10);

    // ── Fetch recent practice sessions (last 8) ───────────────────────────────
    const { data: practiceSessions } = await serviceClient
      .from('practice_sessions')
      .select('date, type, duration_min, focus_area')
      .eq('player_id', player_id)
      .order('date', { ascending: false })
      .limit(8);

    // ── Compute practice compliance ───────────────────────────────────────────
    const lastSession = completedSessions[0];
    const lastSessionDate = lastSession?.date ?? null;

    let practiceCompliance: CoachBrief['practice_compliance'] = {
      score: 'unknown',
      label: 'No data',
      detail: 'No practice sessions on record.',
    };

    if (lastSessionDate && practiceSessions && practiceSessions.length > 0) {
      const daysSinceLesson = Math.floor(
        (Date.now() - new Date(lastSessionDate).getTime()) / (1000 * 60 * 60 * 24),
      );
      const practiceInWindow = practiceSessions.filter(
        (ps) => new Date(ps.date) > new Date(lastSessionDate),
      );
      const sessionsPerWeek = practiceInWindow.length / Math.max(1, daysSinceLesson / 7);

      if (sessionsPerWeek >= 3) {
        practiceCompliance = { score: 'high', label: 'Excellent', detail: `${practiceInWindow.length} practice sessions since last lesson (${daysSinceLesson} days ago).` };
      } else if (sessionsPerWeek >= 1) {
        practiceCompliance = { score: 'medium', label: 'Good', detail: `${practiceInWindow.length} practice sessions since last lesson (${daysSinceLesson} days ago).` };
      } else if (practiceInWindow.length === 0 && daysSinceLesson > 3) {
        practiceCompliance = { score: 'low', label: 'Low', detail: `No practice recorded since last lesson ${daysSinceLesson} days ago.` };
      } else {
        practiceCompliance = { score: 'medium', label: 'Some', detail: `${practiceInWindow.length} session(s) since last lesson.` };
      }
    }

    // ── Compute SG summary and trend alert ───────────────────────────────────
    const sgAvg = (key: string): number | null => {
      const vals = (rounds ?? []).map((r) => r[key as keyof typeof r]).filter((v): v is number => v != null);
      if (vals.length === 0) return null;
      return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
    };

    const sgOffTee = sgAvg('sg_off_tee');
    const sgApproach = sgAvg('sg_approach');
    const sgAroundGreen = sgAvg('sg_around_green');
    const sgPutting = sgAvg('sg_putting');

    // Detect worsening trend — compare first 5 vs last 5 rounds
    let trendAlert: string | null = null;
    if (rounds && rounds.length >= 6) {
      const recent = rounds.slice(0, 5);
      const older = rounds.slice(5, 10);
      const avgSG = (arr: typeof rounds, key: string) => {
        const vals = arr.map((r) => r[key as keyof typeof r]).filter((v): v is number => v != null);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      };

      const categories = [
        { key: 'sg_off_tee', label: 'Off-Tee SG' },
        { key: 'sg_approach', label: 'Approach SG' },
        { key: 'sg_around_green', label: 'Around-Green SG' },
        { key: 'sg_putting', label: 'Putting SG' },
      ];

      for (const cat of categories) {
        const recentAvg = avgSG(recent, cat.key);
        const olderAvg = avgSG(older, cat.key);
        if (recentAvg !== null && olderAvg !== null && recentAvg < olderAvg - 0.4) {
          trendAlert = `${cat.label} trending down: recent avg ${recentAvg > 0 ? '+' : ''}${recentAvg.toFixed(2)} vs prior ${olderAvg > 0 ? '+' : ''}${olderAvg.toFixed(2)}`;
          break; // Flag the biggest regression
        }
      }
    }

    // ── Build Claude prompt ───────────────────────────────────────────────────
    const prompt = buildCoachBriefPrompt({
      player,
      sessions: completedSessions,
      rounds: rounds ?? [],
      practiceSessions: practiceSessions ?? [],
      practiceCompliance,
      coachName: coachRow.name,
    });

    // ── Call Claude ───────────────────────────────────────────────────────────
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse AI response — expect JSON
    let aiParsed: { session_history_summary: string; recommended_focus: string; key_questions: string[]; ai_flag: string | null };
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      aiParsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        session_history_summary: aiText.substring(0, 300),
        recommended_focus: lastSession?.focus ?? 'Continue from last session',
        key_questions: [],
        ai_flag: null,
      };
    } catch {
      aiParsed = {
        session_history_summary: aiText.substring(0, 300),
        recommended_focus: lastSession?.focus ?? 'Continue from last session',
        key_questions: [],
        ai_flag: trendAlert,
      };
    }

    // ── Build response ────────────────────────────────────────────────────────
    const brief: CoachBrief = {
      player_name: player.name,
      handicap_index: player.handicap_index,
      goal: player.goal,
      sessions_with_coach: completedSessions.length,
      last_session_date: lastSessionDate,
      practice_compliance: practiceCompliance,
      strokes_gained_summary: {
        off_tee: sgOffTee,
        approach: sgApproach,
        around_green: sgAroundGreen,
        putting: sgPutting,
        trend_alert: trendAlert ?? aiParsed.ai_flag,
      },
      session_history_summary: aiParsed.session_history_summary,
      recommended_focus: aiParsed.recommended_focus,
      key_questions: aiParsed.key_questions ?? [],
      ai_flag: trendAlert ?? aiParsed.ai_flag,
      generated_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(brief), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('coach-brief error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildCoachBriefPrompt(ctx: {
  player: { name: string; handicap_index: number | null; goal: string | null; archetype: string | null; strengths: unknown; weaknesses: unknown };
  sessions: SessionSummary[];
  rounds: { date: string; score: number | null; differential: number | null; sg_off_tee: number | null; sg_approach: number | null }[];
  practiceSessions: { date: string; type: string; duration_min: number | null; focus_area: string | null }[];
  practiceCompliance: CoachBrief['practice_compliance'];
  coachName: string;
}): string {
  const { player, sessions, rounds, practiceSessions, practiceCompliance, coachName } = ctx;

  const sessionLines = sessions.slice(0, 5).map((s, i) =>
    `Session ${i + 1} (${s.date}): ${s.type}${s.focus ? ` — focus: ${s.focus}` : ''}. ${s.summary ?? 'No summary recorded.'}${s.coaching_cues?.length ? ` Cues: ${s.coaching_cues.slice(0, 3).join('; ')}.` : ''}`
  ).join('\n');

  const roundLines = rounds.slice(0, 5).map((r) =>
    `${r.date}: Score ${r.score ?? 'N/A'}, Diff ${r.differential ?? 'N/A'}${r.sg_off_tee != null ? `, OTee SG ${r.sg_off_tee > 0 ? '+' : ''}${r.sg_off_tee.toFixed(2)}` : ''}${r.sg_approach != null ? `, App SG ${r.sg_approach > 0 ? '+' : ''}${r.sg_approach.toFixed(2)}` : ''}`
  ).join('\n');

  const practiceLines = practiceSessions.slice(0, 5).map((ps) =>
    `${ps.date}: ${ps.type}${ps.duration_min ? ` (${ps.duration_min}m)` : ''}${ps.focus_area ? ` — ${ps.focus_area}` : ''}`
  ).join('\n');

  return `You are an AI assistant helping ${coachName}, a golf coach, prepare for a lesson with ${player.name}.

PLAYER PROFILE
Name: ${player.name}
Handicap: ${player.handicap_index ?? 'N/A'}
Goal: ${player.goal ?? 'Not specified'}
Golf DNA: ${player.archetype ?? 'Unknown'}

COACHING HISTORY (last 5 sessions, most recent first)
${sessionLines || 'No previous sessions recorded.'}

RECENT ROUNDS (last 5)
${roundLines || 'No rounds on record.'}

RECENT PRACTICE (last 5 sessions)
${practiceLines || 'No practice sessions recorded.'}

PRACTICE COMPLIANCE
${practiceCompliance.label}: ${practiceCompliance.detail}

Based on all of the above, generate a pre-lesson brief for ${coachName} in the following JSON format. Be specific — reference actual session data, round trends, and practice patterns. No generic advice.

{
  "session_history_summary": "2-3 sentence summary of what has been worked on across the coaching relationship and where things stand today",
  "recommended_focus": "One clear sentence: what should today's session focus on and why",
  "key_questions": ["Question 1 the coach should ask the player to open the session", "Question 2", "Question 3"],
  "ai_flag": "If there is one important thing the coach must not miss today (a metric trending wrong, a carry-forward from last session, a pattern in the data), state it in one sentence. Otherwise null."
}

Return ONLY valid JSON. No preamble, no explanation.`;
}
