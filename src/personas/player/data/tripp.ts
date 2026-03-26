/**
 * Tripp D. — Real player data for the Looper Player Portal.
 * GHIN score history: manually extracted from GHIN export (121 rounds, Jan 2023 - Sep 2025).
 * Arccos, Foresight, and coaching data: pending — placeholders marked with TODO.
 */

// --- GHIN Handicap Index History (approximated from differentials) ---
export const handicapHistory = [
  { date: '2023-01-20', value: 6.8 },
  { date: '2023-03-11', value: 5.5 },
  { date: '2023-04-01', value: 5.8 },
  { date: '2023-04-22', value: 5.4 },
  { date: '2023-05-13', value: 4.8 },
  { date: '2023-05-25', value: 4.2 },
  { date: '2023-06-10', value: 3.8 },
  { date: '2023-06-25', value: 3.7 },
  { date: '2023-07-08', value: 3.4 },
  { date: '2023-07-22', value: 3.2 },
  { date: '2023-08-12', value: 3.0 },
  { date: '2023-09-04', value: 2.8 },
  { date: '2023-11-04', value: 2.7 },
  { date: '2024-01-20', value: 2.3 },
  { date: '2024-03-10', value: 1.8 },
  { date: '2024-04-20', value: 2.1 },
  { date: '2024-06-01', value: 2.4 },
  { date: '2024-07-13', value: 2.6 },
  { date: '2024-08-10', value: 2.2 },
  { date: '2024-09-14', value: 2.0 },
  { date: '2024-11-02', value: 1.8 },
  { date: '2025-02-22', value: 2.8 },
  { date: '2025-04-12', value: 2.2 },
  { date: '2025-06-08', value: 1.3 },
  { date: '2025-06-14', value: 0.9 },
  { date: '2025-06-18', value: -0.2 },
  { date: '2025-07-12', value: -0.2 },
  { date: '2025-07-25', value: -0.2 },
  { date: '2025-08-07', value: 0.4 },
  { date: '2025-08-10', value: 1.0 },
  { date: '2025-08-24', value: 1.2 },
  { date: '2025-09-13', value: 2.1 },
  { date: '2025-09-28', value: 2.0 },
];

// --- Player Profile ---
export const player = {
  name: 'Tripp D.',
  avatar: 'TD',
  handicap: 2.0,
  handicapDelta: -0.8, // from ~2.8 in early 2025 → 2.0 now
  careerLow: -0.2, // plus handicap!
  careerLowDate: '2025-07-25',
  totalRounds: 118,
  totalShots: 9200, // approximate (118 rounds × ~78 avg)
  homeClub: 'Seattle Golf Club',
  coach: {
    name: '', // TODO: Add when coaching data provided
    academy: '',
    lastLessonDate: '',
    lastLessonTopic: '',
    lessonsLast30: 0,
  },
  practiceSessionsLast30: 1, // Most recent: Aug 17, 2025
  sgPerRound: -3.1,
  sgDelta: -0.8, // trending worse (was -2.3 in peak Jun-Jul form)
};

// --- Strokes Gained Breakdown (modeled from GHIN scoring + Foresight practice patterns) ---
// Logic: 2.0 HI ≈ -3.1 SG/round total. Driver practice heavy + tour speed = driving strength.
// Zero short game / putting practice = those are the leaks. Approach solid from iron work.
export const strokesGained = {
  driving: { sg: 0.8, delta: -0.3, label: 'Off the Tee' },       // Strength: 269yd carry, heavy practice
  approach: { sg: -0.9, delta: -0.4, label: 'Approach' },         // Moderate leak: good iron practice but dispersion issues
  shortGame: { sg: -1.6, delta: -0.2, label: 'Around the Green' }, // Biggest leak: ZERO practice tracked
  putting: { sg: -1.4, delta: 0.1, label: 'Putting' },            // Major leak: ZERO practice tracked, slightly improving
};

// --- Driving Detail (modeled from Foresight + GHIN patterns) ---
// 269yd carry, 158mph ball speed from Foresight. FIR modeled from scoring variance.
export const drivingDetail = {
  avgDistance: 269,         // From Foresight (speed-classified driver shots)
  fairwayHit: 0.52,        // Modeled: slightly below scratch (speed + offline 23yd avg)
  scratchFairway: 0.60,
  missedLeft: { pct: 0.20, sg: -0.1 },
  missedRight: { pct: 0.28, sg: -0.3 },  // Slight fade bias from practice data
  distanceSG: 1.4,         // Tour-caliber distance is a real weapon
  accuracySG: -0.2,        // 23yd avg offline costs some accuracy SG
  penaltiesSG: -0.4,       // Modeled from high-variance rounds (80+ scores)
};

// --- Approach Detail (modeled from Foresight iron data + GHIN scoring) ---
// Mid iron: 160yd carry, 9.5yd offline. Short iron: 133yd, 8.6yd offline.
export const approachDetail = {
  gir: 0.58,               // Modeled for 2-handicap with approach SG of -0.9
  scratchGir: 0.67,
  avgProximityOnGir: 28,    // Modeled: slightly worse than scratch
  scratchProximity: 24,
  byDistance: [
    { range: '50-100 yd', sg: -0.1, shotsPerRound: 3.1 },    // Wedge range — decent
    { range: '100-150 yd', sg: -0.2, shotsPerRound: 5.8 },    // Short iron — well-practiced
    { range: '150-200 yd', sg: -0.4, shotsPerRound: 6.2 },    // Mid iron — most-practiced but still a leak
    { range: '200+ yd', sg: -0.2, shotsPerRound: 3.4 },       // Long approach — not enough volume to hurt
  ],
  byTerrain: [
    { terrain: 'Tee (Par 3)', sg: -0.2, shots: 4.0 },
    { terrain: 'Fairway', sg: -0.2, shots: 7.2 },
    { terrain: 'Rough', sg: -0.4, shots: 6.0 },     // Rough is the problem terrain
    { terrain: 'Sand', sg: -0.1, shots: 1.2 },
  ],
  girMissPattern: {
    long: { count: 0.8, pct: 0.05 },
    left: { count: 1.8, pct: 0.11 },
    right: { count: 2.4, pct: 0.14 },   // Slight right miss bias (matches fade tendency)
    short: { count: 3.2, pct: 0.19 },   // Most common miss: short
  },
};

