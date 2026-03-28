export interface Player {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  handicap_index: number | null;
  career_low: number | null;
  home_club: string | null;
  goal: string | null;
  archetype: string | null;
  strengths: Array<{ text: string; context: string; confidence: number }> | null;
  weaknesses: Array<{ text: string; context: string; confidence: number }> | null;
  notification_prefs: Record<string, boolean> | null;
  connected_sources: string[];
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlayerSummary {
  id: string;
  name: string;
  email: string;
  handicap_index: number | null;
  home_club: string | null;
  connected_sources: string[];
}
