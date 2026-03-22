// ─── Looper Sideline Demo Data ──────────────────────────────────
// All mock data for the 7-step coached session walkthrough

// ─── Color Tokens ───────────────────────────────────────────────
export const C = {
  bg: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F1F4',
  border: '#DDE0E6',
  borderSub: '#EAEDF2',
  accent: '#0D7C66',
  accentHov: '#0A6352',
  accentBg: '#E8F5F0',
  ink: '#1A1F2B',
  body: '#4B5563',
  muted: '#8B95A3',
  dim: '#C8CDD5',
  conf: '#0D9668',
  confBg: '#E6F5EE',
  caution: '#C48A15',
  cautionBg: '#FDF3E1',
  flag: '#C93B3B',
  flagBg: '#FDE8E8',
} as const;

export const TM = {
  bg: '#1A1A1A',
  surface: '#252525',
  orange: '#FF8C1A',
  text: '#FFFFFF',
  textDim: '#888888',
  border: '#333333',
} as const;

export const F = {
  brand: "'Cabinet Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
  data: "'Space Mono', 'SF Mono', 'Fira Code', monospace",
} as const;

// ─── Types ──────────────────────────────────────────────────────
export type BreathPhase = 'brief' | 'quiet' | 'quiet-forming' | 'insight' | 'delta' | 'wrap';

export interface StrikeLocation {
  x: number; // mm from center, + = toe
  y: number; // mm from center, + = high
  label: string;
}

export interface ShotData {
  id: number;
  club: string;
  clubSpeed: number;
  ballSpeed: number;
  smashFactor: number;
  carry: number;
  total: number;
  launchAngle: number;
  spinRate: number;
  attackAngle: number;
  dynamicLoft: number;
  faceToPath: number;
  swingPlane: number;
  swingDirection: number;
  lowPoint: number;
  landingAngle: number;
  height: number;
  hangTime: number;
  curve: number;
  path: number;
  strike: StrikeLocation;
  trajectoryScore: number;
  precisionScore: number;
}

export interface ChatMessage {
  role: 'coach' | 'ai';
  text: string;
}

export interface StepData {
  phase: BreathPhase;
  shotId: number | null;       // which shot to show (null = no new shot)
  label: string;               // step label for bottom bar
  narrative: string;           // narrative text for bottom bar
  chat: ChatMessage[];         // conversation for this step
  suggestions: string[];       // chip suggestions when no chat
}

// ─── Player Context ─────────────────────────────────────────────
export const player = {
  name: 'Moe Norman',
  handicap: '+6',
  handicapDelta: '+1.2',
  sessionNumber: 4,
  totalSessions: 8,
  coach: 'M. Thompson',
  lastSession: {
    date: 'Mar 12',
    focus: 'Spin optimization with dynamic loft control',
    result: 'Spin variance narrowed 420 to 310 rpm',
    drillAssigned: 'Ball-position ladder 3x/week',
  },
  practice: {
    completed: 5,
    assigned: 6,
    adherence: 83,
    daysSinceLast: 5,
    roundsPlayed: 3,
  },
  learningProfile: 'Elite ball-striker. Responds to constraint drills and target-side focus. Prefers feel-based cueing for trajectory adjustments. Dislikes mechanical overload.',
  programTrend: '+4.8 at program start, now +6.0. Carry window tightening across all irons.',
};

