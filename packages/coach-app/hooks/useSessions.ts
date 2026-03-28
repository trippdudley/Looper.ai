import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { SessionListItem } from '@looper/shared';

interface UseSessionsReturn {
  sessions: SessionListItem[];
  todaySessions: SessionListItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSessions(coachId: string | null): UseSessionsReturn {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    if (!coachId) return;
    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from('coaching_sessions')
      .select(`
        id,
        player_id,
        date,
        type,
        status,
        focus,
        duration_min,
        players!inner(name)
      `)
      .eq('coach_id', coachId)
      .order('date', { ascending: false })
      .limit(50);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    const items: SessionListItem[] = (data ?? []).map((row) => {
      const playersRaw = row.players as { name: string } | { name: string }[] | null;
      const players = Array.isArray(playersRaw) ? (playersRaw[0] ?? null) : playersRaw;
      return {
        id: row.id,
        player_id: row.player_id,
        player_name: players?.name ?? 'Unknown',
        date: row.date,
        type: row.type as SessionListItem['type'],
        status: row.status as SessionListItem['status'],
        focus: row.focus,
        duration_min: row.duration_min,
      };
    });

    setSessions(items);
    setLoading(false);
  }, [coachId]);

  useEffect(() => {
    load();
  }, [load]);

  const todaySessions = sessions.filter((s) => s.date === today);

  return {
    sessions,
    todaySessions,
    loading,
    error,
    refresh: load,
  };
}