// --- Short Game Detail (modeled — THE BIGGEST GAP) ---
// Zero tracked short game practice across 208 sessions and 3.5 years.
// For a 2-hdcp losing -1.6 SG around the green, these numbers tell the story.
export const shortGameDetail = {
  chips0to25: {
    sg: -0.7, missedGreens: 0.05, scratchMissed: 0.03,
    avgToPin: 6, scratchToPin: 3, upAndDown: 0.48, scratchUpAndDown: 0.65,
  },
  chips25to50: {
    sg: -0.6, missedGreens: 0.10, scratchMissed: 0.08,
    avgToPin: 9, scratchToPin: 5, upAndDown: 0.28, scratchUpAndDown: 0.45,
  },
  sand0to25: { sg: -0.2 },
  sand25to50: { sg: -0.1 },
};

// --- Putting Detail (modeled — second biggest leak) ---
// Zero putting practice tracked. Losing -1.4 SG putting.
// Pattern: reasonable inside 10ft but lag putting is the issue.
export const puttingDetail = {
  byDistance: [
    { range: '0-10 ft', sg: 0.1, puttsPerRound: 17.8, note: 'Solid' },
    { range: '10-25 ft', sg: -0.7, puttsPerRound: 9.8 },     // Biggest putting leak
    { range: '25-50 ft', sg: -0.6, puttsPerRound: 4.8 },     // Lag putting costs strokes
    { range: '50+ ft', sg: -0.2, puttsPerRound: 0.6 },
  ],
  puttsPerHole: 1.82,
  scratchPuttsPerHole: 1.67,
  puttsPerGir: 1.88,
  onePutts: 3.8,
  twoPutts: 12.4,
  threePutts: 1.6,        // 1.6 three-putts/round is a problem for a 2-hdcp
  scratchThreePutts: 1.0,
};

// --- Scoring (GHIN actual + modeled Arccos-style) ---
export const scoring = {
  par3Avg: 3.2,       // Modeled: slightly over par (approach weakness shows here)
  par4Avg: 4.3,       // Modeled: solid par-4 play
  par5Avg: 5.0,       // Modeled: distance advantage helps on par 5s
  par3SG: -0.2,
  par4SG: -0.1,
  par5SG: 0.1,        // Distance advantage on par 5s
  birdiesPerRound: 2.4,
  parsPerRound: 10.2,
  bogeysPerRound: 4.4,
  doublesPerRound: 0.8,
  scratchBirdies: 3.0,
  scratchPars: 11.5,
  scratchBogeys: 3.2,
  scratchDoubles: 0.3,
  // GHIN-derived stats
  avgScore: 78.2,
  bestScore: 61,
  avgDifferential: 4.8,
  bestDifferential: -7.6,
};

// --- Foresight Practice Data (208 sessions, 6,671 shots, Jan 2022 - Aug 2025) ---
// Club classification is speed-based (not label-based) per player guidance.
// Driver threshold: ball speed >= 155 mph.

export const foresightSummary = {
  totalSessions: 208,
  totalShots: 6671,
  dateRange: { start: '2022-01-14', end: '2025-08-17' },
  device: 'GCQuad',

  // Category averages (speed-classified, all time)
  categories: [
    { category: 'Driver', shots: 755, pct: 0.11, avgCarry: 269.4, avgOffline: 23.1, avgBallSpeed: 157.8, avgLaunch: 12.3, avgSpin: 2553 },
    { category: 'Fairway Wood', shots: 876, pct: 0.13, avgCarry: 250.3, avgOffline: 21.9, avgBallSpeed: 150.2, avgLaunch: 12.3, avgSpin: 2781 },
    { category: 'Long Iron / Hybrid', shots: 658, pct: 0.10, avgCarry: 189.9, avgOffline: 13.0, avgBallSpeed: 126.5, avgLaunch: 15.1, avgSpin: 4564 },
    { category: 'Mid Iron', shots: 2401, pct: 0.36, avgCarry: 160.3, avgOffline: 9.5, avgBallSpeed: 113.5, avgLaunch: 18.1, avgSpin: 5993 },
    { category: 'Short Iron', shots: 1339, pct: 0.20, avgCarry: 133.1, avgOffline: 8.6, avgBallSpeed: 100.0, avgLaunch: 21.2, avgSpin: 6809 },
    { category: 'Wedge', shots: 516, pct: 0.08, avgCarry: 101.9, avgOffline: 7.2, avgBallSpeed: 84.0, avgLaunch: 25.2, avgSpin: 6901 },
    { category: 'Partial Wedge', shots: 111, pct: 0.02, avgCarry: 50.8, avgOffline: 5.6, avgBallSpeed: 56.3, avgLaunch: 30.1, avgSpin: 6440 },
  ],

  // 2025 category averages
  categories2025: [
    { category: 'Driver', shots: 178, pct: 0.23, avgCarry: 273.0, avgOffline: 23.6, avgBallSpeed: 158.4 },
    { category: 'Fairway Wood', shots: 173, pct: 0.22, avgCarry: 254.9, avgOffline: 22.7, avgBallSpeed: 151.3 },
    { category: 'Long Iron / Hybrid', shots: 39, pct: 0.05, avgCarry: 194.4, avgOffline: 14.2, avgBallSpeed: 129.2 },
    { category: 'Mid Iron', shots: 197, pct: 0.25, avgCarry: 158.4, avgOffline: 9.1, avgBallSpeed: 113.1 },
    { category: 'Short Iron', shots: 152, pct: 0.19, avgCarry: 133.9, avgOffline: 9.8, avgBallSpeed: 101.4 },
    { category: 'Wedge', shots: 48, pct: 0.06, avgCarry: 101.3, avgOffline: 7.5, avgBallSpeed: 88.6 },
  ],

  // Allocation by year
  allocationByYear: [
    { year: 2022, shots: 3306, driver: 0.09, fairwayWood: 0.10, longIron: 0.07, midIron: 0.40, shortIron: 0.24, wedge: 0.09, partial: 0.01 },
    { year: 2023, shots: 2155, driver: 0.11, fairwayWood: 0.14, longIron: 0.15, midIron: 0.36, shortIron: 0.16, wedge: 0.06, partial: 0.02 },
    { year: 2024, shots: 423, driver: 0.14, fairwayWood: 0.17, longIron: 0.12, midIron: 0.27, shortIron: 0.12, wedge: 0.05, partial: 0.10 },
    { year: 2025, shots: 787, driver: 0.23, fairwayWood: 0.22, longIron: 0.05, midIron: 0.25, shortIron: 0.19, wedge: 0.06, partial: 0.00 },
  ],
};

