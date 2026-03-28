# AI Processing Pipeline

## Edge Functions

### lesson-summary (Claude Sonnet)
**When:** After lesson ends, during processing phase
**Cost:** ~$0.02-0.05 per lesson

**System prompt includes:**
- Player profile (name, handicap, goal, career low)
- Last 5 session summaries with this coach
- Last 10 rounds with SG breakdown
- Session number (nth lesson with this student)

**Input:**
```json
{
  "session_id": "uuid",
  "player_id": "uuid",
  "coach_id": "uuid",
  "audio_path": "coach_id/session_id/audio.m4a",
  "duration_minutes": 52,
  "clips_count": 4
}
```

**Output:**
```json
{
  "coaching_cues": ["Direct quotes from the coach"],
  "key_observations": ["What changed, with data"],
  "drills": [{"name": "...", "category": "external_focus", "reps": "...", "focus": "...", "success_criteria": "..."}],
  "practice_plan": {"sessions_per_week": 3, "focus": "...", "drills_to_practice": ["..."]},
  "carry_forward": ["Items for next pre-lesson brief"],
  "flags": ["Concerns from the data"],
  "summary_text": "One paragraph summary",
  "focus": "One-line focus",
  "transcript": "Full transcript text"
}
```

### pre-lesson-brief (Claude Haiku)
**When:** Coach taps "Prepare for Lesson" on student profile
**Cost:** ~$0.002 per brief (12x cheaper than Sonnet)

**Output:**
```json
{
  "last_session_recap": "1-2 sentence summary",
  "practice_compliance": "What the student practiced",
  "data_flags": ["SG trends, missing practice, etc"],
  "recommendation": "What to focus on today",
  "key_numbers": {"handicap": "12.1", "sessions": "8", "last_round": "79"}
}
```

## RLHF Training Data Model

### Correction pairs (per lesson)
Stored in `coaching_sessions.coach_corrections` as JSONB array:
```json
[
  {"field": "coaching_cues", "action": "deleted", "original": "Rotate hips", "timestamp": "..."},
  {"field": "coaching_cues", "action": "added", "value": "Keep trail arm soft", "timestamp": "..."},
  {"field": "key_observations", "action": "edited", "original": "...", "edited": "...", "timestamp": "..."}
]
```

### Training events (anonymized)
Written to `training_events` table on lesson approval:
- `event_type`: lesson_completed, coach_correction, drill_prescribed, drill_outcome
- `player_handicap_range`: bucketed (0-5, 5-10, 10-15, 15-20, 20+)
- `coach_experience_tier`: by lesson count (junior, mid, senior)
- `payload`: the structured signal (no PII)

### The intervention ontology (builds over time)
Every drill prescription + outcome pair feeds the ontology:
- What drill category was prescribed
- For what target skill
- At what handicap range
- What was the SG change after N sessions
- This is the competitive moat — nobody else captures what the coach DID
