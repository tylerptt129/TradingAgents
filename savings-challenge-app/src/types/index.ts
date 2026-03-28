export type ChallengeType =
  | '52-week'
  | '30-day-no-spend'
  | 'penny'
  | 'round-up'
  | '100-envelope'
  | 'custom';

export type ChallengeStatus = 'available' | 'active' | 'completed' | 'failed';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  durationDays: number;
  icon: string;
  color: string;
  isPremium: boolean;
  totalSavingsGoal: number;
  dailyAmounts?: number[];
  rules: string[];
}

export interface ActiveChallenge {
  id: string;
  templateId: string;
  name: string;
  type: ChallengeType;
  icon: string;
  color: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  completedDays: Record<string, boolean>;
  savedAmounts: Record<string, number>;
  totalSaved: number;
  totalGoal: number;
  currentStreak: number;
  longestStreak: number;
  status: ChallengeStatus;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  unlockedAt?: string;
  requirement: {
    type: 'streak' | 'total_saved' | 'challenges_completed' | 'days_logged';
    value: number;
  };
}

export interface UserProfile {
  name: string;
  joinDate: string;
  isPremium: boolean;
  totalSavedAllTime: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  unlockedBadgeIds: string[];
}

export interface DailySavingsEntry {
  date: string;
  amount: number;
  challengeId: string;
  note?: string;
}
