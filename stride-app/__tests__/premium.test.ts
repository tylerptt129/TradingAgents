import { PREMIUM_CONFIG, FREE_HABIT_LIMIT } from '../src/constants/premium';

describe('Premium config', () => {
  it('has correct product ID', () => {
    expect(PREMIUM_CONFIG.productId).toBe('com.stride.habits.premium');
  });

  it('price is $2.99', () => {
    expect(PREMIUM_CONFIG.price).toBe('$2.99');
    expect(PREMIUM_CONFIG.priceValue).toBe(2.99);
  });

  it('is a non-consumable purchase', () => {
    expect(PREMIUM_CONFIG.type).toBe('non-consumable');
  });

  it('has premium features list', () => {
    expect(PREMIUM_CONFIG.features.length).toBeGreaterThanOrEqual(5);
    expect(PREMIUM_CONFIG.features.some((f) => f.toLowerCase().includes('unlimited'))).toBe(true);
  });

  it('has free features list', () => {
    expect(PREMIUM_CONFIG.freeFeatures.length).toBeGreaterThan(0);
  });

  it('FREE_HABIT_LIMIT is 3', () => {
    expect(FREE_HABIT_LIMIT).toBe(3);
  });
});
