import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ActiveChallenge, UserProfile, ChallengeTemplate } from '../types';
import { ALL_BADGES } from '../constants/badges';
import * as Storage from '../storage';
import { getTodayStr, calculateStreak } from '../utils/helpers';
import { format, addDays } from 'date-fns';

interface AppState {
  profile: UserProfile;
  activeChallenges: ActiveChallenge[];
  completedChallenges: ActiveChallenge[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  startChallenge: (template: ChallengeTemplate) => Promise<void>;
  logSavings: (challengeId: string, amount: number) => Promise<void>;
  abandonChallenge: (challengeId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: {
      name: 'Saver',
      joinDate: new Date().toISOString(),
      isPremium: false,
      totalSavedAllTime: 0,
      challengesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysLogged: 0,
      unlockedBadgeIds: [],
    },
    activeChallenges: [],
    completedChallenges: [],
    isLoading: true,
  });

  const refreshData = useCallback(async () => {
    const [profile, activeChallenges, completedChallenges] = await Promise.all([
      Storage.getProfile(),
      Storage.getActiveChallenges(),
      Storage.getCompletedChallenges(),
    ]);
    setState({ profile, activeChallenges, completedChallenges, isLoading: false });
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const startChallenge = useCallback(
    async (template: ChallengeTemplate) => {
      // Free users limited to 1 active challenge
      if (!state.profile.isPremium && state.activeChallenges.length >= 1) {
        Alert.alert(
          'Premium Required',
          'Free users can have 1 active challenge. Upgrade to Premium for unlimited challenges!',
        );
        return;
      }

      const today = new Date();
      const endDate = addDays(today, template.durationDays);

      const newChallenge: ActiveChallenge = {
        id: `${template.id}-${Date.now()}`,
        templateId: template.id,
        name: template.name,
        type: template.type,
        icon: template.icon,
        color: template.color,
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        durationDays: template.durationDays,
        completedDays: {},
        savedAmounts: {},
        totalSaved: 0,
        totalGoal: template.totalSavingsGoal,
        currentStreak: 0,
        longestStreak: 0,
        status: 'active',
      };

      const updated = [...state.activeChallenges, newChallenge];
      await Storage.saveActiveChallenges(updated);
      setState((prev) => ({ ...prev, activeChallenges: updated }));
    },
    [state.profile.isPremium, state.activeChallenges],
  );

  const logSavings = useCallback(
    async (challengeId: string, amount: number) => {
      const todayStr = getTodayStr();
      const updated = state.activeChallenges.map((c) => {
        if (c.id !== challengeId) return c;

        const newCompletedDays = { ...c.completedDays, [todayStr]: true };
        const newSavedAmounts = { ...c.savedAmounts, [todayStr]: amount };
        const newTotalSaved = c.totalSaved + amount;
        const newStreak = calculateStreak(newCompletedDays);
        const newLongest = Math.max(c.longestStreak, newStreak);

        const isComplete = newTotalSaved >= c.totalGoal;

        return {
          ...c,
          completedDays: newCompletedDays,
          savedAmounts: newSavedAmounts,
          totalSaved: newTotalSaved,
          currentStreak: newStreak,
          longestStreak: newLongest,
          status: isComplete ? ('completed' as const) : c.status,
        };
      });

      // Move completed challenges
      const stillActive = updated.filter((c) => c.status === 'active');
      const newlyCompleted = updated.filter(
        (c) => c.status === 'completed' && !state.completedChallenges.find((cc) => cc.id === c.id),
      );

      const allCompleted = [...state.completedChallenges, ...newlyCompleted];

      // Update profile
      const newProfile = { ...state.profile };
      newProfile.totalSavedAllTime += amount;
      newProfile.totalDaysLogged += 1;
      newProfile.challengesCompleted += newlyCompleted.length;

      // Recalc global streak from all active challenges
      const allCompletedDays: Record<string, boolean> = {};
      stillActive.forEach((c) => {
        Object.keys(c.completedDays).forEach((d) => {
          allCompletedDays[d] = true;
        });
      });
      newProfile.currentStreak = calculateStreak(allCompletedDays);
      newProfile.longestStreak = Math.max(
        newProfile.longestStreak,
        newProfile.currentStreak,
      );

      // Check for new badges
      const newBadgeIds = [...newProfile.unlockedBadgeIds];
      ALL_BADGES.forEach((badge) => {
        if (newBadgeIds.includes(badge.id)) return;
        let earned = false;
        switch (badge.requirement.type) {
          case 'streak':
            earned = newProfile.longestStreak >= badge.requirement.value;
            break;
          case 'total_saved':
            earned = newProfile.totalSavedAllTime >= badge.requirement.value;
            break;
          case 'challenges_completed':
            earned = newProfile.challengesCompleted >= badge.requirement.value;
            break;
          case 'days_logged':
            earned = newProfile.totalDaysLogged >= badge.requirement.value;
            break;
        }
        if (earned) newBadgeIds.push(badge.id);
      });
      newProfile.unlockedBadgeIds = newBadgeIds;

      // Save entry
      await Storage.addSavingsEntry({
        date: todayStr,
        amount,
        challengeId,
      });

      await Promise.all([
        Storage.saveActiveChallenges(stillActive),
        Storage.saveCompletedChallenges(allCompleted),
        Storage.saveProfile(newProfile),
      ]);

      setState({
        profile: newProfile,
        activeChallenges: stillActive,
        completedChallenges: allCompleted,
        isLoading: false,
      });

      if (newlyCompleted.length > 0) {
        Alert.alert('Challenge Complete!', 'Congratulations! You crushed it! 🎉');
      }

      const newBadges = newBadgeIds.filter(
        (id) => !state.profile.unlockedBadgeIds.includes(id),
      );
      if (newBadges.length > 0) {
        const badge = ALL_BADGES.find((b) => b.id === newBadges[0]);
        if (badge) {
          Alert.alert('Badge Unlocked!', `${badge.icon} ${badge.name} — ${badge.description}`);
        }
      }
    },
    [state],
  );

  const abandonChallenge = useCallback(
    async (challengeId: string) => {
      const updated = state.activeChallenges.filter((c) => c.id !== challengeId);
      await Storage.saveActiveChallenges(updated);
      setState((prev) => ({ ...prev, activeChallenges: updated }));
    },
    [state.activeChallenges],
  );

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const newProfile = { ...state.profile, ...updates };
      await Storage.saveProfile(newProfile);
      setState((prev) => ({ ...prev, profile: newProfile }));
    },
    [state.profile],
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        startChallenge,
        logSavings,
        abandonChallenge,
        updateProfile,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
