import { ALL_BADGES } from '../src/constants/badges';
import { Badge, BadgeRarity } from '../src/types';

describe('Badge definitions', () => {
  it('has 21 badges total', () => {
    expect(ALL_BADGES).toHaveLength(21);
  });

  it('all badges have required fields', () => {
    ALL_BADGES.forEach((badge) => {
      expect(badge.id).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity);
      expect(badge.requirement).toBeDefined();
      expect(badge.requirement.type).toBeTruthy();
      expect(badge.requirement.value).toBeGreaterThan(0);
    });
  });

  it('all badge IDs are unique', () => {
    const ids = ALL_BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has all badge types', () => {
    const types = new Set(ALL_BADGES.map((b) => b.requirement.type));
    expect(types).toContain('streak');
    expect(types).toContain('total_completions');
    expect(types).toContain('habits_created');
    expect(types).toContain('perfect_days');
    expect(types).toContain('days_active');
  });

  it('has all rarity levels', () => {
    const rarities = new Set(ALL_BADGES.map((b) => b.rarity));
    expect(rarities).toContain('common');
    expect(rarities).toContain('rare');
    expect(rarities).toContain('epic');
    expect(rarities).toContain('legendary');
  });

  it('streak badges are ordered by increasing difficulty', () => {
    const streakBadges = ALL_BADGES.filter((b) => b.requirement.type === 'streak');
    for (let i = 1; i < streakBadges.length; i++) {
      expect(streakBadges[i].requirement.value).toBeGreaterThan(streakBadges[i - 1].requirement.value);
    }
  });

  it('completion badges are ordered by increasing difficulty', () => {
    const compBadges = ALL_BADGES.filter((b) => b.requirement.type === 'total_completions');
    for (let i = 1; i < compBadges.length; i++) {
      expect(compBadges[i].requirement.value).toBeGreaterThan(compBadges[i - 1].requirement.value);
    }
  });
});