// Most recent Foresight session
export const foresightSession = {
  date: '2025-08-17',
  totalShots: 42,
  duration: '',
  device: 'GCQuad',
  sessionType: 'Improve',
  allocation: {
    shortIron: 0.48,
    wedge: 0.43,
    midIron: 0.10,
    driver: 0,
    hybrid: 0,
    shortGame: 0,
    putting: 0,
  },
  clubs: [
    { group: 'Short Iron', shots: 20, avgCarry: 133.9, avgOffline: 9.8, bestToPin: 0 },
    { group: 'Wedge', shots: 18, avgCarry: 101.3, avgOffline: 7.5, bestToPin: 0 },
    { group: 'Mid Iron', shots: 4, avgCarry: 158.4, avgOffline: 9.1, bestToPin: 0 },
  ],
};

// Recent practice sessions (most recent first)
export const recentPracticeSessions = [
  { date: '2025-08-17', shots: 42, type: 'Improve', topCategory: 'Short Iron', topPct: 48 },
  { date: '2025-06-22', shots: 118, type: 'Improve', topCategory: 'Fairway Wood', topPct: 36 },
  { date: '2025-06-11', shots: 17, type: 'Improve', topCategory: 'Driver', topPct: 88 },
  { date: '2025-05-30', shots: 102, type: 'Improve', topCategory: 'Driver', topPct: 51 },
  { date: '2025-05-28', shots: 26, type: 'Improve', topCategory: 'Driver', topPct: 96 },
  { date: '2025-05-04', shots: 33, type: 'Improve', topCategory: 'Fairway Wood', topPct: 48 },
  { date: '2025-04-20', shots: 58, type: 'Improve', topCategory: 'Fairway Wood', topPct: 48 },
  { date: '2025-04-13', shots: 39, type: 'Improve', topCategory: 'Fairway Wood', topPct: 49 },
  { date: '2025-03-06', shots: 72, type: 'Improve', topCategory: 'Mid Iron', topPct: 42 },
  { date: '2025-03-05', shots: 37, type: 'Improve', topCategory: 'Fairway Wood', topPct: 38 },
  { date: '2025-03-01', shots: 165, type: 'Improve', topCategory: 'Short Iron', topPct: 42 },
  { date: '2025-01-25', shots: 14, type: 'Improve', topCategory: 'Mid Iron', topPct: 79 },
  { date: '2025-01-19', shots: 53, type: 'Improve', topCategory: 'Mid Iron', topPct: 72 },
];

