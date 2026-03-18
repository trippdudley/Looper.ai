// ─── Types ──────────────────────────────────────────────────────

export interface CoachSessionSwing {
  id: string;
  swingNumber: number;
  timestamp: string;       // mm:ss within session
  club: string;
  intentTag: string;       // "Full Swing" | "Punch" | "Baseline" etc.
  qualityScore: number;    // 0-100

  // Ball data
  ballSpeed: number;       // mph
  launchAngle: number;     // degrees
  spinRate: number;        // rpm
  spinAxis: number;        // degrees (negative = draw)
  carry: number;           // yards
  total: number;           // yards

  // Club data
  clubSpeed: number;       // mph
  attackAngle: number;     // degrees (negative = down)
  clubPath: number;        // degrees (positive = in-to-out)
  faceAngle: number;       // degrees (positive = open)
  faceToPath: number;      // degrees
  dynamicLoft: number;     // degrees

  // Impact
  impactLocation: string;  // e.g. "2mm toe, 1mm high"
  smashFactor: number;
}

export interface CoachSessionTranscript {
  swingNumber: number;
  timestamp: string;       // mm:ss
  text: string;
}

export interface CoachSessionAIInsight {
  swingNumber: number;
  observation: string;
  connection: string;
  confidence: 'high' | 'moderate' | 'low';
}

export interface PracticePlanItem {
  name: string;
  cue: string;
  cueType: 'external' | 'internal';
  reps: string;
  successCriteria: string;
}

export interface CoachSessionData {
  sessionId: string;
  playerName: string;
  coachName: string;
  date: string;
  duration: string;        // "32 min"
  club: string;
  totalSwings: number;

  swings: CoachSessionSwing[];
  transcripts: CoachSessionTranscript[];
  insights: CoachSessionAIInsight[];

  // Summary content
  summary: {
    headlineMetric: string;
    lessonSummary: string[];       // paragraphs
    practicePlan: PracticePlanItem[];
    baselineAvg: Record<string, number>;
    postCueAvg: Record<string, number>;
  };
}

// ─── Quality scoring helper ─────────────────────────────────────

export function getQualityLevel(score: number): 'good' | 'moderate' | 'poor' {
  if (score >= 70) return 'good';
  if (score >= 45) return 'moderate';
  return 'poor';
}

export function getQualityColor(score: number): { bg: string; text: string; border: string } {
  const level = getQualityLevel(score);
  if (level === 'good') return { bg: '#ECFDF5', text: '#0FA87A', border: '#0FA87A' };
  if (level === 'moderate') return { bg: '#FFFBEB', text: '#D4980B', border: '#D4980B' };
  return { bg: '#FEF2F2', text: '#C93B3B', border: '#C93B3B' };
}

// ─── Mock Data ──────────────────────────────────────────────────

