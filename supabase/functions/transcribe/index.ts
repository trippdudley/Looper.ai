/**
 * Transcribe Edge Function — proxies audio to Deepgram so the API key stays server-side.
 *
 * POST /functions/v1/transcribe
 * Headers: Authorization: Bearer <supabase_jwt>
 * Body: raw audio bytes (Content-Type: audio/m4a or audio/mp4)
 *
 * Returns: JSON with transcript, segments, duration_seconds
 */

import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── Auth ────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // ── Validate request ─────────────────────────────────────────────
    const contentType = req.headers.get('Content-Type') ?? 'audio/m4a';
    const audioBody = await req.arrayBuffer();

    if (audioBody.byteLength === 0) {
      return new Response(
        JSON.stringify({ error: 'Empty audio body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Limit to 50MB
    if (audioBody.byteLength > 50 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Audio file too large (max 50MB)' }),
        {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // ── Proxy to Deepgram ────────────────────────────────────────────
    const deepgramKey = Deno.env.get('DEEPGRAM_API_KEY');
    if (!deepgramKey) {
      return new Response(
        JSON.stringify({ error: 'DEEPGRAM_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const params = new URLSearchParams({
      model: 'nova-2',
      language: 'en-US',
      smart_format: 'true',
      diarize: 'true',
      punctuate: 'true',
      utterances: 'true',
      filler_words: 'true',
      keywords: [
        'strokes gained',
        'handicap',
        'TrackMan',
        'Foresight',
        'face angle',
        'club path',
        'attack angle',
        'spin rate',
        'smash factor',
        'dynamic loft',
        'ball speed',
        'D-plane',
      ].join(':1 ') + ':1',
    });

    const dgResponse = await fetch(
      `https://api.deepgram.com/v1/listen?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${deepgramKey}`,
          'Content-Type': contentType,
        },
        body: audioBody,
      },
    );

    if (!dgResponse.ok) {
      const errBody = await dgResponse.text();
      return new Response(
        JSON.stringify({ error: `Deepgram error: ${dgResponse.status}`, detail: errBody }),
        {
          status: dgResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await dgResponse.json();
    const result = parseDeepgramResponse(data);

    return new Response(JSON.stringify(result), {
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

// ── Deepgram response parsing ──────────────────────────────────────────

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
  punctuated_word: string;
}

interface TranscriptSegment {
  start: number;
  end: number;
  transcript: string;
  speaker: number;
  confidence: number;
  words: TranscriptWord[];
}

interface DeepgramResult {
  transcript: string;
  segments: TranscriptSegment[];
  duration_seconds: number;
  detected_language: string;
}

function parseDeepgramResponse(data: Record<string, unknown>): DeepgramResult {
  const results = data?.results as Record<string, unknown>;
  const channels = results?.channels as Array<Record<string, unknown>>;
  const channel = channels?.[0];
  const alternatives = channel?.alternatives as Array<Record<string, unknown>>;
  const alt = alternatives?.[0];

  const transcript = (alt?.transcript as string) ?? '';
  const words = (alt?.words as TranscriptWord[]) ?? [];
  const metadata = data?.metadata as Record<string, unknown>;
  const duration = (metadata?.duration as number) ?? 0;

  const segments = groupIntoSegments(words);

  return {
    transcript,
    segments,
    duration_seconds: duration,
    detected_language: 'en-US',
  };
}

function groupIntoSegments(words: TranscriptWord[]): TranscriptSegment[] {
  if (!words.length) return [];

  const segments: TranscriptSegment[] = [];
  let currentSpeaker = words[0].speaker ?? 0;
  let currentWords: TranscriptWord[] = [];

  for (const word of words) {
    const speaker = word.speaker ?? 0;
    if (speaker !== currentSpeaker && currentWords.length > 0) {
      segments.push(buildSegment(currentWords, currentSpeaker));
      currentWords = [];
      currentSpeaker = speaker;
    }
    currentWords.push(word);
  }

  if (currentWords.length > 0) {
    segments.push(buildSegment(currentWords, currentSpeaker));
  }

  return segments;
}

function buildSegment(words: TranscriptWord[], speaker: number): TranscriptSegment {
  const text = words.map((w) => w.punctuated_word).join(' ');
  const avgConfidence =
    words.reduce((sum, w) => sum + w.confidence, 0) / words.length;

  return {
    start: words[0].start,
    end: words[words.length - 1].end,
    transcript: text,
    speaker,
    confidence: avgConfidence,
    words,
  };
}
