# Looper Player — Claude Code Build Prompt

## What You Are Building

Looper Player is the consumer-facing product for Looper.AI — a mobile-first web app that serves as the "single pane of glass" for a golfer's entire improvement journey. It aggregates data from multiple golf technology sources (GHIN, Arccos, consumer launch monitors, WHOOP, coaching sessions) and presents them on a **single unified timeline** where every shot, swing, session, lesson, and body state is visible as one chronological record.

Think of it as: **Mint.com for your golf game, with a built-in AI thinking partner, built on a single time axis.**

The app must work standalone for uncoached golfers (fully valuable on its own) AND transform into a richer experience when connected to a Looper coach. The uncoached experience should be good enough that the player never feels like they're using a crippled product — but the coached experience should make the gap obvious through the quality and specificity of the intelligence.

---

## The Foundational Insight

**The timeline is the data model. The tabs are views.**

No other product in golf can show the player the causal chain across their data:

```
Tuesday AM:   HRV 55ms, Recovery 78%          (WHOOP)
Tuesday PM:   Lesson — gate drill, face-to-path narrowed 4.1° → 2.8°  (Coaching OS)
Wednesday:    Practice — dispersion ±6.2 yds   (Garmin R10)
Thursday AM:  HRV 48ms, Recovery 65%           (WHOOP)
Friday AM:    HRV 38ms, Recovery 42%           (WHOOP)
Friday PM:    Practice — dispersion ±9.1 yds   (Garmin R10)  ← LOOKS like regression
Saturday AM:  HRV 41ms, Recovery 54%           (WHOOP)
Saturday:     Round — shot 82, SG Approach -1.2 (Arccos + GHIN)  ← BEST score in 3 weeks
Sunday:       Rest day                          (Looper)
Monday AM:    HRV 52ms, Recovery 71%           (WHOOP)
Monday PM:    Practice — dispersion ±5.1 yds   (Garmin R10)  ← TIGHTEST ever
```

That sequence tells a story. Friday's regression wasn't a swing problem — it was a body problem. Monday's breakthrough happened because the player rested. The coaching intervention is working even when individual data points look noisy. No single app can show this because no single app has all the data on one axis.

**This is Looper's entire thesis made tangible.** Everything in the product flows from this.

---

## Before You Write Any Code

Read these skill files in order. They contain the complete design system and brand guidelines:

1. `.claude/skills/looper-ux-system/SKILL.md` — Full UX implementation reference (colors, typography, components, layout patterns, anti-patterns)
2. `.claude/skills/looper-brand-assets/SKILL.md` — Brand voice, tone, and content guidelines

**Critical rules from the design system:**
- Light mode is the default. Use the exact color tokens from the skill file (C object).
- Split voice architecture: DM Sans (brand voice) for human-readable text, Space Mono (data voice) for metrics/labels/machine-generated values. Never mix them.
- Google Fonts fallbacks: DM Sans (for Cabinet Grotesk), Space Mono, Playfair Display (for Instrument Serif italic — editorial moments only).
- No emoji anywhere in the UI. Use numbered markers (01, 02, 03) for section labels.
- No "Our AI" language. The system recommends, not "the AI."
- Uncertainty is visible — confidence badges, ranges, and tolerance bands are first-class UI elements.
- Every number needs context — pair with magnitude label, range, or comparison.
- All cards in a row must be equal size. All gaps consistent. All edges aligned.

---

## Tech Stack

