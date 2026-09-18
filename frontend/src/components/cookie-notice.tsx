import { useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { makeStyles, fonts, spacing, radius } from "@/src/theme";
import {
  useCookieNotice,
  registerReopenNotice,
} from "@/src/hooks/useCookieNotice";
import { useTabBarHeight } from "@/src/utils/tabBar";

export function CookieNotice() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tabBarHeight = useTabBarHeight();
  const { visible, acknowledge, reopen } = useCookieNotice();

  useEffect(() => {
    registerReopenNotice(reopen);
  }, [reopen]);

  if (!visible) return null;

  const haptic = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View
      style={[styles.wrap, { bottom: tabBarHeight + spacing.sm, pointerEvents: "box-none" }]}
      testID="cookie-notice"
    >
      <View style={styles.card}>
        <View style={styles.headRow}>
          <View style={styles.icon}>
            <Feather name="shield" size={16} color="#C4A464" />
          </View>
          <Text style={styles.title}>Informativa</Text>
        </View>
        <Text style={styles.body}>
          Questo sito usa soltanto strumenti tecnici salvati sul tuo browser
          (ad es. per ricordare le modifiche fatte dal gestore al menu). Non
          usiamo analytics, cookie di profilazione o pixel di marketing.
        </Text>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              haptic();
              router.push("/cookie-policy");
            }}
            style={styles.secondary}
            testID="cookie-notice-policy"
          >
            <Text style={styles.secondaryText}>Cookie Policy</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              haptic();
              acknowledge();
            }}
            style={styles.primary}
            testID="cookie-notice-ack"
          >
            <Text style={styles.primaryText}>Ho capito</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrap: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.lg,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        }
      : { elevation: 12 }),
  },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196,164,100,0.10)",
    borderWidth: 0.5,
    borderColor: colors.brandPrimary,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.brandSecondary,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
  },
  secondaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.onBrandSecondary,
  },
  primary: {
    flex: 1,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: "center",
  },
  primaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.onBrandPrimary,
  },
}));
