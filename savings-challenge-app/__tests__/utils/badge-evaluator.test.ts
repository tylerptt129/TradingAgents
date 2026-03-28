import { ALL_BADGES } from '../../src/constants/badges';
import { UserProfile } from '../../src/types';

/**
 * Tests for badge evaluation logic.
 * This mirrors the badge checking in AppContext.tsx.
 */
function evaluateBadges(profile: UserProfile): string[] {
  const earned: string[] = [];
  ALL_BADGES.forEach((badge) => {
    let qualified = false;
    switch (badge.requirement.type) {
      case 'streak':
        qualified = profile.longestStreak >= badge.requirement.value;
        break;
      case 'total_saved':
        qualified = profile.totalSavedAllTime >= badge.requirement.value;
        break;
      case 'challenges_completed':
        qualified = profile.challengesCompleted >= badge.requirement.value;
        break;
      case 'days_logged':
        qualified = profile.totalDaysLogged >= badge.requirement.value;
        break;
    }
    if (qualified) earned.push(badge.id);
  });
  return earned;
}

const makeProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  name: 'Tester',
  joinDate: new Date().toISOString(),
  isPremium: false,
  totalSavedAllTime: 0,
  challengesCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysLogged: 0,
  unlockedBadgeIds: [],
  ...overrides,
});

describe('Badge Evaluator', () => {
  it('returns empty for brand new user', () => {
    const badges = evaluateBadges(makeProfile());
    expect(badges).toEqual([]);
  });

  it('unlocks streak-3 at 3-day streak', () => {
    const badges = evaluateBadges(makeProfile({ longestStreak: 3 }));
    expect(badges).toContain('streak-3');
    expect(badges).not.toContain('streak-7');
  });

  it('unlocks multiple streak badges at 30-day streak', () => {
    const badges = evaluateBadges(makeProfile({ longestStreak: 30 }));
    expect(badges).toContain('streak-3');
    expect(badges).toContain('streak-7');
    expect(badges).toContain('streak-30');
    expect(badges).not.toContain('streak-100');
  });

  it('unlocks saved-50 at $50', () => {
    const badges = evaluateBadges(makeProfile({ totalSavedAllTime: 50 }));
    expect(badges).toContain('saved-50');
    expect(badges).not.toContain('saved-250');
  });

  it('unlocks saved-1000 at $1000 (also unlocks lower tiers)', () => {
    const badges = evaluateBadges(makeProfile({ totalSavedAllTime: 1000 }));
    expect(badges).toContain('saved-50');
    expect(badges).toContain('saved-250');
    expect(badges).toContain('saved-1000');
    expect(badges).not.toContain('saved-5000');
  });

  it('unlocks challenge-1 at 1 completion', () => {
    const badges = evaluateBadges(makeProfile({ challengesCompleted: 1 }));
    expect(badges).toContain('challenge-1');
    expect(badges).not.toContain('challenge-3');
  });

  it('unlocks logged-7 at 7 days logged', () => {
    const badges = evaluateBadges(makeProfile({ totalDaysLogged: 7 }));
    expect(badges).toContain('logged-7');
    expect(badges).not.toContain('logged-50');
  });

  it('unlocks all badges for maxed-out profile', () => {
    const badges = evaluateBadges(
      makeProfile({
        longestStreak: 365,
        totalSavedAllTime: 5000,
        challengesCompleted: 10,
        totalDaysLogged: 200,
      }),
    );
    expect(badges.length).toBe(ALL_BADGES.length);
  });

  it('handles mixed achievements correctly', () => {
    const badges = evaluateBadges(
      makeProfile({
        longestStreak: 7,
        totalSavedAllTime: 250,
        challengesCompleted: 0,
        totalDaysLogged: 50,
      }),
    );
    expect(badges).toContain('streak-3');
    expect(badges).toContain('streak-7');
    expect(badges).toContain('saved-50');
    expect(badges).toContain('saved-250');
    expect(badges).toContain('logged-7');
    expect(badges).toContain('logged-50');
    expect(badges).not.toContain('challenge-1');
    expect(badges).not.toContain('streak-30');
  });
});
