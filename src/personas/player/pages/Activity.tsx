/**
 * Activity — Complete record of everything Looper captures.
 * Rounds, practice sessions, lessons — unified chronological feed.
 * Expandable round detail with SG breakdown.
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Link2, Flag, Target, GraduationCap } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { rounds, recentPracticeSessions, bestWorstComparison, type RoundRecord } from '../data/tripp';
import ConfBadge from '../components/shared/ConfBadge';

// --- Unified activity item ---
interface ActivityEntry {
  id: string;
  date: string;
  type: 'round' | 'practice' | 'lesson';
  title: string;
  subtitle: string;
  metric?: string;
  metricColor?: string;
  roundData?: RoundRecord;
  practiceShots?: number;
  practiceTopCategory?: string;
}

// Build unified feed from all sources, sorted by date descending
function buildActivityFeed(): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  // Rounds
  for (const r of rounds) {
    const overPar = r.score - r.par;
    const overParStr = overPar === 0 ? 'E' : overPar > 0 ? `+${overPar}` : `${overPar}`;
    entries.push({
      id: r.id,
      date: r.date,
      type: 'round',
      title: `${r.course} — ${r.score} (${overParStr})`,
      subtitle: r.insight || `${r.tee} tees, ${r.differential?.toFixed(1)} differential`,
      metric: r.sgTotal.toFixed(1),
      metricColor: r.sgTotal >= -2.5 ? C.conf : r.sgTotal >= -5 ? C.body : C.flag,
      roundData: r,
    });
  }

  // Practice sessions
  for (const s of recentPracticeSessions) {
    entries.push({
      id: `p-${s.date}`,
      date: s.date,
      type: 'practice',
      title: `GCQuad — ${s.shots} shots`,
      subtitle: `${s.topCategory} focus (${s.topPct}% of session)`,
      metric: `${s.shots}`,
      practiceShots: s.shots,
      practiceTopCategory: s.topCategory,
    });
  }

  // Sort by date descending
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries;
}

const activityFeed = buildActivityFeed();

// --- Mini SG Bar for round detail ---
function MiniSGBar({ label, value }: { label: string; value: number }): JSX.Element {
  const maxVal = 2.0;
  const pct = Math.min(Math.abs(value) / maxVal, 1) * 50;
  const color = value >= 0 ? C.conf : C.flag;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body, minWidth: 100 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: C.surfaceAlt, borderRadius: 4, position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: C.border }} />
        <div style={{
          position: 'absolute', top: 0, height: '100%', borderRadius: 4, background: color,
          boxShadow: `0 0 6px ${value >= 0 ? C.confGlow : C.flagGlow}`,
          ...(value >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }),
        }} />
      </div>
      <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}
      </span>
    </div>
  );
}

// --- Mini Ring Gauge for GIR/FIR ---
function StatRing({ value, benchmark, label, size = 56 }: { value: number; benchmark: number; label: string; size?: number }): JSX.Element {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value, 1);
  const offset = circ * (1 - pct);
  const color = value >= benchmark ? C.conf : C.flag;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color}44)` }} />
        <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily: F.data, fontSize: 12, fontWeight: 700, fill: C.ink }}>
          {(value * 100).toFixed(0)}%
        </text>
      </svg>
      <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

const typeConfig = {
  round: { color: C.conf, icon: Flag, label: 'Round' },
  practice: { color: C.accentBright, icon: Target, label: 'Practice' },
  lesson: { color: C.caution, icon: GraduationCap, label: 'Lesson' },
};

export default function Activity(): JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(activityFeed[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'round' | 'practice' | 'lesson'>('all');

  const filtered = filter === 'all' ? activityFeed : activityFeed.filter(e => e.type === filter);
  const counts = {
    all: activityFeed.length,
    round: activityFeed.filter(e => e.type === 'round').length,
    practice: activityFeed.filter(e => e.type === 'practice').length,
    lesson: activityFeed.filter(e => e.type === 'lesson').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Header */}
      <div>
        <div style={{ fontFamily: F.brand, fontSize: 22, fontWeight: 700, color: C.ink }}>Activity</div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.muted, marginTop: 3 }}>
          Everything Looper captures about your game
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(['all', 'round', 'practice', 'lesson'] as const).map(f => {
          const active = filter === f;
          const label = f === 'all' ? 'All' : f === 'round' ? 'Rounds' : f === 'practice' ? 'Practice' : 'Lessons';
          const count = counts[f];
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: active ? C.accentBg : C.surface,
              border: `1px solid ${active ? C.accent : C.border}`,
              borderRadius: 20, padding: '5px 12px', cursor: 'pointer', transition: 'all 150ms',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {f !== 'all' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeConfig[f].color }} />}
              <span style={{ fontFamily: F.brand, fontSize: 12, fontWeight: active ? 600 : 400, color: active ? C.ink : C.body }}>{label}</span>
              <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Pattern Analysis (show when viewing rounds) */}
      {(filter === 'all' || filter === 'round') && (
        <div style={S.card}>
          <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2 }}>Round Patterns</div>
          <div style={{ fontFamily: F.brand, fontSize: 11, color: C.body, marginBottom: 12 }}>What your best and worst rounds have in common</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Best 5', data: bestWorstComparison.best5, color: C.conf },
              { label: 'Worst 5', data: bestWorstComparison.worst5, color: C.flag },
            ].map(({ label, data, color }) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color, marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: F.data, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{data.avgScore.toFixed(1)}</div>
                {[
                  { l: 'Driving', v: data.avgDriving },
                  { l: 'Approach', v: data.avgApproach },
                  { l: 'Short Game', v: data.avgShortGame },
                  { l: 'Putting', v: data.avgPutting },
                ].map(c => (
                  <div key={c.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                    <span style={{ fontFamily: F.brand, fontSize: 10, color: C.muted }}>{c.l}</span>
                    <span style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, color: c.v >= 0 ? C.conf : C.flag }}>{c.v > 0 ? '+' : ''}{c.v.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
            {bestWorstComparison.insight}
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(entry => {
          const isExpanded = expandedId === entry.id;
          const tc = typeConfig[entry.type];
          const rd = entry.roundData;

          return (
            <div key={entry.id} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              {/* Summary row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                {/* Type dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tc.color, boxShadow: `0 0 6px ${tc.color}44`, flexShrink: 0 }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>{entry.title}</div>
                  <div style={{ fontFamily: F.brand, fontSize: 11, color: C.muted, marginTop: 1 }}>{entry.subtitle}</div>
                </div>

                {/* Right side: metric + date + chevron */}
                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div>
                    {entry.metric && (
                      <div style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: entry.metricColor || C.body }}>
                        {entry.type === 'round' ? `${Number(entry.metric) > 0 ? '' : ''}${entry.metric} SG` : `${entry.metric} shots`}
                      </div>
                    )}
                    <div style={{ fontFamily: F.data, fontSize: 10, color: C.dim }}>{entry.date}</div>
                  </div>
                  {rd && (isExpanded ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />)}
                </div>
              </button>

              {/* Expanded round detail */}
              {isExpanded && rd && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.border}` }}>
                  {/* GIR / FIR rings */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '12px 0' }}>
                    <StatRing value={rd.gir} benchmark={0.67} label="GIR" />
                    <StatRing value={rd.fir} benchmark={0.60} label="FIR" />
                  </div>

                  {/* SG breakdown */}
                  <MiniSGBar label="Off the Tee" value={rd.sgDriving} />
                  <MiniSGBar label="Approach" value={rd.sgApproach} />
                  <MiniSGBar label="Around the Green" value={rd.sgShortGame} />
                  <MiniSGBar label="Putting" value={rd.sgPutting} />

                  {/* Insight */}
                  {rd.insight && (
                    <div style={{ ...S.cardInner, marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8, borderLeft: `2px solid ${C.accent}`, borderRadius: '0 6px 6px 0' }}>
                      <Link2 size={12} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                      <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>{rd.insight}</div>
                    </div>
                  )}

                  {/* Course info */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                    {rd.tee && <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>{rd.tee}</span>}
                    {rd.courseRating && <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>CR {rd.courseRating}</span>}
                    {rd.slopeRating && <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>Slope {rd.slopeRating}</span>}
                    {rd.differential != null && <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>Diff {rd.differential.toFixed(1)}</span>}
                  </div>
                </div>
              )}

              {/* Expanded practice detail */}
              {isExpanded && entry.type === 'practice' && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', gap: 12, padding: '10px 0', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F.data, fontSize: 11, color: C.body }}>Device: GCQuad</span>
                    <span style={{ fontFamily: F.data, fontSize: 11, color: C.body }}>Shots: {entry.practiceShots}</span>
                    <span style={{ fontFamily: F.data, fontSize: 11, color: C.body }}>Focus: {entry.practiceTopCategory}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
