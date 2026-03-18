---
name: looper-ux-system
description: "Looper.AI UX Design System — the complete implementation reference for building Looper.AI product interfaces. Use this skill whenever building any Looper.AI UI: fitting engine dashboards, coaching OS panels, session views, player reports, data visualizations, or any interactive product artifact. Also trigger when the user asks to build a prototype, mockup, dashboard, or interactive component for Looper.AI, or references the Looper design system, component library, or visual patterns. If the output is a working UI or product screen, this skill applies."
---

# Looper.AI UX Design System

A reusable implementation reference for building Looper.AI product interfaces — fitting engine, coaching OS, session views, player reports, and interactive prototypes.

Read this file completely before building any Looper.AI product UI.

---

## 1. Design Philosophy

Looper.AI is a decision platform used by golf coaches and club fitters during real sessions. The product UI is a precision instrument — alive, data-dense, and respectful of the practitioner's authority.

### Core Principles

**Neutral instrumentation.** The UI is a clinical readout, not a judge. In coaching, the definition of "good" changes swing to swing — a 50% effort drill swing with dead-center contact is the best shot of the session even if carry dropped 40 yards. Metrics display what happened in neutral colors. The system never applies judgment (green/red, up/down arrows, "vs baseline") to individual metric values. All interpretation lives in the AI cards.

**AI interprets, data displays.** There are two distinct layers in every session view: (1) the data layer — raw metrics, strike maps, video — which is neutral and clinical; (2) the AI layer — observation and recommendation cards — which is the only place the system expresses opinions about what the data means. This separation respects the coach's authority to interpret their own session.

**Motion as information.** The screen should feel alive and actively tracking a session. Animated metric transitions, breathing glow states, and responsive hover interactions are not decoration — they communicate that the instrument is live and responsive. Motion is the #1 priority for perceived quality.

**Fact-base first.** Always show measured reality before showing recommendations or predictions. The UI should ground the practitioner in what IS before proposing what COULD BE.

**Progressive disclosure.** Practitioners want the answer fast, but the reasoning is complex. Surface the recommendation and key metrics at the top level. Hide model assumptions, uncertainty breakdowns, and advanced controls behind collapsible sections. Three tiers:
- Level 1: Metrics + AI observation (always visible)
- Level 2: Detailed strike maps, dispersion plots, video (one click)
- Level 3: Model assumptions, confidence intervals, parameter weights (expert toggle)

**Magnitude framing.** Context matters, but context is situational. In the AI interpretation cards, always pair numbers with context (percentage, variability comparison, magnitude label). In the raw metrics area, show numbers neutrally without forced comparisons.

**Uncertainty is visible.** Ranges, confidence badges, and tolerance bands are first-class UI elements in the AI layer, not footnotes. A recommendation without a confidence level is incomplete.

**Split voice architecture.** The UI has two typographic voices — the brand voice (Cabinet Grotesk / Inter) for human-readable content, and the data voice (Space Mono) for metrics, labels, and machine-generated values. This separation helps practitioners instantly distinguish "what the system says" from "what the data shows."

**Engineering-grade simplicity.** Dense information, zero decoration. Every element earns its space. No ornamental graphics, no illustrative icons, no visual filler. If it doesn't help a decision, remove it.

---

## 2. Color Token System

### Dark Mode (Primary — default for all product surfaces)

Dark mode is the primary product surface. Coaches use this product in bays — dark backgrounds reduce glare, improve contrast, and feel like a precision instrument. Light mode is reserved for marketing, reports, and printed exports.

