// Sizzle Reel — shared design tokens and utilities

// Light mode (Scenes 2, 3, 4)
export const C = {
  bg:       '#F6F7F9',
  surface:  '#FFFFFF',
  surfaceAlt: '#F0F2F5',
  border:   '#DFE2E7',
  borderSub:'#ECEEF2',
  accent:   '#0D7C66',
  accentHov:'#0A6352',
  accentBg: '#E6F5F1',
  accentBright: '#0FA87A',
  ink:      '#1A1F2B',
  body:     '#4B5563',
  muted:    '#9CA3AF',
  dim:      '#C5CAD1',
  conf:     '#0FA87A',
  confBg:   '#E6F5F1',
  caution:  '#D4980B',
  cautionBg:'#FDF6E3',
  flag:     '#C93B3B',
  flagBg:   '#FDE8E8',
};

// Dark mode (Scenes 1, 5)
export const CD = {
  bg:       '#0C1117',
  surface:  '#151D28',
  border:   '#1E2A36',
  accent:   '#10B981',
  ink:      '#E8ECF1',
  body:     '#8B99A8',
  muted:    '#5E6E7E',
  dim:      '#3A4856',
};

// Font stacks
export const F = {
  brand: "'DM Sans', system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', monospace",
  serif: "'Instrument Serif', Georgia, serif",
};

// Animation helpers
export function vis(elapsed: number, trigger: number): boolean {
  return elapsed >= trigger;
}

export function fadeIn(elapsed: number, trigger: number, duration = 800) {
  if (elapsed < trigger) return { opacity: 0, transform: 'translateY(8px)' };
  const t = Math.min(1, (elapsed - trigger) / duration);
  return {
    opacity: t,
    transform: `translateY(${8 - 8 * t}px)`,
  };
}

export function fadeInOut(elapsed: number, triggerIn: number, triggerOut: number, durIn = 800, durOut = 600) {
  const inO = elapsed < triggerIn ? 0 : Math.min(1, (elapsed - triggerIn) / durIn);
  const outO = elapsed >= triggerOut ? Math.max(0, 1 - (elapsed - triggerOut) / durOut) : 1;
  const t = inO * outO;
  return {
    opacity: t,
    transform: `translateY(${8 - 8 * Math.min(1, inO)}px)`,
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function countUp(elapsed: number, start: number, target: number, duration = 600): number {
  if (elapsed < start) return 0;
  const t = Math.min(1, (elapsed - start) / duration);
  return target * easeOutCubic(t);
}
