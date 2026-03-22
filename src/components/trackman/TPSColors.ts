// ─── Shared tokens for TrackMan integration (matches CoachingOS dark mode) ───

export const C = {
  bg:       '#080B10',
  surface:  '#0E1319',
  elevated: '#141B24',
  border:   '#1A2332',
  borderSub:'#1E2A38',
  accent:   '#10B981',
  accentHov:'#34D399',
  accentBg: 'rgba(16,185,129,0.08)',
  ink:      '#E8ECF1',
  body:     '#94A3B8',
  muted:    '#5E6E7E',
  dim:      '#2E3A48',
  data:     '#CBD5E1',
  dataDim:  '#64748B',
  conf:     '#10B981',
  confBg:   'rgba(16,185,129,0.08)',
  caution:  '#F59E0B',
  cautionBg:'rgba(245,158,11,0.08)',
  flag:     '#EF4444',
  flagBg:   'rgba(239,68,68,0.08)',
  tps:      '#E63946',
  tpsBg:    'rgba(230,57,70,0.06)',
  tpsBorder:'rgba(230,57,70,0.18)',
} as const;

export const F = {
  brand: "Inter, system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', 'SF Mono', 'Fira Code', monospace",
} as const;

export function qualityColor(q: 'good' | 'acceptable' | 'mishit'): string {
  if (q === 'good') return C.conf;
  if (q === 'acceptable') return C.caution;
  return C.flag;
}

export function qualityBg(q: 'good' | 'acceptable' | 'mishit'): string {
  if (q === 'good') return C.confBg;
  if (q === 'acceptable') return C.cautionBg;
  return C.flagBg;
}

export function fmtSigned(v: number): string {
  return (v > 0 ? '+' : '') + v.toFixed(1) + '°';
}
