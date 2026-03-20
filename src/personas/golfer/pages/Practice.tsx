import { useState } from 'react';
import {
  Flame, CheckCircle2, Clock, Calendar, Target,
  ChevronRight, TrendingUp, Dumbbell,
} from 'lucide-react';
import {
  homework,
  practiceSessions,
  streak,
  skillRatings,
  getPracticeCompliancePercent,
} from '../../../data/consumerData';
import { drills } from '../../../data/drills';
import Card from '../../../components/ui/Card';

type ViewFilter = 'drills' | 'log' | 'skills';

export default function Practice() {
  const [view, setView] = useState<ViewFilter>('drills');
  const compliance = getPracticeCompliancePercent();

  const activeHomework = homework.filter(h => h.status !== 'completed');
  const completedHomework = homework.filter(h => h.status === 'completed');

  // Build streak visualization for last 7 days
  const today = new Date('2026-03-20');
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const practiced = practiceSessions.some(ps => ps.date === dateStr);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      date: d.getDate(),
      active: practiced,
    };
  });

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy">Practice</h1>
          <p className="text-xs text-gray-400 mt-0.5">Build habits. Track progress.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold text-orange-600">{streak.current}</span>
        </div>
      </div>

      {/* ── Streak Visual ── */}
      <Card className="!p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">This Week</p>
          <p className="text-xs text-gray-500">
            <span className="font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
              {streak.thisWeek}
            </span>
            /{streak.target} sessions
          </p>
        </div>
        <div className="flex items-center justify-between gap-1">
          {last7Days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">{d.day}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                  d.active
                    ? 'bg-accent text-white'
                    : 'bg-gray-50 text-gray-300'
                }`}
              >
                {d.date}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className="text-[10px] text-gray-400">Longest streak: {streak.longest} days</span>
          <span className="text-[10px] text-gray-400">Compliance: {compliance}%</span>
        </div>
      </Card>

      {/* ── View Toggle ── */}
      <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
        {([
          { key: 'drills' as const, label: 'Drills', icon: <Target className="w-3.5 h-3.5" /> },
          { key: 'log' as const, label: 'Log', icon: <Calendar className="w-3.5 h-3.5" /> },
          { key: 'skills' as const, label: 'Skills', icon: <TrendingUp className="w-3.5 h-3.5" /> },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              view === tab.key
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-400'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Drills View ── */}
      {view === 'drills' && (
        <div className="flex flex-col gap-3">
          {activeHomework.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Assigned by Coach</p>
              {activeHomework.map(hw => {
                const drill = drills.find(d => d.name === hw.drill || d.name.includes(hw.drill.split(' ')[0]));
                const pct = (hw.completedReps / hw.targetReps) * 100;
                return (
                  <Card key={hw.id} className="!p-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        hw.priority === 'focus' ? 'bg-accent/15' : hw.priority === 'explore' ? 'bg-data-blue/15' : 'bg-gray-100'
                      }`}>
                        <Dumbbell className={`w-4 h-4 ${
                          hw.priority === 'focus' ? 'text-accent' : hw.priority === 'explore' ? 'text-data-blue' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-navy">{hw.drill}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            hw.priority === 'focus' ? 'bg-accent/10 text-accent' : hw.priority === 'explore' ? 'bg-data-blue/10 text-data-blue' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {hw.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{hw.description}</p>
                        {drill && (
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{drill.duration}</span>
                            <span>{drill.reps}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-gray-400">{hw.completedReps}/{hw.targetReps} sessions</span>
                            <span className="text-[10px] font-medium text-accent">{Math.round(pct)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {completedHomework.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Completed</p>
              {completedHomework.map(hw => (
                <div key={hw.id} className="flex items-center gap-3 bg-accent/5 rounded-xl px-3 py-2.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <p className="text-sm text-accent font-medium">{hw.drill}</p>
                  <span className="text-[10px] text-accent/60 ml-auto">{hw.completedReps}/{hw.targetReps}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Practice Log View ── */}
      {view === 'log' && (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Recent Sessions</p>
          {practiceSessions.map(ps => {
            const matchedDrills = ps.drillsCompleted
              .map(id => drills.find(d => d.id === id))
              .filter(Boolean);
            return (
              <Card key={ps.id} className="!p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    ps.type === 'range' ? 'bg-accent/10' :
                    ps.type === 'putting' ? 'bg-data-blue/10' :
                    ps.type === 'short-game' ? 'bg-warm-amber/10' :
                    'bg-purple-50'
                  }`}>
                    <span className={`text-xs font-bold ${
                      ps.type === 'range' ? 'text-accent' :
                      ps.type === 'putting' ? 'text-data-blue' :
                      ps.type === 'short-game' ? 'text-warm-amber' :
                      'text-purple-500'
                    }`} style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                      {ps.duration}m
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy capitalize">{ps.type.replace('-', ' ')}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(ps.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
                {matchedDrills.length > 0 && (
                  <div className="ml-12 mt-1.5 flex flex-wrap gap-1">
                    {matchedDrills.map(d => (
                      <span key={d!.id} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {d!.name}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Skills View ── */}
      {view === 'skills' && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Skill Ratings</p>
          {skillRatings.map(sr => (
            <Card key={sr.category} className="!p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-navy">{sr.category}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{sr.source} · Last: {
                    new Date(sr.lastAssessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    sr.score >= 70 ? 'text-accent' : sr.score >= 50 ? 'text-data-blue' : 'text-warm-amber'
                  }`} style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                    {sr.score}
                  </p>
                  <p className={`text-[10px] font-medium capitalize ${
                    sr.trend === 'improving' ? 'text-accent' : sr.trend === 'declining' ? 'text-coral' : 'text-gray-400'
                  }`}>
                    {sr.trend === 'improving' ? '↑' : sr.trend === 'declining' ? '↓' : '→'} {sr.trend}
                  </p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    sr.score >= 70 ? 'bg-accent' : sr.score >= 50 ? 'bg-data-blue' : 'bg-warm-amber'
                  }`}
                  style={{ width: `${sr.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-gray-300 capitalize">{sr.level}</span>
                <span className="text-[10px] text-gray-300">
                  {sr.score < 50 ? 'Developing' : sr.score < 70 ? 'Competent' : sr.score < 85 ? 'Proficient' : 'Advanced'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Log Practice CTA ── */}
      <button className="w-full bg-accent text-white py-3.5 rounded-xl font-semibold hover:bg-accent-light transition-colors flex items-center justify-center gap-2">
        <Target className="w-4 h-4" />
        Log Practice Session
      </button>
    </div>
  );
}
