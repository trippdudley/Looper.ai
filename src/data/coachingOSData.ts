// ─── Types ──────────────────────────────────────────────────────

export type TabId = 'overview' | 'video-analysis' | 'diagnosis' | 'interventions' | 'player-plan';
export type L1Mode = 'session' | 'players' | 'history' | 'drill-library';
export type ClubAbbrev = '9i' | 'PW' | '7i';
export type ShotQuality = 'good' | 'moderate' | 'poor' | 'outlier';
export type ShotPhase = 'warmup' | 'transition' | 'pre-cue' | 'post-cue';

export interface StrikeLocation {
  x: number; // mm from center, positive = toe
  y: number; // mm from center, positive = high
}

export interface ShotData {
  id: number;
  club: ClubAbbrev;
  carry: number;
  ballSpeed: number;
  spinRate: number;
  launchAngle: number;
  attackAngle: number;
  clubPath: number;
  faceAngle: number;
  strikeLocation: StrikeLocation;
  quality: ShotQuality;
  flagged: boolean;
  phase: ShotPhase;
  cueIntroduced?: string;
}

export interface AIInsight {
  shotId: number;
  observation: string;
  confidence: number;
}

export interface Recommendation {
  shotId: number;
  text: string;
  infoGain: string;
}

export interface DiagnosisFactor {
  id: string;
  stage: string;
  title: string;
  detail: string;
  confidence: number;
  metrics: Array<{ label: string; value: string }>;
}

export interface InterventionCard {
  id: string;
  name: string;
  type: 'External' | 'Internal' | 'Constraint';
  difficulty: number; // 1-5
  expectedEffect: string;
  description: string;
}

export interface SessionContext {
  playerName: string;
  handicap: number;
  club: string;
  clubModel: string;
  sessionNumber: number;
  totalSessions: number;
  currentSwing: number;
  totalSwings: number;
  goal: string;
  coachName: string;
  coachInitials: string;
}

// ─── Color Constants (UX System) ────────────────────────────────

export const C = {
  bg:         '#F6F7F9',
  surface:    '#FFFFFF',
  surfaceAlt: '#F0F2F5',
  border:     '#DFE2E7',
  borderSub:  '#ECEEF2',

  accent:       '#0D7C66',
  accentHov:    '#0A6352',
  accentBg:     '#E6F5F1',
  accentBright: '#0FA87A',

  ink:   '#1A1F2B',
  body:  '#4B5563',
  muted: '#9CA3AF',
  dim:   '#C5CAD1',

  conf:      '#0FA87A',
  confBg:    '#E6F5F1',
  caution:   '#D4980B',
  cautionBg: '#FDF6E3',
  flag:      '#C93B3B',
  flagBg:    '#FDE8E8',
} as const;

// ─── Font Constants ─────────────────────────────────────────────

export const F = {
  brand: "'Cabinet Grotesk', Inter, system-ui, sans-serif",
  data:  "'Space Mono', 'JetBrains Mono', monospace",
} as const;

// ─── Formatting Utilities ───────────────────────────────────────

export function fmt(v: number, type: string): string {
  switch (type) {
    case 'yds': return v.toFixed(0) + ' yds';
    case 'mph': return v.toFixed(1) + ' mph';
    case 'rpm': return Math.round(v).toLocaleString() + ' rpm';
    case 'deg': return v.toFixed(1) + '°';
    case 'pct': return v.toFixed(1) + '%';
    default:    return String(v);
  }
}

export function fmtDelta(v: number, type: string): { text: string; color: string } {
  const prefix = v > 0 ? '▲ +' : v < 0 ? '▼ ' : '';
  const color = v > 0 ? C.conf : v < 0 ? C.flag : C.muted;
  return { text: prefix + fmt(Math.abs(v), type), color };
}

export function confidenceLevel(pct: number): { label: string; color: string; bg: string } {
  if (pct >= 80) return { label: 'High', color: C.conf, bg: C.confBg };
  if (pct >= 50) return { label: 'Medium', color: C.caution, bg: C.cautionBg };
  return { label: 'Low', color: C.flag, bg: C.flagBg };
}

// ─── Session Context ────────────────────────────────────────────

