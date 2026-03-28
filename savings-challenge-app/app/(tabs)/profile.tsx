import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { StatCard } from '../../src/components/StatCard';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { formatCurrency, formatDate } from '../../src/utils/helpers';
import * as Storage from '../../src/storage';

export default function ProfileScreen() {
  const { profile, updateProfile, refreshData } = useApp();
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/premium');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await Storage.resetAllData();
            await refreshData();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar & Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.joinDate}>
            Member since {formatDate(profile.joinDate)}
          </Text>
          {profile.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="💰"
            label="All-Time Savings"
            value={formatCurrency(profile.totalSavedAllTime)}
            color={COLORS.success}
          />
          <StatCard
            icon="🔥"
            label="Longest Streak"
            value={`${profile.longestStreak}d`}
            color={COLORS.warning}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="🏆"
            label="Challenges Done"
            value={String(profile.challengesCompleted)}
            color={COLORS.primary}
          />
          <StatCard
            icon="🎖️"
            label="Badges"
            value={`${profile.unlockedBadgeIds.length}`}
            color={COLORS.badgeEpic}
          />
        </View>

        {/* Actions */}
        <View style={styles.section}>
          {!profile.isPremium && (
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonIcon}>⚡</Text>
              <View style={styles.upgradeButtonContent}>
                <Text style={styles.upgradeButtonTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeButtonSubtitle}>
                  Unlock unlimited challenges & badges
                </Text>
              </View>
              <Text style={styles.upgradeButtonPrice}>$0.99</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notification Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📤</Text>
            <Text style={styles.menuText}>Export Savings Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Rate SaveQuest</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Send Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleResetData}
          >
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuText, styles.dangerText]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>SaveQuest v1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.hero,
    fontWeight: '700',
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  joinDate: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: COLORS.warning + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  premiumText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  section: {
    marginTop: SPACING.lg,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  upgradeButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  upgradeButtonContent: {
    flex: 1,
  },
  upgradeButtonTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  upgradeButtonSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  upgradeButtonPrice: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  menuText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  dangerItem: {
    borderColor: COLORS.error + '30',
  },
  dangerText: {
    color: COLORS.error,
  },
  version: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
