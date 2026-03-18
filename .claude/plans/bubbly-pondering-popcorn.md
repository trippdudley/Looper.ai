# Sizzle Reel Restructure — Tell the Full Story

## Context

The sizzle reel at `/vision` currently opens with a single 24s Scene 1 that mixes market stats, an academy quote, three problem headlines, and a brand reveal — then jumps straight into product UI. The narrative page (`/narrative`) tells a much richer story: thesis, problem, solution pillars, endgame/flywheel, and the "every great golfer has had a looper" close. The goal is to pull the strongest narrative beats into the sizzle reel opening so it tells the full Looper.AI story before showing Day 1 product value.

**Design lens:** YC sizzle reel producer — fast, punchy, build tension, then pay it off with product.

---

## New Scene Architecture (~96s total, ~93s with crossfade overlap)

| # | Scene | Duration | Mode | Content |
|---|-------|----------|------|---------|
| 0 | **Thesis** | 8s | Dark | Hook + contrarian claim |
| 1 | **Problem** | 14s | Dark | Quote + NO RECORD/BRIDGE/PROOF + structural insight |
| 2 | **Solution + Endgame** | 10s | Dark | Brand reveal + flywheel + moat thesis |
| 3 | **Player Record** | 16s | Light | Existing Scene 2, compressed 4s |
| 4 | **Live Session** | 28s | Light | Existing Scene 3, compressed 4s |
| 5 | **Summary** | 14s | Light | Existing Scene 4, compressed 2s |
| 6 | **Close** | 6s | Dark | "Every great golfer" + wordmark |

---

## Scene 0: Thesis (8s) — NEW FILE `Scene0_Thesis.tsx`

Dark mode, grid background, centered text. Two beats:

| Beat | Time | Copy | Style |
|------|------|------|-------|
| 0a | 600ms (3.5s hold) | "AI will transform how golf is taught, how players learn, and how equipment is fitted." | F.serif italic, 24px, CD.ink |
| 0b | 4100ms (3.5s hold) | "But not the way the industry is approaching it." | F.serif italic, 26px, CD.accent |

Both use `fadeInOut`. Beat 0a fades out as 0b arrives.

---

## Scene 1: Problem (14s) — REWRITE `Scene1_Problem.tsx`

Dark mode, grid background. Five beats, faster pacing than current (no sub-descriptions on problem headlines):

| Beat | Time | Copy | Style |
|------|------|------|-------|
| 1a | 400ms (3s) | "I have a scheduling website, launch monitor software, 3D software, video software, emails, texts, an academy website... it would be better if these were all integrated." | F.serif italic, 22px, maxWidth 640 |
| 1a-attr | 1800ms | "-- PGA TEACHING PROFESSIONAL, 22 YEARS" | F.data 10px, CD.muted |
| 1b | 3800ms (1.5s) | "NO RECORD" | F.brand 36px bold, left-aligned |
| 1c | 5300ms (1.5s) | "NO BRIDGE" | F.brand 36px bold, stacks below |
| 1d | 6800ms (1.5s) | "NO PROOF" | F.brand 36px bold, stacks below |
| 1e | 10200ms (3.5s) | "No one is building the structured data layer that connects coaching decisions to fitting decisions to on-course outcomes over time." | F.serif italic, 20px, CD.ink |

Problems 1b-1d appear sequentially and stack vertically (like current scene), but **headline-only** — no sub-text. Faster rhythm. All three fade out together at ~8500ms before the insight line.

---

## Scene 2: Solution + Endgame (10s) — NEW FILE `Scene2_SolutionEndgame.tsx`

Dark mode, grid background. Three beats:

| Beat | Time | Copy | Style |
|------|------|------|-------|
| 2a | 400ms (3s) | LOOPER.AI wordmark + "Expertise, engineered." + "THE COACHING OS FOR THE AGE OF AI" | Same as current Scene1 Beat 4b styling |
| 2b | 3800ms (3s) | Flywheel chain: Sessions captured -> Structured data -> Models trained -> Better insights -> More adoption | F.data 10px, horizontal chain, nodes light up sequentially every 400ms using `vis()` |
| 2c | 7200ms (2.5s) | "The wedge is workflow. The moat is data." | F.serif italic, 22px, accent left-border callout |

