/**
 * ConfBadge — Confidence badge with glow effect (dark mode).
 * Three tiers: high (conf), medium (caution), low (flag).
 */
import { C, F } from '../../data/tokens';

interface ConfBadgeProps {
  value: number;
}

export default function ConfBadge({ value }: ConfBadgeProps): React.JSX.Element {
  const level = value >= 80 ? 'high' : value >= 50 ? 'medium' : 'low';
  const colors = {
    high:   { bg: C.confBg, text: C.conf, glow: C.confGlow },
    medium: { bg: C.cautionBg, text: C.caution, glow: 'rgba(245,158,11,0.25)' },
    low:    { bg: C.flagBg, text: C.flag, glow: C.flagGlow },
  };
  const { bg, text, glow } = colors[level];

  return (
    <span
      style={{
        fontFamily: F.data,
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 4,
        background: bg,
        color: text,
        boxShadow: `0 0 8px ${glow}`,
        letterSpacing: '.02em',
      }}
    >
      {value}%
    </span>
  );
}
