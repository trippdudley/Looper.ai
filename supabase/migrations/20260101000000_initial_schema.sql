-- ============================================================
-- Migration: Initial schema
-- Looper.AI — Players, Rounds, Practice Sessions, Shots
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- ─── Players ──────────────────────────────────────────────────────────────────

CREATE TABLE players (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Profile
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  handicap_index    NUMERIC(4,1),
  career_low        NUMERIC(4,1),
  home_club         TEXT,
  goal              TEXT,

  -- Golf DNA (AI-generated)
  archetype         TEXT,
  strengths         JSONB,
  weaknesses        JSONB,

  -- Context materialization (cached player summary for AI context builder)
  cached_context    JSONB,
  context_updated_at TIMESTAMPTZ,

  -- Settings
  notification_prefs  JSONB DEFAULT '{"practice_nudges": true, "weekly_recap": true}'::jsonb,
  connected_sources   TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT false,

  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Auto-create player row when a new user signs up with role='player'
CREATE OR REPLACE FUNCTION public.handle_new_player()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (NEW.raw_user_meta_data ->> 'role') = 'player' OR (NEW.raw_user_meta_data ->> 'role') IS NULL THEN
    INSERT INTO public.players (auth_id, name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email
    )
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_player
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_player();

-- ─── Rounds ───────────────────────────────────────────────────────────────────

CREATE TABLE rounds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  source          TEXT NOT NULL CHECK (source IN ('ghin', 'arccos', 'manual', 'garmin')),

  date            DATE NOT NULL,
  course_name     TEXT NOT NULL,
  tee             TEXT,
  course_rating   NUMERIC(4,1),
  slope           INTEGER,
  score           INTEGER NOT NULL,
  differential    NUMERIC(4,1),
  score_type      TEXT CHECK (score_type IN ('home', 'away', 'tournament', 'penalty', 'combined')),

  -- Hole-by-hole (from Arccos or manual entry)
  holes           JSONB,

  -- Strokes gained (from Arccos)
  sg_total        NUMERIC(4,2),
  sg_off_tee      NUMERIC(4,2),
  sg_approach     NUMERIC(4,2),
  sg_around_green NUMERIC(4,2),
  sg_putting      NUMERIC(4,2),

  -- Fairways / greens summary
  fairways_hit    INTEGER,
  fairways_total  INTEGER,
  gir             INTEGER,

  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── Practice Sessions ────────────────────────────────────────────────────────

CREATE TABLE practice_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  source          TEXT NOT NULL CHECK (source IN ('trackman', 'foresight', 'garmin', 'manual')),

  date            DATE NOT NULL,
  duration_min    INTEGER,
  location        TEXT,
  type            TEXT CHECK (type IN ('range', 'short-game', 'putting', 'playing', 'fitness')),

  -- Summary metrics
  total_shots     INTEGER,
  clubs_used      TEXT[],
  focus_area      TEXT,

  -- AI-generated summary
  ai_summary      TEXT,

  -- Raw file reference (stored in Supabase Storage)
  raw_file_path   TEXT,

  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── Shots ────────────────────────────────────────────────────────────────────

CREATE TABLE shots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID REFERENCES practice_sessions(id) ON DELETE CASCADE NOT NULL,
  player_id         UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,

  shot_number       INTEGER,
  club              TEXT NOT NULL,

  -- Ball data (in yards — Foresight reports meters internally, normalize on import)
  ball_speed        NUMERIC(5,1),
  launch_angle      NUMERIC(4,1),
  spin_rate         INTEGER,
  carry             NUMERIC(5,1),
  total_distance    NUMERIC(5,1),
  offline           NUMERIC(5,1),
  max_height        NUMERIC(5,1),

  -- Club data
  club_speed        NUMERIC(5,1),
  attack_angle      NUMERIC(4,1),
  club_path         NUMERIC(4,1),
  face_angle        NUMERIC(4,1),
  face_to_path      NUMERIC(4,1),
  smash_factor      NUMERIC(3,2),
  dynamic_loft      NUMERIC(4,1),

  -- Classification
  shot_shape        TEXT CHECK (shot_shape IN ('draw', 'fade', 'straight', 'slice', 'hook', 'push', 'pull')),
  quality           TEXT CHECK (quality IN ('good', 'acceptable', 'mishit')),

  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_players_auth_id ON players(auth_id);
CREATE INDEX idx_rounds_player_date ON rounds(player_id, date DESC);
CREATE INDEX idx_rounds_player_source ON rounds(player_id, source);
CREATE INDEX idx_sessions_player_date ON practice_sessions(player_id, date DESC);
CREATE INDEX idx_shots_session ON shots(session_id);
CREATE INDEX idx_shots_player ON shots(player_id);

-- ─── Updated_at triggers ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
