export interface DataAttribute {
  attribute: string;
  category: "identity" | "biomechanical" | "performance" | "equipment" | "behavioral" | "coaching" | "wellness";
  sources: string[];
  freshness: "real-time" | "per-session" | "per-round" | "daily" | "monthly";
  monetizationRelevance: "high" | "medium" | "low";
  description: string;
}

export const dataCatalog: DataAttribute[] = [
  // IDENTITY
  { attribute: "Golfer Synthetic ID", category: "identity", sources: ["looper-core"], freshness: "real-time", monetizationRelevance: "high", description: "Unique, privacy-safe identifier linking all data sources to one golfer" },
  { attribute: "Handicap Index", category: "identity", sources: ["ghin", "arccos"], freshness: "daily", monetizationRelevance: "high", description: "Official USGA handicap — skill level proxy" },
  { attribute: "Body Profile", category: "identity", sources: ["looper-core"], freshness: "monthly", monetizationRelevance: "medium", description: "Height, weight, flexibility, injury history" },
  { attribute: "Golf Tenure", category: "identity", sources: ["ghin", "looper-core"], freshness: "monthly", monetizationRelevance: "high", description: "How long the golfer has been playing" },
  // BIOMECHANICAL
  { attribute: "Club Speed (by club)", category: "biomechanical", sources: ["trackman", "foresight", "arccos"], freshness: "per-session", monetizationRelevance: "high", description: "Swing speed trends across clubs" },
  { attribute: "Attack Angle", category: "biomechanical", sources: ["trackman", "foresight"], freshness: "per-session", monetizationRelevance: "high", description: "Vertical club delivery — critical for fitting" },
  { attribute: "Club Path", category: "biomechanical", sources: ["trackman", "foresight"], freshness: "per-session", monetizationRelevance: "medium", description: "Horizontal club delivery — swing shape indicator" },
  { attribute: "Face Angle", category: "biomechanical", sources: ["trackman", "foresight"], freshness: "per-session", monetizationRelevance: "medium", description: "Club face orientation at impact" },
  { attribute: "Spin Rate Profile", category: "biomechanical", sources: ["trackman", "foresight"], freshness: "per-session", monetizationRelevance: "high", description: "Spin rates by club — ball selection and fitting signal" },
  { attribute: "3D Body Motion", category: "biomechanical", sources: ["sportsbox"], freshness: "per-session", monetizationRelevance: "low", description: "Pelvis/chest rotation, weight shift, kinematic sequence" },
  // PERFORMANCE
  { attribute: "Strokes Gained (by category)", category: "performance", sources: ["arccos", "shotscope"], freshness: "per-round", monetizationRelevance: "high", description: "Off the tee, approach, around the green, putting" },
  { attribute: "Scoring Average", category: "performance", sources: ["ghin", "arccos"], freshness: "per-round", monetizationRelevance: "medium", description: "Recent scoring trend" },
  { attribute: "Handicap Trend", category: "performance", sources: ["ghin"], freshness: "daily", monetizationRelevance: "high", description: "Direction and velocity of handicap change" },
  { attribute: "Proximity to Hole (approach)", category: "performance", sources: ["arccos"], freshness: "per-round", monetizationRelevance: "medium", description: "Iron performance indicator" },
  { attribute: "Putts per Round", category: "performance", sources: ["arccos", "shotscope"], freshness: "per-round", monetizationRelevance: "medium", description: "Putting performance trend" },
  // EQUIPMENT
  { attribute: "Current Bag Inventory", category: "equipment", sources: ["looper-core", "arccos", "club-champion"], freshness: "monthly", monetizationRelevance: "high", description: "Make, model, shaft, specs for all 14 clubs" },
  { attribute: "Last Fitting Date", category: "equipment", sources: ["looper-core", "club-champion"], freshness: "monthly", monetizationRelevance: "high", description: "Recency of last professional fitting" },
  { attribute: "Equipment Age", category: "equipment", sources: ["looper-core"], freshness: "monthly", monetizationRelevance: "high", description: "Time since each club was purchased/fitted" },
  { attribute: "Ball Type", category: "equipment", sources: ["looper-core"], freshness: "monthly", monetizationRelevance: "medium", description: "Current golf ball brand and model" },
  // BEHAVIORAL
  { attribute: "Lesson Frequency", category: "behavioral", sources: ["looper-core"], freshness: "real-time", monetizationRelevance: "high", description: "How often the golfer takes coaching sessions" },
  { attribute: "Practice Frequency", category: "behavioral", sources: ["looper-core", "arccos"], freshness: "real-time", monetizationRelevance: "high", description: "Range sessions and practice rounds per week" },
  { attribute: "Rounds per Month", category: "behavioral", sources: ["ghin", "arccos", "golfnow"], freshness: "monthly", monetizationRelevance: "high", description: "On-course playing frequency" },
  { attribute: "Course Diversity", category: "behavioral", sources: ["arccos", "ghin"], freshness: "monthly", monetizationRelevance: "medium", description: "Number of unique courses played — travel propensity" },
  { attribute: "Session Engagement Depth", category: "behavioral", sources: ["looper-core"], freshness: "per-session", monetizationRelevance: "medium", description: "How deeply golfer engages with post-session content" },
  // COACHING
  { attribute: "Active Coaching Focus", category: "coaching", sources: ["looper-core"], freshness: "per-session", monetizationRelevance: "high", description: "What the golfer is currently working on with their coach" },
  { attribute: "Drill Activity", category: "coaching", sources: ["looper-core"], freshness: "real-time", monetizationRelevance: "medium", description: "Which drills the golfer is practicing between sessions" },
  { attribute: "Coaching Outcome Velocity", category: "coaching", sources: ["looper-core"], freshness: "per-session", monetizationRelevance: "medium", description: "How fast the golfer improves on coached metrics" },
  { attribute: "Fault History", category: "coaching", sources: ["looper-core"], freshness: "per-session", monetizationRelevance: "medium", description: "All faults identified across coaching history" },
  // WELLNESS
  { attribute: "Recovery Score", category: "wellness", sources: ["whoop"], freshness: "daily", monetizationRelevance: "low", description: "Physical readiness indicator" },
  { attribute: "Flexibility Profile", category: "wellness", sources: ["looper-core", "apple-health"], freshness: "monthly", monetizationRelevance: "low", description: "Range of motion relevant to swing mechanics" },
];
