import {
  formatCurrency,
  getTodayStr,
  getDaysRemaining,
  getDaysElapsed,
  getProgressPercent,
  getDayProgress,
  isTodayLogged,
  calculateStreak,
  getGreeting,
} from '../../src/utils/helpers';
import { ActiveChallenge } from '../../src/types';
import { format, addDays, subDays } from 'date-fns';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats small amounts', () => {
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('formats whole numbers', () => {
    expect(formatCurrency(50)).toBe('$50.00');
  });

  it('formats thousands with commas', () => {
    expect(formatCurrency(1378)).toBe('$1,378.00');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(10500.5)).toBe('$10,500.50');
  });
});

describe('getTodayStr', () => {
  it('returns date in yyyy-MM-dd format', () => {
    const result = getTodayStr();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(format(new Date(), 'yyyy-MM-dd'));
  });
});

describe('getDaysRemaining', () => {
  it('returns 0 for past dates', () => {
    const past = format(subDays(new Date(), 5), 'yyyy-MM-dd');
    expect(getDaysRemaining(past)).toBe(0);
  });

  it('returns positive number for future dates', () => {
    const future = format(addDays(new Date(), 10), 'yyyy-MM-dd');
    // differenceInDays truncates partial days, so result may be 9 or 10
    const result = getDaysRemaining(future);
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(10);
  });
});

describe('getDaysElapsed', () => {
  it('returns 0 for today', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    expect(getDaysElapsed(today)).toBe(0);
  });

  it('returns correct count for past start date', () => {
    const pastDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    expect(getDaysElapsed(pastDate)).toBe(7);
  });
});

describe('getProgressPercent', () => {
  const makeChallenge = (saved: number, goal: number): ActiveChallenge => ({
    id: 'test',
    templateId: 'test',
    name: 'Test',
    type: '52-week',
    icon: '📅',
    color: '#000',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    durationDays: 30,
    completedDays: {},
    savedAmounts: {},
    totalSaved: saved,
    totalGoal: goal,
    currentStreak: 0,
    longestStreak: 0,
    status: 'active',
  });

  it('returns 0 when nothing saved', () => {
    expect(getProgressPercent(makeChallenge(0, 1000))).toBe(0);
  });

  it('returns 0.5 at 50%', () => {
    expect(getProgressPercent(makeChallenge(500, 1000))).toBe(0.5);
  });

  it('caps at 1 when over goal', () => {
    expect(getProgressPercent(makeChallenge(1500, 1000))).toBe(1);
  });

  it('returns 0 when goal is 0', () => {
    expect(getProgressPercent(makeChallenge(100, 0))).toBe(0);
  });
});

describe('isTodayLogged', () => {
  it('returns false when today not logged', () => {
    const challenge: ActiveChallenge = {
      id: 'test',
      templateId: 'test',
      name: 'Test',
      type: '52-week',
      icon: '📅',
      color: '#000',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      durationDays: 30,
      completedDays: {},
      savedAmounts: {},
      totalSaved: 0,
      totalGoal: 1000,
      currentStreak: 0,
      longestStreak: 0,
      status: 'active',
    };
    expect(isTodayLogged(challenge)).toBe(false);
  });

  it('returns true when today is logged', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const challenge: ActiveChallenge = {
      id: 'test',
      templateId: 'test',
      name: 'Test',
      type: '52-week',
      icon: '📅',
      color: '#000',
      startDate: today,
      endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      durationDays: 30,
      completedDays: { [today]: true },
      savedAmounts: { [today]: 10 },
      totalSaved: 10,
      totalGoal: 1000,
      currentStreak: 1,
      longestStreak: 1,
      status: 'active',
    };
    expect(isTodayLogged(challenge)).toBe(true);
  });
});

describe('calculateStreak', () => {
  it('returns 0 for empty days', () => {
    expect(calculateStreak({})).toBe(0);
  });

  it('returns 1 when only today is logged', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    expect(calculateStreak({ [today]: true })).toBe(1);
  });

  it('counts consecutive days', () => {
    const today = new Date();
    const days: Record<string, boolean> = {};
    for (let i = 0; i < 5; i++) {
      days[format(subDays(today, i), 'yyyy-MM-dd')] = true;
    }
    expect(calculateStreak(days)).toBe(5);
  });

  it('breaks streak on missing day', () => {
    const today = new Date();
    const days: Record<string, boolean> = {
      [format(today, 'yyyy-MM-dd')]: true,
      [format(subDays(today, 1), 'yyyy-MM-dd')]: true,
      // Day 2 missing
      [format(subDays(today, 3), 'yyyy-MM-dd')]: true,
    };
    expect(calculateStreak(days)).toBe(2);
  });

  it('returns 0 when today is not logged (streak broken)', () => {
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    expect(calculateStreak({ [yesterday]: false })).toBe(0);
  });
});

describe('getGreeting', () => {
  it('returns a string', () => {
    const result = getGreeting();
    expect(typeof result).toBe('string');
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(result);
  });
});
