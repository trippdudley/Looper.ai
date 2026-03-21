import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  MapPin,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  Repeat,
  BarChart3,
  Clock,
  Sparkles,
  Flag,
  Dumbbell,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { playerHistory } from '../../../data/coachingOSData';

// ---------- helpers ----------
function getInitials(name: string) {
  const parts = name.split(' ');
  return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
}

// Mock: map golfer IDs to scheduled session context
const sessionBriefs: Record<string, {
  time: string;
  duration: string;
  type: string;
  todaysFocus: string;
  todaysObjective: string;
}> = {
  'golfer-james': {
    time: '2:00 PM',
    duration: '45 min',
    type: 'Short Game',
    todaysFocus: 'Wedge Distance Control',
    todaysObjective: 'Confirm ground-pressure cue retention after 4-day break, then extend to wedge distance ladder (80 / 100 / 120 yards).',
  },
};

// ---------- component ----------
export default function PreSessionBrief() {
  const { id } = useParams<{ id: string }>();
  const golfer = golfers.find((g) => g.id === id);
  const brief = id ? sessionBriefs[id] : undefined;

  // Use playerHistory data (from CoachingOS data layer)
  const lastCompleted = playerHistory.lessons
    .filter((l) => l.status === 'completed')
    .sort((a, b) => b.sessionNumber - a.sessionNumber)[0];

  const onCourse = playerHistory.onCourse;
  const latestRound = onCourse.arccosRounds[0];
  const handicapCurrent = onCourse.handicapTrend[0];
  const handicapOldest = onCourse.handicapTrend[onCourse.handicapTrend.length - 1];
  const handicapDelta = handicapOldest && handicapCurrent
    ? (handicapCurrent.index - handicapOldest.index).toFixed(1)
    : null;

  // Derive coaching intelligence from the data
  const girBelow40 = latestRound && latestRound.gir < 40;
  const puttingHigh = latestRound && latestRound.puttsPerRound > 30;
  const partialRegression = lastCompleted?.keyTakeaway.toLowerCase().includes('retention') ||
    lastCompleted?.keyTakeaway.toLowerCase().includes('reinforcement');

  if (!golfer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Player not found</p>
        <Link to="/coach" className="text-accent text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        to="/coach"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          HEADER: Player Identity + Key Context
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center text-lg font-bold shrink-0">
            {getInitials(golfer.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-navy text-xl font-bold">{golfer.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                {brief?.type ?? 'Session'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {brief?.time ?? '—'} &middot; {brief?.duration ?? '—'} &middot; {brief?.todaysFocus ?? ''}
            </p>

            {/* Quick stats row */}
            <div className="flex gap-4 mt-4">
              <div className="bg-bg-light rounded-lg px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Handicap</p>
                <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                  <p className="text-lg font-bold text-navy">{handicapCurrent?.index ?? golfer.handicapIndex}</p>
                  {handicapDelta && (
                    <span className={`text-xs font-semibold ${Number(handicapDelta) < 0 ? 'text-accent' : 'text-coral'}`}>
                      {Number(handicapDelta) < 0 ? '' : '+'}{handicapDelta}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-bg-light rounded-lg px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Last Session</p>
                <p className="text-sm font-bold text-navy mt-0.5">{lastCompleted?.date?.replace(', 2026', '') ?? '—'}</p>
              </div>
              <div className="bg-bg-light rounded-lg px-4 py-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Connected</p>
                <div className="flex gap-1 mt-1 justify-center">
                  {(golfer.connectedSystems || []).map((sys) => (
                    <span key={sys} className="text-[10px] px-1.5 py-0.5 rounded bg-data-blue/10 text-data-blue font-semibold">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Session CTA */}
          <Link
            to="/coach/live"
            className="shrink-0 bg-accent text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-accent-light transition flex items-center gap-2"
          >
            Start Session
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TODAY'S GAME PLAN — 3 sub-cards
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-4 h-4 text-accent" />
          <h2 className="text-navy font-bold text-base">Today&apos;s Game Plan</h2>
          <span className="text-xs text-gray-400 ml-auto">{brief?.todaysFocus ?? ''}</span>
        </div>

        <div className="space-y-4">

          {/* ── Sub-card 1: Last Session Overview ── */}
          <div className="bg-bg-light rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-data-blue" />
              <span className="text-[10px] uppercase tracking-wide text-data-blue font-bold">Last Session</span>
              <span className="text-[10px] text-gray-400 ml-auto font-mono">{lastCompleted?.date}</span>
            </div>

            {lastCompleted ? (
              <>
                <h3 className="text-sm font-semibold text-navy mb-2">
                  Session {lastCompleted.sessionNumber}: {lastCompleted.focus}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {lastCompleted.summary}
                </p>

                {/* Key metrics — compact row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                  {lastCompleted.metrics.map((m) => (
                    <div key={m.label} className="bg-white rounded-lg px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{m.label}</p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-navy">{m.after}</span>
                        <span className={`text-[10px] font-semibold ${m.improved ? 'text-accent' : 'text-coral'}`}>
                          from {m.before}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cue + drills row */}
                <div className="flex flex-wrap gap-2">
                  {lastCompleted.cueUsed && (
                    <div className="flex items-center gap-1.5 bg-accent/5 rounded-full px-3 py-1">
                      <Repeat className="w-3 h-3 text-accent shrink-0" />
                      <span className="text-[10px] text-accent font-bold uppercase">Cue:</span>
                      <span className="text-xs text-navy font-medium italic">&ldquo;{lastCompleted.cueUsed}&rdquo;</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-data-blue/5 rounded-full px-3 py-1">
                    <Dumbbell className="w-3 h-3 text-data-blue shrink-0" />
                    <span className="text-[10px] text-data-blue font-bold uppercase">Drill:</span>
                    <span className="text-xs text-navy font-medium">Ground pressure gate</span>
                  </div>
                </div>

                {/* Key takeaway */}
                <div className="border-l-2 border-accent pl-3 py-1 mt-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Where We Left Off</p>
                  <p className="text-sm text-navy font-medium leading-relaxed">
                    {lastCompleted.keyTakeaway}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No previous sessions</p>
            )}
          </div>

          {/* ── Sub-card 2: On the Course ── */}
          <div className="bg-bg-light rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-3.5 h-3.5 text-warm-amber" />
              <span className="text-[10px] uppercase tracking-wide text-warm-amber font-bold">On the Course</span>
              {latestRound && (
                <span className="text-[10px] text-gray-400 ml-auto">Latest: {latestRound.course}</span>
              )}
            </div>

            {latestRound ? (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-navy">{latestRound.score}</span>
                    <span className="text-xs text-coral font-semibold">+{latestRound.scoreToPar}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex gap-3 text-xs">
                    <span className={latestRound.gir < 40 ? 'text-coral font-semibold' : 'text-gray-600'}>
                      GIR {latestRound.gir.toFixed(0)}%
                    </span>
                    <span className="text-gray-600">
                      FW {latestRound.fairways.toFixed(0)}%
                    </span>
                    <span className={latestRound.puttsPerRound > 30 ? 'text-coral font-semibold' : 'text-gray-600'}>
                      {latestRound.puttsPerRound} putts
                    </span>
                    <span className="text-gray-600">
                      {latestRound.proximityToHole} prox
                    </span>
                  </div>
                </div>

                {/* Course-derived insights — compact */}
                <div className="space-y-1.5">
                  {girBelow40 && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-warm-amber mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-700">
                        <strong className="text-navy">GIR below 40%</strong> — approach shots are the biggest scoring leak.
                      </p>
                    </div>
                  )}
                  {puttingHigh && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-warm-amber mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-700">
                        <strong className="text-navy">31 putts</strong> — proximity ({latestRound.proximityToHole}) says this is an approach problem, not putting.
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Target className="w-3 h-3 text-data-blue mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-700">
                      <strong className="text-navy">7-iron dispersion 22 yds L-R</strong> — strike improvements haven&apos;t fully transferred to the course yet.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No recent rounds</p>
            )}
          </div>

          {/* ── Sub-card 3: AI Recommendation ── */}
          <div className="bg-accent/5 border border-accent/15 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] uppercase tracking-wide text-accent font-bold">AI Session Recommendation</span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {brief?.todaysObjective ?? 'No session objective set.'}
            </p>

            <div className="space-y-2">
              {lastCompleted?.coachNotes && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-navy">From Session {lastCompleted.sessionNumber}:</strong>{' '}
                    {lastCompleted.coachNotes.split('.').slice(0, 2).join('.')}.
                  </span>
                </div>
              )}
              {girBelow40 && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-navy">Course data supports today&apos;s focus</strong> — GIR is {latestRound?.gir.toFixed(0)}%, directly tied to iron strike quality. Wedge work will compound here.
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <span>Use <strong className="text-navy">external focus cues only</strong> — player over-processes internal mechanics.</span>
              </div>
              {partialRegression && (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-warm-amber mt-0.5 shrink-0" />
                  <span><strong className="text-navy">Expect partial regression</strong> — last session showed cue needs reinforcement after time off.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ON-COURSE INTELLIGENCE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-warm-amber" />
            <h2 className="text-navy font-bold text-base">On-Course Intelligence</h2>
          </div>

          {/* Handicap trend */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Handicap Index</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-navy">{handicapCurrent?.index}</span>
                {handicapDelta && (
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${Number(handicapDelta) < 0 ? 'text-accent' : 'text-coral'}`}>
                    {Number(handicapDelta) < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {handicapDelta} since Jan
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              {onCourse.handicapTrend.slice().reverse().map((entry, i) => (
                <div key={entry.date} className="text-center">
                  <div className={`text-xs font-bold font-mono ${i === onCourse.handicapTrend.length - 1 ? 'text-accent' : 'text-gray-600'}`}>
                    {entry.index}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    {entry.date.replace(', 2026', '').replace('January', 'Jan').replace('February', 'Feb').replace('March', 'Mar')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest round */}
          {latestRound && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-medium text-navy">{latestRound.course}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-navy">{latestRound.score}</span>
                  <span className="text-xs text-coral font-semibold">+{latestRound.scoreToPar}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'GIR', value: `${latestRound.gir.toFixed(1)}%`, warn: latestRound.gir < 40 },
                  { label: 'Fairways', value: `${latestRound.fairways.toFixed(1)}%`, warn: latestRound.fairways < 55 },
                  { label: 'Putts', value: String(latestRound.puttsPerRound), warn: latestRound.puttsPerRound > 30 },
                  { label: 'Proximity', value: latestRound.proximityToHole, warn: false },
                ].map((stat) => (
                  <div key={stat.label} className="bg-bg-light rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{stat.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${stat.warn ? 'text-coral' : 'text-navy'}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI-derived on-course insights */}
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-2">What the Data Says</p>
            <div className="space-y-2">
              {girBelow40 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warm-amber mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">
                    <strong className="text-navy">GIR below 40%</strong> — approach shots are the biggest scoring leak. Iron strike quality directly impacts this.
                  </p>
                </div>
              )}
              {puttingHigh && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warm-amber mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">
                    <strong className="text-navy">31+ putts per round</strong> — proximity to hole ({latestRound?.proximityToHole}) suggests this is an approach problem, not a putting problem.
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong className="text-navy">Handicap trending down</strong> — coaching changes are translating to on-course improvement. Best round (79) came after Session 2 breakthrough.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-data-blue mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong className="text-navy">7-iron dispersion 22 yds L-R</strong> — still wide for an 8-handicap. Strike consistency improvements in lessons haven&apos;t fully transferred to the course yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: SESSION HISTORY (collapsed summary)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-navy font-bold text-base">Lesson Arc</h2>
          <span className="text-xs text-gray-400 ml-auto">
            {playerHistory.lessons.length} sessions
          </span>
        </div>
        <div className="space-y-2">
          {[...playerHistory.lessons].reverse().map((lesson) => {
            const isActive = lesson.status === 'in-progress';
            return (
              <div
                key={lesson.sessionNumber}
                className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${
                  isActive
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className={`text-xs font-bold font-mono w-8 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
                  S{lesson.sessionNumber}
                </span>
                <span className="text-xs text-gray-400 font-mono w-20 shrink-0">
                  {lesson.date.replace(', 2026', '')}
                </span>
                <span className="text-sm text-navy font-medium flex-1 truncate">
                  {lesson.focus}
                </span>
                {lesson.cueUsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold shrink-0 hidden md:inline">
                    Cue introduced
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-warm-amber/15 text-warm-amber' : 'bg-accent/10 text-accent'
                }`}>
                  {isActive ? 'In Progress' : 'Completed'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5">
        <div>
          <p className="text-sm text-gray-500">Ready to begin?</p>
          <p className="text-navy font-semibold">{brief?.todaysFocus ?? 'Session'} with {golfer.name}</p>
        </div>
        <Link
          to="/coach/live"
          className="bg-accent text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-accent-light transition flex items-center gap-2"
        >
          Start Session
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
