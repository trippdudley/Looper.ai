/**
 * Record tab — the core coach workflow.
 *
 * Flow: pick player → start recording → stop → upload audio to Storage
 *       → Deepgram transcription → Claude structuring → review → save → QR share
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useRecording } from '@/hooks/useRecording';
import { transcribeAudio } from '@/services/deepgram';
import { supabase } from '@/services/supabase';
import { SESSION_TYPES, SESSION_TYPE_LABELS } from '@looper/shared';
import type { DeepgramResult } from '@/services/deepgram';
import type { SessionType } from '@looper/shared';

// ── Types ────────────────────────────────────────────────────────────────────

type RecordStep = 'setup' | 'recording' | 'processing' | 'review';

interface StructuredNotes {
  summary: string;
  focus: string;
  coaching_cues: string[];
  drills: Array<{
    name: string;
    type: string;
    description: string;
    reps: string;
    focus: string;
  }>;
  key_changes: Array<{
    area: string;
    from: string;
    to: string;
    rationale: string;
  }>;
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function RecordScreen() {
  const router = useRouter();
  const { coach } = useAuth();
  const recording = useRecording();

  const [step, setStep] = useState<RecordStep>('setup');
  const [processingLabel, setProcessingLabel] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('full-swing');
  const [focus, setFocus] = useState('');
  const [playerQuery, setPlayerQuery] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');
  const [transcript, setTranscript] = useState<DeepgramResult | null>(null);
  const [structured, setStructured] = useState<StructuredNotes | null>(null);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    recording.requestPermission();
  }, []);

  async function handleStartRecording(): Promise<void> {
    try {
      await recording.start();
      setStep('recording');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      Alert.alert('Recording error', err instanceof Error ? err.message : 'Failed to start');
    }
  }

  async function handleStopRecording(): Promise<void> {
    const fileUri = await recording.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (!fileUri) {
      setStep('review');
      return;
    }

    setStep('processing');

    // ── Step 1: Upload audio to Storage ─────────────────────────────
    setProcessingLabel('Uploading recording...');
    let storagePath: string | null = null;
    try {
      storagePath = await uploadAudio(fileUri, coach?.id ?? 'unknown');
      setAudioFilePath(storagePath);
    } catch (err) {
      console.warn('Audio upload failed (non-fatal):', err);
    }

    // ── Step 2: Transcribe with Deepgram ─────────────────────────────
    setProcessingLabel('Transcribing with Deepgram Nova-2...');
    let transcriptResult: DeepgramResult | null = null;
    try {
      transcriptResult = await transcribeAudio(fileUri);
      setTranscript(transcriptResult);
    } catch (err) {
      console.warn('Transcription failed:', err);
    }

    // ── Step 3: Structure with Claude ────────────────────────────────
    if (transcriptResult && transcriptResult.transcript.length > 20) {
      setProcessingLabel('Structuring with Looper AI...');
      try {
        const notes = await structureSession({
          transcript: transcriptResult.transcript,
          segments: transcriptResult.segments,
          sessionType,
          focus,
          playerName: selectedPlayerName,
          durationSeconds: transcriptResult.duration_seconds,
        });
        setStructured(notes);
      } catch (err) {
        console.warn('AI structuring failed (non-fatal):', err);
      }
    }

    setStep('review');
  }

  async function handleSave(): Promise<void> {
    if (!coach?.id) return;
    setSaving(true);

    const now = new Date();
    const durationMin = transcript
      ? Math.round(transcript.duration_seconds / 60)
      : Math.round(recording.state.durationMs / 60000);

    const { data, error } = await supabase.from('coaching_sessions').insert({
      player_id: selectedPlayerId ?? '',
      coach_id: coach.id,
      date: now.toISOString().split('T')[0],
      duration_min: durationMin,
      type: sessionType,
      status: 'completed',
      focus: structured?.focus ?? focus ?? null,
      summary: structured?.summary ?? null,
      transcript: transcript?.transcript ?? null,
      transcript_segments: transcript?.segments ?? [],
      coaching_cues: structured?.coaching_cues ?? [],
      drills: structured?.drills ?? [],
      key_changes: structured?.key_changes ?? [],
      audio_file_path: audioFilePath,
    }).select('id').single();

    setSaving(false);

    if (error) {
      Alert.alert('Save failed', error.message);
      return;
    }

    router.replace(`/session/${data.id}`);
  }

  // ── Views ──────────────────────────────────────────────────────────

  if (step === 'setup') return (
    <SetupView
      sessionType={sessionType}
      onSessionTypeChange={setSessionType}
      focus={focus}
      onFocusChange={setFocus}
      playerQuery={playerQuery}
      onPlayerQueryChange={setPlayerQuery}
      selectedPlayerName={selectedPlayerName}
      coachId={coach?.id ?? null}
      onPlayerSelect={(id, name) => {
        setSelectedPlayerId(id);
        setSelectedPlayerName(name);
      }}
      onStart={handleStartRecording}
    />
  );

  if (step === 'recording') return (
    <RecordingView
      durationLabel={recording.durationLabel}
      metering={recording.state.metering ?? -60}
      swingCount={recording.swings.length}
      onStop={handleStopRecording}
      onDiscard={async () => {
        await recording.discard();
        setStep('setup');
      }}
    />
  );

  if (step === 'processing') return (
    <ProcessingView label={processingLabel} />
  );

  return (
    <ReviewView
      transcript={transcript}
      structured={structured}
      swingCount={recording.swings.length}
      durationLabel={recording.durationLabel}
      playerName={selectedPlayerName}
      sessionType={sessionType}
      saving={saving}
      onSave={handleSave}
      onDiscard={() => {
        recording.discard();
        setTranscript(null);
        setStructured(null);
        setAudioFilePath(null);
        setStep('setup');
      }}
    />
  );
}

// ── Services ─────────────────────────────────────────────────────────────────

async function uploadAudio(fileUri: string, coachId: string): Promise<string> {
  const date = new Date().toISOString().split('T')[0];
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${coachId}/${date}-${rand}.m4a`;

  const response = await fetch(fileUri);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from('lesson-audio')
    .upload(path, uint8, {
      contentType: 'audio/m4a',
      upsert: false,
    });

  if (error) throw new Error(error.message);
  return path;
}

async function structureSession(input: {
  transcript: string;
  segments: DeepgramResult['segments'];
  sessionType: string;
  focus: string;
  playerName: string;
  durationSeconds: number;
}): Promise<StructuredNotes> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const url = `${supabaseUrl}/functions/v1/structure-session`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript: input.transcript,
      segments: input.segments,
      session_type: input.sessionType,
      focus: input.focus,
      player_name: input.playerName,
      duration_seconds: input.durationSeconds,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error: string };
    throw new Error(err.error ?? res.statusText);
  }

  return res.json() as Promise<StructuredNotes>;
}

// ── Sub-views ─────────────────────────────────────────────────────────────────

function SetupView({
  sessionType, onSessionTypeChange, focus, onFocusChange,
  playerQuery, onPlayerQueryChange, selectedPlayerName,
  coachId, onPlayerSelect, onStart,
}: {
  sessionType: SessionType;
  onSessionTypeChange: (t: SessionType) => void;
  focus: string;
  onFocusChange: (f: string) => void;
  playerQuery: string;
  onPlayerQueryChange: (q: string) => void;
  selectedPlayerName: string;
  coachId: string | null;
  onPlayerSelect: (id: string, name: string) => void;
  onStart: () => void;
}) {
  const [playerResults, setPlayerResults] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (!playerQuery.trim() || !coachId) {
      setPlayerResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('players')
        .select('id, name')
        .ilike('name', `%${playerQuery}%`)
        .limit(5);
      setPlayerResults(data ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [playerQuery, coachId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.setupContent}>
      <Text style={styles.screenTitle}>New Session</Text>

      {/* Player search */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Player</Text>
        {selectedPlayerName ? (
          <View style={styles.selectedPlayer}>
            <Text style={styles.selectedPlayerName}>{selectedPlayerName}</Text>
            <TouchableOpacity onPress={() => onPlayerSelect('', '')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={playerQuery}
              onChangeText={onPlayerQueryChange}
              placeholder="Search player by name..."
              placeholderTextColor="#5E6E7E"
            />
            {playerResults.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.searchResult}
                onPress={() => {
                  onPlayerSelect(p.id, p.name);
                  onPlayerQueryChange('');
                }}
              >
                <Text style={styles.searchResultText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      {/* Session type */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Session Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScrollView}>
          {SESSION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, sessionType === type && styles.typeChipActive]}
              onPress={() => onSessionTypeChange(type)}
            >
              <Text style={[styles.typeChipText, sessionType === type && styles.typeChipTextActive]}>
                {SESSION_TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Focus area */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Focus (optional)</Text>
        <TextInput
          style={styles.input}
          value={focus}
          onChangeText={onFocusChange}
          placeholder="e.g. Driver distance, wedge consistency..."
          placeholderTextColor="#5E6E7E"
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.startBtn, !selectedPlayerName && styles.startBtnDisabled]}
        onPress={onStart}
        disabled={!selectedPlayerName}
        activeOpacity={0.8}
      >
        <View style={styles.recDot} />
        <Text style={styles.startBtnText}>Start Recording</Text>
      </TouchableOpacity>

      <Text style={styles.setupNote}>
        Recording transcribes automatically · AI structures coaching notes
      </Text>
    </ScrollView>
  );
}

