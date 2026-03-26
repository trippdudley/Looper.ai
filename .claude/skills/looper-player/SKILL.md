---
name: looper-player
description: "Looper.AI Player Portal — the consumer-facing product that closes the loop between on-course performance, structured practice, and measurable improvement. Use this skill whenever building Player Portal UI, practice planning features, player-facing dashboards, session review screens, or anything at the /player route. Also trigger when discussing player data architecture, Arccos/GHIN/Foresight integration, the practice-to-performance feedback loop, or competitive positioning vs Arccos/Decade/Clippd. If the output touches what a PLAYER sees (not a coach), this skill applies."
---

# Looper.AI Player Portal

Read this file completely before building any Player Portal feature or discussing player-facing product decisions.

For design system tokens, typography, component patterns, and layout rules, read `looper-ux-system/SKILL.md`. This file covers product strategy, data architecture, complete demo data, and feature spec.

---

## 1. The Problem (What Nobody Solves Today)

Every golf improvement tool solves one piece and ignores the rest:

**Arccos** — market leader in on-course tracking. 1.5B tracked shots, PGA Tour partnership, OEM deals with Titleist/PING/Cobra/TaylorMade. SG analytics are good but visualization is mediocre: siloed cards with no cross-source connections, no visual severity hierarchy, data that reports facts rather than telling stories. And zero practice features. $200/yr. 1.9/5 on Trustpilot (customer service failures, subscription frustration, shot detection issues — 14-16% fairway shots missed per round in independent testing).

**Decade** — course management strategy system by Scott Fawcett. Proven concept: 8,000+ members, 200+ NCAA teams, used by Bryson DeChambeau and Will Zalatoris. But manual data entry only, terrible app (3.2/5 Google Play, constant crashes), drip-fed content, no connection to on-course data. $125-250/6mo. App reviews are devastating — "embarrassingly bad."

**Clippd** — data aggregator (ingests Arccos, Garmin, TrackMan). NCAA scoring partner. Has AI-driven "what to work on" lists and a unique Player Quality 0-200 scale. But no structured practice session planning, no session tracking, no outcome loop closure.

**Circles** — closest to complete. Insight → train → play cycle, used by 25% of LPGA Tour. Every 5 rounds, AI curates 3 focus areas with bespoke training goals. But targets tour-level players, not consumers.

**Break X Golf** — 130+ skill-based games, builds weekly plans from stats. Founded by a PhD/PGA Pro. But web-only, no launch monitor integration, no on-course correlation.

**Shot Scope** — Arccos's primary hardware competitor. No subscription fees (lifetime free analytics). V5 watch + LM1 launch monitor create the broadest ecosystem. But analytics less polished than Arccos.

**The gap nobody fills:** diagnosis → personalized practice plan → practice session tracked and scored → on-course results measured → plan updated. That's the Looper Player Portal.

---

## 2. Product Thesis

**The Practice Brief is the product. The analytics earn the trust that makes the Brief credible. The Practice Loop is proof.**

Two differentiators, not one:
1. **The best golf analytics visualization anyone has seen.** Arccos has the data but mediocre presentation. We build cross-source insights no single platform can surface, visual severity hierarchy that makes magnitude visceral, and data that tells stories rather than reports facts.
2. **The practice-to-performance loop.** Nobody connects diagnosis → practice plan → session tracking → outcome measurement. We do. And when connected to a Looper Coach, the coach sees, overrides, and customizes the plan — making the loop defensible.

The Player Portal earns trust in three steps:
1. **Show something you didn't know** — cross-source insight (handicap improving but recent SG declining)
2. **Tell you what to do** — SG-proportional practice plan with specific drills and success criteria
3. **Show it's working** — practice session scored against the plan, on-course results correlated over time

---

## 3. Data Architecture

Three-layer architecture: **normalizers → store → view.**

The timeline is the data model. The five tabs are views on the same underlying data.

Each data source has a normalizer that takes raw input (manual extraction now, API response later) and returns typed output. The UI imports from the store layer, never from raw data. When we replace manual extraction with an API call, only the normalizer changes — store and view are untouched.

### Source 1: GHIN (Handicap Index)
- API at api.ghin.com (USGA GPA program, approval-based)
- Phase 1: manually extracted, typed constants
- Schema: `{ date: string; handicapIndex: number }`

