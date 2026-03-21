import { C, F, S } from '../../data/tokens';

interface KpiTileProps {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  color?: string;
  variant?: 'standard' | 'embedded' | 'highlighted';
}

export default function KpiTile({ label, value, unit, sub, color = C.accent, variant = 'embedded' }: KpiTileProps) {
  const bgMap = {
    standard: C.surface,
    embedded: C.surfaceAlt,
    highlighted: C.accentBg,
  };

  return (
    <div
      style={{
        ...S.cardInner,
        background: bgMap[variant],
        borderLeft: `3px solid ${color}`,
        borderRadius: 0,
      }}
    >
      <div
        style={{
          fontFamily: F.data,
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: C.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: F.data,
          fontSize: 22,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: '-.01em',
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 11, fontWeight: 400, color: C.muted, marginLeft: 2 }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
