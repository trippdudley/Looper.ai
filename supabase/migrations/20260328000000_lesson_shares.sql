-- ============================================================
-- Migration: lesson_shares table
-- Tracks QR share instances, claim status, view counts.
-- Decoupled from coaching_sessions.share_token so a coach
-- can reshare or track per-share analytics independently.
-- ============================================================

CREATE TABLE lesson_shares (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_session_id   UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE NOT NULL,
  coach_id              UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,

  -- The token that encodes into the QR URL: looper.ai/lesson/{share_token}
  share_token           TEXT UNIQUE NOT NULL,

  -- Optional pre-fill: coach may know the student's contact before sharing
  student_name          TEXT,
  student_email         TEXT,
  student_phone         TEXT,

  -- Claim tracking
  claimed               BOOLEAN DEFAULT false NOT NULL,
  claimed_at            TIMESTAMPTZ,
  claimed_player_id     UUID REFERENCES players(id) ON DELETE SET NULL,

  -- Analytics
  view_count            INTEGER DEFAULT 0 NOT NULL,
  last_viewed_at        TIMESTAMPTZ,

  -- Expiry — 90 days default
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'),

  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_lesson_shares_token ON lesson_shares(share_token);
CREATE INDEX idx_lesson_shares_session ON lesson_shares(coaching_session_id);
CREATE INDEX idx_lesson_shares_coach ON lesson_shares(coach_id);
CREATE INDEX idx_lesson_shares_claimed_email ON lesson_shares(student_email) WHERE student_email IS NOT NULL;

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE lesson_shares ENABLE ROW LEVEL SECURITY;

-- Coaches can create and manage their own shares
CREATE POLICY "lesson_shares: coach full access" ON lesson_shares
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_id = auth.uid())
  );

-- Players can read shares where they are the claimed owner
CREATE POLICY "lesson_shares: player reads own claimed" ON lesson_shares
  FOR SELECT
  USING (
    claimed_player_id IS NOT NULL AND
    EXISTS (SELECT 1 FROM players WHERE id = claimed_player_id AND auth_id = auth.uid())
  );

-- Public: anyone can read a share by token (for the QR landing page)
-- This allows the Edge Function / web page to look up the share without auth.
-- We restrict to non-expired shares only.
CREATE POLICY "lesson_shares: public read by token" ON lesson_shares
  FOR SELECT
  USING (expires_at > now());

-- ─── Function: increment view count ──────────────────────────────────────────
-- Called by the Edge Function when the QR page is loaded.

CREATE OR REPLACE FUNCTION public.increment_share_view(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE lesson_shares
  SET
    view_count    = view_count + 1,
    last_viewed_at = now()
  WHERE share_token = p_token
    AND expires_at > now();
END;
$$;
