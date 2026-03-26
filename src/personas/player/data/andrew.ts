/**
 * Andrew D. — Canonical demo player for the Looper Player Portal.
 * Real data manually extracted from GHIN, Arccos, and Foresight GCQuad.
 * All values are authoritative for the MVP.
 */

// --- GHIN Handicap History ---
export const handicapHistory = [
  { date: '2025-12-11', value: 6.4 },
  { date: '2025-12-14', value: 6.2 },
  { date: '2025-12-18', value: 6.2 },
  { date: '2025-12-22', value: 6.3 },
  { date: '2025-12-23', value: 6.0 },
  { date: '2025-12-24', value: 6.1 },
  { date: '2025-12-28', value: 5.5 },
  { date: '2025-12-29', value: 5.6 },
  { date: '2025-12-30', value: 5.6 },
  { date: '2026-01-07', value: 4.6 },
  { date: '2026-01-09', value: 4.6 },
  { date: '2026-01-14', value: 4.4 },
  { date: '2026-02-07', value: 4.3 },
  { date: '2026-02-11', value: 3.9 },
  { date: '2026-02-15', value: 3.8 },
  { date: '2026-02-17', value: 3.7 },
  { date: '2026-02-20', value: 3.7 },
  { date: '2026-03-04', value: 3.7 },
  { date: '2026-03-07', value: 3.7 },
  { date: '2026-03-12', value: 3.4 },
  { date: '2026-03-14', value: 3.4 },
  { date: '2026-03-23', value: 3.4 },
];

// --- Player Profile ---
export const andrew = {
  name: 'Andrew D.',
  avatar: 'AD',
  handicap: 3.4,
  handicapDelta: -3.0, // from 6.4 → 3.4 over ~4 months
  careerLow: 3.4,
  careerLowDate: '2026-03-23',
  totalRounds: 101,
  totalShots: 7116,
  coach: {
    name: 'Coach Williams',
    academy: 'Evergreen Golf Club',
    lastLessonDate: '2026-03-18',
    lastLessonTopic: 'Low point control — iron strike',
    lessonsLast30: 2,
  },
  practiceSessionsLast30: 6,
  sgPerRound: -3.9,
  sgDelta: -1.8, // vs prior 20 rounds — getting worse
};

// --- Strokes Gained Breakdown ---
export const strokesGained = {
  driving: { sg: 0.0, delta: -0.6, label: 'Off the Tee' },
  approach: { sg: -2.2, delta: -1.1, label: 'Approach' },
  shortGame: { sg: -1.2, delta: -0.6, label: 'Around the Green' },
  putting: { sg: -0.4, delta: 0.6, label: 'Putting' },
};

// --- Driving Detail ---
export const drivingDetail = {
  avgDistance: 268,
  fairwayHit: 0.44,
  scratchFairway: 0.51,
  missedLeft: { pct: 0.25, sg: -0.2 },
  missedRight: { pct: 0.31, sg: -0.5 },
  distanceSG: 0.6,
  accuracySG: -0.1,
  penaltiesSG: -0.6,
};

// --- Approach Detail ---
export const approachDetail = {
  gir: 0.51,
  scratchGir: 0.56,
  avgProximityOnGir: 24, // feet
  scratchProximity: 26,
  byDistance: [
    { range: '50-100 yd', sg: -0.3, shotsPerRound: 3.3 },
    { range: '100-150 yd', sg: -0.8, shotsPerRound: 6.5 },
    { range: '150-200 yd', sg: -0.9, shotsPerRound: 6.6 },
    { range: '200+ yd', sg: -0.2, shotsPerRound: 3.9 },
  ],
  byTerrain: [
    { terrain: 'Tee (Par 3)', sg: -0.6, shots: 4.7 },
    { terrain: 'Fairway', sg: -0.5, shots: 7.7 },
    { terrain: 'Rough', sg: -0.9, shots: 6.8 },
    { terrain: 'Sand', sg: -0.2, shots: 1.1 },
  ],
  girMissPattern: {
    long: { count: 0.6, pct: 0.03 },
    left: { count: 2.4, pct: 0.13 },
    right: { count: 1.6, pct: 0.09 },
    short: { count: 4.3, pct: 0.24 },
  },
};