```javascript
const C = {
  // Foundation
  bg:       '#080B10',   // Page background
  surface:  '#0E1319',   // Cards, content areas
  elevated: '#141B24',   // Nested cards, alternate surface
  border:   '#1A2332',   // Primary borders
  borderSub:'#1E2A38',   // Subtle borders (card edges, dividers)

  // Brand accent (emerald, tuned for dark context)
  accent:   '#10B981',   // Primary brand: CTAs, links, .AI in logo, active states
  accentHov:'#34D399',   // Hover state
  accentBg: 'rgba(16,185,129,0.08)', // Accent background tint
  accentBright: '#34D399', // Bright variant for emphasis

  // Text hierarchy
  ink:      '#E8ECF1',   // Primary text, headings, wordmark
  body:     '#94A3B8',   // Body copy, descriptions, AI card text
  muted:    '#5E6E7E',   // Labels, captions, secondary info
  dim:      '#2E3A48',   // Placeholder text, disabled states, subtle grid lines

  // Neutral data — NO JUDGMENT (used for all metric values)
  data:     '#CBD5E1',   // All metric values render in this color
  dataDim:  '#64748B',   // Metric units and secondary data text

  // Semantic — used ONLY in AI cards and confidence badges, never on raw metrics
  conf:     '#10B981',   // High confidence, positive AI assessment
  confBg:   'rgba(16,185,129,0.08)',
  caution:  '#F59E0B',   // Medium confidence, warnings
  cautionBg:'rgba(245,158,11,0.08)',
  flag:     '#EF4444',   // Low confidence, errors
  flagBg:   'rgba(239,68,68,0.08)',

  // Session phase colors (timeline bars only)
  phaseBaseline: '#2E3A48',  // Dim gray for baseline/warm-up shots
  phaseAdjust:   '#F59E0B',  // Caution gold for adjusting/drill shots
  phasePost:     '#10B981',  // Accent emerald for post-cue/transfer shots

  // Overlays
  overlay:  'rgba(0,0,0,0.6)',
  glass:    'rgba(14,19,25,0.7)',
  glassBorder: 'rgba(26,35,50,0.8)',
};
```

### Light Mode (Secondary — reports, exports, marketing, player-facing)

```javascript
const CL = {
  bg:       '#F6F7F9',
  surface:  '#FFFFFF',
  surfaceAlt: '#F0F2F5',
  border:   '#DFE2E7',
  borderSub:'#ECEEF2',
  accent:   '#0D7C66',
  accentHov:'#0A6352',
  accentBg: '#E6F5F1',
  accentBright: '#0FA87A',
  ink:      '#1A1F2B',
  body:     '#4B5563',
  muted:    '#9CA3AF',
  dim:      '#C5CAD1',
  data:     '#334155',    // Neutral data in light mode
  dataDim:  '#64748B',
  conf:     '#0FA87A',
  confBg:   '#E6F5F1',
  caution:  '#D4980B',
  cautionBg:'#FDF6E3',
  flag:     '#C93B3B',
  flagBg:   '#FDE8E8',
};
```

### Color Usage Rules

**Critical rule: Semantic colors NEVER appear on raw metric values.** Green/red/gold indicators are reserved for AI interpretation cards, confidence badges, and session phase indicators in the timeline. Individual metric cells always use `C.data` for values and `C.dataDim` for units, regardless of whether the number went up or down.

- Session phase timeline bars: `C.phaseBaseline` / `C.phaseAdjust` / `C.phasePost`
- Confidence badges in AI cards: colored text on matching `*Bg` tint background
- The accent color `C.accent` is reserved for interactive elements and brand marks — never for data encoding
- Semantic colors (conf/caution/flag) must always be paired with text labels or shapes — never rely on color alone (colorblind accessibility)

---

## 3. Typography Scale

### Font Stack

```css
/* Brand voice */
font-family: 'Cabinet Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Data voice */
font-family: 'Space Mono', 'SF Mono', 'Fira Code', monospace;

/* Editorial voice (taglines, pull quotes only) */
font-family: 'Instrument Serif', Georgia, serif;
```

### Type Scale

| Size | Weight | Font | Usage |
|------|--------|------|-------|
| 8px | 700, uppercase, ls .08em | Space Mono | Micro labels inside metric cells, timeline legend |
| 9px | 700, uppercase, ls .08em | Space Mono | Card section labels, badges, pill text, AI card headers |
| 10px | 400, uppercase, ls .08em | Space Mono | Column headers, focus chip text |
| 11px | 400 | Space Mono | Slider labels, notes, confidence intervals |
| 12px | 500 | Inter/Cabinet Grotesk | Body small, card descriptions |
| 13px | 400 | Inter/Cabinet Grotesk | Standard body text, AI card body |
| 14px | 400 | Inter/Cabinet Grotesk | Primary body text |
| 16px | 500 | Inter/Cabinet Grotesk | Card titles, section subheadings |
| 18px | 700 | Inter/Cabinet Grotesk | Section headings |
| 20px | 700 | Space Mono | Metric values in data grid cells |
| 22px | 700 | Space Mono | Primary KPI values when a hero is needed (fitting only) |
| 24px | 800 | Inter/Cabinet Grotesk | Page-level headings |
| 32px+ | 800 | Inter/Cabinet Grotesk | Display headings (marketing only) |

### Letter Spacing Conventions

| Spacing | Usage |
|---------|-------|
| `-.02em` | Large metric numbers (20px+) — tighter for density |
| Normal | Body text, descriptions |
| `.05-.06em` | Wordmark in all-caps |
| `.08em` | Small uppercase labels (Space Mono) |

