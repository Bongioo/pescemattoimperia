import { useState } from "react";
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
import { useRouter, Stack } from "expo-router";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { useAdminAuth } from "@/src/hooks/useSettings";

export default function AdminLogin() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAdminAuth();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const haptic = (style: "light" | "error" = "light") => {
    if (Platform.OS === "web") return;
    if (style === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const err = await login(user, pass);
    setSubmitting(false);
    if (!err) {
      haptic("light");
      router.replace("/admin/settings");
    } else {
      haptic("error");
      setError(err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container} testID="admin-login-screen">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom + spacing.xl,
              paddingHorizontal: spacing.xl,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={12}
              testID="admin-login-back"
            >
              <Feather name="chevron-left" size={22} color={colors.onSurface} />
              <Text style={styles.backText}>Indietro</Text>
            </Pressable>

            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Feather name="lock" size={22} color={colors.brandPrimary} />
              </View>
              <Text style={styles.eyebrow}>Area riservata</Text>
              <Text style={styles.title}>Accesso Gestore</Text>
              <View style={styles.divider} />
              <Text style={styles.subtitle}>
                Accedi per modificare le informazioni del ristorante.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrap}>
                <Feather name="user" size={16} color={colors.muted} />
                <TextInput
                  style={styles.input}
                  value={user}
                  onChangeText={setUser}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="username"
                  placeholderTextColor={colors.muted}
                  testID="admin-login-user"
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Feather name="key" size={16} color={colors.muted} />
                <TextInput
                  style={styles.input}
                  value={pass}
                  onChangeText={setPass}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="password"
                  placeholderTextColor={colors.muted}
                  onSubmitEditing={submit}
                  returnKeyType="go"
                  testID="admin-login-pass"
                />
                <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8}>
                  <Feather
                    name={showPass ? "eye-off" : "eye"}
                    size={16}
                    color={colors.muted}
                  />
                </Pressable>
              </View>

              {!!error && (
                <Text style={styles.error} testID="admin-login-error">
                  {error}
                </Text>
              )}

              <Pressable
                onPress={submit}
                disabled={submitting || !user || !pass}
                style={({ pressed }) => [
                  styles.submit,
                  (submitting || !user || !pass) && styles.submitDisabled,
                  pressed && { opacity: 0.85 },
                ]}
                testID="admin-login-submit"
              >
                <Text style={styles.submitText}>Accedi</Text>
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
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  backText: {
    color: colors.onSurface,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(196,164,100,0.08)",
  },
  eyebrow: {
    marginTop: spacing.lg,
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
  form: {
    marginTop: spacing.xxl,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
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
  error: {
    marginTop: spacing.md,
    color: "#E5847E",
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  submit: {
    marginTop: spacing.xl,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
}));
