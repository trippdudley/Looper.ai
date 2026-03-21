// Unified timeline — every event from every source on one time axis.

export interface TimelineMetric {
  label: string;
  value: string;
  status?: 'good' | 'improving' | 'best' | 'fair' | 'poor' | 'regression' | 'high' | null;
}

export interface TimelineConnection {
  to: string;
  label: string;
}

export interface TimelineEvent {
  id: string;
  date: string;       // ISO date: '2026-03-18'
  time: string | null; // '16:30' or null for all-day
  type: 'lesson' | 'practice' | 'round' | 'score' | 'body' | 'rest' | 'fitting' | 'equipment' | 'milestone';
  source: string;
  title: string;
  metrics: TimelineMetric[];
  narrative: string;
  connection?: TimelineConnection;
  coachNote?: string;
  tags?: string[];
}

export const timelineEvents: TimelineEvent[] = [
  // ─── WEEK 3: Mar 17-20 ───────────────────────────────────
  {
    id: 'ev-0320-practice',
    date: '2026-03-20',
    time: '16:00',
    type: 'practice',
    source: 'garmin',
    title: 'Range session — 7-iron focus',
    metrics: [
      { label: 'Shots', value: '42' },
      { label: 'Dispersion', value: '\u00B15.1 yds', status: 'best' },
      { label: 'Avg Carry', value: '162.4 yds', status: 'good' },
      { label: 'Ball Speed', value: '118.2 mph' },
    ],
    narrative: 'Tightest dispersion recorded. Gate drill transfer is holding after a rest day.',
    connection: { to: 'ev-0319-rest', label: 'Full recovery + rest day \u2192 best practice session recorded' },
    tags: ['7-iron', 'dispersion', 'personal-best'],
  },
  {
    id: 'ev-0320-body',
    date: '2026-03-20',
    time: '07:15',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '52 ms', status: 'good' },
      { label: 'Recovery', value: '71%', status: 'good' },
      { label: 'Sleep', value: '7.4 hrs' },
      { label: 'RHR', value: '58 bpm' },
    ],
    narrative: 'Recovery trending back up after rest day. Good window for quality practice.',
  },
  {
    id: 'ev-0319-rest',
    date: '2026-03-19',
    time: null,
    type: 'rest',
    source: 'looper',
    title: 'Rest day',
    metrics: [],
    narrative: 'Scheduled rest. No golf activity. Recovery prioritized after low-HRV stretch.',
    tags: ['recovery'],
  },
  {
    id: 'ev-0318-round',
    date: '2026-03-18',
    time: '08:30',
    type: 'round',
    source: 'arccos',
    title: 'Pinehurst No. 2 \u2014 18 holes',
    metrics: [
      { label: 'Score', value: '82', status: 'best' },
      { label: 'SG Total', value: '-1.2', status: 'improving' },
      { label: 'SG Approach', value: '-0.8', status: 'improving' },
      { label: 'Fairways', value: '9/14' },
      { label: 'GIR', value: '10/18', status: 'good' },
      { label: 'Putts', value: '31' },
    ],
    narrative: 'Best score in 3 weeks despite low recovery window. Approach game showed improvement \u2014 face-to-path work is translating.',
    connection: { to: 'ev-0318-body', label: 'Low recovery but best score \u2192 coaching intervention holding under fatigue' },
    coachNote: 'Great result under fatigue. The pattern change is becoming automatic. Keep the same drill focus next session.',
    tags: ['personal-best', 'scoring'],
  },
  {
    id: 'ev-0318-body',
    date: '2026-03-18',
    time: '06:45',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '41 ms', status: 'fair' },
      { label: 'Recovery', value: '54%', status: 'fair' },
      { label: 'Sleep', value: '6.1 hrs', status: 'poor' },
    ],
    narrative: 'Below-baseline recovery. Short sleep. Body not optimal but round was still strong.',
  },
  {
    id: 'ev-0318-score',
    date: '2026-03-18',
    time: '14:00',
    type: 'score',
    source: 'ghin',
    title: 'Score posted \u2014 82 at Pinehurst No. 2',
    metrics: [
      { label: 'Differential', value: '8.4' },
      { label: 'Handicap Index', value: '12.4' },
      { label: 'Course Rating', value: '73.6' },
      { label: 'Slope', value: '135' },
    ],
    narrative: 'Differential of 8.4 enters best-8 calculation. Handicap tracking at 12.4, down 1.8 in 90 days.',
  },

  // ─── WEEK 2: Mar 12-16 ───────────────────────────────────
  {
    id: 'ev-0316-practice',
    date: '2026-03-16',
    time: '15:30',
    type: 'practice',
    source: 'garmin',
    title: 'Range session — iron dispersion',
    metrics: [
      { label: 'Shots', value: '38' },
      { label: 'Dispersion', value: '\u00B19.1 yds', status: 'regression' },
      { label: 'Avg Carry', value: '160.8 yds' },
      { label: 'Ball Speed', value: '117.1 mph' },
    ],
    narrative: 'Dispersion widened significantly. Looks like regression but correlates with low recovery.',
    connection: { to: 'ev-0316-body', label: 'Low recovery \u2192 dispersion regression. Not a swing problem.' },
    tags: ['7-iron', 'regression', 'recovery-correlated'],
  },
  {
    id: 'ev-0316-body',
    date: '2026-03-16',
    time: '07:00',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '38 ms', status: 'poor' },
      { label: 'Recovery', value: '42%', status: 'poor' },
      { label: 'Sleep', value: '5.8 hrs', status: 'poor' },
      { label: 'Strain', value: '18.2 (prev day)', status: 'high' },
    ],
    narrative: 'Lowest recovery of the month. High strain yesterday, short sleep. Not a good day for precision work.',
  },
  {
    id: 'ev-0315-body',
    date: '2026-03-15',
    time: '07:10',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '48 ms', status: 'fair' },
      { label: 'Recovery', value: '65%', status: 'fair' },
      { label: 'Sleep', value: '6.8 hrs' },
    ],
    narrative: 'Recovery trending down. Second consecutive day below baseline.',
  },
  {
    id: 'ev-0314-practice',
    date: '2026-03-14',
    time: '16:30',
    type: 'practice',
    source: 'garmin',
    title: 'Range session — gate drill',
    metrics: [
      { label: 'Shots', value: '45' },
      { label: 'Dispersion', value: '\u00B16.2 yds', status: 'improving' },
      { label: 'Avg Carry', value: '161.8 yds' },
      { label: 'On Target', value: '71%', status: 'good' },
    ],
    narrative: 'Dispersion tightening from gate drill prescribed Tuesday. Transfer from lesson is progressing.',
    connection: { to: 'ev-0312-lesson', label: 'Gate drill prescribed Tuesday \u2192 dispersion tightened 18% over 2 sessions' },
    tags: ['7-iron', 'gate-drill', 'improving'],
  },
  {
    id: 'ev-0313-body',
    date: '2026-03-13',
    time: '07:20',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '55 ms', status: 'good' },
      { label: 'Recovery', value: '78%', status: 'good' },
      { label: 'Sleep', value: '7.6 hrs', status: 'good' },
    ],
    narrative: 'Strong recovery. Good window for technical work.',
  },
  {
    id: 'ev-0312-lesson',
    date: '2026-03-12',
    time: '14:00',
    type: 'lesson',
    source: 'coaching',
    title: 'Lesson \u2014 Face-to-path session 3',
    metrics: [
      { label: 'Face-to-Path', value: '2.8\u00B0', status: 'improving' },
      { label: 'Previous', value: '4.1\u00B0' },
      { label: 'Target', value: '<2.0\u00B0' },
      { label: 'Session Duration', value: '55 min' },
    ],
    narrative: 'Face-to-path narrowed from 4.1\u00B0 to 2.8\u00B0. Gate drill introduced \u2014 external focus cue: "flight the ball through the gate posts." Strong response.',
    connection: { to: 'ev-0313-body', label: 'High recovery \u2192 strong lesson response' },
    coachNote: 'Excellent progress. The external cue clicked immediately. Prescribed gate drill for practice: 3 sessions before next lesson, 30 balls each, 7-iron only.',
    tags: ['face-to-path', 'gate-drill', 'phase-3'],
  },
  {
    id: 'ev-0312-body',
    date: '2026-03-12',
    time: '07:00',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '55 ms', status: 'good' },
      { label: 'Recovery', value: '78%', status: 'good' },
      { label: 'Sleep', value: '7.2 hrs' },
    ],
    narrative: 'Good recovery heading into lesson. Optimal for technical work.',
  },

  // ─── WEEK 1: Mar 5-11 ────────────────────────────────────
  {
    id: 'ev-0311-round',
    date: '2026-03-11',
    time: '09:00',
    type: 'round',
    source: 'arccos',
    title: 'Pine Valley \u2014 18 holes',
    metrics: [
      { label: 'Score', value: '87' },
      { label: 'SG Total', value: '-3.8' },
      { label: 'SG Approach', value: '-1.9', status: 'poor' },
      { label: 'Fairways', value: '8/14' },
      { label: 'GIR', value: '7/18', status: 'poor' },
      { label: 'Putts', value: '33' },
    ],
    narrative: 'Approach shots leaked strokes badly. Face-to-path issue showed up under on-course pressure. This is what the coaching plan is targeting.',
    tags: ['scoring'],
  },
  {
    id: 'ev-0311-score',
    date: '2026-03-11',
    time: '15:00',
    type: 'score',
    source: 'ghin',
    title: 'Score posted \u2014 87 at Pine Valley',
    metrics: [
      { label: 'Differential', value: '11.2' },
      { label: 'Course Rating', value: '75.8' },
      { label: 'Slope', value: '153' },
    ],
    narrative: 'Tough course, elevated differential. Doesn\'t enter best-8.',
  },
  {
    id: 'ev-0310-practice',
    date: '2026-03-10',
    time: '10:00',
    type: 'practice',
    source: 'garmin',
    title: 'Pre-round range warm-up',
    metrics: [
      { label: 'Shots', value: '25' },
      { label: 'Dispersion', value: '\u00B17.8 yds' },
      { label: 'Avg Carry', value: '161.2 yds' },
    ],
    narrative: 'Short warm-up session before tomorrow\'s round.',
    tags: ['warm-up'],
  },
  {
    id: 'ev-0309-practice',
    date: '2026-03-09',
    time: '15:00',
    type: 'practice',
    source: 'garmin',
    title: 'Range session \u2014 7-iron baseline',
    metrics: [
      { label: 'Shots', value: '40' },
      { label: 'Dispersion', value: '\u00B18.2 yds' },
      { label: 'Avg Carry', value: '160.4 yds' },
      { label: 'Ball Speed', value: '116.8 mph' },
    ],
    narrative: 'Pre-lesson baseline. Dispersion at \u00B18.2 yds. This is the number to beat after Tuesday\'s lesson.',
    tags: ['baseline', '7-iron'],
  },
  {
    id: 'ev-0308-body',
    date: '2026-03-08',
    time: '07:30',
    type: 'body',
    source: 'whoop',
    title: 'Morning readiness',
    metrics: [
      { label: 'HRV', value: '58 ms', status: 'good' },
      { label: 'Recovery', value: '82%', status: 'good' },
      { label: 'Sleep', value: '8.1 hrs', status: 'good' },
    ],
    narrative: 'Excellent recovery. Best sleep of the week.',
  },
  {
    id: 'ev-0307-rest',
    date: '2026-03-07',
    time: null,
    type: 'rest',
    source: 'looper',
    title: 'Rest day',
    metrics: [],
    narrative: 'No golf activity.',
  },
  {
    id: 'ev-0306-lesson',
    date: '2026-03-06',
    time: '14:00',
    type: 'lesson',
    source: 'coaching',
    title: 'Lesson \u2014 Face-to-path session 2',
    metrics: [
      { label: 'Face-to-Path', value: '4.1\u00B0' },
      { label: 'Previous', value: '5.3\u00B0' },
      { label: 'Target', value: '<2.0\u00B0' },
    ],
    narrative: 'Continued face-to-path work. Narrowing from 5.3\u00B0 baseline. Alignment stick drill is clicking but transfer to on-course not yet tested.',
    coachNote: 'Progress is steady. Moving to gate drill next session for better external focus.',
    tags: ['face-to-path', 'phase-3'],
  },
  {
    id: 'ev-0305-round',
    date: '2026-03-05',
    time: '08:00',
    type: 'round',
    source: 'arccos',
    title: 'TPC Sawgrass \u2014 18 holes',
    metrics: [
      { label: 'Score', value: '85' },
      { label: 'SG Total', value: '-2.4' },
      { label: 'SG Approach', value: '-1.6', status: 'poor' },
      { label: 'GIR', value: '8/18' },
      { label: 'Putts', value: '32' },
    ],
    narrative: 'Approach game continues to bleed strokes. Pattern is clear \u2014 iron accuracy is the bottleneck.',
    tags: ['scoring'],
  },

  // ─── Earlier events ───────────────────────────────────────
  {
    id: 'ev-0301-milestone',
    date: '2026-03-01',
    time: null,
    type: 'milestone',
    source: 'looper',
    title: 'Handicap crossed below 13.0',
    metrics: [
      { label: 'New Index', value: '12.8' },
      { label: '90-Day Change', value: '-1.4', status: 'improving' },
    ],
    narrative: 'First time below 13 since starting with Looper. Improvement accelerating since coaching plan began.',
    tags: ['milestone', 'handicap'],
  },
  {
    id: 'ev-0215-fitting',
    date: '2026-02-15',
    time: '10:00',
    type: 'fitting',
    source: 'coaching',
    title: 'Wedge gap check',
    metrics: [
      { label: '50\u00B0 Carry', value: '108 yds' },
      { label: '54\u00B0 Carry', value: '94 yds' },
      { label: '58\u00B0 Carry', value: '78 yds' },
      { label: 'Gaps', value: '14-16 yds', status: 'good' },
    ],
    narrative: 'Wedge gaps confirmed even after iron fitting. No changes needed.',
    tags: ['wedges', 'gap-check'],
  },
  {
    id: 'ev-0115-equipment',
    date: '2026-01-15',
    time: '10:00',
    type: 'equipment',
    source: 'coaching',
    title: 'Iron fitting complete',
    metrics: [
      { label: 'Irons', value: 'Titleist T200' },
      { label: 'Shaft', value: 'KBS Tour 120S' },
      { label: 'Carry \u0394', value: '+3.2 yds', status: 'improving' },
      { label: 'Dispersion \u0394', value: '-1.8 yds', status: 'improving' },
    ],
    narrative: 'Iron fitting validated through 60-shot session. Expected SG Approach improvement of +0.3-0.5 per round.',
    connection: { to: 'ev-0305-round', label: 'Iron fitting Jan 15 \u2192 approach SG improved from -1.8 to -1.4' },
    tags: ['fitting', 'irons'],
  },
];

