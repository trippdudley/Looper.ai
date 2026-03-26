/**
 * Dashboard — Tab 1 (dark mode, WHOOP-inspired).
 * Hero handicap with animated arc, three-pillar ring gauges,
 * coach card, SG diverging bars with glow, practice-play gap,
 * recent activity with type indicators.
 */
import { useState } from 'react';
import { TrendingUp, Calendar, GraduationCap, AlertTriangle, ChevronRight } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import {
  player, handicapHistory, strokesGained,
  practicePlayGap, recentActivity,
} from '../data/tripp';
import Sparkline from '../components/shared/Sparkline';
import type { PlayerTab } from '../components/layout/BottomNav';

/* ── SVG Ring Gauge ── */
function RingGauge({ value, max, color, size = 52 }: { value: number; max: number; color: string; size?: number }): React.JSX.Element {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: 'stroke-dashoffset 800ms ease-out' }}
      />
    </svg>
  );
}

/* ── SG Diverging Bar ── */
function SGBar({ label, sg, delta, maxSg }: { label: string; sg: number; delta: number; maxSg: number }): React.JSX.Element {
  const isPositive = sg >= 0;
  const barPct = (Math.abs(sg) / maxSg) * 50;
  const barColor = isPositive ? C.conf : C.flag;
  const deltaColor = delta > 0 ? C.conf : delta < 0 ? C.flag : C.muted;
  const deltaText = delta > 0 ? `\u25B2 ${delta.toFixed(1)}` : delta < 0 ? `\u25BC ${Math.abs(delta).toFixed(1)}` : '--';

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: barColor, textShadow: `0 0 8px ${barColor}44` }}>
            {isPositive ? '+' : ''}{sg.toFixed(1)}
          </span>
          <span style={{ fontFamily: F.data, fontSize: 10, color: deltaColor }}>{deltaText}</span>
        </div>
      </div>
      <div style={{ height: 10, background: C.surfaceAlt, borderRadius: 5, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.border }} />
        <div
          style={{
            position: 'absolute', top: 1, bottom: 1,
            ...(isPositive
              ? { left: '50%', width: `${Math.max(barPct, 3)}%` }
              : { right: '50%', width: `${Math.max(barPct, 3)}%` }),
            background: barColor,
            borderRadius: isPositive ? '0 4px 4px 0' : '4px 0 0 4px',
            boxShadow: `0 0 12px ${barColor}44`,
            transition: 'width 600ms ease-out',
          }}
        />
      </div>
    </div>
  );
}

