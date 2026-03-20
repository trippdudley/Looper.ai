import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import {
  strokesGained,
  rounds,
  clubDistances,
  skillRatings,
  getHandicapTrend,
  getScoreTrend,
} from '../../../data/consumerData';
import Card from '../../../components/ui/Card';

type SGCategory = 'total' | 'offTheTee' | 'approach' | 'aroundTheGreen' | 'putting';

const sgLabels: Record<SGCategory, string> = {
  total: 'Total',
  offTheTee: 'Off the Tee',
  approach: 'Approach',
  aroundTheGreen: 'Around Green',
  putting: 'Putting',
};

export default function GameAnalytics() {
  const [sgView, setSgView] = useState<SGCategory>('total');
  const [showAllClubs, setShowAllClubs] = useState(false);
  const handicapTrend = getHandicapTrend();
  const scoreTrend = getScoreTrend();

  const visibleClubs = showAllClubs ? clubDistances : clubDistances.slice(0, 6);

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-lg font-semibold text-navy">Your Game</h1>
        <p className="text-xs text-gray-400 mt-0.5">All data blended from GHIN, Arccos, TrackMan & Skillet</p>
      </div>

      {/* ── Handicap + Score Trend ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Handicap Index</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-navy" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
              15.2
            </span>
            <span className="flex items-center text-accent text-xs font-medium">
              <ArrowDownRight className="w-3 h-3" />1.6
            </span>
          </div>
          <div className="h-10 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={handicapTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3A9D78" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3A9D78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3A9D78" strokeWidth={1.5} fill="url(#hcGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="!p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Scoring Trend</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-navy" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
              {scoreTrend[scoreTrend.length - 1]?.value}
            </span>
            <span className="flex items-center text-accent text-xs font-medium">
              <TrendingUp className="w-3 h-3" />improving
            </span>
          </div>
          <div className="h-10 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="scGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A90D9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#4A90D9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#4A90D9" strokeWidth={1.5} fill="url(#scGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Strokes Gained Breakdown ── */}
      <Card>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">Strokes Gained Trend</p>
        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
          {(Object.keys(sgLabels) as SGCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSgView(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                sgView === cat
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {sgLabels[cat]}
            </button>
          ))}
        </div>
        {/* Chart */}
        <div className="h-36 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={strokesGained.trend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="sgTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A9D78" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3A9D78" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #eee' }}
                formatter={(val: number) => [val.toFixed(1), sgLabels[sgView]]}
              />
              <Area
                type="monotone"
                dataKey={sgView}
                stroke="#3A9D78"
                strokeWidth={2}
                fill="url(#sgTrendGrad)"
                dot={{ r: 2, fill: '#3A9D78' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Current values bar */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {(['offTheTee', 'approach', 'aroundTheGreen', 'putting'] as const).map(cat => {
            const v = strokesGained[cat];
            const isNeg = v < 0;
            return (
              <div key={cat} className="text-center">
                <p className="text-[9px] text-gray-400 leading-tight">{sgLabels[cat]}</p>
                <p
                  className={`text-xs font-bold mt-0.5 ${isNeg ? 'text-coral' : 'text-accent'}`}
                  style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}
                >
                  {v > 0 ? '+' : ''}{v.toFixed(1)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Club Distances ── */}
      <Card>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">Club Distances</p>
        <div className="h-40 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clubDistances.slice(0, 8)} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <XAxis dataKey="club" tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} tickLine={false} axisLine={false} domain={[0, 'dataMax + 20']} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #eee' }} />
              <Bar dataKey="avgCarry" name="Carry" radius={[4, 4, 0, 0]}>
                {clubDistances.slice(0, 8).map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#3A9D78' : '#4A90D9'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Table */}
        <div className="space-y-1">
          {visibleClubs.map(cd => (
            <div key={cd.club} className="flex items-center text-xs px-1 py-1.5 rounded-lg hover:bg-gray-50">
              <span className="w-16 font-medium text-navy">{cd.club}</span>
              <span className="w-14 text-gray-600 text-right" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                {cd.avgCarry}
              </span>
              <span className="w-14 text-gray-400 text-right" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                {cd.avgTotal}
              </span>
              <span className="flex-1 text-right">
                {cd.trend !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 ${cd.trend > 0 ? 'text-accent' : 'text-coral'}`}>
                    {cd.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(cd.trend)}
                  </span>
                )}
              </span>
              <span className="w-10 text-gray-300 text-right text-[10px]">{cd.samples}</span>
            </div>
          ))}
        </div>
        {clubDistances.length > 6 && (
          <button
            onClick={() => setShowAllClubs(!showAllClubs)}
            className="w-full text-center text-xs text-accent font-medium mt-2 flex items-center justify-center gap-1"
          >
            {showAllClubs ? 'Show less' : 'All clubs'}
            {showAllClubs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </Card>

      {/* ── Skills Radar ── */}
      <Card>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">Skill Ratings</p>
        <div className="space-y-2">
          {skillRatings.map(sr => (
            <div key={sr.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-navy">{sr.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 capitalize">{sr.source}</span>
                  <span
                    className={`text-xs font-bold ${
                      sr.trend === 'improving' ? 'text-accent' : sr.trend === 'declining' ? 'text-coral' : 'text-gray-400'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}
                  >
                    {sr.score}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    sr.score >= 70 ? 'bg-accent' : sr.score >= 50 ? 'bg-data-blue' : 'bg-warm-amber'
                  }`}
                  style={{ width: `${sr.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Recent Rounds ── */}
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Recent Rounds</p>
        <div className="space-y-2">
          {rounds.slice(0, 5).map(r => (
            <Card key={r.id} className="!p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-navy" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                      {r.score}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{r.course}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·
                      {r.tees} · Diff {r.differential.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span>{r.fairwaysHit}/{r.fairwaysTotal} FW</span>
                    <span>{r.greensInReg}/{r.greensTotal} GIR</span>
                    <span>{r.putts}P</span>
                  </div>
                  {r.strokesGained && (
                    <p className={`text-xs font-bold mt-0.5 ${r.strokesGained.total < 0 ? 'text-coral' : 'text-accent'}`}
                       style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                      SG {r.strokesGained.total > 0 ? '+' : ''}{r.strokesGained.total.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