export const sessionContext: SessionContext = {
  playerName: 'Jake Hernandez',
  handicap: 8.2,
  club: '7-iron',
  clubModel: 'Mizuno Pro 245',
  sessionNumber: 3,
  totalSessions: 8,
  currentSwing: 14,
  totalSwings: 20,
  goal: 'Strike consistency',
  coachName: 'Chris Daniels',
  coachInitials: 'CD',
};

// ─── Mock Shot Data (14 shots) ──────────────────────────────────

export const shots: ShotData[] = [
  // Warm-up: 9-iron (shots 1-3)
  {
    id: 1, club: '9i', carry: 132, ballSpeed: 112.4, spinRate: 8200,
    launchAngle: 22.1, attackAngle: -3.8, clubPath: 1.2, faceAngle: -0.6,
    strikeLocation: { x: -3, y: 2 }, quality: 'moderate', flagged: false, phase: 'warmup',
  },
  {
    id: 2, club: '9i', carry: 128, ballSpeed: 110.8, spinRate: 8450,
    launchAngle: 23.4, attackAngle: -4.1, clubPath: 0.4, faceAngle: -1.2,
    strikeLocation: { x: -5, y: -1 }, quality: 'poor', flagged: false, phase: 'warmup',
  },
  {
    id: 3, club: '9i', carry: 135, ballSpeed: 113.6, spinRate: 7980,
    launchAngle: 21.6, attackAngle: -3.4, clubPath: 1.8, faceAngle: 0.2,
    strikeLocation: { x: 2, y: 1 }, quality: 'good', flagged: false, phase: 'warmup',
  },

  // Transition: PW (shots 4-7)
  {
    id: 4, club: 'PW', carry: 124, ballSpeed: 107.2, spinRate: 9100,
    launchAngle: 25.2, attackAngle: -4.6, clubPath: -0.2, faceAngle: -1.8,
    strikeLocation: { x: -6, y: -2 }, quality: 'poor', flagged: false, phase: 'transition',
  },
  {
    id: 5, club: 'PW', carry: 129, ballSpeed: 109.4, spinRate: 8800,
    launchAngle: 24.1, attackAngle: -3.8, clubPath: 0.8, faceAngle: -0.4,
    strikeLocation: { x: -2, y: 1 }, quality: 'moderate', flagged: false, phase: 'transition',
  },
  {
    id: 6, club: 'PW', carry: 131, ballSpeed: 110.6, spinRate: 8600,
    launchAngle: 23.8, attackAngle: -3.2, clubPath: 1.4, faceAngle: 0.4,
    strikeLocation: { x: 1, y: 0 }, quality: 'good', flagged: false, phase: 'transition',
  },
  {
    id: 7, club: 'PW', carry: 130, ballSpeed: 110.1, spinRate: 8750,
    launchAngle: 24.0, attackAngle: -3.6, clubPath: 0.6, faceAngle: -0.8,
    strikeLocation: { x: -3, y: -1 }, quality: 'moderate', flagged: false, phase: 'transition',
  },

  // Pre-cue baseline: 7-iron (shots 8-10)
  {
    id: 8, club: '7i', carry: 156, ballSpeed: 126.8, spinRate: 6900,
    launchAngle: 18.4, attackAngle: -5.1, clubPath: 0.2, faceAngle: -2.8,
    strikeLocation: { x: -8, y: -3 }, quality: 'poor', flagged: false, phase: 'pre-cue',
  },
  {
    id: 9, club: '7i', carry: 160, ballSpeed: 128.4, spinRate: 6650,
    launchAngle: 17.8, attackAngle: -4.6, clubPath: 1.0, faceAngle: -1.4,
    strikeLocation: { x: 6, y: 2 }, quality: 'moderate', flagged: false, phase: 'pre-cue',
  },
  {
    id: 10, club: '7i', carry: 154, ballSpeed: 125.6, spinRate: 7100,
    launchAngle: 19.2, attackAngle: -5.4, clubPath: -0.4, faceAngle: -3.2,
    strikeLocation: { x: -7, y: -4 }, quality: 'poor', flagged: false, phase: 'pre-cue',
    cueIntroduced: 'Press the ground before the ball',
  },

  // Post-cue: 7-iron (shots 11-14) — shot 11 is flagged outlier
  {
    id: 11, club: '7i', carry: 142, ballSpeed: 120.2, spinRate: 7800,
    launchAngle: 21.6, attackAngle: -6.2, clubPath: -1.8, faceAngle: -4.6,
    strikeLocation: { x: -12, y: -6 }, quality: 'outlier', flagged: true, phase: 'post-cue',
  },
  {
    id: 12, club: '7i', carry: 164, ballSpeed: 130.1, spinRate: 6300,
    launchAngle: 17.2, attackAngle: -3.2, clubPath: 1.6, faceAngle: 0.2,
    strikeLocation: { x: 2, y: 1 }, quality: 'good', flagged: false, phase: 'post-cue',
  },
  {
    id: 13, club: '7i', carry: 167, ballSpeed: 131.8, spinRate: 6100,
    launchAngle: 16.8, attackAngle: -2.4, clubPath: 2.0, faceAngle: 0.8,
    strikeLocation: { x: 1, y: 0 }, quality: 'good', flagged: false, phase: 'post-cue',
  },
  {
    id: 14, club: '7i', carry: 169, ballSpeed: 132.4, spinRate: 5980,
    launchAngle: 16.4, attackAngle: -2.0, clubPath: 2.2, faceAngle: 1.0,
    strikeLocation: { x: 0, y: 1 }, quality: 'good', flagged: false, phase: 'post-cue',
  },
];

