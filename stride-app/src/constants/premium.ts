export const PREMIUM_CONFIG = {
  productId: 'com.stride.habits.premium',
  price: '$2.99',
  priceValue: 2.99,
  type: 'non-consumable' as const,
  features: [
    'Unlimited habits (free: 3)',
    'Detailed analytics & insights',
    'Weekly and monthly heat maps',
    'Custom habit icons & gradients',
    'Habit stacking & ordering',
    'Advanced streak statistics',
    'Export habit data',
    'All achievement badges',
    'Priority support',
  ],
  freeFeatures: [
    '3 active habits',
    'Daily tracking & streaks',
    'Basic completion history',
    '7-day overview',
    'Core badges',
  ],
};

export const FREE_HABIT_LIMIT = 3;
