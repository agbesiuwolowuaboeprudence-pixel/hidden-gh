// Scheme-independent tokens are exported statically (safe to use anywhere).
// Colors are dynamic — read them from `useTheme()` inside components so the app
// can switch between the dark (default) and light palettes at runtime.
export { spacing, radius, typography, shadows, darkColors, lightColors, palettes } from './palette';
export type { Palette, ColorScheme } from './palette';

export { ThemeProvider, useTheme } from './ThemeProvider';

// Static fallback palette for code that runs outside React (e.g. the Leaflet
// HTML string built in ExploreScreen). Components should use useTheme instead.
export { darkColors as colors } from './palette';