### Source 2: Arccos (On-Course Performance)
- Public On-Course Data API (launched Q1 2023), SSO consent, $2.25/user/month after first 100
- Phase 1: manually extracted from screenshots, typed constants
- Schema: SG breakdown with sub-categories, scoring breakdown, round metadata

### Source 3: Foresight GCQuad (Practice Sessions)
- `.session` JSON file upload — working normalizer exists in project
- Meters internally — convert to yards for all display (× 1.09361)
- FaceToPath values > 16,000,000 are corrupt sensor readings — filter out
- Future: ambient capture via vision agent reading launch monitor screen

### Phasing
- **Phase 1 (now):** GHIN + Arccos (manual extraction) + Foresight (.session upload)
- **Phase 2:** WHOOP, Garmin R10, Coaching OS lesson data
- **Phase 3:** TrackMan, Clippd import, Apple Health
- Do NOT build Phase 2/3 normalizers until the core practice loop works.

---

## 4. Five Tabs

### Tab 1: Dashboard (default landing)
The "so what" view. One compelling synthesis, not a data wall.

**Hero card:** Dark gradient, editorial voice (Playfair italic headline). The cross-source insight: "Your handicap just hit a career low. But your last 20 rounds tell a different story." Body (DM Sans): explains the SG decline, names approach + short game as 87% of the gap, notes practice sessions aren't addressing either.

Below the hero: KPI tile row (current HI, overall SG + delta, last session date, biggest leak), SG waterfall (horizontal bars sorted by magnitude, color intensity reflecting severity), handicap sparkline (compact area chart), CTA to Practice Brief.

### Tab 2: Scoring X-Ray
The analytics showcase. Visualization quality earns trust here.

Four expandable category cards (Driving, Approach, Short Game, Putting). Each: header with SG + delta badge, expandable to sub-breakdowns.

Approach expanded: distance range grid (4 tiles) + terrain grid (4 tiles) + GIR miss pattern + Insight Card connecting "worst from 150-200yd AND from the rough" as one story, not two separate facts.

Short game expanded: chip range grids + up-and-down rates vs scratch benchmarks.

Putting expanded: distance range grid + putts/round breakdown + Insight Card highlighting elite 0-10ft.

Scoring breakdown grid. Cross-source Insight Cards below categories (GHIN vs Arccos divergence, practice vs on-course gap).

### Tab 3: Practice Brief (THE CORE PRODUCT)
AI-generated practice plan from SG data. What nobody else builds.

SG-proportional time allocation. Each category gets 2-3 drills with measurable success criteria. Drills follow motor learning science: random > blocked, external focus > internal, variable targets > fixed. Plan parameterized by session duration and available facilities.

**Be opinionated.** Don't list 10 options. Tell the player what to do. Decade's "analysis paralysis" problem (documented in GolfWRX) happens when players get data without direction.

Coach override badge when connected to Looper Coach. Expandable "why this plan" section.

### Tab 4: Practice Review
Post-session scorecard vs the Practice Brief.

Plan adherence (side-by-side "what you practiced" vs "recommended"). Dispersion scatter (carry × offline, color-coded by proximity). Club-by-club summary. Session-over-session trend.

Dark-mode coach preview panel (CD.* tokens) showing the pre-lesson brief the coach would see.

### Tab 5: My Journey
Unified timeline. Proof that practice → improvement.

Three-layer time axis: Rounds/Handicap + Practice Sessions + Lessons. Milestone markers. Thread lines connecting practice focus to on-course outcomes.

MVP: handicap trend + event markers + milestones.

---

## 5. Competitive Positioning

### What we are
- The best analytics visualization in golf AND the practice loop that turns insights into action
- A coaching OS extension giving coaches visibility into between-lesson behavior
- An opinionated practice planning engine

