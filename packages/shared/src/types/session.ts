export type SessionType =
  | 'full-swing'
  | 'short-game'
  | 'playing-lesson'
  | 'assessment'
  | 'putting'
  | 'mental';

export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface CoachingSession {
  id: string;
  player_id: string;
  coach_id: string;
  date: string;           // ISO date string
  duration_min: number | null;
  type: SessionType;
  status: SessionStatus;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  drills: Drill[];
  key_changes: KeyChange[];
  practice_plan: PracticePlan | null;
  transcript: string | null;
  transcript_segments: TranscriptSegment[];
  share_token: string | null;  // for QR share
  created_at: string;
  updated_at: string;
}

export interface Drill {
  name: string;
  reps: number | null;
  focus: string;
  success_criteria: string;
  category: DrillCategory;
}

export type DrillCategory = 'external' | 'internal' | 'constraint' | 'physical';

export interface KeyChange {
  metric: string;
  before: string;
  after: string;
  unit: string;
}

export interface PracticePlan {
  duration_min: number;
  focus_areas: string[];
  drills: Drill[];
  notes: string | null;
}

export interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  speaker: 'coach' | 'player' | 'unknown';
  text: string;
  confidence: number;
}

// Lightweight view for list screens
export interface SessionListItem {
  id: string;
  player_id: string;
  player_name: string;
  date: string;
  type: SessionType;
  status: SessionStatus;
  focus: string | null;
  duration_min: number | null;
}
