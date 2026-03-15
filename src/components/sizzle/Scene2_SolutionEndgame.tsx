import { ClipboardList, Database, Brain, Target, TrendingUp } from 'lucide-react';
import { CD, F, vis, fadeIn, fadeInOut } from './tokens';

// Timing triggers (ms from scene start)
const T = {
  // Act 1: Brand reveal
  wordmark:     400,
  tagline:      1200,
  descriptor:   2000,
  wordmarkOut:  3200,
  // Act 2: Day One Value
  d1Intro:      3800,
  d1IntroOut:   5600,
  feat1:        6000,
  feat2:        7200,
  feat3:        8400,
  feat4:        9600,
  featOut:      11200,
  // Act 3: Endgame
  endIntro:     11800,
  endIntroOut:  13600,
  flyHeader:    14000,
  fly0:         14600,
  fly1:         15000,
  fly2:         15400,
  fly3:         15800,
  fly4:         16200,
  flyCallout:   16800,
};

const gridBg = [
  `linear-gradient(to right, ${CD.border}26 1px, transparent 1px)`,
  `linear-gradient(to bottom, ${CD.border}26 1px, transparent 1px)`,
].join(', ');

const features = [
  { title: 'Automatic Session Summaries', tag: 'COACHING + FITTING',
    desc: 'Audio capture transcribes the conversation. AI extracts what was identified, what was prescribed, and why.' },
  { title: 'Record Strings', tag: 'CONTINUITY',
    desc: 'Every session links to the last. A coach picking up with a returning student never starts cold.' },
  { title: 'On-Course Closed Loop', tag: 'OUTCOMES',
    desc: 'GHIN tracks handicap trends. Arccos tracks shot-level strokes gained. Did what we tried actually work?' },
  { title: 'Professional-Language Diagnostics', tag: 'INTELLIGENCE',
    desc: 'Data translated into the language pros already think in. Strike variability, not launch monitor jargon.' },
];

const flywheelNodes = [
  { label: 'Sessions captured', Icon: ClipboardList },
  { label: 'Structured data',  Icon: Database },
  { label: 'Models trained',   Icon: Brain },
  { label: 'Better insights',  Icon: Target },
  { label: 'More adoption',    Icon: TrendingUp },
];

