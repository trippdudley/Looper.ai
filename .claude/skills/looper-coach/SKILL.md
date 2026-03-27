---
description: "Looper.AI Coach App — the coaching operating system for teaching professionals. Use this skill whenever building coach app screens, lesson capture, voice recording, video clips, AI lesson summaries, post-lesson review, QR share flow, student roster, pre-lesson briefs, coach onboarding, academy setup, or any feature a golf coach interacts with. Also trigger for coaching_sessions schema, RLHF training data, intervention ontology, coaching_connection lifecycle, or multi-tenant academy architecture. If the output touches what a COACH sees (not a player), this skill applies. Even if the user doesn't say 'coach app' — if they're talking about lesson recording, student profiles, drill prescriptions, coaching cues, session summaries, or academy management, this skill is relevant."
---

# Looper Coach App

## What This Is
Native iOS/iPad app for golf teaching professionals. Captures lessons (voice + video clips), generates AI-powered session summaries, manages student roster, and delivers structured coaching intelligence. Built with Expo/React Native, same stack as the Player app.

## Architecture
Part of the `looper-player` monorepo:
- `apps/coach/` — Coach iOS/iPad app
- `apps/player/` — Player iOS app
- `packages/shared/` — @looper/shared types, tokens, utils
- `supabase/` — shared migrations + Edge Functions

Both apps share the same Supabase project (kcapvaiwykcfdbywyktr), same auth, same RLS.

## Coach App Structure
```
apps/coach/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard (stats, attention, recent students)
│   │   ├── roster.tsx         # Student list (searchable, with metrics)
│   │   ├── history.tsx        # All sessions chronological
│   │   └── settings.tsx       # Profile, coach code, academy, sign out
│   ├── student/[id].tsx       # Student profile (HCP, SG, lessons, rounds)
│   ├── brief/[id].tsx         # Pre-lesson AI brief
│   ├── lesson/[id].tsx        # Active lesson (timer, clip, recording)
│   ├── review/[id].tsx        # Post-lesson review (editable AI summary)
│   ├── login.tsx              # Email/password auth
│   ├── onboarding.tsx         # Academy join/create, profile, coach code
│   └── _layout.tsx            # Root (fonts, auth, dark theme)
├── components/
│   ├── QRShare.tsx            # Full-screen QR for lesson sharing
│   ├── CoachCode.tsx          # 6-char coach code display
│   └── Skeleton.tsx           # Loading placeholders
├── lib/
│   ├── stores/
│   │   ├── coach.ts           # Auth + coach profile (Zustand)
│   │   ├── roster.ts          # Student list + summaries
│   │   └── lesson.ts          # Active lesson state machine
│   ├── recording/
│   │   ├── audioRecorder.ts   # expo-av M4A at 64kbps
│   │   ├── videoBuffer.ts     # Circular buffer, tap-to-clip
│   │   └── transcriber.ts     # Apple Speech interface (MVP: server-side)
│   ├── upload/
│   │   └── queue.ts           # Background upload with retry
│   ├── supabase.ts            # Client init
│   └── fonts.ts               # Font asset loader
```

## Lesson Capture Flow
1. Coach taps "Start Lesson" on student profile
2. Audio recording starts (expo-av, M4A, 64kbps, background mode)
3. During lesson: coach taps "Clip" to save 10-second video segments
4. Coach taps "End Lesson"
5. Audio uploads to Supabase Storage (transient — deleted after transcription)
6. lesson-summary Edge Function: transcript + player context → Claude Sonnet → structured JSON
7. Post-lesson review: coach edits AI summary (every edit = RLHF training data)
8. Coach approves → saved to coaching_sessions + training_events
9. Optional: QR share → student scans → lesson appears in Player app

## RLHF Training Data
Every coach edit of an AI summary is captured:
- `coaching_sessions.ai_raw_summary` — original AI output
- `coaching_sessions.coach_corrections` — array of {field, action, original, edited, timestamp}
- `training_events` table — anonymized events for model training (no RLS, service role only)

## Edge Functions
- `lesson-summary` — Claude Sonnet, takes transcript + player context, returns structured JSON
- `pre-lesson-brief` — Claude Haiku, generates preparation card from player history

## Key Data Tables (Coach-Specific)
- `academies` — multi-tenant, invite codes, retention config
- `coaching_sessions` — lessons with transcripts, cues, drills, AI summaries, corrections
- `lesson_recordings` — audio metadata (file in Storage)
- `lesson_clips` — video clip metadata
- `drills` — structured drill library (builds intervention ontology)
- `training_events` — anonymized RLHF signals

## Three-Layer Data Architecture
1. **Operational** — Supabase Postgres + Storage, serves the apps, RLS enforced
2. **Academy Analytics** — Postgres views filtered by academy_id (lesson_stats, student_outcomes)
3. **Training Warehouse** — training_events table, no RLS, service role only, Looper corporate

## Audio Storage Policy
Audio is TRANSIENT — uploaded, transcribed, deleted within 7 days. Transcripts kept forever (~10KB/lesson). This is the single biggest cost control. Video clips retained for 180 days (configurable per academy).

## Demo Data
- **Moe Norman** = canonical coach demo (Session 9, 8 prior sessions)
- **M. Thompson** = demo coach
- **Evergreen Golf Club** = demo academy (21 TrackMan bays, Bellevue/Kirkland WA)
