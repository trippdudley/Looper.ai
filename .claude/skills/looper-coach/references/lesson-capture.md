# Lesson Capture Pipeline

## Recording Infrastructure

### Audio (expo-av)
- Format: M4A (AAC), 64kbps, mono, 44100Hz
- Background mode enabled (UIBackgroundModes: audio)
- Pause/resume supported
- File size: ~0.5MB per minute at 64kbps
- Location: recorded to app cache, uploaded to `lesson-audio` bucket

### Video (expo-camera + circular buffer)
- Continuous recording to 10-second temp segments
- "Clip" button saves current segment permanently
- Coach can add voice note to clip
- Clips stored in `lesson-video` bucket
- Default: 10-second clips, 1080p, H.264
- Typical lesson: 3-5 clips (~25MB total)

### Transcription (MVP)
- MVP: Server-side via lesson-summary Edge Function
- Apple Speech interface ready but not wired (transcriber.ts)
- Upgrade path: Deepgram Nova-2 for speaker diarization

## Lesson State Machine (lesson.ts)
```
idle → recording → paused → recording → ... → processing → review → completed
  │                                               │
  └──────────────── error ◄───────────────────────┘
```

### State transitions:
- `startLesson(playerId, coachId, type)` — creates coaching_session, starts recording
- `pauseLesson()` / `resumeLesson()` — toggles recording
- `captureClip(tempVideoUri)` — saves clip to buffer
- `stopLesson()` — stops recording, sets phase to processing
- `processLesson()` — uploads audio, calls Edge Function, transitions to review
- `reset()` — cleans up, returns to idle

## Upload Queue (queue.ts)
- AsyncStorage-persisted queue
- 3 retry attempts per item
- Auto-cleanup of completed items after 1 hour
- Deletes local file after successful upload
- Processes pending items sequentially

## Post-Lesson Processing Flow
```
1. Audio file → Supabase Storage (lesson-audio bucket)
2. Create lesson_recordings row (status: processing)
3. POST /functions/v1/lesson-summary
   Input: { session_id, player_id, coach_id, audio_path, duration_minutes, clips_count }
4. Edge Function fetches player context + transcript
5. Calls Claude Sonnet → structured JSON
6. Update coaching_sessions with AI summary
7. Update lesson_recordings (transcript, status: completed)
8. App transitions to review screen
```