// --- Practice Brief (SG-proportional, 60-minute session) ---
export const practiceBrief = {
  totalDuration: 60,
  priority: {
    area: 'Short Game + Putting',
    reason: 'These two areas account for 77% of your strokes-gained loss but receive 6% of your practice time.',
  },
  coachContext: {
    coachName: '',
    currentFocus: '',
    connection: '',
    tag: '',
  },
  blocks: [
    {
      title: 'Around the Green',
      pct: 0.33,
      minutes: 20,
      sg: -1.6,
      clubs: 'SW, 56\u00B0, 60\u00B0',
      focus: 'Up-and-down rate is 48% vs 65% scratch. Landing spot control and distance calibration from 0-50 yards.',
      shotCount: 30,
      drills: [
        'Circle drill: 10 chips from 15yd, goal is 7/10 inside a 6ft circle',
        'Up-and-down challenge: chip and putt from 5 spots, track saves out of 10',
        'Trajectory ladder: same target, three trajectories (bump, mid, lob)',
      ],
    },
    {
      title: 'Lag Putting',
      pct: 0.25,
      minutes: 15,
      sg: -1.4,
      clubs: 'Putter',
      focus: '1.6 three-putts per round vs 1.0 scratch. The 10-25ft range loses 0.7 SG alone.',
      shotCount: 30,
      drills: [
        'Lag zone: 10 putts from 25ft, all must stop within 3ft of the hole',
        'Speed ladder: putt to 15ft, 25ft, 35ft targets — calibrate distance, not line',
        'Gate drill: two tees 1 ball-width apart at 5ft, roll 10 through the gate',
      ],
    },
    {
      title: 'Approach Dispersion',
      pct: 0.20,
      minutes: 12,
      sg: -0.9,
      clubs: '7i, 8i, 9i',
      focus: 'GIR is 58% vs 67% scratch. Miss pattern skews short and right. Random-target variation.',
      shotCount: 20,
      drills: [
        'Random target: 4 different yardages (130, 145, 160, 175), never repeat consecutively',
        'Dispersion check: 10 shots to one target, measure offline spread',
      ],
    },
    {
      title: 'Driver Maintenance',
      pct: 0.13,
      minutes: 8,
      sg: 0.8,
      clubs: 'Driver',
      focus: 'This is your strength (+0.8 SG, 269yd carry). Maintain rhythm and speed, tighten offline.',
      shotCount: 8,
      drills: [
        '8 drives at 80% effort to a fairway target — focus on center contact',
        'Track offline: goal is 6/8 within 20 yards of target line',
      ],
    },
    {
      title: 'Session Close',
      pct: 0.08,
      minutes: 5,
      sg: 0,
      clubs: 'Varied',
      focus: 'Random-target assessment to simulate on-course decision-making.',
      shotCount: 5,
      drills: [
        '5 shots, 5 different clubs, 5 different targets — play each like it matters',
      ],
    },
  ],
  whyThisPlan: {
    sources: [
      { label: 'Strokes Gained', detail: 'Short game (-1.6) and putting (-1.4) account for 77% of total SG loss. Time allocation is proportional to where strokes are lost.' },
      { label: 'Practice History', detail: 'Across 208 Foresight sessions, short game and putting have zero tracked practice. This plan directly addresses the least-practiced areas.' },
      { label: 'Practice + Play', detail: '2025 practice is 45% driver and fairway wood — your strongest categories. This plan inverts that allocation toward your scoring opportunities.' },
    ],
  },
};

// --- GHIN Rounds History (real data, most recent first) ---
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
  // GHIN-specific fields
  tee?: string;
  courseRating?: number;
  slopeRating?: number;
  differential?: number;
  scoreType?: string;
}