// --- Short Game Detail ---
export const shortGameDetail = {
  chips0to25: {
    sg: -0.5,
    missedGreens: 0.06,
    scratchMissed: 0.04,
    avgToPin: 5, // yards
    scratchToPin: 4,
    upAndDown: 0.40,
    scratchUpAndDown: 0.57,
  },
  chips25to50: {
    sg: -0.5,
    missedGreens: 0.12,
    scratchMissed: 0.11,
    avgToPin: 7,
    scratchToPin: 7,
    upAndDown: 0.23,
    scratchUpAndDown: 0.35,
  },
  sand0to25: { sg: -0.2 },
  sand25to50: { sg: 0.0 },
};

// --- Putting Detail ---
export const puttingDetail = {
  byDistance: [
    { range: '0-10 ft', sg: 0.6, puttsPerRound: 18.9, note: 'Elite' },
    { range: '10-25 ft', sg: -0.5, puttsPerRound: 9.2 },
    { range: '25-50 ft', sg: -0.4, puttsPerRound: 4.5 },
    { range: '50+ ft', sg: 0.0, puttsPerRound: 0.5 },
  ],
  puttsPerHole: 1.8,
  scratchPuttsPerHole: 1.7,
  puttsPerGir: 1.9,
  onePutts: 4.0,
  twoPutts: 13.0,
  threePutts: 1.1,
  scratchThreePutts: 1.3,
};

// --- Scoring ---
export const scoring = {
  par3Avg: 3.4,
  par4Avg: 4.5,
  par5Avg: 5.2,
  par3SG: -0.2,
  par4SG: -0.2,
  par5SG: -0.3,
  birdiesPerRound: 1.4,
  parsPerRound: 8.9,
  bogeysPerRound: 6.2,
  doublesPerRound: 1.4,
  scratchBirdies: 2.2,
  scratchPars: 10.5,
  scratchBogeys: 4.6,
  scratchDoubles: 0.7,
};

// --- Recent Foresight Session (Mar 23, 2026) ---
export const foresightSession = {
  date: '2026-03-23',
  totalShots: 88,
  duration: '2h 45m',
  device: 'GCQuad',
  sessionType: 'Improve',
  allocation: {
    approachIrons: 0.49,
    driver: 0.37,
    hybrid: 0.14,
    shortGame: 0.0,
    putting: 0.0,
  },
  clubs: [
    { group: 'Wedge/Short Iron', shots: 9, avgCarry: 127, avgOffline: 4.2, bestToPin: 1.6 },
    { group: 'Mid Iron (~155yd)', shots: 20, avgCarry: 172, avgOffline: 9.8, pctOver15ydOffline: 0.35, bestToPin: 3.9 },
    { group: 'Short-Mid Iron (~130yd)', shots: 14, avgCarry: 131, avgOffline: 7.6, bestToPin: 1.6 },
    { group: 'Hybrid', shots: 12, avgCarry: 176, avgOffline: 11.4, bestToPin: 3.6 },
    { group: 'Driver', shots: 33, avgCarry: 271, avgOffline: 20.1, bestToPin: 1.0 },
  ],
};

