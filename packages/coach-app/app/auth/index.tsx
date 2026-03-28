import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { supabase } from '@/services/supabase';

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role: 'coach' } },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.logoText}>Looper</Text>
          <Text style={styles.logoSub}>Coach</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'sign-up' && (
            <View style={styles.field}>
              <Text style={styles.label}>Your name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Coach name"
                placeholderTextColor="#5E6E7E"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="coach@academy.com"
              placeholderTextColor="#5E6E7E"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={mode === 'sign-up' ? 'Min 8 characters' : '••••••••'}
              placeholderTextColor="#5E6E7E"
              secureTextEntry
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0C1117" />
            ) : (
              <Text style={styles.submitBtnText}>
                {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => {
              setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
              setError(null);
            }}
          >
            <Text style={styles.toggleText}>
              {mode === 'sign-in'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1117' },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontFamily: 'DMSans',
    fontSize: 36,
    fontWeight: '700',
    color: '#E8ECF1',
    letterSpacing: -0.5,
  },
  logoSub: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#10B981',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  form: { gap: 16 },
  field: { gap: 6 },
  label: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#151D28',
    borderWidth: 1,
    borderColor: '#2A3A4A',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#E8ECF1',
  },
  errorText: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#C93B3B',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    fontWeight: '700',
    color: '#0C1117',
  },
  toggleBtn: { alignItems: 'center', paddingVertical: 8 },
  toggleText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
  },
});