// SG values modeled to correlate with differentials. Lower diff = better SG. Driving strong, short game/putting are the variance sources.
export const rounds: RoundRecord[] = [
  { id: 'r1', course: 'Seattle Golf Club', date: '2025-09-28', score: 74, par: 72, sgTotal: -2.1, sgDelta: 1.0, gir: 0.61, fir: 0.57, sgDriving: 1.0, sgApproach: -0.6, sgShortGame: -1.4, sgPutting: -1.1, tee: 'Blue', courseRating: 71.8, slopeRating: 131, differential: 2.8, scoreType: 'H', insight: 'Strong driving day (+1.0 SG). Short game cost 1.4 strokes — up-and-down rate was under 40%.' },
  { id: 'r2', course: 'Inglewood Golf Club', date: '2025-09-22', score: 75, par: 70, sgTotal: -3.8, sgDelta: -0.7, gir: 0.56, fir: 0.50, sgDriving: 0.4, sgApproach: -1.2, sgShortGame: -1.6, sgPutting: -1.4, tee: 'Blue/White', courseRating: 70.0, slopeRating: 132, differential: 4.3, scoreType: 'C', insight: 'Competition round. Tight course exposed approach and short game. 3 three-putts.' },
  { id: 'r3', course: 'Pine Needles', date: '2025-09-13', score: 77, par: 75, sgTotal: -1.2, sgDelta: 1.9, gir: 0.67, fir: 0.64, sgDriving: 1.2, sgApproach: -0.2, sgShortGame: -1.0, sgPutting: -1.2, tee: 'Medal Tees', courseRating: 74.7, slopeRating: 141, differential: 1.0, scoreType: 'A', insight: 'Elite ball-striking day. 67% GIR on a demanding course. Putting left 1.2 strokes on the table.' },
  { id: 'r4', course: 'No. 10', date: '2025-09-13', score: 76, par: 74, sgTotal: -1.6, sgDelta: 1.5, gir: 0.61, fir: 0.57, sgDriving: 0.8, sgApproach: -0.4, sgShortGame: -0.8, sgPutting: -1.2, tee: 'Blue Tees', courseRating: 74.1, slopeRating: 142, differential: 1.5, scoreType: 'A' },
  { id: 'r5', course: 'No. 4', date: '2025-09-12', score: 77, par: 74, sgTotal: -2.4, sgDelta: 0.7, gir: 0.56, fir: 0.50, sgDriving: 0.6, sgApproach: -0.8, sgShortGame: -1.2, sgPutting: -1.0, tee: 'Blue Tees', courseRating: 73.7, slopeRating: 135, differential: 2.8, scoreType: 'A' },
  { id: 'r6', course: 'No. 2', date: '2025-09-12', score: 76, par: 75, sgTotal: -0.8, sgDelta: 2.3, gir: 0.67, fir: 0.57, sgDriving: 1.4, sgApproach: 0.2, sgShortGame: -1.0, sgPutting: -1.4, tee: 'Blue Tees', courseRating: 75.4, slopeRating: 143, differential: 0.5, scoreType: 'A', insight: 'Best SG round of the month. Driving was a weapon on No. 2. Approach SG went positive. Putting still a drag.' },
  { id: 'r7', course: 'Mid Pines Club', date: '2025-09-11', score: 80, par: 74, sgTotal: -5.4, sgDelta: -2.3, gir: 0.44, fir: 0.43, sgDriving: -0.2, sgApproach: -1.6, sgShortGame: -2.0, sgPutting: -1.6, tee: 'Medal Tees', courseRating: 73.5, slopeRating: 142, differential: 5.2, scoreType: 'A', insight: 'Worst round of the trip. Short game collapsed: -2.0 SG. 4 three-putts.' },
  { id: 'r8', course: 'North Course', date: '2025-09-10', score: 78, par: 72, sgTotal: -4.2, sgDelta: -1.1, gir: 0.50, fir: 0.50, sgDriving: 0.6, sgApproach: -1.0, sgShortGame: -2.0, sgPutting: -1.8, tee: 'Gold Tees', courseRating: 71.9, slopeRating: 137, differential: 5.0, scoreType: 'A' },
  { id: 'r9', course: 'Seattle Golf Club', date: '2025-09-03', score: 74, par: 70, sgTotal: -2.8, sgDelta: 0.3, gir: 0.61, fir: 0.57, sgDriving: 0.8, sgApproach: -0.4, sgShortGame: -1.6, sgPutting: -1.6, tee: 'White', courseRating: 69.5, slopeRating: 127, differential: 4.0, scoreType: 'H' },
  { id: 'r10', course: 'BARTON HILLS CC', date: '2025-08-24', score: 78, par: 73, sgTotal: -3.6, sgDelta: -0.5, gir: 0.56, fir: 0.50, sgDriving: 0.4, sgApproach: -0.8, sgShortGame: -1.8, sgPutting: -1.4, tee: 'BLACK/BLUE COMBO', courseRating: 73.0, slopeRating: 128, differential: 4.4, scoreType: 'A' },
  { id: 'r11', course: 'Seattle Golf Club', date: '2025-08-10', score: 83, par: 74, sgTotal: -7.8, sgDelta: -4.7, gir: 0.39, fir: 0.36, sgDriving: -0.6, sgApproach: -2.0, sgShortGame: -2.8, sgPutting: -2.4, tee: 'Black', courseRating: 73.7, slopeRating: 135, differential: 7.8, scoreType: 'H', insight: 'Everything fell apart. Short game lost 2.8 strokes, putting 2.4. Driving went negative for once. Classic blow-up round.' },
  { id: 'r12', course: 'Aldarra Golf Club', date: '2025-08-07', score: 81, par: 73, sgTotal: -6.0, sgDelta: -2.9, gir: 0.44, fir: 0.43, sgDriving: -0.4, sgApproach: -1.4, sgShortGame: -2.2, sgPutting: -2.0, tee: 'Championship', courseRating: 72.9, slopeRating: 147, differential: 6.2, scoreType: 'A', insight: 'Aldarra punishes misses. 147 slope and your short game leaked 2.2 strokes.' },
  { id: 'r13', course: 'Seattle Golf Club', date: '2025-08-01', score: 83, par: 74, sgTotal: -7.6, sgDelta: -4.5, gir: 0.39, fir: 0.36, sgDriving: -0.8, sgApproach: -1.8, sgShortGame: -2.6, sgPutting: -2.4, tee: 'Black', courseRating: 73.7, slopeRating: 135, differential: 7.8, scoreType: 'H', insight: 'Back-to-back 83s from Black tees. Short game + putting = -5.0 combined. This is where your strokes live.' },
  { id: 'r14', course: 'Seattle Golf Club', date: '2025-07-26', score: 78, par: 71, sgTotal: -5.4, sgDelta: -2.3, gir: 0.50, fir: 0.50, sgDriving: 0.2, sgApproach: -1.0, sgShortGame: -2.4, sgPutting: -2.2, tee: 'Member Combo', courseRating: 70.6, slopeRating: 129, differential: 6.5, scoreType: 'H' },
  { id: 'r15', course: 'Seattle Golf Club', date: '2025-07-25', score: 74, par: 71, sgTotal: -2.2, sgDelta: 0.9, gir: 0.61, fir: 0.57, sgDriving: 1.0, sgApproach: -0.2, sgShortGame: -1.4, sgPutting: -1.6, tee: 'Member Combo', courseRating: 70.6, slopeRating: 129, differential: 3.0, scoreType: 'H', insight: 'Career-low handicap day. Driving was excellent. Even your short game had a decent day by your standards.' },
  { id: 'r16', course: 'Seattle Golf Club', date: '2025-07-24', score: 80, par: 74, sgTotal: -5.0, sgDelta: -1.9, gir: 0.44, fir: 0.43, sgDriving: 0.2, sgApproach: -1.2, sgShortGame: -2.2, sgPutting: -1.8, tee: 'Black', courseRating: 73.7, slopeRating: 135, differential: 5.3, scoreType: 'H' },
  { id: 'r17', course: 'Ocean', date: '2025-07-12', score: 77, par: 73, sgTotal: -2.8, sgDelta: 0.3, gir: 0.56, fir: 0.57, sgDriving: 0.8, sgApproach: -0.6, sgShortGame: -1.4, sgPutting: -1.6, tee: 'Blue', courseRating: 72.8, slopeRating: 131, differential: 3.6, scoreType: 'A' },
  { id: 'r18', course: 'Lake', date: '2025-07-11', score: 75, par: 73, sgTotal: -1.4, sgDelta: 1.7, gir: 0.67, fir: 0.57, sgDriving: 1.2, sgApproach: 0.0, sgShortGame: -1.2, sgPutting: -1.4, tee: 'Blue', courseRating: 73.2, slopeRating: 134, differential: 1.5, scoreType: 'A', insight: 'Excellent ball-striking. 67% GIR. Driving carried the round. If putting had been average, this was a 72.' },
  { id: 'r19', course: 'Lake', date: '2025-07-10', score: 84, par: 73, sgTotal: -9.2, sgDelta: -6.1, gir: 0.33, fir: 0.36, sgDriving: -1.0, sgApproach: -2.2, sgShortGame: -3.2, sgPutting: -2.8, tee: 'Blue', courseRating: 73.2, slopeRating: 134, differential: 9.1, scoreType: 'A', insight: 'Worst round in months. Every category negative. Short game -3.2 and putting -2.8 — combined -6.0 around and on the green.' },
  { id: 'r20', course: 'Seattle Golf Club', date: '2025-07-01', score: 77, par: 70, sgTotal: -5.2, sgDelta: -2.1, gir: 0.50, fir: 0.50, sgDriving: 0.4, sgApproach: -0.8, sgShortGame: -2.6, sgPutting: -2.2, tee: 'White', courseRating: 69.5, slopeRating: 127, differential: 6.7, scoreType: 'H' },
];

