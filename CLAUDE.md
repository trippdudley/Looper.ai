# Looper.AI

## What This Is
Looper.AI is an AI-native Coaching OS for golf academies. The platform captures every lesson into a persistent record and uses AI to think alongside coaches in real time. Core thesis: Memory enables intelligence. The record is the foundation; the intelligence is the value proposition.

Strategic sequence: Record → Intelligence → Compounding insight. Dataset company that starts as a platform.

## What We're Building
Two portals. Two personas. One intelligence. No fitting (shelved).

### Coach Experience — Three Form Factors

1. **Coach Portal** (full web app, desktop-first, light mode): Between-lesson command center. Dashboard, player roster, session history, practice plans, post-session review.
2. **Lesson Sidebar** (420-480px via CSS variable `--sidebar-w`, dark mode, floating panel): In-lesson copilot. Sits alongside TrackMan Performance Studio via Windows snap.
3. **Coach App** (Expo React Native, iOS-first, dark mode): On-the-lesson native app. Live recording, Deepgram transcription, swing detection, QR share. Located at `packages/coach-app/`.

### Player Experience — Two Form Factors

* **Player Portal** (web, desktop-first, 960px max-width, responsive to 480px, dark mode): Dashboard, Scoring X-Ray, Practice Brief, Practice Review, My Journey. "Ask Looper" chat overlay.
* **Player App** (Expo React Native, iOS-first): **Separate repo** at `github.com/trippdudley/looper-player`. See below.

## Looper Player iOS App
Separate repo: `github.com/trippdudley/looper-player`
- Expo SDK 55 React Native app (iOS-first, dark mode)
- Shares THIS Supabase project (same DB, same auth, same Edge Functions)
- Edge Functions for the player app live HERE in `supabase/functions/` (chat, parse-screenshot, practice-brief)
- Schema changes happen HERE in `supabase/migrations/`
- Design tokens are duplicated (will consolidate via @looper/shared later)
- Current state: Phases 0-2.5 complete (auth, onboarding, dashboard, data import, Ask Looper, Practice Brief)

## Lesson Sidebar — Panel Treatment
The sidebar follows the Claude-in-Chrome companion panel pattern:
* Bold gray border: `2px solid #3A4856` on all four sides
* Rounded corners: `borderRadius: 16px` on all four corners
* Margin: 8px gap from viewport edges and TPS panel
* Shadow: `boxShadow: '0 2px 16px rgba(0,0,0,0.4)'`
* Dock rail: parent background `#060A0F` shows through the gaps
* TPS panel goes full edge-to-edge (no rounding, no margin)
* The sidebar reads as a distinct floating companion, not merged into TPS

