export interface Golfer {
  id: string;
  name: string;
  email: string;
  handicapIndex: number;
  handicapTrend: number[];
  memberSince: string;
  coachId: string;
  profileImage?: string;
  body: {
    height: string;
    weight: string;
    dominantHand: "right" | "left";
    flexibility: "limited" | "average" | "above-average";
    injuryNotes?: string;
  };
  equipment: {
    driver: string;
    fairwayWoods: string;
    hybrids: string;
    irons: string;
    wedges: string;
    putter: string;
    ball: string;
    lastFittingDate: string;
  };
  connectedSystems: string[];
  goals: string[];
  currentFocus: string;
  improvementScore: number;
  sessionsCompleted: number;
  practiceFrequency: string;
  roundsPerMonth: number;
}

export const golfers: Golfer[] = [
  {
    id: "golfer-mike",
    name: "Mike Reynolds",
    email: "mike.reynolds@email.com",
    handicapIndex: 15.2,
    handicapTrend: [18.1, 17.4, 16.8, 16.2, 15.9, 15.2],
    memberSince: "2025-09-15",
    coachId: "coach-austin",
    body: {
      height: "5'10\"",
      weight: "185 lbs",
      dominantHand: "right",
      flexibility: "average",
      injuryNotes: "Mild lower back tightness",
    },
    equipment: {
      driver: "TaylorMade Qi10 Max 10.5\u00b0 \u2014 Fujikura Ventus Blue 5-S",
      fairwayWoods: "TaylorMade Qi10 3W 15\u00b0, 5W 18\u00b0",
      hybrids: "TaylorMade Qi10 4H 22\u00b0",
      irons: "TaylorMade P790 5-PW \u2014 KBS Tour Lite S",
      wedges: "TaylorMade MG4 50\u00b0, 54\u00b0, 58\u00b0",
      putter: "Odyssey White Hot OG #7",
      ball: "Titleist Pro V1",
      lastFittingDate: "2025-04-20",
    },
    connectedSystems: ["trackman", "arccos", "ghin"],
    goals: ["Break 80", "Consistent ball striking", "Better course management"],
    currentFocus: "Driver consistency and weight transfer",
    improvementScore: 72,
    sessionsCompleted: 6,
    practiceFrequency: "2-3x per week",
    roundsPerMonth: 4,
  },
  {
    id: "golfer-sarah-c",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    handicapIndex: 22.0,
    handicapTrend: [28.5, 26.2, 24.8, 23.5, 22.8, 22.0],
    memberSince: "2025-11-01",
    coachId: "coach-austin",
    body: {
      height: "5'5\"",
      weight: "130 lbs",
      dominantHand: "right",
      flexibility: "above-average",
    },
    equipment: {
      driver: "Callaway Paradym Ai Smoke Max D 12\u00b0",
      fairwayWoods: "Callaway Paradym 5W",
      hybrids: "Callaway Paradym 5H, 6H",
      irons: "Callaway Rogue ST Max OS 7-PW \u2014 Graphite L",
      wedges: "Callaway Jaws 52\u00b0, 56\u00b0",
      putter: "Odyssey Eleven S",
      ball: "Callaway Chrome Soft",
      lastFittingDate: "2025-10-15",
    },
    connectedSystems: ["trackman", "ghin"],
    goals: ["Break 100 consistently", "Learn proper grip", "Enjoy the game"],
    currentFocus: "Grip fundamentals and takeaway",
    improvementScore: 68,
    sessionsCompleted: 4,
    practiceFrequency: "1-2x per week",
    roundsPerMonth: 2,
  },
  {
    id: "golfer-james",
    name: "James Okafor",
    email: "james.okafor@email.com",
    handicapIndex: 9.1,
    handicapTrend: [11.2, 10.8, 10.1, 9.8, 9.4, 9.1],
    memberSince: "2025-06-01",
    coachId: "coach-austin",
    body: {
      height: "6'1\"",
      weight: "195 lbs",
      dominantHand: "right",
      flexibility: "above-average",
    },
    equipment: {
      driver: "Titleist GT2 9.5\u00b0 \u2014 Project X HZRDUS Black 6.0",
      fairwayWoods: "Titleist GT2 3W 15\u00b0",
      hybrids: "Titleist TSR2 21\u00b0",
      irons: "Titleist T200 4-PW \u2014 True Temper AMT S300",
      wedges: "Titleist Vokey SM10 48\u00b0, 52\u00b0, 56\u00b0, 60\u00b0",
      putter: "Scotty Cameron Phantom X 5",
      ball: "Titleist Pro V1x",
      lastFittingDate: "2025-08-10",
    },
    connectedSystems: ["trackman", "arccos", "ghin", "foresight"],
    goals: ["Scratch handicap", "Qualify for amateur events", "Short game mastery"],
    currentFocus: "Wedge distance control and spin consistency",
    improvementScore: 81,
    sessionsCompleted: 12,
    practiceFrequency: "4-5x per week",
    roundsPerMonth: 8,
  },
  {
    id: "golfer-linda",
    name: "Linda Park",
    email: "linda.park@email.com",
    handicapIndex: 18.5,
    handicapTrend: [22.0, 21.1, 20.3, 19.7, 19.0, 18.5],
    memberSince: "2025-10-01",
    coachId: "coach-sarah",
    body: {
      height: "5'6\"",
      weight: "140 lbs",
      dominantHand: "right",
      flexibility: "limited",
      injuryNotes: "Previous shoulder surgery (2023)",
    },
    equipment: {
      driver: "PING G430 Max 10.5\u00b0 \u2014 PING Alta CB 55 R",
      fairwayWoods: "PING G430 Max 3W, 5W",
      hybrids: "PING G430 4H, 5H",
      irons: "PING G430 6-PW \u2014 Graphite R",
      wedges: "PING Glide 4.0 50\u00b0, 54\u00b0, 58\u00b0",
      putter: "PING Anser 2",
      ball: "Bridgestone Tour B RXS",
      lastFittingDate: "2025-09-20",
    },
    connectedSystems: ["foresight", "ghin"],
    goals: ["Break 90", "More consistent contact", "Better putting"],
    currentFocus: "Iron contact and green reading",
    improvementScore: 65,
    sessionsCompleted: 5,
    practiceFrequency: "1-2x per week",
    roundsPerMonth: 3,
  },
];
