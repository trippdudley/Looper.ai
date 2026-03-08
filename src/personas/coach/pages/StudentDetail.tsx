import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDown,
  ChevronRight,
  User,
  Briefcase,
  Target,
  List,
  TrendingDown,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { drills } from '../../../data/drills';
import type { Golfer } from '../../../data/golfers';
import type { Session } from '../../../data/sessions';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateLong(dateStr: string): string {
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

const typeColors: Record<string, string> = {
  'full-swing': 'bg-data-blue/10 text-data-blue',
  'short-game': 'bg-accent/10 text-accent',
  'playing-lesson': 'bg-warm-amber/10 text-warm-amber',
  assessment: 'bg-gray-100 text-gray-600',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-accent/10 text-accent',
  intermediate: 'bg-data-blue/10 text-data-blue',
  advanced: 'bg-coral/10 text-coral',
};

const systemColors: Record<string, string> = {
  trackman: 'bg-data-blue/10 text-data-blue border-data-blue/20',
  arccos: 'bg-accent/10 text-accent border-accent/20',
  ghin: 'bg-gray-100 text-gray-600 border-gray-200',
  foresight: 'bg-warm-amber/10 text-warm-amber border-warm-amber/20',
};

function isFittingOld(lastFittingDate: string): boolean {
  const fitting = new Date(lastFittingDate + 'T00:00:00');
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - fitting.getFullYear()) * 12 + (now.getMonth() - fitting.getMonth());
  return monthsDiff > 12;
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();

  const golfer: Golfer = golfers.find((g) => g.id === id) || golfers.find((g) => g.id === 'golfer-mike')!;
  const golferSessions: Session[] = sessions
    .filter((s) => s.golferId === golfer.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestSession = golferSessions[golferSessions.length - 1];
  const latestDrills = latestSession
    ? latestSession.drillIds
        .map((drillId) => drills.find((d) => d.id === drillId))
        .filter(Boolean)
    : [];

  // Build trend data for charts
  const driverCarryData: { session: string; carry: number }[] = [];
  const clubPathData: { session: string; path: number }[] = [];

  golferSessions.forEach((s, i) => {
    const label = `S${i + 1}`;
    const driverCarry = s.keyMetricChanges.find((m) =>
      m.metric.toLowerCase().includes('driver carry')
    );
    const driverPath = s.keyMetricChanges.find((m) =>
      m.metric.toLowerCase().includes('driver club path')
    );
    if (driverCarry) {
      driverCarryData.push({ session: label, carry: driverCarry.after });
    }
    if (driverPath) {
      clubPathData.push({ session: label, path: driverPath.after });
    }
  });

  const fittingOld = isFittingOld(golfer.equipment.lastFittingDate);

  return (
    <div className="pb-8 space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <Link
          to="/coach/students"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <Link
          to="/coach/capture"
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Start Session
        </Link>
      </div>

      {/* Student Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-white text-xl font-bold">
              {getInitials(golfer.name)}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-navy font-bold">{golfer.name}</h1>
              <p className="text-sm text-gray-500">{golfer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-mono text-2xl font-bold text-navy">{golfer.handicapIndex}</div>
              <div className="flex items-center gap-1 justify-end">
                <ArrowDown className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-accent font-medium">Improving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Pills */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
            {golfer.sessionsCompleted} Sessions
          </span>
          <span className="px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
            {golfer.practiceFrequency} Practice
          </span>
          <span className="px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
            {golfer.roundsPerMonth} Rounds/month
          </span>
        </div>

        {/* Connected Systems */}
        <div className="flex items-center gap-2">
          {golfer.connectedSystems.map((sys) => (
            <span
              key={sys}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                systemColors[sys] || 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {sys}
            </span>
          ))}
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-[2] space-y-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-navy text-sm mb-4">Progress Overview</h2>
            <div className="flex items-start gap-6 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-accent font-mono">
                    {golfer.improvementScore}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight">
                    Improvement
                    <br />
                    Score
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Current Focus</p>
                <p className="text-sm font-medium text-navy">{golfer.currentFocus}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Goals</p>
              <ul className="space-y-2">
                {golfer.goals.map((goal, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Target className="w-3.5 h-3.5 text-accent shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Session History Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <List className="w-4 h-4 text-navy" />
              <h2 className="font-semibold text-navy text-sm">Session History</h2>
            </div>
            <div className="space-y-3">
              {[...golferSessions].reverse().map((s) => (
                <Link
                  key={s.id}
                  to="/coach/review"
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-navy">
                        {formatDate(s.date)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          typeColors[s.type] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {typeLabels[s.type] || s.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{s.focus}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-accent/20">
                      <span className="font-mono text-xs font-bold text-accent">
                        {s.improvementScore}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-navy transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Key Metric Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-navy" />
              <h2 className="font-semibold text-navy text-sm">Performance Trends</h2>
            </div>

            {driverCarryData.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 mb-2">Driver Carry (yds)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={driverCarryData}>
                    <XAxis
                      dataKey="session"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="carry"
                      stroke="#2E8B57"
                      strokeWidth={2}
                      dot={{ fill: '#2E8B57', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {clubPathData.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Driver Club Path (deg)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={clubPathData}>
                    <XAxis
                      dataKey="session"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['dataMin - 1', 'dataMax + 1']}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="path"
                      stroke="#4A90D9"
                      strokeWidth={2}
                      dot={{ fill: '#4A90D9', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Body Profile */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-navy" />
              <h3 className="font-semibold text-navy text-sm">Physical Profile</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Height</span>
                <span className="font-medium text-navy">{golfer.body.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium text-navy">{golfer.body.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dominant Hand</span>
                <span className="font-medium text-navy capitalize">
                  {golfer.body.dominantHand}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flexibility</span>
                <span className="font-medium text-navy capitalize">
                  {golfer.body.flexibility}
                </span>
              </div>
            </div>
            {golfer.body.injuryNotes && (
              <div className="mt-4 bg-coral/5 border border-coral/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                <p className="text-xs text-coral">{golfer.body.injuryNotes}</p>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-navy" />
              <h3 className="font-semibold text-navy text-sm">Equipment</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Driver', value: golfer.equipment.driver },
                { label: 'Fairway Woods', value: golfer.equipment.fairwayWoods },
                { label: 'Hybrids', value: golfer.equipment.hybrids },
                { label: 'Irons', value: golfer.equipment.irons },
                { label: 'Wedges', value: golfer.equipment.wedges },
                { label: 'Putter', value: golfer.equipment.putter },
                { label: 'Ball', value: golfer.equipment.ball },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-sm text-navy">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Last fitting: {formatDateLong(golfer.equipment.lastFittingDate)}
                  </span>
                </div>
                {fittingOld && (
                  <span className="text-xs text-warm-amber font-medium">12+ months ago</span>
                )}
              </div>
              {fittingOld && (
                <button className="mt-2 w-full px-3 py-2 border border-warm-amber text-warm-amber text-xs font-medium rounded-lg hover:bg-warm-amber/5 transition-colors">
                  Request Re-Fitting
                </button>
              )}
            </div>
          </div>

          {/* Coaching Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-navy text-sm mb-3">Coach's Notes</h3>
            {latestSession && (
              <>
                <p className="text-sm text-gray-700 leading-relaxed">{latestSession.notes}</p>
                <Link
                  to="/coach/review"
                  className="inline-block mt-3 text-sm text-data-blue font-medium hover:underline"
                >
                  View all notes &rarr;
                </Link>
              </>
            )}
          </div>

          {/* Current Drills */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-navy text-sm mb-4">Assigned Drills</h3>
            <div className="space-y-3">
              {latestDrills.map(
                (drill) =>
                  drill && (
                    <div
                      key={drill.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-semibold text-navy">{drill.name}</h4>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                            difficultyColors[drill.difficulty] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {drill.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{drill.focus}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
