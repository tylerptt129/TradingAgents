// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
    },
  };
});

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
  Link: 'Link',
}));

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Circle: 'Circle',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