### Rules

- Cabinet Grotesk / Inter handles all human-authored or human-readable text
- Space Mono handles all machine-generated values, labels, and data
- Never use Cabinet Grotesk / Inter for numbers in metric cells — always Space Mono
- Never use Space Mono for body paragraphs or descriptions — always Cabinet Grotesk / Inter
- Instrument Serif italic is used only for taglines, pull quotes, and editorial moments — never for body or data

---

## 4. Surface System

### Primary: Solid Dark (all product data surfaces)

```javascript
const S = {
  card: {
    background: C.surface,
    borderRadius: '12px',
    border: `1px solid ${C.border}`,
    padding: '14px 16px',
  },
  cardInner: {
    background: C.elevated,
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    padding: '10px 12px',
  },
};
```
Use for: all metric cards, data grids, shot logs, dashboard panels, recommendation cards, strike maps, video panels. Solid dark surfaces are the default for everything in the product.

### Secondary: Glass (overlays and dropdowns only)

```javascript
const SG = {
  dropdown: {
    background: C.elevated,
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
};
```
Use for: focus metric dropdown, context popvers, modal backgrounds. Never use glass or transparency for surfaces that display primary metrics.

### Key Implementation Notes

- For dark mode product surfaces: always solid backgrounds. No backdrop-filter, no blur, no glass effects.
- Ambient glow (very subtle radial gradient behind content) is allowed as a background atmosphere element — not on data surfaces.
- Light mode glass effects are reserved for marketing pages and presentations.

---

## 5. Component Library

### 5a. Metric Cell (Neutral)

The primary data display component. Shows a single metric value with NO judgment — no color coding, no deltas, no comparisons. Used in the 4×2 metric grid.

**Anatomy:**
- Dark elevated background with subtle border
- 8px uppercase Space Mono label in `C.muted`
- 20px bold Space Mono value in `C.data` (neutral slate — NEVER green/red)
- 9px Space Mono unit suffix in `C.dataDim`
- No delta indicator, no comparison text, no color coding

```jsx
<div style={{
  padding: '10px', borderRadius: 6,
  background: C.elevated, border: `1px solid ${C.border}`,
}}>
  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 6 }}>
    {label}
  </div>
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700,
      color: C.data, letterSpacing: '-0.02em' }}>
      {animatedValue}
    </span>
    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.dataDim }}>
      {unit}
    </span>
  </div>
</div>
```

**Critical:** Values must animate with eased interpolation (~350ms, cubic-bezier) when the active shot changes. Numbers count up/down smoothly. This is the signature motion of the product.

### 5b. Confidence Badge

Colored pill showing a confidence percentage or categorical level. Used ONLY inside AI cards, never on raw metrics.

**Levels and colors:**
| Range | Label | Color | Background |
|-------|-------|-------|------------|
| ≥80% | High | `C.conf` | `C.confBg` |
| 50-79% | Medium | `C.caution` | `C.cautionBg` |
| <50% | Low | `C.flag` | `C.flagBg` |

```jsx
<span style={{
  fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700,
  padding: '2px 8px', borderRadius: 3,
  background: bgColor, color: textColor,
}}>{value}%</span>
```

### 5c. AI Observation Card

The primary interpretive component. This is where Looper's intelligence is visible. It sits BELOW the raw metrics, clearly separated as the system's interpretation layer.

**Anatomy:**
- Subtle accent-tinted background gradient (`surface → accent at 3-5% opacity`)
- Top accent line: horizontal gradient (`transparent → accent at 35% → transparent`)
- Header row: "AI OBSERVATION" in Space Mono 9px accent + "re: {focusMetric}" sub-badge
- **First line of body is the swing intent tag in bold** (see 5f Swing Tag)
- Body text: Inter 13px, `C.body`, line-height 1.65. Content adapts to current focus metric.
- Hover: border brightens, card lifts 1px (`transform: translateY(-1px)`)

```jsx
<div style={{
  background: `linear-gradient(135deg, ${C.surface} 0%, ${C.accent}05 100%)`,
  borderRadius: 10, padding: '16px 18px',
  border: `1px solid ${C.accent}18`,
  position: 'relative', overflow: 'hidden',
  transition: 'all 0.25s ease',
}}>
  {/* Top accent line */}
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    background: `linear-gradient(90deg, transparent, ${C.accent}35, transparent)`,
  }} />
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700,
        color: C.accent, letterSpacing: '.06em' }}>AI OBSERVATION</span>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8,
        padding: '2px 6px', borderRadius: 3, background: `${C.accent}10`, color: C.muted,
      }}>re: {focusMetric}</span>
    </div>
  </div>
  <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.body, lineHeight: 1.65 }}>
    <strong>{swingTag}</strong> — {observationText}
  </div>
</div>
```

