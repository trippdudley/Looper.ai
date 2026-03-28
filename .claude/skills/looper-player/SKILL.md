---
name: looper-player
description: "Looper.AI Player Portal and iOS app — the consumer-facing product that closes the loop between on-course performance, structured practice, and measurable improvement. Use this skill whenever building Player Portal UI, practice planning features, player-facing dashboards, session review screens, onboarding flows, data import features, or anything at the /player route. Also trigger when discussing player data architecture, Supabase schema, React Native/Expo migration, Arccos/GHIN/Foresight/TrackMan integration, the practice-to-performance feedback loop, Ask Looper chat, or competitive positioning vs Arccos/Decade/Clippd. If the output touches what a PLAYER sees (not a coach), this skill applies. Even if the user doesn't say 'player portal' — if they're talking about handicaps, practice plans, scoring data, golf DNA, or round logging, this skill is relevant."
---

# Looper.AI Player Portal

Read this file completely before building any Player Portal feature or discussing player-facing product decisions.

For design system tokens, typography, component patterns, and layout rules, read `looper-ux-system/SKILL.md`. This file covers product strategy, architecture, data model, and feature spec.

**Approved spec:** `# Looper Player — Architecture & Product Spec` (v1.0, March 26 2026). This skill is the canonical reference derived from that document. If anything here contradicts older CLAUDE.md or worktree files, this skill wins.

---

## 1. Current State (What's Built)

The Player app is an Expo/React Native iOS app at `apps/player/` in the `looper-player` monorepo:
- **Live Supabase auth** (email/password signup, login, session persistence)
- **Real `players` table** with trigger on `auth.users` insert
- **3-screen onboarding flow** (About Your Game → Connect Data → You're In) that writes to Supabase
- **Ask Looper chat** with live Claude integration (streaming via SSE Edge Function)
- **5-tab layout**: Dashboard / Journey / Practice / Ask Looper / Settings
- **Data import**: Foresight .session parser, TrackMan .csv parser, GHIN/Arccos screenshot OCR
- **Practice Brief**: SG-proportional practice plan via Edge Function
- **Design tokens** in `tokens/` (colors, fonts, styles) — dark mode, WHOOP-inspired

Part of the `looper-player` monorepo alongside Coach app (`apps/coach/`) and shared package (`packages/shared/`). Both apps share the same Supabase project.

**Web prototype** still lives in the `looper` repo at `src/personas/player/` — that's the investor demo, deployed to Netlify. The native app is the production target.

---

## 2. Product Thesis

WHOOP doesn't ask you to interpret HRV charts. It tells you: "Your recovery is 42%. Take it easy today." Looper does the same for golf: "Your wedge game is costing you 2.3 strokes per round. Here's a 30-minute practice plan."

**The app is not a data viewer. It's an AI coach that happens to show you the data backing its recommendations.**

Two differentiators:
1. **The best golf analytics visualization anyone has seen.** Arccos has the data but mediocre presentation. We build cross-source insights, visual severity hierarchy, and data that tells stories rather than reports facts.
2. **The practice-to-performance loop.** Nobody connects diagnosis → practice plan → session tracking → outcome measurement. We do. And when connected to a Looper Coach, the coach sees, overrides, and customizes the plan.

The Player Portal earns trust in three steps:
1. **Show something you didn't know** — cross-source insight (handicap improving but recent SG declining)
2. **Tell you what to do** — SG-proportional practice plan with specific drills and success criteria
3. **Show it's working** — practice session scored against the plan, on-course results correlated over time

---

## 3. Architecture Direction

**Target: React Native (Expo) iOS app.** The web prototype is the proving ground; the product ships as a native app via TestFlight → App Store.

| Layer | Technology | Why |
|-------|-----------|-----|
| UI | React Native (Expo) + NativeWind | 60-70% code reuse from prototype. Same TypeScript, same design tokens. |
| State | Zustand stores | Lightweight, zero boilerplate, works identically in React and React Native. |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions + Storage) | Already live. RLS enforces data isolation. Edge Functions keep API keys server-side. |
| AI | Claude API via Supabase Edge Functions | Moves Anthropic API key off-device. Context builder assembles player record server-side. |
| Local cache | SQLite (expo-sqlite) | Offline-first. Data available on the course with no signal. |
| Push | Expo Push + APNs | Built into Expo, free up to 100K/mo. |
| Analytics | PostHog | Open-source, generous free tier, feature flags for A/B testing. |
| Crash reporting | Sentry | First-party Expo integration. |
| Subscriptions | RevenueCat | Handles App Store subscription complexity. |

