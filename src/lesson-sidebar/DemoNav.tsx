import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CD, F } from './tokens';

/** Bottom demo navigation bar */
export default function DemoNav({
  stepIndex,
  totalSteps,
  visitedSteps,
  onPrev,
  onNext,
}: {
  stepIndex: number;
  totalSteps: number;
  visitedSteps: Set<number>;
  onPrev: () => void;
  onNext: () => void;
}) {
  const atStart = stepIndex === 0;
  const atEnd = stepIndex === totalSteps - 1;

  return (
    <div style={{
      height: 40, background: '#060A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 20, flexShrink: 0,
      borderTop: `1px solid ${CD.border}`,
    }}>
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={atStart}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: F.data, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          color: CD.accent, background: 'none', border: 'none',
          cursor: atStart ? 'default' : 'pointer',
          opacity: atStart ? 0.3 : 1,
        }}
      >
        <ArrowLeft size={14} /> PREV
      </button>

      {/* Step label */}
      <span style={{ fontFamily: F.data, fontSize: 11, color: CD.muted }}>
        Step {stepIndex + 1} of {totalSteps}
      </span>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCurrent = i === stepIndex;
          const isVisited = visitedSteps.has(i);
          return (
            <span key={i} style={{
              width: isCurrent ? 10 : 6, height: isCurrent ? 10 : 6,
              borderRadius: '50%',
              background: isCurrent || isVisited ? CD.accent : 'transparent',
              border: isCurrent || isVisited ? 'none' : `1.5px solid ${CD.borderSub}`,
              transition: 'all 200ms ease',
            }} />
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={atEnd}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: F.data, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          color: CD.accent, background: 'none', border: 'none',
          cursor: atEnd ? 'default' : 'pointer',
          opacity: atEnd ? 0.3 : 1,
        }}
      >
        NEXT <ArrowRight size={14} />
      </button>
    </div>
  );
}
