import { format, parseISO, subDays, differenceInDays, getDay, startOfWeek, addDays, isToday as isTodayFn } from 'date-fns';
import { Habit, HabitCompletion, DaySummary, DayOfWeek } from '../types';

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(d: string): string {
  return format(parseISO(d), 'MMM d, yyyy');
}

export function formatDateShort(d: string): string {
  return format(parseISO(d), 'MMM d');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Check if a habit is scheduled for a given date */
export function isHabitScheduledForDate(habit: Habit, dateStr: string): boolean {
  const dayOfWeek = getDay(parseISO(dateStr)) as DayOfWeek;
  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return habit.customDays?.includes(dayOfWeek) ?? false;
    default:
      return true;
  }
}

/** Get all habits scheduled for today */
export function getTodaysHabits(habits: Habit[]): Habit[] {
  const today = getTodayStr();
  return habits
    .filter((h) => !h.archived && isHabitScheduledForDate(h, today))
    .sort((a, b) => a.order - b.order);
}

/** Check if a habit is completed for a date */
export function isHabitCompleted(
  habitId: string,
  date: string,
  completions: HabitCompletion[],
  targetPerDay: number,
): boolean {
  const entry = completions.find((c) => c.habitId === habitId && c.date === date);
  return (entry?.count ?? 0) >= targetPerDay;
}

/** Get completion count for a habit on a date */
export function getCompletionCount(
  habitId: string,
  date: string,
  completions: HabitCompletion[],
): number {
  return completions.find((c) => c.habitId === habitId && c.date === date)?.count ?? 0;
}

/** Calculate streak for a single habit */
export function calculateStreak(
  habit: Habit,
  completions: HabitCompletion[],
): { current: number; longest: number } {
  const habitCompletions = completions
    .filter((c) => c.habitId === habit.id && c.count >= habit.targetPerDay)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (habitCompletions.length === 0) return { current: 0, longest: 0 };

  const today = getTodayStr();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Current streak: must include today or yesterday
  let current = 0;
  let checkDate = new Date();

  // If today isn't scheduled, check yesterday
  if (!isHabitScheduledForDate(habit, today)) {
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');

    // Skip non-scheduled days
    if (!isHabitScheduledForDate(habit, dateStr)) {
      checkDate = subDays(checkDate, 1);
      continue;
    }

    if (habitCompletions.includes(dateStr)) {
      current++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }

    // Safety: don't go back more than 400 days
    if (current > 400) break;
  }

  // Longest streak
  let longest = 0;
  let tempStreak = 0;

  // Walk forward through all scheduled dates from creation
  const startDate = parseISO(habit.createdAt.split('T')[0]);
  const endDate = new Date();
  let d = new Date(startDate);

  while (d <= endDate) {
    const dStr = format(d, 'yyyy-MM-dd');
    if (isHabitScheduledForDate(habit, dStr)) {
      if (habitCompletions.includes(dStr)) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    d = addDays(d, 1);
  }

  longest = Math.max(longest, current);

  return { current, longest };
}

/** Calculate day summary for a given date */
export function getDaySummary(
  date: string,
  habits: Habit[],
  completions: HabitCompletion[],
): DaySummary {
  const scheduled = habits.filter((h) => !h.archived && isHabitScheduledForDate(h, date));
  const total = scheduled.length;
  const completed = scheduled.filter((h) =>
    isHabitCompleted(h.id, date, completions, h.targetPerDay),
  ).length;

  return {
    date,
    totalHabits: total,
    completedHabits: completed,
    isPerfect: total > 0 && completed === total,
    completionRate: total > 0 ? completed / total : 0,
  };
}

/** Get global streak (perfect days in a row) */
export function getGlobalStreak(
  habits: Habit[],
  completions: HabitCompletion[],
): number {
  let streak = 0;
  let d = new Date();

  for (let i = 0; i < 400; i++) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const summary = getDaySummary(dateStr, habits, completions);

    if (summary.totalHabits === 0) {
      d = subDays(d, 1);
      continue;
    }

    if (summary.isPerfect) {
      streak++;
      d = subDays(d, 1);
    } else {
      break;
    }
  }

  return streak;
}

/** Generate heat map data for the last N days */
export function getHeatMapData(
  days: number,
  habits: Habit[],
  completions: HabitCompletion[],
): DaySummary[] {
  const result: DaySummary[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
    result.push(getDaySummary(dateStr, habits, completions));
  }
  return result;
}

/** Get week day labels starting from Monday */
export function getWeekDayLabels(): string[] {
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
}

/** Get completion rate for last N days */
export function getCompletionRateForPeriod(
  days: number,
  habits: Habit[],
  completions: HabitCompletion[],
): number {
  const heatMap = getHeatMapData(days, habits, completions);
  const withHabits = heatMap.filter((d) => d.totalHabits > 0);
  if (withHabits.length === 0) return 0;
  return withHabits.reduce((sum, d) => sum + d.completionRate, 0) / withHabits.length;
}