// --- Practice Brief (SG-Proportional) ---
export const practiceBrief = {
  totalDuration: 120, // minutes
  priority: {
    area: 'Approach shots 125-175 yards',
    reason: "You're losing 1.7 strokes/round on approach shots in the 100-200yd range. This is your single biggest scoring opportunity.",
  },
  coachContext: {
    coachName: 'Coach Williams',
    currentFocus: 'Low point control and iron strike consistency',
    connection: 'Your last lesson focused on moving ball position forward to improve strike. Today, apply that feel to mid-iron targets.',
    tag: 'FROM LESSON',
  },
  blocks: [
    {
      title: 'Approach 150-200yd',
      pct: 0.35,
      minutes: 42,
      sg: -0.9,
      clubs: '6i, 7i',
      focus: 'Random target variation — never the same yardage twice. Alternate fairway and rough lies.',
      shotCount: 30,
      drills: [
        'Random target: vary 150, 160, 170, 180yd targets',
        'Fairway vs rough: alternate lies to simulate conditions',
        'Pressure set: 5 shots, count how many finish within 30ft',
      ],
    },
    {
      title: 'Short Game 25-50yd',
      pct: 0.25,
      minutes: 30,
      sg: -0.5,
      clubs: '56\u00B0, 60\u00B0',
      focus: 'Landing spot accuracy and trajectory variation to build the up-and-down rate from 23% to 35%.',
      shotCount: 30,
      drills: [
        'Landing spot drill: pick spot halfway to pin, land 10 balls on it',
        'Up-and-down challenge: chip and putt, track saves out of 10',
        'Trajectory variation: high soft vs bump-and-run to same target',
      ],
    },
    {
      title: 'Short Game 0-25yd',
      pct: 0.20,
      minutes: 24,
      sg: -0.5,
      clubs: '56\u00B0',
      focus: 'Touch and distance control around the green. Up-and-down rate is 40% vs 57% scratch.',
      shotCount: 25,
      drills: [
        'Circle drill: chips must stop inside 6ft circle (10 shots)',
        'One-club challenge: pitch with only 56\u00B0 to build touch',
        'Greenside bunker: 10 shots, track sand save %',
      ],
    },
    {
      title: 'Putting 10-25ft',
      pct: 0.15,
      minutes: 18,
      sg: -0.5,
      clubs: 'Putter',
      focus: 'Lag putting speed calibration. Your 0-10ft putting is elite — build the pipeline from longer range.',
      shotCount: 30,
      drills: [
        'Lag putting: 10 putts from 20ft, all must stop within 3ft',
        'Gate drill: two tees 1 ball-width apart at 4ft, roll 10 through',
        'Speed calibration: putt to fringe from 15ft, no backstop',
      ],
    },
    {
      title: 'Driver',
      pct: 0.05,
      minutes: 6,
      sg: 0.0,
      clubs: 'Driver',
      focus: 'Maintenance only. Distance is a strength — keep it in rhythm.',
      shotCount: 8,
      drills: ['5-10 balls at 75% effort, fairway target only'],
    },
  ],
  whyThisPlan: {
    sources: [
      { label: 'Strokes Gained', detail: 'Approach (-2.2) and Short Game (-1.2) account for 87% of your total SG gap. Time allocation is proportional to where strokes are lost.' },
      { label: 'Coaching Thread', detail: 'Coach Williams is working on iron strike and low point control (Mar 18 lesson). The approach block reinforces that work with game-like targets.' },
      { label: 'Practice History', detail: 'Your last session was 49% approach irons, 37% driver, 0% short game. This plan corrects the short game deficit while maintaining approach volume.' },
    ],
  },
};

// --- Rounds History ---
export interface RoundRecord {
  id: string;
  course: string;
  date: string;
  score: number;
  par: number;
  sgTotal: number;
  sgDelta: number;
  gir: number;
  fir: number;
  sgDriving: number;
  sgApproach: number;
  sgShortGame: number;
  sgPutting: number;
  insight?: string;
}

