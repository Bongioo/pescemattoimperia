import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter, Stack, Redirect } from "expo-router";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { useAdminAuth, usePhoneNumber, updatePhoneNumber, formatPhone } from "@/src/hooks/useSettings";
import { useMenu } from "@/src/hooks/useMenu";

export default function AdminSettings() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminAuth();
  const { phone } = usePhoneNumber();
  const { menu } = useMenu();

  const [value, setValue] = useState<string>(phone);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(phone);
  }, [phone]);

  if (!isAuthenticated) {
    return <Redirect href="/admin/login" />;
  }

  const haptic = (style: "success" | "error" | "light" = "light") => {
    if (Platform.OS === "web") return;
    if (style === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else if (style === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const save = async () => {
    const cleaned = value.trim();
    if (!/^[\d\s()+.-]{6,20}$/.test(cleaned)) {
      setError("Numero non valido. Inserisci solo cifre e simboli telefonici.");
      haptic("error");
      return;
    }
    const digitsOnly = cleaned.replace(/\D/g, "");
    if (digitsOnly.length < 6) {
      setError("Numero troppo corto.");
      haptic("error");
      return;
    }
    setError(null);
    const ok = await updatePhoneNumber(digitsOnly);
    if (ok) {
      setSaved(true);
      haptic("success");
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError("Impossibile salvare. Riprova.");
      haptic("error");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/(tabs)/info");
  };

  const totalItems = menu.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container} testID="admin-settings-screen">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom + spacing.xxl,
              paddingHorizontal: spacing.xl,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.iconBtn}
                hitSlop={12}
                testID="admin-settings-back"
              >
                <Feather name="chevron-left" size={22} color={colors.onSurface} />
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={styles.logoutBtn}
                hitSlop={12}
                testID="admin-logout"
              >
                <Feather name="log-out" size={14} color={colors.muted} />
                <Text style={styles.logoutText}>Esci</Text>
              </Pressable>
            </View>

            <View style={styles.header}>
              <Text style={styles.eyebrow}>Area riservata</Text>
              <Text style={styles.title}>Impostazioni</Text>
              <View style={styles.divider} />
              <Text style={styles.subtitle}>
                Aggiorna il numero di telefono e il menu del ristorante.
              </Text>
            </View>

            {/* Menu editor entry */}
            <Pressable
              onPress={() => {
                haptic("light");
                router.push("/admin/menu");
              }}
              style={({ pressed }) => [styles.linkCard, pressed && { opacity: 0.9 }]}
              testID="admin-menu-editor-link"
            >
              <View style={styles.linkIcon}>
                <Feather name="book-open" size={20} color={colors.brandPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Modifica menu</Text>
                <Text style={styles.linkHint}>
                  {menu.length} categorie · {totalItems} piatti
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.muted} />
            </Pressable>

            {/* Phone editor card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Numero di telefono</Text>
              <Text style={styles.cardHint}>
                Verrà mostrato ai clienti in home e nella pagina Info.
              </Text>

              <Text style={styles.label}>Numero</Text>
              <View style={styles.inputWrap}>
                <Feather name="phone" size={16} color={colors.muted} />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={(t) => {
                    setValue(t);
                    setSaved(false);
                    setError(null);
                  }}
                  keyboardType="phone-pad"
                  placeholder="0183754557"
                  placeholderTextColor={colors.muted}
                  testID="admin-phone-input"
                />
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Anteprima</Text>
                <Text style={styles.previewValue}>{formatPhone(value) || "—"}</Text>
              </View>

              {!!error && (
                <Text style={styles.error} testID="admin-phone-error">
                  {error}
                </Text>
              )}
              {saved && (
                <View style={styles.savedPill} testID="admin-phone-saved">
                  <Feather name="check-circle" size={14} color="#5EAD6E" />
                  <Text style={styles.savedText}>Salvato</Text>
                </View>
              )}

              <Pressable
                onPress={save}
                style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}
                testID="admin-phone-save"
              >
                <Feather name="save" size={16} color={colors.onBrandPrimary} />
                <Text style={styles.submitText}>Salva modifiche</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  logoutText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  header: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.brandPrimary,
  },
  title: {
    marginTop: 4,
    fontFamily: fonts.displayBold,
    fontSize: 30,
    color: colors.onSurface,
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
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    letterSpacing: 0.3,
    paddingHorizontal: spacing.xl,
  },
  linkCard: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  linkTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.onSurface,
  },
  linkHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  card: {
    marginTop: spacing.xl,
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
  },
  cardHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    color: colors.onSurface,
    fontFamily: fonts.body,
    fontSize: 15,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.divider,
  },
  previewLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  previewValue: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.brandPrimary,
    letterSpacing: 0.4,
  },
  error: {
    marginTop: spacing.md,
    color: "#E5847E",
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  savedPill: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderWidth: 0.5,
    borderColor: "#5EAD6E",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(94,173,110,0.08)",
  },
  savedText: {
    color: "#5EAD6E",
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  submit: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  submitText: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
}));
