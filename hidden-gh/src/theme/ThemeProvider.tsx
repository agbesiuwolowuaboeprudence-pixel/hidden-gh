import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  palettes,
  radius,
  shadows,
  spacing,
  typography,
  type ColorScheme,
  type Palette,
} from './palette';

interface ThemeContextValue {
  colors: Palette;
  scheme: ColorScheme;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  toggleScheme: () => void;
  setScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialScheme = 'dark',
}: {
  children: ReactNode;
  initialScheme?: ColorScheme;
}) {
  const [scheme, setScheme] = useState<ColorScheme>(initialScheme);

  const toggleScheme = useCallback(() => {
    setScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: palettes[scheme],
      scheme,
      spacing,
      radius,
      typography,
      shadows,
      toggleScheme,
      setScheme,
    }),
    [scheme, toggleScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
