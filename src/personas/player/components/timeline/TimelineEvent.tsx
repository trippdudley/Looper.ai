import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { C, F, S } from '../../data/tokens';
import type { TimelineEvent as TEvent } from '../../data/timeline';
import TypeIcon from './TypeIcon';
import SourcePill from '../shared/SourcePill';
import ConnectionInsight from './ConnectionInsight';

interface TimelineEventCardProps {
  event: TEvent;
  defaultExpanded?: boolean;
}

function statusColor(status?: string | null): string {
  if (!status) return C.ink;
  switch (status) {
    case 'good': case 'improving': case 'best': return C.conf;
    case 'fair': return C.caution;
    case 'poor': case 'regression': return C.flag;
    case 'high': return C.caution;
    default: return C.ink;
  }
}

export default function TimelineEventCard({ event, defaultExpanded = false }: TimelineEventCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const headlineMetric = event.metrics[0];

  return (
    <div
      style={{
        ...S.card,
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 200ms ease',
      }}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
    >
      {/* Collapsed row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
        }}
      >
        <TypeIcon type={event.type} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <SourcePill source={event.source} />
            {event.time && (
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
                {event.time}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: F.brand,
              fontSize: 13,
              fontWeight: 500,
              color: C.ink,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {event.title}
          </div>
        </div>

        {headlineMetric && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              style={{
                fontFamily: F.data,
                fontSize: 14,
                fontWeight: 700,
                color: statusColor(headlineMetric.status),
                letterSpacing: '-.01em',
              }}
            >
              {headlineMetric.value}
            </div>
            <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              {headlineMetric.label}
            </div>
          </div>
        )}

        {expanded
          ? <ChevronDown size={16} color={C.muted} style={{ flexShrink: 0 }} />
          : <ChevronRight size={16} color={C.muted} style={{ flexShrink: 0 }} />
        }
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: `0.5px solid ${C.borderSub}` }}>
          {/* All metrics grid */}
          {event.metrics.length > 1 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: 6,
                marginTop: 10,
              }}
            >
              {event.metrics.map((m, i) => (
                <div key={i} style={{ ...S.cardInner, padding: '6px 8px' }}>
                  <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: statusColor(m.status), marginTop: 1 }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Narrative */}
          <p
            style={{
              fontFamily: F.brand,
              fontSize: 12,
              color: C.body,
              lineHeight: 1.5,
              margin: '10px 0 0',
            }}
          >
            {event.narrative}
          </p>

          {/* Connection insight */}
          {event.connection && (
            <ConnectionInsight label={event.connection.label} />
          )}

          {/* Coach note */}
          {event.coachNote && (
            <div
              style={{
                borderLeft: `2px solid ${C.accent}`,
                padding: '8px 12px',
                marginTop: 8,
                background: C.accentBg,
                borderRadius: '0 8px 8px 0',
              }}
            >
              <div style={{ fontFamily: F.data, fontSize: 8, color: C.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
                COACH NOTE
              </div>
              <p style={{ fontFamily: F.brand, fontSize: 12, fontStyle: 'italic', color: C.body, lineHeight: 1.5, margin: 0 }}>
                {event.coachNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