Flywheel is simple: five inline text labels with arrow separators. Each node highlights in CD.accent sequentially. No SVG, no circles — just text chain.

---

## Scene 3: Player Record (16s) — COMPRESS existing `Scene2_PlayerRecord.tsx`

Timing adjustments only:
- `titleFadeOut`: 3200 -> 2400 (shorter title hold)
- `uiReveal`: 4000 -> 3200
- Spotlights: 6500/10500/14500 -> 5500/8500/11500 (3s each instead of 4s)
- `spotsOff`: 18000 -> 14800

Duration: 20000 -> 16000

---

## Scene 4: Live Session (28s) — COMPRESS existing `Scene3_LiveSession.tsx`

Timing adjustments only:
- `editorialOut`: 3000 -> 2200
- `uiReveal`: 3500 -> 2800
- Shift subsequent triggers ~2s earlier proportionally
- `zoomOut`: 21000 -> 19000
- `fadeToNext`: 28000 -> 24000

Duration: 32000 -> 28000

---

## Scene 5: Summary (14s) — COMPRESS existing `Scene4_Summary.tsx`

Timing adjustments:
- `spot1`: 7000 -> 6000
- `spot1Off`: 10500 -> 9000
- `spot2`: 11000 -> 9500
- `spot2Off`: 14500 -> 12500

Duration: 16000 -> 14000

---

## Scene 6: Close (6s) — REWRITE `Scene5_Close.tsx`

Dark mode, grid background. Two beats:

| Beat | Time | Copy | Style |
|------|------|------|-------|
| 6a | 400ms (3s) | "Every great golfer has had a looper." + line break + "Someone who knows your game, remembers what happened last time, and helps you make better decisions." | F.serif italic, 22px + 16px span |
| 6b | 3800ms (hold) | LOOPER.AI wordmark + "Expertise, engineered." + "looper.ai" | Same as current Scene5 styling |

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/sizzle/Scene0_Thesis.tsx` | **Create** — new 8s thesis scene |
| `src/components/sizzle/Scene1_Problem.tsx` | **Rewrite** — restructured 14s problem scene |
| `src/components/sizzle/Scene2_SolutionEndgame.tsx` | **Create** — new 10s solution/endgame scene |
| `src/components/sizzle/Scene2_PlayerRecord.tsx` | **Edit** — compress timing constants only |
| `src/components/sizzle/Scene3_LiveSession.tsx` | **Edit** — compress timing constants only |
| `src/components/sizzle/Scene4_Summary.tsx` | **Edit** — compress timing constants only |
| `src/components/sizzle/Scene5_Close.tsx` | **Rewrite** — add "every great golfer" + wordmark |
| `src/pages/SizzleReel.tsx` | **Edit** — update SCENES array (7 scenes, new imports, new durations) |

Reuse: All scenes use existing `tokens.ts` utilities (`CD`, `F`, `vis`, `fadeIn`, `fadeInOut`). No new dependencies.

---

## Implementation Order

1. Create `Scene0_Thesis.tsx` (simplest new scene, 2 beats)
2. Create `Scene2_SolutionEndgame.tsx` (wordmark + flywheel + moat line)
3. Rewrite `Scene1_Problem.tsx` (restructure beats, remove content that moved to Scene 0/2/6)
4. Rewrite `Scene5_Close.tsx` (add "every great golfer" from current Scene 1)
5. Compress timing in `Scene2_PlayerRecord.tsx`, `Scene3_LiveSession.tsx`, `Scene4_Summary.tsx`
6. Update `SizzleReel.tsx` SCENES array with all 7 scenes and new durations
7. Build + verify

---

## Verification

1. `vite build` passes with zero errors
2. Navigate to `/vision` — reel auto-plays through all 7 scenes
3. Scene 0: Thesis text appears and fades correctly (two beats)
4. Scene 1: Academy quote -> three problem headlines stack without sub-text -> insight line
5. Scene 2: Wordmark reveals -> flywheel nodes light up left-to-right -> moat callout
6. Scenes 3-5: Product demo plays correctly with compressed timing (no content cut, just faster transitions)
7. Scene 6: "Every great golfer" line -> wordmark close
8. Progress bar tracks total duration accurately across all 7 scenes
9. Escape key and X button still navigate home
10. No console errors
