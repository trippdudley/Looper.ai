-- ============================================================
-- Migration: Coaches and coaching connections
-- ============================================================

-- ─── Coaches ──────────────────────────────────────────────────────────────────

CREATE TABLE coaches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  academy         TEXT,
  bio             TEXT,
  certifications  TEXT[] DEFAULT '{}',
  timezone        TEXT DEFAULT 'America/New_York',

  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_coaches_auth_id ON coaches(auth_id);

-- Auto-create coach row when a new user signs up with role='coach'
CREATE OR REPLACE FUNCTION public.handle_new_coach()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (NEW.raw_user_meta_data ->> 'role') = 'coach' THEN
    INSERT INTO public.coaches (auth_id, name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created_coach
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_coach();

-- ─── Coaching Connections ─────────────────────────────────────────────────────

CREATE TABLE coaching_connections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id     UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  coach_id      UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  connected_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (player_id, coach_id)
);

CREATE INDEX idx_coaching_connections_coach ON coaching_connections(coach_id, status);
CREATE INDEX idx_coaching_connections_player ON coaching_connections(player_id, status);

-- ─── Coaching Sessions ────────────────────────────────────────────────────────

CREATE TABLE coaching_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  coach_id        UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,

  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_min    INTEGER,
  type            TEXT NOT NULL CHECK (type IN ('full-swing', 'short-game', 'playing-lesson', 'assessment', 'putting', 'mental')),
  status          TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  focus           TEXT,
  summary         TEXT,

  -- Structured coaching outputs
  coaching_cues   TEXT[] DEFAULT '{}',
  drills          JSONB DEFAULT '[]',
  key_changes     JSONB DEFAULT '[]',
  practice_plan   JSONB,

  -- Transcript (from Deepgram)
  transcript      TEXT,
  transcript_segments JSONB DEFAULT '[]',

  -- QR share token (short random string for /lesson/:token URL)
  share_token     TEXT UNIQUE,

  -- AI-generated post-session summary
  ai_summary      TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_coaching_sessions_coach ON coaching_sessions(coach_id, date DESC);
CREATE INDEX idx_coaching_sessions_player ON coaching_sessions(player_id, date DESC);
CREATE INDEX idx_coaching_sessions_share_token ON coaching_sessions(share_token) WHERE share_token IS NOT NULL;

CREATE TRIGGER coaching_sessions_updated_at
  BEFORE UPDATE ON coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
