export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'reptile' | 'other';
export type PetGender = 'male' | 'female' | 'unknown';
export type MoodType = 'happy' | 'playful' | 'sleepy' | 'hungry' | 'sick' | 'anxious';
export type ActivityType = 'feeding' | 'medication' | 'vet' | 'grooming' | 'walk' | 'play' | 'bath';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  gender: PetGender;
  birthday: string; // ISO date
  adoptedDate: string; // ISO date
  photoUri?: string;
  color: string; // theme color for this pet
  weight?: number; // in lbs
  microchipId?: string;
  notes?: string;
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  name: string; // "Breakfast", "Dinner", etc.
  time: string; // "08:00"
  foodType: string;
  amount: string;
  enabled: boolean;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string; // "daily", "twice-daily", "weekly", "monthly"
  time: string; // "09:00"
  startDate: string;
  endDate?: string;
  notes?: string;
  enabled: boolean;
}

export interface VetAppointment {
  id: string;
  petId: string;
  vetName: string;
  reason: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  cost?: number;
  completed: boolean;
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  expiryDate?: string;
  vetName?: string;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  petId: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  petId: string;
  date: string;
  mood: MoodType;
  photoUri?: string;
  note: string;
  activities: ActivityType[];
}

export interface CareLog {
  id: string;
  petId: string;
  type: ActivityType;
  date: string;
  time: string;
  notes?: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  requirement: {
    type: 'care_streak' | 'journal_entries' | 'vet_visits' | 'pets_added' | 'days_active' | 'photos_taken';
    value: number;
  };
}

export interface UserProfile {
  name: string;
  joinDate: string;
  isPremium: boolean;
  careStreak: number;
  longestCareStreak: number;
  totalDaysActive: number;
  totalVetVisits: number;
  totalJournalEntries: number;
  totalPhotos: number;
  unlockedBadgeIds: string[];
}

export interface DailyCareSummary {
  date: string;
  petId: string;
  fedCount: number;
  medicationGiven: boolean;
  journalWritten: boolean;
  moodLogged: boolean;
}
