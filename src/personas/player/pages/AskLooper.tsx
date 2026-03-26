/**
 * Home — Landing page: Three Pillars + Dashboard data.
 * WHOOP-inspired golf health dashboard. Play / Practice / Coaching.
 */
import { MessageCircle, Users, ChevronRight } from 'lucide-react';
import { C, F, S, fmtDelta } from '../data/tokens';
import {
  player, strokesGained, handicapHistory, foresightSummary,
  quarterlyTrend, topInsight,
} from '../data/tripp';
import Sparkline from '../components/shared/Sparkline';
import ConfBadge from '../components/shared/ConfBadge';
import type { PlayerTab } from '../components/layout/BottomNav';

interface AskLooperProps {
  onNavigate: (tab: PlayerTab) => void;
}

// --- SG Diverging Bar ---
function SGBar({ label, sg, delta }: { label: string; sg: number; delta: number }): React.JSX.Element {
  const maxSG = 2.0;
  const pct = Math.min(Math.abs(sg) / maxSG, 1) * 50;
  const isPos = sg >= 0;
  const color = isPos ? C.conf : C.flag;
  const d = fmtDelta(delta, 'sg');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <span style={{ fontFamily: F.brand, fontSize: 13, color: C.body, minWidth: 110 }}>{label}</span>
      <div style={{ flex: 1, height: 10, background: C.surfaceAlt, borderRadius: 5, position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: C.border }} />
        <div style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          borderRadius: 5,
          background: color,
          boxShadow: `0 0 8px ${isPos ? C.confGlow : C.flagGlow}`,
          ...(isPos ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }),
        }} />
      </div>
      <span style={{ fontFamily: F.data, fontSize: 12, fontWeight: 700, color, minWidth: 40, textAlign: 'right' }}>{sg > 0 ? '+' : ''}{sg.toFixed(1)}</span>
      <span style={{ fontFamily: F.data, fontSize: 10, color: d.color, minWidth: 36 }}>{d.text}</span>
    </div>
  );
}

