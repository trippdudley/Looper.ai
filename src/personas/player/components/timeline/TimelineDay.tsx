import { C, F } from '../../data/tokens';
import type { TimelineEvent } from '../../data/timeline';
import TimelineEventCard from './TimelineEvent';

interface TimelineDayProps {
  date: string;
  events: TimelineEvent[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, yesterday)) return 'Yesterday';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function TimelineDay({ date, events }: TimelineDayProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Date header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 13,
            fontWeight: 600,
            color: C.ink,
          }}
        >
          {formatDate(date)}
        </span>
        <span
          style={{
            fontFamily: F.data,
            fontSize: 9,
            color: C.muted,
            fontWeight: 700,
          }}
        >
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
        <div style={{ flex: 1, height: 0.5, background: C.borderSub }} />
      </div>

      {/* Events with spine */}
      <div style={{ position: 'relative', paddingLeft: 16 }}>
        {/* Vertical spine */}
        {events.length > 1 && (
          <div
            style={{
              position: 'absolute',
              left: 5,
              top: 14,
              bottom: 14,
              width: 1,
              background: C.borderSub,
            }}
          />
        )}

        {/* Spine dots + event cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.map((event) => (
            <div key={event.id} style={{ position: 'relative' }}>
              {/* Spine dot */}
              <div
                style={{
                  position: 'absolute',
                  left: -14,
                  top: 18,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: C.surface,
                  border: `2px solid ${C.border}`,
                }}
              />
              <TimelineEventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
