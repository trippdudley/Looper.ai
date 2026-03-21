import { Zap } from 'lucide-react';
import { C, F, S } from '../../data/tokens';
import type { CrossSourcePattern } from '../../data/timeline';
import SourcePill from '../shared/SourcePill';

interface CrossSourcePatternCardProps {
  pattern: CrossSourcePattern;
}

export default function CrossSourcePatternCard({ pattern }: CrossSourcePatternCardProps) {
  return (
    <div
      style={{
        ...S.card,
        borderLeft: `3px solid ${C.accent}`,
        borderRadius: '0 12px 12px 0',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Zap size={14} color={C.accent} />
        <span
          style={{
            fontFamily: F.data,
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: C.accent,
          }}
        >
          CROSS-SOURCE PATTERN
        </span>
        <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
          {pattern.eventCount} events
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: F.brand,
          fontSize: 15,
          fontWeight: 600,
          color: C.ink,
          marginBottom: 8,
        }}
      >
        {pattern.title}
      </div>

      {/* Side-by-side comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div style={{ ...S.cardInner, padding: '8px 10px' }}>
          <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {pattern.comparisonA.label}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 2 }}>
            {pattern.comparisonA.value}
          </div>
        </div>
        <div style={{ ...S.cardInner, padding: '8px 10px' }}>
          <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {pattern.comparisonB.label}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 2 }}>
            {pattern.comparisonB.value}
          </div>
        </div>
      </div>

      {/* Insight text */}
      <p
        style={{
          fontFamily: F.brand,
          fontSize: 12,
          color: C.body,
          lineHeight: 1.5,
          margin: '0 0 10px',
        }}
      >
        {pattern.insight}
      </p>

      {/* Source pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        {pattern.sources.map((s) => (
          <SourcePill key={s} source={s} />
        ))}
      </div>
    </div>
  );
}
