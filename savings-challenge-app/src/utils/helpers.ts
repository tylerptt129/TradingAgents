import { format, differenceInDays, isToday, parseISO } from 'date-fns';
import { ActiveChallenge } from '../types';

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDaysRemaining(endDate: string): number {
  return Math.max(0, differenceInDays(parseISO(endDate), new Date()));
}

export function getDaysElapsed(startDate: string): number {
  return differenceInDays(new Date(), parseISO(startDate));
}

export function getProgressPercent(challenge: ActiveChallenge): number {
  if (challenge.totalGoal <= 0) return 0;
  return Math.min(1, challenge.totalSaved / challenge.totalGoal);
}

export function getDayProgress(challenge: ActiveChallenge): number {
  const elapsed = getDaysElapsed(challenge.startDate);
  return Math.min(1, elapsed / challenge.durationDays);
}

export function isTodayLogged(challenge: ActiveChallenge): boolean {
  return !!challenge.completedDays[getTodayStr()];
}

export function calculateStreak(completedDays: Record<string, boolean>): number {
  const today = new Date();
  let streak = 0;
  let current = new Date(today);

  while (true) {
    const dateStr = format(current, 'yyyy-MM-dd');
    if (completedDays[dateStr]) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
