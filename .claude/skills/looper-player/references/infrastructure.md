# Infrastructure, Scalability & App Store

## Table of Contents
1. [Architecture Diagram](#architecture-diagram)
2. [AI Layer](#ai-layer)
3. [Coaching OS Connection](#coaching-os-connection)
4. [Scalability Plan](#scalability-plan)
5. [Cost Modeling](#cost-modeling)
6. [Services & Tools](#services--tools)
7. [App Store Requirements](#app-store-requirements)
8. [Build Timeline](#build-timeline)
9. [Features at Scale](#features-at-scale)

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│        iOS App (React Native / Expo)    │
│                                         │
│  UI Layer → State (Zustand) → SQLite    │
│  Auth (Supabase + Apple Sign In)        │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│           Backend (Supabase)            │
│                                         │
│  PostgREST API → PostgreSQL (RLS)       │
│  File Storage → Edge Functions          │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│              AI Layer                   │
│                                         │
│  Claude API ← Context Builder ← DB     │
└─────────────────────────────────────────┘
```

---

## AI Layer

In the prototype, the Anthropic API key lives in the browser (`dangerouslyAllowBrowser: true`). For the real app, the key must live server-side:

1. User sends a message in Ask Looper
2. App calls Supabase Edge Function (`/functions/v1/chat`)
3. Edge Function loads user's player record from database
4. Edge Function builds system prompt (same logic as current `chat.ts`, server-side)
5. Edge Function streams Claude response back to app
6. App renders streaming response in real-time

This keeps the API key secure and lets you update the system prompt without shipping a new app version.

---

## Coaching OS Connection

Same Supabase project, different schemas. The Coaching OS web app shares the same PostgreSQL database.

```
┌─────────────────────────────────────────────┐
│              Supabase (PostgreSQL)           │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ players  │  │ sessions │  │  rounds  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │            │         │
│  ┌────┴─────┐   ┌────┴─────┐     │         │
│  │ Player   │   │ Coach    │     │         │
│  │ App      │   │ Portal   │     │         │
│  │ (Expo)   │   │ (React)  │     │         │
│  └──────────┘   └──────────┘     │         │
│                          ┌───────┴──────┐  │
│                          │ Lesson       │  │
│                          │ Sidebar      │  │
│                          └──────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Scalability Plan

| Component | 10 Users | 1K Users | 10K Users | 100K Users |
|-----------|----------|----------|-----------|------------|
| Database | Supabase Free | Supabase Pro | Pro + read replicas | Enterprise or self-hosted |
| Edge Functions | Free tier | Included in Pro | Dedicated compute | Dedicated + queue |
| File Storage | < 1 GB | ~50 GB | ~500 GB | S3 migration |
| AI (Claude) | ~$5/mo | ~$500/mo | ~$5K/mo | Volume pricing |
| Push | Expo free | Expo free | Expo free | EAS ($99/mo) |

### What Breaks First

1. **AI cost (~500 users):** Every Ask Looper message costs ~$0.01-0.05. At 500 users x 10 messages/day = $50-250/day. **Mitigation:** Cache common patterns. Haiku for simple queries, Sonnet for complex. Daily message limit (20/day free, unlimited for subscribers).

2. **Database read load (1K-5K):** Context builder queries multiple tables per AI call. **Mitigation:** Materialize player context as single JSON column, updated on write.

3. **File storage (5K+):** 5K users x 50 sessions = 250K files. **Mitigation:** Process CSVs on upload, archive originals to cheaper storage.

### Pre-Build to Avoid Pain
- Context materialization from day one (cached JSON on player record)
- Source adapters as isolated modules (never in UI layer)
- Database indexes on `player_id + date` from day one
- Rate limiting on Edge Functions from day one

---

## Cost Modeling

### 10 Users (MVP/Beta)
| Service | Cost |
|---------|------|
| Supabase (Free) | $0 |
| Claude API (~100 msg/day) | $3-5/mo |
| Expo EAS Build (Free) | $0 |
| Apple Developer | $99/year |
| Sentry + PostHog (Free) | $0 |
| **Total** | **~$10/mo + $99/yr** |

### 1,000 Users
| Service | Cost |
|---------|------|
| Supabase Pro | $25/mo |
| Claude API (~5K msg/day) | $200-500/mo |
| Expo EAS (Production) | $99/mo |
| Sentry (Team) | $26/mo |
| **Total** | **~$400-700/mo** |

### 10,000 Users
~$3,000-6,000/mo (Claude API is the dominant cost)

### 100,000 Users
~$15,000-25,000/mo. At $9.99/mo subscription = $1M/mo revenue against ~$25K/mo infrastructure.

---

## Services & Tools

| Service | Purpose | MVP Cost |
|---------|---------|----------|
| Supabase | DB, auth, storage, edge functions | Free |
| Expo / EAS | React Native framework, builds | Free |
| Anthropic Claude API | AI intelligence | ~$5/mo |
| Sentry | Crash reporting | Free |
| PostHog | Analytics, feature flags | Free |
| RevenueCat | In-app subscriptions | Free <$2.5K MRR |
| Apple Developer | App Store access | $99/yr |

---

## App Store Requirements

### What You Need
1. Apple Developer Account ($99/year)
2. App Store Connect setup: name "Looper - Golf Intelligence", bundle ID `com.looper.player`, category Sports, privacy policy URL
3. Provisioning: EAS Build handles signing certificates automatically

### TestFlight Process
```
Code complete → `eas build --platform ios` → Binary uploads
 → Add internal testers (up to 100, no Apple review)
 → External testers (up to 10,000, lightweight review 1-2 days)
```

### Common Rejection Risks
- Must provide demo account with pre-loaded data for Apple reviewers
- No "Coming Soon" placeholder screens
- Must use Apple's in-app purchase system (not Stripe)
- Privacy "nutrition label" must be accurate

---

## Build Timeline

| Phase | Duration | Milestone |
|-------|----------|-----------|
| 0: Foundation | Week 1-2 | Empty app on phone via TestFlight |
| 1: Core Experience | Week 2-4 | Dashboard + Ask Looper + Journey working |
| 2: Data Pipeline | Week 4-5 | Real data flowing (Foresight, GHIN) |
| 3: Engagement | Week 5-7 | Feature-complete for beta |
| 4: Beta + App Store | Week 7-10 | App Store live |

---

## Features at Scale

| Scale | Feature | Why It Needs Scale |
|-------|---------|-------------------|
| 1K users | Peer benchmarking | Need statistical sample |
| 1K users | Course intelligence | Need course-level data |
| 10K users | Equipment insights | Need equipment + performance correlation |
| 10K users | Coach marketplace | Need supply and demand |
| 100K users | Predictive handicap | Need longitudinal training data |
| 100K users | Aggregate intelligence | Need volume for statistical significance |
