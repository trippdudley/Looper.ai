// Consumer Dashboard — Unified data layer
// Aggregates: GHIN, Arccos, Launch Monitors, Skillet, Coaching OS

// ─── Types ────────────────────────────────────────────────────────

export interface GameScore {
  current: number;           // 0-100 composite score
  trend: number[];           // last 8 weeks
  components: {
    scoring: number;         // weight: 35% — are you scoring better?
    ballStriking: number;    // weight: 25% — launch monitor quality
    practiceHabit: number;   // weight: 20% — are you putting in the work?
    coachAlignment: number;  // weight: 20% — are you following the plan?
  };
  lastUpdated: string;
}

export interface StrokesGained {
  total: number;
  offTheTee: number;
  approach: number;
  aroundTheGreen: number;
  putting: number;
  trend: { week: string; total: number; offTheTee: number; approach: number; aroundTheGreen: number; putting: number }[];
}

export interface Round {
  id: string;
  date: string;
  course: string;
  tees: string;
  rating: number;
  slope: number;
  score: number;
  par: number;
  differential: number;
  fairwaysHit: number;
  fairwaysTotal: number;
  greensInReg: number;
  greensTotal: number;
  putts: number;
  penalties: number;
  source: 'ghin' | 'arccos' | 'manual';
  strokesGained?: {
    total: number;
    offTheTee: number;
    approach: number;
    aroundTheGreen: number;
    putting: number;
  };
}

export interface ClubDistance {
  club: string;
  avgCarry: number;
  avgTotal: number;
  dispersion: number;    // yards left-right
  samples: number;
  source: 'arccos' | 'trackman' | 'blended';
  trend: number;         // +/- yards vs 3 months ago
}

export interface SkillRating {
  category: string;
  score: number;          // 0-100
  level: 'developing' | 'competent' | 'proficient' | 'advanced';
  lastAssessed: string;
  trend: 'improving' | 'stable' | 'declining';
  source: 'skillet' | 'arccos' | 'coaching';
}

export interface PracticeSession {
  id: string;
  date: string;
  type: 'range' | 'short-game' | 'putting' | 'on-course' | 'drill-work';
  duration: number;       // minutes
  drillsCompleted: string[];
  notes?: string;
}

export interface HomeworkItem {
  id: string;
  drill: string;
  description: string;
  targetReps: number;
  completedReps: number;
  dueDate: string;
  assignedBy: string;
  priority: 'focus' | 'maintain' | 'explore';
  status: 'active' | 'completed' | 'overdue';
}

export interface CoachingArc {
  phase: string;
  description: string;
  startDate: string;
  targetDate: string;
  progress: number;       // 0-100
  milestones: { label: string; reached: boolean; date?: string }[];
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;           // emoji or lucide icon name
  status: 'connected' | 'syncing' | 'error' | 'not-connected';
  lastSync?: string;
  dataPoints: number;
  color: string;
}

export interface ConsumerProfile {
  gameScore: GameScore;
  strokesGained: StrokesGained;
  rounds: Round[];
  clubDistances: ClubDistance[];
  skillRatings: SkillRating[];
  practiceSessions: PracticeSession[];
  homework: HomeworkItem[];
  coachingArc: CoachingArc;
  dataSources: DataSource[];
  streak: { current: number; longest: number; thisWeek: number; target: number };
  nextSession: { date: string; time: string; coach: string; focus: string; type: string };
}


// ─── Mock Data ────────────────────────────────────────────────────

export const gameScore: GameScore = {
  current: 72,
  trend: [54, 58, 61, 63, 66, 68, 70, 72],
  components: {
    scoring: 68,
    ballStriking: 74,
    practiceHabit: 78,
    coachAlignment: 70,
  },
  lastUpdated: '2026-03-19T18:30:00Z',
};

export const strokesGained: StrokesGained = {
  total: -2.4,
  offTheTee: -0.3,
  approach: -1.1,
  aroundTheGreen: -0.6,
  putting: -0.4,
  trend: [
    { week: 'Feb 3',  total: -4.8, offTheTee: -1.2, approach: -1.8, aroundTheGreen: -1.0, putting: -0.8 },
    { week: 'Feb 10', total: -4.2, offTheTee: -0.9, approach: -1.6, aroundTheGreen: -0.9, putting: -0.8 },
    { week: 'Feb 17', total: -3.8, offTheTee: -0.7, approach: -1.5, aroundTheGreen: -0.9, putting: -0.7 },
    { week: 'Feb 24', total: -3.5, offTheTee: -0.6, approach: -1.4, aroundTheGreen: -0.8, putting: -0.7 },
    { week: 'Mar 3',  total: -3.1, offTheTee: -0.5, approach: -1.3, aroundTheGreen: -0.7, putting: -0.6 },
    { week: 'Mar 10', total: -2.8, offTheTee: -0.4, approach: -1.2, aroundTheGreen: -0.7, putting: -0.5 },
    { week: 'Mar 17', total: -2.4, offTheTee: -0.3, approach: -1.1, aroundTheGreen: -0.6, putting: -0.4 },
  ],
};

