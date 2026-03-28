export const PREMIUM_CONFIG = {
  productId: 'com.pawpal.premium',
  price: '$1.99',
  priceValue: 1.99,
  type: 'non-consumable' as const,
  features: [
    'Unlimited pet profiles',
    'Medication tracking with reminders',
    'Weight & health history charts',
    'Vaccination records with expiry alerts',
    'Pet photo journal & memories',
    'Vet visit cost tracker & reports',
    'Export health records as PDF',
    'All achievement badges',
    'Custom feeding schedules',
  ],
  freeFeatures: [
    '1 pet profile',
    'Basic feeding schedule',
    'Vet appointment tracking',
    'Mood logging',
    'Core badges',
  ],
};

export const FREE_PET_LIMIT = 1;
export const FREE_JOURNAL_LIMIT = 5;
export const FREE_PHOTO_LIMIT = 10;
