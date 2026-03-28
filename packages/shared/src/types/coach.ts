export interface Coach {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  academy: string | null;
  bio: string | null;
  certifications: string[];
  timezone: string;
  created_at: string;
}

export interface CoachingConnection {
  id: string;
  player_id: string;
  coach_id: string;
  status: 'active' | 'paused' | 'ended';
  connected_at: string;
}
