import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
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
import { ALL_BADGES } from '../constants/badges';
import { FREE_PET_LIMIT, FREE_JOURNAL_LIMIT } from '../constants/premium';
import * as Storage from '../storage';
import { getTodayStr, calculateCareStreak, generateId } from '../utils/helpers';

interface AppState {
  profile: UserProfile;
  pets: Pet[];
  feedingSchedules: FeedingSchedule[];
  medications: Medication[];
  vetAppointments: VetAppointment[];
  vaccinations: Vaccination[];
  weightLog: WeightEntry[];
  journal: JournalEntry[];
  careLog: CareLog[];
  isLoading: boolean;
  selectedPetId: string | null;
}

interface AppContextType extends AppState {
  // Pet CRUD
  addPet: (pet: Omit<Pet, 'id'>) => Promise<string | null>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  selectPet: (petId: string) => void;

  // Feeding
  addFeedingSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => Promise<void>;
  toggleFeeding: (id: string) => Promise<void>;
  deleteFeedingSchedule: (id: string) => Promise<void>;

  // Medications
  addMedication: (med: Omit<Medication, 'id'>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;

  // Vet
  addVetAppointment: (apt: Omit<VetAppointment, 'id'>) => Promise<void>;
  completeVetAppointment: (id: string) => Promise<void>;
  deleteVetAppointment: (id: string) => Promise<void>;

  // Vaccinations
  addVaccination: (vax: Omit<Vaccination, 'id'>) => Promise<void>;
  deleteVaccination: (id: string) => Promise<void>;

  // Weight
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => Promise<void>;

  // Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;

  // Care log
  logCare: (petId: string, type: CareLog['type'], notes?: string) => Promise<void>;

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: {
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
    },
    pets: [],
    feedingSchedules: [],
    medications: [],
    vetAppointments: [],
    vaccinations: [],
    weightLog: [],
    journal: [],
    careLog: [],
    isLoading: true,
    selectedPetId: null,
  });

  const refreshData = useCallback(async () => {
    const [profile, pets, feedingSchedules, medications, vetAppointments, vaccinations, weightLog, journal, careLog] =
      await Promise.all([
        Storage.getProfile(),
        Storage.getPets(),
        Storage.getFeedingSchedules(),
        Storage.getMedications(),
        Storage.getVetAppointments(),
        Storage.getVaccinations(),
        Storage.getWeightLog(),
        Storage.getJournal(),
        Storage.getCareLog(),
      ]);

    setState((prev) => ({
      ...prev,
      profile,
      pets,
      feedingSchedules,
      medications,
      vetAppointments,
      vaccinations,
      weightLog,
      journal,
      careLog,
      isLoading: false,
      selectedPetId: prev.selectedPetId || (pets.length > 0 ? pets[0].id : null),
    }));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Check and award new badges
  const checkBadges = useCallback(
    async (profile: UserProfile, petCount: number) => {
      const newBadgeIds = [...profile.unlockedBadgeIds];
      let newUnlocks = 0;

      ALL_BADGES.forEach((badge) => {
        if (newBadgeIds.includes(badge.id)) return;
        let earned = false;
        switch (badge.requirement.type) {
          case 'care_streak':
            earned = profile.longestCareStreak >= badge.requirement.value;
            break;
          case 'journal_entries':
            earned = profile.totalJournalEntries >= badge.requirement.value;
            break;
          case 'vet_visits':
            earned = profile.totalVetVisits >= badge.requirement.value;
            break;
          case 'pets_added':
            earned = petCount >= badge.requirement.value;
            break;
          case 'days_active':
            earned = profile.totalDaysActive >= badge.requirement.value;
            break;
          case 'photos_taken':
            earned = profile.totalPhotos >= badge.requirement.value;
            break;
        }
        if (earned) {
          newBadgeIds.push(badge.id);
          newUnlocks++;
        }
      });

      if (newUnlocks > 0) {
        profile.unlockedBadgeIds = newBadgeIds;
        await Storage.saveProfile(profile);

        const latest = ALL_BADGES.find(
          (b) => b.id === newBadgeIds[newBadgeIds.length - 1],
        );
        if (latest) {
          Alert.alert('Badge Unlocked!', `${latest.icon} ${latest.name} — ${latest.description}`);
        }
      }

      return profile;
    },
    [],
  );

  // ---- Pet CRUD ----
  const addPet = useCallback(
    async (petData: Omit<Pet, 'id'>): Promise<string | null> => {
      if (!state.profile.isPremium && state.pets.length >= FREE_PET_LIMIT) {
        Alert.alert(
          'Premium Required',
          'Free users can add 1 pet. Upgrade to Premium for unlimited pets!',
        );
        return null;
      }

      const pet: Pet = { ...petData, id: generateId() };
      const updated = [...state.pets, pet];
      await Storage.savePets(updated);

      let profile = { ...state.profile };
      profile = await checkBadges(profile, updated.length);

      setState((prev) => ({
        ...prev,
        pets: updated,
        selectedPetId: prev.selectedPetId || pet.id,
        profile,
      }));

      return pet.id;
    },
    [state.pets, state.profile, checkBadges],
  );

  const updatePet = useCallback(
    async (pet: Pet) => {
      const updated = state.pets.map((p) => (p.id === pet.id ? pet : p));
      await Storage.savePets(updated);
      setState((prev) => ({ ...prev, pets: updated }));
    },
    [state.pets],
  );

  const deletePet = useCallback(
    async (petId: string) => {
      const updated = state.pets.filter((p) => p.id !== petId);
      await Storage.savePets(updated);
      setState((prev) => ({
        ...prev,
        pets: updated,
        selectedPetId: prev.selectedPetId === petId ? (updated[0]?.id ?? null) : prev.selectedPetId,
      }));
    },
    [state.pets],
  );

  const selectPet = useCallback((petId: string) => {
    setState((prev) => ({ ...prev, selectedPetId: petId }));
  }, []);

  // ---- Feeding ----
  const addFeedingSchedule = useCallback(
    async (data: Omit<FeedingSchedule, 'id'>) => {
      const schedule: FeedingSchedule = { ...data, id: generateId() };
      const updated = [...state.feedingSchedules, schedule];
      await Storage.saveFeedingSchedules(updated);
      setState((prev) => ({ ...prev, feedingSchedules: updated }));
    },
    [state.feedingSchedules],
  );

  const toggleFeeding = useCallback(
    async (id: string) => {
      const updated = state.feedingSchedules.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s,
      );
      await Storage.saveFeedingSchedules(updated);
      setState((prev) => ({ ...prev, feedingSchedules: updated }));
    },
    [state.feedingSchedules],
  );

  const deleteFeedingSchedule = useCallback(
    async (id: string) => {
      const updated = state.feedingSchedules.filter((s) => s.id !== id);
      await Storage.saveFeedingSchedules(updated);
      setState((prev) => ({ ...prev, feedingSchedules: updated }));
    },
    [state.feedingSchedules],
  );

  // ---- Medications ----
  const addMedication = useCallback(
    async (data: Omit<Medication, 'id'>) => {
      if (!state.profile.isPremium) {
        Alert.alert('Premium Feature', 'Medication tracking requires Premium. Upgrade for $1.99!');
        return;
      }
      const med: Medication = { ...data, id: generateId() };
      const updated = [...state.medications, med];
      await Storage.saveMedications(updated);
      setState((prev) => ({ ...prev, medications: updated }));
    },
    [state.medications, state.profile.isPremium],
  );

  const deleteMedication = useCallback(
    async (id: string) => {
      const updated = state.medications.filter((m) => m.id !== id);
      await Storage.saveMedications(updated);
      setState((prev) => ({ ...prev, medications: updated }));
    },
    [state.medications],
  );

  // ---- Vet ----
  const addVetAppointment = useCallback(
    async (data: Omit<VetAppointment, 'id'>) => {
      const apt: VetAppointment = { ...data, id: generateId() };
      const updated = [...state.vetAppointments, apt];
      await Storage.saveVetAppointments(updated);
      setState((prev) => ({ ...prev, vetAppointments: updated }));
    },
    [state.vetAppointments],
  );

  const completeVetAppointment = useCallback(
    async (id: string) => {
      const updated = state.vetAppointments.map((a) =>
        a.id === id ? { ...a, completed: true } : a,
      );
      await Storage.saveVetAppointments(updated);

      let profile = { ...state.profile, totalVetVisits: state.profile.totalVetVisits + 1 };
      profile = await checkBadges(profile, state.pets.length);

      setState((prev) => ({ ...prev, vetAppointments: updated, profile }));
    },
    [state.vetAppointments, state.profile, state.pets.length, checkBadges],
  );

  const deleteVetAppointment = useCallback(
    async (id: string) => {
      const updated = state.vetAppointments.filter((a) => a.id !== id);
      await Storage.saveVetAppointments(updated);
      setState((prev) => ({ ...prev, vetAppointments: updated }));
    },
    [state.vetAppointments],
  );

  // ---- Vaccinations ----
  const addVaccination = useCallback(
    async (data: Omit<Vaccination, 'id'>) => {
      if (!state.profile.isPremium) {
        Alert.alert('Premium Feature', 'Vaccination tracking requires Premium.');
        return;
      }
      const vax: Vaccination = { ...data, id: generateId() };
      const updated = [...state.vaccinations, vax];
      await Storage.saveVaccinations(updated);
      setState((prev) => ({ ...prev, vaccinations: updated }));
    },
    [state.vaccinations, state.profile.isPremium],
  );

  const deleteVaccination = useCallback(
    async (id: string) => {
      const updated = state.vaccinations.filter((v) => v.id !== id);
      await Storage.saveVaccinations(updated);
      setState((prev) => ({ ...prev, vaccinations: updated }));
    },
    [state.vaccinations],
  );

  // ---- Weight ----
  const addWeightEntry = useCallback(
    async (data: Omit<WeightEntry, 'id'>) => {
      if (!state.profile.isPremium) {
        Alert.alert('Premium Feature', 'Weight tracking requires Premium.');
        return;
      }
      const entry: WeightEntry = { ...data, id: generateId() };
      const updated = [...state.weightLog, entry].sort((a, b) => a.date.localeCompare(b.date));
      await Storage.saveWeightLog(updated);

      // Update pet's current weight
      const pet = state.pets.find((p) => p.id === data.petId);
      if (pet) {
        const updatedPets = state.pets.map((p) =>
          p.id === data.petId ? { ...p, weight: data.weight } : p,
        );
        await Storage.savePets(updatedPets);
        setState((prev) => ({ ...prev, weightLog: updated, pets: updatedPets }));
      } else {
        setState((prev) => ({ ...prev, weightLog: updated }));
      }
    },
    [state.weightLog, state.pets, state.profile.isPremium],
  );

  // ---- Journal ----
  const addJournalEntry = useCallback(
    async (data: Omit<JournalEntry, 'id'>) => {
      if (!state.profile.isPremium && state.journal.length >= FREE_JOURNAL_LIMIT) {
        Alert.alert('Premium Required', 'Free users get 5 journal entries. Upgrade for unlimited!');
        return;
      }

      const entry: JournalEntry = { ...data, id: generateId() };
      const updated = [entry, ...state.journal];
      await Storage.saveJournal(updated);

      let profile = { ...state.profile };
      profile.totalJournalEntries += 1;
      if (data.photoUri) profile.totalPhotos += 1;

      // Update care streak
      const careDates = updated.map((j) => j.date);
      state.careLog.forEach((c) => careDates.push(c.date));
      profile.careStreak = calculateCareStreak(careDates);
      profile.longestCareStreak = Math.max(profile.longestCareStreak, profile.careStreak);
      profile.totalDaysActive += 1;

      profile = await checkBadges(profile, state.pets.length);

      setState((prev) => ({ ...prev, journal: updated, profile }));
    },
    [state.journal, state.profile, state.careLog, state.pets.length, checkBadges],
  );

  // ---- Care Log ----
  const logCare = useCallback(
    async (petId: string, type: CareLog['type'], notes?: string) => {
      const now = new Date();
      const entry: CareLog = {
        id: generateId(),
        petId,
        type,
        date: getTodayStr(),
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        notes,
        completed: true,
      };

      const updated = [entry, ...state.careLog];
      await Storage.saveCareLog(updated);

      let profile = { ...state.profile };

      const allCareDates = updated.map((c) => c.date);
      state.journal.forEach((j) => allCareDates.push(j.date));
      profile.careStreak = calculateCareStreak(allCareDates);
      profile.longestCareStreak = Math.max(profile.longestCareStreak, profile.careStreak);

      profile = await checkBadges(profile, state.pets.length);

      setState((prev) => ({ ...prev, careLog: updated, profile }));
    },
    [state.careLog, state.journal, state.profile, state.pets.length, checkBadges],
  );

  // ---- Profile ----
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
        addPet,
        updatePet,
        deletePet,
        selectPet,
        addFeedingSchedule,
        toggleFeeding,
        deleteFeedingSchedule,
        addMedication,
        deleteMedication,
        addVetAppointment,
        completeVetAppointment,
        deleteVetAppointment,
        addVaccination,
        deleteVaccination,
        addWeightEntry,
        addJournalEntry,
        logCare,
        updateProfile,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