For the full architecture diagram, data flow, and scaling plan, read `references/infrastructure.md`.

---

## 4. MVP Features (10 TestFlight Users)

| Feature | What It Does | Exists in Prototype? |
|---------|-------------|---------------------|
| Onboarding | Connect data sources, set goals, establish baseline | Yes (3-screen flow, writes to Supabase) |
| Dashboard | Handicap, trend, next action, recent activity | Yes (Home tab) |
| Ask Looper | AI chat grounded in complete golf record | Yes (working Claude integration) |
| Scoring X-Ray | GHIN data visualized: trends, differentials, SG breakdown | Yes (DNA tab) |
| Practice Brief | AI-generated practice plan based on SG data | Yes (Practice tab) |
| Data Import | Manual CSV/file upload for TrackMan, Foresight, Arccos | No — must build |
| My Journey | Timeline: rounds, practice, milestones on shared time axis | Yes (Journey tab) |
| Push Notifications | Practice nudges, round reminder, weekly recap | No — must build |
| Settings | Profile, connected sources, notifications, data export | Partial |

### v1.0 Additions (App Store Launch)
Golf DNA (player archetype), Session Review, Weekly Intelligence Brief, GHIN Auto-Sync, Goal Tracker, Share Card.

### Features That Unlock at Scale
Read `references/infrastructure.md` for the full scale-dependent feature matrix (peer benchmarking at 1K users, equipment insights at 10K, predictive handicap at 100K).

---

## 5. Data Architecture

Three-layer architecture: **normalizers → store → view.**

The timeline is the data model. All tabs are views on the same underlying data.

Each data source has a normalizer that takes raw input (manual extraction now, API response later) and returns typed output. The UI imports from the store layer, never from raw data. When we replace manual extraction with an API call, only the normalizer changes — store and view are untouched.

### Sources
| Source | Phase | Method |
|--------|-------|--------|
| GHIN | 1 (now) | Manual extraction → typed constants. Later: OAuth API. |
| Arccos | 1 (now) | Manual extraction. Later: screenshot OCR via Claude Vision, then OAuth. |
| Foresight | 1 (now) | `.session` JSON file upload (working normalizer exists). |
| TrackMan | 2 | CSV upload. Later: API partnership. |
| Garmin R10 | 2 | CSV upload. Later: Garmin Connect API. |
| WHOOP | 2 | API integration (health-adjacent data, separate schema). |
| Apple Health | 3 | HealthKit integration. |
| Clippd | 3 | Import via their export format. |

Do NOT build Phase 2/3 normalizers until the core practice loop works.

For the complete SQL schema (`players`, `rounds`, `practice_sessions`, `shots`, `coaching_connections`, `coaching_sessions`), read `references/data-model.md`.

---

## 6. User Flows

### Onboarding (First Launch)
```
App opens → Welcome screen
 → Sign up (email + Apple Sign In)
 → "What's your handicap?" (or "I don't have one")
 → "What's your goal?" (Break 100 / Break 90 / Break 80 / Single digit / Scratch / Custom)
 → "Connect your data" → Data source picker
 → Dashboard (with or without data)
```
Onboarding must work with ZERO connected data. A golfer who just enters handicap and goal should still get value from Ask Looper.

### Daily Use
```
Open app → Dashboard
 → See: handicap trend, days since last round, AI insight card
 → Tap insight → expands to full recommendation
 → Tap "Ask Looper" → chat
 → Tap "Practice Brief" → structured plan
 → Tap "Log Round" → manual score entry
```

### Post-Practice Session Review
```
After practice → notification: "How'd it go?"
 → If launch monitor connected: auto-populated metrics
 → If not: "What did you work on?" (tags or free text)
 → AI generates practice summary card → added to Journey timeline
```

---

## 7. Voice

