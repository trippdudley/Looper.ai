export interface ShaftComparison {
  shaft: { make: string; model: string; flex: string; weight: string; };
  shots: number;
  avgBallSpeed: number;
  avgLaunch: number;
  avgSpin: number;
  avgCarry: number;
  avgTotal: number;
  dispersion: number;
  smashFactor: number;
  aiScore: number;
  aiNotes: string;
  isRecommended: boolean;
}

export const shaftComparisons: ShaftComparison[] = [
  {
    shaft: { make: "Fujikura", model: "Ventus Blue 6", flex: "S", weight: "62g" },
    shots: 8, avgBallSpeed: 142.3, avgLaunch: 12.8, avgSpin: 2480, avgCarry: 238,
    avgTotal: 255, dispersion: 18, smashFactor: 1.47, aiScore: 92,
    aiNotes: "Optimal launch/spin window. Tightest dispersion. Best match for this golfer's improving attack angle.",
    isRecommended: true,
  },
  {
    shaft: { make: "Mitsubishi", model: "Tensei White 1K 65", flex: "S", weight: "65g" },
    shots: 6, avgBallSpeed: 140.8, avgLaunch: 13.5, avgSpin: 2680, avgCarry: 233,
    avgTotal: 248, dispersion: 22, smashFactor: 1.45, aiScore: 78,
    aiNotes: "Slightly higher spin than optimal. Good feel but 5 yards shorter carry than top option. Better for golfers with lower spin tendency.",
    isRecommended: false,
  },
  {
    shaft: { make: "Graphite Design", model: "Tour AD DI 6", flex: "S", weight: "63g" },
    shots: 6, avgBallSpeed: 143.1, avgLaunch: 11.9, avgSpin: 2320, avgCarry: 240,
    avgTotal: 260, dispersion: 26, smashFactor: 1.48, aiScore: 74,
    aiNotes: "Highest ball speed but wider dispersion. Low spin is aggressive — landing angle may be too flat for course conditions. Better for low-spin players.",
    isRecommended: false,
  },
  {
    shaft: { make: "Fujikura", model: "Speeder NX 60", flex: "S", weight: "60g" },
    shots: 6, avgBallSpeed: 141.5, avgLaunch: 13.2, avgSpin: 2590, avgCarry: 235,
    avgTotal: 252, dispersion: 20, smashFactor: 1.46, aiScore: 81,
    aiNotes: "Good balance of distance and control. Slightly lighter weight adds speed for some golfers. Strong second option.",
    isRecommended: false,
  },
];