// ─── Shot Data ──────────────────────────────────────────────────
// Elite +6 player — all center strikes, tight dispersion.
// Pre-intervention (1-12): spin runs slightly high (8300-8600) due to dynamic loft variance.
// Post-intervention (13-17): dynamic loft stabilizes, spin tightens to 8100-8300.
export const shots: ShotData[] = [
  {
    id: 1, club: 'PW', clubSpeed: 95.2, ballSpeed: 109.5, smashFactor: 1.15,
    carry: 148, total: 156, launchAngle: 24.2, spinRate: 8480,
    attackAngle: -5.1, dynamicLoft: 29.3, faceToPath: -0.3, swingPlane: 63.2,
    swingDirection: -1.8, lowPoint: 4.2, landingAngle: 49.1, height: 92, hangTime: 5.2, curve: -0.8, path: 0.4,
    strike: { x: 1, y: 0, label: 'center' },
    trajectoryScore: 86, precisionScore: 84,
  },
  {
    id: 2, club: 'PW', clubSpeed: 95.4, ballSpeed: 109.8, smashFactor: 1.15,
    carry: 149, total: 157, launchAngle: 24.5, spinRate: 8560,
    attackAngle: -5.3, dynamicLoft: 29.8, faceToPath: -0.2, swingPlane: 63.4,
    swingDirection: -1.6, lowPoint: 4.4, landingAngle: 49.6, height: 93, hangTime: 5.3, curve: -0.6, path: 0.5,
    strike: { x: 0, y: 1, label: 'center' },
    trajectoryScore: 85, precisionScore: 83,
  },
  {
    id: 3, club: 'PW', clubSpeed: 95.0, ballSpeed: 109.2, smashFactor: 1.15,
    carry: 147, total: 155, launchAngle: 24.0, spinRate: 8340,
    attackAngle: -4.9, dynamicLoft: 28.9, faceToPath: -0.4, swingPlane: 63.0,
    swingDirection: -1.9, lowPoint: 4.1, landingAngle: 48.7, height: 91, hangTime: 5.1, curve: -1.0, path: 0.3,
    strike: { x: -1, y: 0, label: 'center' },
    trajectoryScore: 87, precisionScore: 85,
  },
  {
    id: 4, club: 'PW', clubSpeed: 95.6, ballSpeed: 110.0, smashFactor: 1.15,
    carry: 149, total: 157, launchAngle: 24.6, spinRate: 8590,
    attackAngle: -5.4, dynamicLoft: 30.0, faceToPath: -0.1, swingPlane: 63.5,
    swingDirection: -1.5, lowPoint: 4.5, landingAngle: 49.8, height: 94, hangTime: 5.3, curve: -0.4, path: 0.6,
    strike: { x: 0, y: -1, label: 'center' },
    trajectoryScore: 85, precisionScore: 82,
  },
  {
    id: 5, club: 'PW', clubSpeed: 95.1, ballSpeed: 109.4, smashFactor: 1.15,
    carry: 148, total: 156, launchAngle: 24.1, spinRate: 8380,
    attackAngle: -5.0, dynamicLoft: 29.1, faceToPath: -0.3, swingPlane: 63.1,
    swingDirection: -1.8, lowPoint: 4.2, landingAngle: 48.9, height: 91, hangTime: 5.2, curve: -0.9, path: 0.4,
    strike: { x: 1, y: 1, label: 'center' },
    trajectoryScore: 87, precisionScore: 85,
  },
  {
    id: 6, club: 'PW', clubSpeed: 95.5, ballSpeed: 109.9, smashFactor: 1.15,
    carry: 150, total: 158, launchAngle: 24.7, spinRate: 8610,
    attackAngle: -5.5, dynamicLoft: 30.2, faceToPath: 0.0, swingPlane: 63.6,
    swingDirection: -1.4, lowPoint: 4.6, landingAngle: 50.0, height: 94, hangTime: 5.4, curve: -0.3, path: 0.7,
    strike: { x: -1, y: 1, label: 'center' },
    trajectoryScore: 84, precisionScore: 82,
  },
  {
    id: 7, club: 'PW', clubSpeed: 95.3, ballSpeed: 109.6, smashFactor: 1.15,
    carry: 148, total: 156, launchAngle: 24.3, spinRate: 8440,
    attackAngle: -5.1, dynamicLoft: 29.4, faceToPath: -0.2, swingPlane: 63.3,
    swingDirection: -1.7, lowPoint: 4.3, landingAngle: 49.2, height: 92, hangTime: 5.2, curve: -0.7, path: 0.5,
    strike: { x: 0, y: 0, label: 'center' },
    trajectoryScore: 86, precisionScore: 84,
  },
  {
    id: 8, club: 'PW', clubSpeed: 95.1, ballSpeed: 109.3, smashFactor: 1.15,
    carry: 147, total: 155, launchAngle: 24.0, spinRate: 8320,
    attackAngle: -4.8, dynamicLoft: 28.8, faceToPath: -0.4, swingPlane: 62.9,
    swingDirection: -1.9, lowPoint: 4.0, landingAngle: 48.6, height: 91, hangTime: 5.1, curve: -1.1, path: 0.3,
    strike: { x: 1, y: -1, label: 'center' },
    trajectoryScore: 88, precisionScore: 86,
  },
  {
    id: 9, club: 'PW', clubSpeed: 95.4, ballSpeed: 109.7, smashFactor: 1.15,
    carry: 149, total: 157, launchAngle: 24.4, spinRate: 8520,
    attackAngle: -5.2, dynamicLoft: 29.6, faceToPath: -0.1, swingPlane: 63.3,
    swingDirection: -1.6, lowPoint: 4.3, landingAngle: 49.4, height: 93, hangTime: 5.3, curve: -0.5, path: 0.6,
    strike: { x: 0, y: 1, label: 'center' },
    trajectoryScore: 85, precisionScore: 83,
  },
  {
    id: 10, club: 'PW', clubSpeed: 95.0, ballSpeed: 109.2, smashFactor: 1.15,
    carry: 147, total: 155, launchAngle: 24.1, spinRate: 8360,
    attackAngle: -4.9, dynamicLoft: 29.0, faceToPath: -0.3, swingPlane: 63.0,
    swingDirection: -1.8, lowPoint: 4.1, landingAngle: 48.8, height: 91, hangTime: 5.1, curve: -0.9, path: 0.4,
    strike: { x: -1, y: 0, label: 'center' },
    trajectoryScore: 87, precisionScore: 85,
  },
  {
    id: 11, club: 'PW', clubSpeed: 95.5, ballSpeed: 110.0, smashFactor: 1.15,
    carry: 150, total: 158, launchAngle: 24.8, spinRate: 8600,
    attackAngle: -5.5, dynamicLoft: 30.3, faceToPath: 0.1, swingPlane: 63.6,
    swingDirection: -1.4, lowPoint: 4.6, landingAngle: 50.1, height: 95, hangTime: 5.4, curve: -0.2, path: 0.7,
    strike: { x: 0, y: 0, label: 'center' },
    trajectoryScore: 84, precisionScore: 82,
  },
  {
    id: 12, club: 'PW', clubSpeed: 95.2, ballSpeed: 109.5, smashFactor: 1.15,
    carry: 148, total: 156, launchAngle: 24.3, spinRate: 8460,
    attackAngle: -5.1, dynamicLoft: 29.4, faceToPath: -0.2, swingPlane: 63.2,
    swingDirection: -1.7, lowPoint: 4.3, landingAngle: 49.2, height: 92, hangTime: 5.2, curve: -0.7, path: 0.5,
    strike: { x: 1, y: 0, label: 'center' },
    trajectoryScore: 86, precisionScore: 84,
  },
  // Post-intervention shots (13-17): ball position adjusted forward 0.5", dynamic loft stabilizes
  {
    id: 13, club: 'PW', clubSpeed: 95.3, ballSpeed: 109.8, smashFactor: 1.15,
    carry: 150, total: 158, launchAngle: 23.8, spinRate: 8210,
    attackAngle: -4.8, dynamicLoft: 28.6, faceToPath: -0.2, swingPlane: 63.0,
    swingDirection: -1.8, lowPoint: 4.1, landingAngle: 48.4, height: 90, hangTime: 5.1, curve: -0.6, path: 0.5,
    strike: { x: 0, y: 0, label: 'center' },
    trajectoryScore: 89, precisionScore: 88,
  },
  {
    id: 14, club: 'PW', clubSpeed: 95.1, ballSpeed: 109.6, smashFactor: 1.15,
    carry: 150, total: 157, launchAngle: 23.7, spinRate: 8180,
    attackAngle: -4.7, dynamicLoft: 28.4, faceToPath: -0.3, swingPlane: 62.9,
    swingDirection: -1.9, lowPoint: 4.0, landingAngle: 48.2, height: 90, hangTime: 5.0, curve: -0.8, path: 0.4,
    strike: { x: -1, y: 1, label: 'center' },
    trajectoryScore: 90, precisionScore: 88,
  },
  {
    id: 15, club: 'PW', clubSpeed: 95.4, ballSpeed: 110.0, smashFactor: 1.15,
    carry: 151, total: 159, launchAngle: 23.9, spinRate: 8260,
    attackAngle: -4.9, dynamicLoft: 28.8, faceToPath: -0.1, swingPlane: 63.1,
    swingDirection: -1.7, lowPoint: 4.2, landingAngle: 48.5, height: 91, hangTime: 5.1, curve: -0.5, path: 0.5,
    strike: { x: 0, y: -1, label: 'center' },
    trajectoryScore: 89, precisionScore: 87,
  },
  {
    id: 16, club: 'PW', clubSpeed: 95.2, ballSpeed: 109.7, smashFactor: 1.15,
    carry: 150, total: 158, launchAngle: 23.8, spinRate: 8230,
    attackAngle: -4.8, dynamicLoft: 28.6, faceToPath: -0.2, swingPlane: 63.0,
    swingDirection: -1.8, lowPoint: 4.1, landingAngle: 48.3, height: 90, hangTime: 5.1, curve: -0.7, path: 0.4,
    strike: { x: 1, y: 0, label: 'center' },
    trajectoryScore: 90, precisionScore: 89,
  },
  {
    id: 17, club: 'PW', clubSpeed: 95.3, ballSpeed: 109.9, smashFactor: 1.15,
    carry: 151, total: 158, launchAngle: 23.8, spinRate: 8200,
    attackAngle: -4.8, dynamicLoft: 28.5, faceToPath: -0.2, swingPlane: 63.0,
    swingDirection: -1.8, lowPoint: 4.1, landingAngle: 48.4, height: 90, hangTime: 5.1, curve: -0.6, path: 0.5,
    strike: { x: 0, y: 0, label: 'center' },
    trajectoryScore: 91, precisionScore: 90,
  },
];

