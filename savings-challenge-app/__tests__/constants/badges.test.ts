import { ALL_BADGES } from '../../src/constants/badges';

describe('ALL_BADGES', () => {
  it('has at least 10 badges', () => {
    expect(ALL_BADGES.length).toBeGreaterThanOrEqual(10);
  });

  it('each badge has required fields', () => {
    ALL_BADGES.forEach((badge) => {
      expect(badge.id).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity);
      expect(badge.requirement).toBeDefined();
      expect(['streak', 'total_saved', 'challenges_completed', 'days_logged']).toContain(
        badge.requirement.type,
      );
      expect(badge.requirement.value).toBeGreaterThan(0);
    });
  });

  it('has unique IDs', () => {
    const ids = ALL_BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has badges of each rarity', () => {
    const rarities = new Set(ALL_BADGES.map((b) => b.rarity));
    expect(rarities.has('common')).toBe(true);
    expect(rarities.has('rare')).toBe(true);
    expect(rarities.has('epic')).toBe(true);
    expect(rarities.has('legendary')).toBe(true);
  });

  it('has badges for each requirement type', () => {
    const types = new Set(ALL_BADGES.map((b) => b.requirement.type));
    expect(types.has('streak')).toBe(true);
    expect(types.has('total_saved')).toBe(true);
    expect(types.has('challenges_completed')).toBe(true);
    expect(types.has('days_logged')).toBe(true);
  });

  it('badge requirements are in ascending order within each type', () => {
    const byType: Record<string, number[]> = {};
    ALL_BADGES.forEach((b) => {
      if (!byType[b.requirement.type]) byType[b.requirement.type] = [];
      byType[b.requirement.type].push(b.requirement.value);
    });

    Object.values(byType).forEach((values) => {
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
    });
  });
});
