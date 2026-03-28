import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { ProgressRing } from '../../src/components/ProgressRing';
import { StatCard } from '../../src/components/StatCard';
import { LogSavingsModal } from '../../src/components/LogSavingsModal';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import {
  formatCurrency,
  getProgressPercent,
  getDaysRemaining,
  getDaysElapsed,
  isTodayLogged,
  formatDate,
  getTodayStr,
} from '../../src/utils/helpers';
import { format, subDays, parseISO, addDays } from 'date-fns';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeChallenges, completedChallenges, logSavings, abandonChallenge } = useApp();
  const [showLogModal, setShowLogModal] = useState(false);

  const challenge =
    activeChallenges.find((c) => c.id === id) ||
    completedChallenges.find((c) => c.id === id);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const progress = getProgressPercent(challenge);
  const daysRemaining = getDaysRemaining(challenge.endDate);
  const daysElapsed = getDaysElapsed(challenge.startDate);
  const todayDone = isTodayLogged(challenge);
  const isActive = challenge.status === 'active';

  const handleAbandon = () => {
    Alert.alert(
      'Abandon Challenge?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: async () => {
            await abandonChallenge(challenge.id);
            router.back();
          },
        },
      ],
    );
  };

  // Build calendar grid for last 30 days
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = !!challenge.completedDays[dateStr];
    const isBeforeStart = dateStr < challenge.startDate;
    const isToday = dateStr === getTodayStr();
    return { dateStr, day: format(date, 'd'), isCompleted, isBeforeStart, isToday };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{challenge.icon} {challenge.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <ProgressRing
            progress={progress}
            size={160}
            strokeWidth={14}
            color={challenge.color}
            label={`${Math.round(progress * 100)}%`}
            sublabel="of savings goal"
          />
        </View>

        {/* Amount display */}
        <View style={styles.amountSection}>
          <Text style={styles.savedAmount}>
            {formatCurrency(challenge.totalSaved)}
          </Text>
          <Text style={styles.goalAmount}>
            of {formatCurrency(challenge.totalGoal)} goal
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="📆"
            label="Days Left"
            value={String(daysRemaining)}
            color={COLORS.primary}
          />
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${challenge.currentStreak}d`}
            color={COLORS.warning}
          />
          <StatCard
            icon="⏱️"
            label="Day"
            value={`${daysElapsed}/${challenge.durationDays}`}
            color={COLORS.success}
          />
        </View>

        {/* Log Button */}
        {isActive && (
          <TouchableOpacity
            style={[
              styles.logButton,
              { backgroundColor: todayDone ? COLORS.success + '20' : challenge.color },
            ]}
            onPress={() => !todayDone && setShowLogModal(true)}
            disabled={todayDone}
          >
            <Text
              style={[
                styles.logButtonText,
                todayDone && { color: COLORS.success },
              ]}
            >
              {todayDone ? "Today's Savings Logged" : "+ Log Today's Savings"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 30 Days</Text>
          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => (
              <View
                key={day.dateStr}
                style={[
                  styles.calendarDay,
                  day.isCompleted && { backgroundColor: challenge.color },
                  day.isBeforeStart && styles.calendarDayDisabled,
                  day.isToday && styles.calendarDayToday,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    day.isCompleted && styles.calendarDayTextCompleted,
                    day.isBeforeStart && styles.calendarDayTextDisabled,
                  ]}
                >
                  {day.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Challenge Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Started</Text>
            <Text style={styles.detailValue}>{formatDate(challenge.startDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ends</Text>
            <Text style={styles.detailValue}>{formatDate(challenge.endDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Best Streak</Text>
            <Text style={styles.detailValue}>{challenge.longestStreak} days</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Days Logged</Text>
            <Text style={styles.detailValue}>
              {Object.keys(challenge.completedDays).length} days
            </Text>
          </View>
        </View>

        {/* Abandon */}
        {isActive && (
          <TouchableOpacity style={styles.abandonButton} onPress={handleAbandon}>
            <Text style={styles.abandonText}>Abandon Challenge</Text>
          </TouchableOpacity>
        )}

        {!isActive && (
          <View style={styles.completedBanner}>
            <Text style={styles.completedIcon}>🎉</Text>
            <Text style={styles.completedText}>Challenge Completed!</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Log Modal */}
      <LogSavingsModal
        visible={showLogModal}
        challengeName={challenge.name}
        onSubmit={async (amount) => {
          await logSavings(challenge.id, amount);
          setShowLogModal(false);
        }}
        onClose={() => setShowLogModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  savedAmount: {
    color: COLORS.text,
    fontSize: FONT_SIZE.hero,
    fontWeight: '700',
  },
  goalAmount: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  logButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
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
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarDay: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  calendarDayText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  calendarDayTextCompleted: {
    color: COLORS.text,
    fontWeight: '700',
  },
  calendarDayTextDisabled: {
    color: COLORS.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  abandonButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  abandonText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  completedBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  completedIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  completedText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
    marginTop: 100,
  },
  backLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