### 5d. Recommendation Card

Companion to the AI Observation card. Provides actionable next-step guidance.

**Anatomy:**
- Surface background, standard border
- Top caution line: horizontal gradient (`transparent → caution at 25% → transparent`)
- Header: "RECOMMENDATION" in Space Mono 9px caution color
- Body text: Practical guidance referencing the focus metric. Sounds like a colleague, not an algorithm.
- Hover: same lift behavior as observation card

### 5e. Focus Metric Chip

Interactive chip in the L2 context bar showing what the AI should prioritize in its interpretation. The system suggests a focus based on the active drill/intervention; the coach can override.

**Options:** `Strike quality`, `Speed control`, `Face-to-path`, `Launch window`, `Full effort`

**Appearance:**
- Space Mono 9px, accent-tinted border and text
- Prefix icon: ◉
- Suffix: ▾ dropdown indicator
- Clicking opens a dropdown with options
- Dropdown header: "SYSTEM SUGGESTED · TAP TO OVERRIDE" in 8px muted

```jsx
<button style={{
  fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700,
  letterSpacing: '.04em', padding: '3px 10px', borderRadius: 16,
  background: `${C.accent}08`, border: `1px solid ${C.accent}33`,
  color: C.accent, cursor: 'pointer',
}}>
  ◉ FOCUS: {focusMetric.toUpperCase()} ▾
</button>
```

### 5f. Swing Intent Tag

An AI-assigned classification tag for every swing, displayed at the start of the AI Observation card body. Also stored as metadata on the swing record for session indexing.

**Tags:**
| Tag | When applied | Color context |
|-----|-------------|---------------|
| `WARM-UP` | Early session, lower effort, exploratory | muted |
| `BASELINE` | Full-effort before intervention, establishing patterns | dim |
| `DRILL` | During active intervention — may be partial effort or constrained | caution |
| `TRANSFER` | Testing whether drill pattern holds at higher effort / different club | accent |
| `FULL EFFORT` | Unconstrained, game-speed swings | ink |

The tag renders as bold text at the start of the AI Observation body: "**DRILL** — Swing 11 at ~70% effort. Center-face contact achieved..."

The tag also appears in the swing header of the metric grid: `SWING 11 · 7I · DRILL — 70%`

### 5g. Slider Control

Styled range input with dynamic fill, value display, and optional contextual note.

**Anatomy:**
- Flex row: 11px label (left) + 13px bold Space Mono value (right, accent-colored)
- 5px-height range track with accent gradient fill
- Optional 9px italic note below

**Slider fill technique:**
```css
background: linear-gradient(to right, ${C.accent} ${pct}%, ${C.borderSub} ${pct}%);
```

### 5h. Stage Card (Collapsible Accordion)

Used for configuration comparisons (fitting) and drill/intervention records (coaching).

**Collapsed state:** Surface card, accent left-stripe colored by outcome, title + subtitle, right-aligned summary, chevron.
**Expanded state:** Smooth height transition (200-300ms ease), nested `S.cardInner` surfaces.

### 5i. Impact Indicator (CalBar)

Magnitude-aware metric display. Used ONLY in AI cards and summary contexts, never on raw metrics.

**Magnitude scale:**
| Level | Label | Usage |
|-------|-------|-------|
| Marginal | Within noise | <1 yard or <0.5% |
| Modest | Detectable but small | 1-3 yards or 0.5-1.2% |
| Moderate | Worth testing | 3-6 yards or 1.2-2.5% |
| Meaningful | Clear improvement | 6-12 yards or 2.5-5% |
| Significant | Major change | >12 yards or >5% |

### 5j. Advanced Group (Collapsible Expert Controls)

Hidden section for model transparency. Thin border-top + 8px uppercase Space Mono label in `C.dim` + ▸ chevron toggle. Content hidden by default.

Labels: "MODEL ASSUMPTIONS", "UNCERTAINTY DETAIL", "FULL SWING LOG"

---

## 6. Data Visualization Patterns

### 6a. Clubface Impact Pattern (Primary Strike Visualization)

A realistic clubface rendering with impact marks that accumulate. This is a signature Looper visualization — it should look like a real club face with impact tape marks.