export const coachSessionData: CoachSessionData = {
  sessionId: 'cs-2026-0312-01',
  playerName: 'Jake Morrison',
  coachName: 'Mike Chen',
  date: 'March 12, 2026',
  duration: '32 min',
  club: '7-Iron',
  totalSwings: 18,

  swings: [
    // ── Baseline swings 1-5: steep attack, inconsistent face-to-path ──
    {
      id: 'sw-01', swingNumber: 1, timestamp: '1:12', club: '7-Iron',
      intentTag: 'Baseline', qualityScore: 42,
      ballSpeed: 126.1, launchAngle: 18.2, spinRate: 7180, spinAxis: -4.2,
      carry: 156, total: 164,
      clubSpeed: 88.4, attackAngle: -4.8, clubPath: 1.2, faceAngle: -2.9,
      faceToPath: -4.1, dynamicLoft: 19.8,
      impactLocation: '4mm toe, 2mm low', smashFactor: 1.43,
    },
    {
      id: 'sw-02', swingNumber: 2, timestamp: '2:05', club: '7-Iron',
      intentTag: 'Baseline', qualityScore: 48,
      ballSpeed: 128.3, launchAngle: 17.6, spinRate: 6920, spinAxis: -3.1,
      carry: 159, total: 168,
      clubSpeed: 89.1, attackAngle: -4.5, clubPath: 0.8, faceAngle: -2.1,
      faceToPath: -2.9, dynamicLoft: 18.9,
      impactLocation: '2mm toe, 1mm low', smashFactor: 1.44,
    },
    {
      id: 'sw-03', swingNumber: 3, timestamp: '3:18', club: '7-Iron',
      intentTag: 'Baseline', qualityScore: 38,
      ballSpeed: 125.7, launchAngle: 19.4, spinRate: 7340, spinAxis: -5.8,
      carry: 153, total: 161,
      clubSpeed: 87.9, attackAngle: -5.2, clubPath: 0.4, faceAngle: -3.8,
      faceToPath: -4.2, dynamicLoft: 20.6,
      impactLocation: '5mm toe, 3mm low', smashFactor: 1.43,
    },
    {
      id: 'sw-04', swingNumber: 4, timestamp: '4:42', club: '7-Iron',
      intentTag: 'Baseline', qualityScore: 52,
      ballSpeed: 129.6, launchAngle: 17.1, spinRate: 6680, spinAxis: -2.4,
      carry: 161, total: 170,
      clubSpeed: 89.8, attackAngle: -4.1, clubPath: 1.6, faceAngle: -1.2,
      faceToPath: -2.8, dynamicLoft: 18.2,
      impactLocation: '1mm heel, center', smashFactor: 1.44,
    },
    {
      id: 'sw-05', swingNumber: 5, timestamp: '5:55', club: '7-Iron',
      intentTag: 'Baseline', qualityScore: 35,
      ballSpeed: 124.8, launchAngle: 20.1, spinRate: 7420, spinAxis: -6.1,
      carry: 151, total: 158,
      clubSpeed: 87.2, attackAngle: -5.4, clubPath: -0.2, faceAngle: -4.1,
      faceToPath: -3.9, dynamicLoft: 21.3,
      impactLocation: '6mm toe, 4mm low', smashFactor: 1.43,
    },

    // ── Post-cue swings 6-12: gradual improvement ──
    {
      id: 'sw-06', swingNumber: 6, timestamp: '8:10', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 55,
      ballSpeed: 128.9, launchAngle: 17.8, spinRate: 6840, spinAxis: -2.8,
      carry: 160, total: 169,
      clubSpeed: 89.3, attackAngle: -3.6, clubPath: 1.4, faceAngle: -1.4,
      faceToPath: -2.8, dynamicLoft: 18.6,
      impactLocation: '2mm toe, 1mm low', smashFactor: 1.44,
    },
    {
      id: 'sw-07', swingNumber: 7, timestamp: '9:28', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 58,
      ballSpeed: 129.4, launchAngle: 17.2, spinRate: 6710, spinAxis: -2.2,
      carry: 162, total: 171,
      clubSpeed: 89.6, attackAngle: -3.2, clubPath: 1.8, faceAngle: -0.8,
      faceToPath: -2.6, dynamicLoft: 18.1,
      impactLocation: '1mm toe, center', smashFactor: 1.44,
    },
    {
      id: 'sw-08', swingNumber: 8, timestamp: '11:05', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 68,
      ballSpeed: 131.2, launchAngle: 16.8, spinRate: 6520, spinAxis: -1.4,
      carry: 165, total: 175,
      clubSpeed: 90.4, attackAngle: -2.6, clubPath: 2.1, faceAngle: 0.2,
      faceToPath: -1.9, dynamicLoft: 17.4,
      impactLocation: '1mm toe, 1mm high', smashFactor: 1.45,
    },
    {
      id: 'sw-09', swingNumber: 9, timestamp: '13:22', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 45,
      ballSpeed: 126.8, launchAngle: 18.9, spinRate: 7050, spinAxis: -4.6,
      carry: 155, total: 163,
      clubSpeed: 88.2, attackAngle: -4.2, clubPath: 0.2, faceAngle: -3.2,
      faceToPath: -3.4, dynamicLoft: 19.4,
      impactLocation: '4mm toe, 2mm low', smashFactor: 1.44,
    },
    {
      id: 'sw-10', swingNumber: 10, timestamp: '15:40', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 72,
      ballSpeed: 131.8, launchAngle: 16.5, spinRate: 6380, spinAxis: -1.1,
      carry: 166, total: 176,
      clubSpeed: 90.8, attackAngle: -2.2, clubPath: 2.4, faceAngle: 0.6,
      faceToPath: -1.8, dynamicLoft: 17.0,
      impactLocation: 'center, 1mm high', smashFactor: 1.45,
    },
    {
      id: 'sw-11', swingNumber: 11, timestamp: '17:15', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 65,
      ballSpeed: 130.4, launchAngle: 17.0, spinRate: 6580, spinAxis: -1.8,
      carry: 164, total: 173,
      clubSpeed: 90.1, attackAngle: -2.8, clubPath: 1.9, faceAngle: -0.4,
      faceToPath: -2.3, dynamicLoft: 17.8,
      impactLocation: '1mm heel, center', smashFactor: 1.45,
    },
    {
      id: 'sw-12', swingNumber: 12, timestamp: '19:30', club: '7-Iron',
      intentTag: 'Post-Cue', qualityScore: 74,
      ballSpeed: 132.1, launchAngle: 16.4, spinRate: 6320, spinAxis: -0.8,
      carry: 167, total: 177,
      clubSpeed: 91.0, attackAngle: -2.0, clubPath: 2.2, faceAngle: 0.4,
      faceToPath: -1.8, dynamicLoft: 16.8,
      impactLocation: 'center, center', smashFactor: 1.45,
    },

    // ── Refined cue swings 13-18: validation ──
    {
      id: 'sw-13', swingNumber: 13, timestamp: '22:05', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 78,
      ballSpeed: 132.6, launchAngle: 16.2, spinRate: 6240, spinAxis: -0.6,
      carry: 168, total: 178,
      clubSpeed: 91.2, attackAngle: -1.8, clubPath: 2.0, faceAngle: 0.6,
      faceToPath: -1.4, dynamicLoft: 16.6,
      impactLocation: '1mm toe, center', smashFactor: 1.45,
    },
    {
      id: 'sw-14', swingNumber: 14, timestamp: '23:48', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 82,
      ballSpeed: 133.1, launchAngle: 16.0, spinRate: 6180, spinAxis: -0.4,
      carry: 170, total: 180,
      clubSpeed: 91.5, attackAngle: -1.6, clubPath: 2.2, faceAngle: 0.8,
      faceToPath: -1.4, dynamicLoft: 16.2,
      impactLocation: 'center, 1mm high', smashFactor: 1.45,
    },
    {
      id: 'sw-15', swingNumber: 15, timestamp: '25:30', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 70,
      ballSpeed: 130.8, launchAngle: 17.1, spinRate: 6540, spinAxis: -2.0,
      carry: 165, total: 174,
      clubSpeed: 90.2, attackAngle: -2.4, clubPath: 1.6, faceAngle: -0.6,
      faceToPath: -2.2, dynamicLoft: 17.6,
      impactLocation: '2mm toe, 1mm low', smashFactor: 1.45,
    },
    {
      id: 'sw-16', swingNumber: 16, timestamp: '27:10', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 85,
      ballSpeed: 133.4, launchAngle: 15.8, spinRate: 6100, spinAxis: -0.2,
      carry: 171, total: 181,
      clubSpeed: 91.8, attackAngle: -1.4, clubPath: 2.4, faceAngle: 1.0,
      faceToPath: -1.4, dynamicLoft: 15.9,
      impactLocation: 'center, center', smashFactor: 1.45,
    },
    {
      id: 'sw-17', swingNumber: 17, timestamp: '29:25', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 80,
      ballSpeed: 132.8, launchAngle: 16.1, spinRate: 6210, spinAxis: -0.5,
      carry: 169, total: 179,
      clubSpeed: 91.4, attackAngle: -1.7, clubPath: 2.1, faceAngle: 0.7,
      faceToPath: -1.4, dynamicLoft: 16.4,
      impactLocation: '1mm heel, center', smashFactor: 1.45,
    },
    {
      id: 'sw-18', swingNumber: 18, timestamp: '31:15', club: '7-Iron',
      intentTag: 'Validation', qualityScore: 88,
      ballSpeed: 133.6, launchAngle: 15.6, spinRate: 6060, spinAxis: -0.1,
      carry: 172, total: 183,
      clubSpeed: 92.0, attackAngle: -1.2, clubPath: 2.6, faceAngle: 1.2,
      faceToPath: -1.4, dynamicLoft: 15.6,
      impactLocation: 'center, center', smashFactor: 1.45,
    },
  ],

  transcripts: [
    {
      swingNumber: 1, timestamp: '1:30',
      text: "Alright Jake, let's get a few baseline swings in. Just your normal 7-iron, don't think about anything specific — I want to see your default pattern.",
    },
    {
      swingNumber: 3, timestamp: '3:42',
      text: "See that divot? It's pointing left and it's deep. You're coming in steep and from the outside. That's where the toe contact and the high spin are coming from.",
    },
    {
      swingNumber: 5, timestamp: '6:15',
      text: "Good news is you're consistent — consistently steep. We know exactly what to fix. Your path numbers are actually not bad, it's the angle of attack that's killing your strike.",
    },
    {
      swingNumber: 6, timestamp: '7:45',
      text: "Here's what I want you to try. Instead of thinking about your swing plane or your hands, I want you to feel like you're brushing the grass forward through the ball. Not down at it — forward. Like you're painting a stripe on the turf past the ball.",
    },
    {
      swingNumber: 8, timestamp: '11:30',
      text: "That's it. Did you feel the difference? The club is staying lower through the zone. Look at that divot — shallow, forward. That's what we're after.",
    },
    {
      swingNumber: 9, timestamp: '13:50',
      text: "Old pattern crept back there. That's normal — the body defaults to what it knows under pressure. Reset: think grass forward, not ball down.",
    },
    {
      swingNumber: 12, timestamp: '19:55',
      text: "Three in a row with an attack angle under minus-two. You're owning the new feel. The carry numbers don't lie — twelve extra yards just from cleaning up the strike.",
    },
    {
      swingNumber: 13, timestamp: '22:30',
      text: "Let me add one thing to the cue. Same grass-forward feel, but now I want you to feel like the handle finishes low and left. That'll keep the loft from flipping at impact.",
    },
    {
      swingNumber: 16, timestamp: '27:35',
      text: "That might be the best 7-iron you've hit in here. Dead center, attack angle minus-one-four, face-to-path locked in. This is validation — the cue is working.",
    },
    {
      swingNumber: 18, timestamp: '31:40',
      text: "Perfect way to finish. You gained sixteen yards of carry from baseline to validation. The pattern is real. Your homework: fifty balls a day with the grass-forward feel. Don't think about anything else.",
    },
  ],

  insights: [
    {
      swingNumber: 3,
      observation: 'Baseline attack angle averaging -4.8° with face-to-path variance of ±3.6° — significantly steeper and more inconsistent than the 12-handicap benchmark (-3.0° / ±2.0°).',
      connection: 'The steep angle of attack correlates directly with the toe-low impact pattern and elevated spin rates (7,100+ rpm), reducing carry by an estimated 12-15 yards.',
      confidence: 'high',
    },
    {
      swingNumber: 6,
      observation: 'First swing with external focus cue shows attack angle improvement from -5.4° (previous) to -3.6° — a 33% reduction in steepness on the first attempt.',
      connection: 'External cue "brush the grass forward" immediately changed the low point, consistent with motor learning research on external focus of attention (Wulf, 2013).',
      confidence: 'moderate',
    },
    {
      swingNumber: 8,
      observation: 'Attack angle of -2.6° with face-to-path tightened to -1.9°. Smash factor improved from 1.43 to 1.45. Carry jumped to 165 yds — a +12 yard gain from baseline average.',
      connection: 'This swing marks the first clear evidence that the intervention is producing measurable change across multiple metrics simultaneously, not just the target variable.',
      confidence: 'high',
    },
    {
      swingNumber: 9,
      observation: 'Regression to baseline pattern: attack angle -4.2°, face-to-path -3.4°, carry dropped to 155 yds. This is swing 9 of 18, roughly halfway through the session.',
      connection: 'Motor learning theory predicts temporary regression under cognitive load. The pattern returned when the player likely shifted from external (grass) to internal (hands) focus.',
      confidence: 'moderate',
    },
    {
      swingNumber: 16,
      observation: 'Attack angle -1.4°, face-to-path -1.4°, center strike. This is the tightest cluster of all session metrics — within Tour-level variance for a 7-iron.',
      connection: 'After the refined cue (handle finish low-left), the last 6 swings show a standard deviation of 0.4° on attack angle vs. 0.5° at baseline. The player has acquired a repeatable motor pattern.',
      confidence: 'high',
    },
    {
      swingNumber: 18,
      observation: 'Session-closing swing: 172 yds carry (+16 from baseline avg), attack angle -1.2°, center-center impact. Best overall quality score of the session (88/100).',
      connection: 'Validation phase confirms stable acquisition. The 16-yard carry improvement represents pure strike quality — club speed only increased 3.6 mph, but smash factor and launch conditions optimized.',
      confidence: 'high',
    },
  ],

  summary: {
    headlineMetric: 'Carry improved +16 yds from baseline to validation',
    lessonSummary: [
      'Jake came in with a consistent but costly pattern: a steep angle of attack (-4.8° average) was producing toe-low contact, excessive spin (7,100+ rpm), and a carry distance 12-15 yards below his potential for a 7-iron.',
      'We spent the first five swings establishing this baseline with data. The numbers confirmed what the divots showed — Jake was chopping down at the ball rather than sweeping through it. His face-to-path variance (±3.6°) was nearly double the benchmark for his handicap, which explained the inconsistent shot shape.',
      'At swing 6, we introduced an external focus cue: "brush the grass forward through the ball, like you\'re painting a stripe on the turf past the ball." The response was immediate — a 33% reduction in steepness on the very first attempt. Over the next seven swings, attack angle steadily improved from -3.6° to -2.0°, with one regression at swing 9 that resolved when Jake re-committed to the external focus.',
      'At swing 13, we refined the cue by adding "feel the handle finish low and left" to prevent loft breakdown at impact. The validation phase (swings 13-18) showed the tightest metric cluster of the session: attack angle -1.6° average (vs. -4.8° baseline), face-to-path within ±1.4°, and carry averaging 169 yds (+16 from baseline).',
      'The improvement came primarily from strike quality, not from swinging harder. Club speed increased only 3.6 mph, but smash factor improved from 1.43 to 1.45, and launch conditions optimized — lower spin, better launch angle, center-face contact. This is exactly the kind of improvement that sticks.',
    ],
    practicePlan: [
      {
        name: 'Grass-Forward Brush Drill',
        cue: 'Feel like you are brushing the grass forward through the ball — not down at it',
        cueType: 'external',
        reps: '50 balls per session, 3 sessions before next lesson',
        successCriteria: 'Divots should be shallow and point toward target. You should feel the club staying low through impact, not digging.',
      },
      {
        name: 'Handle Finish Checkpoint',
        cue: 'Feel the handle finish low and left (for a right-handed golfer)',
        cueType: 'external',
        reps: '20 balls at end of each practice session as a feel check',
        successCriteria: 'Hands should finish below shoulder height. If you feel the club "flipping" past your hands, the loft is adding — go back to the grass-forward feel.',
      },
      {
        name: 'Gate Drill for Strike Validation',
        cue: 'Place two tees 3 inches apart, just wider than the club. Hit balls through the gate without touching either tee.',
        cueType: 'external',
        reps: '15 balls to start each practice session',
        successCriteria: 'Consistent center-face contact confirmed by impact tape or sound. If you start missing the gate, slow down — don\'t force it.',
      },
    ],
    baselineAvg: {
      carry: 156,
      attackAngle: -4.8,
      faceToPath: -3.6,
      spinRate: 7108,
      smashFactor: 1.43,
      ballSpeed: 126.9,
    },
    postCueAvg: {
      carry: 169,
      attackAngle: -1.6,
      faceToPath: -1.4,
      spinRate: 6198,
      smashFactor: 1.45,
      ballSpeed: 132.7,
    },
  },
};
