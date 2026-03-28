import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  saveProfile,
  getHabits,
  saveHabits,
  getCompletions,
  saveCompletions,
  resetAllData,
  KEYS,
} from '../src/storage';
import { UserProfile, Habit, HabitCompletion } from '../src/types';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Profile storage', () => {
  it('returns default profile when none saved', async () => {
    const profile = await getProfile();
    expect(profile.name).toBe('');
    expect(profile.isPremium).toBe(false);
    expect(profile.totalCompletions).toBe(0);
    expect(profile.unlockedBadgeIds).toEqual([]);
  });

  it('saves and retrieves profile', async () => {
    const profile: UserProfile = {
      name: 'Test User',
      joinDate: '2025-01-01T00:00:00.000Z',
      isPremium: true,
      totalCompletions: 42,
      totalPerfectDays: 5,
      longestStreak: 10,
      currentGlobalStreak: 3,
      daysActive: 15,
      unlockedBadgeIds: ['s3', 'c10'],
    };
    await saveProfile(profile);
    const loaded = await getProfile();
    expect(loaded.name).toBe('Test User');
    expect(loaded.isPremium).toBe(true);
    expect(loaded.totalCompletions).toBe(42);
    expect(loaded.unlockedBadgeIds).toEqual(['s3', 'c10']);
  });
});

describe('Habits storage', () => {
  it('returns empty array when none saved', async () => {
    const habits = await getHabits();
    expect(habits).toEqual([]);
  });

  it('saves and retrieves habits', async () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Exercise',
        icon: '💪',
        gradient: 'coral',
        frequency: 'daily',
        timeOfDay: 'morning',
        targetPerDay: 1,
        createdAt: '2025-01-01T00:00:00.000Z',
        archived: false,
        order: 0,
      },
    ];
    await saveHabits(habits);
    const loaded = await getHabits();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('Exercise');
    expect(loaded[0].gradient).toBe('coral');
  });
});

describe('Completions storage', () => {
  it('returns empty array when none saved', async () => {
    expect(await getCompletions()).toEqual([]);
  });

  it('saves and retrieves completions', async () => {
    const completions: HabitCompletion[] = [
      { habitId: 'h1', date: '2025-01-06', count: 2, completedAt: '2025-01-06T12:00:00.000Z' },
    ];
    await saveCompletions(completions);
    const loaded = await getCompletions();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].count).toBe(2);
  });
});

describe('resetAllData', () => {
  it('clears all storage keys', async () => {
    await saveProfile({ name: 'X' } as UserProfile);
    await saveHabits([{ id: 'h1' } as Habit]);
    await saveCompletions([{ habitId: 'h1' } as HabitCompletion]);

    await resetAllData();

    expect(await getHabits()).toEqual([]);
    expect(await getCompletions()).toEqual([]);
    const profile = await getProfile();
    expect(profile.name).toBe('');
  });
});

describe('KEYS', () => {
  it('has correct key names', () => {
    expect(KEYS.PROFILE).toBe('@stride_profile');
    expect(KEYS.HABITS).toBe('@stride_habits');
    expect(KEYS.COMPLETIONS).toBe('@stride_completions');
  });
});
