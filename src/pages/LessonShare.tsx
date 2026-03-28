/**
 * Public lesson share page — /lesson/:token
 *
 * Accessible without authentication. Fetches coaching session by share_token.
 * The coach generates this URL from the native app and shares it as a QR code.
 * The player scans it and sees their lesson summary.
 *
 * Design: dark mode, mobile-first (players will view this on their phone).
 * Max-width 480px centered on desktop.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SessionData {
  id: string;
  date: string;
  type: string;
  duration_min: number | null;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  drills: DrillData[];
  key_changes: KeyChange[];
  transcript_segments: TranscriptSegment[];
  players: { name: string } | null;
  coaches: { name: string; academy: string | null } | null;
}

interface DrillData {
  name: string;
  reps: number | null;
  focus: string;
  success_criteria: string;
  category: string;
}

interface KeyChange {
  metric: string;
  before: string;
  after: string;
  unit: string;
}

interface TranscriptSegment {
  start: number;
  end: number;
  speaker: number;
  transcript: string;
}

const SESSION_TYPE_LABELS: Record<string, string> = {
  'full-swing': 'Full Swing',
  'short-game': 'Short Game',
  'playing-lesson': 'Playing Lesson',
  'assessment': 'Assessment',
  'putting': 'Putting',
  'mental': 'Mental Game',
};

const DRILL_CATEGORY_COLORS: Record<string, string> = {
  external: '#3B82F6',
  internal: '#D4980B',
  constraint: '#8B5CF6',
  physical: '#0FA87A',
};

export default function LessonShare(): React.ReactElement {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid link');
      setLoading(false);
      return;
    }
    loadSession(token);
  }, [token]);

  async function loadSession(shareToken: string): Promise<void> {
    const { data, error: dbError } = await supabase
      .from('coaching_sessions')
      .select(`
        id, date, type, duration_min, focus, summary,
        coaching_cues, drills, key_changes, transcript_segments,
        players(name),
        coaches(name, academy)
      `)
      .eq('share_token', shareToken)
      .single();

    if (dbError || !data) {
      setError('Session not found or this link has expired.');
      setLoading(false);
      return;
    }

    setSession(data as unknown as SessionData);
    setLoading(false);
  }

  if (loading) return <LoadingState />;
  if (error || !session) return <ErrorState message={error ?? 'Something went wrong'} />;

  return <SessionView session={session} />;
}

function SessionView({ session }: { session: SessionData }): React.ReactElement {
  const drills = Array.isArray(session.drills) ? session.drills as DrillData[] : [];
  const keyChanges = Array.isArray(session.key_changes) ? session.key_changes as KeyChange[] : [];
  const segments = Array.isArray(session.transcript_segments) ? session.transcript_segments as TranscriptSegment[] : [];
  const cues = Array.isArray(session.coaching_cues) ? session.coaching_cues : [];

  const playerName = (session.players as { name: string } | null)?.name;
  const coachName = (session.coaches as { name: string; academy: string | null } | null)?.name;
  const academy = (session.coaches as { name: string; academy: string | null } | null)?.academy;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <span style={styles.brandLooper}>Looper</span>
            <span style={styles.brandDivider}> · </span>
            <span style={styles.brandCoach}>Lesson Summary</span>
          </div>
          <div style={styles.sessionDate}>
            {formatDate(session.date)}
          </div>
        </div>

        {/* Session info */}
        <div style={styles.card}>
          {playerName && (
            <div style={styles.playerRow}>
              <div style={styles.playerAvatar}>
                {playerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={styles.playerName}>{playerName}</div>
                {coachName && (
                  <div style={styles.coachLine}>
                    with {coachName}{academy ? ` · ${academy}` : ''}
                  </div>
                )}
              </div>
            </div>
          )}
          <div style={styles.chipRow}>
            <Chip label={SESSION_TYPE_LABELS[session.type] ?? session.type} />
            {session.duration_min && <Chip label={`${session.duration_min} min`} mono />}
            {session.focus && <Chip label={session.focus} accent />}
          </div>
        </div>

        {/* Summary */}
        {session.summary && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Summary</div>
            <div style={styles.card}>
              <p style={styles.summaryText}>{session.summary}</p>
            </div>
          </div>
        )}

        {/* Key changes */}
        {keyChanges.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Key Changes</div>
            {keyChanges.map((kc, i) => (
              <div key={i} style={styles.keyChangeCard}>
                <div style={styles.keyChangeMetric}>{kc.metric}</div>
                <div style={styles.keyChangeValues}>
                  <div style={styles.keyChangeBefore}>
                    <div style={styles.keyChangeValueLabel}>Before</div>
                    <div style={styles.keyChangeValue}>{kc.before} <span style={styles.unit}>{kc.unit}</span></div>
                  </div>
                  <div style={styles.keyChangeArrow}>→</div>
                  <div style={styles.keyChangeAfter}>
                    <div style={styles.keyChangeValueLabel}>After</div>
                    <div style={{ ...styles.keyChangeValue, color: '#10B981' }}>{kc.after} <span style={styles.unit}>{kc.unit}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coaching cues */}
        {cues.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Coaching Cues</div>
            <div style={styles.card}>
              {cues.map((cue, i) => (
                <div key={i} style={styles.cueRow}>
                  <div style={styles.cueBullet} />
                  <div style={styles.cueText}>{cue}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drills */}
        {drills.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Practice Drills</div>
            {drills.map((drill, i) => (
              <div key={i} style={styles.drillCard}>
                <div style={styles.drillHeader}>
                  <div style={styles.drillName}>{drill.name}</div>
                  <div
                    style={{
                      ...styles.drillCategoryChip,
                      backgroundColor: `${DRILL_CATEGORY_COLORS[drill.category] ?? '#8B99A8'}22`,
                      color: DRILL_CATEGORY_COLORS[drill.category] ?? '#8B99A8',
                    }}
                  >
                    {drill.category.charAt(0).toUpperCase() + drill.category.slice(1)}
                  </div>
                </div>
                {drill.reps && (
                  <div style={styles.drillReps}>{drill.reps} reps</div>
                )}
                <div style={styles.drillFocus}>{drill.focus}</div>
                {drill.success_criteria && (
                  <div style={styles.drillCriteria}>
                    <span style={styles.drillCriteriaLabel}>Success: </span>
                    {drill.success_criteria}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Transcript */}
        {segments.length > 0 && (
          <details style={styles.transcriptDetails}>
            <summary style={styles.transcriptSummary}>
              Full Transcript ({segments.length} segments)
            </summary>
            <div style={styles.transcriptContent}>
              {segments.map((seg, i) => (
                <div key={i} style={styles.transcriptSegment}>
                  <div style={styles.transcriptMeta}>
                    {seg.speaker === 0 ? 'Coach' : 'Player'} · {formatSecs(seg.start)}
                  </div>
                  <div style={styles.transcriptText}>{seg.transcript}</div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerBrand}>Looper.AI</div>
          <div style={styles.footerTagline}>AI-native golf coaching</div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  label,
  mono = false,
  accent = false,
}: {
  label: string;
  mono?: boolean;
  accent?: boolean;
}): React.ReactElement {
  return (
    <span style={{
      ...styles.chip,
      fontFamily: mono ? "'Space Mono', monospace" : "'DM Sans', sans-serif",
      backgroundColor: accent ? '#0FA87A22' : '#1E2A36',
      color: accent ? '#10B981' : '#8B99A8',
      borderColor: accent ? '#10B98133' : '#2A3A4A',
    }}>
      {label}
    </span>
  );
}

function LoadingState(): React.ReactElement {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={styles.brandLooper}>Loading lesson...</div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }): React.ReactElement {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#E8ECF1' }}>
          Lesson not found
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#8B99A8', textAlign: 'center' }}>
          {message}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// Inline styles — dark mode, mobile-first, no Tailwind dependency
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0C1117',
    display: 'flex',
    justifyContent: 'center',
    padding: '0',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    padding: '24px 20px 60px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    paddingTop: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  brandRow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    letterSpacing: '0.5px',
  },
  brandLooper: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#10B981',
  },
  brandDivider: {
    color: '#5E6E7E',
  },
  brandCoach: {
    color: '#8B99A8',
    fontWeight: '400',
  },
  sessionDate: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '12px',
    color: '#5E6E7E',
  },
  card: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #2A3A4A',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  playerAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    backgroundColor: '#1E2A36',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#8B99A8',
    flexShrink: 0,
  },
  playerName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '18px',
    fontWeight: '700',
    color: '#E8ECF1',
  },
  coachLine: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#8B99A8',
    marginTop: '2px',
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  chip: {
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  sectionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
  },
  summaryText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: '#E8ECF1',
    lineHeight: '1.6',
    margin: '0',
  },
  keyChangeCard: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    padding: '14px',
    border: '1px solid #2A3A4A',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  keyChangeMetric: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    color: '#E8ECF1',
  },
  keyChangeValues: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  keyChangeBefore: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  keyChangeAfter: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  keyChangeArrow: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '16px',
    color: '#5E6E7E',
  },
  keyChangeValueLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    color: '#5E6E7E',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  keyChangeValue: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '18px',
    color: '#E8ECF1',
  },
  unit: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    color: '#5E6E7E',
  },
  cueRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #1E2A36',
  },
  cueBullet: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#10B981',
    marginTop: '6px',
    flexShrink: 0,
  },
  cueText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: '#E8ECF1',
    lineHeight: '1.5',
  },
  drillCard: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    padding: '14px',
    border: '1px solid #2A3A4A',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '8px',
  },
  drillHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  drillName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '700',
    color: '#E8ECF1',
    flex: 1,
  },
  drillCategoryChip: {
    fontSize: '11px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '20px',
    letterSpacing: '0.3px',
    flexShrink: 0,
  },
  drillReps: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    color: '#8B99A8',
  },
  drillFocus: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#8B99A8',
  },
  drillCriteria: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#8B99A8',
    backgroundColor: '#1E2A36',
    borderRadius: '6px',
    padding: '8px 10px',
    lineHeight: '1.5',
  },
  drillCriteriaLabel: {
    color: '#0FA87A',
    fontWeight: '600',
  },
  transcriptDetails: {
    border: '1px solid #2A3A4A',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  transcriptSummary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#8B99A8',
    padding: '14px 16px',
    cursor: 'pointer',
    backgroundColor: '#151D28',
    listStyle: 'none',
  },
  transcriptContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px 16px 16px',
  },
  transcriptSegment: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  transcriptMeta: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#5E6E7E',
  },
  transcriptText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#E8ECF1',
    lineHeight: '1.6',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    paddingTop: '20px',
    borderTop: '1px solid #1E2A36',
  },
  footerBrand: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#10B981',
  },
  footerTagline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    color: '#5E6E7E',
  },
} as const;