export const rounds: RoundRecord[] = [
  {
    id: 'r1',
    course: 'Evergreen Golf Club',
    date: '2026-03-23',
    score: 74,
    par: 72,
    sgTotal: -2.8,
    sgDelta: 1.1,
    gir: 0.61,
    fir: 0.50,
    sgDriving: 0.4,
    sgApproach: -1.6,
    sgShortGame: -0.8,
    sgPutting: -0.8,
    insight: 'Your GIR jumped to 61% — highest in 3 months. This correlates with 2 iron-focused practice sessions since your Mar 18 lesson on low point control.',
  },
  {
    id: 'r2',
    course: 'Pine Valley CC',
    date: '2026-03-16',
    score: 78,
    par: 72,
    sgTotal: -5.2,
    sgDelta: -1.3,
    gir: 0.44,
    fir: 0.36,
    sgDriving: -0.8,
    sgApproach: -2.4,
    sgShortGame: -1.2,
    sgPutting: -0.8,
  },
  {
    id: 'r3',
    course: 'Evergreen Golf Club',
    date: '2026-03-12',
    score: 73,
    par: 72,
    sgTotal: -1.9,
    sgDelta: 2.0,
    gir: 0.56,
    fir: 0.50,
    sgDriving: 0.2,
    sgApproach: -1.0,
    sgShortGame: -0.6,
    sgPutting: -0.5,
  },
  {
    id: 'r4',
    course: 'Chambers Bay',
    date: '2026-03-07',
    score: 76,
    par: 72,
    sgTotal: -4.4,
    sgDelta: -0.5,
    gir: 0.50,
    fir: 0.43,
    sgDriving: 0.6,
    sgApproach: -2.8,
    sgShortGame: -1.4,
    sgPutting: -0.8,
  },
  {
    id: 'r5',
    course: 'Evergreen Golf Club',
    date: '2026-02-28',
    score: 75,
    par: 72,
    sgTotal: -3.9,
    sgDelta: 0.0,
    gir: 0.50,
    fir: 0.43,
    sgDriving: -0.1,
    sgApproach: -2.0,
    sgShortGame: -1.0,
    sgPutting: -0.8,
  },
  {
    id: 'r6',
    course: 'The Olympic Club',
    date: '2026-02-22',
    score: 79,
    par: 72,
    sgTotal: -6.1,
    sgDelta: -2.2,
    gir: 0.39,
    fir: 0.36,
    sgDriving: -0.4,
    sgApproach: -3.2,
    sgShortGame: -1.6,
    sgPutting: -0.9,
  },
  {
    id: 'r7',
    course: 'Evergreen Golf Club',
    date: '2026-02-15',
    score: 74,
    par: 72,
    sgTotal: -2.6,
    sgDelta: 1.3,
    gir: 0.56,
    fir: 0.50,
    sgDriving: 0.3,
    sgApproach: -1.4,
    sgShortGame: -0.8,
    sgPutting: -0.7,
  },
  {
    id: 'r8',
    course: 'Evergreen Golf Club',
    date: '2026-02-08',
    score: 76,
    par: 72,
    sgTotal: -4.2,
    sgDelta: -0.3,
    gir: 0.44,
    fir: 0.43,
    sgDriving: -0.2,
    sgApproach: -2.2,
    sgShortGame: -1.2,
    sgPutting: -0.6,
  },
];

// --- Journey / Timeline Events ---
export interface JourneyEvent {
  id: string;
  date: string;
  type: 'round' | 'practice' | 'lesson';
  title: string;
  insight: string;
  metrics?: { label: string; value: string }[];
}

