/**
 * Today screen — coach's daily command center.
 * Shows: today's session schedule, recent activity, quick actions.
 */
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useSessions } from '@/hooks/useSessions';
import { SESSION_TYPE_LABELS } from '@looper/shared';
import type { SessionListItem } from '@looper/shared';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function SessionCard({ session }: { session: SessionListItem }) {
  const router = useRouter();
  const isActive = session.status === 'active';
  const isCompleted = session.status === 'completed';

  return (
    <TouchableOpacity
      style={[styles.sessionCard, isActive && styles.sessionCardActive]}
      onPress={() => router.push(`/session/${session.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.sessionCardRow}>
        <View style={styles.sessionCardLeft}>
          <Text style={styles.sessionPlayerName}>{session.player_name}</Text>
          <Text style={styles.sessionMeta}>
            {SESSION_TYPE_LABELS[session.type] ?? session.type}
            {session.focus ? ` · ${session.focus}` : ''}
          </Text>
        </View>
        <View style={styles.sessionCardRight}>
          {isActive && (
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
          {isCompleted && session.duration_min && (
            <Text style={styles.durationText}>{session.duration_min}m</Text>
          )}
          {!isActive && !isCompleted && (
            <Text style={styles.scheduledText}>Scheduled</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TodayScreen() {
  const router = useRouter();
  const { coach } = useAuth();
  const { sessions, todaySessions, loading, refresh } = useSessions(coach?.id ?? null);

  const today = new Date().toISOString().split('T')[0];
  const pastSessions = sessions.filter((s) => s.date < today && s.status === 'completed');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#10B981" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {coach?.name?.split(' ')[0] ?? 'Coach'}
          </Text>
          <Text style={styles.dateLabel}>{formatDate(today)}</Text>
        </View>
        <TouchableOpacity
          style={styles.newSessionBtn}
          onPress={() => router.push('/session/new')}
          activeOpacity={0.8}
        >
          <Text style={styles.newSessionBtnText}>New Session</Text>
        </TouchableOpacity>
      </View>

      {/* Today's sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        {todaySessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sessions scheduled</Text>
            <TouchableOpacity
              style={styles.startRecordingBtn}
              onPress={() => router.push('/(tabs)/record')}
            >
              <Text style={styles.startRecordingText}>Start recording a lesson</Text>
            </TouchableOpacity>
          </View>
        ) : (
          todaySessions.map((s) => <SessionCard key={s.id} session={s} />)
        )}
      </View>

      {/* Recent sessions */}
      {pastSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {pastSessions.slice(0, 5).map((s) => <SessionCard key={s.id} session={s} />)}
        </View>
      )}
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'DMSans',
    fontSize: 24,
    fontWeight: '700',
    color: '#E8ECF1',
    letterSpacing: -0.3,
  },
  dateLabel: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
    marginTop: 4,
  },
  newSessionBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  newSessionBtnText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1117',
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sessionCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2A3A4A',
  },
  sessionCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#101F1A',
  },
  sessionCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCardLeft: { flex: 1, gap: 4 },
  sessionCardRight: { marginLeft: 12 },
  sessionPlayerName: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '600',
    color: '#E8ECF1',
  },
  sessionMeta: {
    fontFamily: 'DMSans',
    fontSize: 12,
    color: '#8B99A8',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0FA87A22',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  durationText: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    color: '#8B99A8',
  },
  scheduledText: {
    fontFamily: 'DMSans',
    fontSize: 12,
    color: '#5E6E7E',
  },
  emptyState: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3A4A',
    gap: 12,
  },
  emptyText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#5E6E7E',
  },
  startRecordingBtn: { paddingVertical: 4 },
  startRecordingText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});
