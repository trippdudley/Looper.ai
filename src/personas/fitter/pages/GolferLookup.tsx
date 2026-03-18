import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Shield,
  Target,
  Briefcase,
  Activity,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { trackmanShots } from '../../../data/trackmanData';
import type { Session } from '../../../data/sessions';
import type { TrackmanShot } from '../../../data/trackmanData';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function monthsAgo(dateStr: string): number {
  const now = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return (
    (now.getFullYear() - d.getFullYear()) * 12 +
    now.getMonth() -
    d.getMonth()
  );
}

function computeSessionAverages(
  mikeSessions: Session[],
  allShots: TrackmanShot[]
) {
  return mikeSessions.map((session) => {
    const shots = allShots.filter((s) => s.sessionId === session.id);
    const count = shots.length || 1;
    const avgClubSpeed =
      shots.reduce((sum, s) => sum + s.clubSpeed, 0) / count;
    const avgAttackAngle =
      shots.reduce((sum, s) => sum + s.attackAngle, 0) / count;
    const avgSpinRate =
      shots.reduce((sum, s) => sum + s.spinRate, 0) / count;
    return {
      session: session.id.replace('session-', 'S'),
      clubSpeed: Math.round(avgClubSpeed * 10) / 10,
      attackAngle: Math.round(avgAttackAngle * 10) / 10,
      spinRate: Math.round(avgSpinRate),
    };
  });
}

const systemColors: Record<string, { bg: string; text: string }> = {
  trackman: { bg: 'bg-data-blue/15 text-data-blue', text: 'bg-data-blue' },
  arccos: { bg: 'bg-accent/15 text-accent', text: 'bg-accent' },
  ghin: { bg: 'bg-gray-200 text-gray-600', text: 'bg-gray-400' },
  foresight: { bg: 'bg-warm-amber/15 text-warm-amber', text: 'bg-warm-amber' },
};

