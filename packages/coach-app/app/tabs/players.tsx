import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { formatHandicap } from '@looper/shared';

interface PlayerRow {
  id: string;
  name: string;
  handicap_index: number | null;
  home_club: string | null;
  connected_sources: string[];
}

export default function PlayersScreen() {
  const { coach } = useAuth();
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [filtered, setFiltered] = useState<PlayerRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, [coach?.id]);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      q ? players.filter((p) => p.name.toLowerCase().includes(q)) : players
    );
  }, [query, players]);

  async function loadPlayers(): Promise<void> {
    if (!coach?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('players')
      .select('id, name, handicap_index, home_club, connected_sources')
      .order('name');
    setPlayers(data ?? []);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.count}>{players.length}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search players..."
          placeholderTextColor="#5E6E7E"
          clearButtonMode="while-editing"
        />
      </View>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlayers} tintColor="#10B981" />
        }
      >
        {filtered.length === 0 && !loading && (
          <Text style={styles.emptyText}>
            {query ? 'No players match your search' : 'No players connected yet'}
          </Text>
        )}
        {filtered.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={styles.playerCard}
            onPress={() => router.push(`/session/new?playerId=${player.id}&playerName=${encodeURIComponent(player.name)}`)}
            activeOpacity={0.8}
          >
            <View style={styles.playerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                {player.home_club && (
                  <Text style={styles.playerClub}>{player.home_club}</Text>
                )}
              </View>
            </View>
            <View style={styles.playerRight}>
              <Text style={styles.handicapValue}>
                {formatHandicap(player.handicap_index)}
              </Text>
              <Text style={styles.handicapLabel}>HCP</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  title: {
    fontFamily: 'DMSans',
    fontSize: 28,
    fontWeight: '700',
    color: '#E8ECF1',
  },
  count: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5E6E7E',
    marginTop: 4,
  },
  searchRow: { paddingHorizontal: 20, marginBottom: 8 },
  searchInput: {
    backgroundColor: '#151D28',
    borderWidth: 1,
    borderColor: '#2A3A4A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#E8ECF1',
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 8 },
  emptyText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#5E6E7E',
    textAlign: 'center',
    marginTop: 40,
  },
  playerCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3A4A',
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E2A36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '700',
    color: '#8B99A8',
  },
  playerInfo: { flex: 1, gap: 3 },
  playerName: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '600',
    color: '#E8ECF1',
  },
  playerClub: {
    fontFamily: 'DMSans',
    fontSize: 12,
    color: '#8B99A8',
  },
  playerRight: { alignItems: 'flex-end', gap: 2 },
  handicapValue: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#E8ECF1',
    fontWeight: '700',
  },
  handicapLabel: {
    fontFamily: 'DMSans',
    fontSize: 10,
    color: '#5E6E7E',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
