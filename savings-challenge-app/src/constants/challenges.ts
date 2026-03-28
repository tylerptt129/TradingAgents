import { ChallengeTemplate } from '../types';

// Generate 52-week amounts: $1, $2, $3... $52
const generate52WeekAmounts = (): number[] =>
  Array.from({ length: 52 * 7 }, (_, i) => {
    const week = Math.floor(i / 7) + 1;
    return i % 7 === 0 ? week : 0; // Only save on day 1 of each week
  });

// Penny challenge: day 1 = $0.01, day 2 = $0.02, etc.
const generatePennyAmounts = (): number[] =>
  Array.from({ length: 365 }, (_, i) => (i + 1) * 0.01);

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: '52-week',
    name: '52-Week Challenge',
    description:
      'Save incrementally each week — $1 in week 1, $2 in week 2, all the way to $52. You\'ll save $1,378 by the end!',
    type: '52-week',
    durationDays: 364,
    icon: '📅',
    color: '#4CAF50',
    isPremium: false,
    totalSavingsGoal: 1378,
    dailyAmounts: generate52WeekAmounts(),
    rules: [
      'Save the designated amount each week',
      'Mark your savings each week to maintain your streak',
      'You can save ahead but not behind',
    ],
  },
  {
    id: '30-day-no-spend',
    name: '30-Day No-Spend',
    description:
      'Cut out all non-essential spending for 30 days. Track each day you successfully avoid unnecessary purchases.',
    type: '30-day-no-spend',
    durationDays: 30,
    icon: '🚫',
    color: '#FF5722',
    isPremium: false,
    totalSavingsGoal: 500,
    rules: [
      'No eating out or takeout',
      'No online shopping for non-essentials',
      'Groceries and bills are allowed',
      'Log your estimated savings each day',
    ],
  },
  {
    id: 'penny',
    name: 'Penny Challenge',
    description:
      'Start with just one penny and add a penny more each day. By day 365, you\'ll have saved $667.95!',
    type: 'penny',
    durationDays: 365,
    icon: '🪙',
    color: '#FF9800',
    isPremium: false,
    totalSavingsGoal: 667.95,
    dailyAmounts: generatePennyAmounts(),
    rules: [
      'Day 1: save $0.01, Day 2: $0.02, and so on',
      'Each day increases by one penny',
      'Log your savings daily to keep your streak',
    ],
  },
  {
    id: 'round-up',
    name: 'Round-Up Challenge',
    description:
      'Round up every purchase to the nearest dollar and save the difference. Small change adds up fast!',
    type: 'round-up',
    durationDays: 90,
    icon: '⬆️',
    color: '#2196F3',
    isPremium: true,
    totalSavingsGoal: 200,
    rules: [
      'Round every purchase up to the nearest dollar',
      'Save the difference (e.g., $3.40 purchase → save $0.60)',
      'Log your round-ups at the end of each day',
    ],
  },
  {
    id: '100-envelope',
    name: '100 Envelope Challenge',
    description:
      'Number 100 envelopes 1-100. Each day, pick a random envelope and save that dollar amount. Save $5,050 in 100 days!',
    type: '100-envelope',
    durationDays: 100,
    icon: '✉️',
    color: '#9C27B0',
    isPremium: true,
    totalSavingsGoal: 5050,
    rules: [
      'Each day, randomly pick an envelope number (1-100)',
      'Save that dollar amount',
      'Each number can only be used once',
      'Track which envelopes you\'ve completed',
    ],
  },
];
