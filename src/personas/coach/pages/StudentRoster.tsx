import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  TrendingDown,
  TrendingUp,
  Wifi,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import type { Golfer } from '../../../data/golfers';

// ---------- helpers ----------
function getInitials(name: string) {
  const parts = name.split(' ');
  return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
}

const COACH_ID = 'coach-austin';

type FilterKey = 'all' | 'mine' | 'active' | 'attention';

const filterChips: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Students' },
  { key: 'mine', label: 'My Students' },
  { key: 'active', label: 'Active' },
  { key: 'attention', label: 'Needs Attention' },
];

const systemColor: Record<string, string> = {
  trackman: 'bg-data-blue',
  arccos: 'bg-accent',
  ghin: 'bg-gray-400',
  foresight: 'bg-warm-amber',
};

const systemLabel: Record<string, string> = {
  trackman: 'Trackman',
  arccos: 'Arccos',
  ghin: 'GHIN',
  foresight: 'Foresight',
};

function needsAttention(g: Golfer): boolean {
  return g.improvementScore < 70;
}

function isHandicapImproving(trend: number[]): boolean {
  if (trend.length < 2) return false;
  return trend[trend.length - 1]! < trend[0]!;
}

// ---------- component ----------
export default function StudentRoster() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let list = [...golfers];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.currentFocus.toLowerCase().includes(q),
      );
    }

    // filters
    switch (activeFilter) {
      case 'mine':
        list = list.filter((g) => g.coachId === COACH_ID);
        break;
      case 'active':
        list = list.filter((g) => g.sessionsCompleted > 0);
        break;
      case 'attention':
        list = list.filter(needsAttention);
        break;
    }

    return list;
  }, [search, activeFilter]);

  return (
    <div>
      {/* ---- Top bar ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl text-navy font-bold">Students</h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent w-56"
            />
          </div>
          {/* Add Student button */}
          <button className="flex items-center gap-1.5 bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-light transition">
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* ---- Filter chips ---- */}
      <div className="flex gap-2 mb-6">
        {filterChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setActiveFilter(chip.key)}
            className={`text-sm px-4 py-1.5 rounded-full border transition font-medium ${
              activeFilter === chip.key
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-gray-300 hover:border-navy hover:text-navy'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ---- Student Grid ---- */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No students found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different search term or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((golfer) => {
            const improving = isHandicapImproving(golfer.handicapTrend);
            const attention = needsAttention(golfer);
            const isMine = golfer.coachId === COACH_ID;

            return (
              <div
                key={golfer.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition p-5 flex flex-col"
              >
                {/* Top: avatar + name + handicap */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center text-base font-bold">
                      {getInitials(golfer.name)}
                    </div>
                    {attention && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-coral border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy text-sm truncate">
                        {golfer.name}
                      </span>
                      {!isMine && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          Other coach
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-sm font-mono font-bold text-navy">
                        {golfer.handicapIndex}
                      </span>
                      {improving ? (
                        <TrendingDown className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-coral" />
                      )}
                      <span
                        className={`text-[10px] font-medium ${improving ? 'text-accent' : 'text-coral'}`}
                      >
                        {improving ? 'Improving' : 'Trending up'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current focus */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {golfer.currentFocus}
                </p>

                {/* Stats row */}
                <div className="flex gap-4 text-center mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Sessions</p>
                    <p className="text-sm font-bold text-navy">
                      {golfer.sessionsCompleted}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Practice</p>
                    <p className="text-sm font-bold text-navy">
                      {golfer.practiceFrequency}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Rounds/mo</p>
                    <p className="text-sm font-bold text-navy">
                      {golfer.roundsPerMonth}
                    </p>
                  </div>
                </div>

                {/* Connected systems */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Wifi className="w-3 h-3 text-gray-400" />
                  {golfer.connectedSystems.map((sys) => (
                    <span
                      key={sys}
                      className={`text-[10px] font-medium text-white px-2 py-0.5 rounded-full ${systemColor[sys] ?? 'bg-gray-400'}`}
                      title={systemLabel[sys] ?? sys}
                    >
                      {systemLabel[sys] ?? sys}
                    </span>
                  ))}
                </div>

                {/* Improvement score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Improvement Score
                    </span>
                    <span className="text-xs font-bold text-navy">
                      {golfer.improvementScore}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${golfer.improvementScore}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    to={`/coach/students/${golfer.id}`}
                    className="flex-1 text-center text-sm font-medium text-accent border border-accent rounded-lg py-1.5 hover:bg-accent/5 transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/coach/capture"
                    className="flex-1 text-center text-sm font-medium bg-accent text-white rounded-lg py-1.5 hover:bg-accent-light transition"
                  >
                    Start Session
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
