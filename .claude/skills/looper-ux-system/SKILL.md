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

### Light Mode (Portal + Player)
```
--bg-page: #F6F7F9;
--bg-card: #FFFFFF;
--bg-card-nested: #F0F2F5;
--border-primary: #DFE2E7;
--border-subtle: #ECEEF2;
--text-heading: #1A1F2B;
--text-body: #4B5563;
--text-muted: #9CA3AF;
--accent: #0D7C66;
--confidence: #0FA87A;
--caution: #D4980B;
--flag: #C93B3B;
```

### Dark Mode (Lesson Sidebar)
```
--bg-page: #0C1117;
--bg-surface: #151D28;
--bg-card: #1E2A36;
--border-primary: #2A3544;
--border-subtle: #1E2A36;
--text-heading: #E8ECF1;
--text-body: #8B99A8;
--text-muted: #5E6E7E;
--accent: #10B981;
--confidence: #0FA87A;
--caution: #D4980B;
--flag: #C93B3B;
```

### Semantic Badge Backgrounds
All semantic colors use tinted backgrounds at 15% opacity:
- Confidence: `rgba(15, 168, 122, 0.15)` with text #0FA87A
- Caution: `rgba(212, 152, 11, 0.15)` with text #D4980B
- Flag: `rgba(201, 59, 59, 0.15)` with text #C93B3B

## Typography

### Font Stack
- **Brand voice**: DM Sans (Google Fonts fallback for Cabinet Grotesk). All headings, body text, prose, labels.
- **Data voice**: Space Mono (Google Fonts). All numbers, metrics, confidence values, timestamps, code-like text.
- **Editorial voice**: Playfair Display (Google Fonts fallback for Instrument Serif italic). Taglines and pull quotes only.

### The Split Is Absolute
DM Sans never renders numbers in data cards or metric displays. Space Mono never renders body paragraphs or prose. If a component shows both a label and a number, the label is DM Sans and the number is Space Mono.

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

lucide-react only. No emoji. No custom icon sets. Import individually:
```tsx
import { Search, Lightbulb, MessageSquare, ClipboardCheck, TrendingUp, Pencil } from 'lucide-react'
```
Standard size: 16px in sidebar, 18-20px in portal. Stroke width: 1.5px. Color: inherit from parent text.

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

- No emoji in the UI — ever, anywhere
- No Inter, Roboto, Arial, or system fonts
- No purple gradients or generic AI aesthetics
- No border-radius > 8px
- No "Powered by AI" badges or sparkle icons
- No loading spinners — use skeleton screens or visible AI reasoning patterns
- No hero sections with stock photography
- No gradient backgrounds on content areas
- No pie charts (use horizontal bars)
- No 3D chart effects
- No tooltips in the sidebar (targets too small — use tap-to-expand)
- No horizontal scrolling in any context
- No fitting/fitter/equipment references (shelved)

## Reference Files

For detailed implementation:
- `references/components.md` — Full JSX patterns for each component with portal and sidebar variants
- `references/data-viz.md` — Chart and visualization implementation details
- `references/video-analysis-module.md` — Video player and comparison view specs