**Iron face rendering:**
- SVG shape: trapezoidal — wider at topline, narrower toward sole. NOT a rounded rectangle.
- Slight curvature on the leading edge (bottom).
- Horizontal groove lines across the lower 2/3 of the face, evenly spaced, stopping short of toe and heel edges. Thin strokes in `C.dim`.
- Metallic surface: subtle gradient (lighter center, darker edges) to imply face curvature.
- Sweet spot: very subtle dashed ellipse outline near face center in `C.dim`.
- Center crosshair: extremely subtle dashed lines at 0.3px, 0.4 opacity.

**Driver face rendering:**
- SVG shape: wider, shallower, more rounded/bulging profile.
- No groove lines. Smooth surface.
- Subtle radial gradient implying bulge-and-roll curvature.

**Impact marks (accumulating):**
- All swings up to the active shot leave marks, building like impact tape.
- Previous shot marks: small elliptical scuffs in `C.data` with opacity fading by age (older = more transparent, minimum 0.12).
- Active shot: larger dot (r=5) in `C.accent` with breathing glow animation (2.5s cycle, outer ring pulses r=10→16). White center point (r=2).
- Shot number label appears next to active mark in Space Mono 8px accent.
- Click any mark to jump to that shot.

**Perimeter labels:** TOE (left), HEEL (right), HIGH (top), LOW (bottom) in Space Mono 7px `C.dim`.

**Card header:** "IMPACT PATTERN" label + mark count ("14 marks").

### 6b. Dispersion Plot

Scatter visualization showing shot distribution with confidence ellipse.

**Elements:**
- SVG viewBox scaled to represent the target area (lateral vs. carry)
- Dashed crosshair lines (target line vertical, carry reference horizontal) in `C.dim`
- Individual shot dots in `C.data` (neutral), active shot in `C.accent`
- Confidence ellipse: dashed stroke at `C.accent` 15% opacity
- Axis labels in Space Mono 9px `C.muted`

### 6c. Confidence Band Chart

Line or area chart showing predicted outcomes with uncertainty ranges.

**Elements:**
- Primary prediction line: 2px solid `C.accent`
- Confidence band: filled area at accent 8% opacity
- Measured data points: solid dots in `C.data`
- Reference lines: dashed `C.dim`
- Axis: Space Mono 10px, `C.muted`

### 6d. Session Timeline (Horizontal Shot Bar Chart)

Replaces the old vertical shot rail. A horizontal bar chart where each bar = one shot. The primary session navigation element.

**Bar encoding:**
- Height: proportional to the focus metric value (strike quality by default, or whatever the coach has set)
- Color: session phase (`C.phaseBaseline` / `C.phaseAdjust` / `C.phasePost`)
- Active bar: gradient fill (phase color 100% → 55%), glow shadow, inset highlight, 1px phase-colored border
- Hover: bar scales `scaleY(1.2) scaleX(1.08)`, transition 0.2s cubic-bezier
- Click: selects that shot, updates all metric cells with animated transition

**Layout:**
- Full-width row, 48-52px height
- Bars flex: equal width, 3px gap, 4px border-radius
- Shot number appears above bar on hover/active in Space Mono 7px

**Legend:** Right-aligned, showing phase colors with labels (e.g., "Baseline", "Adjusting", "Post-cue") in Space Mono 8px.

### 6e. Waterfall Bridge

Shows decomposition of improvement sources. Used in AI summary contexts.

**Elements:**
- Horizontal bars: positive segments in `C.conf`, negative in `C.flag`
- Connector lines between segments
- Labels in Space Mono

### Chart Styling (Recharts)

When using Recharts for interactive charts:
- Always wrap in `ResponsiveContainer`
- Bar charts: rounded tops `radius={[4,4,0,0]}`
- Tooltips: solid dark background (`C.elevated`) with border
- Grid lines: `strokeDasharray="3 3"` with `C.dim`
- Axis tick labels: Space Mono, 10px, `C.muted`
- Legend: custom HTML below chart (not Recharts default)

---

## 7. Layout Patterns

### Page Structure (Session View)

