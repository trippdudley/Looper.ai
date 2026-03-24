// ─── Sidebar Upgrade: Tokens & Step Data ─────────────────────────
// Color tokens, font stacks, 7-step demo content, mock chat responses

/** Copilot Dark — Looper sidebar tokens */
export const CD = {
  bg:        '#0C1117',
  surface:   '#151D28',
  surfaceAlt:'#1E2A36',
  border:    '#1E2A36',
  borderSub: '#253342',
  accent:    '#10B981',
  accentHov: '#34D399',
  accentBg:  'rgba(16,185,129,0.08)',
  ink:       '#E8ECF1',
  body:      '#8B99A8',
  muted:     '#5E6E7E',
  dim:       '#3A4856',
  conf:      '#10B981',
  confBg:    'rgba(16,185,129,0.12)',
  caution:   '#EAB308',
  cautionBg: 'rgba(234,179,8,0.10)',
  flag:      '#EF4444',
  flagBg:    'rgba(239,68,68,0.10)',
} as const;

/** TrackMan Performance Studio wireframe tokens */
export const TPS = {
  bg:      '#1A1A1A',
  navBg:   '#2A2A2A',
  surface: '#242424',
  border:  '#3A3A3A',
  accent:  '#E8862A',
  text:    '#FFFFFF',
  textSec: '#999999',
  textDim: '#666666',
  green:   '#4CAF50',
  skyBlue: '#87CEEB',
} as const;

/** Font stacks */
export const F = {
  brand: "'DM Sans', system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', 'SF Mono', monospace",
  tps:   "'Helvetica Neue', Arial, sans-serif",
} as const;

// ─── Phase Types ─────────────────────────────────────────────────

export type Phase = 'context' | 'analysis' | 'working' | 'summary';

export const PHASES: { key: Phase; label: string }[] = [
  { key: 'context',  label: 'Context' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'working',  label: 'Working' },
  { key: 'summary',  label: 'Summary' },
];

// ─── Card Types ──────────────────────────────────────────────────

export interface CardData {
  id: string;
  title?: string;
  body: string;
  secondaryBody?: string;
  confidence?: number;
  borderColor?: string;
  isBright?: boolean; // highlight line in brighter ink
}

export interface DrillData {
  name: string;
  type: string;
  typeBadgeColor: string;
  typeBadgeBg: string;
  description: string;
  whyText: string;
  confidence: number;
}

export interface StepDef {
  phase: Phase;
  thinkingText: string;
  thinkingSpeed?: number;
  cards: CardData[];
  drills?: DrillData[];
  altDrill?: { name: string; type: string; description: string; confidence: number };
  summaryBullets?: string[];
  carryForward?: string[];
  chips: string[];
  chatResponses: Record<string, string>;
}

// ─── 7-Step Demo Data ────────────────────────────────────────────

