import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  X,
  Activity,
  Zap,
  RotateCcw,
  Target,
  FileText,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { drills } from '../../../data/drills';

// ---------- mock data for today's schedule ----------
const todaySchedule = [
  {
    time: '9:00 AM',
    golferId: 'golfer-moe',
    type: 'full-swing' as const,
    focus: 'Driver Consistency Tune-Up',
    duration: '60 min',
    status: 'completed' as const,
  },
  {
    time: '10:30 AM',
    golferId: 'golfer-sarah-c',
    type: 'assessment' as const,
    focus: 'Initial Full Swing Baseline',
    duration: '60 min',
    status: 'in-progress' as const,
  },
  {
    time: '2:00 PM',
    golferId: 'golfer-james',
    type: 'short-game' as const,
    focus: 'Wedge Distance Control',
    duration: '45 min',
    status: 'upcoming' as const,
  },
];

const activityFeed = [
  {
    id: 1,
    text: 'Moe Norman completed practice session',
    time: '2 hours ago',
    color: 'bg-accent',
    icon: Activity,
  },
  {
    id: 2,
    text: 'Sarah Chen connected Trackman',
    time: 'Yesterday',
    color: 'bg-data-blue',
    icon: Zap,
  },
  {
    id: 3,
    text: 'James Okafor posted new round: 78 at Pine Valley',
    time: 'Yesterday',
    color: 'bg-warm-amber',
    icon: Target,
  },
  {
    id: 4,
    text: 'Linda Park requested session reschedule',
    time: '2 days ago',
    color: 'bg-coral',
    icon: RotateCcw,
  },
];

// ---------- helpers ----------
const typeBadgeColor: Record<string, string> = {
  assessment: 'bg-coral/15 text-coral',
  'full-swing': 'bg-accent/15 text-accent',
  'short-game': 'bg-data-blue/15 text-data-blue',
  'playing-lesson': 'bg-warm-amber/15 text-warm-amber',
};

const typeLabel: Record<string, string> = {
  assessment: 'Assessment',
  'full-swing': 'Full Swing',
  'short-game': 'Short Game',
  'playing-lesson': 'Playing Lesson',
};

function getInitials(name: string) {
  const parts = name.split(' ');
  return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
}

function golferById(id: string) {
  return golfers.find((g) => g.id === id);
}