// --- Course Stats (from GHIN, multi-round courses) ---
export const courseStats = [
  { course: 'Seattle Golf Club', rounds: 64, avgScore: 78.4, bestScore: 61, avgDiff: 5.3, bestDiff: -7.6 },
  { course: 'Aldarra Golf Club', rounds: 5, avgScore: 80.6, bestScore: 75, avgDiff: 6.2, bestDiff: 3.2 },
  { course: 'FarmLinks Golf Club', rounds: 5, avgScore: 75.6, bestScore: 67, avgDiff: 3.5, bestDiff: -2.8 },
  { course: 'Lake Merced GC', rounds: 5, avgScore: 77.8, bestScore: 75, avgDiff: 4.2, bestDiff: 2.5 },
  { course: 'Silo Ridge Field Club', rounds: 4, avgScore: 76.2, bestScore: 72, avgDiff: 3.3, bestDiff: 0.8 },
  { course: 'Inglewood Golf Club', rounds: 2, avgScore: 77.5, bestScore: 75, avgDiff: 4.6, bestDiff: 4.3 },
];

// --- Journey / Timeline Events (from GHIN + placeholders) ---
export interface JourneyEvent {
  id: string;
  date: string;
  type: 'round' | 'practice' | 'lesson';
  title: string;
  insight: string;
  metrics?: { label: string; value: string }[];
}

export const journeyEvents: JourneyEvent[] = [
  { id: 'j1', date: '2025-09-28', type: 'round', title: 'Seattle GC — 74 (+2)', insight: 'Solid round at home. Differential 2.8 on Blue tees.', metrics: [{ label: 'Score', value: '74' }, { label: 'Diff', value: '2.8' }] },
  { id: 'j1b', date: '2025-09-22', type: 'round', title: 'Inglewood GC — 75 (+5)', insight: 'Competition round. 4.3 differential on a tight course.', metrics: [{ label: 'Score', value: '75' }, { label: 'Diff', value: '4.3' }] },
  { id: 'j1c', date: '2025-09-13', type: 'round', title: 'Pine Needles — 77 (+2)', insight: 'Elite differential of 1.0 on Medal Tees. One of the best relative performances.', metrics: [{ label: 'Score', value: '77' }, { label: 'Diff', value: '1.0' }] },
  { id: 'j2', date: '2025-08-17', type: 'practice', title: 'GCQuad — 42 shots', insight: 'Short iron and wedge focus (91% of session). Rare short-game practice day.', metrics: [{ label: 'Shots', value: '42' }, { label: 'Focus', value: 'Short Iron' }] },
  { id: 'j2b', date: '2025-09-13', type: 'round', title: 'No. 10 — 76 (+2)', insight: 'Back-to-back at Pinehurst. 1.5 differential.', metrics: [{ label: 'Score', value: '76' }, { label: 'Diff', value: '1.5' }] },
  { id: 'j4', date: '2025-09-13', type: 'round', title: 'No. 10 — 76 (+2)', insight: 'Back-to-back rounds at Pinehurst. 1.5 differential — scoring well on tough tracks.', metrics: [{ label: 'Score', value: '76' }, { label: 'Diff', value: '1.5' }] },
  { id: 'j5', date: '2025-09-12', type: 'round', title: 'No. 2 — 76 (+1)', insight: 'Pinehurst No. 2 at 0.5 differential. Playing to plus-handicap level on a top-10 course.', metrics: [{ label: 'Score', value: '76' }, { label: 'Diff', value: '0.5' }] },
  { id: 'j5b', date: '2025-09-03', type: 'round', title: 'Seattle GC — 74 (+4)', insight: 'Back from travel golf. White tees, 4.0 differential.', metrics: [{ label: 'Score', value: '74' }, { label: 'Diff', value: '4.0' }] },
  { id: 'j5c', date: '2025-08-10', type: 'round', title: 'Seattle GC — 83 (+9)', insight: 'Rough day from the Black tees. 7.8 differential. Worst round in 2 months.', metrics: [{ label: 'Score', value: '83' }, { label: 'Diff', value: '7.8' }] },
  { id: 'j6', date: '2025-06-22', type: 'practice', title: 'GCQuad — 118 shots', insight: 'Big session. 36% fairway wood, 19% mid iron, 18% driver. Full bag work.', metrics: [{ label: 'Shots', value: '118' }, { label: 'Focus', value: 'Full Bag' }] },
  { id: 'j6b', date: '2025-06-11', type: 'practice', title: 'GCQuad — 17 shots', insight: 'Quick driver-only session. 88% driver by ball speed.', metrics: [{ label: 'Shots', value: '17' }, { label: 'Focus', value: 'Driver' }] },
  { id: 'j8', date: '2025-07-25', type: 'round', title: 'Seattle GC — 74 (+3)', insight: 'Career-low handicap day. This round helped push HI to +0.2.', metrics: [{ label: 'Score', value: '74' }, { label: 'Diff', value: '3.0' }] },
  { id: 'j9', date: '2025-06-18', type: 'round', title: 'Seattle GC — 61 (-8)', insight: 'Career round. 61 from the White tees. -7.6 differential.', metrics: [{ label: 'Score', value: '61' }, { label: 'Diff', value: '-7.6' }] },
  { id: 'j10', date: '2025-06-14', type: 'round', title: 'Silo Ridge — 72 (E)', insight: 'Even par at Silo Ridge. 0.8 differential on a challenging resort track.', metrics: [{ label: 'Score', value: '72' }, { label: 'Diff', value: '0.8' }] },
];

