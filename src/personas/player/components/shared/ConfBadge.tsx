import { C, F } from '../../data/tokens';

interface ConfBadgeProps {
  value: number;
}

export default function ConfBadge({ value }: ConfBadgeProps) {
  const level = value >= 80 ? 'high' : value >= 50 ? 'medium' : 'low';
  const colors = {
    high:   { bg: C.confBg, text: C.conf },
    medium: { bg: C.cautionBg, text: C.caution },
    low:    { bg: C.flagBg, text: C.flag },
  };
  const { bg, text } = colors[level];

  return (
    <span
      style={{
        fontFamily: F.data,
        fontSize: 9,
        fontWeight: 700,
        padding: '1px 7px',
        borderRadius: 3,
        background: bg,
        color: text,
      }}
    >
      {value}%
    </span>
  );
}
