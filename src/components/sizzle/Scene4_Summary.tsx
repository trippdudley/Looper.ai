import React from 'react';
import { C, F, vis, fadeIn, fadeInOut } from './tokens';
import { useIsMobile } from '../../hooks/useIsMobile';

// Timing constants (ms)
const T = {
  editorial: 400,
  editorialOut: 3200,     // 2.8s hold (was 1.8s)
  uiReveal: 4000,
  spot1: 8000,            // more time to absorb report before spotlight
  spot1Off: 12000,        // 4s spotlight (was 3s)
  spot2: 13000,
  spot2Off: 17500,        // 4.5s spotlight (was 3s)
};

const metrics = [
  { label: 'Club Path',         start: '+0.3\u00B0',  end: '+1.8\u00B0',  delta: '\u25B2 1.5\u00B0' },
  { label: 'Strike Center',     start: '6mm toe',     end: '2mm toe',     delta: '\u25B2 4mm' },
  { label: 'Dispersion',        start: '17.3 yds',    end: '14.2 yds',    delta: '\u25B2 3.1 yds' },
  { label: 'Carry Consistency', start: '\u00B18 yds',  end: '\u00B15 yds',  delta: '\u25B2 3 yds' },
];

const drills = [
  {
    name: 'Gate drill \u2014 7-iron',
    freq: '3x/week \u00B7 20 balls',
    desc: 'Two tees 4" apart, ball in center. Builds low-point awareness and forward strike habit.',
  },
  {
    name: 'Towel strike drill',
    freq: '2x/week \u00B7 15 balls',
    desc: 'Towel 3" behind ball. Reinforces forward contact without overcomplicating the movement.',
  },
  {
    name: 'Feet-together 9-iron',
    freq: 'Warm-up \u00B7 10 balls',
    desc: 'Full swings with feet together. Forces centered balance and clean contact.',
  },
];

