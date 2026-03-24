import { CD, F, type CardData } from './tokens';
import { useStreamingText } from './hooks';
import ConfidenceArc from './ConfidenceArc';

/** Insight/briefing card with optional streaming text and confidence arc */
export default function InsightCard({
  card,
  isActive,
  hasVisited,
  dimmed = false,
}: {
  card: CardData;
  isActive: boolean;
  hasVisited: boolean;
  dimmed?: boolean;
}) {
  const shouldStream = isActive && !hasVisited;
  const { displayed: bodyText, isComplete: bodyDone } = useStreamingText(card.body, shouldStream, 18);
  const { displayed: secText, isComplete: secDone } = useStreamingText(
    card.secondaryBody || '', shouldStream && bodyDone, 18
  );

  const showBody = shouldStream ? bodyText : card.body;
  const showSec = shouldStream ? secText : (card.secondaryBody || '');
  const allDone = !shouldStream || (bodyDone && (!card.secondaryBody || secDone));

  const borderColor = card.borderColor || CD.border;
  const bgTint = card.confidence && card.confidence >= 85
    ? 'rgba(16,185,129,0.04)' : undefined;

  return (
    <div style={{
      background: bgTint || CD.surface,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: 6,
      padding: '10px 12px',
      marginBottom: 8,
      opacity: dimmed ? 0.7 : 1,
      animation: shouldStream ? 'cardEnter 200ms ease-out forwards' : undefined,
      transition: 'opacity 300ms ease',
    }}>
      {/* Header row: title + confidence */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          {card.title && (
            <div style={{
              fontFamily: card.title === 'ANALYSIS' ? F.data : F.brand,
              fontSize: card.title === 'ANALYSIS' ? 10 : 14,
              fontWeight: card.title === 'ANALYSIS' ? 400 : 600,
              color: card.title === 'ANALYSIS' ? CD.muted : CD.ink,
              textTransform: card.title === 'ANALYSIS' ? 'uppercase' as const : undefined,
              letterSpacing: card.title === 'ANALYSIS' ? '0.06em' : undefined,
              marginBottom: 4,
            }}>
              {card.title}
            </div>
          )}
        </div>
        {card.confidence !== undefined && allDone && (
          <ConfidenceArc value={card.confidence} />
        )}
      </div>

      {/* Body */}
      <div style={{
        fontFamily: F.brand, fontSize: 13, lineHeight: 1.5,
        color: card.isBright ? CD.ink : CD.body,
      }}>
        {showBody}
        {shouldStream && !bodyDone && (
          <span style={{
            display: 'inline-block', width: 2, height: 12,
            backgroundColor: CD.accent, marginLeft: 1, verticalAlign: 'middle',
            animation: 'cursorBlink 530ms step-end infinite',
          }} />
        )}
      </div>

      {/* Secondary body */}
      {card.secondaryBody && (bodyDone || !shouldStream) && (
        <div style={{
          fontFamily: F.brand, fontSize: 13, lineHeight: 1.5,
          color: CD.body, marginTop: 4,
        }}>
          {showSec}
          {shouldStream && bodyDone && !secDone && (
            <span style={{
              display: 'inline-block', width: 2, height: 12,
              backgroundColor: CD.accent, marginLeft: 1, verticalAlign: 'middle',
              animation: 'cursorBlink 530ms step-end infinite',
            }} />
          )}
        </div>
      )}
    </div>
  );
}
