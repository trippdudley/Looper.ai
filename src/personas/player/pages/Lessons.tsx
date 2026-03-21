import { useState } from 'react';
import {
  ChevronDown, ChevronRight, CheckCircle, Circle,
  Video, ArrowRight,
} from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { lessons, coachingArc } from '../data/lessons';
import type { LessonRecord } from '../data/lessons';
import SectionLabel from '../components/shared/SectionLabel';
import KpiTile from '../components/shared/KpiTile';

function scoreColor(score: number): string {
  if (score >= 80) return C.conf;
  if (score >= 60) return C.caution;
  return C.flag;
}

function typeLabel(type: string): string {
  switch (type) {
    case 'full-swing': return 'FULL SWING';
    case 'short-game': return 'SHORT GAME';
    case 'playing-lesson': return 'PLAYING LESSON';
    case 'assessment': return 'ASSESSMENT';
    default: return type.toUpperCase();
  }
}

function LessonCard({ lesson }: { lesson: LessonRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        ...S.card,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Collapsed header */}
      <div
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          cursor: 'pointer',
        }}
      >
        {/* Session number badge */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: C.accentBg,
            border: `1px solid ${C.accent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.accent }}>
            {lesson.sessionNumber}
          </span>
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span
              style={{
                fontFamily: F.data, fontSize: 8, fontWeight: 700,
                color: C.accent, background: C.accentBg,
                padding: '1px 6px', borderRadius: 3,
                textTransform: 'uppercase', letterSpacing: '.06em',
              }}
            >
              {typeLabel(lesson.type)}
            </span>
            <span style={{ fontFamily: F.data, fontSize: 8, color: C.muted }}>
              {lesson.club}
            </span>
          </div>
          <div
            style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {lesson.focus}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 1 }}>
            {lesson.date} · {lesson.time} · {lesson.duration}
          </div>
        </div>

        {/* Improvement score */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: F.data, fontSize: 18, fontWeight: 700,
            color: scoreColor(lesson.improvementScore),
          }}>
            {lesson.improvementScore}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            SESSION
          </div>
        </div>

        {expanded
          ? <ChevronDown size={16} color={C.muted} style={{ flexShrink: 0 }} />
          : <ChevronRight size={16} color={C.muted} style={{ flexShrink: 0 }} />
        }
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: `0.5px solid ${C.borderSub}` }}>
          {/* Summary */}
          <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, margin: '12px 0' }}>
            {lesson.summary}
          </p>

          {/* Key takeaway */}
          <div
            style={{
              background: C.accentBg,
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 12,
            }}
          >
            <div style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '.08em',
              color: C.accent, marginBottom: 4,
            }}>
              KEY TAKEAWAY
            </div>
            <div style={{
              fontFamily: F.editorial, fontSize: 14, fontStyle: 'italic',
              color: C.ink, lineHeight: 1.4,
            }}>
              {lesson.keyTakeaway}
            </div>
          </div>

          {/* Metrics — before/after */}
          {lesson.metrics.length > 0 && (
            <>
              <SectionLabel number="01" text="WHAT CHANGED" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                {lesson.metrics.map((m, i) => (
                  <div key={i} style={{ ...S.cardInner, padding: '8px 10px' }}>
                    <div style={{
                      fontFamily: F.data, fontSize: 8, color: C.muted,
                      textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4,
                    }}>
                      {m.label}
                    </div>
                    {m.before !== '—' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontFamily: F.data, fontSize: 12, color: C.muted,
                          textDecoration: 'line-through',
                        }}>
                          {m.before}
                        </span>
                        <ArrowRight size={10} color={m.improved ? C.conf : C.muted} />
                        <span style={{
                          fontFamily: F.data, fontSize: 13, fontWeight: 700,
                          color: m.improved ? C.conf : C.ink,
                        }}>
                          {m.after}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.ink }}>
                        {m.after}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Drills prescribed */}
          {lesson.drills.length > 0 && (
            <>
              <SectionLabel number="02" text="DRILLS" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {lesson.drills.map((drill, i) => (
                  <div key={i} style={{ ...S.cardInner, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>
                        {drill.name}
                      </span>
                      <span style={{
                        fontFamily: F.data, fontSize: 8, fontWeight: 700,
                        color: C.muted, background: C.surfaceAlt,
                        padding: '1px 6px', borderRadius: 3,
                      }}>
                        {drill.reps}
                      </span>
                    </div>
                    <div style={{ fontFamily: F.brand, fontSize: 11, color: C.body, marginBottom: 6 }}>
                      {drill.focus}
                    </div>
                    {/* Cue card */}
                    <div style={{
                      background: C.accentBg, borderRadius: 6,
                      padding: '8px 12px',
                    }}>
                      <div style={{
                        fontFamily: F.data, fontSize: 7, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '.08em',
                        color: C.accent, marginBottom: 3,
                      }}>
                        CUE — EXTERNAL
                      </div>
                      <div style={{
                        fontFamily: F.editorial, fontSize: 13, fontStyle: 'italic',
                        color: C.ink, lineHeight: 1.3,
                      }}>
                        {drill.cue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Coach notes */}
          <div
            style={{
              borderLeft: `2px solid ${C.accent}`,
              padding: '10px 14px',
              background: C.accentBg,
              borderRadius: '0 8px 8px 0',
              marginBottom: 12,
            }}
          >
            <div style={{
              fontFamily: F.data, fontSize: 8, color: C.accent, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4,
            }}>
              COACH NOTES
            </div>
            <p style={{
              fontFamily: F.brand, fontSize: 12, fontStyle: 'italic',
              color: C.body, lineHeight: 1.5, margin: 0,
            }}>
              {lesson.coachNotes}
            </p>
          </div>

          {/* Homework */}
          {lesson.homework.length > 0 && (
            <>
              <SectionLabel number="03" text="HOMEWORK" />
              <div style={{ marginBottom: 12 }}>
                {lesson.homework.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <CheckCircle size={14} color={C.conf} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Video clips + next session */}
          <div style={{ display: 'flex', gap: 8 }}>
            {lesson.videoClipCount > 0 && (
              <div style={{
                ...S.cardInner, flex: 1,
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              }}>
                <Video size={14} color={C.accent} />
                <span style={{ fontFamily: F.data, fontSize: 10, color: C.body }}>
                  {lesson.videoClipCount} video clip{lesson.videoClipCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div style={{
              ...S.cardInner, flex: 2,
              padding: '8px 10px',
            }}>
              <div style={{
                fontFamily: F.data, fontSize: 7, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '.08em',
                color: C.muted, marginBottom: 2,
              }}>
                NEXT SESSION PREVIEW
              </div>
              <div style={{ fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.4 }}>
                {lesson.nextSessionPreview}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Lessons() {
  const arc = coachingArc;

  return (
    <div>
      {/* Coaching arc header */}
      <div style={{ ...S.card, borderLeft: `3px solid ${C.accent}`, borderRadius: '0 12px 12px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: F.brand, fontSize: 16, fontWeight: 700, color: C.ink }}>
              {arc.planTitle}
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 2 }}>
              Coach {arc.coachName} · {arc.completedSessions}/{arc.totalSessions} sessions
            </div>
          </div>
          <span style={{
            fontFamily: F.data, fontSize: 8, fontWeight: 700,
            color: C.conf, background: C.confBg,
            padding: '2px 8px', borderRadius: 3,
            textTransform: 'uppercase', letterSpacing: '.06em',
          }}>
            Phase {arc.currentPhase}
          </span>
        </div>

        {/* Phase progress bar */}
        <div style={{
          display: 'flex', gap: 3, marginBottom: 8,
        }}>
          {arc.phases.map((phase) => (
            <div
              key={phase.number}
              style={{
                flex: phase.sessions,
                height: 6,
                borderRadius: 3,
                background:
                  phase.status === 'completed' ? C.conf :
                  phase.status === 'active' ? C.accent :
                  C.surfaceAlt,
                opacity: phase.status === 'upcoming' ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        {/* Phase labels */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {arc.phases.map((phase) => (
            <div key={phase.number} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {phase.status === 'completed' ? (
                <CheckCircle size={10} color={C.conf} />
              ) : phase.status === 'active' ? (
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.accent }} />
              ) : (
                <Circle size={10} color={C.dim} />
              )}
              <span style={{
                fontFamily: F.data, fontSize: 8,
                color: phase.status === 'active' ? C.accent : phase.status === 'completed' ? C.conf : C.muted,
                fontWeight: phase.status === 'active' ? 700 : 400,
              }}>
                {phase.label}
              </span>
            </div>
          ))}
        </div>

        {/* Next session */}
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: `0.5px solid ${C.borderSub}`,
          fontFamily: F.data, fontSize: 10, color: C.accent,
        }}>
          Next session: {arc.nextSession}
        </div>
      </div>

      {/* Progress KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, marginBottom: 20 }}>
        <KpiTile
          label="Face-to-Path"
          value={'2.8\u00B0'}
          sub={'Target: <2.0\u00B0'}
          color={C.conf}
        />
        <KpiTile
          label="Dispersion"
          value={'\u00B15.1'}
          unit="yds"
          sub={'\u00B15.1 best'}
          color={C.conf}
        />
        <KpiTile
          label="SG Approach"
          value="-1.4"
          sub="Was: -1.8"
          color={C.caution}
        />
      </div>

      {/* Lesson history */}
      <SectionLabel number="01" text="LESSON HISTORY" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {/* Bottom editorial */}
      <div style={{ textAlign: 'center', padding: '32px 16px 16px' }}>
        <p style={{
          fontFamily: F.editorial, fontSize: 15, fontStyle: 'italic',
          color: C.muted, lineHeight: 1.5, margin: 0,
        }}>
          Every lesson builds on the last.
        </p>
        <p style={{
          fontFamily: F.editorial, fontSize: 15, fontStyle: 'italic',
          color: C.accent, lineHeight: 1.5, margin: '4px 0 0',
        }}>
          Your coach sees the arc. Now you do too.
        </p>
      </div>
    </div>
  );
}