export default function Scene4_Summary({ elapsed }: { elapsed: number }) {
  const isMobile = useIsMobile();
  const spot1Active = elapsed >= T.spot1 && elapsed < T.spot1Off;
  const spot2Active = elapsed >= T.spot2 && elapsed < T.spot2Off;

  const sectionOpacity = (isSpotlit: boolean) => {
    if (!spot1Active) return 1;
    return isSpotlit ? 1 : 0.15;
  };

  const cardStyle: React.CSSProperties = {
    background: C.surface,
    borderRadius: 10,
    padding: '24px 28px',
    maxWidth: 640,
    width: '100%',
    position: 'relative',
    border: spot2Active ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
    boxShadow: spot2Active
      ? `0 0 24px ${C.accent}33, 0 2px 12px rgba(0,0,0,0.06)`
      : '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'border 0.4s, box-shadow 0.4s',
  };

  const calloutStyle: React.CSSProperties = {
    background: C.accent,
    color: '#FFFFFF',
    fontFamily: F.data,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: 3,
    letterSpacing: '0.04em',
    lineHeight: 1.4,
    display: 'inline-block',
    marginBottom: 10,
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Editorial */}
      {elapsed < T.editorialOut + 600 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...fadeInOut(elapsed, T.editorial, T.editorialOut),
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 24,
              color: C.ink,
            }}
          >
            Every session produces a complete summary.
          </span>
        </div>
      )}

      {/* Report UI */}
      {vis(elapsed, T.uiReveal) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 700,
            padding: '0 20px',
            ...fadeIn(elapsed, T.uiReveal, 800),
          }}
        >
          {/* Spotlight 2 callout */}
          {spot2Active && (
            <div style={{ ...fadeIn(elapsed, T.spot2, 400) }}>
              <span style={calloutStyle}>
                THE RECORD IS PERSISTENT. THE LOOP CLOSES.
              </span>
            </div>
          )}

          {/* Spotlight 1 callout (above card, only when spot1 active) */}
          {spot1Active && !spot2Active && (
            <div style={{ ...fadeIn(elapsed, T.spot1, 400) }}>
              <span style={calloutStyle}>
                ONE CLICK. THE STUDENT GETS THEIR PLAN.
              </span>
            </div>
          )}

          <div style={cardStyle}>
            {/* Report Header */}
            <div
              style={{
                opacity: sectionOpacity(false),
                transition: 'opacity 0.4s',
              }}
            >
              <div
                style={{
                  fontFamily: F.brand,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: '0.03em',
                  marginBottom: 2,
                }}
              >
                LOOPER.AI
              </div>
              <div
                style={{
                  fontFamily: F.data,
                  fontSize: 9,
                  fontWeight: 400,
                  color: C.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 6,
                }}
              >
                SESSION SUMMARY
              </div>
              <div
                style={{
                  fontFamily: F.data,
                  fontSize: 10,
                  color: C.muted,
                  marginBottom: 12,
                }}
              >
                Mar 14, 2026 | Moe Norman | Coach: M. Thompson | 55 min | 20 swings
              </div>
              <div style={{ borderBottom: `1px solid ${C.borderSub}`, marginBottom: 14 }} />
            </div>

            {/* Section 1: What We Worked On */}
            <div
              style={{
                opacity: sectionOpacity(false),
                transition: 'opacity 0.4s',
                marginBottom: 14,
              }}
            >
              <div style={sectionLabelStyle}>WHAT WE WORKED ON</div>
              <div
                style={{
                  fontFamily: F.brand,
                  fontWeight: 600,
                  fontSize: 15,
                  color: C.ink,
                  marginBottom: 4,
                }}
              >
                Strike consistency — mid-iron contact
              </div>
              <div
                style={{
                  fontFamily: F.brand,
                  fontWeight: 400,
                  fontSize: 13,
                  color: C.body,
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span>"Brush the grass past the ball" (external focus)</span>
                <span
                  style={{
                    background: C.accentBg,
                    color: C.accent,
                    fontFamily: F.data,
                    fontSize: 8,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: 3,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  EXTERNAL CUE
                </span>
              </div>
              <div
                style={{
                  fontFamily: F.data,
                  fontSize: 10,
                  color: C.muted,
                }}
              >
                Clubs used: 7-iron, 5-iron
              </div>
            </div>

            {/* Section 2: Key Metrics */}
            <div
              style={{
                borderTop: `1px solid ${C.borderSub}`,
                paddingTop: 14,
                marginBottom: 14,
                opacity: sectionOpacity(false),
                transition: 'opacity 0.4s',
              }}
            >
              <div style={sectionLabelStyle}>KEY METRICS</div>
              {/* Header row */}
              {!isMobile && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: 4,
                  marginBottom: 6,
                }}
              >
                <div style={metricHeaderStyle} />
                <div style={metricHeaderStyle}>START OF SESSION</div>
                <div style={metricHeaderStyle}>END OF SESSION</div>
                <div style={metricHeaderStyle} />
              </div>
              )}
              {metrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
                    gap: 4,
                    alignItems: 'center',
                    marginBottom: 5,
                  }}
                >
                  <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: F.data, fontWeight: 700, fontSize: 14, color: C.ink }}>
                    {m.start}
                  </div>
                  <div style={{ fontFamily: F.data, fontWeight: 700, fontSize: 14, color: C.ink }}>
                    {m.end}
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: F.data,
                        fontWeight: 700,
                        fontSize: 10,
                        color: C.conf,
                        background: C.confBg,
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}
                    >
                      {m.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 3: Practice Plan — spotlight 1 target */}
            <div
              style={{
                borderTop: `1px solid ${C.borderSub}`,
                paddingTop: 14,
                marginBottom: 14,
                opacity: sectionOpacity(true),
                transition: 'opacity 0.4s',
                borderLeft: spot1Active ? `3px solid ${C.accent}` : '3px solid transparent',
                background: spot1Active ? C.accentBg : 'transparent',
                paddingLeft: spot1Active ? 12 : 0,
                marginLeft: spot1Active ? -15 : 0,
                marginRight: spot1Active ? -4 : 0,
                borderRadius: spot1Active ? 4 : 0,
              }}
            >
              <div style={sectionLabelStyle}>PRACTICE PLAN</div>
              {drills.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    marginBottom: i < drills.length - 1 ? 10 : 0,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: C.accentBg,
                      color: C.accent,
                      fontFamily: F.data,
                      fontWeight: 700,
                      fontSize: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: F.brand,
                        fontWeight: 600,
                        fontSize: 13,
                        color: C.ink,
                        marginBottom: 1,
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        color: C.muted,
                        marginBottom: 2,
                      }}
                    >
                      {d.freq}
                    </div>
                    <div
                      style={{
                        fontFamily: F.brand,
                        fontWeight: 400,
                        fontSize: 12,
                        color: C.body,
                        lineHeight: 1.4,
                      }}
                    >
                      {d.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 4: Next Session Preview */}
            <div
              style={{
                borderTop: `1px solid ${C.borderSub}`,
                paddingTop: 14,
                opacity: sectionOpacity(false),
                transition: 'opacity 0.4s',
              }}
            >
              <div style={sectionLabelStyle}>NEXT SESSION</div>
              <div
                style={{
                  fontFamily: F.brand,
                  fontWeight: 400,
                  fontSize: 13,
                  color: C.body,
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                Progress to 5-iron and evaluate transfer. If strike pattern holds,
                introduce variable target practice.
              </div>
              <span
                style={{
                  fontFamily: F.data,
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.conf,
                  background: C.confBg,
                  padding: '3px 8px',
                  borderRadius: 3,
                  letterSpacing: '0.04em',
                }}
              >
                SESSION GOAL MET — READY TO PROGRESS
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared styles

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: F.data,
  fontSize: 9,
  fontWeight: 700,
  color: C.accent,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 8,
};

const metricHeaderStyle: React.CSSProperties = {
  fontFamily: F.data,
  fontSize: 9,
  color: C.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
