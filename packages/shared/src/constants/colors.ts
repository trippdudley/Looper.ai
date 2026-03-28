// Looper.AI design system colors
// Single source of truth for web and native

export const COLORS = {
  // Dark mode (Player Portal + Coach App native)
  dark: {
    bg: '#0C1117',
    surface: '#151D28',
    surfaceAlt: '#1E2A36',
    accent: '#10B981',
    accentDim: '#0FA87A',
    border: '#2A3A4A',
    borderStrong: '#3A4856',
    text: {
      primary: '#E8ECF1',
      secondary: '#8B99A8',
      tertiary: '#5E6E7E',
    },
    semantic: {
      confidence: '#0FA87A',
      caution: '#D4980B',
      flag: '#C93B3B',
      info: '#3B82F6',
    },
  },
  // Light mode (Coach Portal web)
  light: {
    bg: '#F6F7F9',
    surface: '#FFFFFF',
    accent: '#0D7C66',
    border: '#E2E8F0',
    text: {
      primary: '#1A1F2B',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
    },
    semantic: {
      confidence: '#0FA87A',
      caution: '#D4980B',
      flag: '#C93B3B',
      info: '#3B82F6',
    },
  },
} as const;

// Semantic aliases used in coach app
export const C = COLORS.dark;
