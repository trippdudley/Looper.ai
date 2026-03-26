// Looper Player — Design Token System
// DARK MODE (WHOOP-inspired premium). Split voice: DM Sans (brand) + Space Mono (data) + Playfair Display (editorial).

export const C = {
  // Foundation — dark layered surfaces
  bg:         '#0C1117',
  surface:    '#151D28',
  surfaceAlt: '#1E2A36',
  surfaceEl:  '#253342',  // elevated surface (hover, active cards)
  border:     '#2A3544',
  borderSub:  '#1E2A36',

  // Brand accent — deep teal
  accent:       '#0D7C66',
  accentHov:    '#0FA87A',
  accentBg:     'rgba(13,124,102,0.12)',
  accentBright: '#10B981',

  // Text hierarchy (light on dark)
  ink:    '#E8ECF1',
  body:   '#8B99A8',
  muted:  '#5E6E7E',
  dim:    '#3A4856',

  // Semantic
  conf:      '#10B981',
  confBg:    'rgba(16,185,129,0.12)',
  confGlow:  'rgba(16,185,129,0.25)',
  caution:   '#F59E0B',
  cautionBg: 'rgba(245,158,11,0.12)',
  flag:      '#EF4444',
  flagBg:    'rgba(239,68,68,0.12)',
  flagGlow:  'rgba(239,68,68,0.25)',

  // Gradients
  heroGrad:    'linear-gradient(135deg, #151D28 0%, #1A2A35 50%, #152520 100%)',
  accentGrad:  'linear-gradient(135deg, #0D7C66 0%, #10B981 100%)',
  confGrad:    'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
  flagGrad:    'linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%)',
  cautionGrad: 'linear-gradient(135deg, #78350F 0%, #F59E0B 100%)',

  // Overlays
  overlay:  'rgba(12,17,23,0.8)',
  glass:    'rgba(21,29,40,0.6)',
} as const;

export const F = {
  brand: "'DM Sans', system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', 'SF Mono', 'Fira Code', monospace",
  editorial: "'Playfair Display', Georgia, serif",
} as const;

// Card styles — dark layered surfaces with subtle glow
export const S = {
  card: {
    background: C.surface,
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    padding: '14px 16px',
  } as React.CSSProperties,
  cardInner: {
    background: C.surfaceAlt,
    borderRadius: '6px',
    border: `1px solid ${C.border}`,
    padding: '10px 12px',
  } as React.CSSProperties,
  cardElevated: {
    background: C.surface,
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    padding: '14px 16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)',
  } as React.CSSProperties,
  cardHero: {
    background: C.heroGrad,
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    padding: '20px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
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

export const fmtDelta = (v: number, _type: string): { text: string; color: string } => {
  const prefix = v > 0 ? '\u25B2 +' : v < 0 ? '\u25BC \u2212' : '';
  const color = v > 0 ? C.conf : v < 0 ? C.flag : C.muted;
  const formatted = Math.abs(v).toFixed(1);
  return { text: prefix + formatted, color };
};
