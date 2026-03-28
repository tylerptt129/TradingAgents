import {
  COLORS,
  GRADIENTS,
  GRADIENT_NAMES,
  HABIT_ICONS,
  SP,
  FS,
  RADIUS,
  CARD_SHADOW,
  CARD_SHADOW_SM,
} from '../src/constants/theme';

describe('Theme constants', () => {
  it('COLORS has all required keys', () => {
    expect(COLORS.bg).toBeTruthy();
    expect(COLORS.bgCard).toBeTruthy();
    expect(COLORS.primary).toBeTruthy();
    expect(COLORS.text).toBeTruthy();
    expect(COLORS.textSecondary).toBeTruthy();
    expect(COLORS.border).toBeTruthy();
    expect(COLORS.success).toBeTruthy();
    expect(COLORS.error).toBeTruthy();
    expect(COLORS.warning).toBeTruthy();
  });

  it('GRADIENTS has 12 gradient pairs', () => {
    expect(GRADIENT_NAMES).toHaveLength(12);
  });

  it('all gradients are [string, string] tuples', () => {
    GRADIENT_NAMES.forEach((name) => {
      const gradient = GRADIENTS[name];
      expect(gradient).toHaveLength(2);
      expect(typeof gradient[0]).toBe('string');
      expect(typeof gradient[1]).toBe('string');
      expect(gradient[0]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('GRADIENT_NAMES matches GRADIENTS keys', () => {
    expect(GRADIENT_NAMES).toEqual(Object.keys(GRADIENTS));
  });

  it('HABIT_ICONS has 30+ icons', () => {
    expect(Object.keys(HABIT_ICONS).length).toBeGreaterThanOrEqual(30);
  });

  it('SP values are numbers in ascending order', () => {
    expect(SP.xs).toBeLessThan(SP.sm);
    expect(SP.sm).toBeLessThan(SP.md);
    expect(SP.md).toBeLessThan(SP.lg);
    expect(SP.lg).toBeLessThan(SP.xl);
  });

  it('FS values are numbers in ascending order', () => {
    expect(FS.caption).toBeLessThan(FS.small);
    expect(FS.small).toBeLessThan(FS.body);
    expect(FS.body).toBeLessThan(FS.headline);
    expect(FS.headline).toBeLessThan(FS.title1);
    expect(FS.title1).toBeLessThan(FS.hero);
  });

  it('RADIUS values are positive', () => {
    expect(RADIUS.sm).toBeGreaterThan(0);
    expect(RADIUS.md).toBeGreaterThan(RADIUS.sm);
    expect(RADIUS.full).toBeGreaterThan(RADIUS.xl);
  });

  it('CARD_SHADOW has required properties', () => {
    expect(CARD_SHADOW.shadowColor).toBeTruthy();
    expect(CARD_SHADOW.shadowOffset).toBeDefined();
    expect(CARD_SHADOW.elevation).toBeGreaterThan(0);
  });

  it('CARD_SHADOW_SM has smaller elevation', () => {
    expect(CARD_SHADOW_SM.elevation).toBeLessThan(CARD_SHADOW.elevation);
  });
});
