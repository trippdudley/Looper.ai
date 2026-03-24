import { CD, F } from './tokens';

/** Confidence color by value threshold */
function confColor(v: number): string {
  if (v >= 85) return CD.conf;
  if (v >= 60) return CD.caution;
  return CD.flag;
}

/** SVG confidence ring with animated fill and center value */
export default function ConfidenceArc({ value, size = 28 }: { value: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const color = confColor(value);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={CD.border} strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease-out, stroke 300ms ease' }}
        />
      </svg>
      <span style={{
        fontFamily: F.data, fontSize: 11, fontWeight: 700, color,
        transition: 'color 300ms ease',
      }}>
        {value}%
      </span>
    </div>
  );
}
