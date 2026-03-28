import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/context/AppContext';
import { ProgressRing } from '../../src/components/ProgressRing';
import { HeatMap } from '../../src/components/HeatMap';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW_SM } from '../../src/constants/theme';
import {
  getHeatMapData,
  getCompletionRateForPeriod,
  calculateStreak,
} from '../../src/utils/helpers';
import { FREE_HABIT_LIMIT } from '../../src/constants/premium';

export default function StatsScreen() {
  const { habits, completions, profile } = useApp();

  const heatMapData = useMemo(
    () => getHeatMapData(49, habits, completions),
    [habits, completions],
  );

  const weeklyRate = useMemo(
    () => getCompletionRateForPeriod(7, habits, completions),
    [habits, completions],
  );

  const monthlyRate = useMemo(
    () => getCompletionRateForPeriod(30, habits, completions),
    [habits, completions],
  );

  const topStreaks = useMemo(() => {
    return habits
      .filter((h) => !h.archived)
      .map((h) => ({
        habit: h,
        streak: calculateStreak(h, completions),
      }))
      .sort((a, b) => b.streak.current - a.streak.current)
      .slice(0, 5);
  }, [habits, completions]);

  const activeHabits = habits.filter((h) => !h.archived);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Your habit journey at a glance</Text>

        {/* Stat cards row */}
        <View style={styles.statRow}>
          <StatCard
            label="Total Done"
            value={`${profile.totalCompletions}`}
            icon="✅"
            gradient={GRADIENTS.violet}
          />
          <StatCard
            label="Perfect Days"
            value={`${profile.totalPerfectDays}`}
            icon="🌈"
            gradient={GRADIENTS.mint}
          />
        </View>
        <View style={styles.statRow}>
          <StatCard
            label="Best Streak"
            value={`${profile.longestStreak}d`}
            icon="🔥"
            gradient={GRADIENTS.coral}
          />
          <StatCard
            label="Days Active"
            value={`${profile.daysActive}`}
            icon="📅"
            gradient={GRADIENTS.sky}
          />
        </View>

        {/* Completion Rates */}
        <View style={styles.rateSection}>
          <Text style={styles.sectionTitle}>Completion Rate</Text>
          <View style={styles.rateRow}>
            <View style={styles.rateCard}>
              <ProgressRing
                progress={weeklyRate}
                size={100}
                strokeWidth={8}
                gradientColors={GRADIENTS.sky}
                label={`${Math.round(weeklyRate * 100)}%`}
              />
              <Text style={styles.rateLabel}>7 Days</Text>
            </View>
            <View style={styles.rateCard}>
              <ProgressRing
                progress={monthlyRate}
                size={100}
                strokeWidth={8}
                gradientColors={GRADIENTS.violet}
                label={`${Math.round(monthlyRate * 100)}%`}
              />
              <Text style={styles.rateLabel}>30 Days</Text>
            </View>
          </View>
        </View>

        {/* Heat Map */}
        {!profile.isPremium ? (
          <View style={[styles.section, styles.lockedSection]}>
            <Text style={styles.sectionTitle}>Activity Heat Map</Text>
            <View style={styles.lockedOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockText}>Premium Feature</Text>
              <Text style={styles.lockSubtext}>Unlock detailed heat maps with Premium</Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last 7 Weeks</Text>
            <View style={styles.heatMapCard}>
              <HeatMap data={heatMapData} />
            </View>
          </View>
        )}

        {/* Top Streaks */}
        {topStreaks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Streaks</Text>
            {topStreaks.map(({ habit, streak }) => (
              <View key={habit.id} style={styles.streakRow}>
                <View style={styles.streakLeft}>
                  <Text style={styles.streakIcon}>{habit.icon}</Text>
                  <Text style={styles.streakName} numberOfLines={1}>{habit.name}</Text>
                </View>
                <View style={styles.streakRight}>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakFireIcon}>🔥</Text>
                    <Text style={styles.streakCurrent}>{streak.current}</Text>
                  </View>
                  <Text style={styles.streakBest}>Best: {streak.longest}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Add habits to see your stats!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, gradient }: { label: string; value: string; icon: string; gradient: [string, string] }) {
  return (
    <View style={[styles.statCard, CARD_SHADOW_SM]}>
      <LinearGradient
        colors={[gradient[0] + '15', 'transparent']}
        style={styles.statCardGradient}
      />
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: gradient[0] }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingBottom: 100, paddingHorizontal: SP.lg },
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
    marginBottom: SP.lg,
  },
  statRow: {
    flexDirection: 'row',
    gap: SP.sm,
    marginBottom: SP.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  statCardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.lg,
  },
  statIcon: { fontSize: 20, marginBottom: SP.sm },
  statValue: { fontSize: FS.title2, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { color: COLORS.textSecondary, fontSize: FS.caption, marginTop: 2, fontWeight: '500' },
  rateSection: { marginTop: SP.lg },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: SP.md,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rateCard: { alignItems: 'center' },
  rateLabel: {
    color: COLORS.textSecondary,
    fontSize: FS.small,
    fontWeight: '600',
    marginTop: SP.sm,
  },
  section: { marginTop: SP.xl },
  lockedSection: {},
  heatMapCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  lockedOverlay: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  lockIcon: { fontSize: 32, marginBottom: SP.sm },
  lockText: { color: COLORS.text, fontSize: FS.headline, fontWeight: '700' },
  lockSubtext: { color: COLORS.textSecondary, fontSize: FS.small, marginTop: SP.xs },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SP.md,
    marginBottom: SP.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  streakIcon: { fontSize: 20, marginRight: SP.sm },
  streakName: { color: COLORS.text, fontSize: FS.body, fontWeight: '600', flex: 1 },
  streakRight: { alignItems: 'flex-end' },
  streakBadge: { flexDirection: 'row', alignItems: 'center' },
  streakFireIcon: { fontSize: 14, marginRight: 2 },
  streakCurrent: { color: COLORS.accent, fontSize: FS.headline, fontWeight: '800' },
  streakBest: { color: COLORS.textMuted, fontSize: FS.caption, marginTop: 1 },
  emptyState: { alignItems: 'center', paddingVertical: SP.xxxl },
  emptyIcon: { fontSize: 48, marginBottom: SP.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FS.body },
});
