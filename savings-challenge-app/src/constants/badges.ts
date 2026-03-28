import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  // Streak badges
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    rarity: 'common',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    rarity: 'rare',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'streak-100',
    name: 'Centurion Saver',
    description: 'Maintain a 100-day streak',
    icon: '🏆',
    rarity: 'epic',
    requirement: { type: 'streak', value: 100 },
  },
  {
    id: 'streak-365',
    name: 'Year of Discipline',
    description: 'Maintain a 365-day streak',
    icon: '👑',
    rarity: 'legendary',
    requirement: { type: 'streak', value: 365 },
  },

  // Total saved badges
  {
    id: 'saved-50',
    name: 'First Fifty',
    description: 'Save $50 total',
    icon: '💵',
    rarity: 'common',
    requirement: { type: 'total_saved', value: 50 },
  },
  {
    id: 'saved-250',
    name: 'Quarter Grand',
    description: 'Save $250 total',
    icon: '💰',
    rarity: 'rare',
    requirement: { type: 'total_saved', value: 250 },
  },
  {
    id: 'saved-1000',
    name: 'Grand Saver',
    description: 'Save $1,000 total',
    icon: '🤑',
    rarity: 'epic',
    requirement: { type: 'total_saved', value: 1000 },
  },
  {
    id: 'saved-5000',
    name: 'Money Machine',
    description: 'Save $5,000 total',
    icon: '🏦',
    rarity: 'legendary',
    requirement: { type: 'total_saved', value: 5000 },
  },

  // Challenges completed badges
  {
    id: 'challenge-1',
    name: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '✅',
    rarity: 'common',
    requirement: { type: 'challenges_completed', value: 1 },
  },
  {
    id: 'challenge-3',
    name: 'Triple Threat',
    description: 'Complete 3 challenges',
    icon: '🎯',
    rarity: 'rare',
    requirement: { type: 'challenges_completed', value: 3 },
  },
  {
    id: 'challenge-10',
    name: 'Challenge Champion',
    description: 'Complete 10 challenges',
    icon: '🏅',
    rarity: 'epic',
    requirement: { type: 'challenges_completed', value: 10 },
  },

  // Days logged badges
  {
    id: 'logged-7',
    name: 'First Week',
    description: 'Log savings for 7 days',
    icon: '📝',
    rarity: 'common',
    requirement: { type: 'days_logged', value: 7 },
  },
  {
    id: 'logged-50',
    name: 'Dedicated Logger',
    description: 'Log savings for 50 days',
    icon: '📊',
    rarity: 'rare',
    requirement: { type: 'days_logged', value: 50 },
  },
  {
    id: 'logged-200',
    name: 'Data Devotee',
    description: 'Log savings for 200 days',
    icon: '📈',
    rarity: 'epic',
    requirement: { type: 'days_logged', value: 200 },
  },
];
