import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, saveProfile, getPets, savePets, resetAllData, KEYS } from '../../src/storage';
import { UserProfile, Pet } from '../../src/types';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Storage - Profile', () => {
  it('returns default profile when empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const profile = await getProfile();
    expect(profile.name).toBe('Pet Parent');
    expect(profile.isPremium).toBe(false);
    expect(profile.careStreak).toBe(0);
  });

  it('returns stored profile', async () => {
    const stored: UserProfile = {
      name: 'TestUser',
      joinDate: '2025-01-01T00:00:00.000Z',
      isPremium: true,
      careStreak: 5,
      longestCareStreak: 10,
      totalDaysActive: 30,
      totalVetVisits: 3,
      totalJournalEntries: 15,
      totalPhotos: 8,
      unlockedBadgeIds: ['streak-3', 'pet-1'],
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));
    const profile = await getProfile();
    expect(profile.name).toBe('TestUser');
    expect(profile.isPremium).toBe(true);
    expect(profile.careStreak).toBe(5);
  });

  it('saves profile', async () => {
    const profile: UserProfile = {
      name: 'NewUser',
      joinDate: new Date().toISOString(),
      isPremium: false,
      careStreak: 0,
      longestCareStreak: 0,
      totalDaysActive: 0,
      totalVetVisits: 0,
      totalJournalEntries: 0,
      totalPhotos: 0,
      unlockedBadgeIds: [],
    };
    await saveProfile(profile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pawpal_profile', JSON.stringify(profile));
  });
});

describe('Storage - Pets', () => {
  it('returns empty array when no pets', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const pets = await getPets();
    expect(pets).toEqual([]);
  });

  it('saves pets', async () => {
    const pets: Pet[] = [
      {
        id: 'test-1',
        name: 'Buddy',
        type: 'dog',
        breed: 'Golden Retriever',
        gender: 'male',
        birthday: '2022-05-15',
        adoptedDate: '2022-07-01',
        color: '#FF6B4A',
      },
    ];
    await savePets(pets);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@pawpal_pets', JSON.stringify(pets));
  });
});

describe('Storage - Reset', () => {
  it('clears all keys', async () => {
    await resetAllData();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    const removedKeys = (AsyncStorage.multiRemove as jest.Mock).mock.calls[0][0];
    expect(removedKeys).toContain('@pawpal_profile');
    expect(removedKeys).toContain('@pawpal_pets');
    expect(removedKeys).toContain('@pawpal_feeding');
    expect(removedKeys).toContain('@pawpal_medications');
    expect(removedKeys).toContain('@pawpal_vet');
    expect(removedKeys).toContain('@pawpal_journal');
    expect(removedKeys).toContain('@pawpal_care_log');
  });
});