interface DashboardProps {
  onNavigate: (tab: PlayerTab) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps): React.JSX.Element {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const hcpValues = handicapHistory.map((h) => h.value);

  const sgCats = [
    strokesGained.driving,
    strokesGained.approach,
    strokesGained.shortGame,
    strokesGained.putting,
  ];
  const sgMax = Math.max(...sgCats.map((c) => Math.abs(c.sg)), 0.1);

  const typeColors: Record<string, string> = {
    round: C.conf,
    practice: C.accentBright,
    lesson: C.caution,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── Hero: Handicap Index with sparkline ─── */}
      <div style={S.cardHero}>
        <div style={{
          fontFamily: F.data, fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10,
        }}>
          HANDICAP INDEX
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <span style={{
            fontFamily: F.data, fontSize: 56, fontWeight: 700,
            color: C.ink, letterSpacing: '-.03em', lineHeight: 1,
            textShadow: `0 0 40px ${C.confGlow}`,
          }}>
            {player.handicap.toFixed(1)}
          </span>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.conf,
                textShadow: `0 0 8px ${C.confGlow}`,
              }}>
                {'\u25BC'} {Math.abs(player.handicapDelta).toFixed(1)}
              </span>
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 3 }}>
              Career low · 6 months
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Sparkline data={hcpValues} width={320} height={40} color={C.conf} />
        </div>
      </div>

      {/* ─── Three-Pillar Ring Gauges ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {/* Scoring */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px' }}>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <RingGauge value={Math.abs(player.sgPerRound)} max={10} color={C.flag} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={16} color={C.flag} />
            </div>
          </div>
          <div style={{ fontFamily: F.data, fontSize: 18, fontWeight: 700, color: C.ink }}>
            {player.sgPerRound.toFixed(1)}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 11, fontWeight: 500, color: C.body, marginTop: 2 }}>
            SG / Round
          </div>
        </div>

        {/* Practice */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px' }}>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <RingGauge value={player.practiceSessionsLast30} max={10} color={C.accentBright} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Calendar size={16} color={C.accentBright} />
            </div>
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink }}>
            {player.practiceSessionsLast30}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 11, fontWeight: 500, color: C.body, marginTop: 2 }}>
            Practice / 30d
          </div>
        </div>

        {/* Coaching */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px' }}>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <RingGauge value={player.coach.lessonsLast30} max={4} color={C.caution} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap size={16} color={C.caution} />
            </div>
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink }}>
            {player.coach.lessonsLast30}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 11, fontWeight: 500, color: C.body, marginTop: 2 }}>
            Lessons / 30d
          </div>
        </div>
      </div>

      {/* ─── Coach Connection Card ─── */}
      <div
        style={{
          ...S.cardElevated,
          borderLeft: `3px solid ${C.accentBright}`,
          borderRadius: '0 8px 8px 0',
          background: C.accentBg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>{player.coach.name}</div>
          <span style={{
            fontFamily: F.data, fontSize: 9, fontWeight: 700,
            color: C.conf, background: C.confBg,
            padding: '2px 8px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '.06em',
            boxShadow: `0 0 8px ${C.confGlow}`,
          }}>
            Connected
          </span>
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body }}>{player.coach.academy}</div>
        <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 4 }}>
          Last lesson: {player.coach.lastLessonDate} · {player.coach.lastLessonTopic}
        </div>
      </div>

      {/* ─── Strokes Gained Diverging Bars ─── */}
      <div style={S.cardElevated}>
        <div style={{
          fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 14,
        }}>
          Strokes Gained Breakdown
        </div>
        {sgCats.map((cat) => (
          <SGBar key={cat.label} label={cat.label} sg={cat.sg} delta={cat.delta} maxSg={sgMax} />
        ))}
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 4 }}>
          vs. scratch benchmark · {player.totalRounds} rounds
        </div>
      </div>

      {/* ─── Practice-Play Gap ─── */}
      <div
        style={{
          ...S.cardElevated,
          borderLeft: `3px solid ${C.caution}`,
          borderRadius: '0 8px 8px 0',
          background: C.cautionBg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <AlertTriangle size={14} color={C.caution} style={{ filter: `drop-shadow(0 0 4px ${C.caution}66)` }} />
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.08em', color: C.caution,
          }}>
            Practice-Play Gap
          </span>
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 12 }}>
          {practicePlayGap.text}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Practice allocation */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 4 }}>Practice time</div>
            <div style={{ height: 8, background: C.surfaceAlt, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${practicePlayGap.practiceFullSwing * 100}%`, background: C.muted, borderRadius: '4px 0 0 4px' }} />
              <div style={{ width: `${practicePlayGap.practiceShortGame * 100}%`, background: C.caution, borderRadius: '0 4px 4px 0', boxShadow: `0 0 8px ${C.caution}44` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>Full {Math.round(practicePlayGap.practiceFullSwing * 100)}%</span>
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.caution }}>Short {Math.round(practicePlayGap.practiceShortGame * 100)}%</span>
            </div>
          </div>
          {/* SG opportunity */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 4 }}>SG opportunity</div>
            <div style={{ height: 8, background: C.surfaceAlt, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${practicePlayGap.sgOpportunityFullSwing * 100}%`, background: C.muted, borderRadius: '4px 0 0 4px' }} />
              <div style={{ width: `${practicePlayGap.sgOpportunityShortGame * 100}%`, background: C.flag, borderRadius: '0 4px 4px 0', boxShadow: `0 0 8px ${C.flag}44` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>Full {Math.round(practicePlayGap.sgOpportunityFullSwing * 100)}%</span>
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.flag }}>Short {Math.round(practicePlayGap.sgOpportunityShortGame * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recent Activity Feed ─── */}
      <div>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 10 }}>
          Recent Activity
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentActivity.map((item) => {
            const isHovered = hoveredActivity === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredActivity(item.id)}
                onMouseLeave={() => setHoveredActivity(null)}
                style={{
                  ...S.card,
                  padding: '11px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  background: isHovered ? C.surfaceAlt : C.surface,
                  transition: 'background 150ms ease, box-shadow 150ms ease',
                  boxShadow: isHovered ? `0 0 16px rgba(0,0,0,0.3), inset 0 0 0 1px ${C.border}` : undefined,
                }}
              >
                {/* Type dot with glow */}
                <div
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: typeColors[item.type] || C.muted,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${(typeColors[item.type] || C.muted)}66`,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: F.brand, fontSize: 11, color: C.muted, marginTop: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.insight}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
                  <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{item.date.slice(5)}</span>
                  {item.metric && (
                    <span style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.ink }}>
                      {item.metric}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice Brief CTA */}
      <button
        onClick={() => onNavigate('practice')}
        style={{
          background: C.accentGrad,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '16px',
          boxShadow: `0 4px 20px ${C.confGlow}`,
          transition: 'box-shadow 200ms ease',
        }}
      >
        <span style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>
          Get Today's Practice Brief
        </span>
        <ChevronRight size={18} color="#FFFFFF" />
      </button>
    </div>
  );
}
