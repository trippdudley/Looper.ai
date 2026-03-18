---
name: looper-ux-system
description: "Looper.AI UX Design System — the complete implementation reference for building Looper.AI product interfaces. Use this skill whenever building any Looper.AI UI: fitting engine dashboards, coaching OS panels, session views, player reports, data visualizations, or any interactive product artifact. Also trigger when the user asks to build a prototype, mockup, dashboard, or interactive component for Looper.AI, or references the Looper design system, component library, or visual patterns. If the output is a working UI or product screen, this skill applies."
---

# Looper.AI UX Design System

A reusable implementation reference for building Looper.AI product interfaces — fitting engine, coaching OS, session views, player reports, and interactive prototypes.

Read this file completely before building any Looper.AI product UI.

---

## 1. Design Philosophy

Looper.AI is a decision platform used by golf coaches and club fitters during real sessions. Every design choice must survive two tests: (1) is it readable on a large display in a bright fitting bay with variable lighting? and (2) does it help the practitioner make a better decision faster?

### Core Principles

**Fact-base first.** Always show measured reality (baseline data) before showing recommendations or predictions. The UI should ground the practitioner in what IS before proposing what COULD BE.

**Progressive disclosure.** Practitioners want the answer fast, but the reasoning is complex. Surface the recommendation and key metrics at the top level. Hide model assumptions, uncertainty breakdowns, and advanced controls behind collapsible sections. Three tiers:
- Level 1: Session summary + recommendation (always visible)
- Level 2: Detailed metrics, strike maps, dispersion plots (one click)
- Level 3: Model assumptions, confidence intervals, parameter weights (expert toggle)

**Magnitude framing.** Never show a number without context. "3-yard improvement" means nothing alone. Always pair with: percentage of baseline, comparison to shot-to-shot variability, or a magnitude label (marginal → modest → moderate → meaningful → significant).

**Uncertainty is visible.** Ranges, confidence badges, and tolerance bands are first-class UI elements, not footnotes. A recommendation without a confidence level is incomplete.

**Split voice architecture.** The UI has two typographic voices — the brand voice (Cabinet Grotesk) for human-readable content, and the data voice (Space Mono) for metrics, labels, and machine-generated values. This separation helps practitioners instantly distinguish "what the system says" from "what the data shows."

**Engineering-grade simplicity.** Dense information, zero decoration. Every element earns its space. No ornamental graphics, no illustrative icons, no visual filler. If it doesn't help a decision, remove it.

---

## 2. Color Token System

### Light Mode (Primary — default for all product surfaces)

```javascript
const C = {
  // Foundation
  bg:       '#F6F7F9',   // Page background
  surface:  '#FFFFFF',   // Cards, content areas
  surfaceAlt: '#F0F2F5', // Alternate surface (nested cards, table rows)
  border:   '#DFE2E7',   // Primary borders
  borderSub:'#ECEEF2',   // Subtle borders (card edges, dividers)

  // Brand accent — deep teal
  accent:   '#0D7C66',   // Primary brand: CTAs, links, .AI in logo, active states
  accentHov:'#0A6352',   // Hover state
  accentBg: '#E6F5F1',   // Accent background tint (badges, recommendation cards)
  accentBright: '#0FA87A', // Bright variant for confidence-high indicators

  // Text hierarchy
  ink:      '#1A1F2B',   // Primary text, headings, wordmark
  body:     '#4B5563',   // Body copy, descriptions
  muted:    '#9CA3AF',   // Labels, captions, secondary info
  dim:      '#C5CAD1',   // Placeholder text, disabled states

  // Semantic — confidence / caution / flag
  conf:     '#0FA87A',   // High confidence, positive delta
  confBg:   '#E6F5F1',   // Confidence badge background
  caution:  '#D4980B',   // Medium confidence, warnings
  cautionBg:'#FDF6E3',   // Caution badge background
  flag:     '#C93B3B',   // Low confidence, errors, negative delta
  flagBg:   '#FDE8E8',   // Flag badge background

  // Overlays
  overlay:  'rgba(26,31,43,0.5)',   // Modal overlay
  glass:    'rgba(255,255,255,0.6)', // Subtle glass surfaces
  glassBorder: 'rgba(255,255,255,0.45)', // Glass element borders
};
```

### Dark Mode (Bay/Simulator Environments)

