import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion, UserProfile } from '../types';

const KEYS = {
  PROFILE: '@stride_profile',
  HABITS: '@stride_habits',
  COMPLETIONS: '@stride_completions',
};

async function getList<T>(key: string): Promise<T[]> {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

async function saveList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  joinDate: new Date().toISOString(),
  isPremium: false,
  totalCompletions: 0,
  totalPerfectDays: 0,
  longestStreak: 0,
  currentGlobalStreak: 0,
  daysActive: 0,
  unlockedBadgeIds: [],
};

export async function getProfile(): Promise<UserProfile> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
}
export async function saveProfile(p: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(p));
}

export const getHabits = () => getList<Habit>(KEYS.HABITS);
export const saveHabits = (h: Habit[]) => saveList(KEYS.HABITS, h);

export const getCompletions = () => getList<HabitCompletion>(KEYS.COMPLETIONS);
export const saveCompletions = (c: HabitCompletion[]) => saveList(KEYS.COMPLETIONS, c);

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export { KEYS };
