import { useState, useEffect } from 'react';
import { C, F, vis, fadeIn, fadeInOut, easeOutCubic, countUp } from './tokens';
import swingVideo from '../../assets/images/swing-clip.mov';

// ---- Timing (ms) ----
const T = {
  editorial:      0,
  editorialIn:    400,
  editorialOut:   2200,
  uiReveal:       2800,
  callout:        3500,
  calloutOut:     7000,
  shotAppear:     7500,
  notification:   8000,
  dataStart:      8500,
  dataComplete:   10500,
  deltaBadges:    10500,
  strikeMap:      11000,
  aiStart:        12000,
  aiComplete:     17500,
  recommendedNext:17500,
  spotlight:      19500,
  spotlightOff:   22500,
  zoomOut:        22500,
  overlayText:    24500,
  zoomIn:         26500,
  fadeToNext:     28000,
};

// ---- Shot data rows ----
const DATA_ROWS: { label: string; value: number; unit: string; decimals: number; prefix?: string; comma?: boolean }[] = [
  { label: 'Ball Speed',    value: 132.4, unit: 'mph', decimals: 1 },
  { label: 'Launch Angle',  value: 17.2,  unit: '\u00B0',  decimals: 1 },
  { label: 'Spin Rate',     value: 6240,  unit: 'rpm', decimals: 0, comma: true },
  { label: 'Carry',         value: 172,   unit: 'yds', decimals: 0 },
  { label: 'Club Speed',    value: 87.3,  unit: 'mph', decimals: 1 },
  { label: 'Attack Angle',  value: -4.2,  unit: '\u00B0',  decimals: 1, prefix: '' },
  { label: 'Club Path',     value: 1.8,   unit: '\u00B0',  decimals: 1, prefix: '+' },
  { label: 'Face Angle',    value: 0.4,   unit: '\u00B0',  decimals: 1, prefix: '+' },
  { label: 'Dynamic Loft',  value: 23.1,  unit: '\u00B0',  decimals: 1 },
];

// ---- AI insight text ----
const AI_TEXT =
  'Working on external rotation feel \u2014 "brush the grass past the ball."\n\n' +
  'This swing: path improved +2.1\u00B0 vs session baseline. Strike location moved 4mm toward center. Face-to-path gap narrowing.\n\n' +
  'Confidence: 76% \u2014 contact pattern stabilizing. 3 more swings at current difficulty before progressing to 5-iron.';

const AI_CHARS_PER_SEC = 30;

