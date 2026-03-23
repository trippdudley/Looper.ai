# Looper.AI

## What This Is
Looper.AI is an AI-native coaching copilot for golf. One intelligence, two experiences: coach and player. The persistent record builds itself through ambient capture agents. The copilot thinks alongside the coach in real time during lessons and helps players improve between them.

## Core Thesis
Memory enables intelligence. The persistent record is the foundation — you can't have a thinking copilot without something to think about. But the experience the coach sees is intelligence: the AI actively processing, reasoning, and surfacing insights in real time. The record is both the product and the moat. The intelligence is the value proposition.

Strategic sequence: Record → Intelligence → Compounding insight. Dataset company that starts as a platform.

## Product Architecture

### Coach Experience — Two Form Factors

**Coach Portal** (full web app, desktop-first, full-width):
The between-lesson command center. Dashboard with upcoming lessons and player status. Player roster with longitudinal progress views. Session history searchable by player, date, or topic. Practice plan builder and tracker. Program design tools. Weekly digest of player activity. Post-session detailed view lives here — full lesson record expanded by phase, editable by coach.

**Lesson Sidebar** (narrow panel, 420-480px wide, dark mode):
The in-lesson copilot. Shares the coach's monitor with TrackMan Performance Studio (TPS) using a Windows snap layout (~75/25 split on a 1920x1080 display). Contains the live lesson timeline with auto-detected phases, visible AI reasoning, ambient insight cards, and drill suggestions. Everything that happens during a lesson must work within this width.

### Player Experience — One Form Factor

**Player Portal** (mobile-first, 480px):
Four surfaces: Dashboard, Practice, Rounds, My Journey. The timeline IS the data model — My Journey is the full unfiltered chronological record, other tabs are filtered lenses. "Ask Looper" chat overlay for questions between lessons. Session recaps in plain language. Practice accountability.

### Data Capture
Agent-based ambient capture, NOT manual entry or CSV import. Vision agent reads launch monitor screens via camera. Audio agent extracts intervention labels and lesson phase context from coach-player conversation. Video agent processes swing cameras. Between-session agents monitor Arccos, WHOOP, practice activity. The record builds itself as a byproduct of the session. Coach reviews and corrects post-session (30 seconds). Every correction is an RLHF training signal.

### The Live Lesson Timeline (Sidebar)
The signature interaction pattern, rendered within the 420-480px sidebar:

- **Catch-up** (~first 5 min): AI surfaces context from the persistent record — last session summary, practice activity, player goals, recent rounds
- **Diagnosis** (~next 15 min): AI processes incoming launch monitor data and swing video, identifies patterns, flags limiting factors with evolving confidence
- **Intervention** (~next 20 min): AI catalogs drills and cues the coach selects, tracks response data, suggests alternatives if current approach isn't working
- **Review** (~final minutes): AI assembles session summary, highlights what changed, drafts practice plan, queues between-lesson monitoring

Phase detection is automatic from audio context and data flow. No manual triggers. Vertical timeline progressing in real time, with the AI's thinking visible at each phase.

### Two Modes
- **Ambient mode (during lesson, in sidebar)**: Compact vertical layout. Current phase highlighted, key metrics updating live, insight cards appear only when useful. Maximum 2-3 cards visible. The coach glances, doesn't study.
- **Detailed mode (after lesson, in portal)**: Full structured session record expanded by phase. Complete data, video timestamps, intervention log, editable by coach.

## Prototypes in This Repo
- `/src/personas/coach/` — Coach portal prototype (dashboard, roster, session history, practice plans)
- `/src/pages/LiveSessionSideline.tsx` + `/src/components/trackman/` — Lesson sidebar prototype
- `/src/personas/player/` — Player portal prototype (mobile-first 480px)
- `/src/components/sizzle/` + `/src/pages/SizzleReel.tsx` — Investor sizzle reel
- `/src/components/` — Shared component library

## Stack
- Vite + React + Tailwind CSS
- Icons: lucide-react SVG only. NO emoji anywhere in the UI.
- Charts: recharts for standard, custom SVG for golf-specific (dispersion, strike maps)
- Fonts: DM Sans (brand voice), Space Mono (data voice), Playfair Display (editorial moments only)
- All prototypes use hardcoded mock data — no API calls

## Design System
- **Light mode (default for portals)**: bg #F6F7F9, cards #FFFFFF, accent #0D7C66 (deep teal), text #1A1F2B / #4B5563 / #9CA3AF
- **Dark mode (lesson sidebar)**: bg #0C1117, surface #151D28, accent #10B981
- **Semantic**: confidence #0FA87A, caution #D4980B, flag #C93B3B
- **Typography split is absolute**: DM Sans never renders numbers in data cards. Space Mono never renders body paragraphs.
- **Spacing**: 4px base grid. Sidebar: 8px gaps, 8-10px padding. Portal: 8-12px gaps, 12-16px padding.

## Visible AI Reasoning Patterns
When the AI is processing, show it — don't hide behind a spinner:
- **Thinking indicator**: Subtle pulsing dot with brief label ("Analyzing strike pattern..." / "Detecting phase transition...")
- **Streaming insight cards**: Content builds progressively, word by word
- **Confidence that evolves**: Starts low during diagnosis, visibly increases as data accumulates
- **Phase transitions**: Brief animated moment with explanation ("Coach shifted to drill work — cataloging intervention")

## Sidebar-Specific Constraints
- Width: 420-480px. Shares coach monitor with TPS (~75/25 Windows snap on 1920x1080).
- Dark mode default (#0C1117 background) — bay environments.
- All text must be legible. Body: 13px. Data values: 14-16px Space Mono.
- No horizontal card layouts wider than 2 data points per row. Use vertical stacking for more.
- Insight cards: 1-2 sentences max. Expand on tap for detail.
- Charts: compact, vertical-scroll-friendly variants (sparklines, small dispersion, compact bar).
- Vertical timeline as primary navigation, not horizontal tabs.

## Coding Conventions
- TypeScript strict mode for all new files
- Tailwind utility classes, no inline styles
- Component files: PascalCase (MetricCard.tsx)
- Shared components in /src/components/
- Prototype-specific components in their prototype folder
- Brief JSDoc comment on every component
- const for all declarations unless mutation required

## Anti-Patterns (Never Do These)
- No emoji in the UI — ever
- No generic AI aesthetics (Inter font, purple gradients, rounded corners > 8px)
- No "Powered by AI" badges or sparkle icons
- No loading spinners — use skeleton screens or visible AI reasoning
- No hero sections with stock photos
- No gradient backgrounds on content areas
- No neural-net graphics or "AI brain" imagery
- Never position AI as replacing the coach. Always: thinking alongside, augmenting.
- Never say "Our AI" as a separate entity. The system is Looper.

## Git Workflow
- main branch is stable
- Feature branches: coach-portal, lesson-sidebar, player-app, sizzle-reel
- Commit frequently with descriptive messages

## Key Domain Terms
EI profile, D-plane, spin loft, smash factor, dynamic lie, carry window, dispersion ellipse, strike map, gear effect, intervention ontology, RLHF, kinematic sequence, face-to-path, limiting factor, motor learning, external focus, Challenge Point Framework
