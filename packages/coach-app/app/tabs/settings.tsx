import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsRow({ label, value, onPress, danger }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { coach, session } = useAuth();

  async function handleSignOut(): Promise<void> {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Settings</Text>

      <Section title="Profile">
        <SettingsRow label="Name" value={coach?.name ?? '—'} />
        <SettingsRow label="Email" value={session?.user.email ?? '—'} />
        <SettingsRow label="Academy" value={coach?.academy ?? 'Not set'} />
      </Section>

      <Section title="Recording">
        <SettingsRow label="Transcription" value="Deepgram Nova-2" />
        <SettingsRow label="Speaker diarization" value="Enabled" />
        <SettingsRow label="Swing detection" value="Enabled" />
      </Section>

      <Section title="Integrations">
        <SettingsRow
          label="Supabase project"
          value={process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured'}
        />
        <SettingsRow
          label="Transcription"
          value="Deepgram Nova-2 (via Edge Function)"
        />
      </Section>

      <Section title="Account">
        <SettingsRow label="Sign Out" onPress={handleSignOut} danger />
      </Section>

      <Text style={styles.version}>Looper Coach · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 60, gap: 8 },
  screenTitle: {
    fontFamily: 'DMSans',
    fontSize: 28,
    fontWeight: '700',
    color: '#E8ECF1',
    marginBottom: 24,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: '#151D28',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3A4A',
  },
  rowLabel: {
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#E8ECF1',
  },
  rowLabelDanger: { color: '#C93B3B' },
  rowValue: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
  },
  version: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#5E6E7E',
    textAlign: 'center',
    marginTop: 16,
  },
});
