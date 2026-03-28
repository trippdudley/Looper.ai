/**
 * LessonShare — public page at /lesson/:token
 *
 * Players scan the QR code the coach shows them. This page:
 *  1. Loads the session by share_token (RLS allows public read on share_token)
 *  2. Shows coaching cues, drills, key changes, and transcript
 *  3. Offers a claim prompt so the player can link this to their account
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SessionData {
  id: string;
  date: string;
  type: string;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  drills: DrillItem[];
  key_changes: string[];
  transcript: string | null;
  transcript_segments: TranscriptSegment[];
  players?: { name: string } | null;
}

interface DrillItem {
  name: string;
  reps?: string | number;
  focus?: string;
  success_criteria?: string;
  category?: string;
}

interface TranscriptSegment {
  start: number;
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

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function LessonShare() {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadSession(token);
  }, [token]);

  async function loadSession(shareToken: string): Promise<void> {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('*, players(name)')
      .eq('share_token', shareToken)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setSession(data as unknown as SessionData);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingPulse} />
          <div style={{ ...styles.loadingPulse, width: '60%' }} />
          <div style={{ ...styles.loadingPulse, width: '80%' }} />
        </div>
      </div>
    );
  }

  if (notFound || !session) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.logo}>Looper</div>
          <div style={styles.errorCard}>
            <p style={styles.errorTitle}>Session not found</p>
            <p style={styles.errorSubtitle}>
              This link may have expired or the session was removed. Ask your coach to share it again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const playerName = (session.players as { name: string } | null)?.name ?? 'Your lesson';
  const drills: DrillItem[] = Array.isArray(session.drills) ? session.drills as DrillItem[] : [];
  const keyChanges: string[] = Array.isArray(session.key_changes) ? session.key_changes as string[] : [];
  const segments: TranscriptSegment[] = Array.isArray(session.transcript_segments)
    ? session.transcript_segments as TranscriptSegment[]
    : [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.logo}>Looper</span>
          <span style={styles.badgeCoach}>Coach Summary</span>
        </div>

        {/* Session title */}
        <div style={styles.titleBlock}>
          <h1 style={styles.playerName}>{playerName}</h1>
          <p style={styles.sessionMeta}>
            {SESSION_TYPE_LABELS[session.type] ?? session.type}
            {session.focus ? ` · ${session.focus}` : ''}
            {' · '}{formatDate(session.date)}
          </p>
          {session.summary && (
            <p style={styles.summary}>{session.summary}</p>
          )}
        </div>

        {/* Coaching cues */}
        {session.coaching_cues?.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Coaching Cues</h2>
            <div style={styles.card}>
              {session.coaching_cues.map((cue, i) => (
                <div key={i} style={styles.cueRow}>
                  <span style={styles.cueBullet} />
                  <span style={styles.cueText}>{cue}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key changes */}
        {keyChanges.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Key Changes</h2>
            <div style={styles.card}>
              {keyChanges.map((change, i) => (
                <div key={i} style={styles.cueRow}>
                  <span style={{ ...styles.cueBullet, backgroundColor: '#D4980B' }} />
                  <span style={styles.cueText}>{change}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Drills */}
        {drills.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Practice Drills</h2>
            {drills.map((drill, i) => (
              <div key={i} style={styles.drillCard}>
                <div style={styles.drillHeader}>
                  <span style={styles.drillName}>{drill.name}</span>
                  {drill.category && (
                    <span style={styles.drillBadge}>{drill.category}</span>
                  )}
                </div>
                {drill.reps && (
                  <p style={styles.drillDetail}>Reps: {drill.reps}</p>
                )}
                {drill.focus && (
                  <p style={styles.drillDetail}>Focus: {drill.focus}</p>
                )}
                {drill.success_criteria && (
                  <p style={styles.drillSuccess}>Goal: {drill.success_criteria}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Transcript */}
        {segments.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Lesson Transcript</h2>
            <div style={styles.card}>
              {segments.map((seg, i) => (
                <div key={i} style={styles.transcriptSeg}>
                  <span style={styles.transcriptSpeaker}>
                    {seg.speaker === 0 ? 'Coach' : 'You'} · {formatSecs(seg.start)}
                  </span>
                  <p style={styles.transcriptText}>{seg.transcript}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Claim prompt */}
        <div style={styles.claimCard}>
          <p style={styles.claimTitle}>Track your progress on Looper</p>
          <p style={styles.claimSubtitle}>
            Connect this lesson to your player profile to see your improvement over time.
          </p>
          <a href="/player" style={styles.claimBtn}>
            Open My Dashboard
          </a>
        </div>

        {/* Footer */}
        <p style={styles.footer}>Powered by Looper.AI · Golf coaching, captured.</p>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// Dark mode, 480px max-width, mobile-first

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#0C1117',
    minHeight: '100vh',
    padding: '0',
    fontFamily: "'DM Sans', sans-serif",
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '24px 20px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
  },
  logo: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '20px',
    fontWeight: '700',
    color: '#E8ECF1',
    letterSpacing: '-0.3px',
  },
  badgeCoach: {
    backgroundColor: '#1E2A36',
    color: '#10B981',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '99px',
    border: '1px solid #2A3A4A',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  playerName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#E8ECF1',
    margin: '0',
    letterSpacing: '-0.3px',
  },
  sessionMeta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#8B99A8',
    margin: '0',
  },
  summary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: '#E8ECF1',
    lineHeight: '1.6',
    margin: '8px 0 0',
    backgroundColor: '#151D28',
    borderRadius: '8px',
    padding: '14px',
    borderLeft: '3px solid #10B981',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '0',
  },
  card: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    border: '1px solid #2A3A4A',
    overflow: 'hidden',
  },
  cueRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 14px',
    borderBottom: '1px solid #1E2A36',
  },
  cueBullet: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    flexShrink: '0',
    marginTop: '6px',
    display: 'inline-block',
  } as React.CSSProperties,
  cueText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#E8ECF1',
    lineHeight: '1.5',
  },
  drillCard: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    border: '1px solid #2A3A4A',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  drillHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  drillName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '600',
    color: '#E8ECF1',
  },
  drillBadge: {
    backgroundColor: '#1E2A36',
    color: '#8B99A8',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '99px',
    border: '1px solid #2A3A4A',
  },
  drillDetail: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#8B99A8',
    margin: '0',
  },
  drillSuccess: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#10B981',
    margin: '4px 0 0',
  },
  transcriptSeg: {
    padding: '12px 14px',
    borderBottom: '1px solid #1E2A36',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  transcriptSpeaker: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#5E6E7E',
  },
  transcriptText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#E8ECF1',
    lineHeight: '1.5',
    margin: '0',
  },
  claimCard: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    border: '1px solid #10B981',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    textAlign: 'center',
  },
  claimTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    fontWeight: '700',
    color: '#E8ECF1',
    margin: '0',
  },
  claimSubtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#8B99A8',
    margin: '0',
    lineHeight: '1.5',
  },
  claimBtn: {
    backgroundColor: '#10B981',
    color: '#0C1117',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    padding: '10px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '4px',
  },
  loadingPulse: {
    height: '16px',
    backgroundColor: '#151D28',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '12px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  errorCard: {
    backgroundColor: '#151D28',
    borderRadius: '8px',
    border: '1px solid #2A3A4A',
    padding: '24px',
    textAlign: 'center',
  },
  errorTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '18px',
    fontWeight: '700',
    color: '#E8ECF1',
    margin: '0 0 8px',
  },
  errorSubtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#8B99A8',
    margin: '0',
    lineHeight: '1.5',
  },
  footer: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '11px',
    color: '#5E6E7E',
    textAlign: 'center',
    margin: '0',
  },
};
