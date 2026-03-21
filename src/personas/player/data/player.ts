// Moe Norman — sample player data

export const player = {
  name: 'Moe Norman',
  handicap: 12.4,
  handicapDelta: -1.8,
  handicapHistory: [18.6, 17.8, 16.2, 15.8, 15.1, 14.6, 14.2, 13.8, 13.1, 12.4],
  playerQuality: 68,
  roundsThisYear: 24,

  coach: {
    name: 'M. Thompson',
    plan: 'Iron accuracy \u2014 face-to-path consistency',
    phase: 3,
    totalPhases: 6,
    nextSession: 'Thu, Mar 22 at 2:00 PM',
    sessionsCompleted: 8,
  },

  strokesGained: {
    driving:   +0.3,
    approach:  -1.4,
    shortGame: -0.2,
    putting:   +0.1,
    benchmark: '10-handicap',
    sampleSize: '10 rounds',
  },

  equipment: {
    driver:  'TaylorMade Qi10 LS 9\u00B0 / Tensei 1K White 65TX',
    irons:   'Titleist T200 / KBS Tour 120S',
    wedges:  'Vokey SM10 50/54/58',
    putter:  'Scotty Cameron Phantom X 5.5',
    ball:    'Titleist Pro V1x',
    lastFitting: 'Jan 15, 2026',
  },
};