export const journeyEvents: JourneyEvent[] = [
  {
    id: 'j1',
    date: '2026-03-23',
    type: 'round',
    title: 'Evergreen GC — 74 (+2)',
    insight: 'GIR jumped to 61%. Iron work is translating to scoring.',
    metrics: [{ label: 'SG Total', value: '-2.8' }, { label: 'GIR', value: '61%' }],
  },
  {
    id: 'j2',
    date: '2026-03-23',
    type: 'practice',
    title: 'GCQuad Session — 88 shots',
    insight: 'Heavy approach iron focus (49%). Mid-iron dispersion: 9.8yd avg offline. No short game work.',
    metrics: [{ label: 'Shots', value: '88' }, { label: 'Duration', value: '2h 45m' }],
  },
  {
    id: 'j3',
    date: '2026-03-20',
    type: 'practice',
    title: 'Range Session — Iron block',
    insight: 'Applied lesson drill: forward ball position on 7-iron. Tighter pattern emerging.',
  },
  {
    id: 'j4',
    date: '2026-03-18',
    type: 'lesson',
    title: 'Lesson with Coach Williams',
    insight: 'Focus: low point control. Ball position moved forward 1 ball width on irons. Drill assigned: gate drill with 7-iron.',
    metrics: [{ label: 'Focus', value: 'Iron Strike' }],
  },
  {
    id: 'j5',
    date: '2026-03-16',
    type: 'round',
    title: 'Pine Valley CC — 78 (+6)',
    insight: 'Tough layout exposed approach weakness from rough. 36% FIR compounded the issue.',
    metrics: [{ label: 'SG Total', value: '-5.2' }, { label: 'GIR', value: '44%' }],
  },
  {
    id: 'j6',
    date: '2026-03-14',
    type: 'practice',
    title: 'Short game session — Wedge work',
    insight: 'First dedicated short game session in 3 weeks. Focused on 25-50yd pitches.',
  },
  {
    id: 'j7',
    date: '2026-03-12',
    type: 'round',
    title: 'Evergreen GC — 73 (+1)',
    insight: 'Best round of the month. Approach SG improved to -1.0. Putting cost only -0.5.',
    metrics: [{ label: 'SG Total', value: '-1.9' }, { label: 'Score', value: '73' }],
  },
  {
    id: 'j8',
    date: '2026-03-10',
    type: 'practice',
    title: 'GCQuad Session — 65 shots',
    insight: 'Focused entirely on 150-180yd targets. Dispersion improved 15% over previous session.',
  },
  {
    id: 'j9',
    date: '2026-03-07',
    type: 'round',
    title: 'Chambers Bay — 76 (+4)',
    insight: 'Wide fairways suited your driving (+0.6 SG). Approach from links lies was the problem.',
    metrics: [{ label: 'SG Total', value: '-4.4' }, { label: 'Score', value: '76' }],
  },
  {
    id: 'j10',
    date: '2026-03-04',
    type: 'lesson',
    title: 'Lesson with Coach Williams',
    insight: 'Mid-lesson review of approach data. Coach identified ball-first contact inconsistency. Assigned divot pattern check.',
    metrics: [{ label: 'Focus', value: 'Approach' }],
  },
  {
    id: 'j11',
    date: '2026-02-28',
    type: 'round',
    title: 'Evergreen GC — 75 (+3)',
    insight: 'Steady round. SG exactly at 20-round average. No category stood out positively or negatively.',
    metrics: [{ label: 'SG Total', value: '-3.9' }, { label: 'Score', value: '75' }],
  },
  {
    id: 'j12',
    date: '2026-02-25',
    type: 'practice',
    title: 'Range Session — Full bag',
    insight: '60% driver, 30% irons, 10% wedges. Heavy driver allocation despite 0.0 SG driving.',
  },
  {
    id: 'j13',
    date: '2026-02-22',
    type: 'round',
    title: 'The Olympic Club — 79 (+7)',
    insight: 'Hardest course in the rotation. Approach from rough was devastating: -3.2 SG approach.',
    metrics: [{ label: 'SG Total', value: '-6.1' }, { label: 'Score', value: '79' }],
  },
];

// --- Connection Insights (between journey events) ---
export const connectionInsights = [
  {
    afterEventId: 'j1',
    text: 'Your GIR jumped to 61% — correlates with 2 iron-focused practice sessions since your Mar 18 lesson.',
    confidence: 84,
  },
  {
    afterEventId: 'j5',
    text: 'Pine Valley penalizes approach misses more than Evergreen. Your rough approach SG (-0.9) was the differentiator.',
    confidence: 72,
  },
  {
    afterEventId: 'j9',
    text: 'Chambers Bay rewards driving distance — your +0.6 driving SG was your best category. Wide fairways suit your game shape.',
    confidence: 78,
  },
];

// --- Journey Longitudinal Insight ---
export const journeyInsight = {
  text: 'In weeks where you practice 2+ times before a round, your scoring average is 3.4 strokes better.',
  confidence: 81,
};