## TrackMan Wireframe (Demo)
The TPS panel in the demo is a faithful wireframe of the real TrackMan Performance Studio Shot Analysis view:
* Uses Helvetica/Arial typography — NOT Looper fonts. TPS should look like TrackMan.
* Orange metric labels (`#E8862A`) — the signature TPS visual
* Ball flight visualization with green fairway gradient
* Video panel placeholder with DL/OT1/OT2/LIVE tab selector
* Metrics strip at bottom with large white numbers
* Static data (doesn't change per demo step)

## Session Launch Transition
From Coach Portal → Lesson Sidebar:
* "Start Lesson" on StudentDetail navigates to `/trackman`
* Single "Preparing Session" screen with staged checkmarks
* "Launch Session" transitions to TPS + sidebar split view
* One launch screen only — no duplicate modals

## Visible AI Reasoning (Sidebar)
The sidebar's signature interaction. Seven-step demo walkthrough using Session 9 (the canonical demo):
* **Context phase**: Briefing card from persistent record (S8 recap, practice compliance, recommendation)
* **Analysis phase**: Insight cards stream in progressively. AI flags driver SG trending worse (-1.5 → -2.3 across 8 sessions, never addressed). Confidence evolves from 52% → 71% → 87%. Coach watches the AI earn its conclusions.
* **Working phase**: Drill suggestion cards with type badges (External/Internal/Constraint), expected effect, expandable "Why?" reasoning, Accept/Alternatives buttons
* **Summary phase**: Session complete card with carry-forward items for next session

Phase labels use natural language (Context / Analysis / Working / Summary) — NOT the internal system taxonomy (Catch-up / Diagnosis / Intervention / Review). The four-phase model drives AI behavior but is never shown to coaches.

## Player Journey — Shared Component
Three-layer timeline on a shared horizontal time axis: Lesson Layer (cards + thread lines) → Rounds & Handicap Layer (dots + rolling line) → Strokes Gained Layer (monthly heatmap). Same data model renders in Coach Portal (with coaching detail) and Player Portal (with personal emphasis).

## Demo Flow
`/coach` → `/coach/students` → `/coach/students/1` → Start Lesson → `/trackman` (preparing) → Launch Session → `/trackman` (TPS + sidebar, 7 steps) → Back arrow → `/coach`

## Mock Data — Moe Norman Story (Canonical Demo)
* Player: Moe Norman, handicap 12.1 (from 13.8), 8 sessions with Coach M. Thompson
* Goal: "Break 80"
* Driver SG trending worse: -1.5 → -2.3 across all 8 sessions, never addressed
* **Session 9 is the canonical demo** — the AI flags the driver issue with 87% confidence
* Short Game improved early (S1-S2), Approach improved during iron strike block (S6-S8), Putting always stable
* All sidebar demo flows, coach portal session views, and AI reasoning walkthroughs use Session 9 data

## Monorepo Structure

```
looper/                         (root — npm workspaces)
├── src/                        (web app — Vite + React 19)
│   ├── personas/coach/         (Coach Portal — light mode, Tailwind)
│   ├── personas/player/        (Player Portal — dark mode, inline tokens)
│   ├── lesson-sidebar/         (Lesson Sidebar — dark mode, 450px)
│   └── pages/LessonShare.tsx   (Public /lesson/:token page for QR shares)
├── packages/
│   ├── shared/                 (TypeScript types, colors, utils — shared across web + native)
│   └── coach-app/              (Expo React Native coach app)
│       ├── app/                (Expo Router file-based routing)
│       ├── services/           (supabase.ts, deepgram.ts, recording.ts, swingDetector.ts)
│       ├── hooks/              (useAuth, useRecording, useSessions)
│       └── components/
└── supabase/                   (Schema as code)
    ├── config.toml
    ├── migrations/             (Numbered SQL migrations — run with `supabase db push`)
    └── seed.sql
```

## Stack

### Web App (src/)
* Vite + React 19 + Tailwind v4 (CSS-first, no tailwind.config.js)
* Icons: lucide-react SVG only. NO emoji anywhere in the UI.
* Fonts: DM Sans / Space Mono / Playfair Display (Google Fonts)
* Charts: recharts for standard, custom SVG for golf-specific

### Coach App (packages/coach-app/)
* Expo SDK 52 + React Native 0.76
* Expo Router v4 (file-based routing)
* NativeWind v4 (Tailwind for RN — dark mode default)
* `expo-av` for audio recording
* Deepgram Nova-2 for transcription with speaker diarization
* `react-qr-code` for QR share generation
* Zustand for state management
* Same Supabase project as web app

### Shared (packages/shared/)
* TypeScript types for Player, Session, Coach, Drill, etc.
* Color constants (`COLORS.dark`, `COLORS.light`)
* Utility functions (`formatHandicap`, `formatSG`, `sgSeverity`)

### Backend (Supabase)
* PostgreSQL with RLS — schema versioned in `supabase/migrations/`
* Tables: `players`, `rounds`, `practice_sessions`, `shots`, `coaches`, `coaching_connections`, `coaching_sessions`
* Triggers: auto-create `players` row on signup (role=player), `coaches` row (role=coach)
* Storage: `session-files` bucket (CSV/JSON uploads), `lesson-audio` bucket (M4A recordings)

## Live Services
* **Supabase** — auth (email/password), players + coaches tables with triggers, RLS policies
* **Anthropic Claude API** — Ask Looper chat (streams from browser in prototype; moves to Edge Function in production)
* **Deepgram Nova-2** — lesson transcription with speaker diarization (key in `.env` for prototype)
* Player Portal (`/player`) — live Supabase auth. NOT a prototype — active product.
* Coach Portal (`/coach`) — hardcoded Moe Norman demo data
* Lesson Sidebar (`/trackman`) — hardcoded Session 9 demo
* Coach App (`packages/coach-app/`) — live Supabase + live Deepgram

## QR Share Flow
Coach records lesson → stops recording → transcription runs via Deepgram → session saved to Supabase with `share_token` → coach taps "Share" → QR code shown in app → player scans with phone → lands on `looper.ai/lesson/:token` → sees lesson summary (coaching cues, drills, key changes, transcript).

## Design System Quick Reference

### Colors — Light (Portal)
bg `#F6F7F9`, cards `#FFFFFF`, accent `#0D7C66`, text `#1A1F2B` / `#4B5563` / `#9CA3AF`

### Colors — Dark (Sidebar)
bg `#0C1117`, surface `#151D28`, surfaceAlt `#1E2A36`, accent `#10B981`, text `#E8ECF1` / `#8B99A8` / `#5E6E7E`

### Colors — TPS Wireframe
bg `#1A1A1A`, nav `#2A2A2A`, accent `#E8862A` (orange), text `#FFFFFF` / `#999999`

### Sidebar Shell
border `2px solid #3A4856`, borderRadius `16px`, margin `8px`, shadow, dock rail `#060A0F`

### Semantic
confidence `#0FA87A`, caution `#D4980B`, flag `#C93B3B`

### Typography Split (Single Source of Truth)
* **DM Sans**: all human-readable text, headings, body copy, UI summary numbers (session counts, rounds played, improvement scores, practice frequency). These are summary stats, not instrument readings.
* **Space Mono**: golf metrics and instrument data — handicap values, strokes gained, carry/distance, spin rate, launch angle, face-to-path, confidence percentages, timestamps, phase labels, data axis labels. The "data instrument" font.
* **Playfair Display italic**: editorial moments only (taglines, pull quotes). NEVER for body or data.
* All three are Google Fonts. Skills reference this section — do not redefine fonts elsewhere.
* **The distinction**: if it came from a launch monitor or statistical model, it's Space Mono. If it's a simple count or UI chrome number, it's DM Sans bold.

### Border Radius
* Cards: ≤8px
* Insight cards: 6px
* Buttons/inputs: 4px
* Sidebar shell: 16px
* Badges/pills: full-round
* Never exceed 8px on standard cards

### Sidebar-Specific Constraints
* Width: CSS variable `--sidebar-w: 450px` (tunable 420-480px)
* All content stacks vertically — no horizontal card layouts
* Ultra-compact spacing: 8px gaps, 10px padding
* Body text: 13px DM Sans. Data: 14-16px Space Mono.
* Max 2 data points per row in cards
* Dark mode is the default

## Git
* Remote: github.com/trippdudley/Looper.ai
* Netlify deploys from `main` (web app only — coach app uses EAS Build)
* Claude Code creates its own branches via worktrees

### Git Workflow Rules (MANDATORY)
These rules prevent work from being lost when Code sessions run out of context or crash. Follow them every time.

1. **Never work directly on main.** Create a named branch before making changes (e.g., `coach-app/phase-1-capture`, `fix/supabase-auth`). Use descriptive names, not auto-generated ones.
2. **Commit frequently.** Every meaningful chunk of work (new screen, new service, new Edge Function, bug fix) gets its own commit with a clear message. Do not let uncommitted changes accumulate.
3. **Push to GitHub regularly.** Push at least every 15-20 minutes of active work. If the session dies, unpushed work is gone.
4. **Merge to main only when a feature is complete and tested.** Use `git merge --no-ff` to preserve the branch history in the merge commit.
5. **Clean up after yourself.** After merging, delete the branch locally and remotely. Prune dead worktrees with `git worktree prune`.
6. **Never force push to main.** If you need to fix a mistake, create a new commit.
7. **Commit message format:** `type: short description` where type is `feat`, `fix`, `refactor`, `docs`, `chore`. Example: `feat: QR share flow with magic link auth`

## Running the Projects
```bash
# Web app (Vite dev server)
npm run dev

# Coach app (Expo)
cd packages/coach-app && npx expo start

# Or via npm workspace script
npm run coach

# Supabase local dev (requires Docker)
npx supabase start

# Apply migrations to cloud project
npx supabase db push
```

## Coach App First Run
1. Copy `packages/coach-app/.env.example` to `packages/coach-app/.env`
2. Fill in `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_DEEPGRAM_API_KEY`
3. `cd packages/coach-app && npm install`
4. `npx expo start --ios`

## Key Domain Terms
EI profile, D-plane, spin loft, smash factor, dynamic lie, CT limit, MOI, strokes gained, dispersion ellipse, carry window, face-to-path, attack angle, dynamic loft, kinematic sequence
