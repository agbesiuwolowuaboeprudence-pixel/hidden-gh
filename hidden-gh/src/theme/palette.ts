// Scheme-independent design tokens + the two color palettes.
// darkColors and lightColors MUST share the exact same keys so components can
// swap palettes at runtime without any conditional logic.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  tab: { fontSize: 10, fontWeight: '600' as const, lineHeight: 12 },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

// The dark palette is the primary, "Nvidia-like" premium look:
// near-black layered surfaces, hairline borders, a glowing green accent.
export const darkColors = {
  primary: '#22C55E',
  primaryLight: '#4ADE80',
  primaryDark: '#16A34A',
  primaryMuted: 'rgba(34,197,94,0.14)',
  accent: '#F5A623',
  accentDark: '#FBBF24',
  white: '#FFFFFF',
  black: '#000000',
  background: '#0A0A0B',
  surface: '#141416',
  surfaceElevated: '#1C1C1F',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textMuted: '#6B6B72',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  success: '#22C55E',
  warning: 'rgba(245,166,35,0.16)',
  danger: '#F87171',
  dangerMuted: 'rgba(248,113,113,0.14)',
  premium: '#C9A84C',
  overlay: 'rgba(0,0,0,0.6)',
  online: '#22C55E',
  offline: '#6B6B72',
} as const;

// The light palette mirrors every key of the dark palette.
export const lightColors: Record<keyof typeof darkColors, string> = {
  primary: '#1B5E3B',
  primaryLight: '#2E7D52',
  primaryDark: '#0F3D22',
  primaryMuted: '#E8F5EE',
  accent: '#F5A623',
  accentDark: '#E65100',
  white: '#FFFFFF',
  black: '#111111',
  background: '#F8F7F2',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  border: '#E8E8E8',
  borderStrong: '#DADADA',
  success: '#2E7D52',
  warning: '#FFF8E1',
  danger: '#E53935',
  dangerMuted: '#FFEBEE',
  premium: '#C9A84C',
  overlay: 'rgba(0,0,0,0.45)',
  online: '#2E7D52',
  offline: '#A0A0A0',
};

// Widen the literal string types so both palettes are assignable to Palette.
export type Palette = { [K in keyof typeof darkColors]: string };
export type ColorScheme = 'dark' | 'light';

export const palettes: Record<ColorScheme, Palette> = {
  dark: darkColors,
  light: lightColors,
};
