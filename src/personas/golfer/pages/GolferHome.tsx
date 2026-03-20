import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Calendar, MapPin, Trophy } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  gameScore,
  strokesGained,
  dataSources,
  rounds,
  nextSession,
  homework,
  streak,
  getBiggestOpportunity,
  getPracticeCompliancePercent,
} from '../../../data/consumerData';
import { golfers } from '../../../data/golfers';
import Card from '../../../components/ui/Card';

export default function GolferHome() {
  const golfer = golfers[0];
  const navigate = useNavigate();
  const opportunity = getBiggestOpportunity();
  const compliance = getPracticeCompliancePercent();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activeHomework = homework.filter(h => h.status === 'active');
  const lastRound = rounds[0];
  const handicapDelta = -1.6; // improvement over 3 months

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ── Greeting ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy">
            {greeting}, {golfer.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Handicap {golfer.handicapIndex} <span className="text-accent font-medium">{handicapDelta}</span> last 3mo
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent">{streak.current} day streak</span>
        </div>
      </div>

      {/* ── Game Score Hero ── */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Game Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-navy" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                  {gameScore.current}
                </span>
                <span className="text-xs text-gray-400">/100</span>
                <span className="flex items-center gap-0.5 text-accent text-xs font-medium">
                  <ArrowUpRight className="w-3 h-3" />+18
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right">
              <ScoreComponent label="Scoring" value={gameScore.components.scoring} />
              <ScoreComponent label="Ball Striking" value={gameScore.components.ballStriking} />
              <ScoreComponent label="Practice" value={gameScore.components.practiceHabit} />
              <ScoreComponent label="Coach Plan" value={gameScore.components.coachAlignment} />
            </div>
          </div>
        </div>
        {/* Sparkline */}
        <div className="h-12 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gameScore.trend.map((v, i) => ({ w: i, v }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A9D78" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3A9D78" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#3A9D78" strokeWidth={2} fill="url(#gsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Strokes Gained Snapshot ── */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Strokes Gained vs. Your Baseline</p>
          <button onClick={() => navigate('/golfer/game')} className="text-accent text-xs font-medium flex items-center gap-0.5">
            Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SGCell label="Off the Tee" value={strokesGained.offTheTee} />
          <SGCell label="Approach" value={strokesGained.approach} highlight />
          <SGCell label="Around Green" value={strokesGained.aroundTheGreen} />
          <SGCell label="Putting" value={strokesGained.putting} />
        </div>
        {/* Opportunity callout */}
        <div className="mt-3 bg-warm-amber/10 rounded-lg px-3 py-2">
          <p className="text-[11px] font-semibold text-warm-amber">Biggest Opportunity</p>
          <p className="text-xs text-gray-600 mt-0.5">{opportunity.insight}</p>
        </div>
      </Card>

      {/* ── Next Session ── */}
      <Card className="bg-accent/5 cursor-pointer" onClick={() => navigate('/golfer/coach')}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy">Next: {nextSession.focus}</p>
            <p className="text-xs text-gray-500">
              {new Date(nextSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {nextSession.time} · {nextSession.coach}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      </Card>

      {/* ── Homework Strip ── */}
      {activeHomework.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Homework</p>
            <span className="text-xs text-accent font-medium">{compliance}% complete</span>
          </div>
          <div className="flex flex-col gap-2">
            {activeHomework.slice(0, 2).map(hw => (
              <div key={hw.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-2.5 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{hw.drill}</p>
                  <p className="text-xs text-gray-400">{hw.completedReps}/{hw.targetReps} sessions</p>
                </div>
                <div className="w-10 h-1.5 rounded-full bg-gray-100 shrink-0">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${(hw.completedReps / hw.targetReps) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Last Round ── */}
      <Card onClick={() => navigate('/golfer/game')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-data-blue/10 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-data-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">{lastRound.score} at {lastRound.course}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {new Date(lastRound.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·
                {lastRound.fairwaysHit}/{lastRound.fairwaysTotal} FW ·
                {lastRound.greensInReg}/{lastRound.greensTotal} GIR ·
                {lastRound.putts} putts
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      </Card>

      {/* ── Data Sources Strip ── */}
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Your Data</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {dataSources.map(ds => (
            <div
              key={ds.id}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-100 bg-white shadow-sm shrink-0"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ds.color }} />
              <span className="text-xs font-medium text-gray-700">{ds.name}</span>
              <span className="text-[10px] text-gray-400">{ds.dataPoints}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function ScoreComponent({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-xs font-semibold text-navy" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
        {value}
      </p>
    </div>
  );
}

function SGCell({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const isNeg = value < 0;
  return (
    <div className={`rounded-lg px-3 py-2 ${highlight ? 'bg-coral/8 ring-1 ring-coral/20' : 'bg-gray-50'}`}>
      <p className="text-[10px] text-gray-400">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        {isNeg ? (
          <ArrowDownRight className="w-3 h-3 text-coral" />
        ) : (
          <ArrowUpRight className="w-3 h-3 text-accent" />
        )}
        <span
          className={`text-sm font-bold ${isNeg ? 'text-coral' : 'text-accent'}`}
          style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}
        >
          {value > 0 ? '+' : ''}{value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
