/**
 * Structure Session Edge Function — takes a raw Deepgram transcript and
 * uses Claude to extract structured coaching notes.
 *
 * POST /functions/v1/structure-session
 * Headers: Authorization: Bearer <supabase_jwt>
 * Body: {
 *   transcript: string,
 *   segments: TranscriptSegment[],
 *   session_type: string,
 *   focus?: string,
 *   player_name?: string,
 *   duration_seconds?: number,
 * }
 *
 * Returns: {
 *   summary: string,
 *   coaching_cues: string[],
 *   drills: Drill[],
 *   key_changes: KeyChange[],
 *   focus: string,
 * }
 */

import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

interface TranscriptSegment {
  start: number;
  end: number;
  transcript: string;
  speaker: number;
}

interface StructureRequest {
  transcript: string;
  segments?: TranscriptSegment[];
  session_type?: string;
  focus?: string;
  player_name?: string;
  duration_seconds?: number;
}

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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Parse body ──────────────────────────────────────────────────
    const body = await req.json().catch(() => null) as StructureRequest | null;
    if (!body?.transcript) {
      return new Response(
        JSON.stringify({ error: 'transcript is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { transcript, segments = [], session_type, focus, player_name, duration_seconds } = body;

    if (transcript.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: 'Transcript too short to structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Claude API ──────────────────────────────────────────────────
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const prompt = buildStructurePrompt({ transcript, segments, session_type, focus, player_name, duration_seconds });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const rawText = textBlock?.type === 'text' ? textBlock.text : '';

    // Strip markdown fences if present
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let structured;
    try {
      structured = JSON.parse(cleanJson);
    } catch {
      // If Claude didn't return clean JSON, build a minimal valid response
      structured = {
        summary: rawText.slice(0, 300),
        coaching_cues: [],
        drills: [],
        key_changes: [],
        focus: focus ?? session_type ?? 'General lesson',
      };
    }

    return new Response(JSON.stringify(structured), {
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

function buildStructurePrompt(input: {
  transcript: string;
  segments: TranscriptSegment[];
  session_type?: string;
  focus?: string;
  player_name?: string;
  duration_seconds?: number;
}): string {
  const { transcript, segments, session_type, focus, player_name, duration_seconds } = input;

  const durationLabel = duration_seconds
    ? `${Math.round(duration_seconds / 60)} minutes`
    : 'unknown duration';

  // Build speaker-labeled transcript if we have segments
  let formattedTranscript = '';
  if (segments.length > 0) {
    formattedTranscript = segments.map((seg) => {
      const speaker = seg.speaker === 0 ? 'COACH' : 'PLAYER';
      const ts = `${Math.floor(seg.start / 60)}:${String(Math.floor(seg.start % 60)).padStart(2, '0')}`;
      return `[${ts}] ${speaker}: ${seg.transcript}`;
    }).join('\n');
  } else {
    formattedTranscript = transcript;
  }

  return `You are Looper, an AI golf coaching intelligence system. A golf coach just recorded a lesson and you have the transcript. Extract structured coaching notes.

Context:
- Player: ${player_name ?? 'unknown'}
- Session type: ${session_type ?? 'full-swing'}
- Focus area: ${focus ?? 'not specified'}
- Duration: ${durationLabel}

Transcript:
${formattedTranscript}

Extract the following and return ONLY valid JSON (no markdown, no explanation):

{
  "summary": "<2-3 sentence narrative of what happened in this lesson — what was worked on, what improved, what the player struggled with>",
  "focus": "<single phrase describing the primary focus, e.g. 'Driver path and face angle' or 'Wedge distance control'>",
  "coaching_cues": [
    "<specific verbal cue the coach gave — exact language the player should remember, e.g. 'Feel like you're swinging to 3 o'clock on the follow-through'>",
    "<another cue>"
  ],
  "drills": [
    {
      "name": "<drill name>",
      "type": "external | internal | constraint",
      "description": "<what to do>",
      "reps": "<e.g. '10 shots', '5 min', '3 sets'>",
      "focus": "<what to feel or accomplish>"
    }
  ],
  "key_changes": [
    {
      "area": "<what was changed, e.g. 'Club path', 'Setup', 'Grip'>",
      "from": "<what it was before>",
      "to": "<what the coach moved it to>",
      "rationale": "<why this change helps>"
    }
  ]
}

Rules:
1. coaching_cues: only exact language the coach said or would say — short, memorable, actionable. Max 5.
2. drills: only drills explicitly mentioned or clearly implied by the lesson content. Max 4. If none mentioned, return [].
3. key_changes: only actual technique changes discussed, not observations. Max 4. If none clear, return [].
4. drill type: "external" = focus on outcome/target, "internal" = focus on body/feel, "constraint" = physical constraint device.
5. summary: write from the coach's perspective — what was worked on, any breakthrough moments, what needs continued work.
6. focus: be specific — not "full swing" but "shallow attack angle with irons" or "lag and release timing".
7. If the transcript is unclear or brief, still return valid JSON with your best extraction and shorter arrays.`;
}