// ── Cross-source aggregate patterns ─────────────────────────

export interface CrossSourcePattern {
  id: string;
  title: string;
  insight: string;
  comparisonA: { label: string; value: string };
  comparisonB: { label: string; value: string };
  sources: string[];
  eventCount: number;
}

export const crossSourcePatterns: CrossSourcePattern[] = [
  {
    id: 'pat-recovery-dispersion',
    title: 'Recovery predicts practice quality',
    insight: 'Over your last 14 practice sessions, low recovery days produce 62% wider iron dispersion. Friday\'s regression wasn\'t a swing problem \u2014 it was a recovery problem. Consider skipping practice or reducing intensity on sub-50% recovery days.',
    comparisonA: { label: 'High recovery days', value: '\u00B15.8 yds avg' },
    comparisonB: { label: 'Low recovery days', value: '\u00B19.4 yds avg' },
    sources: ['whoop', 'garmin'],
    eventCount: 14,
  },
  {
    id: 'pat-coaching-transfer',
    title: 'Coaching plan is working',
    insight: 'Since the gate drill was introduced on Mar 12, your 7-iron dispersion has tightened from \u00B18.2 to \u00B15.1 yds across 4 sessions \u2014 a 38% improvement. Face-to-path narrowed from 4.1\u00B0 to 2.8\u00B0. The intervention is transferring to practice and on-course play.',
    comparisonA: { label: 'Pre-intervention', value: '\u00B18.2 yds' },
    comparisonB: { label: 'Post-intervention', value: '\u00B15.1 yds' },
    sources: ['coaching', 'garmin', 'arccos'],
    eventCount: 8,
  },
  {
    id: 'pat-scoring-approach',
    title: 'Approach shots are your scoring bottleneck',
    insight: 'Over 10 rounds, approach shots are costing you 1.4 SG/round vs. 10-handicap benchmark. That\'s 70% of the gap between your current handicap and single digits. The face-to-path coaching plan directly targets this.',
    comparisonA: { label: 'SG Approach', value: '-1.4' },
    comparisonB: { label: 'All other categories', value: '+0.2 combined' },
    sources: ['arccos', 'ghin', 'coaching'],
    eventCount: 10,
  },
];

