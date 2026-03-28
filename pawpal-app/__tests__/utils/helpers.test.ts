import {
  getTodayStr,
  formatDate,
  formatTime,
  getPetAge,
  getDaysUntil,
  isOverdue,
  calculateCareStreak,
  formatCurrency,
  getGreeting,
  generateId,
} from '../../src/utils/helpers';
import { format, subDays, addDays, subMonths, subYears } from 'date-fns';

describe('getTodayStr', () => {
  it('returns date in yyyy-MM-dd format', () => {
    expect(getTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    expect(formatDate('2025-06-15')).toBe('Jun 15, 2025');
  });

  it('formats another date', () => {
    expect(formatDate('2025-01-01')).toBe('Jan 1, 2025');
  });
});

describe('formatTime', () => {
  it('formats 24h to 12h AM', () => {
    expect(formatTime('09:30')).toBe('9:30 AM');
  });

  it('formats 24h to 12h PM', () => {
    expect(formatTime('14:00')).toBe('2:00 PM');
  });

  it('formats midnight', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('formats noon', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });
});

describe('getPetAge', () => {
  it('returns Newborn for today', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    expect(getPetAge(today)).toBe('Newborn');
  });

  it('returns months for young pet', () => {
    const sixMonthsAgo = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const result = getPetAge(sixMonthsAgo);
    expect(result).toContain('mo');
  });

  it('returns years for older pet', () => {
    const threeYearsAgo = format(subYears(new Date(), 3), 'yyyy-MM-dd');
    const result = getPetAge(threeYearsAgo);
    expect(result).toContain('yr');
  });
});

describe('getDaysUntil', () => {
  it('returns 0 for past dates', () => {
    const past = format(subDays(new Date(), 5), 'yyyy-MM-dd');
    expect(getDaysUntil(past)).toBe(0);
  });

  it('returns positive for future dates', () => {
    const future = format(addDays(new Date(), 10), 'yyyy-MM-dd');
    const result = getDaysUntil(future);
    expect(result).toBeGreaterThanOrEqual(9);
    expect(result).toBeLessThanOrEqual(10);
  });
});

describe('isOverdue', () => {
  it('returns true for past dates', () => {
    const past = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    expect(isOverdue(past)).toBe(true);
  });

  it('returns false for future dates', () => {
    const future = format(addDays(new Date(), 5), 'yyyy-MM-dd');
    expect(isOverdue(future)).toBe(false);
  });
});

describe('calculateCareStreak', () => {
  it('returns 0 for empty array', () => {
    expect(calculateCareStreak([])).toBe(0);
  });

  it('returns 1 for today only', () => {
    expect(calculateCareStreak([getTodayStr()])).toBe(1);
  });

  it('counts consecutive days', () => {
    const dates = Array.from({ length: 5 }, (_, i) =>
      format(subDays(new Date(), i), 'yyyy-MM-dd'),
    );
    expect(calculateCareStreak(dates)).toBe(5);
  });

  it('breaks on gap', () => {
    const today = new Date();
    const dates = [
      format(today, 'yyyy-MM-dd'),
      format(subDays(today, 1), 'yyyy-MM-dd'),
      // gap on day 2
      format(subDays(today, 3), 'yyyy-MM-dd'),
    ];
    expect(calculateCareStreak(dates)).toBe(2);
  });

  it('returns 0 if no recent activity', () => {
    const oldDate = format(subDays(new Date(), 10), 'yyyy-MM-dd');
    expect(calculateCareStreak([oldDate])).toBe(0);
  });

  it('deduplicates dates', () => {
    const today = getTodayStr();
    expect(calculateCareStreak([today, today, today])).toBe(1);
  });
});

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats with commas', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});

describe('getGreeting', () => {
  it('returns valid greeting', () => {
    const result = getGreeting();
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(result);
  });
});

describe('generateId', () => {
  it('returns unique strings', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('returns non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(5);
  });
});
