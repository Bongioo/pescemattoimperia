import {
  View,
  Text,
  Pressable,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { RESTAURANT_INFO, getOpenStatus } from "@/src/data/menu";
import { useTabBarHeight } from "@/src/utils/tabBar";
import { usePhoneNumber } from "@/src/hooks/useSettings";
import { useRouter } from "expo-router";

const INFO_BANNER =
  "https://images.unsplash.com/photo-1686659732711-3fe1ca60a221?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxJbXBlcmlhJTIwSXRhbHklMjBjb2FzdHxlbnwwfHx8fDE3ODkyNDMxNzB8MA&ixlib=rb-4.1.0&q=85";

export default function Info() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();

  const status = getOpenStatus();
  const now = new Date();
  const todayIdx = (now.getDay() === 0 ? 6 : now.getDay() - 1);
  const { phone, phoneDisplay } = usePhoneNumber();
  const router = useRouter();

  const haptic = () =>
    Platform.OS !== "web" && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

  const call = () => {
    haptic();
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const openMaps = () => {
    haptic();
    const query = encodeURIComponent(RESTAURANT_INFO.mapsQuery);
    const url = Platform.select({
      ios: `maps://?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    })!;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    });
  };

  return (
    <View style={styles.container} testID="info-screen">
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerWrap}>
          <Image source={{ uri: INFO_BANNER }} style={styles.banner} contentFit="cover" />
          <LinearGradient
            colors={["rgba(5,8,15,0.35)", "rgba(5,8,15,0.5)", "#05080F"]}
            style={styles.bannerScrim}
          />
          <View style={[styles.bannerContent, { paddingTop: insets.top + spacing.xxl }]}>
            <Text style={styles.eyebrow}>Contatti · Orari</Text>
            <Text style={styles.title}>Vieni a trovarci</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>{RESTAURANT_INFO.tagline} · {RESTAURANT_INFO.city}</Text>
          </View>
        </View>

        {/* Status pill */}
        <View style={styles.statusPill} testID="info-status-pill">
          <View
            style={[
              styles.dot,
              { backgroundColor: status.isOpen ? "#5EAD6E" : "#B95656" },
            ]}
          />
          <Text style={styles.statusText}>
            {status.label}{status.next ? ` · ${status.next}` : ""}
          </Text>
        </View>

        {/* Contact card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contatti</Text>

          <View style={styles.contactRow}>
            <View style={styles.contactIcon}>
              <Feather name="map-pin" size={18} color={colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Indirizzo</Text>
              <Text style={styles.contactValue}>{RESTAURANT_INFO.address}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.contactRow, pressed && { opacity: 0.7 }]}
            onPress={call}
            testID="info-call-row"
          >
            <View style={styles.contactIcon}>
              <Feather name="phone" size={18} color={colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Telefono</Text>
              <Text style={[styles.contactValue, styles.contactLink]}>
                {phoneDisplay}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </Pressable>

          <View style={styles.buttonsRow}>
            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85 }]}
              onPress={call}
              testID="info-call-btn"
            >
              <Feather name="phone" size={16} color={colors.onBrandPrimary} />
              <Text style={styles.btnPrimaryText}>Chiama</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.85 }]}
              onPress={openMaps}
              testID="info-maps-btn"
            >
              <Feather name="navigation" size={16} color={colors.onBrandSecondary} />
              <Text style={styles.btnSecondaryText}>Apri in Maps</Text>
            </Pressable>
          </View>
        </View>

        {/* Hours card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orari di apertura</Text>
          <Text style={styles.cardSubtitle}>
            Aperto tutti i giorni tranne il mercoledì
          </Text>

          <View style={styles.hoursList}>
            {RESTAURANT_INFO.hours.map((h, idx) => {
              const isToday = idx === todayIdx;
              return (
                <View
                  key={h.day}
                  style={[styles.hourRow, isToday && styles.hourRowToday]}
                  testID={`hour-row-${h.day}`}
                >
                  <Text style={[styles.hourDay, isToday && styles.hourDayToday]}>
                    {h.day}
                    {isToday ? "  · oggi" : ""}
                  </Text>
                  <Text
                    style={[
                      styles.hourSlot,
                      !h.open && styles.hourClosed,
                      isToday && h.open && styles.hourSlotToday,
                    ]}
                  >
                    {h.open ? h.slots.join("  ·  ") : "Chiuso"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Cover charge / note */}
        <View style={styles.noteCard}>
          <Feather name="info" size={14} color={colors.brandPrimary} />
          <Text style={styles.noteText}>
            Coperto {RESTAURANT_INFO.coverCharge} · Alcuni piatti possono contenere
            aglio. Per gli allergeni consulta la sezione dedicata nel menu.
          </Text>
        </View>

        {/* Legal footer */}
        <View style={styles.legalCard} testID="info-legal-footer">
          <Text style={styles.legalTitle}>Informazioni legali</Text>
          <Text style={styles.legalCompany}>TRATTORIA DELLA SALUTE S.R.L.S.</Text>
          <Text style={styles.legalLine}>
            Sede legale: Piazza Matteotti n. 6 — 18015 Riva Ligure (IM)
          </Text>
          <Text style={styles.legalLine}>
            P.IVA / C.F. 01716090087 — CCIAA di IM — REA 220844
          </Text>
          <Text style={styles.legalLine}>
            Capitale sociale € 10.000,00 i.v. — Società unipersonale
          </Text>
        </View>

        <Pressable
          onPress={() => {
            haptic();
            router.push("/admin/login");
          }}
          style={styles.adminLink}
          hitSlop={12}
          testID="info-admin-link"
        >
          <Feather name="lock" size={11} color={colors.muted} />
          <Text style={styles.adminLinkText}>Area riservata gestore</Text>
        </Pressable>

        <Text style={styles.footer}>© Il Pescematto · Trattoria del Mare</Text>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  bannerWrap: {
    height: 280,
    width: "100%",
    position: "relative",
  },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "flex-end",
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.brandPrimary,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 32,
    color: colors.onSurface,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.brandPrimary,
    opacity: 0.7,
    marginVertical: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceSecondary,
    letterSpacing: 0.6,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: -18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  statusText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.onSurface,
    letterSpacing: 0.4,
  },
  card: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  cardTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  contactValue: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.onSurface,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  contactLink: {
    color: colors.brandPrimary,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  btnPrimaryText: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.brandSecondary,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  btnSecondaryText: {
    color: colors.onBrandSecondary,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  hoursList: {
    marginTop: spacing.lg,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  hourRowToday: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.sm,
    borderBottomWidth: 0,
  },
  hourDay: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceSecondary,
  },
  hourDayToday: {
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  hourSlot: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceSecondary,
    letterSpacing: 0.3,
  },
  hourSlotToday: {
    color: colors.brandPrimary,
    fontFamily: fonts.bodyBold,
  },
  hourClosed: {
    fontFamily: fonts.body,
    fontStyle: "italic",
    color: colors.muted,
  },
  noteCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "rgba(196,164,100,0.06)",
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceSecondary,
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing.xxl,
    textAlign: "center",
    fontFamily: fonts.displayItalic,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.6,
  },
  legalCard: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  legalTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.brandPrimary,
    marginBottom: spacing.sm,
  },
  legalCompany: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: colors.onSurface,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  legalLine: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  adminLink: {
    marginTop: spacing.lg,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  adminLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
  },
}));
