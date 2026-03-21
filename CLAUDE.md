# Looper.AI — Claude Code Reference

**Last updated: March 21, 2026**

This is the primary reference for Claude Code when working on this codebase. Read this file completely before making any changes.

---

## What Looper.AI Is

Looper.AI is the AI-native Coaching OS for golf. It is a **copilot, not a dashboard.** One intelligence layer powers three experiences — coach copilot, player copilot, and fitter copilot. Each speaks when useful, stays quiet when not, and learns from every human correction.

The product captures what happens during lessons and fittings — video, launch data, coaching interventions, equipment context — and turns it into a persistent, intelligent record that makes every session build on the last.

**The core architecture principle: the timeline is the data model. The tabs are views.** Every piece of data is a typed event on a unified chronological timeline. Surfaces like Dashboard, Practice, Rounds, and My Journey are filtered lenses on that timeline — not separate products.

**Tagline:** Expertise, engineered.

---

## Product Architecture

### One Intelligence, Three Copilot Experiences

**Coach Copilot** — the primary product (academy-facing)
- Pre-session briefing auto-assembled from player history, last session, practice adherence, WHOOP recovery, Arccos patterns
- In-session: subtle notifications that speak only when useful (pattern detection, limiting factor alerts)
- Post-session: auto-generated summary — coach reviews/corrects in 30 seconds instead of creating from scratch
- Between-lesson: weekly player digest, practice plan monitoring, re-engagement nudges

**Player Copilot** — the consumer product (Looper Player)
- Mobile-first, timeline-driven
- Four surfaces: Dashboard, Practice, Rounds, My Journey
- "Ask Looper" conversational overlay
- Cross-source connections (WHOOP recovery → practice dispersion) are the key differentiator
- Must be fully valuable standalone for uncoached players

**Fitter Copilot** — fitting session intelligence
- Real-time next-configuration suggestions
- Counterfactual reasoning with uncertainty bands
- Auto-generated build sheets
- Equipment ontology awareness (structured specs, not just brand/model/flex)

### Data Capture Paradigm

The full vision is **agent-based ambient capture** — the record builds itself as a byproduct of the session:
- Vision agent reads launch monitor screens via camera
- Audio agent extracts intervention labels from coach conversation
- Video agent processes swing camera feeds

**For now (MVP):** CSV/file import from TrackMan/Foresight with a normalization layer. Manual session logging with structured fields.

Every coach correction of an AI-generated summary is an RLHF training signal. This is the core data moat.

---

## Think Like an Elite Golf Coach

### Organizing Principle

**Coaching intent organizes data.** Every screen, metric, and visualization exists to support a coaching decision — not to display information. If a data point doesn't change what the coach would do or say, it doesn't belong on screen.

### Hard Rules

**1. Club Context Is Non-Negotiable.** Never show a swing metric without the club that produced it. A 94 mph swing speed means something completely different for a driver vs. a 7-iron.

**2. No Universal Baselines.** "Tour average" is almost always the wrong comparison. Baselines should come from the player's own history, their peer cohort, or their stated goals.

**3. Connection Before Prescription.** Before showing what to fix, show what you know about the player. The pre-session brief exists because the best coaches spend 5 minutes remembering the human before spending 55 minutes on the swing.

**4. Feel vs. Real Is the Central Tension.** The most important coaching data is often the gap between what the player thinks they're doing and what they're actually doing.

**5. Less Information, More Intelligence.** A coach needs 3-4 data points that matter right now, with context for why they matter. Every dashboard should answer: "What's the one thing I should focus on in this session?"

**6. The Coach Controls the Player View.** Never auto-share data with players. The coach decides what the player sees and when.

**7. Capture the Reasoning, Not Just the Data.** The most valuable artifact is WHY the coach chose a particular intervention — not the launch monitor numbers.

**8. Know What to Leave Alone.** A strong grip that produces a reliable draw isn't a fault — it's a strategy. Track what the coach has explicitly decided NOT to change and why.

### Anti-Patterns

