import { useNavigate } from 'react-router-dom';
import {
  Calendar, CheckCircle2, Circle, Clock, MessageSquare,
  ChevronRight, ArrowUpRight, User, Sparkles, Target,
} from 'lucide-react';
import {
  coachingArc,
  homework,
  nextSession,
  getPracticeCompliancePercent,
} from '../../../data/consumerData';
import { sessions } from '../../../data/sessions';
import { coaches } from '../../../data/coaches';
import Card from '../../../components/ui/Card';

export default function CoachConnection() {
  const navigate = useNavigate();
  const coach = coaches[0];
  const compliance = getPracticeCompliancePercent();

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-lg font-semibold text-navy">Coaching</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your coaching relationship with {coach.name}</p>
      </div>

      {/* ── Coach Card ── */}
      <Card className="!p-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-accent">
              {coach.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">{coach.name}</p>
            <p className="text-xs text-gray-400">{coach.title} · {coach.yearsExperience}yr experience</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Avg improvement</p>
            <p className="text-sm font-bold text-accent flex items-center gap-0.5 justify-end"
               style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
              <ArrowUpRight className="w-3 h-3" />{coach.avgImprovement} strokes
            </p>
          </div>
        </div>
      </Card>

      {/* ── Next Session ── */}
      <Card className="bg-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Next Session</p>
            <p className="text-sm font-semibold text-navy mt-0.5">{nextSession.focus}</p>
            <p className="text-xs text-gray-500">
              {new Date(nextSession.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {nextSession.time}
            </p>
          </div>
          <span className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-semibold rounded-full">{nextSession.type}</span>
        </div>
      </Card>

      {/* ── Coaching Arc ── */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Current Arc</p>
        </div>
        <p className="text-sm font-semibold text-navy">{coachingArc.phase}</p>
        <p className="text-xs text-gray-500 mt-1">{coachingArc.description}</p>

        {/* Progress bar */}
        <div className="mt-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400">Progress</span>
            <span className="text-xs font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
              {coachingArc.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${coachingArc.progress}%` }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-3 space-y-2">
          {coachingArc.milestones.map((ms, i) => (
            <div key={i} className="flex items-start gap-2">
              {ms.reached ? (
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs ${ms.reached ? 'text-navy font-medium' : 'text-gray-400'}`}>{ms.label}</p>
                {ms.date && (
                  <p className="text-[10px] text-gray-300">
                    {new Date(ms.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Homework ── */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Homework</p>
          </div>
          <span className="text-xs font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
            {compliance}%
          </span>
        </div>
        <div className="space-y-2.5">
          {homework.map(hw => {
            const pct = (hw.completedReps / hw.targetReps) * 100;
            const isDone = hw.status === 'completed';
            return (
              <div
                key={hw.id}
                className={`rounded-xl border px-3 py-2.5 ${isDone ? 'bg-accent/5 border-accent/20' : 'bg-white border-gray-100'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${hw.priority === 'focus' ? 'bg-accent' : hw.priority === 'explore' ? 'bg-data-blue' : 'bg-gray-300'}`} />
                    )}
                    <p className={`text-sm font-medium ${isDone ? 'text-accent' : 'text-navy'}`}>{hw.drill}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{hw.completedReps}/{hw.targetReps}</span>
                </div>
                <p className="text-xs text-gray-500 ml-6 mb-1.5">{hw.description}</p>
                {!isDone && (
                  <div className="ml-6 w-full h-1 bg-gray-100 rounded-full overflow-hidden" style={{ width: 'calc(100% - 1.5rem)' }}>
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Session History ── */}
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">Session History</p>
        <div className="space-y-2">
          {sortedSessions.map((session, i) => {
            const prevScore = i < sortedSessions.length - 1 ? sortedSessions[i + 1].improvementScore : session.improvementScore;
            const delta = session.improvementScore - prevScore;
            return (
              <Card
                key={session.id}
                className="!p-3 cursor-pointer"
                onClick={() => navigate(`/golfer/lessons/${session.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                      {session.improvementScore}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{session.focus}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·
                      {session.duration} ·
                      <span className="capitalize">{session.type.replace('-', ' ')}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {delta > 0 && (
                      <span className="text-xs font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', Menlo, monospace" }}>
                        +{delta}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                {/* Coach's cue preview */}
                {session.coachingCues[0] && (
                  <div className="mt-2 ml-12 flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-400 italic line-clamp-1">"{session.coachingCues[0]}"</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
