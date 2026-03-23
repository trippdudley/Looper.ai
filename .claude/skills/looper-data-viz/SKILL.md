---
name: looper-data-viz
description: "Golf-specific data visualization for Looper.AI. Use this skill when building charts, dispersion maps, strike maps, trend lines, confidence bands, session comparisons, sparklines, or any data visualization in a Looper.AI prototype. Also trigger for number formatting, magnitude framing, metric display rules, and any component that renders numeric golf data. All visualizations must have sidebar-compatible compact variants (420-480px width)."
---

# Looper.AI Data Visualization Patterns

## Core Principle
Every chart earns its space. No decorative visualizations. Every pixel of ink should represent data (Tufte's data-ink ratio). Two variants for every visualization: portal (full-width, detailed) and sidebar (compact, glanceable). Sidebar variants must work within 420-480px width.

## Number Formatting Rules

All numeric golf data follows these formatting rules consistently across the entire product:

| Metric | Format | Example |
|--------|--------|---------|
| Carry / Total distance | 1 decimal, yards | 168.3 yds |
| Ball speed | 1 decimal, mph | 121.4 mph |
| Club speed | 1 decimal, mph | 88.2 mph |
| Launch angle | 1 decimal, degrees | 17.2° |
| Spin rate | Nearest 50, rpm | 6,250 rpm |
| Spin axis | 1 decimal, degrees | -2.3° |
| Club path | 1 decimal, degrees | 1.8° |
| Face angle | 1 decimal, degrees | -0.4° |
| Face to path | 1 decimal, degrees | -2.2° |
| Dynamic loft | 1 decimal, degrees | 22.1° |
| Attack angle | 1 decimal, degrees | -3.4° |
| Smash factor | 2 decimals | 1.38 |
| Descent angle | 1 decimal, degrees | 45.2° |
| Impact location | 1 decimal, inches | +0.4" toe |
| Handicap | 1 decimal | 12.1 |
| Confidence | Whole number, percent | 74% |
| Percentages (general) | Whole number | 62% |

Always render numbers in Space Mono. Always include the unit label in 10px Space Mono muted, immediately after the number with a thin space.

## Magnitude Framing

What counts as "meaningful" change in each metric. Use these thresholds when labeling improvements or regressions:

| Metric | Meaningful threshold | Display treatment |
|--------|---------------------|-------------------|
| Carry distance | > 3 yards | Green delta arrow if improvement |
| Ball speed | > 1.5 mph | Green delta arrow |
| Spin rate | > 200 rpm | Amber if concerning direction |
| Club path | > 1.0° | Directional arrow |
| Face to path | > 0.5° | Directional indicator |
| Impact location | > 0.2" | Strike map shift indicator |
| Dispersion (side) | > 2 yards | Green if tightening |
| Handicap | > 0.3 | Trend arrow |

Changes below these thresholds should be labeled "within noise" or simply shown without delta indicators. Never celebrate insignificant changes.

## Delta Display Pattern

When showing improvement or regression between sessions or between baseline and current:

- **Improvement**: `+3.2 yds` in #0FA87A (confidence green) with lucide `TrendingUp` icon (14px)
- **Regression**: `-1.8°` in #C93B3B (flag red) with lucide `TrendingDown` icon (14px)
- **Within noise**: `+0.8 yds` in #9CA3AF (muted) with no icon
- Format: always Space Mono, sign prefix (+ or -), 1 decimal, unit

## Visualization Types

### 1. Dispersion Ellipse

Shows shot landing pattern as a 2D scatter with a confidence ellipse.

**Portal variant** (full-width card, ~600px wide):
- SVG coordinate system with target center at origin
- Individual shot dots: 6px circles, accent color, 60% opacity
- Confidence ellipse: 1px stroke in accent color, 10% fill
- Axis labels: "Left/Right (yards)" and "Short/Long (yards)" in 10px Space Mono
- Include mean marker (crosshair, 2px stroke) and numeric labels for spread

**Sidebar variant** (compact, ~200px square):
- Same SVG but simplified: no axis labels, smaller dots (4px)
- Ellipse only (no individual dots if >10 shots — too cluttered at this size)
- Mean marker + single spread number below: "18.4 yds" in 12px Space Mono
- Tap to expand to portal-size in a modal

### 2. Strike Map

Shows impact location pattern on the clubface as a heatmap.

**Portal variant** (~300px wide):
- SVG clubface outline (rounded rectangle for iron, wider for driver)
- Individual impact dots: 5px, color-coded by outcome quality
- Center marked with crosshair
- Heatmap gradient overlay showing density
- Mean impact location highlighted

**Sidebar variant** (~120px wide):
- Simplified face outline
- No individual dots — just the heatmap gradient and mean marker
- Single stat below: "+0.4\" toe" in 12px Space Mono
- Trend arrow if comparing to previous session

### 3. Carry Window Chart

Shows the range of carry distances with uncertainty bands.

**Portal variant** (full-width):
- Horizontal bar or range chart
- Central bar: interquartile range (25th-75th percentile)
- Extended whiskers: 10th-90th percentile
- Mean marker: vertical line with label
- Target zone: shaded region if coach has defined a target carry window
- Built with recharts `ComposedChart` or custom SVG

**Sidebar variant** (full sidebar width):
- Simplified horizontal bar, no whiskers
- Mean value prominent: "164.2 yds" in 16px Space Mono
- Range shown as thin bar below with min/max labels in 10px muted

### 4. Session Trend Sparklines

These are sidebar-native. Small inline charts showing a metric's trend over recent shots or sessions.

**Specs:**
- Width: fills available space (typically 80-120px in a metric card)
- Height: 24-32px
- No axes, no labels, no grid lines — just the line
- Line: 1.5px stroke, accent color (#10B981 in dark mode)
- Last point: 4px dot at the end of the line
- Optional: subtle fill below the line at 10% opacity

**Use cases:** Ball speed trend across 14 shots. Carry trend. Strike centrality trend. Spin trend. Face-to-path trend. Any metric with sequential measurements.

**Implementation:** recharts `LineChart` with all decorations stripped, or a simple SVG `polyline`.

### 5. Confidence Progress Arc

Small circular indicator showing AI confidence level, used in the sidebar during diagnosis.

**Specs:**
- Size: 28px diameter
- SVG circle with stroke-dasharray for partial fill
- Background ring: 2px, #2A3544
- Progress ring: 2px, color follows thresholds (red <60%, amber 60-84%, green ≥85%)
- Center: percentage in 10px Space Mono (omit below 40%)
- Animation: smooth CSS transition on stroke-dashoffset, 500ms ease-out

### 6. Before/After Comparison

Used in post-session summary and player progress views.

**Portal variant** (two-column card):
- Left column: "Session 13" metrics
- Right column: "Session 14" metrics
- Delta between them highlighted with magnitude framing
- Metrics stacked vertically: carry, dispersion, strike center, face-to-path
- Each row: metric name (DM Sans 12px muted), values in Space Mono, delta indicator

**Sidebar variant** (not used during lesson — portal only):
- If needed in a compact context, show as a single metric with delta: "Dispersion: 18.4 yds (−5.6)" with the delta colored per improvement/regression rules

### 7. Player Progress Longitudinal View (Portal Only)

Shows trends across multiple sessions. Not used in the sidebar.

- recharts `LineChart` with session numbers on x-axis
- Multiple metrics as separate lines (selectable via toggle)
- Confidence band as `Area` fill at low opacity around each line
- Lesson milestone markers on x-axis (vertical dashed lines with session labels)
- Time scale: last 5-20 sessions depending on zoom

## Color Rules for Data

- Primary data: accent color (#10B981 dark mode, #0D7C66 light mode)
- Secondary data: #6366F1 (indigo) for comparison lines
- Improvement indicators: #0FA87A
- Regression indicators: #C93B3B
- Neutral/within noise: #9CA3AF
- Caution: #D4980B
- Grid lines: #1E2A36 in dark mode, #ECEEF2 in light mode (very subtle)
- Axes text: 10px Space Mono, muted color

## Chart Anti-Patterns

- No 3D effects on any chart
- No chart legends that take up more space than the chart
- No pie charts (use horizontal bars instead)
- No rainbow color scales — use a single-hue sequential scale
- No animation on initial chart render in the sidebar (performance)
- No tooltips in the sidebar (too small for hover targets). Use tap-to-expand instead.
- No vertical axis labels in the sidebar (waste of precious horizontal space)
