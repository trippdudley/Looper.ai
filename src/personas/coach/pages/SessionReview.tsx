import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Target,
  X,
  Plus,
  Pencil,
  Quote,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Wrench,
  ClipboardCheck,
} from 'lucide-react';
import { sessions } from '../../../data/sessions';
import { drills } from '../../../data/drills';
import { trackmanShots } from '../../../data/trackmanData';
import { golfers } from '../../../data/players';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const typeLabels: Record<string, string> = {
  'full-swing': 'Full Swing',
  'short-game': 'Short Game',
  'playing-lesson': 'Playing Lesson',
  assessment: 'Assessment',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-accent/10 text-accent',
  intermediate: 'bg-data-blue/10 text-data-blue',
  advanced: 'bg-coral/10 text-coral',
};

export default function SessionReview() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/coach');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const session = sessions.find((s) => s.id === 'session-6')!;
  const golfer = golfers.find((g) => g.id === session.golferId)!;
  const sessionDrills = session.drillIds
    .map((drillId) => drills.find((d) => d.id === drillId))
    .filter(Boolean);
  const sessionShots = trackmanShots.filter((s) => s.sessionId === session.id);

  const goodCount = sessionShots.filter((s) => s.quality === 'good').length;
  const acceptableCount = sessionShots.filter((s) => s.quality === 'acceptable').length;
  const mishitCount = sessionShots.filter((s) => s.quality === 'mishit').length;
  const totalShots = sessionShots.length;

  const homeworkItems = [
    'Alignment stick gate drill -- every range session, 10 reps',
    '9-to-3 pitch shots -- 30 reps, focus on tempo',
    'Trust the loft -- no scooping on iron shots',
  ];

  return (
    <div className="pb-8 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/coach" className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Today</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">AI Processing Complete</span>
          </div>
          <button
            onClick={() => navigate('/coach')}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Send to Student
          </button>
        </div>
      </div>

      <h1 className="text-2xl text-navy font-bold">Session Review</h1>

      {/* 2-Column Layout */}
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-[2] space-y-6">
          {/* Session Header Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(golfer.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy">{golfer.name}</h2>
                  <p className="text-sm text-gray-500">{formatDate(session.date)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-accent/20">
                <span className="font-mono text-xl font-bold text-accent">
                  {session.improvementScore}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="px-2.5 py-1 bg-data-blue/10 text-data-blue text-xs font-medium rounded-full">
                {typeLabels[session.type] || session.type}
              </span>
              <span className="text-sm text-gray-600">{session.focus}</span>
              <span className="text-sm text-gray-400 ml-auto">{session.duration}</span>
            </div>
          </div>

          {/* AI-Generated Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-accent">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-navy text-sm">AI Summary</h3>
              </div>
              <button className="text-gray-400 hover:text-data-blue transition-colors" title="Edit summary">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{session.summary}</p>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              LESSON PHASES
              ═══════════════════════════════════════════════════════════ */}

          {/* Phase 1: Catch-up */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-data-blue" />
                <h3 className="font-semibold text-navy text-sm">Catch-up</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-data-blue/10 text-data-blue font-mono font-medium">~5 min</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                'Player reported practicing 3x since last session, focused on 9-to-3 drill.',
                'Confirmed retention of ground-pressure cue from Session 3.',
                'Player mentioned slight low-back tightness — monitor during full swings.',
              ].map((obs, i) => (
                <div key={i} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-data-blue mt-2 shrink-0" />
                    <p className="text-sm text-gray-700">{obs}</p>
                  </div>
                  <button className="text-gray-400 hover:text-data-blue transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" title="Edit observation">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: Diagnosis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-warm-amber" />
                <h3 className="font-semibold text-navy text-sm">Diagnosis</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-amber/10 text-warm-amber font-mono font-medium">~15 min</span>
              </div>
            </div>
            {/* Key metrics for this phase */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {session.keyMetricChanges.slice(0, 3).map((change, i) => {
                const delta = change.after - change.before;
                return (
                  <div key={i} className="bg-bg-light rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{change.metric}</p>
                    <p className="text-sm font-bold text-navy font-mono">{change.after}{change.unit}</p>
                    <p className={`text-[10px] font-semibold ${delta > 0 ? 'text-accent' : 'text-coral'}`}>
                      {delta > 0 ? '+' : ''}{Number.isInteger(delta) ? delta : delta.toFixed(1)}{change.unit}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              {session.faults.map((fault, i) => (
                <div key={i} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-coral mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">{fault}</p>
                  </div>
                  <button className="text-gray-400 hover:text-warm-amber transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" title="Edit observation">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Intervention */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-navy text-sm">Intervention</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-medium">~20 min</span>
              </div>
            </div>
            {/* Coaching cues used */}
            <div className="space-y-3 mb-4">
              {session.coachingCues.map((cue, i) => (
                <div key={i} className="flex items-start justify-between gap-3 group">
                  <div className="bg-gray-50 rounded-lg p-3 flex-1">
                    <div className="flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700">{cue}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-3" title="Edit cue">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-data-blue font-medium hover:underline mb-4">
              <Plus className="w-3.5 h-3.5" />
              Add Cue
            </button>
            {/* Drills assigned */}
            <div className="space-y-3">
              {sessionDrills.map(
                (drill) =>
                  drill && (
                    <div key={drill.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-navy">{drill.name}</h4>
                          <p className="text-xs text-gray-500">{drill.focus}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                            difficultyColors[drill.difficulty] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {drill.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{drill.duration}</span>
                        <span>{drill.reps}</span>
                      </div>
                    </div>
                  )
              )}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-data-blue font-medium mt-4 hover:underline">
              <Plus className="w-3.5 h-3.5" />
              Add Drill
            </button>
            {/* Intervention observations */}
            <div className="mt-4 space-y-3">
              {[
                'Ball speed improved +3 mph after switching to external focus cue.',
                'Spin consistency stabilized after drill 2 — variance dropped from 800 to 350 rpm.',
              ].map((obs, i) => (
                <div key={i} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-sm text-gray-700">{obs}</p>
                  </div>
                  <button className="text-gray-400 hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" title="Edit observation">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 4: Review */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-navy text-sm">Review</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono font-medium">~5 min</span>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {[
                'Session objective met — wedge distance ladder completed through 120 yards.',
                'Ground-pressure cue retained after break; ready to extend to longer irons next session.',
                'Recommended homework: 9-to-3 pitch shots (30 reps), alignment gate drill (10 reps per range session).',
              ].map((obs, i) => (
                <div key={i} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-sm text-gray-700">{obs}</p>
                  </div>
                  <button className="text-gray-400 hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" title="Edit observation">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Homework */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Homework Assigned</h4>
              <div className="space-y-2">
                {homeworkItems.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-sm text-data-blue font-medium mt-3 hover:underline">
                <Plus className="w-3.5 h-3.5" />
                Add homework item
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Trackman Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-navy text-sm mb-4">Session Data Summary</h3>
            <div className="space-y-4">
              {session.keyMetricChanges.map((change, i) => {
                const delta = change.after - change.before;
                const isImproving =
                  change.metric.includes('Attack Angle')
                    ? change.after < change.before
                    : delta > 0;
                const isMaintained = Math.abs(delta) <= 1;
                const deltaDisplay =
                  change.metric.includes('Attack Angle')
                    ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`
                    : `${delta > 0 ? '+' : ''}${
                        Number.isInteger(delta) ? delta : delta.toFixed(2)
                      }`;

                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">{change.metric}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-400">
                          {change.before}
                          {change.unit}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="font-mono text-sm font-medium text-navy">
                          {change.after}
                          {change.unit}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isMaintained
                          ? 'bg-gray-100 text-gray-500'
                          : isImproving || change.metric.includes('Attack Angle')
                            ? 'bg-accent/10 text-accent'
                            : 'bg-coral/10 text-coral'
                      }`}
                    >
                      {!isMaintained && <ArrowUp className="w-3 h-3" />}
                      {deltaDisplay}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shot Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-navy text-sm mb-4">Shot Quality Distribution</h3>
            <div className="w-full h-6 rounded-full overflow-hidden flex bg-gray-100">
              {goodCount > 0 && (
                <div
                  className="bg-accent h-full transition-all"
                  style={{ width: `${(goodCount / totalShots) * 100}%` }}
                />
              )}
              {acceptableCount > 0 && (
                <div
                  className="bg-warm-amber h-full transition-all"
                  style={{ width: `${(acceptableCount / totalShots) * 100}%` }}
                />
              )}
              {mishitCount > 0 && (
                <div
                  className="bg-coral h-full transition-all"
                  style={{ width: `${(mishitCount / totalShots) * 100}%` }}
                />
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-gray-600">Good ({goodCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-warm-amber" />
                <span className="text-gray-600">Acceptable ({acceptableCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-coral" />
                <span className="text-gray-600">Mishit ({mishitCount})</span>
              </div>
            </div>
          </div>

          {/* Coach Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy text-sm">Session Notes</h3>
              <button className="text-gray-400 hover:text-navy transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              className="w-full text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              rows={6}
              defaultValue={session.notes}
            />
            <p className="text-xs text-gray-400 mt-2">Last edited just now</p>
          </div>

        </div>

      </div>
    </div>
  );
}
