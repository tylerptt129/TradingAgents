import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { ChallengeCard } from '../../src/components/ChallengeCard';
import { StatCard } from '../../src/components/StatCard';
import { ProgressRing } from '../../src/components/ProgressRing';
import { LogSavingsModal } from '../../src/components/LogSavingsModal';
import {
  formatCurrency,
  getProgressPercent,
  isTodayLogged,
  getGreeting,
} from '../../src/utils/helpers';

export default function HomeScreen() {
  const { profile, activeChallenges, logSavings, refreshData } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [logModalChallenge, setLogModalChallenge] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const activeChallenge = logModalChallenge
    ? activeChallenges.find((c) => c.id === logModalChallenge)
    : null;

  const totalActiveProgress =
    activeChallenges.length > 0
      ? activeChallenges.reduce((sum, c) => sum + getProgressPercent(c), 0) /
        activeChallenges.length
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{profile.currentStreak}</Text>
          </View>
        </View>

        {/* Overall Progress */}
        <View style={styles.progressSection}>
          <ProgressRing
            progress={totalActiveProgress}
            size={140}
            strokeWidth={12}
            color={COLORS.primary}
            label={`${Math.round(totalActiveProgress * 100)}%`}
            sublabel="Overall Progress"
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="💰"
            label="Total Saved"
            value={formatCurrency(profile.totalSavedAllTime)}
            color={COLORS.success}
          />
          <StatCard
            icon="🏆"
            label="Completed"
            value={String(profile.challengesCompleted)}
            color={COLORS.warning}
          />
          <StatCard
            icon="📊"
            label="Days Logged"
            value={String(profile.totalDaysLogged)}
            color={COLORS.primary}
          />
        </View>

        {/* Active Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {activeChallenges.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/challenges')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {activeChallenges.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => router.push('/challenges')}
            >
              <Text style={styles.emptyIcon}>🚀</Text>
              <Text style={styles.emptyTitle}>Start Your First Challenge</Text>
              <Text style={styles.emptySubtitle}>
                Browse our challenge library and begin your savings journey!
              </Text>
            </TouchableOpacity>
          ) : (
            activeChallenges.map((challenge) => {
              const todayDone = isTodayLogged(challenge);
              return (
                <View key={challenge.id}>
                  <ChallengeCard
                    icon={challenge.icon}
                    name={challenge.name}
                    color={challenge.color}
                    progress={getProgressPercent(challenge)}
                    savedAmount={formatCurrency(challenge.totalSaved)}
                    goalAmount={formatCurrency(challenge.totalGoal)}
                    streak={challenge.currentStreak}
                    onPress={() => router.push(`/challenge/${challenge.id}`)}
                  />
                  {!todayDone && (
                    <TouchableOpacity
                      style={[styles.logButton, { backgroundColor: challenge.color }]}
                      onPress={() => setLogModalChallenge(challenge.id)}
                    >
                      <Text style={styles.logButtonText}>+ Log Today's Savings</Text>
                    </TouchableOpacity>
                  )}
                  {todayDone && (
                    <View style={styles.todayDone}>
                      <Text style={styles.todayDoneText}>Today's savings logged</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Log Modal */}
      {activeChallenge && (
        <LogSavingsModal
          visible={!!logModalChallenge}
          challengeName={activeChallenge.name}
          onSubmit={async (amount) => {
            await logSavings(activeChallenge.id, amount);
            setLogModalChallenge(null);
          }}
          onClose={() => setLogModalChallenge(null)}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  streakIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  streakCount: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  logButton: {
    marginTop: -4,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  logButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  todayDone: {
    marginTop: -4,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  todayDoneText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