### What we are NOT
- NOT rebuilding on-course shot tracking (Arccos's territory)
- NOT a drill library for browsing (Break X Golf's model)
- NOT a course management system (Decade's territory)

### Pricing context
Subscription fatigue is real. Golfers stack Arccos ($200/yr) + Decade ($200-250/yr). Two models to test:
- Freemium: free dashboard, $9.99/mo for Practice Brief + Review
- Free for coached players: academy subscription covers it (retention tool for Coaching OS)

---

## 6. Voice

Speak like a smart caddie who watches every round and every practice session.

- **Precise, not academic.** "You lose 2.2 strokes on approach shots"
- **Opinionated, not neutral.** "Skip driver today"
- **Honest, not harsh.** "Short game practice: zero for the 3rd consecutive session"
- **Connected, not siloed.** Always reference cross-source insights
- **Story, not report.** "This one distance range costs you nearly a full stroke per round"

---

## 7. Coach Connection

Design every feature with: "What does the coach see on the other side?"

**Player → Coaching OS:** Practice Brief → coach reviews/overrides. Practice session → appears in pre-lesson brief. Adherence score → feeds roster dashboard. SG trends → shows if lesson focus is translating.

**Coaching OS → Player:** Coach-customized brief → replaces AI brief with "Customized by [Coach Name]" badge. Lesson notes → My Journey timeline. Drill assignments → next Practice Brief.

Every coach correction of an AI brief is an RLHF training signal.

---

## 8. Complete Demo Data (Andrew D.)

This is real data, manually extracted. All values are authoritative for building the MVP.

### GHIN Handicap History
```
12/11/25: 6.4, 12/14: 6.2, 12/18: 6.2, 12/22: 6.3, 12/23: 6.0, 12/24: 6.1
12/28: 5.5, 12/29: 5.6, 12/30: 5.6
1/7/26: 4.6, 1/9: 4.6, 1/14: 4.4
2/7: 4.3, 2/11: 3.9, 2/15: 3.8, 2/17: 3.7, 2/20: 3.7
3/4: 3.7, 3/7: 3.7, 3/12: 3.4, 3/14: 3.4, 3/23: 3.4
Career low: 3.4 (3/23/2026)
```

### Arccos — Player Profile
- 3 handicap, 101 rounds, 7,116 shots
- Overall SG: -3.9 (▼1.8 vs prior 20 rounds)

### Arccos — SG Driving (0.0 SG, ▼0.6)
- Avg distance: 268 yards
- Hit fairway: 44% (scratch: 51%)
- Missed left: 25% (-0.2 SG)
- Missed right: 31% (-0.5 SG)
- Distance: +0.6 SG
- Accuracy: -0.1 SG
- Penalties: -0.6 SG

### Arccos — SG Approach (-2.2 SG, ▼1.1)
- GIR: 51% (scratch: 56%)
- Avg proximity on GIR: 24ft (scratch: 26ft)

By distance:
- 50-100 yards: -0.3 SG (3.3 shots/round)
- 100-150 yards: -0.8 SG (6.5 shots/round)
- 150-200 yards: -0.9 SG (6.6 shots/round) ← BIGGEST SINGLE LEAK
- 200+ yards: -0.2 SG (3.9 shots/round)

By terrain:
- Tee (par 3s): -0.6 SG (4.7 shots)
- Fairway: -0.5 SG (7.7 shots)
- Rough: -0.9 SG (6.8 shots) ← WORST TERRAIN
- Sand: -0.2 SG (1.1 shots)

GIR miss pattern:
- Long: 0.6 (3%)
- Left: 2.4 (13%)
- Right: 1.6 (9%)
- Short: 4.3 (24%)

### Arccos — SG Short Game (-1.2 SG, ▼0.6)

0-25 yard chips:
- SG: -0.5
- Missed greens: 6% (scratch: 4%)
- Avg distance to pin: 5 yards (scratch: 4 yards)
- Up & down: 40% (scratch: 57%)

25-50 yard chips:
- SG: -0.5
- Missed greens: 12% (scratch: 11%)
- Avg distance to pin: 7 yards (scratch: 7 yards)
- Up & down: 23% (scratch: 35%)

0-25 yard sand: -0.2 SG
25-50 yard sand: 0.0 SG

### Arccos — SG Putting (-0.4 SG, ▲0.6 — improving)

By first putt distance:
- 0-10 feet: +0.6 SG, 18.9 putts/round (ELITE)
- 10-25 feet: -0.5 SG, 9.2 putts/round
- 25-50 feet: -0.4 SG, 4.5 putts/round
- 50+ feet: 0.0 SG, 0.5 putts/round

Putts per round:
- Putts/hole: 1.8 (scratch: 1.7)
- Putts/GIR: 1.9 (scratch: 1.9)
- 1-putts: 4.0/round (scratch: 5.2)
- 2-putts: 13.0/round (scratch: 11.5)
- 3-putts: 1.1/round (scratch: 1.3)

### Arccos — Scoring
- Par 3 avg: 3.4 (-0.2 SG/hole)
- Par 4 avg: 4.5 (-0.2 SG/hole)
- Par 5 avg: 5.2 (-0.3 SG/hole)
- Birdies/round: 1.4 (scratch: 2.2)
- Pars/round: 8.9 (scratch: 10.5)
- Bogeys/round: 6.2 (scratch: 4.6)
- Double+/round: 1.4 (scratch: 0.7)

### Foresight Session — Mar 23, 2026
- 88 shots, 2h45m, GCQuad, "Improve" session type, right-handed

Club groups (all values converted to yards):

**Wedge/Short Iron (shots 1-9):** 9 shots, ~127yd avg carry, 4.2yd avg offline, best 1.6yd to pin

**Mid Iron ~155yd target (shots 10-29):** 20 shots, ~172yd avg carry, 9.8yd avg offline, 35% >15yd offline, best 3.9yd to pin. Horizontal path ranges 0° to +5° — face-to-path inconsistency.

**Short-Mid Iron ~130yd target (shots 30-43):** 14 shots, ~131yd avg carry, 7.6yd avg offline, best 1.6yd to pin

**Hybrid (shots 45-56):** 12 shots, ~176yd avg carry, 11.4yd avg offline, best 3.6yd to pin

**Driver (shots 57-88):** 33 shots, ~271yd avg carry, 20.1yd avg offline, best 1.0yd to pin. Club speed 48.7-51.2 mph, ball speed 67.4-74.7 mph.

Practice allocation: 49% approach irons, 37% driver, 14% hybrid, 0% short game, 0% putting

### Mid-Iron Dispersion Data (shot-level, for scatter plot)
```
carry_yd, offline_yd
174, 7.3
171, -7.0
170, 4.0
172, -2.9
162, -2.1
174, -1.1
172, 2.9
180, -13.8
170, 20.8
176, 2.4
176, -6.9
181, -11.4
181, -11.2
180, -26.6
170, 19.0
173, 7.7
159, 14.0
179, -6.2
173, 1.6
184, -43.2
```

### Practice Brief (SG-Proportional for Andrew D.)

For a 2-hour session:

**Approach 150-200yd (35% / 42 min) — SG: -0.9**
01. Random target: vary 150, 160, 170, 180yd targets — never same yardage twice
02. Fairway vs rough: alternate lies to simulate course conditions
03. Pressure set: 5 shots, count how many finish within 30ft of pin

**Short Game 25-50yd (25% / 30 min) — SG: -0.5**
01. Landing spot drill: pick spot halfway to pin, land 10 balls on it
02. Up-and-down challenge: chip and putt, track % saves out of 10
03. Trajectory variation: high soft vs bump-and-run to same target

**Short Game 0-25yd (20% / 24 min) — SG: -0.5**
01. Circle drill: chips must stop inside 6ft circle around pin (10 shots)
02. One-club challenge: pitch with only 56° to build touch
03. Greenside bunker: 10 shots, track sand save %

**Putting 10-25ft (15% / 18 min) — SG: -0.5**
01. Lag putting: 10 putts from 20ft, all must stop within 3ft
02. Gate drill: two tees 1 ball-width apart at 4ft, roll 10 through
03. Speed calibration: putt to fringe from 15ft, no backstop

**Driver (5% / 6 min) — SG: 0.0**
01. Maintenance only: 5-10 balls to stay in rhythm

---

## 9. Responsive Design

Desktop-first (960px max-width), responsive to tablet (768px) and phone (480px). NOT mobile-first. The Journey timeline needs room at desktop. Practice Brief and Practice Review are the most-used on mobile (quick reference at the range).

---

## 10. Build Sequence

1. Data types and normalizers (schema → normalizers → typed data files)
2. Shared components (KPITile, Badge, InsightCard, SectionLabel, ExpandableCard, AllocationBar)
3. Tab shell with 5-tab navigation at `/player` route
4. **Practice Brief — this IS the product, spend the most time here**
5. Dashboard (the trust-earning first impression)
6. Scoring X-Ray (the analytics showcase)
7. Practice Review (session scorecard + dispersion + coach preview)
8. My Journey (simplified timeline MVP)
