# Think Like an Elite Golf Coach

## Organizing Principle

**Coaching intent organizes data.** Every screen, metric, and visualization exists to support a coaching decision — not to display information. If a data point doesn't change what the coach would do or say, it doesn't belong on screen.

---

## Hard Rules

### 1. Club Context Is Non-Negotiable
Never show a swing metric without the club that produced it. A 94 mph swing speed means something completely different for a driver vs. a 7-iron. Every metric panel, every comparison, every trend line must carry club context.

### 2. No Universal Baselines
"Tour average" is almost always the wrong comparison. A 15-handicap's optimal numbers look nothing like a scratch player's. Baselines should be derived from the player's own history, their peer cohort, or their stated goals — never from a generic "good" number.

### 3. Connection Before Prescription
Before showing what to fix, show what you know about the player. The pre-session brief exists because the best coaches spend 5 minutes remembering the human before spending 55 minutes on the swing. Surface: What did we work on last time? What did they commit to practicing? What's happening in their game right now?

### 4. Feel vs. Real Is the Central Tension
The most important coaching data is often the gap between what the player thinks they're doing and what they're actually doing. Design for this: show the player's self-reported feel alongside the measured reality. This is where breakthroughs happen.

### 5. Less Information, More Intelligence
A coach doesn't need 47 data points. They need 3-4 that matter right now, with context for why they matter. Every dashboard should answer: "What's the one thing I should focus on in this session?" If it can't answer that, it has too much data and not enough intelligence.

### 6. The Coach Controls the Player View
Coaches are protective of what players see. A coach might know the player's path is 4 degrees out-to-in but choose not to mention it because they're working on something else first. Never auto-share data with players. The coach decides what the player sees and when.

### 7. Capture the Reasoning, Not Just the Data
The most valuable coaching artifact isn't the launch monitor numbers — it's why the coach chose a particular intervention. "Moved ball position forward because impact point was low on face" is gold. Design for capturing coaching reasoning at the moment of decision.

### 8. Know What to Leave Alone
Elite coaches know that some "problems" in a swing are actually features. A strong grip that produces a reliable draw isn't a fault — it's a strategy. The system should track what the coach has explicitly decided NOT to change and why, so future sessions don't accidentally "fix" it.

---

## Anti-Patterns to Avoid

- **Data vomit**: Showing all available metrics because you can
- **False precision**: Displaying spin rate to 1 RPM when the measurement uncertainty is +/- 200
- **Decontextualized trends**: "Your swing speed increased 2 mph!" (but you switched from 7-iron to 6-iron)
- **Robot coach voice**: "Based on your metrics, consider adjusting..." — coaches don't talk like this
- **One-size-fits-all workflows**: A 30-minute wedge tune-up and a 2-hour full bag fitting are completely different sessions
- **Ignoring the emotional arc**: A player who just shot their best round needs celebration, not a list of things to fix

---

## The Three Coaching Moments

### 1. Before the Session (Player Brief)
**Coach's question**: "What do I need to remember about this player?"
- Last session recap: what we worked on, what clicked, what didn't
- Practice compliance: did they do what we agreed on?
- Recent rounds: are they playing better or worse?
- Current lesson arc: where are we in the bigger plan?
- Emotional context: anything I should know walking in?

### 2. During the Session (Live Coaching)
**Coach's question**: "What's happening right now and what should I do about it?"
- Real-time data with immediate context
- Comparison to the player's own baseline (not tour average)
- Pattern detection: "This is the 3rd swing in a row with early extension"
- Intervention suggestions based on what's worked before for this player
- Minimal chrome — the session is about the player, not the software

### 3. After the Session (Session Summary)
**Coach's question**: "What did we accomplish and what's the plan?"
- Key metrics that changed during the session
- Interventions that were tried and their results
- Coach's notes and reasoning (captured during session)
- Homework: specific drills with specific targets
- Next session preview: what we'll work on next

---

## Golf Domain Knowledge

### Scoring Hierarchy
The fastest way to lower scores (in order): 1) Putting inside 10 feet, 2) Approach shot proximity, 3) Tee shot accuracy, 4) Short game up-and-down %, 5) Driving distance. Most amateurs obsess over #5. Most coaches focus on #1-3.