// ---- Helpers ----
function formatNumber(n: number, decimals: number, comma?: boolean, prefix?: string): string {
  const abs = Math.abs(n);
  let str: string;
  if (comma) {
    str = Math.round(abs).toLocaleString('en-US');
  } else {
    str = abs.toFixed(decimals);
  }
  if (n < 0) return '-' + str;
  if (prefix) return prefix + str;
  return str;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// ---- Styles ----
const S = {
  sectionLabel: {
    fontFamily: F.data,
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    margin: 0,
  },
  card: {
    background: C.surface,
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    padding: 14,
  },
};

// ---- Responsive hook ----
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setM(mq.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return m;
}

// ---- Component ----
export default function Scene3_LiveSession({ elapsed }: { elapsed: number }) {
  const isMobile = useIsMobile();
  // Spotlight dimming
  const inSpotlight = elapsed >= T.spotlight && elapsed < T.spotlightOff;
  const dimOpacity = inSpotlight ? 0.15 : 1;

  // Zoom sequence
  let scale = 1;
  if (elapsed >= T.zoomOut && elapsed < T.overlayText) {
    const t = easeOutCubic(Math.min(1, (elapsed - T.zoomOut) / 800));
    scale = lerp(1, 0.92, t);
  } else if (elapsed >= T.overlayText && elapsed < T.zoomIn) {
    scale = 0.92;
  } else if (elapsed >= T.zoomIn && elapsed < T.fadeToNext) {
    const t = easeOutCubic(Math.min(1, (elapsed - T.zoomIn) / 800));
    scale = lerp(0.92, 1, t);
  }

  // Fade to next scene
  const fadeOutOpacity = elapsed >= T.fadeToNext
    ? Math.max(0, 1 - (elapsed - T.fadeToNext) / 1500)
    : 1;

  // Typewriter visible char count
  const aiVisibleChars = elapsed < T.aiStart
    ? 0
    : Math.min(AI_TEXT.length, Math.floor(((elapsed - T.aiStart) / 1000) * AI_CHARS_PER_SEC));

  // Notification visible
  const notifOpacity = elapsed >= T.notification && elapsed < T.notification + 2000
    ? (elapsed < T.notification + 400
      ? Math.min(1, (elapsed - T.notification) / 400)
      : elapsed > T.notification + 1400
        ? Math.max(0, 1 - (elapsed - T.notification - 1400) / 600)
        : 1)
    : 0;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: C.bg,
      overflow: 'hidden',
      opacity: fadeOutOpacity,
    }}>
      {/* ===== EDITORIAL ===== */}
      {elapsed < T.uiReveal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          ...fadeInOut(elapsed, T.editorialIn, T.editorialOut),
        }}>
          <p style={{
            fontFamily: F.serif,
            fontStyle: 'italic',
            fontSize: 24,
            color: C.ink,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Now watch a coaching session. In real time.
          </p>
        </div>
      )}

      {/* ===== PLATFORM CALLOUT (over empty UI) ===== */}
      {vis(elapsed, T.callout) && elapsed < T.calloutOut + 600 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          pointerEvents: 'none',
          ...fadeInOut(elapsed, T.callout, T.calloutOut),
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderLeft: `4px solid ${C.accent}`,
            borderRadius: 10,
            padding: '20px 28px',
            maxWidth: 440,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <p style={{
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 20,
              color: C.ink,
              margin: 0,
              lineHeight: 1.5,
            }}>
              A single pane of glass for coaching.
            </p>
            <p style={{
              fontFamily: F.data,
              fontSize: 11,
              color: C.body,
              margin: '10px 0 0 0',
              lineHeight: 1.6,
            }}>
              It connects a coach's currently disconnected tools into the OS, from launch monitor and video tools.
            </p>
          </div>
        </div>
      )}

      {/* ===== PRODUCT UI ===== */}
      {vis(elapsed, T.uiReveal) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          ...fadeIn(elapsed, T.uiReveal, 600),
          transform: `scale(${scale}) ${(fadeIn(elapsed, T.uiReveal, 600).transform || '')}`,
        }}>
          {/* ---- Top Bar ---- */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
            opacity: dimOpacity,
            transition: 'opacity 400ms',
          }}>
            <span style={{
              fontFamily: F.brand,
              fontWeight: 700,
              fontSize: 13,
              color: C.ink,
              letterSpacing: '0.04em',
            }}>LOOPER.AI</span>
            <div style={{ flex: 1 }} />
            {(isMobile ? ['7i \u00B7 S13', 'Swing 7/20'] : ['7-iron \u00B7 Session 13', 'Goal: Strike consistency', 'Swing 7/20']).map((pill, i) => (
              <span key={i} style={{
                fontFamily: F.data,
                fontSize: 9,
                color: C.body,
                border: `1px solid ${C.borderSub}`,
                borderRadius: 12,
                padding: '3px 10px',
              }}>{pill}</span>
            ))}
          </div>

          {/* ---- L3 Tabs ---- */}
          <div style={{
            display: 'flex',
            gap: 18,
            padding: isMobile ? '6px 8px 0 8px' : '6px 16px 0 88px',
            overflowX: 'auto',
            borderBottom: `1px solid ${C.border}`,
            background: C.surface,
            opacity: dimOpacity,
            transition: 'opacity 400ms',
          }}>
            {['Overview', 'Video Analysis', 'Diagnosis', 'Interventions', 'Player Plan'].map((tab, i) => (
              <span key={tab} style={{
                fontFamily: F.brand,
                fontWeight: 500,
                fontSize: 12,
                color: i === 0 ? C.accent : C.muted,
                paddingBottom: 6,
                borderBottom: i === 0 ? `2px solid ${C.accent}` : '2px solid transparent',
                cursor: 'default',
              }}>{tab}</span>
            ))}
          </div>

          {/* ---- Main Content ---- */}
          <div style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}>
            {/* Shot Rail — hidden on mobile */}
            <div style={{
              width: 72,
              display: isMobile ? 'none' : 'flex',
              borderRight: `1px solid ${C.border}`,
              background: C.surface,
              padding: '10px 0',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              opacity: dimOpacity,
              transition: 'opacity 400ms',
            }}>
              {Array.from({ length: 7 }, (_, i) => {
                const shotNum = 7 - i;
                const isActive = shotNum === 7;
                const shotVisible = shotNum === 7
                  ? vis(elapsed, T.shotAppear)
                  : true;
                if (!shotVisible) return null;
                return (
                  <div key={shotNum} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    ...(shotNum === 7 ? fadeIn(elapsed, T.shotAppear, 400) : {}),
                  }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: `1.5px solid ${isActive ? C.accent : C.borderSub}`,
                      background: isActive ? C.accentBg : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: F.data,
                      fontSize: 10,
                      fontWeight: 700,
                      color: isActive ? C.accent : C.muted,
                    }}>{shotNum}</div>
                    <span style={{
                      fontFamily: F.data,
                      fontSize: 8,
                      color: C.muted,
                    }}>7I</span>
                  </div>
                );
              })}
            </div>

            {/* Three Columns */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'column' as const : 'row' as const,
              gap: 10,
              padding: isMobile ? 6 : 10,
              overflow: isMobile ? 'auto' : 'hidden',
            }}>
              {/* === Column 1: Swing Video === */}
              <div style={{
                flex: isMobile ? 'none' : '0 0 40%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                opacity: dimOpacity,
                transition: 'opacity 400ms',
              }}>
                <div style={{
                  ...S.card,
                  flex: 1,
                  position: 'relative',
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Swing video */}
                  <div style={{
                    flex: 1,
                    background: '#151D28',
                    borderRadius: '10px 10px 0 0',
                    position: 'relative',
                    minHeight: 200,
                    overflow: 'hidden',
                  }}>
                    <video
                      src={swingVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    {/* P-position pills */}
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      display: 'flex',
                      gap: 4,
                    }}>
                      {['P1', 'P4', 'P6', 'P8'].map((p) => (
                        <span key={p} style={{
                          fontFamily: F.data,
                          fontSize: 8,
                          fontWeight: 700,
                          color: p === 'P6' ? C.accent : 'rgba(255,255,255,0.5)',
                          background: p === 'P6' ? C.accentBg : 'rgba(255,255,255,0.08)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>{p}</span>
                      ))}
                    </div>

                    {/* Drawing tools */}
                    <div style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}>
                      {['\u2014', '/', 'O'].map((icon, i) => (
                        <div key={i} style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: F.data,
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.4)',
                        }}>{icon}</div>
                      ))}
                    </div>
                  </div>

                  {/* Video label */}
                  <div style={{
                    padding: '8px 12px',
                    background: C.surface,
                    borderRadius: '0 0 10px 10px',
                  }}>
                    <span style={{
                      fontFamily: F.data,
                      fontSize: 10,
                      color: C.muted,
                    }}>DTL &middot; 240 FPS &middot; MAR 14, 2026</span>
                  </div>
                </div>
              </div>

              {/* === Column 2: Shot Data === */}
              <div style={{
                flex: isMobile ? 'none' : '0 0 30%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                opacity: dimOpacity,
                transition: 'opacity 400ms',
                position: 'relative',
              }}>
                {/* Notification banner */}
                {notifOpacity > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 5,
                    background: C.accentBg,
                    padding: '6px 10px',
                    borderRadius: 8,
                    opacity: notifOpacity,
                  }}>
                    <span style={{
                      fontFamily: F.data,
                      fontSize: 9,
                      color: C.accent,
                      fontWeight: 700,
                    }}>New swing captured</span>
                  </div>
                )}

                <div style={{
                  ...S.card,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  overflowY: 'auto',
                }}>
                  <p style={{ ...S.sectionLabel, color: C.muted, marginBottom: 4 }}>SHOT DATA</p>

                  {DATA_ROWS.map((row, i) => {
                    const stagger = T.dataStart + i * 200;
                    const raw = countUp(elapsed, stagger, Math.abs(row.value), 600);
                    const sign = row.value < 0 ? -1 : 1;
                    const current = raw * sign;
                    const display = elapsed < stagger
                      ? '\u2014'
                      : formatNumber(current, row.decimals, row.comma, row.prefix);

                    const hasDelta = row.label === 'Club Path' || row.label === 'Face Angle';
                    const deltaText = row.label === 'Club Path'
                      ? '\u25B2 2.1\u00B0 vs baseline'
                      : '\u25B2 1.4\u00B0 vs baseline';

                    return (
                      <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                        }}>
                          <span style={{
                            fontFamily: F.data,
                            fontSize: 10,
                            color: C.muted,
                          }}>{row.label}</span>
                          <span style={{
                            fontFamily: F.data,
                            fontSize: 16,
                            fontWeight: 700,
                            color: C.ink,
                          }}>{display}{elapsed >= stagger ? ` ${row.unit}` : ''}</span>
                        </div>
                        {hasDelta && vis(elapsed, T.deltaBadges) && (
                          <span style={{
                            alignSelf: 'flex-end',
                            fontFamily: F.data,
                            fontSize: 9,
                            color: C.conf,
                            ...fadeIn(elapsed, T.deltaBadges, 500),
                          }}>{deltaText}</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Strike heatmap */}
                  {vis(elapsed, T.strikeMap) && (
                    <div style={{
                      marginTop: 8,
                      ...fadeIn(elapsed, T.strikeMap, 500),
                    }}>
                      <p style={{ ...S.sectionLabel, color: C.muted, marginBottom: 6 }}>STRIKE LOCATION</p>
                      <svg width={60} height={40} viewBox="0 0 60 40" style={{ display: 'block', margin: '0 auto' }}>
                        <rect
                          x={2} y={2} width={56} height={36} rx={6} ry={6}
                          fill="none"
                          stroke={C.border}
                          strokeWidth={1.5}
                        />
                        {/* Center crosshair */}
                        <line x1={30} y1={8} x2={30} y2={32} stroke={C.borderSub} strokeWidth={0.5} />
                        <line x1={8} y1={20} x2={52} y2={20} stroke={C.borderSub} strokeWidth={0.5} />
                        {/* Strike dot — slightly toe side */}
                        <circle cx={36} cy={19} r={6} fill={C.accent} opacity={0.85} />
                      </svg>
                      <p style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        color: C.conf,
                        textAlign: 'center',
                        marginTop: 4,
                        margin: '4px 0 0 0',
                      }}>
                        2mm toe &middot; <span style={{ whiteSpace: 'nowrap' }}>{'\u25B2'} 4mm vs S12 avg</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* === Column 3: AI Insight === */}
              <div style={{
                flex: isMobile ? 'none' : '0 0 30%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
                opacity: inSpotlight ? 1 : 1,
                transition: 'opacity 400ms',
              }}>
                {/* Spotlight callout */}
                {inSpotlight && (
                  <div style={{
                    position: 'absolute',
                    top: -48,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 20,
                    ...fadeIn(elapsed, T.spotlight, 500),
                  }}>
                    <p style={{
                      fontFamily: F.brand,
                      fontWeight: 700,
                      fontSize: 12,
                      color: C.ink,
                      margin: 0,
                      letterSpacing: '0.02em',
                    }}>AI CONTEXTUALIZES EVERY SWING</p>
                    <p style={{
                      fontFamily: F.data,
                      fontSize: 9,
                      color: C.body,
                      margin: '3px 0 0 0',
                      lineHeight: 1.4,
                    }}>Against the session goal, the player's history, and motor learning science.</p>
                  </div>
                )}

                <div style={{
                  ...S.card,
                  flex: 1,
                  background: C.accentBg,
                  borderLeft: `3px solid ${C.accent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  overflow: 'hidden',
                }}>
                  <p style={{ ...S.sectionLabel, color: C.accent }}>SESSION CONTEXT</p>

                  {/* Typewriter text */}
                  {vis(elapsed, T.aiStart) && (
                    <div style={{
                      fontFamily: F.data,
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: C.ink,
                      whiteSpace: 'pre-wrap',
                      overflow: 'hidden',
                    }}>
                      {AI_TEXT.slice(0, aiVisibleChars)}
                      {aiVisibleChars < AI_TEXT.length && (
                        <span style={{
                          display: 'inline-block',
                          width: 1,
                          height: 13,
                          background: C.accent,
                          marginLeft: 1,
                          verticalAlign: 'text-bottom',
                        }} />
                      )}
                    </div>
                  )}

                  {/* Recommended Next */}
                  {vis(elapsed, T.recommendedNext) && (
                    <div style={{
                      marginTop: 'auto',
                      background: C.surface,
                      borderRadius: 8,
                      padding: 10,
                      border: `1px solid ${C.border}`,
                      ...fadeIn(elapsed, T.recommendedNext, 600),
                    }}>
                      <p style={{ ...S.sectionLabel, color: C.muted, marginBottom: 6 }}>RECOMMENDED NEXT</p>
                      <p style={{
                        fontFamily: F.data,
                        fontSize: 10,
                        color: C.ink,
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        Continue current drill. 3 more reps at 7-iron before 5-iron progression.
                      </p>
                      <span style={{
                        display: 'inline-block',
                        marginTop: 6,
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        color: C.conf,
                        background: C.confBg,
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}>76% CONFIDENCE</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---- LLM callout ---- */}
          {vis(elapsed, T.aiStart) && elapsed < T.spotlight && (
            <div style={{
              padding: isMobile ? '0 8px' : '0 16px 0 88px',
              ...fadeIn(elapsed, T.aiStart, 800),
            }}>
              <div style={{
                background: C.accentBg,
                borderLeft: `3px solid ${C.accent}`,
                borderRadius: 6,
                padding: '8px 14px',
              }}>
                <p style={{
                  fontFamily: F.data,
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.accent,
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  LLM transcribes coach inputs and player feedback, contextualizes for that swing, and connects the data in real-time.
                </p>
              </div>
            </div>
          )}

          {/* ---- Overlay text at 23s ---- */}
          {vis(elapsed, T.overlayText) && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              pointerEvents: 'none',
              ...fadeIn(elapsed, T.overlayText, 600),
            }}>
              <p style={{
                fontFamily: F.data,
                fontSize: 10,
                fontWeight: 700,
                color: C.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
                textAlign: 'center',
                background: 'rgba(246,247,249,0.85)',
                padding: '10px 24px',
                borderRadius: 8,
              }}>
                ONE INTERFACE. EVERY TOOL. EVERY INSIGHT.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
