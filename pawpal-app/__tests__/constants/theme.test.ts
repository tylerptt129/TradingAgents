import { COLORS, PET_TYPE_EMOJIS, MOOD_CONFIG, ACTIVITY_CONFIG, SPACING, FONT_SIZE } from '../../src/constants/theme';

describe('Theme - COLORS', () => {
  it('has primary colors', () => {
    expect(COLORS.primary).toMatch(/^#/);
    expect(COLORS.primaryLight).toMatch(/^#/);
    expect(COLORS.primaryDark).toMatch(/^#/);
  });

  it('has background colors', () => {
    expect(COLORS.background).toBeTruthy();
    expect(COLORS.card).toBeTruthy();
  });

  it('has text colors', () => {
    expect(COLORS.text).toBeTruthy();
    expect(COLORS.textSecondary).toBeTruthy();
    expect(COLORS.textMuted).toBeTruthy();
  });

  it('has mood colors', () => {
    expect(COLORS.moodHappy).toBeTruthy();
    expect(COLORS.moodSick).toBeTruthy();
  });
});

describe('PET_TYPE_EMOJIS', () => {
  it('has emoji for each pet type', () => {
    const types = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other'];
    types.forEach((type) => {
      expect(PET_TYPE_EMOJIS[type]).toBeTruthy();
    });
  });
});

describe('MOOD_CONFIG', () => {
  it('has config for each mood', () => {
    const moods = ['happy', 'playful', 'sleepy', 'hungry', 'sick', 'anxious'];
    moods.forEach((mood) => {
      expect(MOOD_CONFIG[mood]).toBeDefined();
      expect(MOOD_CONFIG[mood].emoji).toBeTruthy();
      expect(MOOD_CONFIG[mood].color).toBeTruthy();
      expect(MOOD_CONFIG[mood].label).toBeTruthy();
    });
  });
});

describe('ACTIVITY_CONFIG', () => {
  it('has config for each activity', () => {
    const activities = ['feeding', 'medication', 'vet', 'grooming', 'walk', 'play', 'bath'];
    activities.forEach((a) => {
      expect(ACTIVITY_CONFIG[a]).toBeDefined();
      expect(ACTIVITY_CONFIG[a].emoji).toBeTruthy();
      expect(ACTIVITY_CONFIG[a].label).toBeTruthy();
    });
  });
});

describe('SPACING', () => {
  it('has ascending values', () => {
    expect(SPACING.xs).toBeLessThan(SPACING.sm);
    expect(SPACING.sm).toBeLessThan(SPACING.md);
    expect(SPACING.md).toBeLessThan(SPACING.lg);
    expect(SPACING.lg).toBeLessThan(SPACING.xl);
  });
});

describe('FONT_SIZE', () => {
  it('has ascending values', () => {
    expect(FONT_SIZE.xs).toBeLessThan(FONT_SIZE.sm);
    expect(FONT_SIZE.sm).toBeLessThan(FONT_SIZE.md);
    expect(FONT_SIZE.md).toBeLessThan(FONT_SIZE.lg);
    expect(FONT_SIZE.lg).toBeLessThan(FONT_SIZE.xl);
  });
});
