// Lesson records — the player-facing view of coach session briefs.
// Each lesson connects to the coach's SessionReview and carries
// the post-session brief: what was worked on, what changed, what to practice next.

export interface LessonMetric {
  label: string;
  before: string;
  after: string;
  unit: string;
  improved: boolean;
}

export interface LessonDrill {
  name: string;
  focus: string;
  reps: string;
  cue: string;
  completed: boolean;
}

export interface LessonRecord {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  duration: string;
  type: 'full-swing' | 'short-game' | 'playing-lesson' | 'assessment';
  focus: string;
  club: string;
  summary: string;
  keyTakeaway: string;
  improvementScore: number; // 0-100
  metrics: LessonMetric[];
  drills: LessonDrill[];
  coachNotes: string;
  homework: string[];
  videoClipCount: number;
  nextSessionPreview: string;
}

export const coachingArc = {
  planTitle: 'Iron accuracy — face-to-path consistency',
  coachName: 'M. Thompson',
  totalPhases: 6,
  currentPhase: 3,
  phaseLabel: 'Gate drill transfer',
  totalSessions: 12,
  completedSessions: 8,
  nextSession: 'Thu, Mar 22 at 2:00 PM',
  phases: [
    { number: 1, label: 'Assessment', status: 'completed' as const, sessions: 1 },
    { number: 2, label: 'Alignment drill foundation', status: 'completed' as const, sessions: 3 },
    { number: 3, label: 'Gate drill transfer', status: 'active' as const, sessions: 4 },
    { number: 4, label: 'On-course integration', status: 'upcoming' as const, sessions: 2 },
    { number: 5, label: 'Variable practice', status: 'upcoming' as const, sessions: 1 },
    { number: 6, label: 'Retention test', status: 'upcoming' as const, sessions: 1 },
  ],
};

