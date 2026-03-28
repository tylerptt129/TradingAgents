import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  saveProfile,
  getActiveChallenges,
  saveActiveChallenges,
  resetAllData,
} from '../../src/storage';
import { UserProfile, ActiveChallenge } from '../../src/types';

// AsyncStorage is mocked in setup.ts

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Storage - Profile', () => {
  it('returns default profile when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const profile = await getProfile();
    expect(profile.name).toBe('Saver');
    expect(profile.isPremium).toBe(false);
    expect(profile.totalSavedAllTime).toBe(0);
  });

  it('returns stored profile', async () => {
    const stored: UserProfile = {
      name: 'TestUser',
      joinDate: '2025-01-01T00:00:00.000Z',
      isPremium: true,
      totalSavedAllTime: 500,
      challengesCompleted: 2,
      currentStreak: 5,
      longestStreak: 10,
      totalDaysLogged: 30,
      unlockedBadgeIds: ['streak-3', 'saved-50'],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(stored),
    );

    const profile = await getProfile();
    expect(profile.name).toBe('TestUser');
    expect(profile.isPremium).toBe(true);
    expect(profile.totalSavedAllTime).toBe(500);
    expect(profile.unlockedBadgeIds).toHaveLength(2);
  });

  it('saves profile to AsyncStorage', async () => {
    const profile: UserProfile = {
      name: 'NewUser',
      joinDate: new Date().toISOString(),
      isPremium: false,
      totalSavedAllTime: 100,
      challengesCompleted: 1,
      currentStreak: 3,
      longestStreak: 3,
      totalDaysLogged: 10,
      unlockedBadgeIds: [],
    };

    await saveProfile(profile);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@savequest_profile',
      JSON.stringify(profile),
    );
  });
});

describe('Storage - Active Challenges', () => {
  it('returns empty array when no challenges stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const challenges = await getActiveChallenges();
    expect(challenges).toEqual([]);
  });

  it('saves challenges to AsyncStorage', async () => {
    const challenges: ActiveChallenge[] = [
      {
        id: 'test-1',
        templateId: '52-week',
        name: '52-Week Challenge',
        type: '52-week',
        icon: '📅',
        color: '#4CAF50',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        durationDays: 364,
        completedDays: {},
        savedAmounts: {},
        totalSaved: 0,
        totalGoal: 1378,
        currentStreak: 0,
        longestStreak: 0,
        status: 'active',
      },
    ];

    await saveActiveChallenges(challenges);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@savequest_active_challenges',
      JSON.stringify(challenges),
    );
  });
});

describe('Storage - Reset', () => {
  it('clears all storage keys', async () => {
    await resetAllData();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    const removedKeys = (AsyncStorage.multiRemove as jest.Mock).mock.calls[0][0];
    expect(removedKeys).toContain('@savequest_profile');
    expect(removedKeys).toContain('@savequest_active_challenges');
    expect(removedKeys).toContain('@savequest_savings_log');
    expect(removedKeys).toContain('@savequest_completed_challenges');
  });
});
