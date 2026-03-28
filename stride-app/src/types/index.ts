import { GradientName } from '../constants/theme';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun=0
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  gradient: GradientName;
  frequency: HabitFrequency;
  customDays?: DayOfWeek[]; // for 'custom' frequency
  timeOfDay: TimeOfDay;
  reminderTime?: string; // "08:00"
  targetPerDay: number; // times per day (usually 1)
  createdAt: string;
  archived: boolean;
  order: number; // sort position
}

export interface HabitCompletion {
  habitId: string;
  date: string; // yyyy-MM-dd
  count: number; // how many times completed that day
  completedAt: string; // ISO timestamp of last completion
}

export interface HabitStreak {
  habitId: string;
  current: number;
  longest: number;
  lastCompletedDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  requirement: {
    type: 'streak' | 'total_completions' | 'habits_created' | 'perfect_days' | 'days_active';
    value: number;
  };
}

export interface UserProfile {
  name: string;
  joinDate: string;
  isPremium: boolean;
  totalCompletions: number;
  totalPerfectDays: number;
  longestStreak: number;
  currentGlobalStreak: number;
  daysActive: number;
  unlockedBadgeIds: string[];
}

export interface DaySummary {
  date: string;
  totalHabits: number;
  completedHabits: number;
  isPerfect: boolean;
  completionRate: number; // 0–1
}
