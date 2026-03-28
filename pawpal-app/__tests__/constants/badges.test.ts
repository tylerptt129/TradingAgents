import { ALL_BADGES } from '../../src/constants/badges';

describe('ALL_BADGES', () => {
  it('has at least 15 badges', () => {
    expect(ALL_BADGES.length).toBeGreaterThanOrEqual(15);
  });

  it('each badge has required fields', () => {
    ALL_BADGES.forEach((badge) => {
      expect(badge.id).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity);
      expect(badge.requirement.value).toBeGreaterThan(0);
      expect([
        'care_streak', 'journal_entries', 'vet_visits',
        'pets_added', 'days_active', 'photos_taken',
      ]).toContain(badge.requirement.type);
    });
  });

  it('has unique IDs', () => {
    const ids = ALL_BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has all rarities', () => {
    const rarities = new Set(ALL_BADGES.map((b) => b.rarity));
    expect(rarities.has('common')).toBe(true);
    expect(rarities.has('rare')).toBe(true);
    expect(rarities.has('epic')).toBe(true);
    expect(rarities.has('legendary')).toBe(true);
  });

  it('has all requirement types', () => {
    const types = new Set(ALL_BADGES.map((b) => b.requirement.type));
    expect(types.has('care_streak')).toBe(true);
    expect(types.has('journal_entries')).toBe(true);
    expect(types.has('vet_visits')).toBe(true);
    expect(types.has('pets_added')).toBe(true);
    expect(types.has('days_active')).toBe(true);
    expect(types.has('photos_taken')).toBe(true);
  });

  it('requirements ascend within type', () => {
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
