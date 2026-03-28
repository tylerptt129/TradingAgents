import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { BadgeCard } from '../../src/components/BadgeCard';
import { ALL_BADGES } from '../../src/constants/badges';
import { COLORS, SP, FS, RADIUS } from '../../src/constants/theme';

export default function BadgesScreen() {
  const { profile } = useApp();

  const unlocked = ALL_BADGES.filter((b) => profile.unlockedBadgeIds.includes(b.id));
  const locked = ALL_BADGES.filter((b) => !profile.unlockedBadgeIds.includes(b.id));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          {unlocked.length}/{ALL_BADGES.length} badges earned
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(unlocked.length / ALL_BADGES.length) * 100}%` }]} />
        </View>

        {unlocked.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Unlocked</Text>
            <View style={styles.grid}>
              {unlocked.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked />
              ))}
            </View>
          </>
        )}

        {locked.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SP.lg }]}>Locked</Text>
            <View style={styles.grid}>
              {locked.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked={false} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FS.body,
    marginTop: SP.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginVertical: SP.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: SP.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
