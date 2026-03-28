-- ============================================================
-- Migration: Supabase Storage buckets
-- ============================================================

-- Raw practice session files (TrackMan CSV, Foresight .session, Arccos exports)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'session-files',
  'session-files',
  false,
  52428800,  -- 50MB
  ARRAY['text/csv', 'application/json', 'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Lesson audio recordings (M4A from coach app)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-audio',
  'lesson-audio',
  false,
  524288000,  -- 500MB (~1hr at 128kbps)
  ARRAY['audio/m4a', 'audio/mpeg', 'audio/webm', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: players can upload/read their own session files
CREATE POLICY "session-files: player own" ON storage.objects
  FOR ALL USING (
    bucket_id = 'session-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Coaches can upload lesson audio (stored under coach_id/session_id/)
CREATE POLICY "lesson-audio: coach own" ON storage.objects
  FOR ALL USING (
    bucket_id = 'lesson-audio'
    AND EXISTS (
      SELECT 1 FROM coaches WHERE auth_id = auth.uid()
        AND id::text = (storage.foldername(name))[1]
    )
  );
