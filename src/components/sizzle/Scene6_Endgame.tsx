import { useState, useEffect } from 'react';
import { ClipboardList, Database, Brain, Target, TrendingUp, Layers, BarChart3, Cpu } from 'lucide-react';
import { CD, F, vis, fadeIn, fadeInOut } from './tokens';

const T = {
  // Beat 1: Transition editorial
  editorial:    400,
  editorialOut: 4400,     // 4s hold (was 3s)
  // Beat 2: Header
  header:       5000,
  headerOut:    8000,     // 3s hold (was 2s)
  // Beat 3: Flywheel
  flyHeader:    8600,
  fly0:         9200,
  fly1:         9800,     // 600ms between nodes (was 400ms)
  fly2:         10400,
  fly3:         11000,
  fly4:         11600,
  // Beat 4: Scale pillars
  pillar1:      13000,    // 1.4s gap after flywheel (was 1.1s)
  pillar2:      13800,    // 800ms between pillars (was 600ms)
  pillar3:      14600,
  // Beat 5: Callout
  callout:      16400,    // 1.8s after last pillar (was 1.2s) — 5.6s hold to end
};

const flywheelNodes = [
  { label: 'Sessions captured', Icon: ClipboardList },
  { label: 'Structured data',  Icon: Database },
  { label: 'Models trained',   Icon: Brain },
  { label: 'Better insights',  Icon: Target },
  { label: 'More adoption',    Icon: TrendingUp },
];

const pillars = [
  {
    Icon: Layers,
    title: 'Proprietary coaching dataset',
    desc: 'Every session generates structured data connecting coaching decisions to fitting decisions to on-course outcomes.',
  },
  {
    Icon: Cpu,
    title: 'AI models trained on real instruction',
    desc: 'The first models built on professional coaching interactions — not generic golf content.',
  },
  {
    Icon: BarChart3,
    title: 'Industry-standard infrastructure',
    desc: 'The data layer the golf industry will build on. APIs, analytics, and intelligence for every stakeholder.',
  },
];

const gridBg = [
  `linear-gradient(to right, ${CD.border}26 1px, transparent 1px)`,
  `linear-gradient(to bottom, ${CD.border}26 1px, transparent 1px)`,
].join(', ');

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

export default function Scene6_Endgame({ elapsed }: { elapsed: number }) {
  const isMobile = useIsMobile();
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

          {/* Beat 1: Transition editorial */}
          {vis(elapsed, T.editorial) && elapsed < T.editorialOut + 600 && (
            <div style={fadeInOut(elapsed, T.editorial, T.editorialOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 24,
                  color: CD.ink,
                  lineHeight: 1.5,
                }}
              >
                The coaching OS is Act One.
              </div>
            </div>
          )}

          {/* Beat 2: Act Two header */}
          {vis(elapsed, T.header) && elapsed < T.headerOut + 600 && (
            <div style={fadeInOut(elapsed, T.header, T.headerOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: CD.ink,
                }}
              >
                Act Two: build the infrastructure to power{' '}
                <span style={{ color: CD.accent }}>golf AI at scale.</span>
              </div>
            </div>
          )}

          {/* Beat 3: Flywheel */}
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
                    marginBottom: 20,
                  }}
                >
                  Every session captured on the platform feeds the AI engine. The engine gets smarter.
                  Smarter recommendations drive more adoption. The flywheel compounds.
                </div>
              </div>

              {/* Row 1: 3 cards */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 12,
                  flexWrap: 'wrap' as const,
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

              {/* Row 2: 2 cards */}
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

              {/* Scale pillars */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' as const : 'row' as const,
                  gap: isMobile ? 10 : 14,
                  marginBottom: 18,
                }}
              >
                {pillars.map((p, i) => {
                  const trigger = [T.pillar1, T.pillar2, T.pillar3][i];
                  return (
                    <div
                      key={i}
                      style={{
                        ...fadeIn(elapsed, trigger, 500),
                        flex: 1,
                        padding: '16px 14px',
                        borderRadius: 10,
                        background: CD.surface,
                        border: `1px solid ${CD.border}`,
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <p.Icon
                          size={18}
                          strokeWidth={1.8}
                          color={CD.accent}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: F.brand,
                          fontWeight: 700,
                          fontSize: 12,
                          color: CD.ink,
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontFamily: F.data,
                          fontSize: 9,
                          color: CD.body,
                          lineHeight: 1.5,
                        }}
                      >
                        {p.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Callout */}
              {vis(elapsed, T.callout) && (
                <div
                  style={{
                    ...fadeIn(elapsed, T.callout, 600),
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
