import { C, F, S, fmtDelta } from '../data/tokens';
import { player } from '../data/player';
import { timelineEvents } from '../data/timeline';
import SectionLabel from '../components/shared/SectionLabel';
import KpiTile from '../components/shared/KpiTile';
import Sparkline from '../components/shared/Sparkline';
import SourcePill from '../components/shared/SourcePill';
import TypeIcon from '../components/timeline/TypeIcon';

interface DashboardProps {
  onNavigateToJourney?: () => void;
}

export default function Dashboard({ onNavigateToJourney }: DashboardProps) {
  // For handicap, lower is better — invert color logic
  const hcpRaw = fmtDelta(player.handicapDelta, 'sg');
  const hcpDelta = {
    text: hcpRaw.text,
    color: player.handicapDelta < 0 ? C.conf : player.handicapDelta > 0 ? C.flag : C.muted,
  };

  // SG bars
  const sgCategories = [
    { label: 'Driving', value: player.strokesGained.driving },
    { label: 'Approach', value: player.strokesGained.approach },
    { label: 'Short Game', value: player.strokesGained.shortGame },
    { label: 'Putting', value: player.strokesGained.putting },
  ];

  const sgMax = Math.max(...sgCategories.map((c) => Math.abs(c.value)));

  // Last round
  const lastRound = timelineEvents.find((e) => e.type === 'round');

  // Recent timeline (last 5)
  const recentEvents = timelineEvents.slice(0, 5);

  return (
    <div>
      {/* Hero card — Handicap + Player Quality */}
      <div
        style={{
          ...S.card,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Handicap */}
        <div>
          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
            HANDICAP INDEX
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: F.data, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: '-.01em' }}>
              {player.handicap}
            </span>
            <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: hcpDelta.color }}>
              {hcpDelta.text}
            </span>
          </div>
          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 2 }}>
            Last 90 days
          </div>
          <Sparkline data={player.handicapHistory} width={100} height={24} color={C.conf} />
        </div>

        {/* Player Quality */}
        <div>
          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
            PLAYER QUALITY
          </div>
          <div style={{ fontFamily: F.data, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: '-.01em' }}>
            {player.playerQuality}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 2 }}>
            0-100 scale (100 = tour avg)
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: C.surfaceAlt, borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${player.playerQuality}%`, background: C.accent, borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Coaching plan card */}
      {player.coach && (
        <div
          style={{
            ...S.card,
            borderLeft: `3px solid ${C.accent}`,
            borderRadius: '0 12px 12px 0',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>
              Coaching Plan
            </div>
            <span style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              color: C.conf, background: C.confBg,
              padding: '2px 8px', borderRadius: 3,
              textTransform: 'uppercase', letterSpacing: '.06em',
            }}>
              Active
            </span>
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, marginBottom: 4 }}>
            {player.coach.plan}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
            Coach {player.coach.name} · Phase {player.coach.phase}/{player.coach.totalPhases} · Next: {player.coach.nextSession}
          </div>
        </div>
      )}

      {/* Strokes Gained breakdown */}
      <SectionLabel number="01" text="WHERE YOU'RE GAINING AND LOSING" />
      <div style={{ ...S.card, marginBottom: 16 }}>
        {sgCategories.map((cat) => {
          const pct = sgMax > 0 ? (Math.abs(cat.value) / sgMax) * 100 : 0;
          const isPositive = cat.value >= 0;
          return (
            <div key={cat.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink }}>
                  {cat.label}
                </span>
                <span style={{
                  fontFamily: F.data, fontSize: 12, fontWeight: 700,
                  color: isPositive ? C.conf : C.flag,
                }}>
                  {isPositive ? '+' : ''}{cat.value.toFixed(1)}
                </span>
              </div>
              <div style={{ height: 6, background: C.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(pct, 4)}%`,
                    background: isPositive ? C.conf : C.flag,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          );
        })}
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 4 }}>
          vs. {player.strokesGained.benchmark} benchmark · {player.strokesGained.sampleSize}
        </div>
      </div>

      {/* What to do next */}
      <div
        style={{
          background: C.accentBg,
          borderLeft: `2px solid ${C.accent}`,
          borderRadius: 0,
          padding: '12px 14px',
          marginBottom: 16,
        }}
      >
        <div style={{
          fontFamily: F.data, fontSize: 10, fontWeight: 700,
          letterSpacing: '.06em', textTransform: 'uppercase',
          color: C.accent, marginBottom: 4,
        }}>
          WHAT TO DO NEXT
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5 }}>
          Your approach game is costing you 1.4 strokes per round. Coach Thompson's gate drill is tightening dispersion — one more session before Thursday's lesson.{' '}
          <span style={{ color: C.accent, fontWeight: 500 }}>7-iron, 30 balls, target ±5.0 yds.</span>
        </div>
      </div>

      {/* Last round summary */}
      {lastRound && (
        <>
          <SectionLabel number="02" text="LAST ROUND" />
          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2 }}>
              {lastRound.title}
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 10 }}>
              {lastRound.date} · {lastRound.time}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
              {lastRound.metrics.slice(0, 3).map((m, i) => (
                <KpiTile key={i} label={m.label} value={m.value} color={
                  m.status === 'best' || m.status === 'improving' || m.status === 'good' ? C.conf :
                  m.status === 'poor' || m.status === 'regression' ? C.flag : C.accent
                } />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recent timeline */}
      <SectionLabel number="03" text="RECENT ACTIVITY" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {recentEvents.map((ev) => (
          <div
            key={ev.id}
            style={{
              ...S.card,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <TypeIcon type={ev.type} size={24} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
                <SourcePill source={ev.source} size="sm" />
                <span style={{ fontFamily: F.data, fontSize: 8, color: C.muted }}>{ev.date.slice(5)}</span>
              </div>
              <div style={{
                fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {ev.title}
              </div>
            </div>
            {ev.metrics[0] && (
              <span style={{ fontFamily: F.data, fontSize: 12, fontWeight: 700, color: C.ink, flexShrink: 0 }}>
                {ev.metrics[0].value}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onNavigateToJourney}
        style={{
          fontFamily: F.brand,
          fontSize: 13,
          fontWeight: 500,
          color: C.accent,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 0',
          width: '100%',
          textAlign: 'center',
        }}
      >
        View full timeline →
      </button>
    </div>
  );
}
