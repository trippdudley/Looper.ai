export interface FittingRecommendation {
  id: string;
  golferId: string;
  generatedAt: string;
  clubCategory: "driver" | "irons" | "wedges" | "fairway" | "hybrid" | "putter";

  aiRecommendation: {
    head: { make: string; model: string; loft: string; setting: string; confidence: number; };
    shaft: { make: string; model: string; flex: string; weight: string; kickPoint: string; torque: string; confidence: number; };
    grip: { make: string; model: string; size: string; };
    configuration: { length: string; swingWeight: string; lieAngle: string; };
    reasoning: string[];
    basedOn: { similarGolfers: number; avgOutcomeImprovement: string; topPerformingCombination: string; };
  };

  golferProfile: {
    clubSpeed: number;
    ballSpeed: number;
    attackAngle: number;
    clubPath: number;
    tempo: string;
    missPattern: string;
    spinTendency: string;
    currentEquipment: string;
    timeSinceLastFitting: string;
    swingChanges: string[];
  };

  optimalWindow: {
    launchAngle: { min: number; max: number; ideal: number; };
    spinRate: { min: number; max: number; ideal: number; };
    ballSpeed: { min: number; max: number; ideal: number; };
    carry: { min: number; max: number; ideal: number; };
    landingAngle: { min: number; max: number; ideal: number; };
  };
}

export const driverRecommendation: FittingRecommendation = {
  id: "rec-1",
  golferId: "golfer-1",
  generatedAt: "2026-03-08T09:00:00",
  clubCategory: "driver",
  aiRecommendation: {
    head: { make: "TaylorMade", model: "Qi10", loft: "10.5°", setting: "Standard", confidence: 87 },
    shaft: { make: "Fujikura", model: "Ventus Blue 6", flex: "Stiff", weight: "62g", kickPoint: "Mid", torque: "3.5°", confidence: 82 },
    grip: { make: "Golf Pride", model: "Tour Velvet", size: "Standard" },
    configuration: { length: "45.5\"", swingWeight: "D2", lieAngle: "Standard" },
    reasoning: [
      "Club speed of 95 mph with moderate tempo best suited to mid-weight stiff shaft in 60-65g range",
      "Attack angle of +2.1° supports 10.5° loft — enough launch without excessive spin at this speed",
      "Path tendency of -1.8° (slight fade) pairs well with standard/neutral head setting — not draw-biased",
      "Spin rate averaging 2,850 rpm is slightly high for this speed. Ventus Blue's low-spin profile should bring it to 2,500-2,650 range",
      "Based on 12,400 golfers with speeds of 93-97 mph and positive attack angles, this combination averaged 8.3 yards more carry than their previous setup",
    ],
    basedOn: { similarGolfers: 12400, avgOutcomeImprovement: "+8.3 yards carry, 22% tighter dispersion", topPerformingCombination: "Qi10 10.5° + Ventus Blue 6S" },
  },
  golferProfile: {
    clubSpeed: 95.2,
    ballSpeed: 138.4,
    attackAngle: 2.1,
    clubPath: -1.8,
    tempo: "moderate",
    missPattern: "fade/slice",
    spinTendency: "high",
    currentEquipment: "TaylorMade Qi10 LS 9°, Fujikura Ventus Blue 6-S",
    timeSinceLastFitting: "16 months",
    swingChanges: [
      "Attack angle steepened from +3.2° to +2.1° over last 4 months of coaching",
      "Club speed increased 2.3 mph since last fitting",
      "Weight shift improved — less early extension, more consistent low-point",
    ],
  },
  optimalWindow: {
    launchAngle: { min: 11.5, max: 14.0, ideal: 12.8 },
    spinRate: { min: 2200, max: 2700, ideal: 2450 },
    ballSpeed: { min: 140, max: 148, ideal: 144 },
    carry: { min: 230, max: 250, ideal: 242 },
    landingAngle: { min: 35, max: 42, ideal: 38 },
  },
};
