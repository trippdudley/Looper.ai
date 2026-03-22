import { C, CD, F, vis, fadeIn, fadeInOut } from './tokens';
import { useIsMobile } from '../../hooks/useIsMobile';

// Timing triggers (ms from scene start)
const T = {
  titleCard:    400,
  titleFadeOut: 3200,     // 2.8s hold (was 2s)
  uiReveal:     4000,
  spot1:        7000,     // more time to absorb UI before spotlights
  spot2:        11000,    // 4s per spotlight (was 3s)
  spot3:        15000,
  spotsOff:     20000,    // 5s final spotlight hold
};

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function Sparkline({
  data,
  color,
  width = 80,
  height = 28,
  strokeWidth = 1.5,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      style={{
        fontFamily: F.data,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        color,
        background: bg,
        padding: '2px 7px',
        borderRadius: 4,
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </span>
  );
}

function MetricRow({
  label,
  value,
  delta,
  deltaColor,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
      }}
    >
      <span
        style={{
          fontFamily: F.data,
          fontSize: 10,
          color: C.body,
        }}
      >
        {label}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontFamily: F.data,
            fontSize: 11,
            fontWeight: 700,
            color: C.ink,
          }}
        >
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontFamily: F.data,
              fontSize: 9,
              fontWeight: 700,
              color: deltaColor || C.conf,
            }}
          >
            {delta}
          </span>
        )}
      </span>
    </div>
  );
}

function SpotlightOverlay({
  label,
  sublabel,
  style,
}: {
  label: string;
  sublabel: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute' as const,
        top: -52,
        left: 12,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 4,
        zIndex: 10,
        maxWidth: 340,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: F.data,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: '#FFFFFF',
          background: C.accent,
          padding: '4px 10px',
          borderRadius: 4,
          alignSelf: 'flex-start',
          boxShadow: '0 2px 12px rgba(13,124,102,0.3)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: F.brand,
          fontSize: 11,
          fontWeight: 500,
          color: C.ink,
          background: 'rgba(255,255,255,0.95)',
          padding: '4px 10px',
          borderRadius: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          lineHeight: 1.4,
        }}
      >
        {sublabel}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card wrapper with spotlight logic
// ---------------------------------------------------------------------------

