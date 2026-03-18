export interface LiveFittingInsight {
  id: string;
  timestamp: string;
  type: "recommendation" | "observation" | "alert" | "comparison";
  icon: string;
  title: string;
  body: string;
  confidence: number;
  dataPoints?: string;
  priority: "high" | "medium" | "low";
}

export const liveFittingInsights: LiveFittingInsight[] = [
  {
    id: "ins-1", timestamp: "10:05", type: "observation", icon: "TrendingUp",
    title: "Spin Rate Above Optimal",
    body: "Current driver spin averaging 2,850 rpm. For this golfer's speed (95 mph) and attack angle (+2.1°), optimal range is 2,200-2,700 rpm. Current shaft may be too soft in the tip section.",
    confidence: 91, dataPoints: "Based on 18,200 golfers in speed range 93-97 mph", priority: "high",
  },
  {
    id: "ins-2", timestamp: "10:12", type: "recommendation", icon: "Crosshair",
    title: "Try Ventus Blue 6S",
    body: "Among golfers with similar speed, attack angle, and fade tendency, Fujikura Ventus Blue 6S reduced spin by an average of 340 rpm while maintaining launch angle within 0.5° — resulting in 8+ yards more carry.",
    confidence: 87, dataPoints: "Based on 12,400 similar golfer fittings", priority: "high",
  },
  {
    id: "ins-3", timestamp: "10:18", type: "alert", icon: "AlertCircle",
    title: "Swing Change Since Last Fitting",
    body: "Coaching record shows attack angle steepened from +3.2° to +2.1° over 4 months. This changes the optimal loft recommendation — current 9° may now be under-lofted. Consider 10.5° with new attack angle.",
    confidence: 84, dataPoints: "From 6 coaching sessions over 4 months", priority: "high",
  },
  {
    id: "ins-4", timestamp: "10:25", type: "comparison", icon: "BarChart3",
    title: "Shaft A vs Shaft B: Clear Winner",
    body: "After 8 shots with Ventus Blue and 6 with Tensei White: Ventus is +5.2 yards carry, -200 rpm spin, and 18 vs 22 yard dispersion. For this golfer's improving swing, the lower-spin profile of the Ventus will perform better as club speed continues to increase.",
    confidence: 89, dataPoints: "Live session data + predictive model", priority: "medium",
  },
  {
    id: "ins-5", timestamp: "10:31", type: "observation", icon: "Target",
    title: "Impact Pattern Improving",
    body: "Strike location has moved 3mm toward center over the last 5 shots. This is consistent with the coaching record — weight shift work is translating to more centered contact. Expect smash factor to improve further as this pattern stabilizes.",
    confidence: 76, dataPoints: "Session trend + coaching record correlation", priority: "low",
  },
  {
    id: "ins-6", timestamp: "10:38", type: "recommendation", icon: "CheckCircle",
    title: "Final Recommendation: Qi10 10.5° + Ventus Blue 6S",
    body: "AI confidence: 92%. This combination is in the top 5% of outcomes for golfers with this profile. Predicted on-course improvement: +12 yards off the tee, 18% tighter fairway dispersion. The model also predicts this setup will age well — as this golfer's speed continues to increase from coaching work, the Ventus Blue's profile will scale with them.",
    confidence: 92, dataPoints: "Final recommendation based on session data + 12,400 comparable fittings + coaching trajectory", priority: "high",
  },
];