### The Handicap System
Handicap Index is calculated from the best 8 of last 20 rounds. A rising handicap doesn't mean the player is getting worse — it might mean they're playing harder courses, or their bad rounds are getting worse while their good rounds stay the same. Context matters.

### Launch Monitor Literacy
- **Ball speed** is the most reliable predictor of distance (not swing speed)
- **Spin rate** varies enormously by strike quality — a single number means little
- **Club path + face angle** = shot shape, but the relationship is non-linear
- **Attack angle** is heavily influenced by ball position — a "steep" swing might just be a setup issue
- **Smash factor** (ball speed / club speed) indicates strike quality — 1.45+ for driver is efficient

### Session Types
- **Assessment**: Baseline data collection, no intervention. "Let me see what you've got."
- **Technical**: Changing a movement pattern. Requires patience and regression tolerance.
- **Performance**: Optimizing what's already there. Stats-focused, game-context heavy.
- **Playing lesson**: On-course coaching. Completely different skill set — strategy, mental game, course management.
- **Club fitting**: Equipment optimization. Requires launch monitor mastery and understanding of gear-swing interaction.

---
---

# Looper.AI — Project Reference

## What This Is

Looper.AI is an AI-native decision platform for golf coaching and club fitting. It's a prototype/demo app — all data is mocked in TypeScript files, there is no backend. The app demonstrates four distinct persona experiences through a single React application.

## Tech Stack

- **React 19** + **React Router 7** (nested routes with `<Outlet />`)
- **TypeScript 5.9** + **Vite 7** (build tool)
- **Tailwind CSS 4** (utility-first styling, theme tokens in `index.css`)
- **Recharts** (data visualization)
- **Lucide React** (icon library)
- **Playwright** + **ffmpeg-static** (sizzle reel video recording)
- **No backend** — all data in `src/data/*.ts`

## Four Personas

| Persona | Route | Shell | UX Posture |
|---------|-------|-------|------------|
| **Golfer** | `/golfer` | `MobileShell` (iPhone frame + BottomTabBar) | Light, consumer, mobile-first |
| **Coach** | `/coach` | `DesktopShell` (Sidebar + TopBar) | Professional, data-dense, desktop |
| **Fitter** | `/fitter` | `DesktopShell` (dark theme + ambient bg) | Premium, equipment-focused, dark |
| **Spine** | `/spine` | `DesktopShell` (dark theme + ambient bg) | Internal, data-ops, dark |

Entry point is `PersonaSelector` at `/` — each card routes to a persona.

## File Structure

```
src/
├── pages/               # App-level pages (PersonaSelector, CoachingOS, SizzleReel, ThesisPage)
├── personas/
│   ├── golfer/          # GolferLayout.tsx + pages/
│   ├── coach/           # CoachLayout.tsx + pages/
│   ├── fitter/          # FitterLayout.tsx + pages/
│   └── spine/           # SpineLayout.tsx + pages/
├── components/
│   ├── layout/          # DesktopShell, MobileShell, Sidebar, TopBar, BottomTabBar
│   ├── ui/              # Card, Badge, MetricCard, StatusDot, etc.
│   ├── coach-session/   # VoiceAIPanel, VideoPlayer, LaunchDataPanel, etc.
│   ├── fitter/          # FittingAIInsightCard, ShaftComparisonTable, etc.
│   ├── trackman/        # TrackmanDataGrid, ShotRow, MetricDelta
│   └── spine/           # DataFlowNode, AudienceSegmentCard, etc.
├── data/                # All mock data (golfers, sessions, drills, coachingOSData, etc.)
├── index.css            # Tailwind imports + @theme tokens + glass effects
├── App.tsx              # All route definitions
└── main.tsx             # React entry point
```

## Routing

### Coach Routes (most complex)
```
/coach                → CoachToday (dashboard with schedule, alerts, activity)
/coach/students       → StudentRoster
/coach/students/:id   → StudentDetail
/coach/brief/:id      → PreSessionBrief (pre-session player intelligence)
/coach/live           → CoachingOS (immersive, full-bleed — no sidebar/topbar)
/coach/capture        → SessionCapture
/coach/review         → SessionReview
/coach/analytics      → Analytics
/coach/session        → CoachSession
```