- **Vite + React** (project already exists at `C:\Users\tripp\looper`)
- **Tailwind CSS** for utility styling (but follow the design system's exact color tokens — define them as Tailwind config values)
- **lucide-react** for icons — single-color, consistent stroke weight. No emoji.
- **Recharts** for any interactive charts (follow the chart styling rules in the UX skill file)
- **React Router** for navigation (or simple state-based routing for MVP)
- Mobile-first layout: max-width 480px, centered. Design for phone-in-pocket at the range.

---

## Architecture: Timeline-First

The unified timeline is the source of truth. Every piece of data that enters Looper Player becomes an event on the timeline with a timestamp, a source, a type, and structured metrics. The four tab surfaces are **lenses** on the timeline — filtered, summarized, and actionable views of the same underlying chronological record.

```
TIMELINE (single source of truth)
  │
  ├── Dashboard = "What's happening now?"
  │   Timeline filtered to: most recent events + aggregated stats + next action
  │
  ├── Practice = "What should I do next?"
  │   Timeline filtered to: practice events + coaching prescriptions + session plans
  │
  ├── Rounds = "What happened on the course?"
  │   Timeline filtered to: round events + score posts + post-round analysis
  │
  └── My Journey = The timeline itself, unfiltered
      Full chronological record + cross-source pattern detection + milestones
```

### Timeline Event Schema

Every event in the system conforms to this structure:

```javascript
{
  id: string,              // Unique event ID
  date: string,            // ISO date: '2026-03-18'
  time: string | null,     // Time of day: '16:30' or null for all-day events
  type: string,            // 'lesson' | 'practice' | 'round' | 'score' | 'body' | 'rest' | 'fitting' | 'equipment' | 'milestone'
  source: string,          // 'coaching' | 'arccos' | 'garmin' | 'ghin' | 'whoop' | 'apple' | 'manual' | 'looper'
  title: string,           // Human-readable event title
  metrics: [               // Structured metric array
    { label: string, value: string, status?: string }
    // status: 'good' | 'improving' | 'best' | 'fair' | 'poor' | 'regression' | 'high' | null
  ],
  narrative: string,       // AI-generated or system-generated contextual sentence
  connection?: {           // Cross-source causal connection (the key differentiator)
    to: eventId,           // Which other event this connects to
    label: string,         // Human-readable connection insight
  },
  coachNote?: string,      // Coach's annotation (coaching OS events only)
  tags?: string[],         // Optional tags for filtering
}
```

### Source Identity System

Each data source has a visual identity so the player can immediately see where data comes from:

```javascript
const sourceConfig = {
  coaching:  { label: 'Coaching OS', color: '#0D7C66', short: 'COACH' },
  arccos:    { label: 'Arccos',      color: '#3B82F6', short: 'ARCCOS' },
  garmin:    { label: 'Garmin R10',  color: '#F59E0B', short: 'GARMIN' },
  ghin:      { label: 'GHIN',        color: '#6366F1', short: 'GHIN' },
  whoop:     { label: 'WHOOP',       color: '#EF4444', short: 'WHOOP' },
  apple:     { label: 'Apple Health',color: '#EC4899', short: 'APPLE' },
  manual:    { label: 'Manual',      color: '#9CA3AF', short: 'MANUAL' },
  looper:    { label: 'Looper',      color: '#0D7C66', short: 'LOOPER' },
};
```

Each source gets a colored pill on its timeline events. The player learns to read the timeline by color: red events are body data, blue events are rounds, gold events are practice, green events are coaching.

### Connection Insights — The Key Feature

The `connection` field on timeline events is what makes Looper different from every other product. A connection links two events across different sources and provides a human-readable insight about the causal relationship.

Examples:
- Body event (WHOOP, low recovery) → Practice event (Garmin, regression): "Low recovery → dispersion regression. Not a swing problem."
- Body event (WHOOP, high recovery) → Lesson event (Coaching OS, strong response): "High recovery → strong lesson response"
- Lesson event (Coaching OS) → Practice events (Garmin, improvement): "Gate drill prescribed Tuesday → dispersion tightened by 18% over 3 sessions"
- Equipment event (Fitting) → Round events (Arccos, improvement): "Iron fitting Jan 15 → approach SG improved from -1.8 to -1.4"
- Body event (WHOOP, full recovery) → Practice event (Garmin, personal best): "Full recovery → best practice session recorded"

These connections should be rendered as small accent-colored cards with an arrow icon between the linked events. They are the "holy shit" moment of the product.

### Cross-Source Pattern Detection

Beyond individual event connections, the system should surface aggregate patterns that span multiple events and multiple sources. These appear as dedicated cards at the top of the My Journey timeline:

Example: "Over your last 14 practice sessions, low recovery days produce 62% wider iron dispersion. Friday's regression wasn't a swing problem — it was a recovery problem. Consider skipping practice or reducing intensity on sub-50% recovery days."

These pattern cards show:
- The pattern title
- Side-by-side comparison metrics (e.g., high recovery days vs. low recovery days)
- The quantified insight
- Which sources contributed to the detection (source pills)

---

## App Navigation Structure

```
L1: Global Bar (sticky top, dark #1A1F2B)
    LOOPER.AI Player [PRO badge] [avatar]

L2: Data Source Inventory (scrollable horizontal bar)
    [connected sources with green dots] | [available sources dimmed with +]

L3: Tab Navigation
    Dashboard | Practice | Rounds | My Journey

L4: Content Area (scrollable, max-width 480px)

Bottom: Fixed mobile nav bar (same four tabs)
Floating: Chat FAB button (bottom-right, above nav bar) → "Ask Looper"
```

---

## L2: Data Source Inventory Bar

The L2 bar is the visual expression of the "single pane of glass" thesis. It shows every data source — connected or not — in a horizontally scrollable row.

### Connected sources
- Green status dot + source name in accent-styled pill
- Tapping opens a bottom drawer showing: status (live/synced + last sync time), data types flowing in, a cross-source insight card showing how this source's data combines with other sources, and a "Sync Now" button.

### Available (not connected) sources
- Dimmed pill with "+" prefix
- Tapping opens a bottom drawer showing: data types that would flow in, a "What Connecting Unlocks" card describing the cross-source value, and a "Connect [Source Name]" primary button.

### Sources to include

| Source | Status | Data Types | Cross-Source Insight (when connected) |
|--------|--------|-----------|--------------------------------------|
| Looper Coaching OS | Live (real-time) | Session records, coach plans, drills, video annotations, intervention history | "Coach Thompson diagnosed face-to-path inconsistency. 3 sessions completed in current phase." |
| GHIN | Synced | Handicap index, score history, course ratings | "Handicap dropped 1.8 in 90 days — fastest improvement rate in your history." |
| Arccos | Synced | Shot-level GPS, club distances, strokes gained, round data | "Approach shots from 125-150 yds costing 1.4 SG/round. Combined with Coaching OS, correlates with face-to-path issue." |
| Garmin R10 | Synced | Ball speed, spin, launch angle, carry, practice sessions | "Last 3 sessions show 7-iron dispersion tightening from ±8.2 to ±5.4 yds. The prescribed drill is working." |
| WHOOP | Available | HRV, sleep, strain, recovery, heart rate | "Overlay biometrics on every round. See how recovery correlates with scoring. Get alerts when body state predicts a tough day." |
| Apple Health | Available | Steps, workouts, heart rate, sleep | "Activity tracking and heart rate during rounds to understand how fitness affects performance." |
| TrackMan | Available | Full club delivery, ball flight, session exports | "Import TrackMan session exports. Full club delivery data flowing into your longitudinal record." |
| Foresight | Available | Ball data, club data, impact location | "Import Foresight data with camera-grade precision — contextualized by your coaching plan." |
| Clippd | Available | Shot quality, player quality, skill analytics | "Import Shot Quality scores. See how Clippd analysis aligns with your Coaching OS diagnosis." |
| DECADE | Coming soon | Course strategy, target selection, mental scorecards | "Integration in development. Course strategy connected to your performance data." |

Every source drawer ends with: **"Your data stays yours. Looper reads, never writes back."**

---

## Tab 1: Dashboard ("Where am I?")

The home screen. A narrative, not a data dump. The player should understand their current state in 5 seconds. This is the timeline filtered to: most recent events + aggregated stats + recommended next action.

**Sections in order:**

1. **Hero Card** — Two-column grid:
   - Left: Handicap Index (Space Mono 32px), delta badge (last 90 days), sparkline trend
   - Right: Player Quality (0-100 scale, 100 = tour avg), progress bar

2. **Coaching Plan Card** (coached players only) — Accent left border:
   - Current focus, coach name, next session date/time, "Active" status pill

3. **Strokes Gained Breakdown** — Section "01 WHERE YOU'RE GAINING AND LOSING"
   - Four horizontal bars: Driving, Approach, Short Game, Putting
   - Color-coded by performance (green = gaining, red = losing)
   - Footer: benchmark and sample size

4. **What To Do Next** — Recommendation Card (accent background):
   - AI-generated practice recommendation citing the specific metric and opportunity
   - If coached, references coach's plan. If uncoached, references data-driven analysis.

5. **Last Round Summary** — Course, date, score, 3-column KPI grid

6. **Recent Timeline** — The last 3-5 timeline events shown inline:
   - Compact event cards showing source pill, title, headline metric
   - "View full timeline" link to My Journey tab
   - This is where the Dashboard connects back to the timeline source of truth

---

## Tab 2: Practice ("What should I do next?")

Timeline filtered to practice events + coaching prescriptions. Where the product earns its keep between lessons.

**Sections in order:**

1. **Today's Practice Plan Card** — Accent left border:
   - Session title, source ("Prescribed by Coach [name]" or "Generated from your data"), estimated duration

2. **Session Blocks** — Section "01 SESSION STRUCTURE"
   - Each block: name (Warm-Up, Primary Drill, Transfer, Cool-Down), club pill, shot count pill
   - Focus description
   - **Cue Card**: accent background, "CUE — EXTERNAL" label, coaching cue in Playfair Display italic
   - Cues should always be external focus (motor learning science): about ball flight, target, or club. Never internal body mechanics.
   - Completed blocks fade with "Done" badge

3. **Session Controls** — Section "02 SESSION"
   - Before start: primary button + launch monitor connect note
   - During session: KPI grid (Shots, On Target %, Avg Carry) + shot logging buttons
   - After session: summary + voice memo prompt

4. **Practice Timeline** — Section "03 RECENT PRACTICE"
   - Timeline events filtered to type = 'practice', showing trend across sessions
   - Dispersion trend sparkline across recent sessions
   - Connection insights visible (e.g., recovery correlation)

---

## Tab 3: Rounds ("What happened?")

Timeline filtered to round events + score posts + post-round analysis. Connects on-course performance to practice and coaching.

**Sections in order:**

1. **Scoring Trend** — Sparkline of recent scores

2. **Driver Dispersion** — Section "01 DRIVER DISPERSION — LAST 5 ROUNDS"
   - SVG scatter plot with confidence ellipse, summary stats

3. **Recent Rounds** — Section "02 RECENT ROUNDS"
   - Each round card: course, date, score, SG total
   - Expanding shows: 4-column SG breakdown, coaching context card
   - **Round Timeline**: when expanded, show the timeline events from that day — the round, the morning WHOOP reading, any pre-round practice. This connects the round to the full context of the day.

---

## Tab 4: My Journey (The Timeline Itself)

**This is the product's signature surface.** The full unfiltered chronological record with cross-source pattern detection. This is where every shot, swing, session, lesson, and body state lives on one time axis.

**Sections in order:**

1. **Period Summary** — "Your Week" or "Your Month" header with date range
   - 4-column KPI grid: Rounds played, Practice sessions, Lessons, Avg Recovery

2. **Cross-Source Pattern Cards** — Aggregate patterns detected across sources:
   - Side-by-side comparison metrics
   - Quantified insight
   - Contributing source pills
   - These are the "holy shit" moments

3. **Filter Bar** — Horizontal filter pills:
   - "Everything" (default), "Golf only", "Body", "Coaching"
   - Filtering the timeline by event type

4. **Source Legend** — Small colored dots with source names

5. **The Timeline** — Grouped by date, newest first:
   - Date header with event count
   - Each event: source pill + time + type icon + title + headline metric (collapsed)
   - Tapping expands to show: all metrics, narrative, connection insights, coach notes
   - **Connection insights** are the star: small accent-colored cards linking events across sources
   - Timeline spine: vertical line connecting events on the same day

6. **Bottom** — Editorial tagline in Playfair Display italic:
   - "Every shot, swing, session, lesson, and body state."
   - "One timeline. Your story."

### Timeline Event Card Design

Each event has two states:

**Collapsed:**
- Left: Type icon (28px square with rounded corners, colored by type)
- Center: Source pill + time + title
- Right: Headline metric (largest/most important value from metrics array, colored by status)

**Expanded:**
- All metrics in a surfaceAlt grid
- Narrative text
- Connection insight card (if present): accent background, arrow icon, connection label
- Coach note (if present): accent-bordered card with italic quote

### Type Icons

Use lucide-react icons inside colored squares (28px, 6px border-radius):

| Type | Icon | Background | Border |
|------|------|-----------|--------|
| lesson | BookOpen | accentBg | accent |
| practice | Clock | cautionBg | caution |
| round | TrendingUp | blue/10% | blue |
| body | Heart | flagBg | red |
| score | FileText | purple/10% | purple |
| rest | Moon | surfaceAlt | dim |
| fitting | Wrench | cautionBg | caution |
| equipment | Package | purple/10% | purple |
| milestone | Star | confBg | conf |

---

## Conversational Chat ("Ask Looper")

### Trigger
Floating action button (48px circle, accent color, MessageCircle icon from lucide-react), bottom-right above mobile nav. Shadow: `0 4px 16px rgba(13,124,102,0.3)`.

### Panel
Full-screen overlay. Structure:

1. **Header** (dark, matches L1): green dot + "Ask Looper" + source count + close button
2. **Context Pill** (centered): shows which tab user was viewing
3. **Messages**: assistant (white cards, left) and user (accent, right)
4. **Suggested Prompts** (when conversation is short):
   - "Why was my last round worse than usual?"
   - "Compare my driving this month vs. last month"
   - "What should I practice before my next lesson?"
   - "How has my iron accuracy changed since the fitting?"
5. **Input Bar** (fixed bottom): text input + send button

### Chat System Prompt

```
You are "Looper" — the intelligence layer of a golf improvement platform. You have access
to the player's complete timeline of golf data from multiple connected sources. You speak
like the smartest person in the fitting bay who never talks down to anyone. You use golf
terminology naturally (strokes gained, dispersion, carry, face-to-path) but explain concepts
when the player seems unfamiliar.

Your responses should:
- Reference specific data points from the player's timeline
- Cross-reference events across sources (e.g., WHOOP recovery + Garmin practice data + Coaching OS notes)
- Quantify everything — strokes gained, percentages, yard deltas
- Be direct about what matters and what doesn't
- When recommending practice, cite motor learning principles (external focus, variable practice) without jargon
- If the player has a coach, align with the coaching plan — never contradict the coach
- If uncoached, provide the best possible self-coaching guidance
- Use calibrated confidence — "the data suggests" not "guaranteed"
- Never say "Our AI" — you are the system, not a separate entity

Player context (injected with each message):
- Current handicap and trend
- Connected data sources and their last sync
- Current coaching plan (if coached)
- Recent timeline events (last 7 days)
- Strokes gained breakdown
- Current equipment
- Active tab context
```

For MVP, hardcode sample responses for the four suggested prompts. Each response must demonstrate cross-source intelligence — pulling from at least two different sources to produce an insight neither could provide alone.

---

## Sample Player Data

```javascript
const player = {
  name: 'Moe Norman',
  handicap: 12.4,
  handicapDelta: -1.8,
  handicapHistory: [18.6, 17.8, 16.2, 15.8, 15.1, 14.6, 14.2, 13.8, 13.1, 12.4],
  playerQuality: 68,
  roundsThisYear: 24,
  
  coach: {
    name: 'M. Thompson',
    plan: 'Iron accuracy — face-to-path consistency',
    phase: 3,
    totalPhases: 6,
    nextSession: 'Thu, Mar 22 at 2:00 PM',
    sessionsCompleted: 8,
  },
  
  strokesGained: {
    driving: +0.3,
    approach: -1.4,
    shortGame: -0.2,
    putting: +0.1,
    benchmark: '10-handicap',
    sampleSize: '10 rounds',
  },
  
  equipment: {
    driver: 'TaylorMade Qi10 LS 9° / Tensei 1K White 65TX',
    irons: 'Titleist T200 / KBS Tour 120S',
    wedges: 'Vokey SM10 50/54/58',
    putter: 'Scotty Cameron Phantom X 5.5',
    ball: 'Titleist Pro V1x',
    lastFitting: 'Jan 15, 2026',
  },
};
```

The full timeline event dataset should be built out with at least 2-3 weeks of events covering all event types and all connected sources. Use the week of Mar 12-18 from the prototype as the starting template.

---

## Freemium Tiers

| Feature | Free | Pro ($9.99/mo) | + Coach |
|---------|------|----------------|---------|
| Manual score entry + handicap tracking | Yes | Yes | Yes |
| Basic round summary | Yes | Yes | Yes |
| Equipment bag tracker | Yes | Yes | Yes |
| Practice session logging (manual) | Yes | Yes | Yes |
| Coaching OS connection (see coach notes) | Yes | Yes | Yes |
| Data source integrations (Arccos, GHIN, Garmin, WHOOP) | — | Yes | Yes |
| Full unified timeline with cross-source patterns | — | Yes | Yes |
| Strokes gained analytics + diagnostics | — | Yes | Yes |
| AI practice plans (Practice Mode) | — | Yes | Yes |
| Round Review with coaching context | — | Yes | Yes |
| Ask Looper conversational chat | — | Yes | Yes |
| Connection insights (cross-source event linking) | — | Yes | Yes |
| Unlimited data history (free = 90 days) | 90 days | Unlimited | Unlimited |
| Coach-prescribed practice sessions | — | — | Yes |
| Between-lesson video submission | — | — | Yes |
| Coach's diagnosis + intervention visibility | — | — | Yes |

---

## File Structure

```
src/
  components/
    layout/
      GlobalBar.jsx
      DataSourceBar.jsx
      TabNav.jsx
      BottomNav.jsx
    shared/
      KpiTile.jsx
      ConfBadge.jsx
      RecCard.jsx
      Card.jsx
      Pill.jsx
      SectionLabel.jsx
      MiniBar.jsx
      Sparkline.jsx
      Dispersion.jsx
      SourcePill.jsx
      ConnectionInsight.jsx
      MetricRow.jsx
    timeline/
      TimelineEvent.jsx
      TimelineDay.jsx
      CrossSourcePattern.jsx
      TimelineSpine.jsx
      TypeIcon.jsx
    surfaces/
      Dashboard.jsx
      PracticeMode.jsx
      Rounds.jsx
      MyJourney.jsx
    overlays/
      DataSourceDrawer.jsx
      ChatPanel.jsx
  data/
    sources.js
    player.js
    timeline.js
    chatResponses.js
  styles/
    tokens.js
  App.jsx
```

---

## Implementation Sequence

Build in this order:

1. **Tokens + source config** — Color system, source identity, type icons. These define the visual language.
2. **Timeline components** — TimelineEvent, TimelineDay, ConnectionInsight, CrossSourcePattern, TypeIcon. Build the timeline first because it's the data model.
3. **Layout shell** — GlobalBar, DataSourceBar, TabNav, BottomNav.
4. **My Journey tab** — The full timeline. This is the signature surface. Get it right.
5. **Dashboard** — Timeline filtered to recent + aggregated. References the same events.
6. **Rounds** — Timeline filtered to rounds. Expanded rounds show same-day timeline context.
7. **Data Source Drawer** — Tappable sources in L2 open drawers for all 10 sources.
8. **Practice Mode** — Session blocks with cue cards, session controls.
9. **Chat Panel** — FAB button, full-screen chat, suggested prompts, hardcoded responses.
10. **Chat API integration** — Connect to Anthropic API with player timeline context.
11. **Responsiveness + polish** — Test at 375px through 428px.

---

## Brand Voice Reminders

- The system recommends. Not "our AI."
- Use golf language naturally: strokes gained, dispersion, carry, face-to-path, GIR.
- Be direct: "Your approach game is costing you 1.4 strokes per round."
- Uncertainty is honest: "the data suggests" not "guaranteed."
- The player is the hero. The system is the instrument.
- No hype: no "revolutionary," no "game-changing," no "unlock your potential."
- Connection insights should feel like revelations, not marketing: "Low recovery → dispersion regression. Not a swing problem." is better than "We detected a cross-source biometric correlation!"

---

## Key Design Principles

**Every screen answers one question instantly:**
- Dashboard → "Where am I and what should I do next?"
- Practice → "What should I work on and how?"
- Rounds → "What happened and what does it mean?"
- My Journey → "What's the full story of my improvement?"
- Ask Looper → "Why?" and "What if?"
- Data Sources (L2) → "What's connected and what could I add?"

**The timeline is the product:**
- The four tabs are lenses on the timeline, not separate products.
- My Journey IS the timeline. Dashboard, Practice, and Rounds are filtered views.
- Every event links back to the timeline. Expanding a round on the Rounds tab shows that day's full timeline context.
- Connection insights are the differentiator. If two events from different sources are causally linked, show it.

**One time axis. Every source. Your story.**