// ─── Computed Baselines (pre-cue 7-iron avg: shots 8-10) ────────

export const baselineAvg = {
  carry: 156.7,
  ballSpeed: 126.9,
  spinRate: 6883,
  attackAngle: -5.03,
  clubPath: 0.27,
  faceAngle: -2.47,
};

// ─── AI Insights (per-shot) ─────────────────────────────────────

export const aiInsights: AIInsight[] = [
  {
    shotId: 8,
    observation: 'Steep attack angle (-5.1°) with heel-low strike. The descent angle is driving thin contact and elevated spin. Club is arriving too vertically for center-face impact.',
    confidence: 84,
  },
  {
    shotId: 10,
    observation: 'Strike pattern shows consistent heel bias (-7mm from center). Combined with -5.4° attack angle, this suggests early extension is pulling the low point behind the ball.',
    confidence: 81,
  },
  {
    shotId: 11,
    observation: 'Outlier swing — significant regression across all metrics. Attack angle steepened to -6.2° with -12mm heel strike. Likely overcorrection: player may have confused "press the ground" with "hit down harder."',
    confidence: 72,
  },
  {
    shotId: 12,
    observation: 'Strong recovery. Attack angle shallowed to -3.2° with near-center strike (+2mm toe, +1mm high). The cue appears to be recalibrating — player found the ground-pressure feel without steepening.',
    confidence: 86,
  },
  {
    shotId: 13,
    observation: 'Continued improvement: attack angle -2.4° is approaching the 8-handicap benchmark (-2.0°). Strike centered within 1mm. Spin rate dropped 800 rpm from baseline — pure compression gains.',
    confidence: 89,
  },
  {
    shotId: 14,
    observation: 'Best swing of the session. Attack angle -2.0° with center-face contact. Carry +12.3 yds vs baseline average. The external cue has produced measurable, repeatable improvement across 3 consecutive swings.',
    confidence: 92,
  },
];

export function getInsightForShot(shotId: number): AIInsight | undefined {
  // Return exact match or nearest preceding insight
  const exact = aiInsights.find((i) => i.shotId === shotId);
  if (exact) return exact;
  return aiInsights
    .filter((i) => i.shotId <= shotId)
    .sort((a, b) => b.shotId - a.shotId)[0];
}

// ─── Recommendations (per-shot) ─────────────────────────────────

export const recommendations: Recommendation[] = [
  {
    shotId: 8,
    text: 'Introduce an external focus cue targeting ground contact point. "Press the ground 2 inches before the ball" shifts attention from club mechanics to task outcome, typically reducing attack angle steepness within 3-5 swings.',
    infoGain: 'High information gain',
  },
  {
    shotId: 11,
    text: 'Reframe the cue — player may be interpreting "press the ground" as "hit down harder." Shift language to "feel the sole brush forward through the grass" to encourage shallow contact rather than steep descent.',
    infoGain: 'High information gain',
  },
  {
    shotId: 14,
    text: 'Current cue is producing consistent improvement. Recommend 5 more repetitions to confirm retention, then transition to a constraint drill (tee-peg gate) to build the pattern without conscious cue reliance.',
    infoGain: 'Moderate information gain',
  },
];