export default function Scene2_SolutionEndgame({ elapsed }: { elapsed: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: CD.bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: gridBg,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <div style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>

          {/* === Act 1: Wordmark reveal === */}
          {vis(elapsed, T.wordmark) && elapsed < T.wordmarkOut + 600 && (
            <div style={fadeInOut(elapsed, T.wordmark, T.wordmarkOut)}>
              <div
                style={{
                  ...fadeIn(elapsed, T.wordmark, 800),
                  fontFamily: F.brand,
                  fontWeight: 800,
                  fontSize: 42,
                  letterSpacing: '0.06em',
                  marginBottom: 12,
                }}
              >
                <span style={{ color: CD.ink }}>LOOPER</span>
                <span style={{ color: CD.accent }}>.AI</span>
              </div>
              <div
                style={{
                  ...fadeIn(elapsed, T.tagline, 600),
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: CD.body,
                  marginBottom: 14,
                }}
              >
                Expertise, engineered.
              </div>
              <div
                style={{
                  ...fadeIn(elapsed, T.descriptor, 600),
                  fontFamily: F.data,
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: CD.muted,
                }}
              >
                THE COACHING OS FOR THE AGE OF AI
              </div>
            </div>
          )}

          {/* === Act 2: Day One Value === */}
          {/* Intro line */}
          {vis(elapsed, T.d1Intro) && elapsed < T.d1IntroOut + 600 && (
            <div style={fadeInOut(elapsed, T.d1Intro, T.d1IntroOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: CD.ink,
                }}
              >
                We begin by creating the operating system
                for coaching in the age of AI.
              </div>
            </div>
          )}

          {/* Feature cards — staggered */}
          {vis(elapsed, T.feat1) && elapsed < T.featOut + 600 && (
            <div
              style={{
                ...fadeInOut(elapsed, T.feat1, T.featOut),
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 14,
                textAlign: 'left',
                maxWidth: 560,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {features.map((f, i) => {
                const trigger = [T.feat1, T.feat2, T.feat3, T.feat4][i];
                return (
                  <div
                    key={i}
                    style={{
                      ...fadeIn(elapsed, trigger, 500),
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontFamily: F.brand,
                          fontWeight: 700,
                          fontSize: 14,
                          color: CD.ink,
                        }}
                      >
                        {f.title}
                      </span>
                      <span
                        style={{
                          fontFamily: F.data,
                          fontSize: 8,
                          fontWeight: 700,
                          color: CD.accent,
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.06em',
                          border: `1px solid ${CD.accent}40`,
                          padding: '2px 6px',
                          borderRadius: 3,
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 10,
                        color: CD.body,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* === Act 3: Endgame === */}
          {/* Intro line */}
          {vis(elapsed, T.endIntro) && elapsed < T.endIntroOut + 600 && (
            <div style={fadeInOut(elapsed, T.endIntro, T.endIntroOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: CD.ink,
                }}
              >
                We develop the industry standard infrastructure layer
                to power AI coaching.
              </div>
            </div>
          )}

          {/* Flywheel — card-based */}
          {vis(elapsed, T.flyHeader) && (
            <div style={{ maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
              {/* Header */}
              <div style={fadeIn(elapsed, T.flyHeader, 600)}>
                <div
                  style={{
                    fontFamily: F.brand,
                    fontWeight: 800,
                    fontSize: 24,
                    lineHeight: 1.2,
                    color: CD.ink,
                    marginBottom: 8,
                  }}
                >
                  The wedge is workflow.{' '}
                  <span style={{ color: CD.accent }}>The moat is data.</span>
                </div>
                <div
                  style={{
                    fontFamily: F.data,
                    fontSize: 11,
                    color: CD.body,
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  Every session captured on the platform feeds the AI engine. The engine gets smarter.
                  Smarter recommendations drive more adoption. The flywheel compounds.
                </div>
              </div>

              {/* Row 1: 3 cards with arrows */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {flywheelNodes.slice(0, 3).map((node, i) => {
                  const triggers = [T.fly0, T.fly1, T.fly2];
                  const active = elapsed >= triggers[i];
                  const highlighted = i === 1;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          ...fadeIn(elapsed, triggers[i], 400),
                          padding: '14px 16px',
                          borderRadius: 12,
                          background: active
                            ? highlighted ? `${CD.accent}18` : 'transparent'
                            : 'transparent',
                          border: `1.5px solid ${active ? CD.accent : CD.dim}`,
                          textAlign: 'center',
                          minWidth: 120,
                          position: 'relative' as const,
                        }}
                      >
                        {highlighted && active && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: CD.accent,
                            }}
                          />
                        )}
                        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                          <node.Icon
                            size={20}
                            strokeWidth={1.8}
                            color={active ? CD.accent : CD.dim}
                          />
                        </div>
                        <div
                          style={{
                            fontFamily: F.data,
                            fontSize: 11,
                            fontWeight: 600,
                            color: active ? CD.ink : CD.dim,
                          }}
                        >
                          {node.label}
                        </div>
                      </div>
                      {i < 2 && (
                        <span
                          style={{
                            ...fadeIn(elapsed, triggers[i], 400),
                            fontFamily: F.data,
                            fontSize: 16,
                            color: active ? CD.accent : CD.dim,
                          }}
                        >
                          →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 2 cards with arrows */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {flywheelNodes.slice(3).map((node, i) => {
                  const triggers = [T.fly3, T.fly4];
                  const active = elapsed >= triggers[i];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          ...fadeIn(elapsed, triggers[i], 400),
                          padding: '14px 16px',
                          borderRadius: 12,
                          background: 'transparent',
                          border: `1.5px solid ${active ? CD.accent : CD.dim}`,
                          textAlign: 'center',
                          minWidth: 120,
                        }}
                      >
                        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                          <node.Icon
                            size={20}
                            strokeWidth={1.8}
                            color={active ? CD.accent : CD.dim}
                          />
                        </div>
                        <div
                          style={{
                            fontFamily: F.data,
                            fontSize: 11,
                            fontWeight: 600,
                            color: active ? CD.ink : CD.dim,
                          }}
                        >
                          {node.label}
                        </div>
                      </div>
                      {i === 0 && (
                        <span
                          style={{
                            ...fadeIn(elapsed, triggers[i], 400),
                            fontFamily: F.data,
                            fontSize: 16,
                            color: active ? CD.accent : CD.dim,
                          }}
                        >
                          →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Callout */}
              {vis(elapsed, T.flyCallout) && (
                <div
                  style={{
                    ...fadeIn(elapsed, T.flyCallout, 600),
                    textAlign: 'center',
                    padding: '14px 20px',
                    background: `${CD.accent}12`,
                    borderRadius: 10,
                    border: `1px solid ${CD.accent}30`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: F.data,
                      fontSize: 11,
                      color: CD.body,
                      lineHeight: 1.6,
                    }}
                  >
                    Replicating this requires building the OS, earning adoption, accumulating
                    thousands of structured interactions, and waiting for outcomes.{' '}
                    <span style={{ color: CD.accent, fontWeight: 700 }}>
                      That is a multi-year head start.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