// ─── Step Definitions ───────────────────────────────────────────
export const steps: StepData[] = [
  // Step 0: Brief
  {
    phase: 'brief',
    shotId: null,
    label: 'Pre-session brief',
    narrative: 'Before the player arrives, Looper surfaces everything the coach needs to remember. Last session context, practice adherence, program trend, and a recommended focus for today. The coach reads this in 60 seconds, not 10 minutes of chart-scrolling.',
    chat: [],
    suggestions: ['What should I focus on today?', 'How has his practice been?'],
  },
  // Step 1: Quiet — Shot 1
  {
    phase: 'quiet',
    shotId: 1,
    label: 'Shot 1 — session begins',
    narrative: 'The first ball is struck. Looper goes quiet. The coach\'s attention belongs to the player, not the screen. The sidebar shows only a shot count and a status pulse. TrackMan gives the data; Looper stays out of the way.',
    chat: [],
    suggestions: ['How does his delivery look?', 'How does this compare to last session?'],
  },
  // Step 2: Quiet — Shot 4, coach asks about spin
  {
    phase: 'quiet',
    shotId: 4,
    label: 'Shot 4 — coach checks in',
    narrative: 'Four shots in. The coach glances at the sidebar and asks a question. Looper responds with early-signal analysis grounded in this player\'s data, not generic advice. Notice the sidebar stays sparse — information density inversely tracks coaching intensity.',
    chat: [
      { role: 'coach', text: 'How does his spin look today?' },
      { role: 'ai', text: 'Early signal from 4 swings: spin is averaging 8,468 rpm with a range of 8,340-8,590. That\'s consistent with what we saw in session 3 — slightly above his optimal window of 8,100-8,300. The variance (250 rpm) is coming from dynamic loft fluctuation between 28.9 and 30.0 deg. Strike is pure center on all 4 — this is a delivery variable, not a contact issue.' },
    ],
    suggestions: [],
  },
  // Step 3: Quiet-forming — Shot 8, coach asks cross-session
  {
    phase: 'quiet-forming',
    shotId: 8,
    label: 'Shot 8 — pattern confirmed',
    narrative: 'Eight shots in. Looper confirms the pattern: spin is running consistently above optimal due to dynamic loft variance. The coach asks a cross-session comparison, and Looper pulls from the full player record — not just today\'s data.',
    chat: [
      { role: 'coach', text: 'How does this compare to session 2 spin numbers?' },
      { role: 'ai', text: 'Session 2 (Mar 5): spin averaged 8,510 rpm through 8 shots with a 420 rpm range. Today through 8 shots: 8,446 average with a 290 rpm range. The trend is right — he\'s tightening. But the dynamic loft variance is the same pattern: shots where attack angle steepens past -5.2 deg push spin above 8,500. His best spin numbers (sub-8,300) come when attack angle stays between -4.8 and -5.0. Ball position may be creeping back during the set — that\'s been the driver in previous sessions.' },
    ],
    suggestions: [],
  },
  // Step 4: Insight — Shot 12, diagnosis
  {
    phase: 'insight',
    shotId: 12,
    label: 'Shot 12 — diagnosis ready',
    narrative: 'Twelve shots give Looper enough data to surface a diagnosis with confidence. ONE refinement opportunity, ONE suggested adjustment. Not a list of problems — a single, actionable recommendation the coach can accept, modify, or ignore.',
    chat: [
      { role: 'coach', text: 'Why ball position instead of a feel cue for loft?' },
      { role: 'ai', text: 'Moe\'s data shows a clean correlation: when attack angle stays above -5.1 deg, spin drops into the 8,200-8,350 window. The steeper deliveries (below -5.2) are producing the 8,500+ spin shots. In session 3, a feel cue for "shallow" produced 0.3 deg change but also shifted path 0.8 deg — too many variables. The ball-position ladder drill isolates the variable: same swing, different low point, measurable spin result. Moe can feel the difference without having to think about it. His session 2 data showed a natural 0.4 deg attack angle change from a half-inch position shift — that\'s all we need here.' },
    ],
    suggestions: [],
  },
  // Step 5: Delta — Shot 17, before/after
  {
    phase: 'delta',
    shotId: 17,
    label: 'Shot 17 — adjustment verified',
    narrative: 'Five shots post-adjustment. Looper shows a single before/after comparison on the metric that matters: spin variance tightened from 290 to 80 rpm and the carry window narrowed from 4 to 1 yard. Stated honestly — sample size is small.',
    chat: [
      { role: 'coach', text: 'If spin holds, what should we look at next session?' },
      { role: 'ai', text: 'If spin stabilizes in the 8,180-8,260 range through end of session, the next variable is trajectory control under target variability. His current launch (23.8 avg post-adjustment) is producing a 48.4 deg landing angle — ideal for firm greens but could run out on softer surfaces. Session 5 could test a half-club trajectory variation: same PW, two trajectories, controlled by ball position and finish height. But worth confirming the spin pattern holds under pressure first — 5 shots to different targets at different distances to stress-test before moving on.' },
    ],
    suggestions: [],
  },
  // Step 6: Wrap
  {
    phase: 'wrap',
    shotId: null,
    label: 'Session complete',
    narrative: 'Session over. Looper generates a complete session record: outcome KPIs, an honest retention estimate, intervention tags from the session, and a practice plan draft the coach can approve or edit. The session record captures the coaching reasoning, not just the numbers.',
    chat: [
      { role: 'coach', text: 'Anything I should note for next time?' },
      { role: 'ai', text: '1. Dynamic loft stabilized with the forward ball position — spin dropped from 8,446 avg to 8,216 avg. The carry window tightened from 147-150 to 150-151. This is a setup variable, not a swing change, so retention should be high.\n2. Attack angle naturally shallowed 0.3 deg as a secondary effect. Monitor this — if it continues shallowing past -4.6 in future sessions, launch may drop below optimal.\n3. Moe\'s trajectory scores jumped from 86 avg to 90 avg post-adjustment. This is the highest single-session trajectory improvement in his program.\n\nThe spin improvement is real and mechanically simple to retain. Set session 5 expectations: confirm retention, then test trajectory variability under target pressure.' },
    ],
    suggestions: [],
  },
];

