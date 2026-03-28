import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Use SecureStore for auth tokens on native (encrypted keychain), AsyncStorage for everything else
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      coaches: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          academy: string | null;
          bio: string | null;
          certifications: string[];
          timezone: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['coaches']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['coaches']['Insert']>;
      };
      coaching_sessions: {
        Row: {
          id: string;
          player_id: string;
          coach_id: string;
          date: string;
          duration_min: number | null;
          type: string;
          status: string;
          focus: string | null;
          summary: string | null;
          coaching_cues: string[];
          drills: unknown;
          key_changes: unknown;
          practice_plan: unknown;
          transcript: string | null;
          transcript_segments: unknown;
          audio_file_path: string | null;
          share_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['coaching_sessions']['Row'],
          'id' | 'created_at' | 'updated_at' | 'share_token'
        > & { share_token?: string | null; audio_file_path?: string | null };
        Update: Partial<Database['public']['Tables']['coaching_sessions']['Insert']>;
      };
      players: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          handicap_index: number | null;
          home_club: string | null;
          goal: string | null;
          connected_sources: string[];
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      coaching_connections: {
        Row: {
          id: string;
          player_id: string;
          coach_id: string;
          status: string;
          connected_at: string;
        };
      };
      lesson_shares: {
        Row: {
          id: string;
          coaching_session_id: string;
          coach_id: string;
          share_token: string;
          student_name: string | null;
          student_email: string | null;
          student_phone: string | null;
          claimed: boolean;
          claimed_at: string | null;
          claimed_player_id: string | null;
          view_count: number;
          last_viewed_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          coaching_session_id: string;
          coach_id: string;
          share_token: string;
          student_name?: string | null;
          student_email?: string | null;
          student_phone?: string | null;
        };
        Update: Partial<{
          student_name: string | null;
          student_email: string | null;
          student_phone: string | null;
          claimed: boolean;
          claimed_at: string | null;
          claimed_player_id: string | null;
        }>;
      };
    };
  };
};
