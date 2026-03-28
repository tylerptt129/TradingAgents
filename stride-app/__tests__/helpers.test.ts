import { format, subDays, addDays } from 'date-fns';
import {
  getTodayStr,
  formatDate,
  formatDateShort,
  generateId,
  getGreeting,
  isHabitScheduledForDate,
  getTodaysHabits,
  isHabitCompleted,
  getCompletionCount,
  calculateStreak,
  getDaySummary,
  getGlobalStreak,
  getHeatMapData,
  getWeekDayLabels,
  getCompletionRateForPeriod,
} from '../src/utils/helpers';
import { Habit, HabitCompletion } from '../src/types';

// --- Helper factories ---

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    name: 'Test Habit',
    icon: '💪',
    gradient: 'violet',
    frequency: 'daily',
    timeOfDay: 'anytime',
    targetPerDay: 1,
    createdAt: subDays(new Date(), 30).toISOString(),
    archived: false,
    order: 0,
    ...overrides,
  };
}

function makeCompletion(habitId: string, date: string, count = 1): HabitCompletion {
  return {
    habitId,
    date,
    count,
    completedAt: new Date().toISOString(),
  };
}

// --- Tests ---

describe('getTodayStr', () => {
  it('returns today in yyyy-MM-dd format', () => {
    const today = getTodayStr();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today).toBe(format(new Date(), 'yyyy-MM-dd'));
  });
});

describe('formatDate', () => {
  it('formats date string to readable format', () => {
    expect(formatDate('2025-01-15')).toBe('Jan 15, 2025');
  });

  it('handles different months', () => {
    expect(formatDate('2025-12-25')).toBe('Dec 25, 2025');
  });
});

describe('formatDateShort', () => {
  it('formats to short date', () => {
    expect(formatDateShort('2025-06-01')).toBe('Jun 1');
  });
});

describe('generateId', () => {
  it('returns a unique string', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(typeof id1).toBe('string');
    expect(id1).not.toBe(id2);
  });

  it('contains a timestamp portion', () => {
    const id = generateId();
    expect(id).toContain('-');
  });
});

describe('getGreeting', () => {
  it('returns a string greeting', () => {
    const greeting = getGreeting();
    expect(typeof greeting).toBe('string');
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting);
  });
});

describe('isHabitScheduledForDate', () => {
  it('daily habit is always scheduled', () => {
    const habit = makeHabit({ frequency: 'daily' });
    expect(isHabitScheduledForDate(habit, '2025-01-06')).toBe(true); // Monday
    expect(isHabitScheduledForDate(habit, '2025-01-11')).toBe(true); // Saturday
  });

  it('weekday habit only on Mon-Fri', () => {
    const habit = makeHabit({ frequency: 'weekdays' });
    expect(isHabitScheduledForDate(habit, '2025-01-06')).toBe(true);  // Monday
    expect(isHabitScheduledForDate(habit, '2025-01-10')).toBe(true);  // Friday
    expect(isHabitScheduledForDate(habit, '2025-01-11')).toBe(false); // Saturday
    expect(isHabitScheduledForDate(habit, '2025-01-12')).toBe(false); // Sunday
  });

  it('weekend habit only on Sat-Sun', () => {
    const habit = makeHabit({ frequency: 'weekends' });
    expect(isHabitScheduledForDate(habit, '2025-01-06')).toBe(false); // Monday
    expect(isHabitScheduledForDate(habit, '2025-01-11')).toBe(true);  // Saturday
    expect(isHabitScheduledForDate(habit, '2025-01-12')).toBe(true);  // Sunday
  });

  it('custom habit on specific days', () => {
    const habit = makeHabit({ frequency: 'custom', customDays: [1, 3, 5] }); // Mon, Wed, Fri
    expect(isHabitScheduledForDate(habit, '2025-01-06')).toBe(true);  // Monday
    expect(isHabitScheduledForDate(habit, '2025-01-07')).toBe(false); // Tuesday
    expect(isHabitScheduledForDate(habit, '2025-01-08')).toBe(true);  // Wednesday
  });

  it('custom habit with no days returns false', () => {
    const habit = makeHabit({ frequency: 'custom', customDays: undefined });
    expect(isHabitScheduledForDate(habit, '2025-01-06')).toBe(false);
  });
});