// ── Practice plan (for Practice Mode tab) ───────────────────

export interface PracticeBlock {
  name: string;
  club: string;
  shots: number;
  focus: string;
  cue: string;
  cueType: string; // 'EXTERNAL'
  completed: boolean;
}

export const todaysPracticePlan = {
  title: 'Gate Drill — Iron Accuracy',
  source: 'Prescribed by Coach Thompson',
  duration: '45 min',
  blocks: [
    {
      name: 'Warm-Up',
      club: 'PW',
      shots: 10,
      focus: 'Easy tempo, find the center of the face. No targets yet.',
      cue: 'Feel the club brush the grass at the bottom of the arc.',
      cueType: 'EXTERNAL',
      completed: true,
    },
    {
      name: 'Primary Drill — Gate',
      club: '7-iron',
      shots: 30,
      focus: 'Alignment sticks set as gate 8 feet in front. Ball must start through the gate.',
      cue: 'Flight the ball through the gate posts.',
      cueType: 'EXTERNAL',
      completed: false,
    },
    {
      name: 'Transfer — Random Club',
      club: 'Varies',
      shots: 15,
      focus: 'Alternate between 6i, 8i, PW. Pick a new target each shot. No block practice.',
      cue: 'See the target, trust the swing.',
      cueType: 'EXTERNAL',
      completed: false,
    },
    {
      name: 'Cool-Down',
      club: 'SW',
      shots: 5,
      focus: 'Easy pitch shots. End on a positive note.',
      cue: 'Land it on the towel.',
      cueType: 'EXTERNAL',
      completed: false,
    },
  ] as PracticeBlock[],
};

