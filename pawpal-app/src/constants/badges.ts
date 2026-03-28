import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  // Care streak badges
  {
    id: 'streak-3',
    name: 'Caring Start',
    description: 'Log pet care for 3 days in a row',
    icon: '🔥',
    rarity: 'common',
    requirement: { type: 'care_streak', value: 3 },
  },
  {
    id: 'streak-7',
    name: 'Devoted Owner',
    description: '7-day care streak',
    icon: '⭐',
    rarity: 'common',
    requirement: { type: 'care_streak', value: 7 },
  },
  {
    id: 'streak-30',
    name: 'Super Pawrent',
    description: '30-day care streak',
    icon: '🏆',
    rarity: 'rare',
    requirement: { type: 'care_streak', value: 30 },
  },
  {
    id: 'streak-100',
    name: 'Pet Whisperer',
    description: '100-day care streak',
    icon: '👑',
    rarity: 'epic',
    requirement: { type: 'care_streak', value: 100 },
  },
  {
    id: 'streak-365',
    name: 'Legendary Guardian',
    description: 'A full year of daily care',
    icon: '🌟',
    rarity: 'legendary',
    requirement: { type: 'care_streak', value: 365 },
  },

  // Journal badges
  {
    id: 'journal-1',
    name: 'Dear Diary',
    description: 'Write your first journal entry',
    icon: '📝',
    rarity: 'common',
    requirement: { type: 'journal_entries', value: 1 },
  },
  {
    id: 'journal-10',
    name: 'Memory Keeper',
    description: 'Write 10 journal entries',
    icon: '📖',
    rarity: 'rare',
    requirement: { type: 'journal_entries', value: 10 },
  },
  {
    id: 'journal-50',
    name: 'Storyteller',
    description: 'Write 50 journal entries',
    icon: '📚',
    rarity: 'epic',
    requirement: { type: 'journal_entries', value: 50 },
  },

  // Vet badges
  {
    id: 'vet-1',
    name: 'Health First',
    description: 'Complete your first vet visit',
    icon: '🏥',
    rarity: 'common',
    requirement: { type: 'vet_visits', value: 1 },
  },
  {
    id: 'vet-5',
    name: 'Regular Checkups',
    description: 'Complete 5 vet visits',
    icon: '💉',
    rarity: 'rare',
    requirement: { type: 'vet_visits', value: 5 },
  },

  // Pets added
  {
    id: 'pet-1',
    name: 'First Fur Baby',
    description: 'Add your first pet',
    icon: '🐾',
    rarity: 'common',
    requirement: { type: 'pets_added', value: 1 },
  },
  {
    id: 'pet-3',
    name: 'Growing Family',
    description: 'Add 3 pets to your family',
    icon: '🏠',
    rarity: 'rare',
    requirement: { type: 'pets_added', value: 3 },
  },
  {
    id: 'pet-5',
    name: 'Pet Paradise',
    description: 'Add 5 pets to your family',
    icon: '🌈',
    rarity: 'epic',
    requirement: { type: 'pets_added', value: 5 },
  },

  // Days active
  {
    id: 'active-7',
    name: 'Week One',
    description: 'Use PawPal for 7 days',
    icon: '📅',
    rarity: 'common',
    requirement: { type: 'days_active', value: 7 },
  },
  {
    id: 'active-30',
    name: 'Monthly Regular',
    description: 'Use PawPal for 30 days',
    icon: '🗓️',
    rarity: 'rare',
    requirement: { type: 'days_active', value: 30 },
  },

  // Photos
  {
    id: 'photo-1',
    name: 'Say Cheese!',
    description: 'Add your first pet photo',
    icon: '📸',
    rarity: 'common',
    requirement: { type: 'photos_taken', value: 1 },
  },
  {
    id: 'photo-25',
    name: 'Pawtographer',
    description: 'Take 25 pet photos',
    icon: '🖼️',
    rarity: 'rare',
    requirement: { type: 'photos_taken', value: 25 },
  },
  {
    id: 'photo-100',
    name: 'Pet Influencer',
    description: 'Take 100 pet photos',
    icon: '🎬',
    rarity: 'epic',
    requirement: { type: 'photos_taken', value: 100 },
  },
];