### Other Personas
```
/golfer               → GolferHome (mobile)
/golfer/lessons       → LessonHistory
/golfer/lessons/:id   → LessonDetail
/golfer/swing         → SwingProfile
/golfer/practice      → Practice

/fitter               → GolferLookup
/fitter/brief         → PreFittingBrief
/fitter/session       → FittingSession
/fitter/report        → FittingReport
/fitter/equipment     → EquipmentProfile

/spine                → DataSpine
/spine/audience       → AudienceEngine
/spine/integrations   → IntegrationHub
```

### Standalone
```
/                     → PersonaSelector
/thesis               → ThesisPage
/narrative            → LooperNarrative
/vision               → SizzleReel
/coaching-os          → Redirects to /coach/live
```

## Architecture Patterns

### 1. Shell + Layout + Outlet
Every persona has a Layout component that wraps child pages via React Router's `<Outlet />`. The Layout provides persistent chrome (sidebar, topbar); the page content swaps inside.

### 2. Immersive Mode (Coach Only)
`CoachLayout` detects `/coach/live` via `useLocation()` and renders `<Outlet />` directly — no DesktopShell, no sidebar, no topbar. CoachingOS provides its own L1 (session bar), L2 (context bar with player/club), and L3 (6 analysis tabs). This is the critical pattern — CoachingOS is a full-screen experience that lives inside the coach route tree but bypasses the coach chrome.

### 3. Dark Theme with Ambient Effects
Fitter and Spine personas use `ambient-bg` class (radial gradients + noise overlay) and pass `dark` prop to TopBar/Sidebar for inverted color schemes.

### 4. Mobile vs. Desktop Shell
Golfer uses `MobileShell` (iPhone 15 frame, 390×844px) + `BottomTabBar`. All other personas use `DesktopShell` (sidebar + responsive main area with hamburger menu on mobile).

## Design Tokens

### Colors (defined in both `index.css` @theme and `coachingOSData.ts` C constant)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#3A9D78` | Primary action, success, confidence |
| `accent-light` | `#4DB88A` | Hover states |
| `navy` | `#1C2B2D` | Primary text, headings |
| `data-blue` | `#4A90D9` | Data/info indicators |
| `warm-amber` | `#D4A843` | Caution, warnings |
| `coral` | `#C45C4A` | Errors, alerts, flags |
| `bg-light` | `#F7F8F9` | Light mode backgrounds |
| `bg-dark` | `#0F1A1C` | Dark mode backgrounds |
| `card-dark` | `#1A2D30` | Dark mode cards |
| `border-dark` | `#2D4A4F` | Dark mode borders |

### Fonts
| Token | Stack | Usage |
|-------|-------|-------|
| `sans` | Inter, system-ui, sans-serif | All UI text |
| `mono` | JetBrains Mono, Menlo, monospace | Data values, metrics |

### CRITICAL: Token Sync Rule
`src/data/coachingOSData.ts` exports `C` (colors) and `F` (fonts) constants used by CoachingOS inline styles. These **must stay in sync** with the Tailwind tokens in `index.css`. If you change a color in one place, change it in both. The canonical values are:
- `C.accent` = `#3A9D78` = `--color-accent`
- `C.ink` = `#1C2B2D` = `--color-navy`
- `F.brand` = `Inter` = `--font-sans`
- `F.data` = `JetBrains Mono` = `--font-mono`

## Key Data Files

| File | What It Exports |
|------|----------------|
| `golfers.ts` | `Golfer` interface + `golfers[]` — player profiles with handicap, equipment, goals |
| `sessions.ts` | `Session` interface + `sessions[]` — lesson records with metrics and drills |
| `drills.ts` | `Drill` interface + `drills[]` — drill library with instructions and target faults |
| `coachingOSData.ts` | `C`, `F` constants, `ShotData[]`, `AIInsight[]`, `Recommendation[]`, `DiagnosisFactor[]`, `InterventionCard[]`, `PlayerHistory`, formatting utils (`fmt`, `fmtDelta`, `confidenceLevel`), session context, tab definitions |
| `trackmanData.ts` | Raw launch monitor shot data |
| `coaches.ts` | Coach profiles |
| `fittingComparisons.ts` | Shaft/head comparison data |
| `fittingRecommendations.ts` | AI fitting recommendations |
| `integrations.ts` | Connected system catalog (Trackman, Arccos, etc.) |

## Build Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Vite preview of production build
```
