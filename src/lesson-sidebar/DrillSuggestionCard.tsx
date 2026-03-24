import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CD, F, type DrillData } from './tokens';
import { useStreamingText } from './hooks';
import ConfidenceArc from './ConfidenceArc';

/** Drill suggestion card with expandable "Why?" section */
export default function DrillSuggestionCard({
  drill,
  isActive,
  hasVisited,
}: {
  drill: DrillData;
  isActive: boolean;
  hasVisited: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldStream = isActive && !hasVisited;
  const { displayed, isComplete } = useStreamingText(drill.description, shouldStream, 18);
  const showDesc = shouldStream ? displayed : drill.description;

  return (
    <div style={{
      background: CD.accentBg,
      borderLeft: `3px solid ${CD.accent}`,
      borderRadius: 6,
      padding: '10px 12px',
      marginBottom: 8,
      animation: shouldStream ? 'cardEnter 200ms ease-out forwards' : undefined,
    }}>
      {/* Label */}
      <div style={{
        fontFamily: F.data, fontSize: 10, fontWeight: 400,
        color: CD.accent, textTransform: 'uppercase', letterSpacing: '0.06em',
        marginBottom: 6,
      }}>
        SUGGESTED DRILL
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ fontFamily: F.brand, fontSize: 16, fontWeight: 500, color: CD.ink, marginBottom: 4 }}>
            {drill.name}
          </div>
          <span style={{
            display: 'inline-block',
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            color: drill.typeBadgeColor,
            background: drill.typeBadgeBg,
            padding: '2px 8px', borderRadius: 99,
          }}>
            {drill.type}
          </span>
        </div>
        <ConfidenceArc value={drill.confidence} />
      </div>

      {/* Description */}
      <div style={{ fontFamily: F.brand, fontSize: 13, lineHeight: 1.5, color: CD.body, marginBottom: 8 }}>
        {showDesc}
        {shouldStream && !isComplete && (
          <span style={{
            display: 'inline-block', width: 2, height: 12,
            backgroundColor: CD.accent, marginLeft: 1, verticalAlign: 'middle',
            animation: 'cursorBlink 530ms step-end infinite',
          }} />
        )}
      </div>

      {/* Why? expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: F.brand, fontSize: 11, color: CD.accent,
          marginBottom: expanded ? 6 : 8,
        }}
      >
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        Why?
      </button>
      {expanded && (
        <div style={{
          fontFamily: F.brand, fontSize: 12, lineHeight: 1.5, color: CD.body,
          padding: '8px 0 4px 0',
          borderTop: `1px solid ${CD.borderSub}`,
          marginBottom: 8,
        }}>
          {drill.whyText}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{
          fontFamily: F.data, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          background: CD.accent, color: CD.bg, border: 'none',
          padding: '6px 16px', borderRadius: 4, cursor: 'pointer',
        }}>
          Accept
        </button>
        <button style={{
          fontFamily: F.data, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          background: 'transparent', color: CD.body,
          border: `1px solid ${CD.borderSub}`,
          padding: '6px 16px', borderRadius: 4, cursor: 'pointer',
        }}>
          Alternatives
        </button>
      </div>
    </div>
  );
}
