/**
 * Record tab — the core coach workflow.
 *
 * Flow: pick player → start recording → live transcription + swing detection
 *       → stop → review + edit → save session → share QR
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
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

type RecordStep = 'setup' | 'recording' | 'transcribing' | 'review';

export default function RecordScreen() {
  const router = useRouter();
  const { coach } = useAuth();
  const recording = useRecording();

  const [step, setStep] = useState<RecordStep>('setup');
  const [sessionType, setSessionType] = useState<SessionType>('full-swing');
  const [focus, setFocus] = useState('');
  const [playerQuery, setPlayerQuery] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');
  const [transcript, setTranscript] = useState<DeepgramResult | null>(null);
  const [saving, setSaving] = useState(false);

  // Request mic permission on mount
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

    setStep('transcribing');

    try {
      const result = await transcribeAudio(fileUri);
      setTranscript(result);
    } catch (err) {
      // Transcription optional — continue to review even if it fails
      console.warn('Transcription failed:', err);
    } finally {
      setStep('review');
    }
  }

  async function handleSave(): Promise<void> {
    if (!coach?.id) return;
    setSaving(true);

    const now = new Date();
    const { data, error } = await supabase.from('coaching_sessions').insert({
      player_id: selectedPlayerId ?? '',
      coach_id: coach.id,
      date: now.toISOString().split('T')[0],
      duration_min: transcript
        ? Math.round(transcript.duration_seconds / 60)
        : Math.round(recording.state.durationMs / 60000),
      type: sessionType,
      status: 'completed',
      focus: focus || null,
      transcript: transcript?.transcript ?? null,
      transcript_segments: transcript?.segments ?? [],
      coaching_cues: [],
      drills: [],
      key_changes: [],
    }).select('id').single();

    setSaving(false);

    if (error) {
      Alert.alert('Save failed', error.message);
      return;
    }

    // Navigate to session detail where coach can add drills, notes, and share
    router.replace(`/session/${data.id}`);
  }

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

  if (step === 'transcribing') return (
    <View style={styles.centeredContainer}>
      <Text style={styles.transcribingTitle}>Transcribing lesson...</Text>
      <Text style={styles.transcribingSubtitle}>Deepgram Nova-2 · Speaker diarization</Text>
    </View>
  );

  return (
    <ReviewView
      transcript={transcript}
      swingCount={recording.swings.length}
      durationLabel={recording.durationLabel}
      playerName={selectedPlayerName}
      sessionType={sessionType}
      saving={saving}
      onSave={handleSave}
      onDiscard={() => {
        recording.discard();
        setTranscript(null);
        setStep('setup');
      }}
    />
  );
}

// ─── Sub-views ──────────────────────────────────────────────────────────────

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
        Recording will transcribe automatically with speaker diarization
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
  // Normalize metering from -60..0 to 0..1
  const level = Math.max(0, Math.min(1, (metering + 60) / 60));

  return (
    <View style={styles.recordingContainer}>
      {/* Duration */}
      <Text style={styles.durationLabel}>{durationLabel}</Text>
      <Text style={styles.recordingStatus}>Recording</Text>

      {/* Audio level visualizer */}
      <View style={styles.meteringBar}>
        <View style={[styles.meteringFill, { width: `${Math.round(level * 100)}%` }]} />
      </View>

      {/* Swing counter */}
      <View style={styles.swingCounter}>
        <Text style={styles.swingCountNumber}>{swingCount}</Text>
        <Text style={styles.swingCountLabel}>swings detected</Text>
      </View>

      {/* Controls */}
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

function ReviewView({
  transcript, swingCount, durationLabel, playerName, sessionType,
  saving, onSave, onDiscard,
}: {
  transcript: DeepgramResult | null;
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

      {/* Transcript */}
      {transcript ? (
        <View style={styles.transcriptSection}>
          <Text style={styles.fieldLabel}>Transcript</Text>
          {transcript.segments.map((seg, i) => (
            <View key={i} style={styles.transcriptSegment}>
              <Text style={styles.transcriptSpeaker}>
                {seg.speaker === 0 ? 'Coach' : 'Player'} · {formatSecs(seg.start)}
              </Text>
              <Text style={styles.transcriptText}>{seg.transcript}</Text>
            </View>
          ))}
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

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

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
  clearBtnText: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
  },
  searchResult: {
    backgroundColor: '#1E2A36',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 2,
  },
  searchResultText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#E8ECF1',
  },
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
  typeChipActive: {
    backgroundColor: '#0FA87A22',
    borderColor: '#10B981',
  },
  typeChipText: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
  },
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
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  startBtnText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  setupNote: {
    fontFamily: 'DMSans',
    fontSize: 12,
    color: '#5E6E7E',
    textAlign: 'center',
  },
  // Recording view
  recordingContainer: {
    flex: 1,
    backgroundColor: '#0C1117',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  durationLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 64,
    color: '#E8ECF1',
    letterSpacing: -2,
  },
  recordingStatus: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#C93B3B',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  meteringBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#2A3A4A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  meteringFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  swingCounter: { alignItems: 'center', gap: 4 },
  swingCountNumber: {
    fontFamily: 'SpaceMono',
    fontSize: 48,
    color: '#E8ECF1',
  },
  swingCountLabel: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
  },
  recordingControls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  discardBtn: {
    flex: 1,
    backgroundColor: '#1E2A36',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  discardBtnText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#8B99A8',
    fontWeight: '600',
  },
  stopBtn: {
    flex: 2,
    backgroundColor: '#C93B3B',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stopSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  stopBtnText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Transcribing view
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0C1117',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  transcribingTitle: {
    fontFamily: 'DMSans',
    fontSize: 20,
    fontWeight: '700',
    color: '#E8ECF1',
  },
  transcribingSubtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#5E6E7E',
  },
  // Review view
  summaryCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    gap: 6,
  },
  summaryPlayerName: {
    fontFamily: 'DMSans',
    fontSize: 18,
    fontWeight: '700',
    color: '#E8ECF1',
  },
  summaryMeta: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
  },
  transcriptSection: { gap: 12 },
  transcriptSegment: {
    backgroundColor: '#151D28',
    borderRadius: 6,
    padding: 12,
    gap: 4,
  },
  transcriptSpeaker: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#5E6E7E',
  },
  transcriptText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#E8ECF1',
    lineHeight: 20,
  },
  noTranscriptCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3A4A',
  },
  noTranscriptText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#5E6E7E',
  },
  reviewActions: { gap: 12 },
  saveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1117',
  },
  discardReviewBtn: { alignItems: 'center', paddingVertical: 8 },
  discardReviewBtnText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
  },
});
