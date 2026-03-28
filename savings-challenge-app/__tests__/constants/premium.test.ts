import { PREMIUM_CONFIG, FREE_CHALLENGE_LIMIT } from '../../src/constants/premium';

describe('PREMIUM_CONFIG', () => {
  it('has correct price', () => {
    expect(PREMIUM_CONFIG.price).toBe('$0.99');
    expect(PREMIUM_CONFIG.priceValue).toBe(0.99);
  });

  it('is a non-consumable purchase', () => {
    expect(PREMIUM_CONFIG.type).toBe('non-consumable');
  });

  it('has product ID', () => {
    expect(PREMIUM_CONFIG.productId).toBe('com.savequest.premium');
  });

  it('lists premium features', () => {
    expect(PREMIUM_CONFIG.features.length).toBeGreaterThan(0);
    expect(PREMIUM_CONFIG.features).toContain('Unlimited active challenges');
  });

  it('lists free features', () => {
    expect(PREMIUM_CONFIG.freeFeatures.length).toBeGreaterThan(0);
  });

  it('free limit is 1 challenge', () => {
    expect(FREE_CHALLENGE_LIMIT).toBe(1);
  });
});