export const STEPS: StepDef[] = [
  // ── STEP 1: CONTEXT ──
  {
    phase: 'context',
    thinkingText: 'Loading session context...',
    thinkingSpeed: 25,
    cards: [
      {
        id: 'ctx-briefing',
        title: 'Session 9 \u2014 Moe Norman',
        body: 'Last session (Mar 18): Gate drill for strike centering. Toe bias improving. Approach SG at +0.2.',
        secondaryBody: 'Practice: Gate drill 2/3, alignment rod 1/2, tempo drill not started.',
        confidence: 78,
        borderColor: CD.accent,
      },
      {
        id: 'ctx-focus',
        body: 'Suggested focus: Driver. Approach gains consolidating \u2014 driver SG at -2.3, trending worse across all 8 sessions.',
        borderColor: CD.accent,
        isBright: true,
      },
    ],
    chips: [],
    chatResponses: {},
  },

  // ── STEP 2: QUIET ──
  {
    phase: 'analysis',
    thinkingText: 'Observing...',
    thinkingSpeed: 25,
    cards: [
      {
        id: 'quiet-observe',
        body: 'Observing... 3 shots captured.',
        secondaryBody: 'Waiting for stable pattern.',
        borderColor: CD.dim,
      },
    ],
    chips: [],
    chatResponses: {},
  },

  // ── STEP 3: ANALYSIS — FORMING ──
  {
    phase: 'analysis',
    thinkingText: 'Analyzing strike pattern...',
    thinkingSpeed: 25,
    cards: [
      {
        id: 'analysis-forming',
        title: 'ANALYSIS',
        body: 'Face-to-path volatility: \u03C3 = 3.8\u00B0 across 6 shots. Strike location clustering 0.3" toe-side.',
        confidence: 52,
        borderColor: CD.flag,
      },
    ],
    chips: [
      'How does his strike compare to S8?',
      'What cue type works best for Moe?',
    ],
    chatResponses: {
      'How does his strike compare to S8?':
        'In S8, Moe\u2019s 7-iron strikes were clustering 0.4" toe-side. Today with driver, the toe bias is 0.3" \u2014 similar pattern, different club. The face awareness drill should transfer since it targets face control, not club-specific mechanics.',
      'What cue type works best for Moe?':
        'Based on 8 sessions, Moe responds best to external focus cues (gate drills, alignment sticks) rather than internal cues (wrist position, forearm rotation). Motor learning retention is 23% higher with external cues for this player.',
    },
  },

  // ── STEP 4: ANALYSIS — BUILDING ──
  {
    phase: 'analysis',
    thinkingText: 'Cross-referencing session history...',
    thinkingSpeed: 25,
    cards: [
      {
        id: 'analysis-forming',
        body: 'Face-to-path volatility: \u03C3 = 3.8\u00B0 across 6 shots. Strike location clustering 0.3" toe-side.',
        confidence: 52,
        borderColor: CD.flag,
      },
      {
        id: 'analysis-building',
        body: 'Driver face is 2.1\u00B0 open at impact with path 1.4\u00B0 out-to-in. Spin axis tilting right. Consistent with the toe-side strike pattern.',
        confidence: 71,
        borderColor: CD.caution,
      },
    ],
    chips: [
      'How does his strike compare to S8?',
      'What cue type works best for Moe?',
    ],
    chatResponses: {
      'How does his strike compare to S8?':
        'In S8, Moe\u2019s 7-iron strikes were clustering 0.4" toe-side. Today with driver, the toe bias is 0.3" \u2014 similar pattern, different club. The face awareness drill should transfer since it targets face control, not club-specific mechanics.',
      'What cue type works best for Moe?':
        'Based on 8 sessions, Moe responds best to external focus cues (gate drills, alignment sticks) rather than internal cues (wrist position, forearm rotation). Motor learning retention is 23% higher with external cues for this player.',
    },
  },

  // ── STEP 5: ANALYSIS — HIGH CONFIDENCE ──
  {
    phase: 'analysis',
    thinkingText: '',
    cards: [
      {
        id: 'analysis-key',
        title: 'Strike variability is the primary limiter.',
        body: 'Open face + toe contact is costing 12-15 yards carry and widening dispersion by ~8 yards.',
        secondaryBody: 'Driver SG trend: -1.5 \u2192 -2.3 over 8 sessions. Never directly addressed.',
        confidence: 87,
        borderColor: CD.conf,
      },
    ],
    chips: [
      'How does his strike compare to S8?',
      'What cue type works best for Moe?',
    ],
    chatResponses: {
      'How does his strike compare to S8?':
        'In S8, Moe\u2019s 7-iron strikes were clustering 0.4" toe-side. Today with driver, the toe bias is 0.3" \u2014 similar pattern, different club. The face awareness drill should transfer since it targets face control, not club-specific mechanics.',
      'What cue type works best for Moe?':
        'Based on 8 sessions, Moe responds best to external focus cues (gate drills, alignment sticks) rather than internal cues (wrist position, forearm rotation). Motor learning retention is 23% higher with external cues for this player.',
    },
  },

  // ── STEP 6: WORKING — DRILL SUGGESTION ──
  {
    phase: 'working',
    thinkingText: 'Analysis complete. Suggesting intervention.',
    thinkingSpeed: 25,
    cards: [],
    drills: [
      {
        name: 'Alignment Stick Face Awareness',
        type: 'EXTERNAL',
        typeBadgeColor: CD.conf,
        typeBadgeBg: CD.confBg,
        description: 'Promotes face awareness through visual gate. Targets the open-face pattern without internal cue overload.',
        whyText: 'External focus cues outperform internal cues for motor learning retention. This drill addresses face control without introducing swing thoughts about wrist or forearm position.',
        confidence: 74,
      },
    ],
    altDrill: {
      name: 'Headcover Gate Drill',
      type: 'CONSTRAINT',
      description: 'Narrows the swing path corridor.',
      confidence: 68,
    },
    chips: [
      'Why this drill?',
      'Is this improvement real or noise?',
      'What should I flag for next time?',
    ],
    chatResponses: {
      'Why this drill?':
        'Alignment Stick Face Awareness targets face control with an external focus cue. Moe has 23% better retention with external cues vs internal ones across 8 sessions. The visual gate provides immediate feedback without conscious swing manipulation.',
      'Is this improvement real or noise?':
        'After 8 reps with the alignment stick, face angle moved from 2.1\u00B0 open to 0.7\u00B0 open (\u03C3 reduced from 1.8\u00B0 to 1.2\u00B0). With 8 reps, confidence is moderate (68%) that this is a real shift. Recommend 3+ practice sessions to confirm.',
      'What should I flag for next time?':
        'Flag three things: 1) Whether face angle gains hold in practice without the alignment stick. 2) Tempo drill still untouched \u2014 address in S10. 3) Monitor if iron strike improvements (gate drill) degrade while focusing on driver.',
    },
  },

  // ── STEP 7: SUMMARY ──
  {
    phase: 'summary',
    thinkingText: '',
    cards: [],
    summaryBullets: [
      'Primary finding: Open face + toe contact pattern driving driver underperformance',
      'Intervention: Alignment Stick Face Awareness \u2014 8 reps. Face angle improved 1.4\u00B0 toward square',
      'Next steps: Continue face awareness drill 2-3 practice sessions. Monitor with slow-motion video.',
    ],
    carryForward: [
      'Driver face control thread opened \u2014 first direct intervention',
      'Gate drill for irons: maintain, don\u2019t expand. Approach gains consolidating.',
      'Tempo drill still untouched \u2014 flag for Session 10',
    ],
    chips: [],
    chatResponses: {},
  },
];

// ─── TPS Static Metrics ──────────────────────────────────────────

export interface TPSMetric {
  label: string;
  value: string;
  unit: string;
}

export const TPS_METRICS: TPSMetric[] = [
  { label: 'CARRY',        value: '228.4',  unit: 'yds' },
  { label: 'TOTAL',        value: '241.2',  unit: 'yds' },
  { label: 'CLUB SPEED',   value: '104.1',  unit: 'mph' },
  { label: 'FACE TO PATH', value: '-2.1',   unit: 'deg' },
  { label: 'CLUB PATH',    value: '-1.8',   unit: 'deg' },
  { label: 'ATTACK ANG.',  value: '-1.2',   unit: 'deg' },
  { label: 'SPIN RATE',    value: '3,120',  unit: 'rpm' },
  { label: 'FACE ANG.',    value: '1.4',    unit: 'deg' },
];
