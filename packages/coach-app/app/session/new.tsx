/**
 * New session screen — direct entry point for starting a session for a specific player.
 * Pre-fills the player if a playerId query param is provided.
 * Redirects to the Record tab with the player pre-selected.
 */
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NewSessionScreen() {
  const { playerId, playerName } = useLocalSearchParams<{
    playerId?: string;
    playerName?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    // Navigate to the Record tab with the player pre-filled
    // In a full implementation this would use a store to pass the pre-filled state
    router.replace({
      pathname: '/(tabs)/record',
      params: { playerId, playerName },
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0C1117', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#10B981" />
    </View>
  );
}
