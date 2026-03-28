// Type-level tests — verify the types module exports correctly
import {
  Habit,
  HabitCompletion,
  HabitStreak,
  Badge,
  UserProfile,
  DaySummary,
  HabitFrequency,
  DayOfWeek,
  BadgeRarity,
  TimeOfDay,
} from '../src/types';

describe('Type exports', () => {
  it('Habit type can be constructed', () => {
    const habit: Habit = {
      id: 'test',
      name: 'Test',
      icon: '💪',
      gradient: 'violet',
      frequency: 'daily',
      timeOfDay: 'morning',
      targetPerDay: 1,
      createdAt: new Date().toISOString(),
      archived: false,
      order: 0,
    };
    expect(habit.id).toBe('test');
  });

  it('HabitCompletion type works', () => {
    const c: HabitCompletion = {
      habitId: 'h1',
      date: '2025-01-01',
      count: 1,
      completedAt: new Date().toISOString(),
    };
    expect(c.count).toBe(1);
  });

  it('UserProfile type works', () => {
    const p: UserProfile = {
      name: 'Test',
      joinDate: new Date().toISOString(),
      isPremium: false,
      totalCompletions: 0,
      totalPerfectDays: 0,
      longestStreak: 0,
      currentGlobalStreak: 0,
      daysActive: 0,
      unlockedBadgeIds: [],
    };
    expect(p.isPremium).toBe(false);
  });

  it('DaySummary type works', () => {
    const ds: DaySummary = {
      date: '2025-01-01',
      totalHabits: 3,
      completedHabits: 2,
      isPerfect: false,
      completionRate: 0.67,
    };
    expect(ds.completionRate).toBeCloseTo(0.67);
  });

  it('frequency types are valid', () => {
    const freqs: HabitFrequency[] = ['daily', 'weekdays', 'weekends', 'custom'];
    expect(freqs).toHaveLength(4);
  });

  it('BadgeRarity types are valid', () => {
    const rarities: BadgeRarity[] = ['common', 'rare', 'epic', 'legendary'];
    expect(rarities).toHaveLength(4);
  });
});
