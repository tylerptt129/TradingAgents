export const PREMIUM_CONFIG = {
  productId: 'com.savequest.premium',
  price: '$0.99',
  priceValue: 0.99,
  type: 'non-consumable' as const, // One-time purchase
  features: [
    'Unlimited active challenges',
    'All premium challenges unlocked',
    'Advanced savings analytics',
    'All achievement badges',
    'Custom challenge creation',
    'Export savings data',
  ],
  freeFeatures: [
    '1 active challenge at a time',
    '3 free challenges',
    'Basic progress tracking',
    'Core achievement badges',
  ],
};

export const FREE_CHALLENGE_LIMIT = 1;
export const FREE_BADGE_LIMIT = 8; // Only common + some rare badges
