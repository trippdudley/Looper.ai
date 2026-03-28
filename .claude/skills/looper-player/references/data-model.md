# Data Model — SQL Schemas

Complete Supabase/PostgreSQL schema for the Looper Player Portal. All tables use UUID primary keys, reference `players.id` for multi-tenancy, and are protected by Row-Level Security.

## Table of Contents
1. [Players (profile)](#players)
2. [Rounds (scoring data)](#rounds)
3. [Practice Sessions](#practice-sessions)
4. [Shots (launch monitor data)](#shots)
5. [Coaching Connection](#coaching-connection)
6. [Coaching Sessions](#coaching-sessions)

---

## Players

```sql
CREATE TABLE players (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id           UUID REFERENCES auth.users(id) NOT NULL,

  -- Profile
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  handicap_index    NUMERIC(4,1),
  career_low        NUMERIC(4,1),
  home_club         TEXT,
  goal              TEXT,  -- "Break 80", "Single digit", etc.

  -- Golf DNA (AI-generated, refreshed periodically)
  archetype         TEXT,  -- "Power Fade", "Grinding Wedge Player"
  strengths         JSONB, -- [{text, context, confidence}]
  weaknesses        JSONB,

  -- Settings
  notification_prefs  JSONB,
  connected_sources   TEXT[], -- ['ghin', 'foresight', 'arccos']
  onboarding_complete BOOLEAN DEFAULT false,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
```

A trigger on `auth.users` INSERT creates the player row automatically with `name` and `email` from auth metadata. Onboarding fills in the rest.

---

## Rounds

```sql
CREATE TABLE rounds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) NOT NULL,
  source          TEXT NOT NULL, -- 'ghin', 'arccos', 'manual'

  date            DATE NOT NULL,
  course_name     TEXT NOT NULL,
  tee             TEXT,
  course_rating   NUMERIC(4,1),
  slope           INTEGER,
  score           INTEGER NOT NULL,
  differential    NUMERIC(4,1),
  score_type      TEXT, -- 'home', 'away', 'tournament', 'penalty'

  -- Hole-by-hole (if available from Arccos/manual)
  holes           JSONB, -- [{hole, par, score, putts, fir, gir}]

  -- Strokes gained (if available from Arccos)
  sg_total        NUMERIC(4,2),
  sg_off_tee      NUMERIC(4,2),
  sg_approach     NUMERIC(4,2),
  sg_around_green NUMERIC(4,2),
  sg_putting      NUMERIC(4,2),

  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Practice Sessions

```sql
CREATE TABLE practice_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) NOT NULL,
  source          TEXT NOT NULL, -- 'trackman', 'foresight', 'garmin', 'manual'

  date            DATE NOT NULL,
  duration_min    INTEGER,
  location        TEXT,
  type            TEXT, -- 'range', 'short-game', 'putting', 'playing'

  -- Summary metrics
  total_shots     INTEGER,
  clubs_used      TEXT[],
  focus_area      TEXT,

  -- AI-generated summary (populated after import)
  ai_summary      TEXT,

  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Shots

```sql
CREATE TABLE shots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID REFERENCES practice_sessions(id) NOT NULL,
  player_id         UUID REFERENCES players(id) NOT NULL,

  shot_number       INTEGER,
  club              TEXT NOT NULL,

  -- Ball data
  ball_speed        NUMERIC(5,1), -- mph
  launch_angle      NUMERIC(4,1), -- degrees
  spin_rate         INTEGER,      -- rpm
  carry             NUMERIC(5,1), -- yards
  total_distance    NUMERIC(5,1), -- yards
  offline           NUMERIC(5,1), -- yards (+ right, - left)
  max_height        NUMERIC(5,1), -- yards

  -- Club data (if available)
  club_speed        NUMERIC(5,1), -- mph
  attack_angle      NUMERIC(4,1), -- degrees
  club_path         NUMERIC(4,1), -- degrees
  face_angle        NUMERIC(4,1), -- degrees
  face_to_path      NUMERIC(4,1), -- degrees
  smash_factor      NUMERIC(3,2),
  dynamic_loft      NUMERIC(4,1), -- degrees

  -- Classification
  shot_shape        TEXT, -- draw, fade, straight, slice, hook
  quality           TEXT, -- good, acceptable, mishit

  created_at        TIMESTAMPTZ DEFAULT now()
);
```

**Foresight-specific note:** FaceToPath values > 16,000,000 are corrupt sensor readings — filter them out in the normalizer. Foresight reports in meters internally; convert to yards (multiply by 1.09361) for all display.

---

## Coaching Connection

```sql
CREATE TABLE coaching_connections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id     UUID REFERENCES players(id) NOT NULL,
  coach_id      UUID NOT NULL, -- references coaches table
  status        TEXT DEFAULT 'active', -- active, paused, ended
  connected_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## Coaching Sessions

```sql
CREATE TABLE coaching_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) NOT NULL,
  coach_id        UUID NOT NULL,

  date            DATE NOT NULL,
  duration_min    INTEGER,
  type            TEXT, -- full-swing, short-game, playing-lesson, assessment
  focus           TEXT,
  summary         TEXT,

  -- Coach's notes (visible to player)
  coaching_cues   TEXT[],
  drills          JSONB, -- [{name, reps, focus, success_criteria}]

  -- Metrics
  key_changes     JSONB, -- [{metric, before, after, unit}]

  -- Practice plan assigned
  practice_plan   JSONB,

  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Indexes

Create these from day one — they match the primary query patterns:

```sql
CREATE INDEX idx_rounds_player_date ON rounds(player_id, date);
CREATE INDEX idx_sessions_player_date ON practice_sessions(player_id, date);
CREATE INDEX idx_shots_session ON shots(session_id);
CREATE INDEX idx_shots_player ON shots(player_id);
```
