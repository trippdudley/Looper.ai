// Looper Player — Design Token System
// Light mode (default). Split voice: DM Sans (brand) + Space Mono (data) + Playfair Display (editorial).

export const C = {
  // Foundation
  bg:         '#F6F7F9',
  surface:    '#FFFFFF',
  surfaceAlt: '#F0F2F5',
  border:     '#DFE2E7',
  borderSub:  '#ECEEF2',

  // Brand accent — deep teal
  accent:       '#0D7C66',
  accentHov:    '#0A6352',
  accentBg:     '#E6F5F1',
  accentBright: '#0FA87A',

  // Text hierarchy
  ink:    '#1A1F2B',
  body:   '#4B5563',
  muted:  '#9CA3AF',
  dim:    '#C5CAD1',

  // Semantic
  conf:      '#0FA87A',
  confBg:    '#E6F5F1',
  caution:   '#D4980B',
  cautionBg: '#FDF6E3',
  flag:      '#C93B3B',
  flagBg:    '#FDE8E8',

  // Overlays
  overlay:     'rgba(26,31,43,0.5)',
  glass:       'rgba(255,255,255,0.6)',
  glassBorder: 'rgba(255,255,255,0.45)',
} as const;

export const F = {
  brand: "'DM Sans', system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', 'SF Mono', 'Fira Code', monospace",
  editorial: "'Playfair Display', Georgia, serif",
} as const;

// Solid card styles (Tier 1 — default for all data surfaces)
export const S = {
  card: {
    background: C.surface,
    borderRadius: '12px',
    border: `0.5px solid ${C.borderSub}`,
    padding: '14px 16px',
  } as React.CSSProperties,
  cardInner: {
    background: C.surfaceAlt,
    borderRadius: '8px',
    border: 'none',
    padding: '10px 12px',
  } as React.CSSProperties,
};

// Format utilities
export const fmt = (v: number, type: string): string => {
  switch (type) {
    case 'yds':  return v.toFixed(1) + ' yds';
    case 'mph':  return v.toFixed(1) + ' mph';
    case 'rpm':  return Math.round(v).toLocaleString() + ' rpm';
    case 'deg':  return v.toFixed(1) + '\u00B0';
    case 'pct':  return v.toFixed(1) + '%';
    case 'sg':   return (v > 0 ? '+' : '') + v.toFixed(1);
    case 'int':  return Math.round(v).toLocaleString();
    default:     return String(v);
  }
};

export const fmtDelta = (v: number, type: string): { text: string; color: string } => {
  const prefix = v > 0 ? '\u25B2 +' : v < 0 ? '\u25BC \u2212' : '';
  const color = v > 0 ? C.conf : v < 0 ? C.flag : C.muted;
  // Use base format but strip any sign prefix from the absolute value
  const fmtType = type === 'sg' ? 'pct' : type; // avoid sg's +/- prefix on abs value
  const formatted = Math.abs(v).toFixed(1);
  return { text: prefix + formatted, color };
};
