---
name: looper-ux-system
description: "Looper.AI UX Design System. Use this skill whenever building ANY Looper.AI UI: coach portal dashboards, lesson sidebar panels, live lesson timelines, player app screens, session views, data visualizations, metric cards, confidence badges, or any interactive prototype. Covers both full-width portal (light mode) and 420-480px sidebar (dark mode) layouts. Trigger when the user mentions Looper design system, component library, visual patterns, or asks to build a mockup or prototype for Looper.AI."
---

# Looper.AI UX Design System

## Two Form Factors, One System

Every component, token, and pattern in this system exists in two contexts. Design for both from the start.

**Coach Portal** — Full-width (1200-1400px max), light mode, desktop-first. The between-lesson command center.
**Lesson Sidebar** — Fixed 420-480px, dark mode, ultra-compact. The in-lesson copilot beside TrackMan.
**Player Portal** — Mobile-first 480px, light mode. Consumer-facing.

## Color Tokens

See root CLAUDE.md for hex values. This section adds CSS variable names and badge-specific patterns.

### CSS Variable Names (map to root CLAUDE.md hex values)
Light mode: `--bg-page`, `--bg-card`, `--bg-card-nested` (#F0F2F5), `--border-primary` (#DFE2E7), `--border-subtle` (#ECEEF2), `--text-heading`, `--text-body`, `--text-muted`, `--accent`, `--confidence`, `--caution`, `--flag`

Dark mode: `--bg-page`, `--bg-surface`, `--bg-card`, `--border-primary` (#2A3544), `--border-subtle` (#1E2A36), `--text-heading`, `--text-body`, `--text-muted`, `--accent`, `--confidence`, `--caution`, `--flag`

### Semantic Badge Backgrounds
All semantic colors use tinted backgrounds at 15% opacity:
- Confidence: `rgba(15, 168, 122, 0.15)` with text #0FA87A
- Caution: `rgba(212, 152, 11, 0.15)` with text #D4980B
- Flag: `rgba(201, 59, 59, 0.15)` with text #C93B3B

## Typography Scale

Fonts and split rules are defined in root CLAUDE.md (single source of truth). This section adds size scales by surface.

### Scale

**Portal (light mode):**
| Role | Font | Weight | Size |
|------|------|--------|------|
| Page heading | DM Sans | 700 | 24px |
| Section heading | DM Sans | 600 | 18px |
| Card heading | DM Sans | 600 | 15px |
| Body | DM Sans | 400 | 14px |
| Caption / label | DM Sans | 400 | 12px |
| Primary metric | Space Mono | 700 | 28-36px |
| Secondary metric | Space Mono | 500 | 18-20px |
| Data label | Space Mono | 400 | 11px |
| Confidence badge | Space Mono | 500 | 10px |

**Sidebar (dark mode) — compressed:**
| Role | Font | Weight | Size |
|------|------|--------|------|
| Phase header | DM Sans | 600 | 14px |
| Insight text | DM Sans | 400 | 13px |
| Body / label | DM Sans | 400 | 12px |
| Primary metric | Space Mono | 700 | 16-20px |
| Secondary metric | Space Mono | 500 | 14px |
| Thinking text | Space Mono | 400 | 12px |
| Timestamp / tag | Space Mono | 400 | 10px |
| Confidence badge | Space Mono | 500 | 10px |

## Spacing System

4px base grid. Two density levels:

**Portal spacing:**
- Component gap: 8-12px
- Section padding: 12-16px
- Card padding: 16px
- Card border-radius: 8px (max — never exceed 8px anywhere in Looper)
- Page margin: 24px

**Sidebar spacing:**
- Component gap: 8px
- Section padding: 8-10px
- Card padding: 10px
- Card border-radius: 6px
- No page margin — sidebar content fills the width with 8px padding on sides

## Layout Patterns

### Coach Portal Layout
```
┌──────────────────────────────────────────────────────┐
│  L1: Global nav bar (48px, dark, logo + nav items)   │
├────────┬─────────────────────────────────────────────┤
│ Sidebar│  Main content area (scrollable)             │
│ Nav    │                                             │
│ 240px  │  ┌─────────┬─────────┬─────────┬────────┐  │
│ (48px  │  │ Metric  │ Metric  │ Metric  │ Metric │  │
│ when   │  │ Card    │ Card    │ Card    │ Card   │  │
│ coll.) │  └─────────┴─────────┴─────────┴────────┘  │
│        │                                             │
│ Items: │  ┌──────────────────────────────────────┐   │
│ Dashbd │  │ Content cards (full width or 2-col) │   │
│ Roster │  └──────────────────────────────────────┘   │
│ History│                                             │
│ Plans  │                                             │
│ Digest │                                             │
└────────┴─────────────────────────────────────────────┘
```
- Max width: 1400px, centered
- Sidebar nav: 240px expanded, 48px collapsed (icon-only). Collapsible via toggle.
- Dashboard grid: 3-4 metric cards per row
- Content cards: full-width or 2-column depending on content

### Lesson Sidebar Layout
```
┌────────────────────────┐
│ LOOPER.AI    Session 14│  ← Header: 40px, logo + session info
├────────────────────────┤
│ ● Catch-up     5:12   │  ← Phase: collapsed (past)
├────────────────────────┤
│ ◉ DIAGNOSIS   15:34   │  ← Phase: expanded (current)
│                        │
│ [thinking indicator]   │
│                        │
│ ┌────────────────────┐ │
│ │ Insight Card       │ │  ← Max 2-3 visible
│ └────────────────────┘ │
│ ┌────────────────────┐ │
│ │ Insight Card       │ │
│ └────────────────────┘ │
│                        │
│ ┌──────┐ ┌──────┐     │
│ │ Metric│ │Metric│     │  ← Max 2 per row
│ └──────┘ └──────┘     │
├────────────────────────┤
│ ○ Intervention         │  ← Phase: muted (future)
│ ○ Review               │
└────────────────────────┘
```
- Fixed width: 420-480px
- Header: 40px, contains logo (small) and session identifier
- Phases stack vertically. Current expanded, past collapsed, future muted.
- Content within a phase scrolls independently
- All cards stack vertically. Max 2 small metric tiles per row.

### Player Portal Layout
```
┌──────────────────┐
│  LOOPER.AI       │  ← Header: 48px
├──────────────────┤
│ Dashboard │ ...  │  ← Tab bar: 44px, 4 tabs
├──────────────────┤
│                  │
│  Content area    │
│  (scrollable)    │
│                  │
│                  │
│           [💬]   │  ← Ask Looper floating button
└──────────────────┘
```
- Width: 480px max (mobile-first)
- Tab bar: Dashboard, Practice, Rounds, My Journey
- Floating "Ask Looper" button: 48px circle, bottom-right, accent color
- Cards: full-width, stacked vertically

## Component Library Overview

Components are documented in detail in `references/components.md`. Each component has portal and sidebar variants. Key components:

**MetricCard** — Displays a single metric with label, value, trend sparkline, and optional delta. Portal: card with padding and border. Sidebar: ultra-compact, no border, 2 per row max.

**ConfidenceBadge** — Pill-shaped badge showing confidence percentage. Three visual states per threshold (high/medium/low). Same across both form factors but smaller in sidebar (10px vs 11px).

**InsightCard** — The primary content unit in the sidebar. Phase tag, timestamp, insight text, confidence badge, expand/dismiss actions. Sidebar-native; in the portal, used inside the post-session phase-expanded view.

**PhaseIndicator** — Dot + label for a timeline phase. Three states: active (pulsing, full opacity), past (static, 60%), future (muted, 30%). Used in the lesson timeline.

**LessonTimeline** — Vertical stack of PhaseIndicators with expandable content sections. Sidebar-only.

**SuggestionCard** — Drill or cue recommendation card with type badge, expected effect, confidence, and action buttons (accept/dismiss/alternatives). Sidebar: intervention phase. Portal: post-session review.

**PreSessionBriefing** — Single scrollable card showing player context before a lesson. Portal-only (hands off to sidebar Catch-up phase when lesson starts).

## Icons

lucide-react only (see root CLAUDE.md). Size by surface: 16px in sidebar, 18-20px in portal. Stroke width: 1.5px. Color: inherit from parent text.

## Animation Principles

- Phase transitions: 300ms ease-out for collapse/expand
- Insight card entry: translateY(8px) → 0, 200ms ease-out
- Thinking dot pulse: opacity 0.4 → 1.0, 1.5s ease-in-out infinite
- Confidence arc fill: 500ms ease-out on stroke-dashoffset
- Streaming text: 30-50ms per word via setInterval
- Card dismiss (swipe): 150ms ease-in slide out
- No bounce, no spring, no overshoot. Movements are clinical and precise.
- No animation on initial page load in the sidebar (performance in bay environment)

## Reuse Checklist

Before building any component, verify:
- [ ] Does it work at sidebar width (420-480px)?
- [ ] Does it work at portal width (full)?
- [ ] Are numbers in Space Mono and labels in DM Sans?
- [ ] Does it use the correct color tokens for its mode (light/dark)?
- [ ] Is the border-radius ≤ 8px?
- [ ] No emoji anywhere?
- [ ] No inline styles — Tailwind only?
- [ ] Does it have a JSDoc comment explaining its purpose?
- [ ] Does it use lucide-react icons (not custom SVG icons)?

## Anti-Patterns

See also root CLAUDE.md for global rules (no emoji, lucide-react only, border-radius caps). Additional UX-specific anti-patterns:
- No loading spinners — use skeleton screens or visible AI reasoning patterns
- No hero sections with stock photography
- No gradient backgrounds on content areas
- No pie charts (use horizontal bars)
- No 3D chart effects
- No tooltips in the sidebar (targets too small — use tap-to-expand)
- No horizontal scrolling in any context
- No "Powered by AI" badges or sparkle icons
- Avoid generic AI aesthetics (purple gradients, glowing brains, neural net imagery, sparkle icons)

## Accessibility & Interaction Standards

### Accessibility (Required)
- Color contrast: minimum 4.5:1 ratio for normal text, 3:1 for large text
- Visible focus rings on all interactive elements (keyboard navigation)
- Descriptive alt text for meaningful images; decorative images use `alt=""`
- `aria-label` on icon-only buttons
- Tab order matches visual order
- Form inputs use `<label>` with `for` attribute

### Touch & Interaction
- Minimum 44x44px touch targets on all interactive elements
- `cursor-pointer` on all clickable elements
- Disable buttons during async operations (prevent double-submit)
- Error messages positioned near the problem, not in a distant banner
- Smooth transitions: 150-300ms for micro-interactions

### Performance
- Check `prefers-reduced-motion` and disable animations when set
- Reserve space for async content to prevent layout shift
- Lazy load images below the fold

## Design Quality Principle

Avoid generic AI-generated aesthetics. No purple gradients on white, no overused font families (Inter, Roboto), no cookie-cutter SaaS templates. Looper's design should feel like it was made by an engineer who plays golf — clinical, precise, craft-respecting. Every visual choice should be intentional and specific to the product context.

## Reference Files

For detailed implementation:
- `references/components.md` — Full JSX patterns for each component with portal and sidebar variants
- `references/data-viz.md` — Chart and visualization implementation details
- `references/video-analysis-module.md` — Video player and comparison view specs
