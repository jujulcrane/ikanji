export const Colors = {
  light: {
    // Custom Brand Colors
    customGold: '#E0C28C',
    customCream: '#EFE5C8',
    customBrownLight: '#9B8967',
    customBrownDark: '#564E40',

    // Base Colors
    background: '#ffffff',
    foreground: '#171717',

    // UI Colors
    card: '#ffffff',
    cardForeground: '#171717',
    border: '#e5e5e5',
    input: '#e5e5e5',

    // Semantic Colors
    primary: '#171717',
    primaryForeground: '#ffffff',
    secondary: '#f5f5f5',
    secondaryForeground: '#171717',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    success: '#22c55e',
    successForeground: '#ffffff',

    // Text
    text: '#171717',
    textSecondary: '#737373',
    textMuted: '#a3a3a3',
  },
  dark: {
    // Custom Brand Colors (same in dark mode)
    customGold: '#E0C28C',
    customCream: '#EFE5C8',
    customBrownLight: '#9B8967',
    customBrownDark: '#564E40',

    // Base Colors
    background: '#0a0a0a',
    foreground: '#fafafa',

    // UI Colors
    card: '#0a0a0a',
    cardForeground: '#fafafa',
    border: '#262626',
    input: '#262626',

    // Semantic Colors
    primary: '#fafafa',
    primaryForeground: '#171717',
    secondary: '#262626',
    secondaryForeground: '#fafafa',
    destructive: '#7f1d1d',
    destructiveForeground: '#fafafa',
    success: '#14532d',
    successForeground: '#fafafa',

    // Text
    text: '#fafafa',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