export const lessons: LessonRecord[] = [
  {
    id: 'lesson-8',
    sessionNumber: 8,
    date: '2026-03-12',
    time: '2:00 PM',
    duration: '55 min',
    type: 'full-swing',
    focus: 'Gate drill introduction — face-to-path narrowing',
    club: '7-iron',
    summary: 'Introduced gate drill with alignment sticks set 8 feet in front. External focus cue clicked immediately. Face-to-path narrowed from 4.1 to 2.8 degrees in-session. Strong response — best single-session improvement in the arc so far.',
    keyTakeaway: 'The external cue "flight the ball through the gate posts" produced faster change than the alignment stick drill from sessions 5-7. The pattern is starting to feel automatic.',
    improvementScore: 88,
    metrics: [
      { label: 'Face-to-Path', before: '4.1\u00B0', after: '2.8\u00B0', unit: 'deg', improved: true },
      { label: 'Dispersion', before: '\u00B18.2 yds', after: '\u00B16.2 yds', unit: 'yds', improved: true },
      { label: 'Ball Speed', before: '116.8 mph', after: '117.4 mph', unit: 'mph', improved: true },
      { label: 'Launch Angle', before: '18.2\u00B0', after: '17.8\u00B0', unit: 'deg', improved: true },
    ],
    drills: [
      {
        name: 'Gate Drill',
        focus: 'Face-to-path consistency',
        reps: '30 balls, 7-iron only',
        cue: 'Flight the ball through the gate posts.',
        completed: true,
      },
    ],
    coachNotes: 'Excellent progress. The external cue clicked immediately. Prescribed gate drill for practice: 3 sessions before next lesson, 30 balls each, 7-iron only. Do not add other drills — isolate this pattern.',
    homework: [
      'Gate drill: 3 sessions before next lesson',
      '30 balls per session, 7-iron only',
      'Track dispersion on Garmin R10',
      'Target: \u00B16.0 yds or tighter',
      'If hitting well at 20 balls, stop — quality over volume',
    ],
    videoClipCount: 3,
    nextSessionPreview: 'Assess gate drill retention. If dispersion stable at \u00B16 yds, begin transfer to 6-iron and 8-iron.',
  },
  {
    id: 'lesson-7',
    sessionNumber: 7,
    date: '2026-03-06',
    time: '2:00 PM',
    duration: '50 min',
    type: 'full-swing',
    focus: 'Alignment stick drill — continued face-to-path work',
    club: '7-iron',
    summary: 'Third session with alignment stick drill. Face-to-path narrowed from 5.3 to 4.1 degrees. Progress is steady but rate of change is slowing. Moving to gate drill next session for better external focus.',
    keyTakeaway: 'Alignment stick drill is producing diminishing returns. The internal focus ("keep hands inside") is limiting. Need to shift to external cue.',
    improvementScore: 72,
    metrics: [
      { label: 'Face-to-Path', before: '5.3\u00B0', after: '4.1\u00B0', unit: 'deg', improved: true },
      { label: 'Dispersion', before: '\u00B19.4 yds', after: '\u00B18.8 yds', unit: 'yds', improved: true },
      { label: 'Ball Speed', before: '116.2 mph', after: '116.8 mph', unit: 'mph', improved: true },
    ],
    drills: [
      {
        name: 'Alignment Stick Path Drill',
        focus: 'Club path correction',
        reps: '40 balls, 7-iron',
        cue: 'Keep the club inside the stick on the downswing.',
        completed: true,
      },
    ],
    coachNotes: 'Progress is steady. Moving to gate drill next session for better external focus. The internal cue is producing cognitive overload — player is thinking about hands rather than ball flight.',
    homework: [
      'Continue alignment stick drill: 2 sessions',
      '40 balls per session, 7-iron',
      'Focus on tempo, not mechanics',
    ],
    videoClipCount: 2,
    nextSessionPreview: 'Introduce gate drill with external focus cue. Expect faster improvement rate.',
  },
  {
    id: 'lesson-6',
    sessionNumber: 6,
    date: '2026-02-27',
    time: '2:00 PM',
    duration: '50 min',
    type: 'full-swing',
    focus: 'Alignment stick drill — face-to-path correction',
    club: '7-iron',
    summary: 'Second alignment stick session. Player is finding the feel but still reverting under pressure. Face-to-path at 5.3 degrees, down from 6.1 at assessment.',
    keyTakeaway: 'Pattern is changing but not yet automatic. Need more reps before adding difficulty.',
    improvementScore: 65,
    metrics: [
      { label: 'Face-to-Path', before: '5.8\u00B0', after: '5.3\u00B0', unit: 'deg', improved: true },
      { label: 'Dispersion', before: '\u00B110.2 yds', after: '\u00B19.4 yds', unit: 'yds', improved: true },
    ],
    drills: [
      {
        name: 'Alignment Stick Path Drill',
        focus: 'Club path correction',
        reps: '35 balls, 7-iron',
        cue: 'Keep the club inside the stick on the downswing.',
        completed: true,
      },
    ],
    coachNotes: 'Steady progress. Pattern changing but not automatic yet. Added a second session per week of alignment stick work.',
    homework: [
      'Alignment stick drill: 3 sessions this week',
      '35 balls, 7-iron only',
    ],
    videoClipCount: 2,
    nextSessionPreview: 'Third alignment stick session. If progress stalls, pivot to external focus drill.',
  },
  {
    id: 'lesson-5',
    sessionNumber: 5,
    date: '2026-02-20',
    time: '2:00 PM',
    duration: '45 min',
    type: 'full-swing',
    focus: 'Alignment stick drill — initial path correction',
    club: '7-iron',
    summary: 'First session with alignment stick drill targeting club path. Player responded well to the constraint. Face-to-path improved from 6.1 to 5.8 in session.',
    keyTakeaway: 'Alignment stick provides useful feedback but the cue is internal. Watch for overthinking.',
    improvementScore: 60,
    metrics: [
      { label: 'Face-to-Path', before: '6.1\u00B0', after: '5.8\u00B0', unit: 'deg', improved: true },
      { label: 'Dispersion', before: '\u00B110.8 yds', after: '\u00B110.2 yds', unit: 'yds', improved: true },
    ],
    drills: [
      {
        name: 'Alignment Stick Path Drill',
        focus: 'Club path correction',
        reps: '30 balls, 7-iron',
        cue: 'Feel the club track inside the alignment stick.',
        completed: true,
      },
    ],
    coachNotes: 'Good first session with the drill. Player engaged but I can see cognitive load building. Keep sessions short.',
    homework: [
      'Alignment stick drill: 2 sessions',
      '30 balls, 7-iron',
    ],
    videoClipCount: 1,
    nextSessionPreview: 'Continue alignment stick. Increase reps if player is comfortable.',
  },
  {
    id: 'lesson-4',
    sessionNumber: 4,
    date: '2026-02-13',
    time: '2:00 PM',
    duration: '55 min',
    type: 'full-swing',
    focus: 'Diagnosis review — confirming face-to-path as limiting factor',
    club: '7-iron / 6-iron',
    summary: 'Reviewed assessment data with player. Confirmed face-to-path inconsistency as the primary scoring leak. SG Approach at -1.8 is the bottleneck. Built the case for the coaching plan and set expectations for the arc.',
    keyTakeaway: 'Player understands the diagnosis and is bought into the plan. Important for compliance.',
    improvementScore: 55,
    metrics: [
      { label: 'Face-to-Path', before: '6.1\u00B0', after: '6.1\u00B0', unit: 'deg', improved: false },
      { label: 'SG Approach', before: '-1.8', after: '-1.8', unit: 'sg', improved: false },
    ],
    drills: [],
    coachNotes: 'No intervention today — this was a diagnosis review. Player understands the plan. We start alignment stick work next session. Key: patient, systematic, no rushing.',
    homework: [
      'Review the video clips from assessment',
      'Play one round before next lesson — observe iron dispersion without trying to fix it',
    ],
    videoClipCount: 4,
    nextSessionPreview: 'Begin alignment stick path drill. 7-iron only.',
  },
  {
    id: 'lesson-3',
    sessionNumber: 3,
    date: '2026-02-06',
    time: '2:00 PM',
    duration: '60 min',
    type: 'short-game',
    focus: 'Wedge distance control — gap check',
    club: '50/54/58',
    summary: 'Short game session to baseline wedge distances after iron fitting. Gaps are even (14-16 yds between wedges). No changes needed. Player\'s short game is a relative strength.',
    keyTakeaway: 'Wedge gaps are solid. Short game is not the scoring leak — confirmed approach shots are the priority.',
    improvementScore: 70,
    metrics: [
      { label: '50\u00B0 Carry', before: '—', after: '108 yds', unit: 'yds', improved: false },
      { label: '54\u00B0 Carry', before: '—', after: '94 yds', unit: 'yds', improved: false },
      { label: '58\u00B0 Carry', before: '—', after: '78 yds', unit: 'yds', improved: false },
      { label: 'Gap Consistency', before: '—', after: '14-16 yds', unit: 'yds', improved: false },
    ],
    drills: [
      {
        name: '9-to-3 Pitch Shots',
        focus: 'Distance control',
        reps: '20 balls per wedge',
        cue: 'Land it on the towel.',
        completed: true,
      },
    ],
    coachNotes: 'Wedge gaps confirmed. Short game is a strength — don\'t fix what isn\'t broken. Full focus on iron accuracy from here.',
    homework: [
      'No specific short game homework',
      'Maintain current wedge routine',
    ],
    videoClipCount: 0,
    nextSessionPreview: 'Diagnosis review — present the full-swing assessment data and coaching plan.',
  },
  {
    id: 'lesson-2',
    sessionNumber: 2,
    date: '2026-01-30',
    time: '2:00 PM',
    duration: '60 min',
    type: 'assessment',
    focus: 'Full-swing assessment — all clubs',
    club: 'Full bag',
    summary: 'Comprehensive assessment across the bag. 60 shots logged on Trackman. Key finding: face-to-path inconsistency averaging 6.1 degrees with 7-iron, producing a pull-draw pattern with high dispersion.',
    keyTakeaway: 'Face-to-path is the primary limiting factor. Approach shots are costing 1.8 SG/round. This is the coaching plan target.',
    improvementScore: 50,
    metrics: [
      { label: 'Face-to-Path (7i)', before: '—', after: '6.1\u00B0', unit: 'deg', improved: false },
      { label: 'Dispersion (7i)', before: '—', after: '\u00B110.8 yds', unit: 'yds', improved: false },
      { label: 'Ball Speed (7i)', before: '—', after: '115.6 mph', unit: 'mph', improved: false },
      { label: 'SG Approach', before: '—', after: '-1.8', unit: 'sg', improved: false },
    ],
    drills: [],
    coachNotes: 'Assessment complete. Face-to-path at 6.1 degrees is the clear culprit. Building the coaching plan around this — estimate 6 phases, 12 sessions to get below 2.0 degrees.',
    homework: [
      'No changes yet — play your normal game',
      'Post scores to GHIN',
    ],
    videoClipCount: 6,
    nextSessionPreview: 'Short game gap check — confirm wedge distances post-fitting before we focus entirely on full swing.',
  },
  {
    id: 'lesson-1',
    sessionNumber: 1,
    date: '2026-01-15',
    time: '10:00 AM',
    duration: '90 min',
    type: 'assessment',
    focus: 'Initial assessment + iron fitting',
    club: 'Full bag',
    summary: 'Combined initial assessment with iron fitting. Player transitioned from Titleist AP3 to T200 with KBS Tour 120S shafts. New setup tightened carry variance by 3.2 yards. Assessment identified face-to-path inconsistency as primary scoring leak.',
    keyTakeaway: 'Equipment was part of the problem — old shafts were too light, producing inconsistent launch. New setup is a better platform. Now we work on the swing.',
    improvementScore: 75,
    metrics: [
      { label: 'Carry Variance', before: '\u00B18.4 yds', after: '\u00B15.2 yds', unit: 'yds', improved: true },
      { label: 'Ball Speed (7i)', before: '114.2 mph', after: '115.6 mph', unit: 'mph', improved: true },
      { label: 'Spin Rate (7i)', before: '6,800 rpm', after: '6,200 rpm', unit: 'rpm', improved: true },
    ],
    drills: [],
    coachNotes: 'Good first session. Player is motivated and coachable. Equipment change gives us a better baseline. Assessment shows face-to-path is the key issue — will present the full coaching plan after short game check.',
    homework: [
      'Play 2-3 rounds with new irons',
      'Get comfortable with new distances',
      'Post all scores to GHIN',
    ],
    videoClipCount: 4,
    nextSessionPreview: 'Full-swing assessment — baseline all clubs on Trackman with new equipment.',
  },
];
