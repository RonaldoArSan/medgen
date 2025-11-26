export const Colors = {
  primary: '#6366F1', // Indigo 500 - Slightly lighter for dark mode
  primaryLight: '#818CF8',
  primaryDark: '#4338CA',
  
  secondary: '#10B981', // Emerald 500
  secondaryLight: '#34D399',
  
  accent: '#F59E0B', // Amber 500
  danger: '#EF4444', // Red 500
  
  background: '#111827', // Gray 900 - Dark background
  surface: '#1F2937', // Gray 800 - Dark surface
  
  textPrimary: '#F9FAFB', // Gray 50 - Light text
  textSecondary: '#9CA3AF', // Gray 400 - Secondary text
  textLight: '#6B7280', // Gray 500
  
  border: '#374151', // Gray 700
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
};

export const BorderRadius = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  round: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
