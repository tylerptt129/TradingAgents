import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pet,
  FeedingSchedule,
  Medication,
  VetAppointment,
  Vaccination,
  WeightEntry,
  JournalEntry,
  CareLog,
  UserProfile,
} from '../types';

const KEYS = {
  PROFILE: '@pawpal_profile',
  PETS: '@pawpal_pets',
  FEEDING_SCHEDULES: '@pawpal_feeding',
  MEDICATIONS: '@pawpal_medications',
  VET_APPOINTMENTS: '@pawpal_vet',
  VACCINATIONS: '@pawpal_vaccinations',
  WEIGHT_LOG: '@pawpal_weight',
  JOURNAL: '@pawpal_journal',
  CARE_LOG: '@pawpal_care_log',
};

// Generic helpers
async function getList<T>(key: string): Promise<T[]> {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

async function saveList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

// Profile
const DEFAULT_PROFILE: UserProfile = {
  name: 'Pet Parent',
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

export async function getProfile(): Promise<UserProfile> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

// Pets
export const getPets = () => getList<Pet>(KEYS.PETS);
export const savePets = (pets: Pet[]) => saveList(KEYS.PETS, pets);

// Feeding
export const getFeedingSchedules = () => getList<FeedingSchedule>(KEYS.FEEDING_SCHEDULES);
export const saveFeedingSchedules = (s: FeedingSchedule[]) => saveList(KEYS.FEEDING_SCHEDULES, s);

// Medications
export const getMedications = () => getList<Medication>(KEYS.MEDICATIONS);
export const saveMedications = (m: Medication[]) => saveList(KEYS.MEDICATIONS, m);

// Vet
export const getVetAppointments = () => getList<VetAppointment>(KEYS.VET_APPOINTMENTS);
export const saveVetAppointments = (a: VetAppointment[]) => saveList(KEYS.VET_APPOINTMENTS, a);

// Vaccinations
export const getVaccinations = () => getList<Vaccination>(KEYS.VACCINATIONS);
export const saveVaccinations = (v: Vaccination[]) => saveList(KEYS.VACCINATIONS, v);

// Weight
export const getWeightLog = () => getList<WeightEntry>(KEYS.WEIGHT_LOG);
export const saveWeightLog = (w: WeightEntry[]) => saveList(KEYS.WEIGHT_LOG, w);

// Journal
export const getJournal = () => getList<JournalEntry>(KEYS.JOURNAL);
export const saveJournal = (j: JournalEntry[]) => saveList(KEYS.JOURNAL, j);

// Care Log
export const getCareLog = () => getList<CareLog>(KEYS.CARE_LOG);
export const saveCareLog = (c: CareLog[]) => saveList(KEYS.CARE_LOG, c);

// Reset
export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export { KEYS };