// ─── Computed helpers ───────────────────────────────────────────

/** Get all shots visible at a given step */
export function getShotsAtStep(stepIndex: number): ShotData[] {
  const step = steps[stepIndex];
  if (!step || !step.shotId) {
    // For brief/wrap, show shots from previous step context
    if (stepIndex === 0) return [];
    if (stepIndex === 6) return shots.slice(0, 17);
    return [];
  }
  return shots.slice(0, step.shotId);
}

/** Get the latest shot for a step */
export function getLatestShot(stepIndex: number): ShotData | null {
  const step = steps[stepIndex];
  if (!step?.shotId) {
    if (stepIndex === 6) return shots[16]; // wrap shows last shot
    return null;
  }
  return shots[step.shotId - 1];
}

/** Center strike rate for a set of shots */
export function centerRate(shotList: ShotData[]): number {
  if (shotList.length === 0) return 0;
  const center = shotList.filter(s => s.strike.label === 'center').length;
  return Math.round((center / shotList.length) * 100);
}

/** Average carry for a set of shots */
export function avgCarry(shotList: ShotData[]): number {
  if (shotList.length === 0) return 0;
  return shotList.reduce((sum, s) => sum + s.carry, 0) / shotList.length;
}

/** Average spin for a set of shots */
export function avgSpin(shotList: ShotData[]): number {
  if (shotList.length === 0) return 0;
  return Math.round(shotList.reduce((sum, s) => sum + s.spinRate, 0) / shotList.length);
}

