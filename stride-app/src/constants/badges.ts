import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  // Streak
  { id: 's3', name: 'Spark', description: '3-day streak on any habit', icon: '🔥', rarity: 'common', requirement: { type: 'streak', value: 3 } },
  { id: 's7', name: 'On Fire', description: '7-day streak', icon: '⚡', rarity: 'common', requirement: { type: 'streak', value: 7 } },
  { id: 's14', name: 'Fortnight', description: '14-day streak', icon: '💫', rarity: 'rare', requirement: { type: 'streak', value: 14 } },
  { id: 's30', name: 'Unstoppable', description: '30-day streak', icon: '🌟', rarity: 'rare', requirement: { type: 'streak', value: 30 } },
  { id: 's60', name: 'Ironclad', description: '60-day streak', icon: '🏆', rarity: 'epic', requirement: { type: 'streak', value: 60 } },
  { id: 's100', name: 'Centurion', description: '100-day streak', icon: '👑', rarity: 'epic', requirement: { type: 'streak', value: 100 } },
  { id: 's365', name: 'Transcendent', description: '365-day streak', icon: '🌌', rarity: 'legendary', requirement: { type: 'streak', value: 365 } },

  // Total completions
  { id: 'c10', name: 'Getting Started', description: 'Complete 10 habits', icon: '✅', rarity: 'common', requirement: { type: 'total_completions', value: 10 } },
  { id: 'c50', name: 'Building Momentum', description: '50 completions', icon: '📈', rarity: 'common', requirement: { type: 'total_completions', value: 50 } },
  { id: 'c200', name: 'In the Zone', description: '200 completions', icon: '🎯', rarity: 'rare', requirement: { type: 'total_completions', value: 200 } },
  { id: 'c500', name: 'Habit Machine', description: '500 completions', icon: '⚙️', rarity: 'epic', requirement: { type: 'total_completions', value: 500 } },
  { id: 'c1000', name: 'Thousand Strong', description: '1,000 completions', icon: '💎', rarity: 'legendary', requirement: { type: 'total_completions', value: 1000 } },

  // Perfect days
  { id: 'p1', name: 'Perfect Day', description: 'Complete all habits in one day', icon: '🌈', rarity: 'common', requirement: { type: 'perfect_days', value: 1 } },
  { id: 'p7', name: 'Perfect Week', description: '7 perfect days', icon: '🗓️', rarity: 'rare', requirement: { type: 'perfect_days', value: 7 } },
  { id: 'p30', name: 'Flawless Month', description: '30 perfect days', icon: '🏅', rarity: 'epic', requirement: { type: 'perfect_days', value: 30 } },

  // Habits created
  { id: 'h1', name: 'First Step', description: 'Create your first habit', icon: '🐾', rarity: 'common', requirement: { type: 'habits_created', value: 1 } },
  { id: 'h5', name: 'Routine Builder', description: 'Create 5 habits', icon: '🏗️', rarity: 'rare', requirement: { type: 'habits_created', value: 5 } },
  { id: 'h10', name: 'Life Architect', description: 'Create 10 habits', icon: '🏛️', rarity: 'epic', requirement: { type: 'habits_created', value: 10 } },

  // Days active
  { id: 'd7', name: 'Week One', description: 'Use Stride for 7 days', icon: '📅', rarity: 'common', requirement: { type: 'days_active', value: 7 } },
  { id: 'd30', name: 'Monthly Regular', description: '30 days active', icon: '📆', rarity: 'rare', requirement: { type: 'days_active', value: 30 } },
  { id: 'd100', name: 'Committed', description: '100 days active', icon: '🎖️', rarity: 'epic', requirement: { type: 'days_active', value: 100 } },
];
