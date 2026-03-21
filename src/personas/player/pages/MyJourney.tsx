import { useState, useMemo } from 'react';
import { C, F } from '../data/tokens';
import { sourceConfig } from '../data/sources';
import { timelineEvents, crossSourcePatterns } from '../data/timeline';
import SectionLabel from '../components/shared/SectionLabel';
import KpiTile from '../components/shared/KpiTile';
import CrossSourcePatternCard from '../components/timeline/CrossSourcePatternCard';
import TimelineDay from '../components/timeline/TimelineDay';

type FilterKey = 'everything' | 'golf' | 'body' | 'coaching';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'everything', label: 'Everything' },
  { key: 'golf', label: 'Golf only' },
  { key: 'body', label: 'Body' },
  { key: 'coaching', label: 'Coaching' },
];

const filterFns: Record<FilterKey, (e: typeof timelineEvents[0]) => boolean> = {
  everything: () => true,
  golf: (e) => ['round', 'practice', 'score', 'fitting', 'equipment'].includes(e.type),
  body: (e) => ['body', 'rest'].includes(e.type),
  coaching: (e) => ['lesson', 'milestone'].includes(e.type) || e.source === 'coaching',
};

export default function MyJourney() {
  const [filter, setFilter] = useState<FilterKey>('everything');

  const filtered = useMemo(
    () => timelineEvents.filter(filterFns[filter]),
    [filter]
  );

  // Group by date, newest first
  const grouped = useMemo(() => {
    const map = new Map<string, typeof timelineEvents>();
    for (const ev of filtered) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date)!.push(ev);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  // Period summary stats
  const stats = useMemo(() => {
    const rounds = timelineEvents.filter((e) => e.type === 'round').length;
    const practice = timelineEvents.filter((e) => e.type === 'practice').length;
    const lessons = timelineEvents.filter((e) => e.type === 'lesson').length;
    const bodyEvents = timelineEvents.filter((e) => e.type === 'body');
    const recoveries = bodyEvents
      .map((e) => e.metrics.find((m) => m.label === 'Recovery'))
      .filter(Boolean)
      .map((m) => parseInt(m!.value));
    const avgRecovery = recoveries.length > 0
      ? Math.round(recoveries.reduce((a, b) => a + b, 0) / recoveries.length)
      : 0;
    return { rounds, practice, lessons, avgRecovery };
  }, []);

  // Source legend — only connected
  const connectedSources = Object.entries(sourceConfig)
    .filter(([, s]) => s.status === 'live' || s.status === 'synced');

  return (
    <div>
      {/* Period summary */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: F.brand,
            fontSize: 18,
            fontWeight: 700,
            color: C.ink,
            marginBottom: 4,
          }}
        >
          Your Month
        </div>
        <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginBottom: 12 }}>
          Mar 1 - Mar 20, 2026
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
          <KpiTile label="Rounds" value={String(stats.rounds)} color={C.accent} />
          <KpiTile label="Practice" value={String(stats.practice)} color={C.caution} />
          <KpiTile label="Lessons" value={String(stats.lessons)} color={C.accent} />
          <KpiTile label="Avg Recovery" value={`${stats.avgRecovery}%`} color={stats.avgRecovery >= 65 ? C.conf : C.caution} />
        </div>
      </div>

      {/* Cross-source pattern cards */}
      <SectionLabel number="01" text="CROSS-SOURCE PATTERNS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {crossSourcePatterns.map((p) => (
          <CrossSourcePatternCard key={p.id} pattern={p} />
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              fontFamily: F.data,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              color: filter === key ? C.accent : C.muted,
              background: filter === key ? C.accentBg : 'transparent',
              border: `1px solid ${filter === key ? C.accent + '40' : C.borderSub}`,
              borderRadius: 12,
              padding: '5px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Source legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {connectedSources.map(([key, src]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: src.color }} />
            <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{src.label}</span>
          </div>
        ))}
      </div>

      {/* The Timeline */}
      <SectionLabel number="02" text="TIMELINE" />
      {grouped.map(([date, events]) => (
        <TimelineDay key={date} date={date} events={events} />
      ))}

      {/* Editorial tagline */}
      <div
        style={{
          textAlign: 'center',
          padding: '32px 16px 16px',
        }}
      >
        <p
          style={{
            fontFamily: F.editorial,
            fontSize: 16,
            fontStyle: 'italic',
            color: C.muted,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Every shot, swing, session, lesson, and body state.
        </p>
        <p
          style={{
            fontFamily: F.editorial,
            fontSize: 16,
            fontStyle: 'italic',
            color: C.accent,
            lineHeight: 1.5,
            margin: '4px 0 0',
          }}
        >
          One timeline. Your story.
        </p>
      </div>
    </div>
  );
}
