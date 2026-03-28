/**
 * Stride Design System
 *
 * Philosophy: Deep space blacks with luminous gradients.
 * Every color is intentional. Every spacing is rhythmic.
 * Cards float. Completions glow. Progress radiates.
 */

export const COLORS = {
  // Canvas — deep, rich blacks with warm undertones
  bg: '#0A0A1A',
  bgElevated: '#12122A',
  bgCard: '#1A1A36',
  bgCardHover: '#222244',
  bgSurface: '#14142B',

  // Primary — electric violet
  primary: '#7C5CFC',
  primaryLight: '#9B82FF',
  primarySoft: 'rgba(124, 92, 252, 0.12)',
  primaryGlow: 'rgba(124, 92, 252, 0.25)',

  // Accent — coral sunrise
  accent: '#FF6B6B',
  accentSoft: 'rgba(255, 107, 107, 0.12)',

  // Success — mint
  success: '#34D399',
  successSoft: 'rgba(52, 211, 153, 0.12)',
  successGlow: 'rgba(52, 211, 153, 0.3)',

  // Warning — amber
  warning: '#FBBF24',
  warningSoft: 'rgba(251, 191, 36, 0.12)',

  // Error — rose
  error: '#F87171',

  // Text hierarchy
  text: '#F8F8FF',
  textSecondary: '#9999BB',
  textMuted: '#555577',
  textGhost: '#333355',

  // Borders
  border: '#2A2A4A',
  borderLight: '#1E1E3E',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.4)',
  glow: 'rgba(124, 92, 252, 0.15)',
};

// Gradient presets for habit cards — each habit gets a unique gradient
export const GRADIENTS = {
  violet:   ['#7C5CFC', '#B794F6'] as [string, string],
  coral:    ['#FF6B6B', '#FFA07A'] as [string, string],
  mint:     ['#34D399', '#6EE7B7'] as [string, string],
  sky:      ['#38BDF8', '#7DD3FC'] as [string, string],
  amber:    ['#FBBF24', '#FDE68A'] as [string, string],
  rose:     ['#FB7185', '#FDA4AF'] as [string, string],
  teal:     ['#2DD4BF', '#5EEAD4'] as [string, string],
  indigo:   ['#818CF8', '#A5B4FC'] as [string, string],
  orange:   ['#FB923C', '#FDBA74'] as [string, string],
  emerald:  ['#10B981', '#6EE7B7'] as [string, string],
  fuchsia:  ['#D946EF', '#E879F9'] as [string, string],
  cyan:     ['#22D3EE', '#67E8F9'] as [string, string],
};

export type GradientName = keyof typeof GRADIENTS;

export const GRADIENT_NAMES: GradientName[] = Object.keys(GRADIENTS) as GradientName[];

// Habit icon library — curated set for beautiful cards
export const HABIT_ICONS: Record<string, string> = {
  // Health & Fitness
  run: '🏃',
  gym: '💪',
  yoga: '🧘',
  water: '💧',
  sleep: '😴',
  meditate: '🧠',
  stretch: '🤸',
  bike: '🚴',
  swim: '🏊',
  walk: '🚶',

  // Wellness
  journal: '📝',
  read: '📚',
  vitamins: '💊',
  skincare: '✨',
  breathe: '🌬️',
  gratitude: '🙏',
  noPhone: '📵',
  earlyBird: '🌅',

  // Productivity
  code: '💻',
  study: '📖',
  plan: '📋',
  focus: '🎯',
  create: '🎨',
  practice: '🎵',
  language: '🗣️',

  // Lifestyle
  cook: '🍳',
  clean: '🧹',
  budget: '💰',
  plants: '🌱',
  noSugar: '🍬',
  floss: '🦷',
};

export const SP = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const FS = {
  caption: 11,
  small: 13,
  body: 15,
  callout: 16,
  headline: 17,
  title3: 20,
  title2: 24,
  title1: 28,
  largeTitle: 34,
  hero: 48,
} as const;

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

// Card elevation — floating cards
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
  elevation: 8,
};

export const CARD_SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
};
