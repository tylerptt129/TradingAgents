import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW_SM } from '../../src/constants/theme';
import { PREMIUM_CONFIG } from '../../src/constants/premium';
import { formatDate } from '../../src/utils/helpers';
import { resetAllData } from '../../src/storage';

export default function ProfileScreen() {
  const { profile, habits, refreshData, updateProfile } = useApp();
  const router = useRouter();

  const activeHabits = habits.filter((h) => !h.archived).length;
  const archivedHabits = habits.filter((h) => h.archived).length;

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your habits, completions, and badges. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            await refreshData();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar card */}
        <View style={[styles.avatarCard, CARD_SHADOW_SM]}>
          <LinearGradient
            colors={GRADIENTS.violet}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {(profile.name || 'S').charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.avatarInfo}>
            <Text style={styles.name}>{profile.name || 'Stride User'}</Text>
            <Text style={styles.joinDate}>
              Member since {profile.joinDate ? formatDate(profile.joinDate.split('T')[0]) : 'today'}
            </Text>
          </View>
          {profile.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Quick stats */}
        <View style={styles.statsGrid}>
          <MiniStat label="Active" value={`${activeHabits}`} icon="📋" />
          <MiniStat label="Archived" value={`${archivedHabits}`} icon="📦" />
          <MiniStat label="Badges" value={`${profile.unlockedBadgeIds.length}`} icon="🏅" />
          <MiniStat label="Streak" value={`${profile.currentGlobalStreak}d`} icon="🔥" />
        </View>

        {/* Premium CTA */}
        {!profile.isPremium && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/premium')}
          >
            <LinearGradient
              colors={GRADIENTS.violet}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumCta}
            >
              <View>
                <Text style={styles.premiumCtaTitle}>Unlock Premium</Text>
                <Text style={styles.premiumCtaSubtitle}>
                  Unlimited habits, heat maps & more — {PREMIUM_CONFIG.price}
                </Text>
              </View>
              <Text style={styles.premiumCtaArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Settings section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <SettingsRow
            label="Edit Name"
            icon="✏️"
            onPress={() => {
              Alert.prompt?.(
                'Your Name',
                'Enter your display name',
                (text: string) => {
                  if (text?.trim()) updateProfile({ name: text.trim() });
                },
                'plain-text',
                profile.name,
              ) ?? Alert.alert('Edit Name', 'This feature requires iOS.');
            }}
          />

          {profile.isPremium ? (
            <SettingsRow label="Premium Active" icon="✨" onPress={() => {}} />
          ) : (
            <SettingsRow
              label="Restore Purchases"
              icon="🔄"
              onPress={() => Alert.alert('Restored', 'No previous purchases found.')}
            />
          )}

          <SettingsRow
            label="Reset All Data"
            icon="⚠️"
            onPress={handleReset}
            destructive
          />
        </View>

        <Text style={styles.version}>Stride v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatIcon}>{icon}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ label, icon, onPress, destructive }: { label: string; icon: string; onPress: () => void; destructive?: boolean }) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.settingsIcon}>{icon}</Text>
      <Text style={[styles.settingsLabel, destructive && styles.destructiveText]}>{label}</Text>
      <Text style={styles.settingsArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingHorizontal: SP.lg, paddingBottom: 100 },
  title: {
    color: COLORS.text,
    fontSize: FS.largeTitle,
    fontWeight: '800',
    letterSpacing: -1,
    paddingTop: SP.lg,
    marginBottom: SP.lg,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: FS.title2, fontWeight: '800' },
  avatarInfo: { marginLeft: SP.md, flex: 1 },
  name: { color: COLORS.text, fontSize: FS.headline, fontWeight: '700' },
  joinDate: { color: COLORS.textMuted, fontSize: FS.small, marginTop: 2 },
  premiumBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SP.sm,
    paddingVertical: SP.xs,
    borderRadius: RADIUS.full,
  },
  premiumBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: SP.md,
    gap: SP.sm,
  },
  miniStat: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SP.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  miniStatIcon: { fontSize: 16, marginBottom: SP.xs },
  miniStatValue: { color: COLORS.text, fontSize: FS.headline, fontWeight: '800' },
  miniStatLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '600', marginTop: 1 },
  premiumCta: {
    borderRadius: RADIUS.lg,
    padding: SP.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SP.lg,
  },
  premiumCtaTitle: { color: '#fff', fontSize: FS.headline, fontWeight: '800' },
  premiumCtaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FS.small, marginTop: 2 },
  premiumCtaArrow: { color: '#fff', fontSize: 24, fontWeight: '300' },
  section: { marginTop: SP.xl },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: SP.md,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SP.md,
    marginBottom: SP.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  settingsIcon: { fontSize: 18, marginRight: SP.md },
  settingsLabel: { color: COLORS.text, fontSize: FS.body, fontWeight: '500', flex: 1 },
  destructiveText: { color: COLORS.error },
  settingsArrow: { color: COLORS.textMuted, fontSize: 22, fontWeight: '300' },
  version: {
    color: COLORS.textGhost,
    fontSize: FS.caption,
    textAlign: 'center',
    marginTop: SP.xl,
  },
});