describe('getTodaysHabits', () => {
  it('returns non-archived habits scheduled for today', () => {
    const habits = [
      makeHabit({ id: 'h1', frequency: 'daily' }),
      makeHabit({ id: 'h2', archived: true }),
    ];
    const result = getTodaysHabits(habits);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('h1');
  });

  it('returns empty for no habits', () => {
    expect(getTodaysHabits([])).toHaveLength(0);
  });

  it('sorts by order', () => {
    const habits = [
      makeHabit({ id: 'h2', order: 2 }),
      makeHabit({ id: 'h1', order: 1 }),
      makeHabit({ id: 'h3', order: 0 }),
    ];
    const result = getTodaysHabits(habits);
    expect(result.map((h) => h.id)).toEqual(['h3', 'h1', 'h2']);
  });
});

describe('isHabitCompleted', () => {
  it('returns true when count meets target', () => {
    const completions = [makeCompletion('h1', '2025-01-06', 1)];
    expect(isHabitCompleted('h1', '2025-01-06', completions, 1)).toBe(true);
  });

  it('returns false when count is below target', () => {
    const completions = [makeCompletion('h1', '2025-01-06', 2)];
    expect(isHabitCompleted('h1', '2025-01-06', completions, 3)).toBe(false);
  });

  it('returns false when no completion exists', () => {
    expect(isHabitCompleted('h1', '2025-01-06', [], 1)).toBe(false);
  });
});

describe('getCompletionCount', () => {
  it('returns count for matching completion', () => {
    const completions = [makeCompletion('h1', '2025-01-06', 3)];
    expect(getCompletionCount('h1', '2025-01-06', completions)).toBe(3);
  });

  it('returns 0 when no match', () => {
    expect(getCompletionCount('h1', '2025-01-06', [])).toBe(0);
  });
});

describe('calculateStreak', () => {
  it('returns 0 for no completions', () => {
    const habit = makeHabit();
    const result = calculateStreak(habit, []);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
  });

  it('calculates current streak from today', () => {
    const habit = makeHabit();
    const today = getTodayStr();
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const completions = [
      makeCompletion('h1', today),
      makeCompletion('h1', yesterday),
    ];
    const result = calculateStreak(habit, completions);
    expect(result.current).toBeGreaterThanOrEqual(2);
  });

  it('streak breaks on missed day', () => {
    const habit = makeHabit();
    const today = getTodayStr();
    const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
    const completions = [
      makeCompletion('h1', today),
      makeCompletion('h1', twoDaysAgo),
      // Yesterday is missing = break
    ];
    const result = calculateStreak(habit, completions);
    expect(result.current).toBe(1);
  });

  it('skips non-scheduled days for weekday habits', () => {
    // Create a weekday-only habit
    const habit = makeHabit({ frequency: 'weekdays' });

    // Build a streak of consecutive weekdays ending today (or the most recent weekday)
    let d = new Date();
    // Go back to most recent weekday if today is weekend
    while (d.getDay() === 0 || d.getDay() === 6) d = subDays(d, 1);

    // Complete consecutive weekdays going backwards
    const completions: HabitCompletion[] = [];
    let count = 0;
    let check = new Date(d);
    while (count < 5) {
      if (check.getDay() >= 1 && check.getDay() <= 5) {
        completions.push(makeCompletion('h1', format(check, 'yyyy-MM-dd')));
        count++;
      }
      check = subDays(check, 1);
    }

    const result = calculateStreak(habit, completions);
    // Should be 5 weekdays (skipping weekends)
    expect(result.current).toBe(5);
  });

  it('tracks longest streak', () => {
    const habit = makeHabit({
      createdAt: subDays(new Date(), 10).toISOString(),
    });
    // Create 5-day streak ending 6 days ago, then gap, then 2-day current
    const completions: HabitCompletion[] = [];
    for (let i = 10; i >= 6; i--) {
      completions.push(makeCompletion('h1', format(subDays(new Date(), i), 'yyyy-MM-dd')));
    }
    // Today and yesterday
    completions.push(makeCompletion('h1', getTodayStr()));
    completions.push(makeCompletion('h1', format(subDays(new Date(), 1), 'yyyy-MM-dd')));

    const result = calculateStreak(habit, completions);
    expect(result.current).toBe(2);
    expect(result.longest).toBe(5);
  });
});