function RecordingView({
  durationLabel, metering, swingCount, onStop, onDiscard,
}: {
  durationLabel: string;
  metering: number;
  swingCount: number;
  onStop: () => void;
  onDiscard: () => void;
}) {
  const level = Math.max(0, Math.min(1, (metering + 60) / 60));

  return (
    <View style={styles.recordingContainer}>
      <Text style={styles.durationLabel}>{durationLabel}</Text>
      <Text style={styles.recordingStatus}>Recording</Text>

      <View style={styles.meteringBar}>
        <View style={[styles.meteringFill, { width: `${level * 100}%` as `${number}%` }]} />
      </View>

      <View style={styles.swingCounter}>
        <Text style={styles.swingCountNumber}>{swingCount}</Text>
        <Text style={styles.swingCountLabel}>swings detected</Text>
      </View>

      <View style={styles.recordingControls}>
        <TouchableOpacity style={styles.discardBtn} onPress={onDiscard} activeOpacity={0.8}>
          <Text style={styles.discardBtnText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopBtn} onPress={onStop} activeOpacity={0.8}>
          <View style={styles.stopSquare} />
          <Text style={styles.stopBtnText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProcessingView({ label }: { label: string }) {
  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.processingTitle}>Processing lesson...</Text>
      <Text style={styles.processingLabel}>{label}</Text>
    </View>
  );
}

function ReviewView({
  transcript, structured, swingCount, durationLabel, playerName, sessionType,
  saving, onSave, onDiscard,
}: {
  transcript: DeepgramResult | null;
  structured: StructuredNotes | null;
  swingCount: number;
  durationLabel: string;
  playerName: string;
  sessionType: SessionType;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.reviewContent}>
      <Text style={styles.screenTitle}>Review</Text>

      {/* Session summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryPlayerName}>{playerName || 'Anonymous'}</Text>
        <Text style={styles.summaryMeta}>
          {SESSION_TYPE_LABELS[sessionType]} · {durationLabel}
          {swingCount > 0 ? ` · ${swingCount} swings` : ''}
        </Text>
      </View>

      {/* AI Summary */}
      {structured?.summary ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.fieldLabel}>AI Summary</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>Looper AI</Text>
            </View>
          </View>
          <View style={styles.summaryTextCard}>
            <Text style={styles.summaryText}>{structured.summary}</Text>
          </View>
        </View>
      ) : null}

      {/* Coaching cues */}
      {structured?.coaching_cues && structured.coaching_cues.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Coaching Cues</Text>
          {structured.coaching_cues.map((cue, i) => (
            <View key={i} style={styles.cueRow}>
              <View style={styles.cueBullet} />
              <Text style={styles.cueText}>{cue}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Drills */}
      {structured?.drills && structured.drills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Drills</Text>
          {structured.drills.map((drill, i) => (
            <View key={i} style={styles.drillCard}>
              <View style={styles.drillHeader}>
                <Text style={styles.drillName}>{drill.name}</Text>
                <View style={[styles.drillTypeBadge, drillTypeStyle(drill.type)]}>
                  <Text style={styles.drillTypeBadgeText}>{drill.type}</Text>
                </View>
              </View>
              <Text style={styles.drillDesc}>{drill.description}</Text>
              {drill.reps ? <Text style={styles.drillReps}>{drill.reps}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Transcript */}
      {transcript ? (
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Transcript</Text>
          {transcript.segments.map((seg, i) => (
            <View key={i} style={styles.transcriptSegment}>
              <Text style={styles.transcriptSpeaker}>
                {seg.speaker === 0 ? 'Coach' : 'Player'} · {formatSecs(seg.start)}
              </Text>
              <Text style={styles.transcriptText}>{seg.transcript}</Text>
            </View>
          ))}
          {transcript.segments.length === 0 && (
            <View style={styles.noTranscriptCard}>
              <Text style={styles.transcriptText}>{transcript.transcript}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noTranscriptCard}>
          <Text style={styles.noTranscriptText}>No transcript available</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.reviewActions}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Session'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardReviewBtn} onPress={onDiscard}>
          <Text style={styles.discardReviewBtnText}>Discard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function drillTypeStyle(type: string): object {
  switch (type) {
    case 'external': return { backgroundColor: '#0FA87A22', borderColor: '#0FA87A' };
    case 'internal': return { backgroundColor: '#D4980B22', borderColor: '#D4980B' };
    case 'constraint': return { backgroundColor: '#5B6EFF22', borderColor: '#5B6EFF' };
    default: return { backgroundColor: '#2A3A4A', borderColor: '#3A4A5A' };
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  setupContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 24 },
  reviewContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 20 },
  screenTitle: {
    fontFamily: 'DMSans',
    fontSize: 28,
    fontWeight: '700',
    color: '#E8ECF1',
    marginBottom: 4,
  },
  fieldGroup: { gap: 10 },
  fieldLabel: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#151D28',
    borderWidth: 1,
    borderColor: '#2A3A4A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#E8ECF1',
  },
  selectedPlayer: {
    backgroundColor: '#151D28',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPlayerName: {
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#E8ECF1',
    fontWeight: '600',
  },
  clearBtn: { paddingVertical: 4 },
  clearBtnText: { fontFamily: 'DMSans', fontSize: 13, color: '#8B99A8' },
  searchResult: {
    backgroundColor: '#1E2A36',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 2,
  },
  searchResultText: { fontFamily: 'DMSans', fontSize: 14, color: '#E8ECF1' },
  typeScrollView: { flexGrow: 0 },
  typeChip: {
    backgroundColor: '#151D28',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2A3A4A',
  },
  typeChipActive: { backgroundColor: '#0FA87A22', borderColor: '#10B981' },
  typeChipText: { fontFamily: 'DMSans', fontSize: 13, color: '#8B99A8' },
  typeChipTextActive: { color: '#10B981', fontWeight: '600' },
  startBtn: {
    backgroundColor: '#C93B3B',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  startBtnDisabled: { opacity: 0.4 },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },
  startBtnText: { fontFamily: 'DMSans', fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  setupNote: { fontFamily: 'DMSans', fontSize: 12, color: '#5E6E7E', textAlign: 'center' },

  // Recording
  recordingContainer: {
    flex: 1,
    backgroundColor: '#0C1117',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  durationLabel: { fontFamily: 'SpaceMono', fontSize: 64, color: '#E8ECF1', letterSpacing: -2 },
  recordingStatus: {
    fontFamily: 'DMSans', fontSize: 14, color: '#C93B3B',
    fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase',
  },
  meteringBar: {
    width: '100%', height: 4, backgroundColor: '#2A3A4A',
    borderRadius: 2, overflow: 'hidden',
  },
  meteringFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  swingCounter: { alignItems: 'center', gap: 4 },
  swingCountNumber: { fontFamily: 'SpaceMono', fontSize: 48, color: '#E8ECF1' },
  swingCountLabel: { fontFamily: 'DMSans', fontSize: 13, color: '#8B99A8' },
  recordingControls: { flexDirection: 'row', gap: 16, marginTop: 24 },
  discardBtn: {
    flex: 1, backgroundColor: '#1E2A36', borderRadius: 8,
    paddingVertical: 14, alignItems: 'center',
  },
  discardBtnText: { fontFamily: 'DMSans', fontSize: 15, color: '#8B99A8', fontWeight: '600' },
  stopBtn: {
    flex: 2, backgroundColor: '#C93B3B', borderRadius: 8, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  stopSquare: { width: 12, height: 12, borderRadius: 2, backgroundColor: '#FFFFFF' },
  stopBtnText: { fontFamily: 'DMSans', fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Processing
  centeredContainer: {
    flex: 1, backgroundColor: '#0C1117',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  processingTitle: { fontFamily: 'DMSans', fontSize: 20, fontWeight: '700', color: '#E8ECF1' },
  processingLabel: { fontFamily: 'SpaceMono', fontSize: 12, color: '#5E6E7E' },

  // Review
  summaryCard: {
    backgroundColor: '#151D28', borderRadius: 8, padding: 16,
    borderWidth: 1, borderColor: '#2A3A4A', gap: 6,
  },
  summaryPlayerName: { fontFamily: 'DMSans', fontSize: 18, fontWeight: '700', color: '#E8ECF1' },
  summaryMeta: { fontFamily: 'DMSans', fontSize: 13, color: '#8B99A8' },
  section: { gap: 10 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiBadge: {
    backgroundColor: '#0FA87A22', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: '#0FA87A',
  },
  aiBadgeText: { fontFamily: 'SpaceMono', fontSize: 10, color: '#0FA87A' },
  summaryTextCard: {
    backgroundColor: '#151D28', borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: '#2A3A4A',
  },
  summaryText: { fontFamily: 'DMSans', fontSize: 14, color: '#E8ECF1', lineHeight: 21 },
  cueRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#151D28', borderRadius: 6, padding: 12,
  },
  cueBullet: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#10B981', marginTop: 5, flexShrink: 0,
  },
  cueText: { fontFamily: 'DMSans', fontSize: 14, color: '#E8ECF1', flex: 1, lineHeight: 20 },
  drillCard: {
    backgroundColor: '#151D28', borderRadius: 6, padding: 12, gap: 6,
    borderWidth: 1, borderColor: '#2A3A4A',
  },
  drillHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  drillName: { fontFamily: 'DMSans', fontSize: 14, fontWeight: '700', color: '#E8ECF1', flex: 1 },
  drillTypeBadge: {
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, alignSelf: 'flex-start',
  },
  drillTypeBadgeText: { fontFamily: 'SpaceMono', fontSize: 10, color: '#8B99A8' },
  drillDesc: { fontFamily: 'DMSans', fontSize: 13, color: '#8B99A8', lineHeight: 18 },
  drillReps: { fontFamily: 'SpaceMono', fontSize: 12, color: '#5E6E7E' },
  transcriptSegment: { backgroundColor: '#151D28', borderRadius: 6, padding: 12, gap: 4 },
  transcriptSpeaker: { fontFamily: 'SpaceMono', fontSize: 11, color: '#5E6E7E' },
  transcriptText: { fontFamily: 'DMSans', fontSize: 14, color: '#E8ECF1', lineHeight: 20 },
  noTranscriptCard: {
    backgroundColor: '#151D28', borderRadius: 8, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#2A3A4A',
  },
  noTranscriptText: { fontFamily: 'DMSans', fontSize: 14, color: '#5E6E7E' },
  reviewActions: { gap: 12 },
  saveBtn: {
    backgroundColor: '#10B981', borderRadius: 8,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: 'DMSans', fontSize: 15, fontWeight: '700', color: '#0C1117' },
  discardReviewBtn: { alignItems: 'center', paddingVertical: 8 },
  discardReviewBtnText: { fontFamily: 'DMSans', fontSize: 14, color: '#8B99A8' },
});
