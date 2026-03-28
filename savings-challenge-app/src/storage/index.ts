import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveChallenge, UserProfile, DailySavingsEntry } from '../types';

const KEYS = {
  PROFILE: '@savequest_profile',
  ACTIVE_CHALLENGES: '@savequest_active_challenges',
  SAVINGS_LOG: '@savequest_savings_log',
  COMPLETED_CHALLENGES: '@savequest_completed_challenges',
};

// ---- Profile ----

const DEFAULT_PROFILE: UserProfile = {
  name: 'Saver',
  joinDate: new Date().toISOString(),
  isPremium: false,
  totalSavedAllTime: 0,
  challengesCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysLogged: 0,
  unlockedBadgeIds: [],
};

export async function getProfile(): Promise<UserProfile> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

// ---- Active Challenges ----

export async function getActiveChallenges(): Promise<ActiveChallenge[]> {
  const data = await AsyncStorage.getItem(KEYS.ACTIVE_CHALLENGES);
  return data ? JSON.parse(data) : [];
}

export async function saveActiveChallenges(
  challenges: ActiveChallenge[]
): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.ACTIVE_CHALLENGES,
    JSON.stringify(challenges)
  );
}

// ---- Completed Challenges ----

export async function getCompletedChallenges(): Promise<ActiveChallenge[]> {
  const data = await AsyncStorage.getItem(KEYS.COMPLETED_CHALLENGES);
  return data ? JSON.parse(data) : [];
}

export async function saveCompletedChallenges(
  challenges: ActiveChallenge[]
): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.COMPLETED_CHALLENGES,
    JSON.stringify(challenges)
  );
}

// ---- Savings Log ----

export async function getSavingsLog(): Promise<DailySavingsEntry[]> {
  const data = await AsyncStorage.getItem(KEYS.SAVINGS_LOG);
  return data ? JSON.parse(data) : [];
}

export async function addSavingsEntry(
  entry: DailySavingsEntry
): Promise<void> {
  const log = await getSavingsLog();
  log.push(entry);
  await AsyncStorage.setItem(KEYS.SAVINGS_LOG, JSON.stringify(log));
}

// ---- Reset (for development) ----

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
