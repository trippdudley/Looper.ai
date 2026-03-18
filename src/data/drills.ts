export interface Drill {
  id: string;
  name: string;
  focus: string;
  description: string;
  duration: string;
  reps: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  targetFault: string;
  instructions: string[];
}

export const drills: Drill[] = [
  {
    id: "drill-step",
    name: "Step Drill",
    focus: "Weight Transfer",
    description: "Step forward with lead foot as you start the downswing to train proper weight shift and sequencing.",
    duration: "10 min",
    reps: "20 reps",
    difficulty: "beginner",
    targetFault: "Reverse pivot / hanging back",
    instructions: [
      "Set up to the ball with feet together",
      "Make a backswing, lifting your lead foot slightly",
      "Step toward the target with your lead foot to start the downswing",
      "Swing through, feeling the weight move to your lead side",
      "The step triggers the kinetic chain \u2014 hips, then torso, then arms",
    ],
  },
  {
    id: "drill-pump",
    name: "Pump Drill",
    focus: "Transition & Sequencing",
    description: "Rehearse the transition from backswing to downswing without hitting the ball. Builds proper sequencing feel.",
    duration: "10 min",
    reps: "15 reps",
    difficulty: "intermediate",
    targetFault: "Over-the-top / casting",
    instructions: [
      "Take the club to the top of the backswing",
      "Start the downswing, stopping when hands reach hip height",
      "Return to the top of the backswing",
      "Repeat the pump 2-3 times, then swing through on the final rep",
      "Feel the club dropping into the slot on each pump",
    ],
  },
  {
    id: "drill-alignment-gate",
    name: "Alignment Stick Gate",
    focus: "Club Path & Face Control",
    description: "Place two alignment sticks in the ground to create a gate for the club to swing through, promoting proper path.",
    duration: "15 min",
    reps: "25 reps",
    difficulty: "intermediate",
    targetFault: "Inconsistent club path",
    instructions: [
      "Place two alignment sticks in the ground, angled toward target line",
      "Space them just wider than your club head",
      "Make swings, focusing on delivering the club through the gate",
      "If you hit the outside stick, your path is too out-to-in",
      "If you hit the inside stick, your path is too in-to-out",
    ],
  },
  {
    id: "drill-towel",
    name: "Towel Under Arms",
    focus: "Connection & Body-Arm Sync",
    description: "Place a towel under both armpits to maintain connection between arms and body throughout the swing.",
    duration: "10 min",
    reps: "20 reps",
    difficulty: "beginner",
    targetFault: "Flying elbow / disconnection",
    instructions: [
      "Fold a hand towel and place it under both armpits",
      "Make half swings, keeping the towel in place",
      "If the towel drops, your arms are disconnecting from your body",
      "Gradually increase swing length while maintaining connection",
      "Focus on turning your body, not swinging your arms independently",
    ],
  },
  {
    id: "drill-9to3",
    name: "9-to-3 Pitch Shots",
    focus: "Short Game & Distance Control",
    description: "Hit pitch shots with a 9 o'clock to 3 o'clock swing length to develop distance control and clean contact.",
    duration: "15 min",
    reps: "30 reps",
    difficulty: "beginner",
    targetFault: "Poor distance control / chunked pitches",
    instructions: [
      "Use your 54\u00b0 or 56\u00b0 wedge",
      "Swing back to 9 o'clock (arms parallel to ground)",
      "Swing through to 3 o'clock (mirror finish)",
      "Focus on consistent tempo \u2014 back and through should be equal length",
      "Pick targets at 30, 40, and 50 yards and try to land on each",
    ],
  },
];
