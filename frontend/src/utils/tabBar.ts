import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Approximates the effective bottom tab bar height (bar + safe-area bottom
 * inset) without needing to reach into expo-router internals.
 */
export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  const bar = Platform.OS === "ios" ? 49 : 56;
  return bar + insets.bottom;
}
