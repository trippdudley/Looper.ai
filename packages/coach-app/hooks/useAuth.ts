import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import type { Database } from '@/services/supabase';

type CoachRow = Database['public']['Tables']['coaches']['Row'];

interface AuthState {
  session: Session | null;
  coach: CoachRow | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [coach, setCoach] = useState<CoachRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadCoachProfile(session.user.id);
      else setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) loadCoachProfile(session.user.id);
        else {
          setCoach(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadCoachProfile(authId: string): Promise<void> {
    const { data } = await supabase
      .from('coaches')
      .select('*')
      .eq('auth_id', authId)
      .single();

    setCoach(data ?? null);
    setLoading(false);
  }

  return { session, coach, loading };
}