export const rounds: Round[] = [
  {
    id: 'r-1', date: '2026-03-16', course: 'Pebble Beach GL', tees: 'Blue',
    rating: 74.8, slope: 143, score: 89, par: 72, differential: 14.1,
    fairwaysHit: 8, fairwaysTotal: 14, greensInReg: 7, greensTotal: 18, putts: 33, penalties: 2,
    source: 'arccos',
    strokesGained: { total: -2.1, offTheTee: -0.2, approach: -0.9, aroundTheGreen: -0.5, putting: -0.5 },
  },
  {
    id: 'r-2', date: '2026-03-09', course: 'Spyglass Hill GC', tees: 'White',
    rating: 72.1, slope: 137, score: 88, par: 72, differential: 14.4,
    fairwaysHit: 7, fairwaysTotal: 14, greensInReg: 6, greensTotal: 18, putts: 34, penalties: 1,
    source: 'arccos',
    strokesGained: { total: -2.8, offTheTee: -0.4, approach: -1.2, aroundTheGreen: -0.7, putting: -0.5 },
  },
  {
    id: 'r-3', date: '2026-03-02', course: 'Poppy Hills GC', tees: 'Blue',
    rating: 71.5, slope: 135, score: 86, par: 72, differential: 13.0,
    fairwaysHit: 9, fairwaysTotal: 14, greensInReg: 8, greensTotal: 18, putts: 31, penalties: 1,
    source: 'ghin',
    strokesGained: { total: -1.8, offTheTee: -0.1, approach: -0.8, aroundTheGreen: -0.5, putting: -0.4 },
  },
  {
    id: 'r-4', date: '2026-02-23', course: 'Pebble Beach GL', tees: 'Blue',
    rating: 74.8, slope: 143, score: 91, par: 72, differential: 15.5,
    fairwaysHit: 6, fairwaysTotal: 14, greensInReg: 5, greensTotal: 18, putts: 35, penalties: 3,
    source: 'arccos',
    strokesGained: { total: -3.6, offTheTee: -0.8, approach: -1.4, aroundTheGreen: -0.8, putting: -0.6 },
  },
  {
    id: 'r-5', date: '2026-02-16', course: 'Monterey Peninsula CC', tees: 'White',
    rating: 70.2, slope: 130, score: 87, par: 72, differential: 15.2,
    fairwaysHit: 7, fairwaysTotal: 14, greensInReg: 6, greensTotal: 18, putts: 33, penalties: 2,
    source: 'ghin',
    strokesGained: { total: -3.4, offTheTee: -0.7, approach: -1.3, aroundTheGreen: -0.8, putting: -0.6 },
  },
  {
    id: 'r-6', date: '2026-02-09', course: 'Spyglass Hill GC', tees: 'White',
    rating: 72.1, slope: 137, score: 92, par: 72, differential: 17.0,
    fairwaysHit: 5, fairwaysTotal: 14, greensInReg: 4, greensTotal: 18, putts: 36, penalties: 3,
    source: 'arccos',
    strokesGained: { total: -4.6, offTheTee: -1.1, approach: -1.7, aroundTheGreen: -1.0, putting: -0.8 },
  },
  {
    id: 'r-7', date: '2026-02-01', course: 'Poppy Hills GC', tees: 'Blue',
    rating: 71.5, slope: 135, score: 90, par: 72, differential: 16.0,
    fairwaysHit: 6, fairwaysTotal: 14, greensInReg: 5, greensTotal: 18, putts: 34, penalties: 2,
    source: 'ghin',
  },
  {
    id: 'r-8', date: '2026-01-25', course: 'Pacific Grove GL', tees: 'Blue',
    rating: 68.4, slope: 120, score: 84, par: 70, differential: 15.3,
    fairwaysHit: 8, fairwaysTotal: 14, greensInReg: 7, greensTotal: 18, putts: 32, penalties: 1,
    source: 'arccos',
    strokesGained: { total: -3.5, offTheTee: -0.6, approach: -1.4, aroundTheGreen: -0.8, putting: -0.7 },
  },
];

