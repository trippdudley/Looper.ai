/**
 * Session detail screen.
 * Loaded after a session is saved. Coach can:
 *   - Review transcript
 *   - Add drills, coaching cues, key changes
 *   - Generate a shareable QR code for the player
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-qr-code';
import { supabase } from '@/services/supabase';
import { SESSION_TYPE_LABELS } from '@looper/shared';
import type { Database } from '@/services/supabase';

type SessionRow = Database['public']['Tables']['coaching_sessions']['Row'] & {
  players?: { name: string } | null;
};

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://looper.ai';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [newCue, setNewCue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSession();
  }, [id]);

  async function loadSession(): Promise<void> {
    if (!id) return;
    const { data } = await supabase
      .from('coaching_sessions')
      .select('*, players!inner(name)')
      .eq('id', id)
      .single();
    setSession(data);
    setLoading(false);
  }

  async function generateShareToken(): Promise<string> {
    if (session?.share_token) return session.share_token;

    // Cryptographically secure random token (16 hex chars)
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    await supabase
      .from('coaching_sessions')
      .update({ share_token: token })
      .eq('id', id!);

    setSession((prev) => prev ? { ...prev, share_token: token } : null);
    return token;
  }

  async function handleShare(): Promise<void> {
    try {
      const token = await generateShareToken();
      const url = `${WEB_BASE_URL}/lesson/${token}`;

      await Share.share({
        message: `Your lesson summary from today — ${url}`,
        url,
        title: 'Lesson Summary',
      });
    } catch (err) {
      Alert.alert('Share failed', err instanceof Error ? err.message : 'Try again');
    }
  }

  async function addCoachingCue(): Promise<void> {
    if (!newCue.trim() || !session) return;
    setSaving(true);

    const updatedCues = [...(session.coaching_cues ?? []), newCue.trim()];
    const { error } = await supabase
      .from('coaching_sessions')
      .update({ coaching_cues: updatedCues })
      .eq('id', id!);

    if (!error) {
      setSession((prev) => prev ? { ...prev, coaching_cues: updatedCues } : null);
      setNewCue('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading session...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Session not found</Text>
      </View>
    );
  }

  const playerName = (session.players as { name: string } | null)?.name ?? 'Unknown';
  const shareUrl = session.share_token ? `${WEB_BASE_URL}/lesson/${session.share_token}` : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Session title */}
      <View style={styles.titleArea}>
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.sessionMeta}>
          {SESSION_TYPE_LABELS[session.type] ?? session.type} · {session.date}
          {session.duration_min ? ` · ${session.duration_min}m` : ''}
        </Text>
      </View>

      {/* Share QR */}
      <View style={styles.shareCard}>
        <View style={styles.shareCardHeader}>
          <Text style={styles.shareCardTitle}>Share with Player</Text>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareBtnText}>Share Link</Text>
          </TouchableOpacity>
        </View>

        {showQR && shareUrl ? (
          <View style={styles.qrContainer}>
            <QRCode
              value={shareUrl}
              size={200}
              bgColor="#151D28"
              fgColor="#E8ECF1"
            />
            <Text style={styles.qrUrl}>{shareUrl}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.showQRBtn}
            onPress={async () => {
              await generateShareToken();
              setShowQR(true);
            }}
          >
            <Text style={styles.showQRBtnText}>Show QR Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Coaching cues */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coaching Cues</Text>
        {(session.coaching_cues ?? []).map((cue, i) => (
          <View key={i} style={styles.cueRow}>
            <View style={styles.cueBullet} />
            <Text style={styles.cueText}>{cue}</Text>
          </View>
        ))}
        <View style={styles.addCueRow}>
          <TextInput
            style={styles.addCueInput}
            value={newCue}
            onChangeText={setNewCue}
            placeholder="Add a coaching cue..."
            placeholderTextColor="#5E6E7E"
            returnKeyType="done"
            onSubmitEditing={addCoachingCue}
          />
          <TouchableOpacity
            style={[styles.addCueBtn, !newCue.trim() && styles.addCueBtnDisabled]}
            onPress={addCoachingCue}
            disabled={!newCue.trim() || saving}
          >
            <Text style={styles.addCueBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transcript */}
      {session.transcript && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transcript</Text>
          {parseSegments(session.transcript_segments).map((seg, i) => (
            <View key={i} style={styles.transcriptSeg}>
              <Text style={styles.transcriptSpeaker}>
                {seg.speaker === 0 ? 'Coach' : 'Player'} · {formatSecs(seg.start)}
              </Text>
              <Text style={styles.transcriptText}>{seg.transcript}</Text>
            </View>
          ))}
          {parseSegments(session.transcript_segments).length === 0 && (
            <Text style={styles.transcriptFull}>{session.transcript}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function parseSegments(raw: unknown): Array<{ start: number; speaker: number; transcript: string }> {
  if (!Array.isArray(raw)) return [];
  return raw as Array<{ start: number; speaker: number; transcript: string }>;
}

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  content: { paddingHorizontal: 20, paddingBottom: 60, gap: 24 },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0C1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#8B99A8',
  },
  header: {
    paddingTop: 56,
    alignItems: 'flex-end',
  },
  backBtn: { paddingVertical: 8 },
  backBtnText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  titleArea: { gap: 6 },
  playerName: {
    fontFamily: 'DMSans',
    fontSize: 28,
    fontWeight: '700',
    color: '#E8ECF1',
    letterSpacing: -0.3,
  },
  sessionMeta: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
  },
  shareCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    gap: 16,
  },
  shareCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareCardTitle: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '700',
    color: '#E8ECF1',
  },
  shareBtn: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shareBtnText: {
    fontFamily: 'DMSans',
    fontSize: 13,
    fontWeight: '700',
    color: '#0C1117',
  },
  qrContainer: { alignItems: 'center', gap: 12 },
  qrUrl: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#5E6E7E',
    textAlign: 'center',
  },
  showQRBtn: { alignItems: 'center', paddingVertical: 8 },
  showQRBtnText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
  },
  section: { gap: 12 },
  sectionTitle: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#151D28',
    borderRadius: 6,
    padding: 12,
  },
  cueBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginTop: 5,
    flexShrink: 0,
  },
  cueText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#E8ECF1',
    flex: 1,
    lineHeight: 20,
  },
  addCueRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addCueInput: {
    flex: 1,
    backgroundColor: '#151D28',
    borderWidth: 1,
    borderColor: '#2A3A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#E8ECF1',
  },
  addCueBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCueBtnDisabled: { backgroundColor: '#2A3A4A' },
  addCueBtnText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1117',
  },
  transcriptSeg: {
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
  transcriptFull: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#E8ECF1',
    lineHeight: 22,
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 14,
  },
});
