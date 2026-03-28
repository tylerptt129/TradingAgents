import { PREMIUM_CONFIG, FREE_PET_LIMIT, FREE_JOURNAL_LIMIT, FREE_PHOTO_LIMIT } from '../../src/constants/premium';

describe('PREMIUM_CONFIG', () => {
  it('has correct price', () => {
    expect(PREMIUM_CONFIG.price).toBe('$1.99');
    expect(PREMIUM_CONFIG.priceValue).toBe(1.99);
  });

  it('is non-consumable', () => {
    expect(PREMIUM_CONFIG.type).toBe('non-consumable');
  });

  it('has product ID', () => {
    expect(PREMIUM_CONFIG.productId).toBe('com.pawpal.premium');
  });

  it('lists premium features', () => {
    expect(PREMIUM_CONFIG.features.length).toBeGreaterThan(5);
    expect(PREMIUM_CONFIG.features).toContain('Unlimited pet profiles');
    expect(PREMIUM_CONFIG.features).toContain('Medication tracking with reminders');
  });

  it('lists free features', () => {
    expect(PREMIUM_CONFIG.freeFeatures.length).toBeGreaterThan(0);
  });
});

describe('Free limits', () => {
  it('free pet limit is 1', () => {
    expect(FREE_PET_LIMIT).toBe(1);
  });

  it('free journal limit is 5', () => {
    expect(FREE_JOURNAL_LIMIT).toBe(5);
  });

  it('free photo limit is 10', () => {
    expect(FREE_PHOTO_LIMIT).toBe(10);
  });
});
