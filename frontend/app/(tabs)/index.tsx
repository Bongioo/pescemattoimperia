import {
  View,
  Text,
  Pressable,
  Linking,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { getOpenStatus, RESTAURANT_INFO } from "@/src/data/menu";
import { useTabBarHeight } from "@/src/utils/tabBar";

const LOGO_URL =
  "https://customer-assets-cm19k8pv.emergentagent.net/job_il-pescematto/artifacts/q3b3k7iy_IMG_7974.jpeg";
const HERO_URL =
  "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwb2NlYW4lMjB3YXZlcyUyMGFic3RyYWN0JTIwbHV4dXJ5fGVufDB8fHx8MTc4OTI0MzE2MXww&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const tabBarHeight = useTabBarHeight();
  const router = useRouter();

  const status = getOpenStatus();

  const haptic = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const call = () => {
    haptic();
    Linking.openURL(`tel:${RESTAURANT_INFO.phone}`).catch(() => {});
  };

  const openMenu = () => {
    haptic();
    router.push("/(tabs)/menu");
  };

  return (
    <View style={styles.container} testID="home-screen">
      <Image source={{ uri: HERO_URL }} style={styles.hero} contentFit="cover" />
      <LinearGradient
        colors={[
          "rgba(5,8,15,0.35)",
          "rgba(5,8,15,0.75)",
          "rgba(5,8,15,0.95)",
          "#05080F",
        ]}
        locations={[0, 0.45, 0.8, 1]}
        style={styles.scrim}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: tabBarHeight + spacing.xl,
          minHeight: height,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top pill: location */}
        <View style={styles.topRow}>
          <View style={styles.locationPill} testID="home-location-pill">
            <Feather name="map-pin" size={12} color={colors.brandPrimary} />
            <Text style={styles.locationText}>Borgo Prino · Imperia</Text>
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={{ uri: LOGO_URL }}
            style={styles.logo}
            contentFit="contain"
            testID="home-logo"
          />
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.tagline} testID="home-tagline">
            Trattoria del Mare
          </Text>
          <View style={styles.divider} />
          <Text style={styles.subline}>
            Cucina di mare ligure · pesce fresco · griglia Josper
          </Text>
        </View>

        {/* Status card */}
        <View style={styles.statusCard} testID="home-status-card">
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status.isOpen ? "#5EAD6E" : "#B95656" },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusLabel}>{status.label}</Text>
            {!!status.next && <Text style={styles.statusNext}>{status.next}</Text>}
          </View>
          <Feather name="clock" size={18} color={colors.muted} />
        </View>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaPrimary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={openMenu}
            testID="home-menu-cta"
          >
            <Feather name="book-open" size={18} color={colors.onBrandPrimary} />
            <Text style={styles.ctaPrimaryText}>Vedi il Menu</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.ctaSecondary,
              pressed && { opacity: 0.85 },
            ]}
            onPress={call}
            testID="home-call-cta"
          >
            <Feather name="phone" size={18} color={colors.onBrandSecondary} />
            <Text style={styles.ctaSecondaryText}>Prenota</Text>
          </Pressable>
        </View>

        {/* Bottom info */}
        <View style={styles.footerInfo}>
          <View style={styles.footerRow}>
            <Feather name="calendar" size={14} color={colors.muted} />
            <Text style={styles.footerText}>Aperto tutti i giorni tranne il mercoledì</Text>
          </View>
          <View style={styles.footerRow}>
            <Feather name="sun" size={14} color={colors.muted} />
            <Text style={styles.footerText}>12:00 – 14:30  ·  19:00 – 22:30</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRow: {
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(14,22,36,0.6)",
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  locationText: {
    color: colors.onSurfaceSecondary,
    fontSize: 11,
    letterSpacing: 1.2,
    fontFamily: fonts.bodyMedium,
    textTransform: "uppercase",
  },
  logoWrap: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: radius.lg,
  },
  titleBlock: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  tagline: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    color: colors.onSurface,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.brandPrimary,
    marginVertical: spacing.md,
    opacity: 0.7,
  },
  subline: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  statusCard: {
    marginTop: spacing.xxl,
    marginHorizontal: spacing.xl,
    backgroundColor: "rgba(14,22,36,0.75)",
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  statusLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  statusNext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  ctaRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  ctaPrimaryText: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  ctaSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.brandSecondary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  ctaSecondaryText: {
    color: colors.onBrandSecondary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  footerInfo: {
    marginTop: spacing.xxl,
    marginHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.3,
  },
}));
