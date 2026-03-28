import { ALL_BADGES } from '../../src/constants/badges';
import { UserProfile } from '../../src/types';

function evaluateBadges(profile: UserProfile, petCount: number): string[] {
  const earned: string[] = [];
  ALL_BADGES.forEach((badge) => {
    let qualified = false;
    switch (badge.requirement.type) {
      case 'care_streak':
        qualified = profile.longestCareStreak >= badge.requirement.value;
        break;
      case 'journal_entries':
        qualified = profile.totalJournalEntries >= badge.requirement.value;
        break;
      case 'vet_visits':
        qualified = profile.totalVetVisits >= badge.requirement.value;
        break;
      case 'pets_added':
        qualified = petCount >= badge.requirement.value;
        break;
      case 'days_active':
        qualified = profile.totalDaysActive >= badge.requirement.value;
        break;
      case 'photos_taken':
        qualified = profile.totalPhotos >= badge.requirement.value;
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
  careStreak: 0,
  longestCareStreak: 0,
  totalDaysActive: 0,
  totalVetVisits: 0,
  totalJournalEntries: 0,
  totalPhotos: 0,
  unlockedBadgeIds: [],
  ...overrides,
});

describe('Badge Evaluator', () => {
  it('returns empty for new user', () => {
    expect(evaluateBadges(makeProfile(), 0)).toEqual([]);
  });

  it('unlocks streak-3 at 3-day streak', () => {
    const badges = evaluateBadges(makeProfile({ longestCareStreak: 3 }), 0);
    expect(badges).toContain('streak-3');
    expect(badges).not.toContain('streak-7');
  });

  it('unlocks multiple streak badges at 30', () => {
    const badges = evaluateBadges(makeProfile({ longestCareStreak: 30 }), 0);
    expect(badges).toContain('streak-3');
    expect(badges).toContain('streak-7');
    expect(badges).toContain('streak-30');
    expect(badges).not.toContain('streak-100');
  });

  it('unlocks pet-1 when 1 pet added', () => {
    const badges = evaluateBadges(makeProfile(), 1);
    expect(badges).toContain('pet-1');
    expect(badges).not.toContain('pet-3');
  });

  it('unlocks pet-3 when 3 pets added', () => {
    const badges = evaluateBadges(makeProfile(), 3);
    expect(badges).toContain('pet-1');
    expect(badges).toContain('pet-3');
  });

  it('unlocks journal-1 at 1 entry', () => {
    const badges = evaluateBadges(makeProfile({ totalJournalEntries: 1 }), 0);
    expect(badges).toContain('journal-1');
    expect(badges).not.toContain('journal-10');
  });

  it('unlocks vet-1 at 1 visit', () => {
    const badges = evaluateBadges(makeProfile({ totalVetVisits: 1 }), 0);
    expect(badges).toContain('vet-1');
  });

  it('unlocks photo-1 at 1 photo', () => {
    const badges = evaluateBadges(makeProfile({ totalPhotos: 1 }), 0);
    expect(badges).toContain('photo-1');
  });

  it('unlocks active-7 at 7 days', () => {
    const badges = evaluateBadges(makeProfile({ totalDaysActive: 7 }), 0);
    expect(badges).toContain('active-7');
    expect(badges).not.toContain('active-30');
  });

  it('unlocks all for maxed profile', () => {
    const badges = evaluateBadges(
      makeProfile({
        longestCareStreak: 365,
        totalJournalEntries: 50,
        totalVetVisits: 5,
        totalDaysActive: 30,
        totalPhotos: 100,
      }),
      5,
    );
    expect(badges.length).toBe(ALL_BADGES.length);
  });

  it('handles mixed achievements', () => {
    const badges = evaluateBadges(
      makeProfile({
        longestCareStreak: 7,
        totalJournalEntries: 10,
        totalVetVisits: 0,
        totalPhotos: 25,
      }),
      1,
    );
    expect(badges).toContain('streak-3');
    expect(badges).toContain('streak-7');
    expect(badges).toContain('journal-1');
    expect(badges).toContain('journal-10');
    expect(badges).toContain('pet-1');
    expect(badges).toContain('photo-1');
    expect(badges).toContain('photo-25');
    expect(badges).not.toContain('vet-1');
  });
});
