/** Format a handicap index for display: "+2.1", "12.4", "N/A" */
export function formatHandicap(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  if (value < 0) return `+${Math.abs(value).toFixed(1)}`;
  return value.toFixed(1);
}

/** Format strokes gained with sign: "+0.4", "-1.2" */
export function formatSG(value: number | null | undefined): string {
  if (value == null) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
}

/** Classify SG severity for color coding */
export function sgSeverity(
  value: number | null | undefined
): 'positive' | 'neutral' | 'caution' | 'critical' {
  if (value == null) return 'neutral';
  if (value >= 0.5) return 'positive';
  if (value >= -0.5) return 'neutral';
  if (value >= -1.5) return 'caution';
  return 'critical';
}
