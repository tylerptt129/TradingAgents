import { HABIT_PRESETS, PRESET_CATEGORIES } from '../src/constants/presets';
import { GRADIENTS } from '../src/constants/theme';

describe('Habit presets', () => {
  it('has 25 presets', () => {
    expect(HABIT_PRESETS).toHaveLength(25);
  });

  it('all presets have required fields', () => {
    HABIT_PRESETS.forEach((p) => {
      expect(p.name).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.gradient).toBeTruthy();
      expect(p.category).toBeTruthy();
    });
  });

  it('all presets use valid gradient names', () => {
    const validGradients = Object.keys(GRADIENTS);
    HABIT_PRESETS.forEach((p) => {
      expect(validGradients).toContain(p.gradient);
    });
  });

  it('has 4 categories', () => {
    expect(PRESET_CATEGORIES).toHaveLength(4);
    expect(PRESET_CATEGORIES).toContain('Health');
    expect(PRESET_CATEGORIES).toContain('Mind');
    expect(PRESET_CATEGORIES).toContain('Productivity');
    expect(PRESET_CATEGORIES).toContain('Self Care');
  });

  it('every preset belongs to a known category', () => {
    HABIT_PRESETS.forEach((p) => {
      expect(PRESET_CATEGORIES).toContain(p.category);
    });
  });
});