```javascript
const CD = {
  // Foundation
  bg:       '#0C1117',
  surface:  '#151D28',
  surfaceAlt:'#1A2332',
  border:   '#1E2A36',
  borderSub:'#253342',

  // Brand accent (same hue, adjusted for dark context)
  accent:   '#10B981',
  accentHov:'#34D399',
  accentBg: 'rgba(16,185,129,0.08)',
  accentBright: '#34D399',

  // Text hierarchy
  ink:      '#E8ECF1',
  body:     '#8B99A8',
  muted:    '#5E6E7E',
  dim:      '#3A4856',

  // Semantic
  conf:     '#10B981',
  confBg:   'rgba(16,185,129,0.12)',
  caution:  '#EAB308',
  cautionBg:'rgba(234,179,8,0.10)',
  flag:     '#EF4444',
  flagBg:   'rgba(239,68,68,0.10)',

  // Overlays
  overlay:  'rgba(0,0,0,0.6)',
  glass:    'rgba(21,29,40,0.7)',
  glassBorder: 'rgba(30,42,54,0.8)',
};
```

### Color Usage Rules

- Positive numeric deltas: `C.conf` with `▲` prefix
- Negative numeric deltas: `C.flag` with `▼` prefix
- Neutral/zero deltas: `C.muted`
- Confidence badges: colored text on matching `*Bg` tint background
- The accent color `C.accent` (#0D7C66) is reserved for interactive elements and brand marks — never use it for data visualization encoding
- Semantic colors (conf/caution/flag) must always be paired with text labels or shapes (▲▼) — never rely on color alone (colorblind accessibility)

---

## 3. Typography Scale

### Font Stack

```css
/* Brand voice */
font-family: 'Cabinet Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;

/* Data voice */
font-family: 'Space Mono', 'SF Mono', 'Fira Code', monospace;

/* Editorial voice (taglines, pull quotes only) */
font-family: 'Instrument Serif', Georgia, serif;
```

### Type Scale

| Size | Weight | Font | Usage |
|------|--------|------|-------|
| 9px | 700, uppercase, ls .08em | Space Mono | Micro labels, category headers, badge text |
| 10px | 400, uppercase, ls .08em | Space Mono | Card section labels, data column headers |
| 11px | 400 | Space Mono | Slider labels, notes, confidence intervals |
| 12px | 500 | Cabinet Grotesk | Body small, card descriptions, rec card text |
| 13px | 400 | Cabinet Grotesk | Standard body text in compact layouts |
| 14px | 400 | Cabinet Grotesk | Primary body text |
| 16px | 500 | Cabinet Grotesk | Card titles, section subheadings |
| 18px | 700 | Cabinet Grotesk | Section headings |
| 22px | 700 | Space Mono | Primary KPI values, hero metrics |
| 24px | 800 | Cabinet Grotesk | Page-level headings, session titles |
| 32px+ | 800 | Cabinet Grotesk | Display headings (marketing, landing pages only) |

### Letter Spacing Conventions

| Spacing | Usage |
|---------|-------|
| `-.01em` | Large numbers and display headings (tighter) |
| Normal | Body text, descriptions |
| `.05-.06em` | Wordmark in all-caps |
| `.08em` | Small uppercase labels (Space Mono) |

### Rules

- Cabinet Grotesk handles all human-authored or human-readable text
- Space Mono handles all machine-generated values, labels, and data
- Never use Cabinet Grotesk for numbers in data cards — always Space Mono
- Never use Space Mono for body paragraphs or descriptions — always Cabinet Grotesk
- Instrument Serif italic is used only for taglines, pull quotes, and editorial moments — never for body or data

---

## 4. Glass System (Three Tiers)

The system uses a controlled glassmorphism approach. Primary data surfaces are solid for bay readability. Subtle glass is used for secondary and overlay surfaces. Full glass is reserved for marketing and presentation contexts.

### Tier 1: Solid (Default for all data surfaces)

```javascript
const S = {
  card: {
    background: C.surface,
    borderRadius: '12px',
    border: `0.5px solid ${C.borderSub}`,
    padding: '14px 16px',
  },
  cardInner: {
    background: C.surfaceAlt,
    borderRadius: '8px',
    border: 'none',
    padding: '10px 12px',
  },
};
```
Use for: metric cards, data grids, shot logs, primary dashboard panels, recommendation cards, any surface displaying numbers the practitioner needs to read quickly.

### Tier 2: Subtle Glass (Secondary surfaces)

```javascript
const SG = {
  panel: {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    borderRadius: '14px',
    border: '0.5px solid rgba(255,255,255,0.45)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  overlay: {
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(30px) saturate(160%)',
    WebkitBackdropFilter: 'blur(30px) saturate(160%)',
    borderRadius: '16px',
    border: '0.5px solid rgba(255,255,255,0.4)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
  },
};
```
Use for: modal backgrounds, sidebar panels, filter/control overlays, secondary navigation, session-switcher dropdowns. Never use for surfaces that display primary metrics.

### Tier 3: Full Glass (Marketing and presentations only)

Same approach as Tier 2 but with higher blur (40px), more saturation (180%), and larger border-radius (18px). Also includes a dark variant using `rgba(10,18,48,0.58)` background. Full glass requires a gradient or image background to look good. Never use in the product UI — reserved for pitch decks, landing pages, and investor presentations.

### Key Implementation Notes

- Always include both `-webkit-backdrop-filter` and `backdrop-filter` for Safari
- The `inset 0 1px 0 rgba(255,255,255,.5)` top highlight sells the frosted glass illusion
- For dark mode bay environments, use solid dark surfaces — glass effects cause readability issues in low-light

---

## 5. Component Library

### 5a. KPI Tile

A compact metric display with optional confidence badge and delta indicator. The most-used component across both products.

**Anatomy:**
- 3px left-border accent stripe (colored by semantic meaning)
- 9-10px uppercase Space Mono label
- 22px bold Space Mono value
- Optional 11px Space Mono unit suffix
- Optional confidence badge (pill with tinted background)
- Optional 9px Space Mono sub-text (range, comparison, or note)

**Variants:**
- `standard` — white card, subtle border, accent left-stripe
- `embedded` — surfaceAlt background, no border, used inside parent cards
- `highlighted` — accent background tint, used for the "recommended" configuration

```jsx
// KPI Tile structure
<div style={{...S.cardInner, borderLeft: `3px solid ${color}`, borderRadius: 0}}>
  <div style={{fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted}}>
    {label}
  </div>
  <div style={{fontFamily: 'Space Mono', fontSize: 22, fontWeight: 700, color: C.ink}}>
    {value}<span style={{fontSize: 11, fontWeight: 400, color: C.muted, marginLeft: 2}}>{unit}</span>
  </div>
  {sub && <div style={{fontFamily: 'Space Mono', fontSize: 9, color: C.muted, marginTop: 2}}>
    {sub} {conf && <ConfBadge value={conf} />}
  </div>}
</div>
```

### 5b. Confidence Badge

Colored pill showing a confidence percentage or categorical level.

**Levels and colors:**
| Range | Label | Color | Background |
|-------|-------|-------|------------|
| ≥80% | High | `C.conf` | `C.confBg` |
| 50-79% | Medium | `C.caution` | `C.cautionBg` |
| <50% | Low | `C.flag` | `C.flagBg` |

```jsx
<span style={{
  fontFamily: 'Space Mono', fontSize: 9, fontWeight: 700,
  padding: '1px 7px', borderRadius: 3,
  background: bgColor, color: textColor,
}}>{value}%</span>
```

### 5c. Recommendation Card

The signature "what to try next" component. Appears in both fitting and coaching contexts.

**Anatomy:**
- Accent tint background (`C.accentBg`)
- 2-3px left border in `C.accent`
- 10px uppercase Space Mono label: "RECOMMENDED NEXT TEST" or "SUGGESTED DRILL"
- 13px Cabinet Grotesk body text with the recommendation
- Inline accent-colored text for key values ("Information gain: high")
- Optional expandable section for detailed reasoning

```jsx
<div style={{
  background: C.accentBg, borderLeft: `2px solid ${C.accent}`,
  borderRadius: 0, padding: '12px 14px',
}}>
  <div style={{fontFamily: 'Space Mono', fontSize: 10, fontWeight: 700,
    letterSpacing: '.06em', textTransform: 'uppercase',
    color: C.accent, marginBottom: 4}}>
    Recommended next test
  </div>
  <div style={{fontFamily: 'Cabinet Grotesk', fontSize: 13,
    color: C.body, lineHeight: 1.5}}>
    {recommendation} <span style={{color: C.accent, fontWeight: 500}}>{gainLabel}</span>
  </div>
</div>
```

### 5d. Slider Control

Styled range input with dynamic fill, value display, and optional contextual note.

**Anatomy:**
- Flex row: 11px Cabinet Grotesk label (left) + 13px bold Space Mono value (right, accent-colored)
- 5px-height range track with accent gradient fill
- Optional 9px italic Cabinet Grotesk note below

**Slider fill technique:**
```css
background: linear-gradient(to right, ${C.accent} ${pct}%, ${C.borderSub} ${pct}%);
```

Use for: fitting "what-if" controls (loft adjustment, shaft weight, swingweight changes), coaching practice variables (difficulty level, feedback frequency).

### 5e. Status Pill

Colored badge for categorical labels. Used for shot quality, equipment status, session state.

**Technique:** Background is `{color}` at 10-12% opacity, text is the full color value. Border optional at 20% opacity.

**Common uses:**
- Shot quality: "center" (conf), "heel-high" (caution), "toe-low" (flag)
- Equipment status: "baseline" (muted), "testing" (accent), "recommended" (conf)
- Session state: "active" (conf), "paused" (caution), "complete" (muted)

### 5f. Section Label

Uppercase monospaced label for sub-sections within cards.

**Pattern:** Numbered marker + uppercase text at 10px, Space Mono weight 700, letterspacing .08em, color `C.muted`.

```
01  STRIKE QUALITY          02  LAUNCH CONDITIONS          03  DISPERSION
```

Never use emoji. Use two-digit numbered markers (01, 02, 03) or accent-colored thin separator lines.

### 5g. Stage Card (Collapsible Accordion)

Used for configuration comparisons (fitting) and drill/intervention records (coaching).

**Collapsed state:**
- White card surface with subtle border
- Left accent stripe (colored by outcome: conf/caution/flag)
- Title in Cabinet Grotesk 500 + subtitle in Cabinet Grotesk 400
- Right-aligned summary KPI (Space Mono)
- Chevron indicator (▸)

**Expanded state:**
- Card expands to show full metric grid, dispersion plot, and notes
- Smooth height transition (200-300ms ease)
- Expanded content uses `S.cardInner` for nested surfaces

### 5h. Impact Indicator (CalBar)

Magnitude-aware metric display showing whether a change is worth pursuing. Adapted from the enterprise CalBar pattern.

**Magnitude scale:**
| Level | Color | Bar Width | Label |
|-------|-------|-----------|-------|
| Marginal | `C.dim` | 5% | Within noise |
| Modest | `C.caution` | 20% | Detectable but small |
| Moderate | `C.accent` | 40% | Worth testing |
| Meaningful | `C.conf` | 65% | Clear improvement |
| Significant | `C.accent` (bold) | 90% | Major change |

**Classification (golf-specific):**
- Carry improvement <1 yard or <0.5% → Marginal
- Carry improvement 1-3 yards or 0.5-1.2% → Modest
- Carry improvement 3-6 yards or 1.2-2.5% → Moderate
- Carry improvement 6-12 yards or 2.5-5% → Meaningful
- Carry improvement >12 yards or >5% → Significant

Similar scales for dispersion, spin, and launch angle should be defined per-metric.

### 5i. Advanced Group (Collapsible Expert Controls)

Hidden section for model transparency and expert-level controls.

**Anatomy:** Thin border-top separator + 10px uppercase Space Mono label + chevron toggle. Content hidden by default. When expanded, shows parameter weights, uncertainty model details, or advanced configuration options.

**Label examples:**
- "MODEL ASSUMPTIONS" (fitting: what the AI is assuming about player tendencies)
- "UNCERTAINTY DETAIL" (coaching: reliability by metric, session drift estimates)
- "EQUIPMENT SPECS" (fitting: full shaft/head ontology data for current config)

---

## 6. Data Visualization Patterns

### 6a. Dispersion Plot

Scatter visualization showing shot distribution with confidence ellipse.

**Elements:**
- SVG viewBox scaled to represent the target area (lateral vs. carry)
- Dashed crosshair lines (target line vertical, carry reference horizontal)
- Individual shot dots: 4-5px radius circles, accent-colored
- Special dots: `C.conf` for best shot, `C.caution` for outlier, white for centroid
- Confidence ellipse: dashed stroke at 12-20% accent opacity, no fill
- Axis labels in Space Mono 9px
- Summary text below: "±X.X yds lateral · XXX-XXX carry · [bias description]"
- Legend using colored circles with Space Mono labels

### 6b. Strike Heatmap

Face impact location density map showing where the player is striking.

**Elements:**
- SVG rectangle representing the clubface (driver: wider ratio, irons: narrower)
- Face center crosshair (thin lines, muted color)
- Individual strike dots or density heatmap (gradient from surfaceAlt to accent)
- Cluster labels (e.g., "heel-high bias") in Space Mono 9px
- Sweet spot indicator (target zone outline, dashed)

### 6c. Confidence Band Chart

Line or area chart showing predicted outcomes with uncertainty ranges.

**Elements:**
- Primary prediction line: 2px solid `C.accent`
- Confidence band: filled area using `C.accentBg` (or accent at 8-12% opacity)
- Measured data points: solid dots on the line
- Reference lines (target values, baselines): dashed `C.muted`
- Axis: Space Mono 10px, `C.muted`
- Grid lines: `strokeDasharray="3 3"`, very light gray

### 6d. Before/After Comparison

Side-by-side or overlaid comparison of current vs. recommended configuration.

**Pattern A — Side by side:**
Two-column grid. Left column: "Current" with muted styling. Right column: "Recommended" with accent styling. Matching KPI tiles in each column with delta indicators between them.

**Pattern B — Overlaid:**
Single dispersion plot or chart with two data series. Current shots in `C.muted` (40% opacity), recommended/predicted in `C.accent`. Clear legend distinguishing the two.

### 6e. Waterfall Bridge

Shows decomposition of improvement sources. "Where did the gain come from?"

**Elements:**
- Horizontal bars: positive segments in `C.conf`, negative in `C.flag`
- Connector lines between segments
- Labels in Space Mono (source name + value)
- Total bar at the right with accent styling

**Use for:** "Strike quality contributed +4 yds, launch optimization +2 yds, shaft change +1 yd, lie angle -0.5 yd = net +6.5 yds"

### 6f. Funnel Visualization

Horizontal bar funnel for coaching or fitting decision workflows.

**Fitting funnel:** Baseline (N shots) → Strike-filtered (N shots) → Launch-optimized (N configs) → Validated (N configs) → Recommended (1 config)

**Coaching funnel:** Assessment → Diagnosis → Intervention → Practice → Retention test

**Elements:**
- Proportional bar widths relative to top of funnel
- Color progression from `C.muted` to `C.accent` as funnel narrows
- Count labels in Space Mono

### Chart Styling (Recharts)

When using Recharts for interactive charts:
- Always wrap in `ResponsiveContainer`
- Bar charts: rounded tops `radius={[4,4,0,0]}`
- Tooltips: solid white background with subtle border (not glassmorphic)
- Grid lines: `strokeDasharray="3 3"` with `C.borderSub`
- Axis tick labels: Space Mono, 10px, `C.muted`
- Legend: custom HTML below chart (not Recharts default)

---

## 7. Layout Patterns

### Page Structure

```
┌──────────────────────────────────────────────────┐
│ L1: Global bar (dark, persistent)                │
│ LOOPER.AI  [Session] Players History Equipment   │
├──────────────────────────────────────────────────┤
│ L2: Context bar (pills, editable state)          │
│ [Player] [Club] [Session #] [Swing #] [Goal]    │
├──────────────────────────────────────────────────┤
│ L3: Decision tabs                                │
│ Overview | Video Analysis | Diagnosis | ...      │
├────┬─────────────────────────────────────────────┤
│Shot│                                             │
│Rail│ L4: Content area (scrollable)               │
│    │ ┌─────────────┐ ┌─────────────┐            │
│ 14 │ │ KPI Grid    │ │ KPI Grid    │            │
│ 13 │ └─────────────┘ └─────────────┘            │
│ 12 │ ┌───────────────────────────────┐          │
│ 11 │ │ Primary Visualization         │          │
│ 10 │ └───────────────────────────────┘          │
│  9 │ ┌───────────────────────────────┐          │
│  8 │ │ Recommendation Card           │          │
│  . │ └───────────────────────────────┘          │
│  . │ ▸ Advanced: Model assumptions              │
│    │                                             │
├────┴─────────────────────────────────────────────┤
```

Shot rail (72px) is visible on session-active tabs only. Collapsible via header toggle. On non-session tabs (Player Plan, Drill Library), content area goes full-width.

### L1 — Global Bar Implementation

Dark bar (#1A1F2B), height 44px, flex layout. Logo (Cabinet Grotesk 800, 13px, .04em tracking) left-aligned. Mode buttons (Cabinet Grotesk 12px, 500 weight) with active state `rgba(255,255,255,0.12)` background and white text, inactive at 40% white. Settings + avatar circle right-aligned.

### L2 — Context Bar Implementation

White background, height 34px, 0.5px bottom border. Pills use Space Mono 9px with 12px border-radius. Active pill: accent border + accent text + accentBg background. Inactive pill: borderSub border + muted text + transparent background. All pills are clickable buttons.

### L3 — Decision Tabs Implementation

White background, height 36px, 0.5px bottom border. Tabs use Cabinet Grotesk 12px. Active tab: weight 500, accent color, 2px accent bottom border. Inactive tab: weight 400, muted color, transparent bottom border.

### Geometric Layout Discipline

Every screen must feel organized, aligned, and intentional. These rules prevent the visual disorder that undermines credibility with technical practitioners.

**Equal sizing within groups.** When panels, cards, or video viewports appear together, they must be the same dimensions. A 2x2 video grid means all four panels are identical in width and height. A row of 4 KPI tiles means all four tiles are the same width. Never let one card be taller or wider than its siblings unless there is an explicit hierarchy reason (e.g., a full-width recommendation card below a row of tiles).

**Grid alignment.** Every element on screen must align to a shared grid. Card edges, text baselines, and section boundaries should snap to consistent vertical and horizontal lines. Use CSS grid with explicit `minmax(0, 1fr)` columns — never mix percentage and fixed widths in the same row. If a card in column 1 has 14px padding, every card in that grid has 14px padding.

**Consistent card heights within rows.** In a grid row, all cards should have equal height. Use `align-items: stretch` (CSS grid default) to ensure cards in the same row grow to match the tallest. Never let a short card sit next to a tall card in the same row.

**Consistent border-radius by depth.** Outer containers use 12px. Inner/nested cards use 8px. Badges and pills use 3px or full-round. Never mix radii at the same depth level.

**Consistent gap values.** Use a single gap value per grid context: 8px for dense data grids (KPI tiles), 12px for standard content grids, 16px for major section separation. Never use arbitrary gap values.

**Two-column layouts must be truly equal.** When showing side-by-side content (before/after, video comparison, player vs. reference), use `1fr 1fr` — never let one column be wider. The visual equality reinforces the analytical comparison.

**Full-width elements span the full grid.** Recommendation cards, dispersion plots, and other full-width elements use `grid-column: 1 / -1` to span all columns. They should have the same left/right padding as the grid container, creating a flush visual edge.

**Vertical rhythm.** Sections are separated by consistent spacing (16-20px). Cards within a section use consistent gap (8-12px). Never vary vertical spacing arbitrarily between elements at the same hierarchy level.

### Grid Patterns

| Layout | CSS | Usage |
|--------|-----|-------|
| 4-column KPI | `grid-template-columns: repeat(4, minmax(0,1fr))` | Primary metric overview |
| 3-column KPI | `grid-template-columns: repeat(3, minmax(0,1fr))` | Compact metric sets |
| 2-column compare | `grid-template-columns: 1fr 1fr` | Before/after, side-by-side |
| Full-width panel | `grid-template-columns: 1fr` | Visualizations, rec cards |
| Data table | `grid-template-columns: 140px repeat(N, 1fr)` | Shot log, config comparison |

Grid gap: `8-12px` for KPI tiles, `12-16px` for sections.

### Spacing

| Element | Value |
|---------|-------|
| Page padding | `16px 20px` (compact), `20px 28px` (spacious) |
| Card padding | `14px 16px` (standard), `10px 12px` (inner/nested) |
| Section margin-bottom | `16-20px` |
| Grid gap | `8-12px` (tiles), `12-16px` (sections) |
| Component internal margin-bottom | `10-12px` |

### Max Width

- Product UI: `1400px` centered with `margin: 0 auto`
- Reports/exports: `960px`
- Marketing pages: `1200px`

---

## 8. Number Formatting & Magnitude Framing

### Format Utility

```javascript
const fmt = (v, type) => {
  switch(type) {
    case 'yds':  return v.toFixed(1) + ' yds';
    case 'mph':  return v.toFixed(1) + ' mph';
    case 'rpm':  return Math.round(v).toLocaleString() + ' rpm';
    case 'deg':  return v.toFixed(1) + '°';
    case 'pct':  return v.toFixed(1) + '%';
    case 'mm':   return v.toFixed(1) + ' mm';
    case 'g':    return Math.round(v).toLocaleString() + ' g';
    case 'int':  return Math.round(v).toLocaleString();
    default:     return String(v);
  }
};
```

### Delta Formatting

```javascript
const fmtDelta = (v, type) => {
  const prefix = v > 0 ? '▲ +' : v < 0 ? '▼ ' : '';
  const color = v > 0 ? C.conf : v < 0 ? C.flag : C.muted;
  return { text: prefix + fmt(Math.abs(v), type), color };
};
```

### Conventions

- Always use `toLocaleString()` for numbers ≥1,000
- Always show `+` prefix on positive deltas
- Delta indicators: `▲` for positive (green), `▼` for negative (red)
- Ranges displayed as: `262-272 yds` (no "to" or dash-with-spaces)
- Confidence always as percentage with badge: `84%`
- Strikethrough (`text-decoration: line-through`) for superseded/before values
- Never show more than one decimal place in session-context metrics
- Spin rate is always rounded to integers
- Impact location in mm with one decimal

### Magnitude Framing

Every summary metric should include a magnitude label. Use the Impact Indicator component (section 5h) for visual framing, or inline text:

```
"Expected improvement: +4.2 yds (Moderate — exceeds typical shot-to-shot variance)"
```

---

## 9. Interaction Patterns

### Progressive Disclosure Hierarchy

1. **Tab level** — major product areas (L3 decision tabs, left-to-right follows session workflow)
   - Fitting: Overview → Configuration Tests → Recommendation → Build Sheet
   - Coaching: Overview → Video Analysis → Diagnosis → Interventions → Player Plan
2. **Card level** — collapsible stage cards for each config tested or drill used
3. **Advanced level** — hidden expert controls (model assumptions, full uncertainty)
4. **Note level** — inline contextual notes on individual controls and metrics

### Four-Layer Navigation Architecture

**L1 — Global bar (persistent, dark, horizontal)**
Always visible. Contains logo, product mode switcher, account controls. Dark background (#1A1F2B) creates visual anchor separating navigation from content. Maximum 4-6 modes.
- Fitting modes: Session, Players, History, Equipment, Build Sheets
- Coaching modes: Session, Players, History, Drill Library, Practice Plans

**L2 — Context bar (contextual, light, horizontal pills)**
Shows current working context as tappable pills. NOT navigation — it's editable state display. Clicking a pill opens a quick-edit popover (change club, switch player, update goal). Every pill is interactive.
- Fitting context: Player, Club/head, Shaft, Shot count, Session goal
- Coaching context: Player, Club, Session #, Swing count, Lesson goal

**L3 — Decision tabs (contextual, light, horizontal tabs)**
Primary in-page navigation within a mode. Tabs follow the decision workflow sequence (left-to-right as session progresses). Maximum 5 tabs. Active tab has accent underline.
- Fitting: Overview → Configs Tested → Recommendation → Build Sheet
- Coaching: Overview → Video Analysis → Diagnosis → Interventions → Player Plan

**L4 — Content disclosure (in-content, collapsible)**
NOT a navigation layer. Stage cards expand/collapse. Advanced groups reveal expert controls. Three-tier depth: primary metrics always visible, detail one click, model assumptions behind expert toggle.

### Navigation Rules

- L1 is always dark (#1A1F2B), everything below is light — creates a strong visual anchor
- L2 pills are editable state, not navigation — context always visible without consuming a nav layer
- L3 tab order follows the decision sequence, not alphabetical — practitioner moves left-to-right as session progresses
- L3 tabs: maximum 5, minimum 3
- L4 is content disclosure, not navigation — keeps actual nav to 2 clickable layers (L1 + L3)
- Never nest tabs inside tabs — if a tab needs sub-tabs, restructure into stage cards (L4)
- L1 + L2 combined height: under 90px — maximize content space on bay displays
- No vertical sidebar navigation for session views — horizontal nav maximizes space for data visualizations

### Shot Rail (Session-Active Tabs Only)

A collapsible vertical shot index on the left edge of the content area. Visible by default on session-active tabs (Overview, Video Analysis, Diagnosis, Interventions). Hidden on planning tabs (Player Plan). Collapsible via header toggle arrow.

**Specifications:**
- Width: 72px (collapsed: 0px)
- Each shot entry: shot number (circle badge) + club abbreviation only
- Row height: ~32-36px (fits 15-20 shots visible without scrolling)
- Newest shot at top, reverse chronological
- Active shot: accent-colored circle badge + accent tint background row
- Flagged shots: flag-colored circle badge (outlier, mishit, significant deviation)
- Club abbreviations serve as implicit session section dividers
- Selecting a shot updates the entire main content area for that shot

**Behavior:**
- Visible by default when entering Session mode on active tabs
- Coach can collapse via ◄ arrow in header to gain full-width content
- Persists across L3 tab switches within session-active tabs
- Disappears automatically on Player Plan tab
- When collapsed, a small expand ► affordance remains at the left edge

### Video Analysis Module (L3 Tab — Coaching OS)

The Video Analysis tab is the second tab in the Coaching OS L3 sequence. It provides a four-panel 2x2 grid connecting video to data to AI insight. All four panels must be equal size.

For full specification, read `references/video-analysis-module.md`. Key points:
- Panel 01 (top-left): Player swing with P-position pills and drawing tools
- Panel 02 (top-right): Reference comparison (pro, previous best, 3D avatar) — video viewport must match Panel 01 dimensions exactly
- Panel 03 (bottom-left): Position data synced to current video frame
- Panel 04 (bottom-right): AI position analysis with correlation confidence badges
- Core IP is the video-to-data correlation engine (native build). 3D kinematics integrates from Sportsbox API.

### Tab System

- Tabs are `button` elements styled with bottom border indicator
- Active tab: `C.accent` bottom border (2px), `C.ink` text, `fontWeight: 600`
- Inactive tab: no bottom border, `C.muted` text, `fontWeight: 400`
- Tab container has bottom border `C.border`

### State Management

- All slider/control states use `useState` at the top component level
- Computed predictions use `useMemo` to avoid recalculation on every render
- Stage card open/close tracked in a `Set` or boolean array
- Active tab tracked as a single string state

### Override Pattern

Every AI recommendation must have an override control. The practitioner is always in control.

**Implementation:** Recommendation card includes a subtle "Override" or "Adjust" button that opens the relevant slider controls pre-filled with the AI's suggestion. Any manual adjustment replaces the AI recommendation and is logged as a human override (valuable training signal).

### Loading States

- Skeleton screens using `C.surfaceAlt` animated blocks for data cards
- Never show spinners for sub-second operations
- For longer computations (model inference), show a progress indicator with Space Mono text: "Estimating outcomes..." with a subtle pulsing accent bar

---

## 10. Looper-Specific Patterns

### 10a. Shot Rail

See "Shot Rail" in section 9 (Interaction Patterns) for full specification. The shot rail is the primary intra-session navigation element — a 72px collapsible left rail showing shot number + club only. Visible on session-active L3 tabs (Overview, Video Analysis, Diagnosis, Interventions). Each entry is ~32-36px tall for maximum shot visibility without scrolling.

### 10b. Session Context Bar (Pills)

Horizontal row of contextual pills showing current session parameters.

**Fitting context:** `Driver · Qi10 LS 9°` | `Tensei 1K White 65TX` | `Shot 8/12`
**Coaching context:** `7-iron · Session 3 of 8` | `Goal: Strike consistency` | `Swing 14/20`

Pills use: Space Mono 9-10px, `C.muted` text, `C.border` border, rounded full.

### 10c. Player Embedding Summary

Compact visualization of a player's "signature" — their tendencies and variability.

**Elements:**
- Mini dispersion thumbnail (small SVG)
- Key delivery stats: avg path, avg face, avg attack, avg dynamic loft
- Variability indicators: SD for each metric, displayed as ± ranges
- Trend arrows if longitudinal data available (improving/stable/declining)

### 10d. Drill/Cue Card (Coaching OS)

Card representing a coaching intervention with structured metadata.

**Anatomy:**
- Title (drill name) in Cabinet Grotesk 500
- Cue type badge: "External" (conf), "Internal" (caution), "Constraint" (accent)
- Difficulty rating (1-5 dots or bar)
- Expected effect description
- Optional: link to video demo, feedback schedule note

### 10e. Build Sheet (Fitting Engine Export)

Structured output document for the final fitting recommendation.

**Sections:**
1. Player info + session metadata
2. Recommended configuration (full spec table)
3. Performance comparison (before/after KPI grid)
4. Key evidence (dispersion plot, strike map)
5. Uncertainty note + validation recommendation
6. Fitter signature / override notes

---

## 11. Anti-Patterns

| Anti-Pattern | Instead Do |
|-------------|-----------|
| Raw numbers without context | Always pair with magnitude label, range, or comparison |
| Single-point predictions without uncertainty | Show confidence badge + range on every prediction |
| Equal visual weight for all controls | Hide advanced controls behind collapsible toggles |
| Color as the only differentiator | Combine color + shape (▲▼) + text labels |
| Dense data tables as the primary view | Use KPI tiles, stage cards, and visualizations first; tables as drill-down |
| Emoji icons for section labels | Use numbered markers (01, 02, 03) or typographic separators |
| Glassmorphism on primary data surfaces | Solid surfaces for data; glass only for overlays and marketing |
| Decorative backgrounds or textures | Flat `C.bg` background; zero decoration |
| AI jargon in the UI | Use practitioner language: "expected improvement" not "predicted marginal gain" |
| "Our AI recommends..." | "Recommended next test:" — the system recommends, not "the AI" |
| Generic "Settings" labels | Domain-specific: "Session assumptions," "Model confidence," "Equipment specs" |
| Bright red for all warnings | Reserve `C.flag` for actual errors; use `C.caution` for warnings |
| Full-glass surfaces in bay environments | Solid surfaces ensure readability in variable lighting |
| Unequal card/panel sizes in the same row | All siblings in a grid row must be equal width and height |
| Mixed border-radius at the same depth | Outer cards: 12px. Inner cards: 8px. Badges: 3px. Consistent per level. |
| Inconsistent gap/spacing between same-level elements | Pick one gap value per grid context and use it everywhere |
| Video viewports of different sizes in comparison views | Both video panels must have identical dimensions for valid visual comparison |
| Arbitrary padding that breaks grid alignment | All cards in a grid share the same padding values |

---

## 12. Reuse Checklist

When building a new Looper.AI product screen or prototype:

- [ ] Import color constants (`C` for light, `CD` for dark)
- [ ] Import glass tokens (`S` for solid, `SG` for subtle glass)
- [ ] Set up the format utility (`fmt`, `fmtDelta`)
- [ ] Build KPI Tile and Confidence Badge components first — they appear everywhere
- [ ] Build the Top Bar with logo + breadcrumb + session pills
- [ ] Design tab structure (max 4-6 tabs per product surface)
- [ ] For each section: measured data on top, recommendations below
- [ ] Use Stage Cards for any multi-item comparison (configurations, drills)
- [ ] Add Recommendation Card with override control for every AI suggestion
- [ ] Include Impact Indicator (magnitude framing) on all summary metrics
- [ ] Add confidence badges to every predicted value
- [ ] Include "Advanced" collapsible group for model transparency
- [ ] Wire up control state → useMemo computed values → KPI display
- [ ] Test readability: would this be legible on a bright bay display at arm's length?
- [ ] Geometric check: are all cards/panels in the same row equal size? Are gaps consistent? Do edges align?
- [ ] Video check: if showing side-by-side videos, are both viewports identical dimensions?
- [ ] Run the brand voice check: does the language match the Looper tone? (see brand-assets SKILL.md)
- [ ] Verify: no emoji, no AI jargon, no decorative elements, no glassmorphism on data surfaces