Speak like a smart caddie who watches every round and every practice session.

- **Precise, not academic.** "You lose 2.2 strokes on approach shots"
- **Opinionated, not neutral.** "Skip driver today"
- **Honest, not harsh.** "Short game practice: zero for the 3rd consecutive session"
- **Connected, not siloed.** Always reference cross-source insights
- **Story, not report.** "This one distance range costs you nearly a full stroke per round"

---

## 8. Coach Connection

Design every feature asking: "What does the coach see on the other side?"

**Player → Coaching OS:** Practice Brief → coach reviews/overrides. Practice session → pre-lesson brief. Adherence score → roster dashboard. SG trends → translation tracking.

**Coaching OS → Player:** Coach-customized brief → replaces AI brief with "Customized by [Coach Name]" badge. Lesson notes → Journey timeline. Drill assignments → next Practice Brief.

Every coach correction of an AI brief is an RLHF training signal.

---

## 9. Competitive Positioning

| Competitor | Their Gap | Our Advantage |
|-----------|----------|---------------|
| Arccos | Good data, mediocre viz, zero practice features | We aggregate ALL sources. AI intelligence layer. |
| Decade | Course strategy only, terrible app (3.2/5), manual entry | We include on-course data + practice loop. |
| Clippd | Analysis-only, no practice tracking | We connect practice to play. |
| Circles | Tour-level only, not consumer | We serve everyday golfers. |
| Shot Scope | Less polished analytics than Arccos | We're AI-native, not just a calculator. |

**Our moat:** No one else connects launch monitor practice data + on-course performance + coaching records + AI reasoning into a single longitudinal record.

---

## 10. Build Sequence

### Phase 0: Foundation (Week 1-2)
Expo project, Supabase schema, design token migration, NativeWind, EAS Build, Sentry + PostHog, shared component library.

### Phase 1: Core Experience (Week 2-4)
Dashboard, Ask Looper chat, My Journey, Scoring X-Ray, Edge Function for chat + context builder.

### Phase 2: Data Pipeline (Week 4-5)
GHIN sync, TrackMan CSV adapter, Foresight CSV adapter, Arccos screenshot import, manual round entry, file picker integration.

### Phase 3: Engagement & Polish (Week 5-7)
Onboarding flow, Practice Brief, push notifications, goal tracker, settings, offline SQLite, animations.

### Phase 4: Beta + App Store (Week 7-10)
TestFlight to 10 users, bug fixes, App Store assets, submission, post-launch monitoring.

For detailed task breakdowns, App Store requirements, and cost modeling, read `references/infrastructure.md`.

---

## 11. Demo Data

The canonical demo player is **Andrew D.** (not Moe Norman — that's the Coach Portal demo). Andrew's data is real, manually extracted, and authoritative for building the MVP.

Key stats: handicap 3.4, career low 3.4 (3/23/2026), -3.9 overall SG, 101 Arccos rounds, 7,116 shots.

For Andrew D.'s complete data (GHIN history, Arccos SG breakdowns by category/distance/terrain, Foresight session with shot-level data, SG-proportional practice brief), read `references/demo-data.md`.

**Tripp D.'s data** (`tripp.ts` in the prototype) is the founder's real data used for live testing. It is NOT the demo — keep them separate.

---

## 12. Responsive Design

Desktop-first (960px max-width), responsive to tablet (768px) and phone (480px). NOT mobile-first. The Journey timeline needs room at desktop. Practice Brief and Practice Review are the most-used on mobile (quick reference at the range).

---

## Reference Files

| File | Contents | Read When |
|------|----------|-----------|
| `references/data-model.md` | Complete SQL schemas for players, rounds, practice_sessions, shots, coaching tables | Building database features, writing queries, creating Edge Functions |
| `references/demo-data.md` | Andrew D.'s complete GHIN, Arccos, and Foresight data with shot-level detail | Building demo screens, populating test data, writing AI context examples |
| `references/integrations.md` | Adapter architecture, CSV import workflows, screenshot OCR, GHIN sync | Building data import features, adding new data sources |
| `references/infrastructure.md` | Scalability plan, cost modeling, services & tools, App Store requirements, timeline | Architecture decisions, deployment, infrastructure planning |