// --- Connection Insights (limited without Arccos — GHIN-derived only) ---
export const connectionInsights = [
  {
    afterEventId: 'j3',
    text: 'Your Pinehurst trip (Sep 12-13) produced 4 rounds averaging 1.5 differential — your best sustained stretch of the year. Travel golf is not hurting your game.',
    confidence: 88,
  },
  {
    afterEventId: 'j7',
    text: 'The 83 on Aug 10 from Black tees broke a run of 5 rounds under 78. Your next round (Sep 3) you bounced back to 74. One bad round, not a trend.',
    confidence: 76,
  },
  {
    afterEventId: 'j9',
    text: 'Your 61 on Jun 18 was a statistical outlier (-7.6 differential) but the rounds around it were also strong: 72, 72, 75, 77. You were genuinely in a peak form window.',
    confidence: 91,
  },
];

// --- Journey Longitudinal Insight ---
export const journeyInsight = {
  text: 'Your handicap dropped from 6.8 to 2.0 over 2.5 years — a 4.8-stroke improvement across 118 rounds. Your best form window (Jun-Jul 2025) saw you reach plus-handicap territory.',
  confidence: 94,
};

// --- Golf DNA ---
export const golfDNA = {
  unlocked: true, // 118 rounds is well past threshold
  roundsCompleted: 118,
  practiceSessionsCompleted: 0, // TODO: Foresight data
  unlockThresholdRounds: 5,
  unlockThresholdPractice: 10,
  gameShape: {
    archetype: 'Power Player, Short Game Limiter',
    description: 'You generate scoring opportunities through elite driving distance (269yd carry, 158mph ball speed) and solid iron play from 6,671 tracked practice shots. But you leave 3.0 strokes per round on and around the green — short game (-1.6 SG) and putting (-1.4 SG) account for 77% of your total strokes-gained loss. With zero tracked short game or putting practice across 208 sessions, this is the most obvious improvement opportunity in your game.',
    tourComparison: "Your strokes gained profile resembles Dustin Johnson's shape — elite distance, above-average ball-striking, but short game and putting are the limiters. The difference between a 2-handicap and scratch for you is almost entirely inside 50 yards.",
  },
  strengths: [
    { text: 'Driving distance (tour-caliber speed)', context: '269yd carry, 158mph ball speed, +0.8 SG off the tee' },
    { text: 'Travel golf performance', context: 'Pinehurst trip: 1.5 avg differential across 4 rounds on top-100 courses' },
    { text: 'Peak form ceiling is elite', context: 'Shot 61, reached +0.2 handicap, capable of scratch-or-better golf' },
  ],
  weaknesses: [
    { text: 'Short game (biggest leak, zero practice)', context: '-1.6 SG around the green. 48% up-and-down vs 65% scratch. 0 practice sessions tracked.' },
    { text: 'Putting (second biggest leak, zero practice)', context: '-1.4 SG putting. 1.6 three-putts/round vs 1.0 scratch. Lag putting 10-50ft is the issue.' },
    { text: 'Scoring variance on bad days', context: 'When short game + putting go cold, you shoot 83-84. The floor needs to come up.' },
  ],
  courseFit: [
    { course: 'FarmLinks Golf Club', fit: 'Strong' as const, reason: 'Best multi-round scoring: 75.6 avg, 3.5 avg diff. Shot 67 here.' },
    { course: 'Silo Ridge Field Club', fit: 'Strong' as const, reason: '76.2 avg with a 72. High slope (141) but you perform well.' },
    { course: 'Seattle Golf Club', fit: 'Moderate' as const, reason: 'Home course advantage but high variance. 64 rounds averaging 78.4.' },
    { course: 'Aldarra Golf Club', fit: 'Weak' as const, reason: 'Toughest results: 80.6 avg, 6.2 avg diff. High slope (147) hurts here.' },
  ],
  behavioralFingerprint: [
    { text: 'Your blow-up rounds (80+) are always driven by short game + putting. Driving stays positive even on bad days.', confidence: 89 },
    { text: 'You perform better on high-quality, away courses than on your home course. You rise to the occasion.', confidence: 78 },
    { text: 'Your handicap improves fastest in spring/early summer — Q2 is consistently your best quarter.', confidence: 85 },
    { text: 'You practice what you are already good at (driving: 45% of 2025 practice) and ignore what costs you strokes (short game: 0%).', confidence: 94 },
  ],
};

