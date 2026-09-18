import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
// Prewarm feather icon font (fixes intermittent icon rendering in Expo Go on Android)
import "@react-native-vector-icons/feather";

import { ErrorBoundary } from "@/src/components/error-boundary";
import { CookieNotice } from "@/src/components/cookie-notice";
import { queryClient } from "@/src/query-client";

LogBox.ignoreAllLogs(true);
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#05080F" }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <StatusBar barStyle="light-content" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#05080F" },
                animation: "fade",
              }}
            />
            <CookieNotice />
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
