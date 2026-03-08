export interface TrackmanShot {
  id: string;
  sessionId: string;
  shotNumber: number;
  club: string;
  clubSpeed: number;
  ballSpeed: number;
  launchAngle: number;
  spinRate: number;
  carry: number;
  total: number;
  clubPath: number;
  faceAngle: number;
  attackAngle: number;
  smashFactor: number;
  shotShape: "draw" | "fade" | "straight" | "slice" | "hook" | "pull" | "push";
  quality: "good" | "acceptable" | "mishit";
  notes?: string;
}

export const trackmanShots: TrackmanShot[] = [
  // ===== SESSION 1 — Dec 10, 2025 — Initial Assessment =====
  // Early session: Mike's typical pattern — driver slice, poor weight transfer
  {
    id: "s1-shot-01", sessionId: "session-1", shotNumber: 1, club: "Driver",
    clubSpeed: 94.2, ballSpeed: 131.5, launchAngle: 12.8, spinRate: 3180,
    carry: 216, total: 228, clubPath: -2.8, faceAngle: 1.2, attackAngle: 0.5,
    smashFactor: 1.40, shotShape: "slice", quality: "mishit",
    notes: "Classic slice pattern — path left, face open to path"
  },
  {
    id: "s1-shot-02", sessionId: "session-1", shotNumber: 2, club: "Driver",
    clubSpeed: 95.1, ballSpeed: 133.8, launchAngle: 11.2, spinRate: 3050,
    carry: 221, total: 234, clubPath: -2.5, faceAngle: 0.8, attackAngle: 0.8,
    smashFactor: 1.41, shotShape: "fade", quality: "acceptable",
    notes: "Slightly better but still out-to-in"
  },
  {
    id: "s1-shot-03", sessionId: "session-1", shotNumber: 3, club: "Driver",
    clubSpeed: 93.6, ballSpeed: 128.2, launchAngle: 14.1, spinRate: 3220,
    carry: 209, total: 219, clubPath: -3.1, faceAngle: 1.5, attackAngle: -0.2,
    smashFactor: 1.37, shotShape: "slice", quality: "mishit",
    notes: "Negative attack angle + high spin — hanging back on trail side"
  },
  {
    id: "s1-shot-04", sessionId: "session-1", shotNumber: 4, club: "7-Iron",
    clubSpeed: 82.1, ballSpeed: 113.4, launchAngle: 17.8, spinRate: 6420,
    carry: 152, total: 160, clubPath: -1.2, faceAngle: 0.3, attackAngle: -3.2,
    smashFactor: 1.38, shotShape: "fade", quality: "acceptable",
    notes: "Decent contact, slight fade"
  },
  {
    id: "s1-shot-05", sessionId: "session-1", shotNumber: 5, club: "7-Iron",
    clubSpeed: 81.5, ballSpeed: 108.2, launchAngle: 20.1, spinRate: 5900,
    carry: 145, total: 152, clubPath: -0.8, faceAngle: 0.1, attackAngle: -2.1,
    smashFactor: 1.33, shotShape: "straight", quality: "mishit",
    notes: "Thin contact — low smash factor, high launch"
  },
  {
    id: "s1-shot-06", sessionId: "session-1", shotNumber: 6, club: "7-Iron",
    clubSpeed: 83.0, ballSpeed: 115.6, launchAngle: 16.5, spinRate: 6650,
    carry: 155, total: 163, clubPath: -1.5, faceAngle: -0.2, attackAngle: -3.8,
    smashFactor: 1.39, shotShape: "fade", quality: "good",
    notes: "Best iron shot of session — good compression"
  },
  {
    id: "s1-shot-07", sessionId: "session-1", shotNumber: 7, club: "Driver",
    clubSpeed: 95.5, ballSpeed: 136.2, launchAngle: 13.5, spinRate: 2980,
    carry: 225, total: 239, clubPath: -1.8, faceAngle: 0.5, attackAngle: 1.2,
    smashFactor: 1.43, shotShape: "fade", quality: "acceptable",
    notes: "Better attack angle when focused on weight shift"
  },
  {
    id: "s1-shot-08", sessionId: "session-1", shotNumber: 8, club: "Driver",
    clubSpeed: 94.8, ballSpeed: 130.1, launchAngle: 15.2, spinRate: 3350,
    carry: 212, total: 222, clubPath: -2.9, faceAngle: 1.8, attackAngle: -0.5,
    smashFactor: 1.37, shotShape: "slice", quality: "mishit",
    notes: "Reverted — came over the top again"
  },
  {
    id: "s1-shot-09", sessionId: "session-1", shotNumber: 9, club: "7-Iron",
    clubSpeed: 82.8, ballSpeed: 104.5, launchAngle: 22.3, spinRate: 5600,
    carry: 140, total: 148, clubPath: -0.5, faceAngle: 0.5, attackAngle: -1.8,
    smashFactor: 1.26, shotShape: "straight", quality: "mishit",
    notes: "Fat contact — club hit ground first, low ball speed"
  },
  {
    id: "s1-shot-10", sessionId: "session-1", shotNumber: 10, club: "Driver",
    clubSpeed: 96.0, ballSpeed: 137.5, launchAngle: 12.0, spinRate: 2850,
    carry: 228, total: 242, clubPath: -1.5, faceAngle: 0.2, attackAngle: 1.5,
    smashFactor: 1.43, shotShape: "fade", quality: "good",
    notes: "Best driver shot — actively thinking about stepping into it"
  },

  // ===== SESSION 2 — Jan 5, 2026 — Takeaway & Connection =====
  {
    id: "s2-shot-01", sessionId: "session-2", shotNumber: 1, club: "7-Iron",
    clubSpeed: 82.5, ballSpeed: 114.8, launchAngle: 17.2, spinRate: 6380,
    carry: 154, total: 162, clubPath: -0.9, faceAngle: 0.2, attackAngle: -3.5,
    smashFactor: 1.39, shotShape: "fade", quality: "acceptable",
    notes: "Warm-up — slight fade, decent contact"
  },
  {
    id: "s2-shot-02", sessionId: "session-2", shotNumber: 2, club: "7-Iron",
    clubSpeed: 83.2, ballSpeed: 116.1, launchAngle: 16.8, spinRate: 6520,
    carry: 156, total: 164, clubPath: -0.5, faceAngle: 0.0, attackAngle: -3.8,
    smashFactor: 1.40, shotShape: "straight", quality: "good",
    notes: "Nice — towel drill cleaned up connection"
  },
  {
    id: "s2-shot-03", sessionId: "session-2", shotNumber: 3, club: "7-Iron",
    clubSpeed: 81.8, ballSpeed: 112.9, launchAngle: 18.5, spinRate: 6100,
    carry: 150, total: 158, clubPath: 0.2, faceAngle: 0.5, attackAngle: -2.8,
    smashFactor: 1.38, shotShape: "draw", quality: "acceptable",
    notes: "Slight draw — path improving toward neutral"
  },
  {
    id: "s2-shot-04", sessionId: "session-2", shotNumber: 4, club: "Driver",
    clubSpeed: 94.5, ballSpeed: 134.2, launchAngle: 12.5, spinRate: 2920,
    carry: 223, total: 237, clubPath: -2.1, faceAngle: 0.5, attackAngle: 1.0,
    smashFactor: 1.42, shotShape: "fade", quality: "acceptable",
    notes: "Still fading but less severe — connection helping"
  },
  {
    id: "s2-shot-05", sessionId: "session-2", shotNumber: 5, club: "Driver",
    clubSpeed: 95.3, ballSpeed: 137.8, launchAngle: 11.8, spinRate: 2780,
    carry: 230, total: 245, clubPath: -1.2, faceAngle: 0.1, attackAngle: 1.8,
    smashFactor: 1.45, shotShape: "fade", quality: "good",
    notes: "Great contact — small fade, manageable"
  },
  {
    id: "s2-shot-06", sessionId: "session-2", shotNumber: 6, club: "Driver",
    clubSpeed: 93.8, ballSpeed: 129.5, launchAngle: 14.5, spinRate: 3280,
    carry: 214, total: 224, clubPath: -2.6, faceAngle: 1.3, attackAngle: -0.1,
    smashFactor: 1.38, shotShape: "slice", quality: "mishit",
    notes: "Lost focus — arms got away from body, towel drill feel gone"
  },
  {
    id: "s2-shot-07", sessionId: "session-2", shotNumber: 7, club: "7-Iron",
    clubSpeed: 83.5, ballSpeed: 117.2, launchAngle: 16.2, spinRate: 6580,
    carry: 158, total: 166, clubPath: -0.3, faceAngle: -0.2, attackAngle: -4.0,
    smashFactor: 1.40, shotShape: "straight", quality: "good",
    notes: "Solid — good compression, proper divot"
  },
  {
    id: "s2-shot-08", sessionId: "session-2", shotNumber: 8, club: "7-Iron",
    clubSpeed: 82.0, ballSpeed: 110.8, launchAngle: 19.5, spinRate: 5950,
    carry: 148, total: 155, clubPath: 0.5, faceAngle: 0.8, attackAngle: -2.2,
    smashFactor: 1.35, shotShape: "draw", quality: "acceptable",
    notes: "Slightly thin but shape is good"
  },
  {
    id: "s2-shot-09", sessionId: "session-2", shotNumber: 9, club: "Driver",
    clubSpeed: 96.2, ballSpeed: 138.5, launchAngle: 11.5, spinRate: 2650,
    carry: 232, total: 248, clubPath: -1.0, faceAngle: -0.2, attackAngle: 2.2,
    smashFactor: 1.44, shotShape: "straight", quality: "good",
    notes: "Best driver of the day — kept hands in front of chest"
  },
  {
    id: "s2-shot-10", sessionId: "session-2", shotNumber: 10, club: "Driver",
    clubSpeed: 95.0, ballSpeed: 135.8, launchAngle: 12.8, spinRate: 2890,
    carry: 226, total: 240, clubPath: -1.5, faceAngle: 0.3, attackAngle: 1.5,
    smashFactor: 1.43, shotShape: "fade", quality: "acceptable",
    notes: "Manageable fade — progress from session 1"
  },

  // ===== SESSION 3 — Jan 22, 2026 — Weight Transfer (Step Drill) =====
  {
    id: "s3-shot-01", sessionId: "session-3", shotNumber: 1, club: "Driver",
    clubSpeed: 95.8, ballSpeed: 138.2, launchAngle: 11.2, spinRate: 2680,
    carry: 231, total: 246, clubPath: -1.0, faceAngle: 0.0, attackAngle: 2.5,
    smashFactor: 1.44, shotShape: "straight", quality: "good",
    notes: "Step drill feel — weight moving forward nicely"
  },
  {
    id: "s3-shot-02", sessionId: "session-3", shotNumber: 2, club: "Driver",
    clubSpeed: 96.5, ballSpeed: 140.1, launchAngle: 10.8, spinRate: 2520,
    carry: 235, total: 252, clubPath: -0.5, faceAngle: -0.3, attackAngle: 3.0,
    smashFactor: 1.45, shotShape: "straight", quality: "good",
    notes: "Excellent — positive attack angle, low spin, great carry"
  },
  {
    id: "s3-shot-03", sessionId: "session-3", shotNumber: 3, club: "Driver",
    clubSpeed: 94.0, ballSpeed: 131.2, launchAngle: 13.8, spinRate: 3100,
    carry: 217, total: 229, clubPath: -2.2, faceAngle: 0.8, attackAngle: 0.3,
    smashFactor: 1.40, shotShape: "fade", quality: "acceptable",
    notes: "Lost the step feel — went back to old pattern briefly"
  },
  {
    id: "s3-shot-04", sessionId: "session-3", shotNumber: 4, club: "Driver",
    clubSpeed: 95.2, ballSpeed: 137.0, launchAngle: 11.5, spinRate: 2750,
    carry: 228, total: 243, clubPath: -0.8, faceAngle: 0.1, attackAngle: 2.0,
    smashFactor: 1.44, shotShape: "fade", quality: "good",
    notes: "Recovered — refocused on stepping into it"
  },
  {
    id: "s3-shot-05", sessionId: "session-3", shotNumber: 5, club: "7-Iron",
    clubSpeed: 83.8, ballSpeed: 117.5, launchAngle: 16.0, spinRate: 6480,
    carry: 158, total: 167, clubPath: -0.2, faceAngle: -0.1, attackAngle: -4.2,
    smashFactor: 1.40, shotShape: "straight", quality: "good",
    notes: "Clean contact — ball-first, proper divot"
  },
  {
    id: "s3-shot-06", sessionId: "session-3", shotNumber: 6, club: "7-Iron",
    clubSpeed: 84.2, ballSpeed: 118.8, launchAngle: 15.5, spinRate: 6620,
    carry: 160, total: 169, clubPath: 0.3, faceAngle: 0.1, attackAngle: -4.5,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Best 7-iron contact yet — weight shift carrying over from driver work"
  },
  {
    id: "s3-shot-07", sessionId: "session-3", shotNumber: 7, club: "7-Iron",
    clubSpeed: 82.5, ballSpeed: 107.2, launchAngle: 21.5, spinRate: 5700,
    carry: 142, total: 149, clubPath: 0.8, faceAngle: 0.5, attackAngle: -1.5,
    smashFactor: 1.30, shotShape: "draw", quality: "mishit",
    notes: "Thin — topped it slightly, low point too far back"
  },
  {
    id: "s3-shot-08", sessionId: "session-3", shotNumber: 8, club: "Driver",
    clubSpeed: 96.8, ballSpeed: 141.2, launchAngle: 10.5, spinRate: 2480,
    carry: 237, total: 255, clubPath: 0.2, faceAngle: -0.1, attackAngle: 3.5,
    smashFactor: 1.46, shotShape: "straight", quality: "good",
    notes: "Bomb! Step drill translating to real swings — best drive yet"
  },
  {
    id: "s3-shot-09", sessionId: "session-3", shotNumber: 9, club: "7-Iron",
    clubSpeed: 83.5, ballSpeed: 116.2, launchAngle: 17.0, spinRate: 6350,
    carry: 155, total: 163, clubPath: 0.1, faceAngle: 0.2, attackAngle: -3.8,
    smashFactor: 1.39, shotShape: "straight", quality: "acceptable",
    notes: "Solid — slightly heavy but still good distance"
  },
  {
    id: "s3-shot-10", sessionId: "session-3", shotNumber: 10, club: "Driver",
    clubSpeed: 95.5, ballSpeed: 138.8, launchAngle: 11.8, spinRate: 2700,
    carry: 230, total: 245, clubPath: -0.3, faceAngle: 0.0, attackAngle: 2.8,
    smashFactor: 1.45, shotShape: "straight", quality: "good",
    notes: "Finished strong — step drill pattern is sticking"
  },

  // ===== SESSION 4 — Feb 8, 2026 — Club Path (Alignment Stick Gate) =====
  {
    id: "s4-shot-01", sessionId: "session-4", shotNumber: 1, club: "7-Iron",
    clubSpeed: 83.0, ballSpeed: 116.5, launchAngle: 16.5, spinRate: 6450,
    carry: 156, total: 164, clubPath: -0.5, faceAngle: 0.0, attackAngle: -3.8,
    smashFactor: 1.40, shotShape: "straight", quality: "good",
    notes: "Warm-up through the gate — clean"
  },
  {
    id: "s4-shot-02", sessionId: "session-4", shotNumber: 2, club: "7-Iron",
    clubSpeed: 84.0, ballSpeed: 118.2, launchAngle: 15.8, spinRate: 6580,
    carry: 159, total: 168, clubPath: 0.5, faceAngle: 0.2, attackAngle: -4.2,
    smashFactor: 1.41, shotShape: "draw", quality: "good",
    notes: "Nice baby draw — gate forcing in-to-out delivery"
  },
  {
    id: "s4-shot-03", sessionId: "session-4", shotNumber: 3, club: "7-Iron",
    clubSpeed: 82.8, ballSpeed: 115.0, launchAngle: 17.5, spinRate: 6200,
    carry: 153, total: 161, clubPath: 1.2, faceAngle: 0.8, attackAngle: -3.5,
    smashFactor: 1.39, shotShape: "draw", quality: "acceptable",
    notes: "Path getting a bit too in-to-out — overdoing the correction"
  },
  {
    id: "s4-shot-04", sessionId: "session-4", shotNumber: 4, club: "7-Iron",
    clubSpeed: 83.5, ballSpeed: 117.8, launchAngle: 16.2, spinRate: 6500,
    carry: 157, total: 166, clubPath: 0.2, faceAngle: 0.0, attackAngle: -4.0,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Dialed it back — perfect path through the gate"
  },
  {
    id: "s4-shot-05", sessionId: "session-4", shotNumber: 5, club: "Driver",
    clubSpeed: 96.0, ballSpeed: 139.5, launchAngle: 11.0, spinRate: 2600,
    carry: 233, total: 249, clubPath: 0.5, faceAngle: 0.2, attackAngle: 2.8,
    smashFactor: 1.45, shotShape: "draw", quality: "good",
    notes: "First intentional draw with driver! Path work paying off"
  },
  {
    id: "s4-shot-06", sessionId: "session-4", shotNumber: 6, club: "Driver",
    clubSpeed: 95.5, ballSpeed: 137.2, launchAngle: 12.2, spinRate: 2850,
    carry: 227, total: 241, clubPath: 1.8, faceAngle: 0.5, attackAngle: 2.2,
    smashFactor: 1.44, shotShape: "hook", quality: "mishit",
    notes: "Over-cooked it — path too far right, face closed to target"
  },
  {
    id: "s4-shot-07", sessionId: "session-4", shotNumber: 7, club: "Driver",
    clubSpeed: 96.2, ballSpeed: 140.8, launchAngle: 11.5, spinRate: 2550,
    carry: 235, total: 251, clubPath: 0.8, faceAngle: 0.3, attackAngle: 3.0,
    smashFactor: 1.46, shotShape: "draw", quality: "good",
    notes: "Controlled draw — this is the shot shape we want"
  },
  {
    id: "s4-shot-08", sessionId: "session-4", shotNumber: 8, club: "Driver",
    clubSpeed: 94.8, ballSpeed: 136.5, launchAngle: 13.0, spinRate: 2920,
    carry: 224, total: 237, clubPath: -0.5, faceAngle: 0.0, attackAngle: 1.8,
    smashFactor: 1.44, shotShape: "straight", quality: "good",
    notes: "Straight ball — shows he can go both ways now"
  },
  {
    id: "s4-shot-09", sessionId: "session-4", shotNumber: 9, club: "7-Iron",
    clubSpeed: 84.5, ballSpeed: 119.2, launchAngle: 15.5, spinRate: 6700,
    carry: 161, total: 170, clubPath: 0.3, faceAngle: -0.1, attackAngle: -4.5,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Pure — great compression, path neutral"
  },
  {
    id: "s4-shot-10", sessionId: "session-4", shotNumber: 10, club: "7-Iron",
    clubSpeed: 83.8, ballSpeed: 118.5, launchAngle: 16.0, spinRate: 6550,
    carry: 159, total: 168, clubPath: 0.5, faceAngle: 0.2, attackAngle: -4.2,
    smashFactor: 1.41, shotShape: "draw", quality: "good",
    notes: "Confident draw — consistent through the gate"
  },

  // ===== SESSION 5 — Feb 25, 2026 — Putting It Together (Driver Consistency) =====
  {
    id: "s5-shot-01", sessionId: "session-5", shotNumber: 1, club: "Driver",
    clubSpeed: 96.0, ballSpeed: 140.2, launchAngle: 11.2, spinRate: 2580,
    carry: 234, total: 250, clubPath: 0.3, faceAngle: 0.1, attackAngle: 2.8,
    smashFactor: 1.46, shotShape: "straight", quality: "good",
    notes: "Great start — all the pieces coming together"
  },
  {
    id: "s5-shot-02", sessionId: "session-5", shotNumber: 2, club: "Driver",
    clubSpeed: 95.8, ballSpeed: 139.5, launchAngle: 10.8, spinRate: 2450,
    carry: 233, total: 250, clubPath: 0.5, faceAngle: 0.2, attackAngle: 3.2,
    smashFactor: 1.46, shotShape: "draw", quality: "good",
    notes: "Low spin draw — this is the stock shot developing"
  },
  {
    id: "s5-shot-03", sessionId: "session-5", shotNumber: 3, club: "Driver",
    clubSpeed: 96.5, ballSpeed: 141.5, launchAngle: 11.5, spinRate: 2620,
    carry: 236, total: 252, clubPath: 0.2, faceAngle: -0.1, attackAngle: 2.5,
    smashFactor: 1.47, shotShape: "straight", quality: "good",
    notes: "Effortless power — smooth tempo with 1.47 smash"
  },
  {
    id: "s5-shot-04", sessionId: "session-5", shotNumber: 4, club: "Driver",
    clubSpeed: 94.5, ballSpeed: 134.8, launchAngle: 13.2, spinRate: 3050,
    carry: 222, total: 234, clubPath: -1.5, faceAngle: 0.5, attackAngle: 0.8,
    smashFactor: 1.43, shotShape: "fade", quality: "acceptable",
    notes: "Old pattern crept back — under pressure swing"
  },
  {
    id: "s5-shot-05", sessionId: "session-5", shotNumber: 5, club: "Driver",
    clubSpeed: 95.5, ballSpeed: 138.8, launchAngle: 11.8, spinRate: 2700,
    carry: 230, total: 245, clubPath: 0.0, faceAngle: 0.0, attackAngle: 2.5,
    smashFactor: 1.45, shotShape: "straight", quality: "good",
    notes: "Reset — went back to step drill feel, recovered"
  },
  {
    id: "s5-shot-06", sessionId: "session-5", shotNumber: 6, club: "Driver",
    clubSpeed: 96.8, ballSpeed: 142.0, launchAngle: 10.5, spinRate: 2400,
    carry: 238, total: 257, clubPath: 0.8, faceAngle: 0.3, attackAngle: 3.5,
    smashFactor: 1.47, shotShape: "draw", quality: "good",
    notes: "Best drive of all sessions — 257 total, tight draw"
  },
  {
    id: "s5-shot-07", sessionId: "session-5", shotNumber: 7, club: "7-Iron",
    clubSpeed: 84.0, ballSpeed: 118.5, launchAngle: 16.0, spinRate: 6500,
    carry: 159, total: 168, clubPath: 0.2, faceAngle: 0.0, attackAngle: -4.2,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Clean — consistent iron contact"
  },
  {
    id: "s5-shot-08", sessionId: "session-5", shotNumber: 8, club: "7-Iron",
    clubSpeed: 84.5, ballSpeed: 119.8, launchAngle: 15.5, spinRate: 6650,
    carry: 162, total: 171, clubPath: 0.5, faceAngle: 0.1, attackAngle: -4.5,
    smashFactor: 1.42, shotShape: "draw", quality: "good",
    notes: "Controlled draw — nice trajectory"
  },
  {
    id: "s5-shot-09", sessionId: "session-5", shotNumber: 9, club: "Driver",
    clubSpeed: 95.2, ballSpeed: 137.5, launchAngle: 12.0, spinRate: 2780,
    carry: 228, total: 242, clubPath: -0.3, faceAngle: 0.1, attackAngle: 2.0,
    smashFactor: 1.44, shotShape: "fade", quality: "good",
    notes: "Working fade — intentional this time"
  },
  {
    id: "s5-shot-10", sessionId: "session-5", shotNumber: 10, club: "Driver",
    clubSpeed: 96.0, ballSpeed: 140.5, launchAngle: 11.0, spinRate: 2500,
    carry: 234, total: 251, clubPath: 0.5, faceAngle: 0.2, attackAngle: 3.0,
    smashFactor: 1.46, shotShape: "draw", quality: "good",
    notes: "Finished strong — stock draw is reliable"
  },

  // ===== SESSION 6 — Mar 5, 2026 — Iron Work & Scoring =====
  {
    id: "s6-shot-01", sessionId: "session-6", shotNumber: 1, club: "7-Iron",
    clubSpeed: 84.2, ballSpeed: 119.0, launchAngle: 15.8, spinRate: 6550,
    carry: 160, total: 169, clubPath: 0.2, faceAngle: 0.0, attackAngle: -4.2,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Warm-up — dialed in immediately"
  },
  {
    id: "s6-shot-02", sessionId: "session-6", shotNumber: 2, club: "7-Iron",
    clubSpeed: 84.8, ballSpeed: 120.2, launchAngle: 15.2, spinRate: 6700,
    carry: 162, total: 171, clubPath: 0.3, faceAngle: 0.1, attackAngle: -4.5,
    smashFactor: 1.42, shotShape: "draw", quality: "good",
    notes: "Drawing 7-iron — nice trajectory, good spin for stopping power"
  },
  {
    id: "s6-shot-03", sessionId: "session-6", shotNumber: 3, club: "7-Iron",
    clubSpeed: 83.5, ballSpeed: 116.8, launchAngle: 16.5, spinRate: 6400,
    carry: 157, total: 165, clubPath: -0.2, faceAngle: -0.3, attackAngle: -3.8,
    smashFactor: 1.40, shotShape: "fade", quality: "good",
    notes: "Working fade — can shape both ways now"
  },
  {
    id: "s6-shot-04", sessionId: "session-6", shotNumber: 4, club: "7-Iron",
    clubSpeed: 82.5, ballSpeed: 109.5, launchAngle: 20.2, spinRate: 5850,
    carry: 146, total: 153, clubPath: 0.5, faceAngle: 0.8, attackAngle: -2.0,
    smashFactor: 1.33, shotShape: "draw", quality: "mishit",
    notes: "Thin — trying to help it up, lost compression"
  },
  {
    id: "s6-shot-05", sessionId: "session-6", shotNumber: 5, club: "7-Iron",
    clubSpeed: 84.5, ballSpeed: 119.5, launchAngle: 15.5, spinRate: 6600,
    carry: 161, total: 170, clubPath: 0.1, faceAngle: -0.1, attackAngle: -4.5,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Recovered — trusted the swing again"
  },
  {
    id: "s6-shot-06", sessionId: "session-6", shotNumber: 6, club: "Driver",
    clubSpeed: 96.2, ballSpeed: 141.0, launchAngle: 11.0, spinRate: 2520,
    carry: 235, total: 252, clubPath: 0.5, faceAngle: 0.2, attackAngle: 3.0,
    smashFactor: 1.47, shotShape: "draw", quality: "good",
    notes: "Stock draw — consistent with session 5 numbers"
  },
  {
    id: "s6-shot-07", sessionId: "session-6", shotNumber: 7, club: "Driver",
    clubSpeed: 95.8, ballSpeed: 139.8, launchAngle: 11.5, spinRate: 2650,
    carry: 232, total: 248, clubPath: 0.2, faceAngle: 0.0, attackAngle: 2.8,
    smashFactor: 1.46, shotShape: "straight", quality: "good",
    notes: "Slight push-straight — perfectly playable"
  },
  {
    id: "s6-shot-08", sessionId: "session-6", shotNumber: 8, club: "7-Iron",
    clubSpeed: 85.0, ballSpeed: 120.5, launchAngle: 15.0, spinRate: 6750,
    carry: 163, total: 172, clubPath: 0.3, faceAngle: 0.0, attackAngle: -5.0,
    smashFactor: 1.42, shotShape: "straight", quality: "good",
    notes: "Best 7-iron of the program — steep, compressed, full spin"
  },
  {
    id: "s6-shot-09", sessionId: "session-6", shotNumber: 9, club: "7-Iron",
    clubSpeed: 84.2, ballSpeed: 118.8, launchAngle: 16.2, spinRate: 6500,
    carry: 159, total: 168, clubPath: 0.0, faceAngle: 0.0, attackAngle: -4.2,
    smashFactor: 1.41, shotShape: "straight", quality: "good",
    notes: "Dead straight — great consistency"
  },
  {
    id: "s6-shot-10", sessionId: "session-6", shotNumber: 10, club: "Driver",
    clubSpeed: 97.0, ballSpeed: 142.2, launchAngle: 10.8, spinRate: 2420,
    carry: 238, total: 256, clubPath: 0.5, faceAngle: 0.1, attackAngle: 3.5,
    smashFactor: 1.47, shotShape: "draw", quality: "good",
    notes: "Finished the program with a bomb — 256 total, 1.47 smash"
  },
];
