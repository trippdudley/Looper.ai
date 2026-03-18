export interface Session {
  id: string;
  golferId: string;
  coachId: string;
  date: string;
  duration: string;
  type: "full-swing" | "short-game" | "playing-lesson" | "assessment";
  focus: string;
  summary: string;
  faults: string[];
  coachingCues: string[];
  drillIds: string[];
  trackmanShotIds: string[];
  improvementScore: number;
  keyMetricChanges: { metric: string; before: number; after: number; unit: string }[];
  notes: string;
}

export const sessions: Session[] = [
  {
    id: "session-1",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2025-12-10",
    duration: "60 min",
    type: "assessment",
    focus: "Initial Assessment — Full Swing Baseline",
    summary: "First session with Moe. Established Trackman baselines for driver and 7-iron. Key findings: significant out-to-in club path with driver causing a consistent slice, poor weight transfer with reverse pivot tendency, and inconsistent low point control with irons. Athleticism is there — he has decent club speed for his size. The path and weight shift are the root causes we need to address.",
    faults: [
      "Over-the-top club path (avg -2.5\u00b0 with driver)",
      "Reverse pivot — weight staying on trail side through impact",
      "Negative attack angle with driver (-0.5\u00b0 to +0.5\u00b0 when it should be +2\u00b0 to +4\u00b0)",
      "Inconsistent low point with irons — fat and thin misses",
      "Flying right elbow causing disconnection",
    ],
    coachingCues: [
      "Feel like you're sitting into a chair as you start the downswing",
      "Your right elbow is flying \u2014 try the towel drill to keep connection",
      "On the driver, think about hitting UP on the ball \u2014 tee it high and let it go",
    ],
    drillIds: ["drill-step", "drill-towel"],
    trackmanShotIds: [
      "s1-shot-01", "s1-shot-02", "s1-shot-03", "s1-shot-04", "s1-shot-05",
      "s1-shot-06", "s1-shot-07", "s1-shot-08", "s1-shot-09", "s1-shot-10",
    ],
    improvementScore: 45,
    keyMetricChanges: [
      { metric: "Driver Club Path", before: -2.8, after: -1.5, unit: "\u00b0" },
      { metric: "Driver Attack Angle", before: 0.5, after: 1.5, unit: "\u00b0" },
      { metric: "Driver Carry", before: 216, after: 228, unit: "yds" },
    ],
    notes: "Moe is motivated and coachable. He understands what the numbers mean, which helps. Homework: step drill 20 reps before every range session, towel drill 10 reps as warm-up. We need to fix the weight shift before we can properly address the path \u2014 the reverse pivot is the root cause of the over-the-top move.",
  },
  {
    id: "session-2",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2026-01-05",
    duration: "60 min",
    type: "full-swing",
    focus: "Takeaway & Connection",
    summary: "Focused on cleaning up the takeaway and improving arm-body connection. The towel drill from last session's homework has helped \u2014 right elbow is more connected. Introduced takeaway awareness: keeping hands in front of chest. Driver slice is less severe (path improved from -2.5\u00b0 to -1.5\u00b0 average). When he focuses on connection, the path naturally improves. Iron contact is more consistent.",
    faults: [
      "Hands getting too deep behind body on takeaway",
      "Still some over-the-top tendency under pressure",
      "Weight transfer improved but not yet automatic",
    ],
    coachingCues: [
      "Keep your hands in front of your chest on the takeaway \u2014 they're getting too deep",
      "Don't think about the path \u2014 focus on where the logo on your glove points at the top",
      "The towel is your best friend right now \u2014 warm up with it every time",
    ],
    drillIds: ["drill-towel", "drill-pump"],
    trackmanShotIds: [
      "s2-shot-01", "s2-shot-02", "s2-shot-03", "s2-shot-04", "s2-shot-05",
      "s2-shot-06", "s2-shot-07", "s2-shot-08", "s2-shot-09", "s2-shot-10",
    ],
    improvementScore: 58,
    keyMetricChanges: [
      { metric: "Driver Club Path", before: -2.5, after: -1.2, unit: "\u00b0" },
      { metric: "7-Iron Smash Factor", before: 1.35, after: 1.40, unit: "" },
      { metric: "Driver Carry", before: 221, after: 232, unit: "yds" },
    ],
    notes: "Good progress on connection. The pump drill will help with transition sequencing \u2014 he's still a bit quick from the top. Next session we'll focus on weight transfer with the step drill to address the root cause of the over-the-top move. He's been practicing the towel drill regularly, which shows.",
  },
  {
    id: "session-3",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2026-01-22",
    duration: "60 min",
    type: "full-swing",
    focus: "Weight Transfer — Step Drill Integration",
    summary: "Breakthrough session. Introduced the step drill in full and it immediately clicked. Moe's attack angle with driver jumped to +2.5\u00b0 to +3.5\u00b0 when doing the step drill. The weight shift forward naturally shallowed the club and improved path. Hit his longest drive of the program (237 carry, 255 total). The challenge now is making this automatic without the step. Iron contact also improved \u2014 better compression when weight moves forward.",
    faults: [
      "Old pattern resurfaces when he doesn't consciously think about weight shift",
      "Occasional thin iron shots when weight shift goes too lateral",
    ],
    coachingCues: [
      "Step, then swing. Step, swing. The step drill trains the weight shift.",
      "Feel like you're sitting into a chair as you start the downswing",
      "Think about throwing the club at the target on the follow-through",
    ],
    drillIds: ["drill-step", "drill-pump"],
    trackmanShotIds: [
      "s3-shot-01", "s3-shot-02", "s3-shot-03", "s3-shot-04", "s3-shot-05",
      "s3-shot-06", "s3-shot-07", "s3-shot-08", "s3-shot-09", "s3-shot-10",
    ],
    improvementScore: 71,
    keyMetricChanges: [
      { metric: "Driver Attack Angle", before: 1.5, after: 3.0, unit: "\u00b0" },
      { metric: "Driver Club Path", before: -1.2, after: -0.3, unit: "\u00b0" },
      { metric: "Driver Carry", before: 225, after: 237, unit: "yds" },
      { metric: "Driver Spin Rate", before: 2980, after: 2480, unit: "rpm" },
    ],
    notes: "The step drill is the key unlock for Moe. When he steps, everything falls into place \u2014 path shallows, attack angle goes up, spin drops, and carry jumps 15+ yards. Next session we'll work on the alignment stick gate to refine path control now that the weight shift is improving. Homework: step drill 30 reps per range session, alternate between step-and-hit and regular swings.",
  },
  {
    id: "session-4",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2026-02-08",
    duration: "60 min",
    type: "full-swing",
    focus: "Club Path Refinement — Alignment Stick Gate",
    summary: "Built on the weight transfer gains by adding path-specific work with the alignment stick gate. Moe can now hit a draw with both irons and driver \u2014 major milestone. Had one hook when path went too far in-to-out, but he self-corrected. The gate gives him instant feedback on path without needing to look at numbers. Iron contact is significantly more consistent \u2014 7-iron carry averaging 158 (up from 152 at baseline).",
    faults: [
      "Occasional over-draw when path goes too far in-to-out (>1.5\u00b0)",
      "Under pressure, can still revert to slight fade pattern",
    ],
    coachingCues: [
      "The gate doesn't lie \u2014 if you hit the outside stick, you came over it",
      "Think about throwing the club at the target on the follow-through",
      "Don't try to draw it \u2014 let the path do the work, you just swing through the gate",
    ],
    drillIds: ["drill-alignment-gate", "drill-step"],
    trackmanShotIds: [
      "s4-shot-01", "s4-shot-02", "s4-shot-03", "s4-shot-04", "s4-shot-05",
      "s4-shot-06", "s4-shot-07", "s4-shot-08", "s4-shot-09", "s4-shot-10",
    ],
    improvementScore: 78,
    keyMetricChanges: [
      { metric: "Driver Club Path", before: -0.3, after: 0.5, unit: "\u00b0" },
      { metric: "7-Iron Carry", before: 155, after: 161, unit: "yds" },
      { metric: "7-Iron Club Path", before: -0.5, after: 0.3, unit: "\u00b0" },
    ],
    notes: "Moe can now hit a draw! This is a huge confidence boost. The combination of weight shift (step drill) and path awareness (gate drill) has transformed his ball flight. He went from a 25-yard slice to a controllable 5-10 yard draw. Next session we'll work on consistency under pressure and start simulating on-course situations. Homework: gate drill at every range session, start with 10 gate reps then hit normal balls.",
  },
  {
    id: "session-5",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2026-02-25",
    duration: "60 min",
    type: "full-swing",
    focus: "Consistency Under Pressure — Stock Shot Development",
    summary: "Today was about owning the changes and developing a stock shot. 8 out of 10 shots were good or better. When one old-pattern fade crept in, Moe recognized it himself and used the step drill feel to reset. His stock driver is now a slight draw, 230-235 carry, with low spin. He hit his best drive ever: 238 carry, 257 total, 1.47 smash factor. Iron work is consistent \u2014 he's gained about 10 yards of carry with the 7-iron since we started.",
    faults: [
      "Under fatigue or pressure, old fade pattern can return",
      "Needs to trust the new swing on the course — range vs course gap",
    ],
    coachingCues: [
      "You own this now \u2014 trust the swing, don't steer it",
      "When in doubt, go back to the step drill feel \u2014 that's your reset button",
      "On the course, pick a spot 10 yards right of target and let the draw bring it back",
    ],
    drillIds: ["drill-step", "drill-alignment-gate"],
    trackmanShotIds: [
      "s5-shot-01", "s5-shot-02", "s5-shot-03", "s5-shot-04", "s5-shot-05",
      "s5-shot-06", "s5-shot-07", "s5-shot-08", "s5-shot-09", "s5-shot-10",
    ],
    improvementScore: 85,
    keyMetricChanges: [
      { metric: "Driver Carry", before: 228, after: 238, unit: "yds" },
      { metric: "Driver Smash Factor", before: 1.43, after: 1.47, unit: "" },
      { metric: "Driver Spin Rate", before: 2700, after: 2450, unit: "rpm" },
      { metric: "Good/Acceptable Rate", before: 70, after: 90, unit: "%" },
    ],
    notes: "This is the session where it all came together. Moe's average driver carry is now 232 vs 219 at baseline \u2014 13 yards gained. His path went from -2.5\u00b0 to +0.3\u00b0. He's not just hitting draws by accident, he understands why. The biggest thing now is taking this to the course. Next session we'll shift to iron work and scoring — driver is in a great place. Arccos data shows his strokes gained off the tee has improved by 0.6 over the last month.",
  },
  {
    id: "session-6",
    golferId: "golfer-moe",
    coachId: "coach-austin",
    date: "2026-03-05",
    duration: "60 min",
    type: "full-swing",
    focus: "Iron Precision & Scoring Shots",
    summary: "Shifted focus to iron play and scoring. The weight transfer and path improvements from driver work have carried over beautifully to irons. Moe is now compressing irons properly with -4\u00b0 to -5\u00b0 attack angle and 6500+ spin. He can shape both ways with the 7-iron \u2014 hit intentional draws and fades. One thin miss when he tried to help the ball up. Driver numbers are holding steady from last session. Next phase: short game and course strategy with on-course data from Arccos.",
    faults: [
      "Occasional thin when trying to lift the ball instead of trusting the loft",
      "Distance control between clubs needs work \u2014 gapping could be tighter",
    ],
    coachingCues: [
      "Trust the loft \u2014 the club is designed to get the ball up, you just hit down and through",
      "On approach shots, think about where you want to miss, not where you want to hit it",
      "Your hands should feel like they're leading the club head through impact \u2014 shaft lean is your friend",
    ],
    drillIds: ["drill-alignment-gate", "drill-9to3"],
    trackmanShotIds: [
      "s6-shot-01", "s6-shot-02", "s6-shot-03", "s6-shot-04", "s6-shot-05",
      "s6-shot-06", "s6-shot-07", "s6-shot-08", "s6-shot-09", "s6-shot-10",
    ],
    improvementScore: 88,
    keyMetricChanges: [
      { metric: "7-Iron Carry", before: 155, after: 163, unit: "yds" },
      { metric: "7-Iron Attack Angle", before: -3.2, after: -4.5, unit: "\u00b0" },
      { metric: "7-Iron Smash Factor", before: 1.38, after: 1.42, unit: "" },
      { metric: "Driver Carry (maintained)", before: 234, after: 235, unit: "yds" },
    ],
    notes: "Incredible progress over 6 sessions. Moe went from a 25-yard slice to a stock draw, gained 20+ yards of driver carry, and is now compressing irons like a single-digit handicap. His handicap has dropped from 18.1 to 15.2 — almost 3 strokes. The Arccos data confirms strokes gained improvement across all full swing categories. Next focus: introduce short game work with the 9-to-3 drill, and start reviewing Arccos round data for course management opportunities. He's on track to break 80 by mid-summer.",
  },
];