// ---------- component ----------
export default function CoachToday() {
  const [alerts, setAlerts] = useState([
    {
      id: 'a1',
      golferName: 'Sarah Chen',
      message: 'Handicap increased 0.5 strokes in last 30 days',
      borderColor: 'border-l-warm-amber',
      Icon: AlertCircle,
    },
    {
      id: 'a2',
      golferName: 'Linda Park',
      message: 'No practice logged in 14 days',
      borderColor: 'border-l-coral',
      Icon: Clock,
    },
  ]);

  function dismissAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  // Next upcoming session data
  const nextSession = todaySchedule.find((s) => s.status === 'upcoming');
  const nextGolfer = nextSession ? golferById(nextSession.golferId) : null;

  // Suggested drills for the pre-lesson brief
  const suggestedDrills = [
    drills.find((d) => d.id === 'drill-9to3'),
    drills.find((d) => d.id === 'drill-alignment-gate'),
  ].filter(Boolean);

  return (
    <div>
      {/* ---- Top Section ---- */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-navy text-2xl font-bold">
            Good morning, Austin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Saturday, March 8, 2026</p>
        </div>

        <div className="flex gap-3">
          {/* Quick stat cards */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <Calendar className="w-4 h-4 text-data-blue" />
            <div>
              <p className="text-xs text-gray-500">Today&apos;s Sessions</p>
              <p className="text-lg font-bold text-navy">3</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <TrendingUp className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-lg font-bold text-navy">12</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-coral" />
            <div>
              <p className="text-xs text-gray-500">Student Alerts</p>
              <p className="text-lg font-bold text-coral">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- 2-Column Layout ---- */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (~60%) */}
        <div className="flex-[2] min-w-0 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-navy text-lg font-bold mb-4">
              Today&apos;s Schedule
            </h2>
            <div className="space-y-3">
              {todaySchedule.map((slot) => {
                const golfer = golferById(slot.golferId);
                if (!golfer) return null;
                return (
                  <div
                    key={slot.time}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      slot.status === 'completed'
                        ? 'border-gray-200 bg-gray-50'
                        : slot.status === 'in-progress'
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Time */}
                    <div className="w-20 shrink-0 text-sm font-mono text-gray-500">
                      {slot.time}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {getInitials(golfer.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-navy text-sm">
                          {golfer.name}
                        </span>
                        <Link
                          to={`/coach/brief/${golfer.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-data-blue hover:text-accent transition px-1.5 py-0.5 rounded bg-data-blue/10 hover:bg-accent/10"
                          title="Pre-session brief"
                        >
                          <FileText className="w-3 h-3" />
                          Brief
                        </Link>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeColor[slot.type]}`}
                        >
                          {typeLabel[slot.type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {slot.focus}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="text-xs text-gray-400 shrink-0">
                      {slot.duration}
                    </div>

                    {/* Status / Action */}
                    <div className="shrink-0">
                      {slot.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                      {slot.status === 'in-progress' && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                        </span>
                      )}
                      {slot.status === 'upcoming' && (
                        <Link
                          to="/coach/live"
                          className="text-xs font-medium bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-light transition"
                        >
                          Start Session
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Feed — staggered entrance */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-navy text-lg font-bold mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 animate-stagger-in"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div
                    className={`mt-1 w-7 h-7 rounded-full ${item.color}/15 flex items-center justify-center shrink-0`}
                  >
                    <item.icon className={`w-3.5 h-3.5 text-gray-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (~40%) */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Pre-Lesson Brief */}
          {nextGolfer && nextSession && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-data-blue" />
                <h2 className="text-navy text-lg font-bold">
                  Next Up: {nextGolfer.name}
                </h2>
              </div>

              <div className="text-xs text-gray-500 mb-1">
                {nextSession.time} &middot; {nextSession.duration}
              </div>

              {/* Quick stats */}
              <div className="flex gap-4 mt-3 mb-4">
                <div className="bg-bg-light rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-xs text-gray-500">Handicap</p>
                  <p className="text-sm font-bold text-navy">
                    {nextGolfer.handicapIndex}
                  </p>
                </div>
                <div className="bg-bg-light rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-xs text-gray-500">Sessions</p>
                  <p className="text-sm font-bold text-navy">
                    {nextGolfer.sessionsCompleted}
                  </p>
                </div>
                <div className="bg-bg-light rounded-lg px-3 py-2 text-center flex-1">
                  <p className="text-xs text-gray-500">Focus</p>
                  <p className="text-sm font-bold text-navy truncate">
                    Wedges
                  </p>
                </div>
              </div>

              {/* Key areas */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Key areas to address
                </h3>
                <ul className="space-y-1.5">
                  {[
                    'Wedge gapping -- 52\u00b0 vs 56\u00b0 overlap',
                    'Distance control 80-120 yards',
                    'Spin consistency on partial swings',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested drills */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Suggested drills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedDrills.map((drill) =>
                    drill ? (
                      <span
                        key={drill.id}
                        className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium"
                      >
                        {drill.name}
                      </span>
                    ) : null,
                  )}
                </div>
              </div>

              <Link
                to={`/coach/students/${nextGolfer.id}`}
                className="text-sm text-accent font-medium hover:text-accent-light transition"
              >
                View full profile &rarr;
              </Link>
            </div>
          )}

          {/* Student Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-navy text-lg font-bold mb-4">
              Student Alerts
            </h2>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400">No active alerts</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-l-4 ${alert.borderColor} rounded-lg bg-bg-light p-4 flex items-start gap-3`}
                  >
                    <alert.Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">
                        {alert.golferName}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600 transition shrink-0"
                      aria-label="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