```
┌──────────────────────────────────────────────────┐
│ L1: Global bar (dark, blurred, persistent)       │
│ LOOPER.AI  ← Dashboard    ● LIVE  [End Session] │
├──────────────────────────────────────────────────┤
│ L2: Context pills (left) + Focus chip (right)    │
│ [Player] [Club] [Session] [Swing]   ◉ FOCUS: X  │
├──────────────────────────────────────────────────┤
│ L3: Decision tabs (accent underline animation)   │
│ Overview | Video | Diagnosis | Interventions ... │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────────┐ ┌────────────────────┐  │
│ │ 4×2 Metric Grid      │ │ Clubface Impact    │  │
│ │ (neutral, animated)  │ │ Pattern (320px)    │  │
│ └──────────────────────┘ └────────────────────┘  │
│ ┌────────────────────────────────────────────┐   │
│ │ Session Timeline (horizontal bars)         │   │
│ └────────────────────────────────────────────┘   │
│ ┌─────────────────┐ ┌─────────────────┐         │
│ │ Video: DTL      │ │ Video: Face-on  │         │
│ └─────────────────┘ └─────────────────┘         │
│ ┌────────────────────────────────────────────┐   │
│ │ AI OBSERVATION  (swing tag + interpretation)│   │
│ └────────────────────────────────────────────┘   │
│ ┌────────────────────────────────────────────┐   │
│ │ RECOMMENDATION  (next-step guidance)       │   │
│ └────────────────────────────────────────────┘   │
│ ▸ MODEL ASSUMPTIONS  ▸ UNCERTAINTY  ▸ SWING LOG │
│                                                  │
└──────────────────────────────────────────────────┘
```

No vertical shot rail. The session timeline (horizontal) is the primary shot navigation. Content area is full-width.

### L1 — Global Bar Implementation

Height 44px, flex layout. Background: `${C.surface}ee` with `backdrop-filter: blur(12px)`. Bottom border `C.border`.
- Left: LOOPER wordmark (font-weight 800, 13px, .05em tracking). "LOOPER" in `C.ink`, ".AI" in `C.accent`.
- Left: "← Dashboard" link in `C.muted`.
- Right: Live indicator (pulsing green dot + "LIVE" in Space Mono 10px `C.conf` + player name in `C.muted`). "End Session" button: `${C.flag}10` background, `${C.flag}30` border, `C.flag` text.

### L2 — Context Bar + Focus Chip

Single row, `${C.surface}99` background, bottom border. Split layout:
- Left: Context pills (player, club, session, swing count). Space Mono 9px, rounded pills (16px border-radius). Active pill: accent-tinted background + accent border + accent text. Inactive: borderSub border, muted text.
- Right: Focus metric chip (see component 5e).

### L3 — Decision Tabs

`${C.surface}60` background, bottom border. Tabs: Inter/Cabinet Grotesk 11px. Active tab: weight 600, `C.ink`, 2px accent bottom border that animates width from center. Inactive: weight 400, `C.muted`. Hover: partial underline animation.

### Geometric Layout Discipline

All rules from previous version remain:
- Equal sizing within groups
- Grid alignment with `minmax(0, 1fr)` columns
- Consistent card heights within rows (`align-items: stretch`)
- Consistent border-radius by depth: outer 12px, inner 8px, badges 3px or full-round
- Consistent gap values: 6px for metric cells, 10px for standard content grids, 10-12px for sections
- Two-column layouts must be truly equal (`1fr 1fr`)
- Full-width elements span `grid-column: 1 / -1`

### Grid Patterns (Updated)

| Layout | CSS | Usage |
|--------|-----|-------|
| Metrics + Strike map | `grid-template-columns: 1fr 320px` | Primary session overview |
| 4×2 Metric grid | `grid-template-columns: repeat(4, 1fr)` inside the metrics panel | 8 neutral metrics |
| 2-column video | `grid-template-columns: 1fr 1fr` | DTL + face-on panels |
| Full-width | `grid-template-columns: 1fr` | Timeline, AI cards, advanced |

### Spacing

| Element | Value |
|---------|-------|
| Page padding | `14px 20px` |
| Card padding | `14px 16px` (standard), `10px 12px` (metric cells) |
| Section gap (between rows) | `10px` |
| Metric cell gap | `6px` |
| Component internal margin-bottom | `6-10px` |
| Max content width | `1440px` centered |

---

## 8. Number Formatting

### Format Utility

```javascript
const fmt = (v, type) => {
  switch(type) {
    case 'yds':  return Math.round(v) + '';  // No unit in the value; unit is a separate element
    case 'mph':  return v.toFixed(1);
    case 'rpm':  return Math.round(v).toLocaleString();
    case 'deg':  return v.toFixed(1);
    case 'pct':  return v.toFixed(1);
    case 'mm':   return v.toFixed(1);
    default:     return String(v);
  }
};
```

### Conventions

- Metric values and units are SEPARATE elements (value in `C.data`, unit in `C.dataDim`)
- Always use `toLocaleString()` for numbers ≥1,000
- Signed values (path, face angle, attack): show `+` prefix for positive, `-` for negative
- Spin rate: always rounded to integers
- Impact location in mm with one decimal
- No delta formatting on raw metrics. Deltas only appear in AI card text.

