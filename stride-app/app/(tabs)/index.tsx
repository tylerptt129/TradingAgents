import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { HabitCard } from '../../src/components/HabitCard';
import { ProgressRing } from '../../src/components/ProgressRing';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW } from '../../src/constants/theme';
import {
  getTodaysHabits,
  isHabitCompleted,
  getCompletionCount,
  getGreeting,
  calculateStreak,
  getTodayStr,
} from '../../src/utils/helpers';

export default function TodayScreen() {
  const { habits, completions, profile, toggleCompletion } = useApp();
  const router = useRouter();
  const today = getTodayStr();

  const todaysHabits = useMemo(() => getTodaysHabits(habits), [habits]);

  const completedCount = useMemo(
    () => todaysHabits.filter((h) => isHabitCompleted(h.id, today, completions, h.targetPerDay)).length,
    [todaysHabits, completions, today],
  );

  const progress = todaysHabits.length > 0 ? completedCount / todaysHabits.length : 0;
  const allDone = todaysHabits.length > 0 && completedCount === todaysHabits.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>
              {todaysHabits.length === 0
                ? 'No habits scheduled today'
                : allDone
                  ? 'All done! Perfect day 🎉'
                  : `${todaysHabits.length - completedCount} habits remaining`}
            </Text>
          </View>
          {profile.currentGlobalStreak > 0 && (
            <View style={styles.globalStreak}>
              <Text style={styles.globalStreakIcon}>🔥</Text>
              <Text style={styles.globalStreakNum}>{profile.currentGlobalStreak}</Text>
              <Text style={styles.globalStreakLabel}>day streak</Text>
            </View>
          )}
        </View>

        {/* Daily Progress Ring */}
        {todaysHabits.length > 0 && (
          <View style={styles.ringSection}>
            <ProgressRing
              progress={progress}
              size={160}
              strokeWidth={12}
              gradientColors={allDone ? ['#34D399', '#6EE7B7'] : ['#7C5CFC', '#B794F6']}
              label={`${Math.round(progress * 100)}%`}
              sublabel={`${completedCount}/${todaysHabits.length}`}
            />
          </View>
        )}

        {/* Motivational banner when all done */}
        {allDone && todaysHabits.length > 0 && (
          <LinearGradient
            colors={['rgba(52,211,153,0.15)', 'rgba(52,211,153,0.05)']}
            style={styles.doneBanner}
          >
            <Text style={styles.doneEmoji}>✨</Text>
            <Text style={styles.doneText}>You crushed it today!</Text>
            <Text style={styles.doneSubtext}>Every perfect day builds your legacy.</Text>
          </LinearGradient>
        )}

        {/* Habit Cards */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <Text style={styles.sectionCount}>{completedCount}/{todaysHabits.length}</Text>
          </View>

          {todaysHabits.map((habit) => {
            const completed = isHabitCompleted(habit.id, today, completions, habit.targetPerDay);
            const count = getCompletionCount(habit.id, today, completions);
            const streak = calculateStreak(habit, completions);

            return (
              <HabitCard
                key={habit.id}
                name={habit.name}
                icon={habit.icon}
                gradient={habit.gradient}
                streak={streak.current}
                completed={completed}
                completionCount={count}
                targetPerDay={habit.targetPerDay}
                onToggle={() => toggleCompletion(habit.id)}
                onPress={() => router.push(`/habit/${habit.id}`)}
              />
            );
          })}

          {todaysHabits.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌟</Text>
              <Text style={styles.emptyTitle}>Start Your Journey</Text>
              <Text style={styles.emptySubtitle}>Add your first habit to begin building a better you.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/habit/add')}
      >
        <LinearGradient
          colors={GRADIENTS.violet}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SP.lg,
    paddingTop: SP.lg,
    paddingBottom: SP.md,
  },
  greeting: {
    color: COLORS.text,
    fontSize: FS.largeTitle,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FS.body,
    marginTop: SP.xs,
  },
  globalStreak: {
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SP.md,
    paddingVertical: SP.sm,
    borderRadius: RADIUS.lg,
  },
  globalStreakIcon: { fontSize: 20 },
  globalStreakNum: { color: COLORS.primary, fontSize: FS.title2, fontWeight: '800' },
  globalStreakLabel: { color: COLORS.primaryLight, fontSize: 9, fontWeight: '600', marginTop: 1 },
  ringSection: {
    alignItems: 'center',
    paddingVertical: SP.lg,
  },
  doneBanner: {
    marginHorizontal: SP.lg,
    borderRadius: RADIUS.lg,
    padding: SP.lg,
    alignItems: 'center',
    marginBottom: SP.md,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
  },
  doneEmoji: { fontSize: 32, marginBottom: SP.sm },
  doneText: { color: COLORS.success, fontSize: FS.headline, fontWeight: '700' },
  doneSubtext: { color: COLORS.textSecondary, fontSize: FS.small, marginTop: SP.xs },
  habitsSection: {
    paddingHorizontal: SP.lg,
    paddingTop: SP.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SP.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontSize: FS.small,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SP.xxxl,
  },
  emptyIcon: { fontSize: 48, marginBottom: SP.md },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FS.body,
    textAlign: 'center',
    marginTop: SP.sm,
    paddingHorizontal: SP.xl,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SP.lg,
    ...CARD_SHADOW,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
});
