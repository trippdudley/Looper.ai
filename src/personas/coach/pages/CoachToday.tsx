import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  ChevronRight,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Send,
  Activity,
  Target,
} from 'lucide-react';
import { golfers } from '../../../data/players';
import MetricCard from '../../../components/ui/MetricCard';

// ---------- mock data ----------

const todaySchedule = [
  {
    time: '9:00 AM',
    golferId: 'golfer-moe',
    focus: 'Driver Consistency Tune-Up',
    duration: '60 min',
    status: 'completed' as const,
    aiSummary: 'Face-to-path improved from 4.2 to 2.1 avg. Spin loft down 300 rpm on driver.',
  },
  {
    time: '10:30 AM',
    golferId: 'golfer-sarah-c',
    focus: 'Initial Full Swing Baseline',
    duration: '60 min',
    status: 'in-progress' as const,
    aiSummary: null,
  },
  {
    time: '2:00 PM',
    golferId: 'golfer-james',
    focus: 'Wedge Distance Control',
    duration: '45 min',
    status: 'briefing-ready' as const,
    aiSummary: null,
  },
];

const recentActivity = [
  {
    id: 1,
    icon: Send,
    text: 'Practice plan sent to Moe Norman — 2 drills assigned',
    time: '45 min ago',
  },
  {
    id: 2,
    icon: Activity,
    text: 'Sarah Chen completed 3 of 4 practice sessions this week',
    time: '2 hours ago',
  },
  {
    id: 3,
    icon: TrendingUp,
    text: 'Handicap update: James Wilson 14.2 \u2192 13.8 (\u21930.4)',
    time: '5 hours ago',
  },
  {
    id: 4,
    icon: Target,
    text: 'Round logged: Linda Park shot 82 at Pine Valley — 3 over her avg',
    time: 'Yesterday',
  },
];

// ---------- helpers ----------

const statusConfig = {
  completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-500' },
  'in-progress': { label: 'In Progress', classes: 'bg-warm-amber/15 text-warm-amber' },
  'briefing-ready': { label: 'Briefing Ready', classes: 'bg-accent/15 text-accent' },
} as const;

function getInitials(name: string): string {
  const parts = name.split(' ');
  return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
}

function golferById(id: string) {
  return golfers.find((g) => g.id === id);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------- sub-components ----------

/** Pulsing confidence dot with label */
function ConfidenceIndicator({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-40" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      <span className="font-mono text-xs text-accent">{pct}%</span>
      <span className="text-xs text-gray-400">confidence</span>
    </div>
  );
}

// ---------- main component ----------

/** Coach's daily command center — the first thing they see when they open Looper. */
export default function CoachToday(): JSX.Element {
  const moe = golferById('golfer-moe');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ---- Hero ---- */}
      <div>
        <h1 className="text-2xl font-bold text-navy">
          {getGreeting()}, Coach Thompson
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{formatToday()}</p>
        <p className="text-sm text-gray-400 mt-1">
          <span className="font-mono text-navy">3</span> lessons today
          {' \u00b7 '}
          <span className="font-mono text-navy">12</span> active students
          {' \u00b7 '}
          <span className="font-mono text-navy">2</span> briefings ready
        </p>
      </div>

      {/* ---- Up Next (hero card) ---- */}
      {moe && (
        <div className="bg-white rounded-xl border-2 border-accent/20 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-accent">
              Up Next
            </h2>
          </div>

          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center text-lg font-bold shrink-0">
              {getInitials(moe.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-navy">{moe.name}</h3>
                <span className="text-xs text-gray-400 font-mono">
                  HCP {moe.handicapIndex}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Session 14
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1.5">
                Iron strike consistency — continue from last session
              </p>

              <div className="mt-2">
                <ConfidenceIndicator value={0.87} />
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 mt-4">
                <Link
                  to="/coach/brief/moe-norman"
                  className="inline-flex items-center gap-1.5 bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-light transition"
                >
                  <FileText className="w-4 h-4" />
                  View Briefing
                </Link>
                <Link
                  to="/trackman"
                  className="inline-flex items-center gap-1.5 border border-gray-200 text-navy text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Start Lesson
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Time */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-mono text-navy">2:00 PM</p>
              <p className="text-xs text-gray-400">45 min</p>
            </div>
          </div>
        </div>
      )}

      {/* ---- Today's Schedule ---- */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-navy text-base font-bold mb-4">
          Today&apos;s Schedule
        </h2>
        <div className="space-y-2">
          {todaySchedule.map((slot) => {
            const golfer = golferById(slot.golferId);
            if (!golfer) return null;
            const cfg = statusConfig[slot.status];
            const briefSlug = golfer.name.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={slot.time}
                to={`/coach/brief/${briefSlug}`}
                className={`flex items-center gap-4 rounded-lg border p-4 transition hover:shadow-sm ${
                  slot.status === 'completed'
                    ? 'border-gray-100 bg-gray-50/50'
                    : slot.status === 'in-progress'
                      ? 'border-warm-amber/30 bg-warm-amber/5'
                      : 'border-gray-200 bg-white hover:border-accent/30'
                }`}
              >
                {/* Time */}
                <div className="w-20 shrink-0 text-sm font-mono text-gray-500">
                  {slot.time}
                </div>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  slot.status === 'completed'
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-navy text-white'
                }`}>
                  {getInitials(golfer.name)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${slot.status === 'completed' ? 'text-gray-500' : 'text-navy'}`}>
                      {golfer.name}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      HCP {golfer.handicapIndex}
                    </span>
                  </div>
                  {slot.status === 'completed' && slot.aiSummary ? (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {slot.aiSummary}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {slot.focus}
                    </p>
                  )}
                </div>

                {/* Status pill */}
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${cfg.classes}`}>
                  {cfg.label}
                </span>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ---- Quick Stats ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Active Students"
          value="12"
          delta={2}
          deltaLabel="this month"
          sparkData={[8, 9, 9, 10, 10, 11, 12]}
        />
        <MetricCard
          label="Lessons This Week"
          value="8"
          delta={1}
          deltaLabel="vs last week"
          sparkData={[5, 7, 6, 8, 7, 7, 8]}
        />
        <MetricCard
          label="Avg Improvement"
          value="-1.2"
          delta={-1.2}
          deltaLabel="HCP last 90 days"
        />
        <MetricCard
          label="Retention Rate"
          value="94%"
          delta={3}
          deltaLabel="vs prior quarter"
          sparkData={[88, 89, 91, 90, 92, 93, 94]}
        />
      </div>

      {/* ---- Recent Activity ---- */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-navy text-base font-bold mb-4">
          Copilot Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <item.icon className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
