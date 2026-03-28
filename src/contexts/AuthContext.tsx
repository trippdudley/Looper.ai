import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface Player {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  handicap_index: number | null;
  home_club: string | null;
  goal: string | null;
  onboarding_complete: boolean;
}

interface AuthState {
  user: User | null;
  player: Player | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshPlayer: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function fetchPlayer(userId: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('id, auth_id, name, email, handicap_index, home_club, goal, onboarding_complete')
    .eq('auth_id', userId)
    .single();

  if (error || !data) return null;
  return data as Player;
}

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout — never stay loading more than 5s
    const timeout = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const p = await fetchPlayer(session.user.id);
          setPlayer(p);
        } catch {
          // Player fetch failed (e.g. RLS), continue without player data
        }
      }
      setLoading(false);
      clearTimeout(timeout);
    }).catch(() => {
      setLoading(false);
      clearTimeout(timeout);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const p = await fetchPlayer(session.user.id);
            setPlayer(p);
          } catch {
            // Player fetch failed, continue without player data
          }
        } else {
          setPlayer(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error?.message ?? null };
  };

  const refreshPlayer = async (): Promise<void> => {
    if (user) {
      try {
        const p = await fetchPlayer(user.id);
        setPlayer(p);
      } catch {
        // ignore
      }
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setPlayer(null);
  };

  return (
    <AuthContext.Provider value={{ user, player, session, loading, signIn, signUp, signOut, refreshPlayer }}>
      {children}
    </AuthContext.Provider>
  );
}
