export const COLORS = {
  // Primary - warm orange
  primary: '#FF6B4A',
  primaryLight: '#FF8A6E',
  primaryDark: '#E04E30',

  // Secondary - soft teal
  secondary: '#4ECDC4',
  secondaryLight: '#7EDDD6',

  // Accent - golden
  accent: '#FFD93D',
  accentDark: '#F0C929',

  // Backgrounds - warm cream
  background: '#FFF8F0',
  backgroundDark: '#FFF0E0',
  card: '#FFFFFF',
  cardAlt: '#FFF5EB',

  // Text
  text: '#2D2D3A',
  textSecondary: '#7A7A8E',
  textMuted: '#B5B5C5',

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Pet moods
  moodHappy: '#FFD93D',
  moodPlayful: '#FF6B4A',
  moodSleepy: '#9C8FFF',
  moodHungry: '#FF9800',
  moodSick: '#F44336',
  moodAnxious: '#78909C',

  // Badge rarities
  badgeCommon: '#9E9E9E',
  badgeRare: '#2196F3',
  badgeEpic: '#9C27B0',
  badgeLegendary: '#FF9800',

  // Misc
  border: '#F0E6DA',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.4)',
};

export const PET_TYPE_EMOJIS: Record<string, string> = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  fish: '🐠',
  rabbit: '🐰',
  hamster: '🐹',
  reptile: '🦎',
  other: '🐾',
};

export const MOOD_CONFIG: Record<string, { emoji: string; color: string; label: string }> = {
  happy: { emoji: '😊', color: COLORS.moodHappy, label: 'Happy' },
  playful: { emoji: '🎾', color: COLORS.moodPlayful, label: 'Playful' },
  sleepy: { emoji: '😴', color: COLORS.moodSleepy, label: 'Sleepy' },
  hungry: { emoji: '🍽️', color: COLORS.moodHungry, label: 'Hungry' },
  sick: { emoji: '🤒', color: COLORS.moodSick, label: 'Sick' },
  anxious: { emoji: '😟', color: COLORS.moodAnxious, label: 'Anxious' },
};

export const ACTIVITY_CONFIG: Record<string, { emoji: string; label: string }> = {
  feeding: { emoji: '🍖', label: 'Feeding' },
  medication: { emoji: '💊', label: 'Medication' },
  vet: { emoji: '🏥', label: 'Vet Visit' },
  grooming: { emoji: '✂️', label: 'Grooming' },
  walk: { emoji: '🚶', label: 'Walk' },
  play: { emoji: '🎾', label: 'Playtime' },
  bath: { emoji: '🛁', label: 'Bath' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  hero: 36,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
