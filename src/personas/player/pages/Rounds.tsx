/**
 * Rounds — Tab 5 (dark mode, WHOOP-inspired).
 * Score prominently displayed, SG horizontal bars with glow,
 * expandable detail with GIR/FIR ring gauges, connected insights.
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { rounds, bestWorstComparison } from '../data/tripp';
import ConfBadge from '../components/shared/ConfBadge';

/* ── Mini Ring Gauge for GIR/FIR ── */
function StatRing({ value, benchmark, label, size = 64 }: { value: number; benchmark: number; label: string; size?: number }): JSX.Element {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value, 1);
  const offset = circ * (1 - pct);
  const color = value >= benchmark ? C.conf : value >= benchmark * 0.9 ? C.caution : C.flag;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={4} />
        {/* Benchmark marker */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={4}
          strokeDasharray={`${circ * benchmark} ${circ * (1 - benchmark)}`}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} opacity={0.3} />
        {/* Value arc */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: 'stroke-dashoffset 600ms ease-out' }} />
        <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, fill: C.ink }}>
          {Math.round(value * 100)}%
        </text>
      </svg>
      <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </div>
    </div>
  );
}

export default function Rounds(): JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(rounds[0]?.id || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div>
        <div style={{ fontFamily: F.brand, fontSize: 22, fontWeight: 700, color: C.ink }}>Rounds</div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.muted, marginTop: 3 }}>
          {rounds.length} recent rounds
        </div>
      </div>

      {/* ─── Round Patterns Card ─── */}
      <div style={S.card}>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 2 }}>Round Patterns</div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, marginBottom: 14 }}>What your best and worst rounds have in common</div>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* Best 5 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: C.conf, marginBottom: 8 }}>Best 5 Rounds</div>
            <div style={{ fontFamily: F.data, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>{bestWorstComparison.best5.avgScore.toFixed(1)}</div>
            {([
              { label: 'Driving', value: bestWorstComparison.best5.avgDriving },
              { label: 'Approach', value: bestWorstComparison.best5.avgApproach },
              { label: 'Short Game', value: bestWorstComparison.best5.avgShortGame },
              { label: 'Putting', value: bestWorstComparison.best5.avgPutting },
            ] as const).map((cat) => {
              const color = cat.value >= 0 ? C.conf : C.flag;
              const maxVal = 2.0;
              const barW = Math.min(Math.abs(cat.value) / maxVal * 100, 100);
              return (
                <div key={cat.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontFamily: F.brand, fontSize: 11, color: C.body }}>{cat.label}</span>
                    <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color }}>{cat.value > 0 ? '+' : ''}{cat.value.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 8, background: C.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(barW, 4)}%`, background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}44` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Worst 5 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: C.flag, marginBottom: 8 }}>Worst 5 Rounds</div>
            <div style={{ fontFamily: F.data, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>{bestWorstComparison.worst5.avgScore.toFixed(1)}</div>
            {([
              { label: 'Driving', value: bestWorstComparison.worst5.avgDriving },
              { label: 'Approach', value: bestWorstComparison.worst5.avgApproach },
              { label: 'Short Game', value: bestWorstComparison.worst5.avgShortGame },
              { label: 'Putting', value: bestWorstComparison.worst5.avgPutting },
            ] as const).map((cat) => {
              const color = cat.value >= 0 ? C.conf : C.flag;
              const maxVal = 2.0;
              const barW = Math.min(Math.abs(cat.value) / maxVal * 100, 100);
              return (
                <div key={cat.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontFamily: F.brand, fontSize: 11, color: C.body }}>{cat.label}</span>
                    <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color }}>{cat.value > 0 ? '+' : ''}{cat.value.toFixed(1)}</span>
                  </div>
                  <div style={{ height: 8, background: C.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(barW, 4)}%`, background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}44` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight */}
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          {bestWorstComparison.insight}
        </div>
      </div>

      {rounds.map((round) => {
        const isExpanded = expandedId === round.id;
        const sgColor = round.sgTotal >= 0 ? C.conf : C.flag;
        const deltaColor = round.sgDelta > 0 ? C.conf : round.sgDelta < 0 ? C.flag : C.muted;
        const deltaText = round.sgDelta > 0 ? `\u25B2 ${round.sgDelta.toFixed(1)}` : round.sgDelta < 0 ? `\u25BC ${Math.abs(round.sgDelta).toFixed(1)}` : '--';
        const sgBreakdown = [
          { label: 'Off the Tee', value: round.sgDriving },
          { label: 'Approach', value: round.sgApproach },
          { label: 'Around the Green', value: round.sgShortGame },
          { label: 'Putting', value: round.sgPutting },
        ];
        const sgMax = Math.max(...sgBreakdown.map((c) => Math.abs(c.value)), 0.1);

        return (
          <div key={round.id} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setExpandedId(isExpanded ? null : round.id)}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '16px 14px', background: 'none', border: 'none', cursor: 'pointer', gap: 12,
              }}
            >
              {/* Score with glow */}
              <div style={{
                fontFamily: F.data, fontSize: 28, fontWeight: 700,
                color: C.ink, minWidth: 50,
                textShadow: round.score <= 73 ? `0 0 12px ${C.confGlow}` : undefined,
              }}>
                {round.score}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>{round.course}</div>
                <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 2 }}>
                  {round.date} · Par {round.par}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{
                  fontFamily: F.data, fontSize: 15, fontWeight: 700, color: sgColor,
                  textShadow: `0 0 8px ${sgColor}44`,
                }}>
                  {round.sgTotal > 0 ? '+' : ''}{round.sgTotal.toFixed(1)}
                </span>
                <span style={{ fontFamily: F.data, fontSize: 10, color: deltaColor, marginTop: 2 }}>{deltaText}</span>
              </div>
              {isExpanded ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
            </button>

            {isExpanded && (
              <div style={{ padding: '0 14px 16px', borderTop: `1px solid ${C.border}` }}>

                {/* GIR + FIR ring gauges */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16, marginBottom: 18 }}>
                  <StatRing value={round.gir} benchmark={0.56} label="GIR" />
                  <StatRing value={round.fir} benchmark={0.51} label="FIR" />
                </div>

                {/* SG breakdown */}
                {sgBreakdown.map((cat) => {
                  const isPositive = cat.value >= 0;
                  const barPct = (Math.abs(cat.value) / sgMax) * 50;
                  const barColor = isPositive ? C.conf : C.flag;
                  return (
                    <div key={cat.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink }}>{cat.label}</span>
                        <span style={{
                          fontFamily: F.data, fontSize: 13, fontWeight: 700, color: barColor,
                          textShadow: `0 0 6px ${barColor}44`,
                        }}>
                          {isPositive ? '+' : ''}{cat.value.toFixed(1)}
                        </span>
                      </div>
                      <div style={{ height: 8, background: C.surfaceAlt, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.border }} />
                        <div style={{
                          position: 'absolute', top: 1, bottom: 1,
                          ...(isPositive
                            ? { left: '50%', width: `${Math.max(barPct, 3)}%` }
                            : { right: '50%', width: `${Math.max(barPct, 3)}%` }),
                          background: barColor,
                          borderRadius: isPositive ? '0 4px 4px 0' : '4px 0 0 4px',
                          boxShadow: `0 0 12px ${barColor}44`,
                          transition: 'width 500ms ease-out',
                        }} />
                      </div>
                    </div>
                  );
                })}

                {/* Connected Insight */}
                {round.insight && (
                  <div style={{
                    marginTop: 14, padding: '12px 14px',
                    background: C.accentBg,
                    borderLeft: `2px solid ${C.accentBright}`,
                    borderRadius: '0 6px 6px 0',
                    boxShadow: `0 0 12px ${C.confGlow}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Link2 size={12} color={C.accentBright} style={{ filter: `drop-shadow(0 0 4px ${C.confGlow})` }} />
                      <span style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '.06em', color: C.accentBright,
                      }}>
                        Connected Insight
                      </span>
                      <ConfBadge value={84} />
                    </div>
                    <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
                      {round.insight}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
