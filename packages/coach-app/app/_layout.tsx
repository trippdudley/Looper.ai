import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Prevent splash from auto-hiding until auth + fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    DMSans: require('@/assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('@/assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('@/assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('@/assets/fonts/DMSans-Bold.ttf'),
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceMono-Bold': require('@/assets/fonts/SpaceMono-Bold.ttf'),
  });

  useEffect(() => {
    if (loading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }

    SplashScreen.hideAsync();
  }, [session, loading, fontsLoaded, segments, router]);

  if (loading || !fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0C1117' }}>
        <StatusBar style="light" backgroundColor="#0C1117" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0C1117' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="session/[id]"
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
          <Stack.Screen
            name="session/new"
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