export default function GolferLookup() {
  const [query, setQuery] = useState('Mike Reynolds');

  const golfer = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return (
      golfers.find(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q)
      ) ?? null
    );
  }, [query]);

  const mikeSessions = useMemo(() => {
    if (!golfer) return [];
    return sessions
      .filter((s) => s.golferId === golfer.id)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [golfer]);

  const mikeShots = useMemo(() => {
    if (!golfer) return [];
    const sessionIds = new Set(mikeSessions.map((s) => s.id));
    return trackmanShots.filter((s) => sessionIds.has(s.sessionId));
  }, [golfer, mikeSessions]);

  const avgClubSpeed = useMemo(() => {
    if (mikeShots.length === 0) return 0;
    return (
      Math.round(
        (mikeShots.reduce((sum, s) => sum + s.clubSpeed, 0) /
          mikeShots.length) *
          10
      ) / 10
    );
  }, [mikeShots]);

  const sessionTrends = useMemo(
    () => computeSessionAverages(mikeSessions, trackmanShots),
    [mikeSessions]
  );

  const latestSession = mikeSessions[mikeSessions.length - 1] ?? null;

  const handicapData = golfer
    ? golfer.handicapTrend.map((v, i) => ({ idx: i, value: v }))
    : [];

  const fittingMonthsAgo = golfer
    ? monthsAgo(golfer.equipment.lastFittingDate)
    : 0;

  const coachingMonths = golfer ? monthsAgo(golfer.memberSince) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search golfer by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>
      </div>

      {/* Found State */}
      {golfer && (
        <>
          {/* Profile Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            {/* Header Row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {getInitials(golfer.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy">
                    {golfer.name}
                  </h2>
                  <p className="text-sm text-gray-500">{golfer.email}</p>
                </div>
              </div>

              {/* Center: Handicap Badge */}
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  HCP
                </p>
                <p className="font-mono text-2xl font-bold text-navy">
                  {golfer.handicapIndex}
                </p>
              </div>

              {/* Right: Member Since */}
              <div className="text-right">
                <p className="text-xs text-gray-500">Member since</p>
                <p className="text-sm font-medium text-navy flex items-center gap-1.5 justify-end">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(golfer.memberSince)}
                </p>
              </div>
            </div>

            {/* Accent Banner */}
            <div className="bg-accent/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm font-medium text-accent">
                  Looper Profile Available — {coachingMonths} months of
                  coaching data
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 ml-6">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  Shared with golfer's permission
                </span>
              </div>
            </div>

            {/* 4-Column Metric Row */}
            <div className="grid grid-cols-4 gap-4">
              {/* Handicap Trend */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Handicap Trend</p>
                <div className="flex items-end gap-3">
                  <div className="w-20 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={handicapData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2E8B57"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-xs font-medium text-accent">
                    ↓{' '}
                    {(
                      golfer.handicapTrend[0] -
                      golfer.handicapTrend[golfer.handicapTrend.length - 1]
                    ).toFixed(1)}{' '}
                    strokes
                  </span>
                </div>
              </div>

              {/* Avg Club Speed */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Avg Club Speed</p>
                <p className="font-mono text-lg font-bold text-navy">
                  {avgClubSpeed}
                  <span className="text-xs text-gray-400 ml-1 font-sans font-normal">
                    mph
                  </span>
                </p>
              </div>

              {/* Sessions */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                <p className="font-mono text-lg font-bold text-navy">
                  {golfer.sessionsCompleted}
                </p>
              </div>

              {/* Last Fitting */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Last Fitting</p>
                <p className="text-sm font-medium text-navy">
                  {formatDate(golfer.equipment.lastFittingDate)}
                </p>
                {fittingMonthsAgo > 10 && (
                  <p className="text-xs text-warm-amber font-medium mt-0.5">
                    {fittingMonthsAgo} months ago
                  </p>
                )}
              </div>
            </div>

            {/* Connected Data Sources */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">
                Connected Data:
              </span>
              {golfer.connectedSystems.map((sys) => {
                const colors = systemColors[sys] ?? {
                  bg: 'bg-gray-100 text-gray-600',
                  text: 'bg-gray-400',
                };
                return (
                  <span
                    key={sys}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${colors.text}`}
                    />
                    {sys}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Card 1: Coaching Focus Areas */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-navy">
                  Coaching Focus Areas
                </h3>
              </div>
              <p className="text-sm text-navy font-medium mb-3">
                {golfer.currentFocus}
              </p>

              {latestSession && (
                <>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Recent Session Faults
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {latestSession.faults.map((fault, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-coral mt-1.5 shrink-0" />
                        {fault}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Coach's Key Cues
                  </p>
                  <ul className="space-y-1.5">
                    {latestSession.coachingCues.map((cue, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 italic leading-relaxed"
                      >
                        "{cue}"
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Card 2: Equipment Profile */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-navy">
                  Equipment Profile
                </h3>
              </div>
              <div className="space-y-3">
                {(
                  [
                    ['Driver', golfer.equipment.driver],
                    ['Irons', golfer.equipment.irons],
                    ['Wedges', golfer.equipment.wedges],
                    ['Putter', golfer.equipment.putter],
                    ['Ball', golfer.equipment.ball],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm text-navy">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Last fitted:{' '}
                  {formatDate(golfer.equipment.lastFittingDate)}
                </p>
              </div>
            </div>

            {/* Card 3: Key Metric Trends */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-navy">
                  Key Metric Trends
                </h3>
              </div>
              <div className="space-y-4">
                {/* Club Speed Trend */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Club Speed</p>
                    <p className="text-xs font-mono text-navy">
                      {sessionTrends[sessionTrends.length - 1]?.clubSpeed ?? '—'}{' '}
                      mph
                    </p>
                  </div>
                  <div className="h-[72px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionTrends}>
                        <Line
                          type="monotone"
                          dataKey="clubSpeed"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 2, fill: '#3B82F6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attack Angle Trend */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Attack Angle</p>
                    <p className="text-xs font-mono text-navy">
                      {sessionTrends[sessionTrends.length - 1]?.attackAngle ?? '—'}°
                    </p>
                  </div>
                  <div className="h-[72px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionTrends}>
                        <Line
                          type="monotone"
                          dataKey="attackAngle"
                          stroke="#2E8B57"
                          strokeWidth={2}
                          dot={{ r: 2, fill: '#2E8B57' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Spin Rate Trend */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">Spin Rate</p>
                    <p className="text-xs font-mono text-navy">
                      {sessionTrends[sessionTrends.length - 1]?.spinRate ?? '—'}{' '}
                      rpm
                    </p>
                  </div>
                  <div className="h-[72px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionTrends}>
                        <Line
                          type="monotone"
                          dataKey="spinRate"
                          stroke="#E97451"
                          strokeWidth={2}
                          dot={{ r: 2, fill: '#E97451' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-end">
            <Link
              to="/fitter/brief"
              className="inline-flex items-center gap-2 bg-accent text-white rounded-lg px-6 py-3 font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              View AI Brief
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