export function getRecommendationForShot(shotId: number): Recommendation | undefined {
  const exact = recommendations.find((r) => r.shotId === shotId);
  if (exact) return exact;
  return recommendations
    .filter((r) => r.shotId <= shotId)
    .sort((a, b) => b.shotId - a.shotId)[0];
}

// ─── Diagnosis Factors ──────────────────────────────────────────

export const diagnosisFactors: DiagnosisFactor[] = [
  {
    id: 'strike-variability',
    stage: 'Impact',
    title: 'Strike variability (heel-toe) driving 68% of dispersion',
    detail: 'Heel-toe spread of 14mm across pre-cue 7-iron shots. This variability accounts for the majority of distance inconsistency. Post-cue swings have narrowed to 3mm spread.',
    confidence: 81,
    metrics: [
      { label: 'Heel-toe spread (pre-cue)', value: '14 mm' },
      { label: 'Heel-toe spread (post-cue)', value: '3 mm' },
      { label: 'Dispersion contribution', value: '68%' },
    ],
  },
  {
    id: 'face-to-path',
    stage: 'Transition',
    title: 'Face-to-path volatility increasing shot shape variance',
    detail: 'Face-to-path variance of ±3.4° in pre-cue baseline (8-handicap benchmark: ±1.8°). The inconsistent face control is amplifying the strike location issue — when the face is closed with heel contact, the result is a low pull.',
    confidence: 74,
    metrics: [
      { label: 'Face-to-path variance (pre-cue)', value: '±3.4°' },
      { label: 'Face-to-path variance (post-cue)', value: '±1.2°' },
      { label: '8-hcp benchmark', value: '±1.8°' },
    ],
  },
  {
    id: 'timing',
    stage: 'Transition',
    title: 'Timing inconsistency under pressure (fatigue-correlated)',
    detail: 'Attack angle standard deviation increases 0.8° between swings 1-7 and swings 8-14, suggesting a fatigue or focus component. The steepest swings (10, 11) came after the cue introduction, consistent with a cognitive load effect.',
    confidence: 58,
    metrics: [
      { label: 'Attack angle SD (early)', value: '0.4°' },
      { label: 'Attack angle SD (late)', value: '1.2°' },
      { label: 'Correlation with swing #', value: 'r = 0.62' },
    ],
  },
];

// ─── Intervention Cards ─────────────────────────────────────────

export const interventions: InterventionCard[] = [
  {
    id: 'ground-press',
    name: 'Ground Pressure Cue',
    type: 'External',
    difficulty: 2,
    expectedEffect: 'Shallows attack angle 1-3° within 3-5 swings. Reduces heel-toe spread by redirecting attention to ground contact.',
    description: '"Press the ground 2 inches before the ball." Focus on feeling sole-turf interaction, not club movement. Expect divots to start at the ball and move forward.',
  },
  {
    id: 'tee-gate',
    name: 'Tee-Peg Gate Drill',
    type: 'Constraint',
    difficulty: 3,
    expectedEffect: 'Forces center-face contact by creating physical boundaries. Builds motor pattern without conscious cue reliance.',
    description: 'Place two tees 3 inches apart, centered behind the ball. Hit shots without contacting either tee. Narrows the low-point window and trains consistent strike location.',
  },
  {
    id: 'tempo-count',
    name: 'Tempo Count (3:1 Ratio)',
    type: 'Internal',
    difficulty: 1,
    expectedEffect: 'Stabilizes transition timing. Reduces the attack angle variance seen under cognitive load.',
    description: 'Count "one-two-three" on the backswing, "four" on the downswing. The 3:1 ratio creates a repeatable timing structure that prevents rushing from the top.',
  },
];

// ─── L3 Tabs config ─────────────────────────────────────────────

export const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'video-analysis', label: 'Video Analysis' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'player-plan', label: 'Player Plan' },
];

// ─── L1 Mode config ─────────────────────────────────────────────

export const l1Modes: Array<{ id: L1Mode; label: string }> = [
  { id: 'session', label: 'Session' },
  { id: 'players', label: 'Players' },
  { id: 'history', label: 'History' },
  { id: 'drill-library', label: 'Drill Library' },
];
