export * from './colors';

export const SESSION_TYPES = [
  'full-swing',
  'short-game',
  'playing-lesson',
  'assessment',
  'putting',
  'mental',
] as const;

export const SESSION_TYPE_LABELS: Record<string, string> = {
  'full-swing': 'Full Swing',
  'short-game': 'Short Game',
  'playing-lesson': 'Playing Lesson',
  'assessment': 'Assessment',
  'putting': 'Putting',
  'mental': 'Mental Game',
};

export const DRILL_CATEGORY_LABELS: Record<string, string> = {
  external: 'External',
  internal: 'Internal',
  constraint: 'Constraint',
  physical: 'Physical',
};
