-- ============================================================
-- Migration: add audio_file_path to coaching_sessions
-- Stores the Supabase Storage path for the lesson recording.
-- Path format: lesson-audio/{coach_id}/{date}-{session_id}.m4a
-- ============================================================

ALTER TABLE coaching_sessions
  ADD COLUMN IF NOT EXISTS audio_file_path TEXT;

COMMENT ON COLUMN coaching_sessions.audio_file_path IS
  'Storage path in lesson-audio bucket. Format: {coach_id}/{date}-{session_id}.m4a';
