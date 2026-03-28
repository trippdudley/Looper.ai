/**
 * Full-screen QR share screen for a coaching session.
 *
 * Coach arrives here after saving a lesson and tapping "Share".
 * The screen:
 *   1. Generates a share_token and creates a lesson_shares row
 *   2. Displays a full-screen QR code encoding looper.ai/lesson/{token}
 *   3. Offers "Send via text / email" fallback (native share sheet)
 *   4. Optionally pre-fill student contact so the share row is indexed
 *
 * Design: dark mode, centered, max one interaction per viewport.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-qr-code';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://looper.ai';

export default function ShareScreen() {
  const { id: sessionId, playerName } = useLocalSearchParams<{
    id: string;
    playerName?: string;
  }>();
  const router = useRouter();
  const { coach } = useAuth();

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);

  // Optional contact pre-fill
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    if (sessionId && coach?.id) {
      initShare(sessionId, coach.id);
    }
  }, [sessionId, coach?.id]);

  const initShare = useCallback(async (sessId: string, coachId: string): Promise<void> => {
    // Generate a cryptographically secure token
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

    // Write to lesson_shares
    const { error } = await supabase.from('lesson_shares').insert({
      coaching_session_id: sessId,
      coach_id: coachId,
      share_token: token,
      student_name: playerName ?? null,
    });

    if (error) {
      // Token collision is astronomically unlikely but handle gracefully
      Alert.alert('Share failed', error.message);
      setGenerating(false);
      return;
    }

    // Also stamp coaching_sessions.share_token for legacy/direct lookups
    await supabase
      .from('coaching_sessions')
      .update({ share_token: token })
      .eq('id', sessId);

    const url = `${WEB_BASE_URL}/lesson/${token}`;
    setShareToken(token);
    setShareUrl(url);
    setGenerating(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [playerName]);

  async function handleSendViaShareSheet(): Promise<void> {
    if (!shareUrl) return;
    try {
      await Share.share({
        message: `Your lesson summary from today — ${shareUrl}`,
        url: shareUrl,
        title: 'Lesson Summary',
      });
    } catch (err) {
      Alert.alert('Share failed', err instanceof Error ? err.message : 'Try again');
    }
  }

  async function handleSaveContact(): Promise<void> {
    if (!contact.trim() || !shareToken) return;
    setSavingContact(true);

    const update = contactType === 'email'
      ? { student_email: contact.trim() }
      : { student_phone: contact.trim() };

    await supabase
      .from('lesson_shares')
      .update(update)
      .eq('share_token', shareToken);

    setSavingContact(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setContact('');
    Alert.alert('Saved', `${contactType === 'email' ? 'Email' : 'Phone'} saved to this share.`);
  }

  if (generating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#10B981" size="large" />
        <Text style={styles.loadingText}>Generating share link...</Text>
      </View>
    );
  }

  if (!shareUrl || !shareToken) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Could not generate share link</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Share Lesson</Text>
          {playerName ? (
            <Text style={styles.subtitle}>{playerName} · Scan to view summary</Text>
          ) : (
            <Text style={styles.subtitle}>Player scans to view lesson summary</Text>
          )}
        </View>

        {/* QR Code */}
        <View style={styles.qrBlock}>
          <View style={styles.qrFrame}>
            <QRCode
              value={shareUrl}
              size={240}
              bgColor="#151D28"
              fgColor="#E8ECF1"
            />
          </View>
          <Text style={styles.urlLabel}>{shareUrl}</Text>
        </View>

        {/* Primary CTA: native share sheet */}
        <TouchableOpacity
          style={styles.shareSheetBtn}
          onPress={handleSendViaShareSheet}
          activeOpacity={0.8}
        >
          <Text style={styles.shareSheetBtnText}>Send via Text or Email</Text>
        </TouchableOpacity>

        <Text style={styles.orLabel}>or player scans QR above</Text>

        {/* Optional contact pre-fill */}
        <View style={styles.contactSection}>
          <Text style={styles.contactSectionTitle}>Save Student Contact</Text>
          <Text style={styles.contactSectionSubtitle}>
            Helps auto-match when they sign up for Looper Player
          </Text>

          {/* Toggle email / phone */}
          <View style={styles.contactTypeRow}>
            <TouchableOpacity
              style={[styles.contactTypeChip, contactType === 'email' && styles.contactTypeChipActive]}
              onPress={() => setContactType('email')}
            >
              <Text style={[styles.contactTypeChipText, contactType === 'email' && styles.contactTypeChipTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactTypeChip, contactType === 'phone' && styles.contactTypeChipActive]}
              onPress={() => setContactType('phone')}
            >
              <Text style={[styles.contactTypeChipText, contactType === 'phone' && styles.contactTypeChipTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInputRow}>
            <TextInput
              style={styles.contactInput}
              value={contact}
              onChangeText={setContact}
              placeholder={contactType === 'email' ? "student@email.com" : "+1 (555) 000-0000"}
              placeholderTextColor="#5E6E7E"
              keyboardType={contactType === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSaveContact}
            />
            <TouchableOpacity
              style={[styles.contactSaveBtn, (!contact.trim() || savingContact) && styles.contactSaveBtnDisabled]}
              onPress={handleSaveContact}
              disabled={!contact.trim() || savingContact}
            >
              <Text style={styles.contactSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Looper Player download CTA */}
        <View style={styles.playerCtaCard}>
          <Text style={styles.playerCtaTitle}>Looper Player</Text>
          <Text style={styles.playerCtaBody}>
            Your student can view this lesson, track improvement, and receive practice plans in the Looper Player app.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0C1117' },
  container: { flex: 1, backgroundColor: '#0C1117' },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    gap: 24,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0C1117',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontFamily: 'DMSans',
    fontSize: 15,
    color: '#8B99A8',
  },
  errorText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    color: '#C93B3B',
    textAlign: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 56,
    alignItems: 'flex-end',
  },
  closeBtn: { paddingVertical: 8 },
  closeBtnText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  titleBlock: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  title: {
    fontFamily: 'DMSans',
    fontSize: 28,
    fontWeight: '700',
    color: '#E8ECF1',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#8B99A8',
    textAlign: 'center',
  },
  qrBlock: {
    alignItems: 'center',
    gap: 16,
  },
  qrFrame: {
    backgroundColor: '#151D28',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#2A3A4A',
  },
  urlLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#5E6E7E',
    textAlign: 'center',
  },
  shareSheetBtn: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareSheetBtnText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    fontWeight: '700',
    color: '#0C1117',
  },
  orLabel: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#5E6E7E',
  },
  contactSection: {
    width: '100%',
    gap: 12,
  },
  contactSectionTitle: {
    fontFamily: 'DMSans',
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6E7E',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  contactSectionSubtitle: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#5E6E7E',
    lineHeight: 18,
  },
  contactTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactTypeChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    backgroundColor: '#151D28',
  },
  contactTypeChipActive: {
    borderColor: '#10B981',
    backgroundColor: '#0FA87A22',
  },
  contactTypeChipText: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
  },
  contactTypeChipTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  contactInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactInput: {
    flex: 1,
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
  contactSaveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactSaveBtnDisabled: { backgroundColor: '#2A3A4A' },
  contactSaveBtnText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '700',
    color: '#0C1117',
  },
  playerCtaCard: {
    width: '100%',
    backgroundColor: '#151D28',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3A4A',
    gap: 8,
  },
  playerCtaTitle: {
    fontFamily: 'DMSans',
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  playerCtaBody: {
    fontFamily: 'DMSans',
    fontSize: 13,
    color: '#8B99A8',
    lineHeight: 19,
  },
});