### Animated Number Pattern

All metric values MUST animate when the active shot changes. Use `requestAnimationFrame` with eased cubic interpolation:

```javascript
function useAnimatedValue(target, duration = 350) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    const from = display;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return display;
}
```

---

## 9. Motion & Interaction Requirements

Motion is the #1 priority for perceived quality. The screen must feel alive and actively tracking a session.

### Required Animations

| Element | Animation | Duration / Timing |
|---------|-----------|-------------------|
| Metric values | Count up/down with eased interpolation on shot change | 350ms, ease-out cubic |
| Active strike mark | Breathing glow pulse (outer ring r oscillates, opacity oscillates) | 2.5s cycle, infinite |
| Timeline bars | Scale up on hover (scaleY 1.2, scaleX 1.08) | 0.2s cubic-bezier |
| Timeline bar select | Gradient fill + glow shadow + inset highlight | Immediate + 0.2s transition |
| AI cards (initial load) | Fade-slide-up with staggered delay | 0.45s, staggered 0.04-0.34s |
| AI cards (shot change) | Content cross-fade | 0.15s |
| Ambient background | Very subtle radial gradient opacity breathe | 8s cycle (0.03 → 0.07 opacity) |
| Tab underline | Width animates from center on selection | 0.2s ease |
| Live indicator dot | Continuous pulse | 2s cycle |
| Focus chip dropdown | Scale-in from chip position | 0.15s |
| Card hover (AI cards) | Border brightens, translateY(-1px) | 0.25s ease |

### CSS Animation Keyframes

```css
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
@keyframes breathe { 0%,100% { opacity:0.03; } 50% { opacity:0.07; } }
```

Use CSS animations for ambient/breathing effects. Use `requestAnimationFrame` for number interpolation.

### Progressive Disclosure Hierarchy

1. **Tab level** — major areas (L3 tabs, left-to-right follows session workflow)
   - Coaching: Overview → Video → Diagnosis → Interventions → Player Plan
   - Fitting: Overview → Configs Tested → Recommendation → Build Sheet
2. **Card level** — collapsible stage cards for each config or drill
3. **Advanced level** — hidden expert controls (model assumptions, full uncertainty)

### Navigation Rules

- L1 is always the darkest element — backdrop-blurred, creating a floating anchor
- L2 pills are editable state + focus metric control, not navigation
- L3 tab order follows the decision sequence left-to-right
- L3 tabs: maximum 5, minimum 3
- No vertical sidebar/rail in session views — horizontal timeline replaces it
- Never nest tabs inside tabs

### Override Pattern

Every AI recommendation must have an override control. The practitioner is always in control. Recommendation card includes a subtle "Override" or "Adjust" button that opens relevant controls.

---

## 10. Looper-Specific Patterns

### 10a. Session Timeline

See section 6d for full spec. The session timeline replaces the vertical shot rail. It is a horizontal bar chart running full-width below the metrics row. Each bar = one shot. Click to navigate.

### 10b. Session Context Bar (Pills + Focus Chip)

Horizontal row split into two zones:
- Left: contextual pills showing current session parameters (player, club, session, swing count). Space Mono 9px.
- Right: Focus metric chip (system-suggested, coach-overridable). See component 5e.

**Coaching context example:** `[Jake Hernandez · 8.2] [7I · Mizuno Pro 245] [Session 3/8] [Swing 14/14]`  ◉ FOCUS: STRIKE QUALITY

### 10c. Swing Intent Classification

Every swing is tagged by the AI with an intent classification. This is a first-class data element — it is displayed in the AI Observation card, stored in the swing record, and used for session indexing.

Tags: WARM-UP, BASELINE, DRILL, TRANSFER, FULL EFFORT (see component 5f).

The intent tag also appears in the metrics grid section header: `SWING 11 · 7I · DRILL — 70%`

### 10d. AI Interpretation Layer

The AI Observation and Recommendation cards together form the "interpretation layer" — the only part of the session view where the system expresses opinions. Key rules:

- AI cards always reference the current focus metric ("re: Strike quality")
- AI Observation leads with the swing intent tag
- AI language adapts to focus: strike focus → talk about impact location and spread; speed control → talk about effort consistency; full effort → talk about output optimization
- AI never shows red/green judgment outside these cards
- The observation card uses accent tinting; the recommendation card uses caution tinting
- Both cards have hover lift interaction

### 10e. Player Embedding Summary

Compact visualization of a player's "signature" — tendencies and variability. Used in player profiles and session context.

