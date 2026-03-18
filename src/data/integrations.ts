export interface Integration {
  id: string;
  name: string;
  category: "launch-monitor" | "on-course" | "handicap" | "coaching" | "fitting" | "video" | "wearable" | "booking";
  status: "connected" | "available" | "coming-soon";
  description: string;
  dataTypes: string[];
  color: string;
  lastSync?: string;
}

export const integrations: Integration[] = [
  // LAUNCH MONITORS
  { id: "trackman", name: "Trackman", category: "launch-monitor", status: "connected", description: "Dual radar launch monitor — club and ball data", dataTypes: ["Club Speed", "Ball Speed", "Launch Angle", "Spin Rate", "Carry", "Club Path", "Face Angle", "Attack Angle", "Impact Location", "Smash Factor"], color: "#E63946", lastSync: "2026-03-08T11:30:00" },
  { id: "foresight", name: "Foresight GCQuad", category: "launch-monitor", status: "connected", description: "Photometric launch monitor — ball and club data", dataTypes: ["Ball Speed", "Launch Angle", "Spin Rate", "Carry", "Total", "Club Speed", "Face Angle", "Club Path", "Smash Factor", "Spin Axis"], color: "#1D3557", lastSync: "2026-03-07T16:00:00" },
  { id: "uneekor", name: "Uneekor", category: "launch-monitor", status: "available", description: "Overhead launch monitor with AI Trainer", dataTypes: ["Ball Speed", "Launch Angle", "Spin Rate", "Carry", "Club Data", "Swing Video"], color: "#457B9D" },
  { id: "flightscope", name: "FlightScope Mevo+", category: "launch-monitor", status: "available", description: "Portable radar launch monitor", dataTypes: ["Ball Speed", "Launch Angle", "Spin Rate", "Carry", "Club Speed"], color: "#2A9D8F" },
  { id: "fullswing", name: "Full Swing KIT", category: "launch-monitor", status: "coming-soon", description: "Infrared launch monitor", dataTypes: ["Ball Speed", "Launch Angle", "Spin Rate", "Carry"], color: "#264653" },
  { id: "garmin-r10", name: "Garmin Approach R10", category: "launch-monitor", status: "available", description: "Portable radar for home use", dataTypes: ["Ball Speed", "Launch Angle", "Spin Rate", "Carry", "Club Path"], color: "#0077B6" },
  // ON-COURSE TRACKING
  { id: "arccos", name: "Arccos", category: "on-course", status: "connected", description: "AI-powered shot tracking — 1.5B shots analyzed", dataTypes: ["Shot Location GPS", "Club Used", "Strokes Gained", "Club Distances", "Scoring Patterns", "Dispersion", "Proximity to Hole", "Putts per Round"], color: "#2ECC71", lastSync: "2026-03-06T18:45:00" },
  { id: "shotscope", name: "Shot Scope", category: "on-course", status: "available", description: "GPS shot tracking watch + tags", dataTypes: ["Shot Location", "Club Used", "Distances", "Strokes Gained", "Round Statistics"], color: "#E67E22" },
  { id: "garmin-watch", name: "Garmin Golf Watch", category: "on-course", status: "available", description: "GPS watch with shot tracking", dataTypes: ["Shot Location", "Club Used", "Distances", "Course GPS"], color: "#0077B6" },
  // HANDICAP
  { id: "ghin", name: "GHIN / USGA", category: "handicap", status: "connected", description: "Official USGA Handicap Index", dataTypes: ["Handicap Index", "Score History", "Score Differentials", "Handicap Trend", "Course Ratings", "Active/Inactive Season"], color: "#003049", lastSync: "2026-03-05T12:00:00" },
  // COACHING
  { id: "sportsbox", name: "Sportsbox AI", category: "coaching", status: "available", description: "3D motion capture from phone camera", dataTypes: ["3D Body Motion", "Kinematic Sequence", "Pelvis/Chest Turn", "Spine Angle", "Weight Shift"], color: "#6C5CE7" },
  { id: "coachnow", name: "CoachNow", category: "coaching", status: "available", description: "Async video coaching platform", dataTypes: ["Lesson Videos", "Coach Notes", "Drill Assignments"], color: "#00B894" },
  { id: "v1sports", name: "V1 Sports", category: "video", status: "available", description: "Video analysis platform", dataTypes: ["Swing Video", "Draw Tools Overlay", "Side-by-Side Comparison"], color: "#FDCB6E" },
  { id: "onform", name: "OnForm", category: "video", status: "coming-soon", description: "Video analysis with auto-crop", dataTypes: ["Swing Video", "Slow Motion", "Comparison"], color: "#636E72" },
  // FITTING
  { id: "club-champion", name: "Club Champion", category: "fitting", status: "available", description: "Premium club fitting network", dataTypes: ["Fitting Session Data", "Club Specs", "Shaft Data", "Head Recommendations"], color: "#B71C1C" },
  { id: "ping-nflight", name: "PING nFlight", category: "fitting", status: "coming-soon", description: "PING fitting system", dataTypes: ["Dot Color", "Shaft Recommendation", "Head Selection", "Fitting Metrics"], color: "#1565C0" },
  { id: "true-spec", name: "True Spec Golf", category: "fitting", status: "coming-soon", description: "Boutique fitting studio network", dataTypes: ["Full Bag Fitting Data", "Shaft Testing Data"], color: "#4A148C" },
  // WEARABLE / WELLNESS
  { id: "whoop", name: "WHOOP", category: "wearable", status: "coming-soon", description: "Recovery and strain tracking", dataTypes: ["Recovery Score", "HRV", "Sleep Quality", "Strain", "Readiness"], color: "#00BFA5" },
  { id: "apple-health", name: "Apple Health", category: "wearable", status: "available", description: "Health and fitness data", dataTypes: ["Step Count", "Active Energy", "Heart Rate", "Flexibility Assessment"], color: "#FF2D55" },
  // BOOKING
  { id: "golfnow", name: "GolfNow", category: "booking", status: "coming-soon", description: "Tee time booking", dataTypes: ["Rounds Played", "Courses Visited", "Booking Frequency"], color: "#43A047" },
];