describe('getDaySummary', () => {
  it('returns correct summary for a day', () => {
    const habits = [
      makeHabit({ id: 'h1' }),
      makeHabit({ id: 'h2' }),
    ];
    const completions = [makeCompletion('h1', '2025-01-06')];
    const summary = getDaySummary('2025-01-06', habits, completions);
    expect(summary.totalHabits).toBe(2);
    expect(summary.completedHabits).toBe(1);
    expect(summary.completionRate).toBe(0.5);
    expect(summary.isPerfect).toBe(false);
  });

  it('marks perfect day when all habits done', () => {
    const habits = [makeHabit({ id: 'h1' })];
    const completions = [makeCompletion('h1', '2025-01-06')];
    const summary = getDaySummary('2025-01-06', habits, completions);
    expect(summary.isPerfect).toBe(true);
    expect(summary.completionRate).toBe(1);
  });

  it('handles no habits scheduled', () => {
    const summary = getDaySummary('2025-01-06', [], []);
    expect(summary.totalHabits).toBe(0);
    expect(summary.completionRate).toBe(0);
    expect(summary.isPerfect).toBe(false);
  });

  it('excludes archived habits', () => {
    const habits = [
      makeHabit({ id: 'h1' }),
      makeHabit({ id: 'h2', archived: true }),
    ];
    const completions = [makeCompletion('h1', '2025-01-06')];
    const summary = getDaySummary('2025-01-06', habits, completions);
    expect(summary.totalHabits).toBe(1);
    expect(summary.isPerfect).toBe(true);
  });

  it('respects targetPerDay for multi-target habits', () => {
    const habits = [makeHabit({ id: 'h1', targetPerDay: 3 })];
    const completions = [makeCompletion('h1', '2025-01-06', 2)]; // only 2 of 3
    const summary = getDaySummary('2025-01-06', habits, completions);
    expect(summary.completedHabits).toBe(0);
    expect(summary.isPerfect).toBe(false);
  });
});

describe('getGlobalStreak', () => {
  it('returns 0 with no completions', () => {
    expect(getGlobalStreak([], [])).toBe(0);
  });

  it('counts consecutive perfect days', () => {
    const habits = [makeHabit({ id: 'h1' })];
    const today = getTodayStr();
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const completions = [
      makeCompletion('h1', today),
      makeCompletion('h1', yesterday),
    ];
    const result = getGlobalStreak(habits, completions);
    expect(result).toBeGreaterThanOrEqual(2);
  });

  it('breaks on imperfect day', () => {
    const habits = [
      makeHabit({ id: 'h1' }),
      makeHabit({ id: 'h2' }),
    ];
    const today = getTodayStr();
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const completions = [
      // Today: only h1 done (not perfect)
      makeCompletion('h1', today),
      // Yesterday: both done (perfect)
      makeCompletion('h1', yesterday),
      makeCompletion('h2', yesterday),
    ];
    const result = getGlobalStreak(habits, completions);
    expect(result).toBe(0); // Today is not perfect, so streak is 0
  });
});

describe('getHeatMapData', () => {
  it('returns correct number of days', () => {
    const data = getHeatMapData(7, [], []);
    expect(data).toHaveLength(7);
  });

  it('days are in chronological order', () => {
    const data = getHeatMapData(3, [], []);
    expect(data[0].date < data[1].date).toBe(true);
    expect(data[1].date < data[2].date).toBe(true);
  });

  it('last day is today', () => {
    const data = getHeatMapData(7, [], []);
    expect(data[data.length - 1].date).toBe(getTodayStr());
  });
});

describe('getWeekDayLabels', () => {
  it('returns 7 day labels', () => {
    const labels = getWeekDayLabels();
    expect(labels).toHaveLength(7);
    expect(labels[0]).toBe('M');
    expect(labels[6]).toBe('S');
  });
});

describe('getCompletionRateForPeriod', () => {
  it('returns 0 with no habits', () => {
    expect(getCompletionRateForPeriod(7, [], [])).toBe(0);
  });

  it('returns 1 for fully completed period', () => {
    const habits = [makeHabit({ id: 'h1' })];
    const completions: HabitCompletion[] = [];
    for (let i = 0; i < 7; i++) {
      completions.push(makeCompletion('h1', format(subDays(new Date(), i), 'yyyy-MM-dd')));
    }
    const rate = getCompletionRateForPeriod(7, habits, completions);
    expect(rate).toBe(1);
  });

  it('returns partial rate for incomplete period', () => {
    const habits = [makeHabit({ id: 'h1' })];
    const completions = [makeCompletion('h1', getTodayStr())];
    const rate = getCompletionRateForPeriod(7, habits, completions);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(1);
  });
});