// --- Scoring Trend Chart ---
function ScoringTrendChart(): React.JSX.Element {
  const data = quarterlyTrend;
  const w = 320;
  const h = 80;
  const pad = { t: 8, b: 20, l: 4, r: 4 };
  const diffs = data.map(d => d.avgDiff);
  const minD = Math.min(...diffs) - 0.5;
  const maxD = Math.max(...diffs) + 0.5;
  const points = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r),
    y: pad.t + ((d.avgDiff - minD) / (maxD - minD)) * (h - pad.t - pad.b),
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
  const areaPath = linePath + `L${points[points.length - 1].x},${h - pad.b}L${points[0].x},${h - pad.b}Z`;
  const gradId = 'trend-grad';
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 10}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accentBright} stopOpacity={0.25} />
          <stop offset="100%" stopColor={C.accentBright} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={C.accentBright} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 4px ${C.confGlow})` }} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={C.accentBright} opacity={i === points.length - 1 ? 1 : 0.5} />
      ))}
      {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d, idx) => {
        const i = data.indexOf(d);
        return <text key={idx} x={points[i].x} y={h} textAnchor="middle" style={{ fontFamily: F.data, fontSize: 8, fill: C.muted }}>{d.quarter.replace('20', "'")}</text>;
      })}
      <text x={w - pad.r} y={pad.t + 8} textAnchor="end" style={{ fontFamily: F.data, fontSize: 8, fill: C.muted }}>{'\u2193'} better</text>
    </svg>
  );
}

// --- Practice Allocation Bar ---
function PracticeAllocationBar(): React.JSX.Element {
  const cats = foresightSummary.categories2025;
  const colors = [C.conf, C.accentBright, C.accent, C.caution, C.flag, C.body, C.muted];
  return (
    <div>
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: C.surfaceAlt }}>
        {cats.map((c, i) => (
          <div key={i} style={{ width: `${c.pct * 100}%`, background: colors[i], minWidth: c.pct > 0.03 ? 2 : 0 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 6 }}>
        {cats.filter(c => c.pct >= 0.05).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: colors[i] }} />
            <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{c.category} {(c.pct * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function AskLooper({ onNavigate }: AskLooperProps): React.JSX.Element {
  const hcpValues = handicapHistory.map(h => h.value);
  const sgCats = [strokesGained.driving, strokesGained.approach, strokesGained.shortGame, strokesGained.putting];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Context bar */}
      <div style={{ ...S.cardInner, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', padding: '10px 14px' }}>
        <span style={{ fontFamily: F.brand, fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Record</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'HI', value: player.handicap.toFixed(1), color: C.conf },
            { label: 'SG/Rd', value: player.sgPerRound.toFixed(1), color: C.flag },
            { label: 'Low', value: player.careerLow.toFixed(1), color: C.accentBright },
            { label: 'Rounds', value: String(player.totalRounds), color: C.body },
            { label: 'Sessions', value: '208', color: C.body },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: F.brand, fontSize: 10, color: C.muted }}>{item.label}</span>
              <span style={{ fontFamily: F.data, fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === HERO INSIGHT === */}
      {(
        <div style={{ ...S.cardHero, marginBottom: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, color: C.accentBright, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Looper Insight</span>
            <ConfBadge value={topInsight.confidence} />
          </div>
          <p style={{ fontFamily: F.brand, fontSize: 14, color: C.ink, lineHeight: 1.7, margin: 0 }}>
            {topInsight.text}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {topInsight.sources.map((s, i) => (
              <span key={i} style={{ fontFamily: F.data, fontSize: 9, color: C.muted, background: C.surfaceAlt, padding: '2px 8px', borderRadius: 10 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* === THREE PILLARS === */}
      {(
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {/* PLAY */}
          <button onClick={() => onNavigate('activity')} style={{ ...S.card, cursor: 'pointer', textAlign: 'left', transition: 'border-color 150ms' }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.conf, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Play</span>
            <div style={{ fontFamily: F.data, fontSize: 26, fontWeight: 700, color: C.ink, margin: '4px 0 2px' }}>{player.handicap.toFixed(1)}</div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 6 }}>handicap index</div>
            <Sparkline data={hcpValues} width={80} height={24} color={C.conf} />
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 4 }}>{player.totalRounds} rounds</div>
          </button>

          {/* PRACTICE */}
          <button onClick={() => onNavigate('practice')} style={{ ...S.card, cursor: 'pointer', textAlign: 'left', transition: 'border-color 150ms' }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
            <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accentBright, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Practice</span>
            <div style={{ fontFamily: F.brand, fontSize: 26, fontWeight: 700, color: C.ink, margin: '4px 0 2px' }}>208</div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 6 }}>sessions tracked</div>
            <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: C.surfaceAlt }}>
              {foresightSummary.categories2025.slice(0, 4).map((c, i) => (
                <div key={i} style={{ width: `${c.pct * 100}%`, background: [C.conf, C.accentBright, C.accent, C.caution][i] }} />
              ))}
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 4 }}>6,671 shots</div>
          </button>

          {/* COACHING */}
          <div style={{ ...S.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.caution, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Coaching</span>
            <div style={{ margin: '8px 0' }}>
              <Users size={20} color={C.muted} style={{ marginBottom: 4 }} />
              <div style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 600, color: C.body }}>Connect a Coach</div>
              <div style={{ fontFamily: F.brand, fontSize: 10, color: C.muted, lineHeight: 1.4, marginTop: 2 }}>Close the loop between your practice and your lessons.</div>
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
              Learn more <ChevronRight size={10} />
            </div>
          </div>
        </div>
      )}

      {/* === DASHBOARD DATA === */}
      {(
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Your Game Shape */}
          <div style={S.cardElevated}>
            <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 4 }}>Your Game Shape</div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 12 }}>vs. scratch benchmark · {player.totalRounds} rounds</div>
            {sgCats.map(c => <SGBar key={c.label} label={c.label} sg={c.sg} delta={c.delta} />)}
            <p style={{ fontFamily: F.editorial, fontSize: 13, fontStyle: 'italic', color: C.body, margin: '12px 0 0', lineHeight: 1.5 }}>
              "Your strokes gained profile resembles Dustin Johnson's shape — elite distance, above-average ball-striking, but short game and putting are the limiters."
            </p>
          </div>

          {/* Practice Allocation */}
          <div style={S.card}>
            <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 2 }}>Practice Allocation</div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 10 }}>2025 · 787 shots across 13 sessions</div>
            <PracticeAllocationBar />
            <p style={{ fontFamily: F.brand, fontSize: 11, color: C.muted, margin: '8px 0 0' }}>Short game and putting: not tracked on Foresight</p>
          </div>

          {/* Scoring Trend */}
          <div style={S.card}>
            <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 2 }}>Scoring Trend</div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 8 }}>Average differential by quarter · 11 quarters</div>
            <ScoringTrendChart />
          </div>

          {/* Practice + Play Connection */}
          <div style={S.cardElevated}>
            <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Practice + Play</div>
            <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, margin: '0 0 12px' }}>
              Your 2025 practice emphasizes full swing (94% of tracked shots). Most of your scoring opportunity is inside 50 yards (77% of SG loss). Here is how practice time and scoring opportunity compare.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase' }}>Practice Time</div>
                <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: '94%', background: C.body }} />
                  <div style={{ width: '6%', background: C.accentBright }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>Full 94%</span>
                  <span style={{ fontFamily: F.data, fontSize: 9, color: C.accentBright }}>Short 6%</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase' }}>SG Opportunity</div>
                <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: '23%', background: C.body }} />
                  <div style={{ width: '77%', background: C.accentBright }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>Full 23%</span>
                  <span style={{ fontFamily: F.data, fontSize: 9, color: C.accentBright }}>Short 77%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ask Looper CTA */}
          <button onClick={() => onNavigate('ask')} style={{
            ...S.cardElevated, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            border: `1px solid ${C.accent}`, transition: 'all 150ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBright; e.currentTarget.style.boxShadow = `0 0 20px ${C.confGlow}`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = S.cardElevated.boxShadow as string; }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 16px ${C.confGlow}` }}>
              <MessageCircle size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>Ask Looper about your game</div>
              <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body }}>Practice plans, performance insights, course strategy</div>
            </div>
            <ChevronRight size={16} color={C.muted} style={{ marginLeft: 'auto' }} />
          </button>

        </div>
      )}

    </div>
  );
}