- **Data vomit:** Showing all available metrics because you can
- **False precision:** Displaying spin rate to 1 RPM when uncertainty is ±200
- **Decontextualized trends:** "Your swing speed increased 2 mph!" (but you switched clubs)
- **Robot coach voice:** "Based on your metrics, consider adjusting..." — coaches don't talk this way
- **One-size-fits-all workflows:** A 30-minute wedge tune-up and a 2-hour full bag fitting are completely different
- **Ignoring the emotional arc:** A player who just shot their best round needs celebration, not a fix list
- **"Our AI recommends..."** — the system recommends, not "the AI"

### Golf Domain Knowledge

**Scoring Hierarchy:** (1) Putting inside 10 feet, (2) Approach shot proximity, (3) Tee shot accuracy, (4) Short game up-and-down %, (5) Driving distance. Most amateurs obsess over #5. Most coaches focus on #1-3.

**Launch Monitor Literacy:**
- Ball speed is the most reliable predictor of distance (not swing speed)
- Spin rate varies enormously by strike quality — a single number means little
- Club path + face angle = shot shape, but the relationship is non-linear
- Attack angle is heavily influenced by ball position
- Smash factor (ball speed / club speed) 1.45+ for driver is efficient

**Session Types:** Assessment (baseline, no intervention), Technical (changing movement patterns), Performance (optimizing what's there), Playing lesson (on-course), Club fitting (equipment optimization).

---

## Design System — CANONICAL TOKENS

### ⚠️ CRITICAL: Known Technical Debt

The **Looper Player** build (`src/personas/player/`) uses the CORRECT tokens below. Everything else in the codebase — `index.css`, `coachingOSData.ts`, the narrative page, coach/fitter/golfer/spine personas — uses WRONG legacy tokens (`#3A9D78`, `#1C2B2D`, Inter, JetBrains Mono). When building new features or updating existing ones, always use the tokens below.

### Colors — Light Mode (Default)

```javascript
const C = {
  // Foundation
  bg:         '#F6F7F9',   // Page background
  surface:    '#FFFFFF',   // Cards, content areas
  surfaceAlt: '#F0F2F5',  // Nested cards, table rows
  border:     '#DFE2E7',  // Primary borders
  borderSub:  '#ECEEF2',  // Subtle borders

  // Brand accent — deep teal
  accent:       '#0D7C66', // CTAs, links, .AI in logo, active states
  accentHov:    '#0A6352', // Hover state
  accentBg:     '#E6F5F1', // Accent tint background (badges, rec cards)
  accentBright: '#0FA87A', // Confidence-high indicators

  // Text hierarchy
  ink:    '#1A1F2B',       // Primary text, headings
  body:   '#4B5563',       // Body copy
  muted:  '#9CA3AF',       // Labels, captions
  dim:    '#C5CAD1',       // Placeholder, disabled

  // Semantic
  conf:      '#0FA87A',    // High confidence, positive delta
  confBg:    '#E6F5F1',
  caution:   '#D4980B',    // Medium confidence, warnings
  cautionBg: '#FDF6E3',
  flag:      '#C93B3B',    // Low confidence, errors
  flagBg:    '#FDE8E8',
};
```

### Colors — Dark Mode (Bay/Simulator Environments Only)

```javascript
const CD = {
  bg:       '#0C1117',
  surface:  '#151D28',
  surfaceAlt: '#1A2332',
  border:   '#1E2A36',
  accent:   '#10B981',     // Emerald, adjusted for dark
  accentHov:'#34D399',
  ink:      '#E8ECF1',
  body:     '#8B99A8',
  muted:    '#5E6E7E',
};
```

### Fonts

```javascript
const F = {
  brand: "'DM Sans', system-ui, -apple-system, sans-serif",      // Brand voice
  data:  "'Space Mono', 'SF Mono', 'Fira Code', monospace",      // Data voice
  editorial: "'Playfair Display', Georgia, serif",                 // Editorial (rare)
};
```

**Production fonts** (for when real fonts are installed): Cabinet Grotesk (brand), Space Mono (data), Instrument Serif italic (editorial). DM Sans, Space Mono, and Playfair Display are the Google Fonts fallbacks used in this codebase.

### Split Voice Rules

- **DM Sans** handles all human-authored or human-readable text (headings, body, descriptions)
- **Space Mono** handles all machine-generated values (metrics, labels, confidence intervals, data)
- Never use DM Sans for numbers in data cards — always Space Mono
- Never use Space Mono for body paragraphs — always DM Sans
- Playfair Display italic only for taglines, pull quotes, editorial moments — never body or data

### Color Usage Rules

- Positive deltas: `C.conf` (#0FA87A) with ▲ prefix
- Negative deltas: `C.flag` (#C93B3B) with ▼ prefix
- Neutral/zero: `C.muted`
- Confidence badges: colored text on matching `*Bg` tint background
- `C.accent` (#0D7C66) is reserved for interactive elements and brand marks — never for data viz encoding
- Semantic colors always paired with text labels or shapes (▲▼) — never color alone (accessibility)

### Icons

- **Lucide React** only — clean, single-color, consistent stroke weight
- **No emoji anywhere.** Not in UI, not in labels, not in data, not in comments that render in UI
- Use numbered markers (01, 02, 03) or typographic separators for section labels

---

## Component Patterns

### Card Styles (Solid — Default for All Data Surfaces)

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

Glass effects are for overlays and marketing only. Never use glass on primary data surfaces. Dark mode environments always use solid surfaces.

### Geometric Layout Discipline

- All cards in a row: equal size — no exceptions
- All gaps: consistent per context (8px dense data, 12px standard, 16px sections)
- All edges: aligned to shared grid
- Video panels in comparison views: identical dimensions
- Border-radius by depth: outer 12px, inner 8px, badges 3px
- Two-column layouts: always `1fr 1fr`

### Number Formatting

```javascript
const fmt = (v, type) => {
  switch(type) {
    case 'yds':  return v.toFixed(1) + ' yds';
    case 'mph':  return v.toFixed(1) + ' mph';
    case 'rpm':  return Math.round(v).toLocaleString() + ' rpm';
    case 'deg':  return v.toFixed(1) + '°';
    case 'pct':  return v.toFixed(1) + '%';
    case 'sg':   return (v > 0 ? '+' : '') + v.toFixed(1);
    default:     return String(v);
  }
};
```

- Always use `toLocaleString()` for numbers ≥1,000
- Always show `+` prefix on positive deltas
- Ranges: `262-272 yds` (no "to")
- Never more than one decimal in session metrics
- Spin rate: always integers

### Override Pattern

Every AI recommendation must have an override control. The practitioner is always in control. Manual adjustments replace AI suggestions and are logged as human overrides (training signal).

---

## Navigation Architecture

### Four-Layer System

```
L1: Global bar (dark #1A1F2B, persistent, 44px)
    Logo + mode switcher + account controls

L2: Context bar (light, pills, 34px)
    Editable state display — NOT navigation
    Clicking a pill opens quick-edit popover

L3: Decision tabs (light, workflow sequence)
    Left-to-right follows session progression
    Max 5 tabs

L4: Content disclosure (collapsible cards)
    NOT navigation — expand/collapse within content
```

- L1 always dark, everything below light
- Maximum two clickable navigation layers (L1 + L3)
- Never nest tabs inside tabs
- L1 + L2 combined height: under 90px

### Coaching OS Tab Sequence

Overview → Video Analysis → Diagnosis → Interventions → Player Plan

### Shot Rail (Session-Active Tabs)

72px collapsible left rail. Shot number + club abbreviation only. Newest on top. Selecting a shot updates entire content area.

---

## File Structure

```
src/
├── pages/              # Standalone pages (PersonaSelector, SizzleReel, ThesisPage)
├── personas/
│   ├── player/         # ✅ CURRENT — Looper Player (correct tokens)
│   │   ├── components/ # Layout, overlays, shared, timeline
│   │   ├── data/       # tokens.ts (canonical), player, timeline, sources
│   │   └── pages/      # Dashboard, PracticeMode, Rounds, MyJourney, Lessons
│   ├── coach/          # ⚠️ OUTDATED TOKENS — uses old palette
│   ├── fitter/         # ⚠️ OUTDATED TOKENS — uses old palette
│   ├── golfer/         # ❌ DEPRECATED — replaced by personas/player/
│   └── spine/          # ❌ DEPRECATED — no longer part of product architecture
├── components/
│   ├── layout/         # DesktopShell, MobileShell, Sidebar, TopBar, BottomTabBar
│   ├── ui/             # Card, Badge, MetricCard, Skeleton, ErrorBoundary
│   ├── coach-session/  # VoiceAIPanel, VideoPlayer, LaunchDataPanel
│   ├── fitter/         # FittingAIInsightCard, ShaftComparisonTable
│   └── ...
├── data/               # Mock data files
│   └── coachingOSData.ts  # ⚠️ C and F constants use WRONG legacy tokens
├── index.css           # ⚠️ Tailwind @theme uses WRONG legacy tokens
└── App.tsx             # Router
```

### Canonical Token Source

The correct tokens live in `src/personas/player/data/tokens.ts`. When updating other parts of the codebase, reference this file — not `index.css` or `coachingOSData.ts`.

---

## Routing

### Active Routes

```
/                     → PersonaSelector (landing page)
/player               → Looper Player (correct design system)
/coach                → Coach dashboard (legacy tokens — needs migration)
/coach/live           → CoachingOS immersive session (legacy tokens)
/coach/students       → Student roster
/coach/students/:id   → Student detail
/coach/brief/:id      → Pre-session brief
/coach/session        → Coach session
/coach/capture        → Session capture
/coach/review         → Session review
/coach/analytics      → Analytics
/coach/trackman       → TrackMan integration
/fitter               → Fitter views (legacy tokens)
/narrative            → Strategic narrative (⚠️ outdated language — needs rewrite)
/thesis               → Business case page
/vision               → Sizzle reel
```

### Deprecated Routes

```
/golfer/*             → OLD mobile app concept — replaced by /player
/spine/*              → DataSpine/AudienceEngine/IntegrationHub — removed from product architecture
```

### Immersive Mode (Coach Only)

`CoachLayout` detects `/coach/live` and renders `<Outlet />` directly — no sidebar, no topbar. CoachingOS provides its own L1 (session bar), L2 (context bar), and L3 (analysis tabs). This is a full-screen experience that bypasses the coach chrome.

---

## Brand Voice (For Any User-Facing Text)

**Sound like** the smartest colleague in the fitting bay who never talks down to anyone. Like an engineer who also plays golf and gets why feel matters.

**Always:**
- "The data suggests X with Y confidence"
- "What to try next"
- "Your expertise, systematized"
- Use golf language naturally: strike, dispersion, carry windows, club path, face control

**Never:**
- "Our AI determined..." — the system recommends, not "the AI"
- "Revolutionary," "game-changing," "disrupting"
- "Guaranteed" — use "expected," "estimated," "with X% confidence"
- "Replaces" or "automates" the coach — always "augments," "systematizes," "empowers"
- AI/ML jargon in UI: embeddings, bandits, counterfactual, hierarchical Bayesian

---

## Skill Files

Read these before building any Looper UI:

- `.claude/skills/looper-ux-system/SKILL.md` — Full UX implementation reference (components, layout, data viz, anti-patterns)
- `.claude/skills/looper-brand-assets/SKILL.md` — Brand voice, tone, content guidelines
- `.claude/skills/looper-player/SKILL.md` — Looper Player product spec and build prompt
- `.claude/skills/looper-coach-domain/SKILL.md` — Coaching domain context

---

## Build Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (⚠️ theme tokens need updating to match canonical palette)
- Recharts for data visualization
- Lucide React for icons
- React Router 7 (nested routes with Outlet)
- No backend — all data mocked in `src/data/*.ts`
- Demo mock names: Coach = M. Thompson, Player = Moe Norman
