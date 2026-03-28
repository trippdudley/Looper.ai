/**
 * Deepgram transcription service.
 *
 * Routes audio through a Supabase Edge Function (`transcribe`) so the Deepgram API key
 * stays server-side. Falls back to direct Deepgram API in development if the env var
 * EXPO_PUBLIC_DEEPGRAM_API_KEY is set (for local testing without Edge Functions).
 *
 * Production: set DEEPGRAM_API_KEY as a Supabase secret (`supabase secrets set DEEPGRAM_API_KEY=...`)
 * Development: optionally set EXPO_PUBLIC_DEEPGRAM_API_KEY in .env for direct calls
 */

import { supabase } from './supabase';

const DEEPGRAM_API_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY ?? '';
const DEEPGRAM_URL = 'https://api.deepgram.com/v1/listen';

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
  punctuated_word: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  transcript: string;
  speaker: number;
  confidence: number;
  words: TranscriptWord[];
}

export interface DeepgramResult {
  transcript: string;
  segments: TranscriptSegment[];
  duration_seconds: number;
  detected_language: string;
}

export interface DeepgramError {
  error: string;
  message: string;
}

/**
 * Transcribe a local audio file URI.
 * Uses Edge Function in production, falls back to direct API in dev.
 */
export async function transcribeAudio(
  fileUri: string,
  mimeType: string = 'audio/m4a'
): Promise<DeepgramResult> {
  // Read file as blob
  const response = await fetch(fileUri);
  const audioBlob = await response.blob();

  // Prefer Edge Function (keeps API key server-side)
  if (!DEEPGRAM_API_KEY) {
    return transcribeViaEdgeFunction(audioBlob, mimeType);
  }

  // Dev fallback: direct Deepgram API
  return transcribeDirectly(audioBlob, mimeType);
}

/**
 * Route audio through Supabase Edge Function (production path).
 */
async function transcribeViaEdgeFunction(
  audioBlob: Blob,
  mimeType: string
): Promise<DeepgramResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated — sign in to transcribe');
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/transcribe`;

  const arrayBuffer = await audioBlob.arrayBuffer();

  const edgeResponse = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': mimeType,
    },
    body: arrayBuffer,
  });

  if (!edgeResponse.ok) {
    const errBody = await edgeResponse.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(
      `Transcription failed: ${(errBody as Record<string, string>).error ?? edgeResponse.statusText}`
    );
  }

  return edgeResponse.json() as Promise<DeepgramResult>;
}

/**
 * Direct Deepgram API call (development only — API key on device).
 */
async function transcribeDirectly(
  audioBlob: Blob,
  mimeType: string
): Promise<DeepgramResult> {
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

  const dgResponse = await fetch(`${DEEPGRAM_URL}?${params.toString()}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': mimeType,
    },
    body: audioBlob,
  });

  if (!dgResponse.ok) {
    const err: DeepgramError = await dgResponse.json();
    throw new Error(`Deepgram error: ${err.message || err.error}`);
  }

  const data = await dgResponse.json();
  return parseDeepgramResponse(data);
}

function parseDeepgramResponse(data: unknown): DeepgramResult {
  const d = data as Record<string, unknown>;
  const results = d?.results as Record<string, unknown>;
  const channels = results?.channels as Array<Record<string, unknown>>;
  const channel = channels?.[0];
  const alternatives = channel?.alternatives as Array<Record<string, unknown>>;
  const alt = alternatives?.[0];

  const transcript = (alt?.transcript as string) ?? '';
  const words = (alt?.words as TranscriptWord[]) ?? [];
  const metadata = d?.metadata as Record<string, unknown>;
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

/**
 * Format a transcript segment's speaker label.
 */
export function speakerLabel(speakerId: number): string {
  if (speakerId === 0) return 'Coach';
  if (speakerId === 1) return 'Player';
  return `Speaker ${speakerId + 1}`;
}

/**
 * Format seconds to MM:SS timestamp string.
 */
export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
