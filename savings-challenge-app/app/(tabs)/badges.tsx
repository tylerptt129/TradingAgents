import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { ALL_BADGES } from '../../src/constants/badges';
import { BadgeCard } from '../../src/components/BadgeCard';
import { COLORS, SPACING, FONT_SIZE } from '../../src/constants/theme';

export default function BadgesScreen() {
  const { profile } = useApp();

  const unlockedCount = profile.unlockedBadgeIds.length;
  const totalCount = ALL_BADGES.length;

  const unlockedBadges = ALL_BADGES.filter((b) =>
    profile.unlockedBadgeIds.includes(b.id),
  );
  const lockedBadges = ALL_BADGES.filter(
    (b) => !profile.unlockedBadgeIds.includes(b.id),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          {unlockedCount} of {totalCount} badges unlocked
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / totalCount) * 100}%` },
            ]}
          />
        </View>

        {/* Unlocked */}
        {unlockedBadges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unlocked</Text>
            <View style={styles.badgeGrid}>
              {unlockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked />
              ))}
            </View>
          </View>
        )}

        {/* Locked */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locked</Text>
          <View style={styles.badgeGrid}>
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} unlocked={false} />
            ))}
          </View>
        </View>

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
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