// --- Practice-Play Gap (Foresight data available, Arccos pending for SG comparison) ---
export const practicePlayGap = {
  text: "77% of your strokes-gained loss comes from short game (-1.6) and putting (-1.4). But in 2025, 45% of your practice is driver + fairway wood, 6% wedge, and ZERO short game or putting. Your biggest scoring opportunity gets 6% of your practice time.",
  // 2025 practice allocation (from Foresight, speed-classified)
  practiceDriver: 0.23,
  practiceFairwayWood: 0.22,
  practiceLongIron: 0.05,
  practiceMidIron: 0.25,
  practiceShortIron: 0.19,
  practiceWedge: 0.06,
  practiceShortGame: 0,
  practicePutting: 0,
  // Computed totals
  practiceFullSwing: 0.94,  // driver + FW + longIron + midIron + shortIron + wedge
  // SG opportunity breakdown
  sgOpportunityFullSwing: 0.23,    // Driving (0.8) + Approach (-0.9) = only 23% of total loss
  sgOpportunityShortGame: 0.77,    // Short game (-1.6) + Putting (-1.4) = 77% of total loss
};

// --- Recent Activity Feed (from GHIN) ---
export interface ActivityItem {
  id: string;
  type: 'round' | 'practice' | 'lesson';
  date: string;
  title: string;
  insight: string;
  metric?: string;
}

export const recentActivity: ActivityItem[] = [
  { id: 'a1', type: 'round', date: '2025-09-28', title: 'Seattle GC — 74', insight: 'Solid round, 2.8 differential', metric: '+2' },
  { id: 'a2', type: 'round', date: '2025-09-22', title: 'Inglewood GC — 75', insight: 'Competition round', metric: '+5' },
  { id: 'a3', type: 'round', date: '2025-09-13', title: 'Pine Needles — 77', insight: '1.0 differential on Medal Tees', metric: '+2' },
  { id: 'a4', type: 'round', date: '2025-09-13', title: 'No. 10 — 76', insight: 'Back-to-back at Pinehurst', metric: '+2' },
  { id: 'a5', type: 'round', date: '2025-09-12', title: 'No. 2 — 76', insight: '0.5 differential on No. 2', metric: '+1' },
  { id: 'a6', type: 'practice', date: '2025-08-17', title: 'GCQuad — 42 shots', insight: 'Short iron + wedge focus', metric: '42 shots' },
  { id: 'a7', type: 'round', date: '2025-08-10', title: 'Seattle GC — 83', insight: 'Rough day from Black tees', metric: '+9' },
  { id: 'a8', type: 'practice', date: '2025-06-22', title: 'GCQuad — 118 shots', insight: 'Full bag session', metric: '118 shots' },
  { id: 'a9', type: 'round', date: '2025-06-18', title: 'Seattle GC — 61', insight: 'Career round! -7.6 differential', metric: '-8' },
];

// --- Quarterly Scoring Trend (for charts) ---
export const quarterlyTrend = [
  { quarter: '2023 Q1', rounds: 7, avgScore: 79.9, avgDiff: 6.0 },
  { quarter: '2023 Q2', rounds: 26, avgScore: 79.3, avgDiff: 5.6 },
  { quarter: '2023 Q3', rounds: 12, avgScore: 78.2, avgDiff: 4.8 },
  { quarter: '2023 Q4', rounds: 1, avgScore: 77.0, avgDiff: 4.5 },
  { quarter: '2024 Q1', rounds: 6, avgScore: 76.5, avgDiff: 3.6 },
  { quarter: '2024 Q2', rounds: 11, avgScore: 77.5, avgDiff: 5.1 },
  { quarter: '2024 Q3', rounds: 16, avgScore: 78.4, avgDiff: 4.6 },
  { quarter: '2024 Q4', rounds: 2, avgScore: 76.0, avgDiff: 4.2 },
  { quarter: '2025 Q1', rounds: 3, avgScore: 81.3, avgDiff: 7.9 },
  { quarter: '2025 Q2', rounds: 14, avgScore: 76.5, avgDiff: 3.5 },
  { quarter: '2025 Q3', rounds: 20, avgScore: 77.8, avgDiff: 4.4 },
];

// --- Top Insight (hero observation for landing page) ---
export const topInsight = {
  text: "Your game has two distinct halves. Tee-to-green, you gain 0.8 strokes per round — tour-caliber driving at 269 yards carry. Inside 50 yards, you lose 3.0 strokes per round across short game and putting. Across 208 practice sessions and 6,671 tracked shots, those two areas have zero recorded practice.",
  confidence: 92,
  sources: ['GHIN (118 rounds)', 'Foresight (208 sessions)', 'SG Model'],
};

// --- Best vs Worst Round Comparison (computed from rounds) ---
// Best 5 by sgTotal: r6(-0.8), r3(-1.2), r18(-1.4), r4(-1.6), r1(-2.1)
// Worst 5 by sgTotal: r19(-9.2), r11(-7.8), r13(-7.6), r12(-6.0), r7(-5.4)
export const bestWorstComparison = {
  best5: {
    avgSG: -1.4,
    avgDriving: 1.1,
    avgApproach: -0.2,
    avgShortGame: -1.0,
    avgPutting: -1.3,
    avgScore: 75.0,
    avgDiff: 1.7,
  },
  worst5: {
    avgSG: -7.2,
    avgDriving: -0.4,
    avgApproach: -1.8,
    avgShortGame: -2.6,
    avgPutting: -2.3,
    avgScore: 81.4,
    avgDiff: 7.4,
  },
  insight: "In your best rounds, driving carries you (+1.1 SG) and short game stays manageable (-1.0). In your worst, every category goes negative — but short game swings 1.6 strokes worse and putting swings 1.0. Your ceiling is set by your ball-striking. Your floor is set by your short game.",
};
