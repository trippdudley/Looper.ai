import { sourceConfig } from '../../data/sources';
import { F } from '../../data/tokens';

interface SourcePillProps {
  source: string;
  size?: 'sm' | 'md';
}

export default function SourcePill({ source, size = 'sm' }: SourcePillProps) {
  const cfg = sourceConfig[source];
  if (!cfg) return null;

  const fontSize = size === 'sm' ? 8 : 9;
  const padding = size === 'sm' ? '1px 6px' : '2px 8px';

  return (
    <span
      style={{
        fontFamily: F.data,
        fontSize,
        fontWeight: 700,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: cfg.color,
        background: cfg.color + '14',
        border: `1px solid ${cfg.color}30`,
        borderRadius: 3,
        padding,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.short}
    </span>
  );
}
