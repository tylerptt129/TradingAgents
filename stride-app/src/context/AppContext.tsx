import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Habit, HabitCompletion, UserProfile } from '../types';
import { ALL_BADGES } from '../constants/badges';
import { FREE_HABIT_LIMIT } from '../constants/premium';
import * as Storage from '../storage';
import {
  getTodayStr,
  generateId,
  calculateStreak,
  getDaySummary,
  getGlobalStreak,
  getTodaysHabits,
} from '../utils/helpers';

interface AppState {
  profile: UserProfile;
  habits: Habit[];
  completions: HabitCompletion[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'order'>) => Promise<string | null>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: {
      name: '',
      joinDate: new Date().toISOString(),
      isPremium: false,
      totalCompletions: 0,
      totalPerfectDays: 0,
      longestStreak: 0,
      currentGlobalStreak: 0,
      daysActive: 0,
      unlockedBadgeIds: [],
    },
    habits: [],
    completions: [],
    isLoading: true,
  });

  const refreshData = useCallback(async () => {
    const [profile, habits, completions] = await Promise.all([
      Storage.getProfile(),
      Storage.getHabits(),
      Storage.getCompletions(),
    ]);
    setState({ profile, habits, completions, isLoading: false });
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const checkBadges = useCallback(async (profile: UserProfile, habitCount: number) => {
    const newIds = [...profile.unlockedBadgeIds];
    let newCount = 0;

    ALL_BADGES.forEach((b) => {
      if (newIds.includes(b.id)) return;
      let earned = false;
      switch (b.requirement.type) {
        case 'streak': earned = profile.longestStreak >= b.requirement.value; break;
        case 'total_completions': earned = profile.totalCompletions >= b.requirement.value; break;
        case 'habits_created': earned = habitCount >= b.requirement.value; break;
        case 'perfect_days': earned = profile.totalPerfectDays >= b.requirement.value; break;
        case 'days_active': earned = profile.daysActive >= b.requirement.value; break;
      }
      if (earned) { newIds.push(b.id); newCount++; }
    });

    if (newCount > 0) {
      profile.unlockedBadgeIds = newIds;
      await Storage.saveProfile(profile);
      const latest = ALL_BADGES.find((b) => b.id === newIds[newIds.length - 1]);
      if (latest) Alert.alert('Badge Unlocked!', `${latest.icon} ${latest.name} — ${latest.description}`);
    }
    return profile;
  }, []);

  const addHabit = useCallback(async (data: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'order'>): Promise<string | null> => {
    const activeHabits = state.habits.filter((h) => !h.archived);
    if (!state.profile.isPremium && activeHabits.length >= FREE_HABIT_LIMIT) {
      Alert.alert('Premium Required', `Free users can track ${FREE_HABIT_LIMIT} habits. Upgrade to unlock unlimited habits!`);
      return null;
    }

    const habit: Habit = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      archived: false,
      order: state.habits.length,
    };

    const updated = [...state.habits, habit];
    await Storage.saveHabits(updated);

    let profile = { ...state.profile };
    profile = await checkBadges(profile, updated.filter((h) => !h.archived).length);

    setState((prev) => ({ ...prev, habits: updated, profile }));
    return habit.id;
  }, [state.habits, state.profile, checkBadges]);

  const updateHabit = useCallback(async (habit: Habit) => {
    const updated = state.habits.map((h) => h.id === habit.id ? habit : h);
    await Storage.saveHabits(updated);
    setState((prev) => ({ ...prev, habits: updated }));
  }, [state.habits]);

  const deleteHabit = useCallback(async (id: string) => {
    const updated = state.habits.filter((h) => h.id !== id);
    const updatedCompletions = state.completions.filter((c) => c.habitId !== id);
    await Promise.all([Storage.saveHabits(updated), Storage.saveCompletions(updatedCompletions)]);
    setState((prev) => ({ ...prev, habits: updated, completions: updatedCompletions }));
  }, [state.habits, state.completions]);

  const archiveHabit = useCallback(async (id: string) => {
    const updated = state.habits.map((h) => h.id === id ? { ...h, archived: true } : h);
    await Storage.saveHabits(updated);
    setState((prev) => ({ ...prev, habits: updated }));
  }, [state.habits]);

  const toggleCompletion = useCallback(async (habitId: string) => {
    const today = getTodayStr();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    let updatedCompletions = [...state.completions];
    const existing = updatedCompletions.findIndex((c) => c.habitId === habitId && c.date === today);

    if (existing >= 0) {
      const entry = updatedCompletions[existing];
      if (entry.count >= habit.targetPerDay) {
        // Uncomplete
        updatedCompletions.splice(existing, 1);
      } else {
        updatedCompletions[existing] = { ...entry, count: entry.count + 1, completedAt: new Date().toISOString() };
      }
    } else {
      updatedCompletions.push({
        habitId,
        date: today,
        count: 1,
        completedAt: new Date().toISOString(),
      });
    }

    await Storage.saveCompletions(updatedCompletions);

    // Recalculate profile stats
    let profile = { ...state.profile };
    profile.totalCompletions = updatedCompletions.reduce((sum, c) => sum + c.count, 0);

    // Streaks
    const streak = calculateStreak(habit, updatedCompletions);
    profile.longestStreak = Math.max(profile.longestStreak, streak.longest);

    // Global streak
    profile.currentGlobalStreak = getGlobalStreak(state.habits, updatedCompletions);

    // Perfect days
    const daySummary = getDaySummary(today, state.habits, updatedCompletions);
    if (daySummary.isPerfect) {
      // Count total perfect days
      const allDates = [...new Set(updatedCompletions.map((c) => c.date))];
      let perfectCount = 0;
      allDates.forEach((d) => {
        const s = getDaySummary(d, state.habits, updatedCompletions);
        if (s.isPerfect) perfectCount++;
      });
      profile.totalPerfectDays = perfectCount;
    }

    profile.daysActive = new Set(updatedCompletions.map((c) => c.date)).size;
    profile = await checkBadges(profile, state.habits.filter((h) => !h.archived).length);

    setState((prev) => ({ ...prev, completions: updatedCompletions, profile }));
  }, [state.habits, state.completions, state.profile, checkBadges]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const newProfile = { ...state.profile, ...updates };
    await Storage.saveProfile(newProfile);
    setState((prev) => ({ ...prev, profile: newProfile }));
  }, [state.profile]);

  return (
    <AppContext.Provider value={{ ...state, addHabit, updateHabit, deleteHabit, archiveHabit, toggleCompletion, updateProfile, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
