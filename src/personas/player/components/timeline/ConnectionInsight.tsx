import { ArrowRight } from 'lucide-react';
import { C, F } from '../../data/tokens';

interface ConnectionInsightProps {
  label: string;
}

export default function ConnectionInsight({ label }: ConnectionInsightProps) {
  return (
    <div
      style={{
        background: C.accentBg,
        borderRadius: 8,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 8,
      }}
    >
      <ArrowRight size={14} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: F.brand,
          fontSize: 12,
          fontWeight: 500,
          color: C.accent,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </div>
  );
}
