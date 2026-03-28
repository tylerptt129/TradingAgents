import React, { useMemo } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { ProgressRing } from '../../src/components/ProgressRing';
import { COLORS, GRADIENTS, SP, FS, RADIUS, CARD_SHADOW_SM } from '../../src/constants/theme';
import {
  calculateStreak,
  getCompletionCount,
  isHabitCompleted,
  formatDate,
  getCompletionRateForPeriod,
  getTodayStr,
} from '../../src/utils/helpers';
import { format, subDays } from 'date-fns';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, completions, deleteHabit, archiveHabit, toggleCompletion } = useApp();
  const router = useRouter();

  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Habit not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const colors = GRADIENTS[habit.gradient] || GRADIENTS.violet;
  const today = getTodayStr();
  const streak = useMemo(() => calculateStreak(habit, completions), [habit, completions]);
  const completed = isHabitCompleted(habit.id, today, completions, habit.targetPerDay);
  const todayCount = getCompletionCount(habit.id, today, completions);

  // Last 7 days data
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayLabel = format(subDays(new Date(), i), 'EEE');
      const done = isHabitCompleted(habit.id, date, completions, habit.targetPerDay);
      const count = getCompletionCount(habit.id, date, completions);
      days.push({ date, dayLabel, done, count });
    }
    return days;
  }, [habit, completions]);

  // Total completions for this habit
  const totalCompletions = useMemo(
    () => completions.filter((c) => c.habitId === habit.id).reduce((sum, c) => sum + c.count, 0),
    [completions, habit.id],
  );

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(habit.id);
          router.back();
        },
      },
    ]);
  };

  const handleArchive = () => {
    Alert.alert('Archive Habit', `"${habit.name}" will be hidden but data preserved.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        onPress: async () => {
          await archiveHabit(habit.id);
          router.back();
        },
      },
    ]);
  };

  const frequencyLabel = {
    daily: 'Every day',
    weekdays: 'Weekdays',
    weekends: 'Weekends',
    custom: 'Custom days',
  }[habit.frequency];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Hero section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[colors[0] + '20', 'transparent']}
            style={styles.heroBg}
          />
          <View style={[styles.heroIcon, { backgroundColor: colors[0] + '20' }]}>
            <Text style={{ fontSize: 40 }}>{habit.icon}</Text>
          </View>
          <Text style={styles.heroName}>{habit.name}</Text>
          <Text style={styles.heroMeta}>{frequencyLabel} · {habit.timeOfDay}</Text>

          {/* Big toggle button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleCompletion(habit.id)}
            style={styles.bigToggle}
          >
            {completed ? (
              <LinearGradient colors={colors} style={styles.bigToggleInner}>
                <Text style={styles.bigToggleCheck}>✓</Text>
                <Text style={styles.bigToggleLabel}>Done!</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.bigToggleInner, styles.bigToggleEmpty]}>
                {habit.targetPerDay > 1 ? (
                  <>
                    <Text style={[styles.bigToggleCount, { color: colors[0] }]}>{todayCount}/{habit.targetPerDay}</Text>
                    <Text style={styles.bigToggleLabel}>Tap to log</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.bigTogglePlus}>+</Text>
                    <Text style={styles.bigToggleLabel}>Mark complete</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Streak cards */}
        <View style={styles.streakRow}>
          <View style={[styles.streakCard, CARD_SHADOW_SM]}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={[styles.streakValue, { color: colors[0] }]}>{streak.current}</Text>
            <Text style={styles.streakLabel}>Current</Text>
          </View>
          <View style={[styles.streakCard, CARD_SHADOW_SM]}>
            <Text style={styles.streakIcon}>🏆</Text>
            <Text style={[styles.streakValue, { color: colors[0] }]}>{streak.longest}</Text>
            <Text style={styles.streakLabel}>Best</Text>
          </View>
          <View style={[styles.streakCard, CARD_SHADOW_SM]}>
            <Text style={styles.streakIcon}>✅</Text>
            <Text style={[styles.streakValue, { color: colors[0] }]}>{totalCompletions}</Text>
            <Text style={styles.streakLabel}>Total</Text>
          </View>
        </View>

        {/* Last 7 days */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.weekRow}>
            {last7Days.map((day, i) => (
              <View key={i} style={styles.dayCol}>
                <View
                  style={[
                    styles.dayDot,
                    day.done
                      ? { backgroundColor: colors[0] }
                      : { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border },
                  ]}
                >
                  {day.done && <Text style={styles.dayDotCheck}>✓</Text>}
                </View>
                <Text style={styles.dayLabel}>{day.dayLabel}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Created" value={formatDate(habit.createdAt.split('T')[0])} />
            <InfoRow label="Frequency" value={frequencyLabel} />
            <InfoRow label="Best Time" value={habit.timeOfDay.charAt(0).toUpperCase() + habit.timeOfDay.slice(1)} />
            {habit.targetPerDay > 1 && <InfoRow label="Target/Day" value={`${habit.targetPerDay} times`} />}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleArchive}>
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleDelete}>
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={[styles.actionText, styles.dangerText]}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: COLORS.textSecondary, fontSize: FS.body },
  backLink: { color: COLORS.primary, fontSize: FS.body, marginTop: SP.md },
  header: {
    paddingHorizontal: SP.lg,
    paddingTop: SP.md,
  },
  backBtn: { paddingVertical: SP.sm },
  backText: { color: COLORS.primary, fontSize: FS.body, fontWeight: '600' },
  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: SP.xl,
    paddingHorizontal: SP.lg,
    overflow: 'hidden',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SP.md,
  },
  heroName: {
    color: COLORS.text,
    fontSize: FS.title1,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroMeta: {
    color: COLORS.textMuted,
    fontSize: FS.small,
    marginTop: SP.xs,
    textTransform: 'capitalize',
  },
  bigToggle: { marginTop: SP.lg },
  bigToggleInner: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigToggleEmpty: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  bigToggleCheck: { color: '#fff', fontSize: 36, fontWeight: '800' },
  bigTogglePlus: { color: COLORS.textSecondary, fontSize: 36, fontWeight: '300' },
  bigToggleCount: { fontSize: FS.title2, fontWeight: '800' },
  bigToggleLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FS.caption, marginTop: 2, fontWeight: '600' },
  // Streaks
  streakRow: {
    flexDirection: 'row',
    gap: SP.sm,
    paddingHorizontal: SP.lg,
    marginBottom: SP.lg,
  },
  streakCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  streakIcon: { fontSize: 20, marginBottom: SP.xs },
  streakValue: { fontSize: FS.title2, fontWeight: '800' },
  streakLabel: { color: COLORS.textMuted, fontSize: FS.caption, marginTop: 2, fontWeight: '600' },
  // Week
  section: {
    paddingHorizontal: SP.lg,
    marginBottom: SP.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FS.title3,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: SP.md,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dayCol: { alignItems: 'center' },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SP.xs,
  },
  dayDotCheck: { color: '#fff', fontSize: 16, fontWeight: '800' },
  dayLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600' },
  // Info
  infoCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SP.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SP.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: { color: COLORS.textSecondary, fontSize: FS.body },
  infoValue: { color: COLORS.text, fontSize: FS.body, fontWeight: '600' },
  // Actions
  actions: {
    flexDirection: 'row',
    gap: SP.sm,
    paddingHorizontal: SP.lg,
    marginTop: SP.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SP.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  actionBtnDanger: { borderColor: 'rgba(248,113,113,0.2)' },
  actionIcon: { fontSize: 16, marginRight: SP.sm },
  actionText: { color: COLORS.text, fontSize: FS.body, fontWeight: '600' },
  dangerText: { color: COLORS.error },
});