/** Spin variance (max - min) for a set of shots */
export function spinVariance(shotList: ShotData[]): number {
  if (shotList.length === 0) return 0;
  const spins = shotList.map(s => s.spinRate);
  return Math.max(...spins) - Math.min(...spins);
}

/** Session wrap data */
export const wrapData = {
  shotsHit: 17,
  club: 'PW',
  preIntervention: { shots: 12, avgSpin: 8446, spinVariance: 290, avgCarry: 148.3, avgDynLoft: 29.4 },
  postIntervention: { shots: 5, avgSpin: 8216, spinVariance: 80, avgCarry: 150.4, avgDynLoft: 28.6 },
  sessionOutcome: 'Dynamic loft variance addressed with ball position adjustment. Spin tightened from 290 to 80 rpm range, carry window narrowed to 1 yard.',
  retentionEstimate: 'Setup change, not a swing change — high retention probability. Expect spin to hold in the 8,150-8,300 range. Carry gain of +2.1 yds is real and durable.',
  interventionTags: ['Ball position (setup)', 'Dynamic loft control', 'Spin optimization'],
  practicePlan: [
    { drill: 'Ball-position ladder', reps: '15 balls', frequency: '3x/week', note: 'Three positions: 1 inch forward, center, 1 inch back. 5 balls each. Track spin result per position. Find the position that produces 8,200 consistently.' },
    { drill: 'Variable target PW', reps: '10 balls', frequency: '2x/week', note: 'Alternate between 3 targets at 145, 150, and 155 yards. No two consecutive shots to the same flag. Confirm spin consistency holds under target pressure.' },
  ],
  nextSessionPreview: 'Confirm spin retention, then test trajectory variability — two heights, same club, controlled by ball position and finish.',
};
