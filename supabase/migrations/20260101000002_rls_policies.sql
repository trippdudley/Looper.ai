-- ============================================================
-- Migration: Row-Level Security policies
-- All tables default to no access. Policies grant minimum needed.
-- ============================================================

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

-- ─── Players ──────────────────────────────────────────────────────────────────

-- Players can read/update their own row
CREATE POLICY "players: own row" ON players
  FOR ALL USING (auth.uid() = auth_id);

-- Coaches can read players they are connected to
CREATE POLICY "players: coach reads connected" ON players
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coaching_connections cc
      JOIN coaches c ON c.id = cc.coach_id
      WHERE cc.player_id = players.id
        AND c.auth_id = auth.uid()
        AND cc.status = 'active'
    )
  );

-- ─── Rounds ───────────────────────────────────────────────────────────────────

-- Players can CRUD their own rounds
CREATE POLICY "rounds: own data" ON rounds
  FOR ALL USING (
    EXISTS (SELECT 1 FROM players WHERE id = rounds.player_id AND auth_id = auth.uid())
  );

-- Coaches can read rounds for connected players
CREATE POLICY "rounds: coach reads connected" ON rounds
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coaching_connections cc
      JOIN coaches c ON c.id = cc.coach_id
      WHERE cc.player_id = rounds.player_id
        AND c.auth_id = auth.uid()
        AND cc.status = 'active'
    )
  );

-- ─── Practice Sessions ────────────────────────────────────────────────────────

CREATE POLICY "practice_sessions: own data" ON practice_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM players WHERE id = practice_sessions.player_id AND auth_id = auth.uid())
  );

CREATE POLICY "practice_sessions: coach reads connected" ON practice_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coaching_connections cc
      JOIN coaches c ON c.id = cc.coach_id
      WHERE cc.player_id = practice_sessions.player_id
        AND c.auth_id = auth.uid()
        AND cc.status = 'active'
    )
  );

-- ─── Shots ────────────────────────────────────────────────────────────────────

CREATE POLICY "shots: own data" ON shots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM players WHERE id = shots.player_id AND auth_id = auth.uid())
  );

CREATE POLICY "shots: coach reads connected" ON shots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coaching_connections cc
      JOIN coaches c ON c.id = cc.coach_id
      WHERE cc.player_id = shots.player_id
        AND c.auth_id = auth.uid()
        AND cc.status = 'active'
    )
  );

-- ─── Coaches ──────────────────────────────────────────────────────────────────

-- Coaches can read/update their own row
CREATE POLICY "coaches: own row" ON coaches
  FOR ALL USING (auth.uid() = auth_id);

-- Players can read coach profiles they are connected to (for display)
CREATE POLICY "coaches: player reads connected" ON coaches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coaching_connections cc
      JOIN players p ON p.id = cc.player_id
      WHERE cc.coach_id = coaches.id
        AND p.auth_id = auth.uid()
        AND cc.status = 'active'
    )
  );

-- ─── Coaching Connections ─────────────────────────────────────────────────────

-- Players and coaches can read their own connections
CREATE POLICY "coaching_connections: own" ON coaching_connections
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE id = player_id AND auth_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_id = auth.uid())
  );

-- Coaches can create connections (invitation workflow)
CREATE POLICY "coaching_connections: coach creates" ON coaching_connections
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_id = auth.uid())
  );

-- ─── Coaching Sessions ────────────────────────────────────────────────────────

-- Coaches can CRUD their own sessions
CREATE POLICY "coaching_sessions: coach full access" ON coaching_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE id = coach_id AND auth_id = auth.uid())
  );

-- Players can read sessions where they are the subject
CREATE POLICY "coaching_sessions: player reads own" ON coaching_sessions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM players WHERE id = player_id AND auth_id = auth.uid())
  );

-- Public read for shared sessions (QR share flow)
-- Anyone with the share_token can read the session (no auth required)
CREATE POLICY "coaching_sessions: public share read" ON coaching_sessions
  FOR SELECT
  USING (share_token IS NOT NULL);
