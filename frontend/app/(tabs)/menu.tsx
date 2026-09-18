import { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SectionList,
  Platform,
  useWindowDimensions,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { ALLERGENS, RESTAURANT_INFO, MenuItem } from "@/src/data/menu";
import { useTabBarHeight } from "@/src/utils/tabBar";
import { useMenu } from "@/src/hooks/useMenu";
type Section = {
  id: string;
  title: string;
  subtitle?: string;
  data: MenuItem[];
};

export default function MenuScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const { width } = useWindowDimensions();

  const { menu } = useMenu();

  const [activeCat, setActiveCat] = useState<string>(menu[0]?.id ?? "");
  const [allergensOpen, setAllergensOpen] = useState(false);
  const listRef = useRef<SectionList<MenuItem, Section>>(null);
  const chipsRef = useRef<ScrollView>(null);
  const chipLayoutsRef = useRef<Record<string, { x: number; width: number }>>({});
  const activeCatRef = useRef(activeCat);
  activeCatRef.current = activeCat;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const first = viewableItems.find((v: any) => v.section);
    if (first?.section) {
      const secId = first.section.id;
      if (secId !== activeCatRef.current) {
        setActiveCat(secId);
      }
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 30 }).current;

  const sections: Section[] = useMemo(
    () =>
      menu
        .filter((c) => c.items.length > 0)
        .map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          data: c.items,
        })),
    [menu],
  );

  const haptic = () =>
    Platform.OS !== "web" && Haptics.selectionAsync().catch(() => {});

  const scrollToCategory = useCallback((catId: string, index: number) => {
    haptic();
    setActiveCat(catId);
    listRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewOffset: 0,
    });
    // Center the chip in the horizontal scroller
    const layout = chipLayoutsRef.current[catId];
    if (layout) {
      chipsRef.current?.scrollTo({
        x: Math.max(0, layout.x - width / 2 + layout.width / 2),
        animated: true,
      });
    }
  }, [width]);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemRow} testID={`menu-item-${item.name}`}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <View style={styles.itemHead}>
          <Text style={styles.itemName}>{item.name}</Text>
          {!!item.allergens?.length && (
            <View style={styles.allergenChip}>
              <Text style={styles.allergenChipText}>
                {item.allergens.join(",")}
              </Text>
            </View>
          )}
        </View>
        {!!item.description && (
          <Text style={styles.itemDesc}>{item.description}</Text>
        )}
      </View>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionRule} />
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionRule} />
      </View>
      {!!section.subtitle && (
        <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container} testID="menu-screen">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerEyebrow}>Il Pescematto</Text>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerCover}>Coperto {RESTAURANT_INFO.coverCharge}</Text>
      </View>

      {/* Category chips (sticky, horizontal) */}
      <View style={styles.chipsWrap}>
        <ScrollView
          ref={chipsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
          testID="menu-category-chips"
        >
          {menu.filter((c) => c.items.length > 0).map((c, idx) => {
            const active = c.id === activeCat;
            return (
              <Pressable
                key={c.id}
                onLayout={(e) => {
                  chipLayoutsRef.current[c.id] = {
                    x: e.nativeEvent.layout.x,
                    width: e.nativeEvent.layout.width,
                  };
                }}
                onPress={() => scrollToCategory(c.id, idx)}
                style={[styles.chip, active && styles.chipActive]}
                testID={`chip-${c.id}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + spacing.xxxl,
          paddingHorizontal: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        testID="menu-list"
      />

      {/* Floating Allergens button */}
      <Pressable
        onPress={() => {
          haptic();
          setAllergensOpen(true);
        }}
        style={[styles.fab, { bottom: tabBarHeight + spacing.md }]}
        testID="allergens-fab"
      >
        <Feather name="info" size={16} color={colors.onBrandPrimary} />
        <Text style={styles.fabText}>Allergeni</Text>
      </Pressable>

      {/* Allergens Modal */}
      <Modal
        visible={allergensOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAllergensOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Allergeni</Text>
              <Pressable
                onPress={() => setAllergensOpen(false)}
                hitSlop={12}
                testID="allergens-close"
              >
                <Feather name="x" size={22} color={colors.onSurface} />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: spacing.xxl + insets.bottom }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalIntro}>
                Il ristorante rispetta le normative igienico-sanitarie e informa
                sulla presenza di allergeni. Comunica al personale eventuali
                esigenze.
              </Text>
              {ALLERGENS.map((a) => (
                <View key={a.id} style={styles.allergenRow}>
                  <View style={styles.allergenNum}>
                    <Text style={styles.allergenNumText}>{a.id}</Text>
                  </View>
                  <Text style={styles.allergenName}>{a.name}</Text>
                </View>
              ))}
              <Text style={styles.modalFootnote}>
                * Occasionalmente, in mancanza di prodotto fresco, può essere
                utilizzato un prodotto di pari qualità congelato. Alcuni piatti
                contengono aglio.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerEyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.brandPrimary,
  },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    color: colors.onSurface,
    marginTop: 2,
  },
  headerCover: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  chipsWrap: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    height: 56,
    justifyContent: "center",
  },
  chipsContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    alignItems: "center",
  },
  chip: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    backgroundColor: "rgba(14,22,36,0.6)",
  },
  chipActive: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.brandPrimary,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.onSurfaceSecondary,
    textTransform: "uppercase",
  },
  chipTextActive: {
    color: colors.onBrandPrimary,
  },
  sectionHeader: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sectionRule: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.brandPrimary,
    opacity: 0.5,
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.onSurface,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionSubtitle: {
    fontFamily: fonts.displayItalic,
    fontStyle: "italic",
    fontSize: 14,
    color: colors.muted,
    marginTop: 6,
    textAlign: "center",
  },
  itemRow: {
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  itemName: {
    fontFamily: fonts.displayBold,
    fontSize: 17,
    color: colors.onSurface,
    letterSpacing: 0.2,
  },
  itemDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  itemPrice: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.brandPrimary,
    letterSpacing: 0.3,
    minWidth: 78,
    textAlign: "right",
  },
  allergenChip: {
    borderWidth: 0.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  allergenChipText: {
    fontFamily: fonts.body,
    fontSize: 9,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  itemDivider: {
    height: 0.5,
    backgroundColor: colors.divider,
  },
  fab: {
    position: "absolute",
    right: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
    elevation: 8,
    ...(Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 }
      : {}),
  },
  fabText: {
    fontFamily: fonts.bodyBold,
    color: colors.onBrandPrimary,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.surfaceSecondary,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    color: colors.onSurface,
  },
  modalIntro: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  allergenRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  allergenNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  allergenNumText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.onBrandPrimary,
  },
  allergenName: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceSecondary,
    lineHeight: 18,
  },
  modalFootnote: {
    fontFamily: fonts.body,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.muted,
    marginTop: spacing.lg,
    lineHeight: 16,
  },
}));
