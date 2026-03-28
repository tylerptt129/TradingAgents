import { GradientName } from './theme';

/**
 * Pre-built habit presets for quick setup.
 * Curated so users can get started in 5 seconds.
 */
export interface HabitPreset {
  name: string;
  icon: string;
  gradient: GradientName;
  category: string;
}

export const HABIT_PRESETS: HabitPreset[] = [
  // Health
  { name: 'Drink Water', icon: '💧', gradient: 'sky', category: 'Health' },
  { name: 'Exercise', icon: '💪', gradient: 'coral', category: 'Health' },
  { name: 'Take Vitamins', icon: '💊', gradient: 'mint', category: 'Health' },
  { name: 'Sleep 8 Hours', icon: '😴', gradient: 'indigo', category: 'Health' },
  { name: 'Meditate', icon: '🧘', gradient: 'violet', category: 'Health' },
  { name: 'Stretch', icon: '🤸', gradient: 'teal', category: 'Health' },
  { name: 'Walk 10K Steps', icon: '🚶', gradient: 'emerald', category: 'Health' },
  { name: 'No Sugar', icon: '🍬', gradient: 'rose', category: 'Health' },

  // Mind
  { name: 'Read', icon: '📚', gradient: 'amber', category: 'Mind' },
  { name: 'Journal', icon: '📝', gradient: 'violet', category: 'Mind' },
  { name: 'Practice Gratitude', icon: '🙏', gradient: 'mint', category: 'Mind' },
  { name: 'Learn a Language', icon: '🗣️', gradient: 'sky', category: 'Mind' },
  { name: 'No Phone Before Bed', icon: '📵', gradient: 'fuchsia', category: 'Mind' },
  { name: 'Deep Breathing', icon: '🌬️', gradient: 'teal', category: 'Mind' },

  // Productivity
  { name: 'Plan My Day', icon: '📋', gradient: 'indigo', category: 'Productivity' },
  { name: 'Code for 1 Hour', icon: '💻', gradient: 'cyan', category: 'Productivity' },
  { name: 'Practice Music', icon: '🎵', gradient: 'fuchsia', category: 'Productivity' },
  { name: 'Create Something', icon: '🎨', gradient: 'orange', category: 'Productivity' },
  { name: 'Focus Session', icon: '🎯', gradient: 'coral', category: 'Productivity' },

  // Self Care
  { name: 'Skincare Routine', icon: '✨', gradient: 'rose', category: 'Self Care' },
  { name: 'Floss', icon: '🦷', gradient: 'sky', category: 'Self Care' },
  { name: 'Cook a Meal', icon: '🍳', gradient: 'orange', category: 'Self Care' },
  { name: 'Tidy Up', icon: '🧹', gradient: 'emerald', category: 'Self Care' },
  { name: 'Budget Check', icon: '💰', gradient: 'amber', category: 'Self Care' },
  { name: 'Water Plants', icon: '🌱', gradient: 'mint', category: 'Self Care' },
];

export const PRESET_CATEGORIES = [...new Set(HABIT_PRESETS.map((p) => p.category))];