**Elements:**
- Mini dispersion thumbnail (small SVG)
- Key delivery stats: avg path, avg face, avg attack, avg dynamic loft
- Variability indicators: SD for each metric, displayed as ± ranges
- Trend arrows if longitudinal data available

### 10f. Drill/Cue Card (Coaching OS)

Card representing a coaching intervention with structured metadata.

**Anatomy:**
- Title (drill name) in Inter/Cabinet Grotesk 500
- Cue type badge: "External" (conf), "Internal" (caution), "Constraint" (accent)
- Difficulty rating (1-5 dots or bar)
- Expected effect description

### 10g. Build Sheet (Fitting Engine Export)

Uses light mode tokens (`CL`). Structured output document for final fitting recommendation. PDF and print-ready. Sections: player info, recommended config, performance comparison, key evidence, uncertainty note, fitter notes.

### 10h. Video Analysis Module

Dual-panel video layout (DTL + face-on), equal dimensions. When real video files are available, embed with HTML5 `<video>` elements. Controls: play/pause on click, scrub, speed control (0.25x, 0.5x, 1x), frame timestamp in Space Mono.

When no video available: placeholder with subtle grid overlay, play button circle, Space Mono label.

---

## 11. Anti-Patterns

| Anti-Pattern | Instead Do |
|-------------|-----------|
| Green/red deltas on raw metric values | All metrics neutral (`C.data`). Interpretation lives in AI cards only |
| "vs baseline" comparisons on individual metrics | Show intent context ("DRILL — 70%") instead. Let AI card interpret |
| Hero metric that implies one number matters most | All metrics equal weight in the grid. Focus metric chip tells the AI what to prioritize |
| Whoop-style ring charts for carry/output | Rings imply optimization; coaching is often about exploration. Use neutral grid |
| Radar/sonar animation on strike map | Realistic clubface with accumulating impact marks — like impact tape |
| Rounded rectangle for clubface | Trapezoidal iron face (wider topline) or rounded driver face. Must look real |
| Vertical shot rail with colored circles | Horizontal session timeline with quality-encoded bar heights |
| Light mode as default product surface | Dark mode is primary. Light mode for reports, marketing, exports |
| Static metric values on shot change | All values animate with eased interpolation (~350ms) |
| "Our AI recommends..." | "Recommended:" — the system recommends, not "the AI" |
| Equal visual weight for all controls | Hide advanced controls behind collapsible toggles |
| Color as the only differentiator | Combine color + shape + text labels |
| Emoji icons for section labels | Use numbered markers or typographic separators |
| Glassmorphism on data surfaces | Solid dark surfaces for all data. Glass only for overlays |
| Decorative backgrounds | `C.bg` background + subtle ambient glow only |
| Generic SaaS dashboard aesthetic | Precision instrument feel — Bloomberg meets Whoop |
| Cookie-cutter Claude artifact styling | Every element custom-styled to the Looper design system |
| Unequal card/panel sizes in the same row | All siblings equal width and height |
| Mixed border-radius at the same depth | Outer: 12px. Inner: 8px. Badges: 3px |
| Inconsistent gap values | One gap per context: 6px metrics, 10px sections |
| Video viewports of different sizes | Both panels identical dimensions |

---

## 12. Reuse Checklist

When building a new Looper.AI product screen or prototype:

- [ ] Import dark color constants (`C`) — dark mode is always the default
- [ ] Set up animated number hook (`useAnimatedValue`)
- [ ] Build Metric Cell components (neutral, no deltas)
- [ ] Build AI Observation and Recommendation cards
- [ ] Build the Top Bar (L1) with logo + live indicator
- [ ] Build Context Bar (L2) with pills + focus metric chip
- [ ] Build tab structure (max 5 tabs)
- [ ] For session views: metrics grid (neutral) → strike map → timeline → video → AI cards → advanced
- [ ] Swing intent tags on every swing in AI card
- [ ] Focus metric chip determines AI card language
- [ ] Override control on every AI recommendation
- [ ] Include Advanced collapsible groups (model assumptions, uncertainty)
- [ ] Add motion: animated values, breathing glow, hover lifts, staggered fade-ups
- [ ] Test: would this feel alive on a bay display? Are numbers animating?
- [ ] Geometric check: equal cards, consistent gaps, aligned edges
- [ ] Video check: both panels identical dimensions
- [ ] Color check: NO green/red on raw metrics. Judgment only in AI cards.
- [ ] Voice check: no AI jargon, no emoji, no "Our AI", no "vs baseline" on metrics