// Design tokens for Il Pescematto. Elegante marittimo dark theme.
import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const dark = {
  // Surfaces
  surface: "#05080F",
  onSurface: "#F7F5F0",
  surfaceSecondary: "#0E1624",
  onSurfaceSecondary: "#E8E4D9",
  surfaceTertiary: "#162235",
  onSurfaceTertiary: "#D0CBBF",
  surfaceInverse: "#F7F5F0",
  onSurfaceInverse: "#05080F",
  muted: "#8E9CAE",

  // Brand
  brand: "#6082B6",
  onBrand: "#05080F",
  brandPrimary: "#C4A464", // gold/sand
  onBrandPrimary: "#05080F",
  brandSecondary: "#6082B6", // dusty blue
  onBrandSecondary: "#F7F5F0",
  brandTertiary: "#26364A",
  onBrandTertiary: "#E8E4D9",

  // Status
  success: "#3A5A40",
  onSuccess: "#FFFFFF",
  warning: "#C4A464",
  onWarning: "#05080F",
  error: "#7A2E2E",
  onError: "#FFFFFF",
  info: "#6082B6",
  onInfo: "#F7F5F0",

  // Lines
  border: "#26364A",
  borderStrong: "#3A506B",
  divider: "#1A2639",
};

export type ThemeColors = typeof dark;

export const defaultScheme = "dark" satisfies ColorScheme;

export const themes: { light?: ThemeColors; dark: ThemeColors } = { dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme);
}

setColorScheme?.(themes.light ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme =
    system && themes[system as ColorScheme] ? (system as ColorScheme) : defaultScheme;
  return { scheme, colors: (themes as any)[scheme] ?? themes.dark };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Spacing tokens per design guidelines
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

// Typography — use platform serifs (evocative of traditional trattoria) & system sans
import { Platform } from "react-native";
const serif = Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" });
const serifBold = Platform.select({ ios: "Georgia-Bold", android: "serif", default: "Georgia" });
export const fonts = {
  display: serif!,
  displayBold: serifBold!,
  displayItalic: Platform.select({ ios: "Georgia-Italic", android: "serif", default: "Georgia" })!,
  body: Platform.select({ ios: "System", android: "sans-serif", default: "System" })!,
  bodyMedium: Platform.select({ ios: "System", android: "sans-serif-medium", default: "System" })!,
  bodyBold: Platform.select({ ios: "System", android: "sans-serif", default: "System" })!,
};
