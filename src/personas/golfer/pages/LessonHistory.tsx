import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessions } from '../../../data/sessions';
import SessionCard from '../../../components/session/SessionCard';

const FILTER_CHIPS = ['All', 'Driver', 'Irons', 'Short Game', 'Putting'] as const;

type Filter = (typeof FILTER_CHIPS)[number];

const FILTER_KEYWORDS: Record<Exclude<Filter, 'All'>, string[]> = {
  Driver: ['driver'],
  Irons: ['iron'],
  'Short Game': ['short game', 'pitch', 'wedge'],
  Putting: ['putt'],
};

export default function LessonHistory() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const navigate = useNavigate();

  // Sort sessions by date descending
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Build delta map from ascending order
  const sessionsAsc = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const deltaMap: Record<string, number> = {};
  sessionsAsc.forEach((session, index) => {
    if (index === 0) {
      deltaMap[session.id] = 0;
    } else {
      deltaMap[session.id] = session.improvementScore - sessionsAsc[index - 1].improvementScore;
    }
  });

  // Apply filter
  const filteredSessions =
    activeFilter === 'All'
      ? sortedSessions
      : sortedSessions.filter((session) => {
          const keywords = FILTER_KEYWORDS[activeFilter];
          const focusLower = session.focus.toLowerCase();
          return keywords.some((kw) => focusLower.includes(kw));
        });

  // Helper to get month-year label
  const getMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <h1 className="text-xl text-navy font-bold">Lesson History</h1>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveFilter(chip)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === chip
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Session List */}
      <div className="flex flex-col gap-3">
        {filteredSessions.map((session, index) => {
          const currentMonth = getMonthYear(session.date);
          const prevMonth =
            index > 0 ? getMonthYear(filteredSessions[index - 1].date) : null;
          const showSeparator = index === 0 || currentMonth !== prevMonth;

          return (
            <div key={session.id}>
              {showSeparator && (
                <div className="flex items-center gap-3 mb-3 mt-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium whitespace-nowrap">
                    {currentMonth}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
              <SessionCard
                id={session.id}
                date={new Date(session.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                coachName="Austin Reed, PGA"
                summary={session.summary}
                focus={session.focus}
                improvementDelta={deltaMap[session.id] ?? 0}
                onClick={() => navigate(`/golfer/lessons/${session.id}`)}
              />
            </div>
          );
        })}
        {filteredSessions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No lessons match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
