import { ReactNode } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import { useRouter, Stack } from "expo-router";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";

export function LegalPage({
  eyebrow,
  title,
  children,
  testID,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  testID?: string;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container} testID={testID}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xxl,
            paddingHorizontal: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/info"))}
            style={styles.backBtn}
            hitSlop={12}
            testID="legal-back"
          >
            <Feather name="chevron-left" size={22} color={colors.onSurface} />
            <Text style={styles.backText}>Indietro</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.divider} />
          </View>

          {children}
        </ScrollView>
      </View>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <Text style={styles.paragraph}>{children}</Text>;
}

export function LegalBullets({ items }: { items: string[] }) {
  const styles = useStyles();
  return (
    <View style={{ marginTop: spacing.sm }}>
      {items.map((t, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export function LegalTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  const styles = useStyles();
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHead]}>
        {columns.map((c, i) => (
          <Text key={i} style={[styles.tableCell, styles.tableHeadCell]}>
            {c}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.tableRow}>
          {row.map((cell, ci) => (
            <Text key={ci} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function LegalCallout({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.callout}>
      <Feather name="info" size={14} color="#C4A464" />
      <Text style={styles.calloutText}>{children}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: { flex: 1, backgroundColor: colors.surface },
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
    marginTop: spacing.md,
    marginBottom: spacing.xl,
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
    fontSize: 34,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.brandPrimary,
    opacity: 0.7,
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.onSurface,
    letterSpacing: 0.3,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.sm,
  },
  bullet: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    paddingLeft: 4,
  },
  bulletDot: {
    color: colors.brandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 19,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSurfaceSecondary,
  },
  table: {
    marginTop: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  tableHead: {
    backgroundColor: colors.surfaceTertiary,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceSecondary,
    lineHeight: 16,
  },
  tableHeadCell: {
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  callout: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: "rgba(196,164,100,0.06)",
  },
  calloutText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.onSurfaceSecondary,
  },
}));