export const clubDistances: ClubDistance[] = [
  { club: 'Driver',     avgCarry: 225, avgTotal: 243, dispersion: 38, samples: 142, source: 'blended', trend: +4 },
  { club: '3-Wood',     avgCarry: 205, avgTotal: 218, dispersion: 28, samples: 68,  source: 'blended', trend: +2 },
  { club: '5-Hybrid',   avgCarry: 185, avgTotal: 196, dispersion: 24, samples: 54,  source: 'arccos',  trend: +1 },
  { club: '5-Iron',     avgCarry: 170, avgTotal: 180, dispersion: 22, samples: 87,  source: 'blended', trend: +3 },
  { club: '6-Iron',     avgCarry: 162, avgTotal: 170, dispersion: 20, samples: 94,  source: 'blended', trend: +2 },
  { club: '7-Iron',     avgCarry: 152, avgTotal: 159, dispersion: 18, samples: 112, source: 'blended', trend: +2 },
  { club: '8-Iron',     avgCarry: 140, avgTotal: 146, dispersion: 16, samples: 98,  source: 'blended', trend: +1 },
  { club: '9-Iron',     avgCarry: 128, avgTotal: 133, dispersion: 14, samples: 86,  source: 'blended', trend: +1 },
  { club: 'PW',         avgCarry: 115, avgTotal: 119, dispersion: 12, samples: 104, source: 'blended', trend: 0 },
  { club: '50°',        avgCarry: 102, avgTotal: 105, dispersion: 10, samples: 78,  source: 'trackman', trend: +1 },
  { club: '54°',        avgCarry: 88,  avgTotal: 90,  dispersion: 9,  samples: 65,  source: 'trackman', trend: 0 },
  { club: '58°',        avgCarry: 72,  avgTotal: 74,  dispersion: 8,  samples: 52,  source: 'trackman', trend: -1 },
];

export const skillRatings: SkillRating[] = [
  { category: 'Driving Accuracy',    score: 62, level: 'competent',  lastAssessed: '2026-03-16', trend: 'improving', source: 'arccos' },
  { category: 'Approach Proximity',  score: 48, level: 'developing', lastAssessed: '2026-03-16', trend: 'improving', source: 'arccos' },
  { category: 'Scrambling',          score: 55, level: 'competent',  lastAssessed: '2026-03-16', trend: 'stable',    source: 'arccos' },
  { category: 'Putting < 10ft',      score: 58, level: 'competent',  lastAssessed: '2026-03-16', trend: 'improving', source: 'skillet' },
  { category: 'Distance Control',    score: 65, level: 'competent',  lastAssessed: '2026-03-10', trend: 'improving', source: 'skillet' },
  { category: 'Ball Striking',       score: 71, level: 'proficient', lastAssessed: '2026-03-05', trend: 'improving', source: 'coaching' },
];

export const practiceSessions: PracticeSession[] = [
  { id: 'ps-1', date: '2026-03-19', type: 'drill-work',  duration: 35, drillsCompleted: ['drill-alignment-gate', 'drill-9to3'] },
  { id: 'ps-2', date: '2026-03-17', type: 'range',       duration: 50, drillsCompleted: ['drill-step', 'drill-pump'] },
  { id: 'ps-3', date: '2026-03-15', type: 'putting',     duration: 25, drillsCompleted: [] },
  { id: 'ps-4', date: '2026-03-13', type: 'short-game',  duration: 40, drillsCompleted: ['drill-9to3'] },
  { id: 'ps-5', date: '2026-03-11', type: 'range',       duration: 45, drillsCompleted: ['drill-alignment-gate', 'drill-towel'] },
  { id: 'ps-6', date: '2026-03-08', type: 'drill-work',  duration: 30, drillsCompleted: ['drill-pump', 'drill-step'] },
  { id: 'ps-7', date: '2026-03-05', type: 'range',       duration: 55, drillsCompleted: ['drill-alignment-gate'] },
  { id: 'ps-8', date: '2026-03-03', type: 'putting',     duration: 20, drillsCompleted: [] },
];