// ── Chat responses (hardcoded for MVP) ──────────────────────

export const chatResponses: Record<string, string> = {
  'Why was my last round worse than usual?': `Your round at Pine Valley (87) wasn't actually worse when you account for course difficulty — it's rated 75.8/153, significantly harder than your typical courses. Your differential was 11.2, which is only 2.8 strokes above your average differential.

That said, approach shots leaked 1.9 SG that day. Your Garmin data from the practice session before showed dispersion at \u00B17.8 yds — wider than your recent post-lesson numbers (\u00B16.2). The face-to-path work hadn't fully transferred to on-course play yet.

The good news: your Pinehurst round 7 days later (82, SG Approach -0.8) shows that transfer is happening. The coaching plan is working — it just took another week of gate drill practice to stick under pressure.`,

  'Compare my driving this month vs. last month': `Your driving has been quietly consistent — and that's good news because it means your scoring bottleneck isn't off the tee.

**This month (Mar 1-20):**
- SG Driving: +0.3 vs. 10-handicap
- Fairways: 59% (avg 8.5/14)
- Avg drive: 248 yds carry

**Last month (Feb):**
- SG Driving: +0.2 vs. 10-handicap
- Fairways: 57%
- Avg drive: 245 yds carry

Small improvement, likely from the iron fitting — your T200s at the correct length improved your setup confidence. But the real story is: driving is your strength. You're gaining 0.3 strokes per round off the tee. The 1.4 strokes you're losing on approach is where the handicap drops live.`,

  'What should I practice before my next lesson?': `Your next lesson with Coach Thompson is Thursday at 2:00 PM. Based on the coaching plan and your recent data, here's what to do:

**Priority: One more gate drill session (30 min)**
Your dispersion tightened from \u00B18.2 to \u00B15.1 yds over 4 sessions. One more session before the lesson gives Coach Thompson clean data on whether the pattern is stable.

**Specifics:**
- 7-iron only, 30 balls through the gate
- Track dispersion on Garmin — target \u00B15.0 yds or tighter
- If you're hitting it well at 20 balls, stop. Quality over volume.

**Recovery note:** Your WHOOP data shows recovery is back to 71% today. Good window for precision work. But check tomorrow morning — if recovery drops below 55%, consider a rest day instead and brief Coach Thompson.

The gate drill is working. Don't add anything new before the lesson.`,

  'How has my iron accuracy changed since the fitting?': `Since your iron fitting on Jan 15 (Titleist T200 / KBS Tour 120S), your approach numbers have improved across the board:

**Pre-fitting (Dec-Jan, 6 rounds):**
- SG Approach: -1.8
- GIR: 38% (6.8/18)
- 7-iron dispersion: \u00B110.1 yds
- Avg proximity 125-150: 34 ft

**Post-fitting (Feb-Mar, 10 rounds):**
- SG Approach: -1.4 (\u25B2 +0.4 SG)
- GIR: 47% (8.5/18)
- 7-iron dispersion: \u00B16.8 yds (with coaching)
- Avg proximity 125-150: 28 ft

The fitting alone contributed an estimated +0.2 SG — the new shafts tightened carry variance by 3.2 yds. The additional +0.2 SG is coming from the coaching plan (face-to-path work). Together, you've recovered 0.4 of the 1.8 strokes you were losing.

At current trajectory, reaching -0.8 SG Approach (10-handicap benchmark) is realistic within 2-3 months if the coaching plan continues.`,
};