// --- Golf DNA ---
export const golfDNA = {
  unlocked: true,
  roundsCompleted: 101,
  practiceSessionsCompleted: 24,
  unlockThresholdRounds: 5,
  unlockThresholdPractice: 10,
  gameShape: {
    archetype: 'Distance-Dependent Scorer',
    description: 'You generate scoring opportunities through driving distance, but leave strokes on the table with approach accuracy and short game conversion. Your putting inside 10 feet is elite, which means getting the ball closer to the hole on approach and chip shots is your highest-leverage improvement area.',
    tourComparison: 'Your strokes gained profile most closely resembles Tony Finau\u2019s game shape — long off the tee, strong inside 10 feet, but approach accuracy is the limiter.',
  },
  strengths: [
    { text: 'Driving distance (top 15% of 3-hdcp players)', context: '268 yd avg vs 258 yd peer avg' },
    { text: 'Putting inside 10 feet (top 10%)', context: '+0.6 SG, elite conversion rate' },
    { text: 'Par-5 birdie rate', context: '1.4 birdies/round, 65% from par 5s' },
  ],
  weaknesses: [
    { text: 'Approach from 150-200yd (bottom 25%)', context: '-0.9 SG, biggest single leak' },
    { text: 'Up-and-down rate 25-50yd (bottom 30%)', context: '23% vs 35% scratch benchmark' },
    { text: 'Penalty strokes from tee (bottom 20%)', context: '-0.6 SG in penalties alone' },
  ],
  courseFit: [
    {
      course: 'Chambers Bay',
      fit: 'Strong' as const,
      reason: 'Wide fairways suit your driving. Large greens forgive approach dispersion.',
    },
    {
      course: 'Evergreen Golf Club',
      fit: 'Moderate' as const,
      reason: 'Your home course. Knows the layout well, but tight approach angles test your weakness.',
    },
    {
      course: 'The Olympic Club',
      fit: 'Weak' as const,
      reason: 'Narrow fairways and heavy rough penalize approach misses. Your worst SG rounds happen here.',
    },
  ],
  behavioralFingerprint: [
    { text: 'You score 3.2 strokes better when you warm up 30+ minutes before a round.', confidence: 82 },
    { text: 'Rounds within 10 days of a lesson average 2.1 strokes better.', confidence: 76 },
    { text: 'Your scoring improves 1.8 strokes in weeks with 2+ practice sessions.', confidence: 81 },
    { text: 'Your short game SG drops -0.4 when you skip short game practice for 2+ weeks.', confidence: 74 },
  ],
};

// --- Practice-Play Gap Insight ---
export const practicePlayGap = {
  text: "You've spent 72% of practice time on full swing, but 65% of your strokes-gained opportunity is inside 100 yards.",
  practiceFullSwing: 0.72,
  practiceShortGame: 0.28,
  sgOpportunityFullSwing: 0.35,
  sgOpportunityShortGame: 0.65,
};

// --- Recent Activity Feed ---
export interface ActivityItem {
  id: string;
  type: 'round' | 'practice' | 'lesson';
  date: string;
  title: string;
  insight: string;
  metric?: string;
}

export const recentActivity: ActivityItem[] = [
  { id: 'a1', type: 'round', date: '2026-03-23', title: 'Evergreen GC — 74', insight: 'GIR at 61%, best in 3 months', metric: '-2.8 SG' },
  { id: 'a2', type: 'practice', date: '2026-03-23', title: 'GCQuad — 88 shots', insight: '49% approach, 37% driver', metric: '2h 45m' },
  { id: 'a3', type: 'practice', date: '2026-03-20', title: 'Range — Iron block', insight: 'Applied lesson drill: forward ball position' },
  { id: 'a4', type: 'lesson', date: '2026-03-18', title: 'Lesson — Low point control', insight: 'Ball position adjustment, gate drill assigned' },
  { id: 'a5', type: 'round', date: '2026-03-16', title: 'Pine Valley — 78', insight: '36% FIR, tough from the rough', metric: '-5.2 SG' },
  { id: 'a6', type: 'practice', date: '2026-03-14', title: 'Short game — Wedge work', insight: 'First short game session in 3 weeks' },
  { id: 'a7', type: 'round', date: '2026-03-12', title: 'Evergreen GC — 73', insight: 'Best round of the month', metric: '-1.9 SG' },
];
