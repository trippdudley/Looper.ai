-- ============================================================
-- Seed: Development data
-- Run after migrations for local dev with `supabase db seed`
-- ============================================================

-- NOTE: Real user creation happens through auth.users, so we can't seed
-- players/coaches directly here without the auth trigger.
-- Instead, use the seed via Supabase Studio or the management API.

-- To seed a demo coach for local dev:
-- 1. Sign up via the web app as a coach (role='coach' in metadata)
-- 2. Sign up as a player
-- 3. Create the connection via Studio

-- Sample coaching session (linked to actual UUIDs after signup)
-- Uncomment and fill in real IDs:
/*
INSERT INTO coaching_sessions (player_id, coach_id, date, type, status, focus, transcript, coaching_cues, drills)
VALUES (
  'YOUR-PLAYER-UUID',
  'YOUR-COACH-UUID',
  '2026-03-26',
  'full-swing',
  'completed',
  'Driver distance and consistency',
  'Coach: Let''s start with your setup. Player: Sure, what should I focus on?...',
  ARRAY['Keep your head still through impact', 'Lead with the hips'],
  '[{"name": "Hip rotation drill", "reps": 20, "focus": "Initiate downswing with hips", "success_criteria": "Feel the hip lead before arms start", "category": "external"}]'::jsonb
);
*/

-- Moe Norman demo data for Coach Portal web app (legacy, web app uses hardcoded TypeScript)
-- No SQL needed — web app data lives in src/data/
