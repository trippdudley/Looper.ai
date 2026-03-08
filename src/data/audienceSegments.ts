export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  growthRate: string;
  estimatedCPM: number;
  annualValue: number;
  targetingCriteria: string[];
  interestedPartners: string[];
  dataSignals: string[];
}

export const audienceSegments: AudienceSegment[] = [
  { id: "seg-1", name: "In-Market Driver Buyers", description: "Golfers actively working on driver with coach, swing speed changing, or 18+ months since last driver purchase", size: 4200, growthRate: "+8%/mo", estimatedCPM: 48, annualValue: 145000, targetingCriteria: ["3+ driver-focused coaching sessions in last 90 days", "Club speed change >3 mph", "Driver age >18 months"], interestedPartners: ["TaylorMade", "Callaway", "Titleist", "PING", "Cobra"], dataSignals: ["Coaching focus: driver", "Club speed trend: increasing", "Equipment age: stale"] },
  { id: "seg-2", name: "Fitting-Ready Golfers", description: "Swing metrics have shifted significantly since last fitting — strong re-fit signal", size: 2800, growthRate: "+6%/mo", estimatedCPM: 55, annualValue: 112000, targetingCriteria: ["Attack angle change >1.5\u00b0 since last fitting", "No fitting in 12+ months", "Active coaching relationship"], interestedPartners: ["Club Champion", "True Spec", "PING", "Titleist"], dataSignals: ["Attack angle delta", "Fitting recency", "Swing evolution rate"] },
  { id: "seg-3", name: "Rapid Improvers", description: "Golfers whose handicap or key metrics have improved significantly in last 90 days — high engagement, receptive to upgrade", size: 6500, growthRate: "+12%/mo", estimatedCPM: 42, annualValue: 198000, targetingCriteria: ["Handicap improved 2+ strokes in 90 days", "Practice frequency >2x/week", "3+ coaching sessions in 90 days"], interestedPartners: ["Titleist", "Acushnet", "Callaway", "TravisMathew", "FootJoy"], dataSignals: ["Handicap trend: accelerating", "Practice frequency: high", "Session engagement: high"] },
  { id: "seg-4", name: "New Golfers (< 2 years)", description: "Golfers early in their journey — high equipment and lesson spend propensity", size: 8200, growthRate: "+15%/mo", estimatedCPM: 35, annualValue: 210000, targetingCriteria: ["GHIN handicap established <24 months", "Handicap >20", "Active lesson-taking"], interestedPartners: ["Callaway", "Cleveland/Srixon", "Golf Galaxy", "PGA Superstore", "GolfNow"], dataSignals: ["Account age", "Handicap level", "Lesson frequency"] },
  { id: "seg-5", name: "Competitive Players", description: "Single-digit handicaps with active coaching and on-course tracking — premium, discerning audience", size: 3100, growthRate: "+5%/mo", estimatedCPM: 52, annualValue: 118000, targetingCriteria: ["Handicap <10", "Arccos or on-course tracking active", "Tournament scoring history"], interestedPartners: ["Titleist", "Scotty Cameron", "Vokey", "KBS Shafts", "True Spec"], dataSignals: ["Handicap: single digit", "On-course data: active", "Equipment: premium tier"] },
  { id: "seg-6", name: "Golf Travelers", description: "Golfers who play multiple courses, travel for golf, high household income indicators", size: 5400, growthRate: "+7%/mo", estimatedCPM: 45, annualValue: 175000, targetingCriteria: ["Rounds at 5+ unique courses in 12 months", "Active booking history", "Premium equipment profile"], interestedPartners: ["Bandon Dunes", "Pinehurst", "Cabot", "Golf Advisor", "Ship Sticks", "American Express"], dataSignals: ["Course diversity", "Booking frequency", "Equipment tier"] },
];