function Card({
  children,
  active,
  spotlight,
  style,
}: {
  children: React.ReactNode;
  active: boolean;
  spotlight?: { label: string; sublabel: string };
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'relative' as const,
        background: C.surface,
        border: active ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 16,
        boxShadow: active ? `0 0 0 2px ${C.accentBg}` : 'none',
        opacity: spotlight === undefined ? 1 : active ? 1 : 0.15,
        transition: 'opacity 0.3s, border-color 0.3s, box-shadow 0.3s',
        ...style,
      }}
    >
      {active && spotlight && (
        <SpotlightOverlay label={spotlight.label} sublabel={spotlight.sublabel} />
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Determine active spotlight
// ---------------------------------------------------------------------------

function getSpotlight(elapsed: number): 0 | 1 | 2 | 3 {
  if (elapsed >= T.spotsOff) return 0;
  if (elapsed >= T.spot3) return 3;
  if (elapsed >= T.spot2) return 2;
  if (elapsed >= T.spot1) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Scene2_PlayerRecord({ elapsed }: { elapsed: number }) {
  const isMobile = useIsMobile();
  const spot = getSpotlight(elapsed);
  const spotlightActive = spot > 0;

  // Background transition: dark -> light over 800ms starting at titleFadeOut
  const bgProgress =
    elapsed < T.titleFadeOut
      ? 0
      : Math.min(1, (elapsed - T.titleFadeOut) / 800);
  const bgOpacity = bgProgress;

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
      {/* Light bg overlay for transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.bg,
          opacity: bgOpacity,
          transition: 'none',
        }}
      />

      {/* Title card */}
      {vis(elapsed, T.titleCard) && elapsed < T.titleFadeOut + 600 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...fadeInOut(elapsed, T.titleCard, T.titleFadeOut),
          }}
        >
          <div
            style={{
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 24,
              lineHeight: 1.5,
              color: bgProgress < 0.5 ? CD.ink : C.ink,
              textAlign: 'center',
              maxWidth: 500,
            }}
          >
            Every lesson builds the player's record.
          </div>
        </div>
      )}

      {/* Product UI */}
      {vis(elapsed, T.uiReveal) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 24px',
            overflowY: 'auto',
            ...fadeIn(elapsed, T.uiReveal, 800),
          }}
        >
          <div style={{ maxWidth: 900, width: '100%' }}>
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 16 }}>
                  <span style={{ color: C.ink }}>LOOPER</span>
                  <span style={{ color: C.accent }}>.AI</span>
                </div>
                <span
                  style={{
                    fontFamily: F.data,
                    fontSize: 9,
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    color: C.muted,
                    textTransform: 'uppercase' as const,
                  }}
                >
                  COACHING OS
                </span>
              </div>
              <span
                style={{
                  fontFamily: F.data,
                  fontSize: 9,
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  color: C.muted,
                  textTransform: 'uppercase' as const,
                }}
              >
                COACH: M. THOMPSON
              </span>
            </div>

            {/* Player Header Card */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: isMobile ? 12 : 16,
                marginBottom: 14,
                display: 'flex',
                flexDirection: isMobile ? 'column' as const : 'row' as const,
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? 10 : 0,
                opacity: spotlightActive ? 0.15 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Left: avatar + info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: C.accentBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: F.brand,
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.accent,
                  }}
                >
                  MN
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: F.brand,
                      fontWeight: 700,
                      fontSize: 16,
                      color: C.ink,
                    }}
                  >
                    Moe Norman
                  </div>
                  <div
                    style={{
                      fontFamily: F.data,
                      fontSize: 10,
                      color: C.muted,
                    }}
                  >
                    12 sessions &middot; Last visit: Mar 7, 2026
                  </div>
                </div>
              </div>
              {/* Right: handicap + sparkline + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontFamily: F.data,
                      fontWeight: 700,
                      fontSize: 18,
                      color: C.ink,
                    }}
                  >
                    8.4
                  </div>
                </div>
                <Sparkline
                  data={[12.1, 11.3, 10.8, 10.2, 9.7, 9.1, 8.9, 8.4]}
                  color={C.conf}
                  width={64}
                  height={24}
                />
                <Badge label={'\u25B2 IMPROVING'} color={C.conf} bg={C.confBg} />
              </div>
            </div>

            {/* Two-Column Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 14,
                alignItems: 'start',
              }}
            >
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                {/* Card 1: Last Session Summary (spot1) */}
                <Card
                  active={spot === 1}
                  spotlight={
                    spotlightActive
                      ? { label: 'LAST SESSION SUMMARY', sublabel: 'What was worked on, key feels, and what to practice. This is the player\u2019s takeaway.' }
                      : undefined
                  }
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                      }}
                    >
                      SESSION 12 &middot; MAR 7, 2026
                    </span>
                    <Badge label="7-IRON / 5-IRON" color={C.accent} bg={C.accentBg} />
                  </div>

                  {/* Focus */}
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 4,
                      }}
                    >
                      FOCUS
                    </div>
                    <div
                      style={{
                        fontFamily: F.brand,
                        fontWeight: 600,
                        fontSize: 14,
                        color: C.ink,
                        marginBottom: 4,
                      }}
                    >
                      Strike consistency — mid-iron contact
                    </div>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: C.body,
                      }}
                    >
                      Improving low-point control to achieve ball-first contact with mid-irons.
                      Focus on ground interaction pattern and divot placement.
                    </div>
                  </div>

                  {/* Key Feels & Insights */}
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 6,
                      }}
                    >
                      KEY FEELS &amp; INSIGHTS
                    </div>
                    {[
                      '"Brush the grass past the ball" \u2014 external cue for low-point control',
                      'Pressure shift to lead foot earlier in transition \u2014 felt like 60/40 at impact',
                      'Strike moved from 4mm toe to near-center by shot 12',
                    ].map((text, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'flex-start',
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: C.accent,
                            marginTop: 5,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: F.data,
                            fontSize: 10,
                            lineHeight: 1.5,
                            color: C.body,
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Drills */}
                  <div
                    style={{
                      borderTop: `1px solid ${C.borderSub}`,
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 6,
                      }}
                    >
                      RECOMMENDED DRILLS
                    </div>
                    {[
                      { name: 'Gate drill', desc: 'Two tees 4" apart, strike between them' },
                      { name: 'Towel strike drill', desc: 'Towel 3" behind ball, miss it on downswing' },
                      { name: 'Feet-together 9-iron', desc: 'Groove centered low-point without sway' },
                    ].map((drill, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <span
                          style={{
                            fontFamily: F.brand,
                            fontWeight: 600,
                            fontSize: 11,
                            color: C.ink,
                          }}
                        >
                          {drill.name}
                        </span>
                        <span
                          style={{
                            fontFamily: F.data,
                            fontSize: 10,
                            color: C.muted,
                            marginLeft: 6,
                          }}
                        >
                          {drill.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Card 2: Session History (spot3) */}
                <Card
                  active={spot === 3}
                  spotlight={
                    spotlightActive
                      ? { label: 'PERSISTENT RECORD', sublabel: 'Every session builds on the last. Nothing is lost.' }
                      : undefined
                  }
                >
                  <div
                    style={{
                      fontFamily: F.data,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase' as const,
                      color: C.muted,
                      marginBottom: 10,
                    }}
                  >
                    SESSION HISTORY
                  </div>
                  {[
                    { num: 12, date: 'Mar 7', focus: 'Strike consistency', badge: 'External cue', badgeColor: C.conf, badgeBg: C.confBg },
                    { num: 11, date: 'Feb 21', focus: 'Low-point control', badge: 'Constraint drill', badgeColor: C.accent, badgeBg: C.accentBg },
                    { num: 10, date: 'Feb 7', focus: 'Face-to-path gap', badge: 'Internal cue', badgeColor: C.caution, badgeBg: C.cautionBg },
                    { num: 9, date: 'Jan 24', focus: 'Driver dispersion', badge: 'Equipment change', badgeColor: C.body, badgeBg: C.surfaceAlt },
                    { num: 8, date: 'Jan 10', focus: 'Wedge distance control', badge: 'Variable practice', badgeColor: C.accent, badgeBg: C.accentBg },
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '6px 0',
                        borderBottom: i < 4 ? `1px solid ${C.borderSub}` : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          border: `1px solid ${C.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: F.data,
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.ink,
                          flexShrink: 0,
                        }}
                      >
                        {row.num}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: F.brand,
                            fontWeight: 600,
                            fontSize: 11,
                            color: C.ink,
                          }}
                        >
                          {row.focus}
                        </div>
                        <div
                          style={{
                            fontFamily: F.data,
                            fontSize: 9,
                            color: C.muted,
                          }}
                        >
                          {row.date}
                        </div>
                      </div>
                      <Badge label={row.badge} color={row.badgeColor} bg={row.badgeBg} />
                    </div>
                  ))}
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                {/* Card: On the Course Trends (spot2) */}
                <Card
                  active={spot === 2}
                  spotlight={
                    spotlightActive
                      ? { label: 'ON THE COURSE TRENDS', sublabel: 'GHIN + Arccos data flows in automatically. The coach sees what happened between lessons.' }
                      : undefined
                  }
                >
                  <div
                    style={{
                      fontFamily: F.data,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase' as const,
                      color: C.muted,
                      marginBottom: 12,
                    }}
                  >
                    ON THE COURSE TRENDS &middot; MAR 7&ndash;14
                  </div>

                  {/* GHIN sub-card */}
                  <div
                    style={{
                      background: C.surfaceAlt,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 8,
                      }}
                    >
                      GHIN &middot; 3 rounds posted
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
                          Scoring Avg
                        </div>
                        <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                          82.3
                        </div>
                        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.conf }}>
                          {'\u25B2'}1.2
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
                          Best Round
                        </div>
                        <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                          79
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
                          Differential
                        </div>
                        <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                          7.8
                        </div>
                        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.conf }}>
                          {'\u25B2'}0.6
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arccos sub-card */}
                  <div
                    style={{
                      background: C.surfaceAlt,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 8,
                      }}
                    >
                      ARCCOS &middot; 54 holes tracked
                    </div>
                    <MetricRow label="Fairways" value="64%" delta={'\u25B2 8%'} deltaColor={C.conf} />
                    <MetricRow label="GIR" value="44%" delta={'\u25B2 6%'} deltaColor={C.conf} />
                    <MetricRow label="SG: Approach" value="+0.3" delta={'\u25B2 0.8'} deltaColor={C.conf} />
                    <MetricRow label="SG: Around Green" value="-0.4" delta={'\u25BC 0.2'} deltaColor={C.flag} />
                    <MetricRow label="Putts/GIR" value="1.82" delta={'\u25B2 0.06'} deltaColor={C.conf} />
                  </div>

                  {/* Scoring Trend sub-card */}
                  <div
                    style={{
                      background: C.surfaceAlt,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.muted,
                        marginBottom: 8,
                      }}
                    >
                      SCORING TREND
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Sparkline
                        data={[88, 86, 84, 85, 83, 82, 84, 79]}
                        color={C.conf}
                        width={120}
                        height={32}
                        strokeWidth={2}
                      />
                      <span
                        style={{
                          fontFamily: F.data,
                          fontSize: 16,
                          fontWeight: 700,
                          color: C.ink,
                        }}
                      >
                        79
                      </span>
                      <Badge label={'\u25B2 Personal best'} color={C.conf} bg={C.confBg} />
                    </div>
                  </div>

                  {/* AI Pattern Detection */}
                  <div
                    style={{
                      background: C.accentBg,
                      borderLeft: `3px solid ${C.accent}`,
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: C.accent,
                        marginBottom: 6,
                      }}
                    >
                      AI PATTERN DETECTION
                    </div>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: C.ink,
                      }}
                    >
                      Consistent miss right with mid-irons correlates with SG: Approach
                      improvement when strike is centered. Session focus on low-point
                      control is directly improving on-course performance.
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
