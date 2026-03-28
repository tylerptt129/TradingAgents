import { CHALLENGE_TEMPLATES } from '../../src/constants/challenges';

describe('CHALLENGE_TEMPLATES', () => {
  it('has at least 3 challenges', () => {
    expect(CHALLENGE_TEMPLATES.length).toBeGreaterThanOrEqual(3);
  });

  it('each template has required fields', () => {
    CHALLENGE_TEMPLATES.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.type).toBeTruthy();
      expect(template.durationDays).toBeGreaterThan(0);
      expect(template.icon).toBeTruthy();
      expect(template.color).toMatch(/^#/);
      expect(typeof template.isPremium).toBe('boolean');
      expect(template.totalSavingsGoal).toBeGreaterThan(0);
      expect(template.rules.length).toBeGreaterThan(0);
    });
  });

  it('has unique IDs', () => {
    const ids = CHALLENGE_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('52-week challenge saves $1,378', () => {
    const challenge = CHALLENGE_TEMPLATES.find((t) => t.id === '52-week');
    expect(challenge).toBeDefined();
    expect(challenge!.totalSavingsGoal).toBe(1378);
    expect(challenge!.durationDays).toBe(364);
    expect(challenge!.isPremium).toBe(false);
  });

  it('30-day no-spend is 30 days', () => {
    const challenge = CHALLENGE_TEMPLATES.find((t) => t.id === '30-day-no-spend');
    expect(challenge).toBeDefined();
    expect(challenge!.durationDays).toBe(30);
    expect(challenge!.isPremium).toBe(false);
  });

  it('penny challenge saves $667.95', () => {
    const challenge = CHALLENGE_TEMPLATES.find((t) => t.id === 'penny');
    expect(challenge).toBeDefined();
    expect(challenge!.totalSavingsGoal).toBe(667.95);
    expect(challenge!.durationDays).toBe(365);
  });

  it('has at least 2 free challenges', () => {
    const free = CHALLENGE_TEMPLATES.filter((t) => !t.isPremium);
    expect(free.length).toBeGreaterThanOrEqual(2);
  });

  it('has at least 1 premium challenge', () => {
    const premium = CHALLENGE_TEMPLATES.filter((t) => t.isPremium);
    expect(premium.length).toBeGreaterThanOrEqual(1);
  });
});