export const homework: HomeworkItem[] = [
  {
    id: 'hw-1', drill: 'Alignment Stick Gate', description: 'Path work — 20 balls with 7-iron through the gate. Target: 15+ straight-through.',
    targetReps: 5, completedReps: 3, dueDate: '2026-03-22', assignedBy: 'Austin Reed', priority: 'focus', status: 'active',
  },
  {
    id: 'hw-2', drill: '9-to-3 Pitch Shots', description: '50° wedge, 30-50 yard targets. Focus on distance control, not direction.',
    targetReps: 4, completedReps: 2, dueDate: '2026-03-22', assignedBy: 'Austin Reed', priority: 'focus', status: 'active',
  },
  {
    id: 'hw-3', drill: 'Step Drill', description: 'Weight transfer feel with 7-iron. Slow motion, feel the pressure shift.',
    targetReps: 3, completedReps: 3, dueDate: '2026-03-20', assignedBy: 'Austin Reed', priority: 'maintain', status: 'completed',
  },
  {
    id: 'hw-4', drill: '10-Footer Gate Putting', description: 'Set two tees 1 ball-width apart, 10 feet from hole. 20 putts. Track makes.',
    targetReps: 4, completedReps: 1, dueDate: '2026-03-24', assignedBy: 'Austin Reed', priority: 'explore', status: 'active',
  },
];

export const coachingArc: CoachingArc = {
  phase: 'Iron Precision & Scoring',
  description: 'Building on the path correction from Phase 1. Now focusing on approach shot quality and short game consistency to convert the better ball striking into lower scores.',
  startDate: '2026-02-08',
  targetDate: '2026-04-15',
  progress: 62,
  milestones: [
    { label: 'Eliminate slice pattern', reached: true, date: '2026-01-22' },
    { label: 'Consistent draw shape', reached: true, date: '2026-02-08' },
    { label: 'Iron contact quality > 70%', reached: true, date: '2026-03-05' },
    { label: 'Approach proximity < 35ft avg', reached: false },
    { label: 'Break 85 consistently', reached: false },
  ],
};

export const dataSources: DataSource[] = [
  { id: 'ghin',     name: 'GHIN',      icon: 'trophy',     status: 'connected', lastSync: '2026-03-18T14:00:00Z', dataPoints: 20,  color: '#1E3A5F' },
  { id: 'arccos',   name: 'Arccos',    icon: 'map-pin',    status: 'connected', lastSync: '2026-03-16T19:30:00Z', dataPoints: 142, color: '#E63946' },
  { id: 'trackman', name: 'TrackMan',  icon: 'radar',      status: 'connected', lastSync: '2026-03-05T16:45:00Z', dataPoints: 312, color: '#2E8B57' },
  { id: 'skillet',  name: 'Skillet',   icon: 'target',     status: 'connected', lastSync: '2026-03-10T11:00:00Z', dataPoints: 48,  color: '#7C3AED' },
  { id: 'looper',   name: 'Coaching OS', icon: 'brain',    status: 'connected', lastSync: '2026-03-19T18:30:00Z', dataPoints: 6,   color: '#3A9D78' },
];

export const streak = {
  current: 5,   // consecutive days with practice or play
  longest: 12,
  thisWeek: 4,  // sessions this week
  target: 5,    // weekly target
};

export const nextSession = {
  date: '2026-03-22',
  time: '10:00 AM',
  coach: 'Austin Reed',
  focus: 'Approach shot distance control',
  type: 'Technical',
};

// ─── Derived / Computed ───────────────────────────────────────────

export function getHandicapTrend(): { label: string; value: number }[] {
  return [
    { label: 'Jan', value: 16.8 },
    { label: 'Feb', value: 16.1 },
    { label: 'Mar', value: 15.2 },
  ];
}

export function getScoreTrend(): { label: string; value: number }[] {
  return rounds.slice(0, 6).reverse().map(r => ({
    label: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: r.score,
  }));
}

export function getBiggestOpportunity(): { category: string; sg: number; insight: string } {
  // Approach shots are the biggest leak — this is where the most strokes are lost
  return {
    category: 'Approach Shots',
    sg: strokesGained.approach,
    insight: 'Your approach shots are costing you the most strokes. Improving iron proximity from 42ft to 32ft average would save ~0.5 strokes per round.',
  };
}

export function getPracticeCompliancePercent(): number {
  const activeHw = homework.filter(h => h.status !== 'completed');
  if (activeHw.length === 0) return 100;
  const totalTarget = activeHw.reduce((sum, h) => sum + h.targetReps, 0);
  const totalDone = activeHw.reduce((sum, h) => sum + h.completedReps, 0);
  return Math.round((totalDone / totalTarget) * 100);
}
