import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

import { useTheme, fonts } from "@/src/theme";

export default function TabsLayout() {
  const { colors } = useTheme();

  const haptic = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        },
        tabBarItemStyle: { alignSelf: "center" },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : "rgba(5,8,15,0.94)",
          elevation: 0,
          ...(Platform.OS === "web" ? { height: 64 } : {}),
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              tint="dark"
              intensity={80}
              style={{ flex: 1, backgroundColor: "rgba(5,8,15,0.55)" }}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: "rgba(5,8,15,0.96)" }} />
          ),
      }}
      screenListeners={{
        tabPress: haptic,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="anchor" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-home",
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-menu",
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-info",
        }}
      />
    </Tabs>
  );
}
