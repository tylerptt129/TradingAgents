import { format, parseISO, differenceInDays, differenceInYears, differenceInMonths, subDays, isToday } from 'date-fns';
import { Pet, VetAppointment } from '../types';

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getPetAge(birthday: string): string {
  const born = parseISO(birthday);
  const now = new Date();
  const years = differenceInYears(now, born);
  const months = differenceInMonths(now, born) % 12;

  if (years === 0 && months === 0) return 'Newborn';
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr`;
  return `${years}yr ${months}mo`;
}

export function getDaysUntil(dateStr: string): number {
  return Math.max(0, differenceInDays(parseISO(dateStr), new Date()));
}

export function isOverdue(dateStr: string): boolean {
  return differenceInDays(new Date(), parseISO(dateStr)) > 0;
}

export function getUpcomingAppointments(appointments: VetAppointment[]): VetAppointment[] {
  const today = getTodayStr();
  return appointments
    .filter((a) => !a.completed && a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateCareStreak(careDates: string[]): number {
  if (careDates.length === 0) return 0;

  const sortedDates = [...new Set(careDates)].sort().reverse();
  const today = getTodayStr();

  // Must include today or yesterday to have an active streak
  if (sortedDates[0] !== today && sortedDates[0] !== format(subDays(new Date(), 1), 'yyyy-MM-dd')) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = parseISO(sortedDates[i - 1]);
    const curr = parseISO(sortedDates[i]);
    if (differenceInDays(prev, curr) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
