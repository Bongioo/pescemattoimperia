import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter, Stack, Redirect } from "expo-router";

import { makeStyles, useTheme, fonts, spacing, radius } from "@/src/theme";
import { useAdminAuth } from "@/src/hooks/useSettings";
import {
  useMenu,
  addItem,
  updateItem,
  deleteItem,
  moveItem,
  resetMenu,
  parseAllergens,
  formatAllergens,
} from "@/src/hooks/useMenu";
import { MenuItem } from "@/src/data/menu";

type Editing =
  | { mode: "add"; categoryId: string; index: -1; draft: MenuItem; allergensText: string }
  | { mode: "edit"; categoryId: string; index: number; draft: MenuItem; allergensText: string }
  | null;

type Confirm =
  | { kind: "delete"; categoryId: string; index: number; name: string }
  | { kind: "reset" }
  | null;

const emptyItem = (): MenuItem => ({ name: "", description: "", price: "", allergens: undefined });

export default function AdminMenuEditor() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, loaded } = useAdminAuth();
  const { menu } = useMenu();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const first = menu[0]?.id;
    return first ? { [first]: true } : {};
  });
  const [editing, setEditing] = useState<Editing>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: "#05080F" }} />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/admin/login" />;
  }

  const haptic = (style: "light" | "success" | "error" = "light") => {
    if (Platform.OS === "web") return;
    if (style === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else if (style === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } else {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const openAdd = (categoryId: string) => {
    haptic("light");
    setEditing({
      mode: "add",
      categoryId,
      index: -1,
      draft: emptyItem(),
      allergensText: "",
    });
  };

  const openEdit = (categoryId: string, index: number, item: MenuItem) => {
    haptic("light");
    setEditing({
      mode: "edit",
      categoryId,
      index,
      draft: { ...item, description: item.description ?? "", note: item.note ?? "" },
      allergensText: formatAllergens(item.allergens),
    });
  };

  const closeEditor = () => setEditing(null);

  const saveEditor = async () => {
    if (!editing) return;
    const name = editing.draft.name.trim();
    const price = editing.draft.price.trim();
    if (!name) {
      haptic("error");
      return;
    }
    const finalItem: MenuItem = {
      name,
      description: editing.draft.description?.trim() || undefined,
      price: price || "s.q.",
      allergens: parseAllergens(editing.allergensText),
    };
    const ok =
      editing.mode === "add"
        ? await addItem(editing.categoryId, finalItem)
        : await updateItem(editing.categoryId, editing.index, finalItem);
    if (ok) {
      haptic("success");
      showToast(editing.mode === "add" ? "Piatto aggiunto" : "Piatto aggiornato");
      closeEditor();
    } else {
      haptic("error");
    }
  };

  const performDelete = async () => {
    if (!confirm || confirm.kind !== "delete") return;
    const ok = await deleteItem(confirm.categoryId, confirm.index);
    setConfirm(null);
    if (ok) {
      haptic("success");
      showToast("Piatto eliminato");
    } else {
      haptic("error");
    }
  };

  const performReset = async () => {
    const ok = await resetMenu();
    setConfirm(null);
    if (ok) {
      haptic("success");
      showToast("Menu ripristinato");
    } else {
      haptic("error");
    }
  };

  const doMove = async (categoryId: string, index: number, dir: -1 | 1) => {
    haptic("light");
    await moveItem(categoryId, index, dir);
  };

  const toggle = (id: string) => {
    haptic("light");
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container} testID="admin-menu-editor-screen">
        {/* Header */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={12}
            testID="admin-menu-back"
          >
            <Feather name="chevron-left" size={22} color={colors.onSurface} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>Gestore · Modifica</Text>
            <Text style={styles.title}>Menu</Text>
          </View>
          <Pressable
            onPress={() => {
              haptic("light");
              setConfirm({ kind: "reset" });
            }}
            style={styles.resetBtn}
            hitSlop={8}
            testID="admin-menu-reset"
          >
            <Feather name="rotate-ccw" size={13} color={colors.muted} />
            <Text style={styles.resetText}>Ripristina</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {menu.map((cat) => {
            const open = !!expanded[cat.id];
            return (
              <View key={cat.id} style={styles.categoryCard} testID={`cat-card-${cat.id}`}>
                <Pressable
                  onPress={() => toggle(cat.id)}
                  style={styles.categoryHeader}
                  testID={`cat-toggle-${cat.id}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryTitle}>{cat.title}</Text>
                    <Text style={styles.categoryCount}>
                      {cat.items.length} {cat.items.length === 1 ? "piatto" : "piatti"}
                    </Text>
                  </View>
                  <Feather
                    name={open ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>

                {open && (
                  <View style={styles.itemsList}>
                    {cat.items.map((item, idx) => (
                      <View
                        key={`${item.name}-${idx}`}
                        style={styles.itemRow}
                        testID={`edit-item-${cat.id}-${idx}`}
                      >
                        <View style={{ flex: 1, paddingRight: spacing.sm }}>
                          <Text style={styles.itemName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          {!!item.description && (
                            <Text style={styles.itemDesc} numberOfLines={2}>
                              {item.description}
                            </Text>
                          )}
                          <View style={styles.itemMeta}>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                            {!!item.allergens?.length && (
                              <Text style={styles.itemAllergens}>
                                Allergeni: {item.allergens.join(", ")}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={styles.itemActions}>
                          <Pressable
                            onPress={() => doMove(cat.id, idx, -1)}
                            disabled={idx === 0}
                            style={[styles.miniBtn, idx === 0 && styles.miniBtnDisabled]}
                            hitSlop={6}
                            testID={`move-up-${cat.id}-${idx}`}
                          >
                            <Feather name="arrow-up" size={14} color={colors.onSurfaceSecondary} />
                          </Pressable>
                          <Pressable
                            onPress={() => doMove(cat.id, idx, 1)}
                            disabled={idx === cat.items.length - 1}
                            style={[
                              styles.miniBtn,
                              idx === cat.items.length - 1 && styles.miniBtnDisabled,
                            ]}
                            hitSlop={6}
                            testID={`move-down-${cat.id}-${idx}`}
                          >
                            <Feather name="arrow-down" size={14} color={colors.onSurfaceSecondary} />
                          </Pressable>
                          <Pressable
                            onPress={() => openEdit(cat.id, idx, item)}
                            style={styles.miniBtn}
                            hitSlop={6}
                            testID={`edit-btn-${cat.id}-${idx}`}
                          >
                            <Feather name="edit-2" size={14} color={colors.brandPrimary} />
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              haptic("light");
                              setConfirm({
                                kind: "delete",
                                categoryId: cat.id,
                                index: idx,
                                name: item.name,
                              });
                            }}
                            style={styles.miniBtn}
                            hitSlop={6}
                            testID={`delete-btn-${cat.id}-${idx}`}
                          >
                            <Feather name="trash-2" size={14} color="#E5847E" />
                          </Pressable>
                        </View>
                      </View>
                    ))}

                    <Pressable
                      onPress={() => openAdd(cat.id)}
                      style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
                      testID={`add-btn-${cat.id}`}
                    >
                      <Feather name="plus" size={14} color={colors.brandPrimary} />
                      <Text style={styles.addBtnText}>Aggiungi piatto</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Toast */}
        {!!toast && (
          <View style={[styles.toast, { bottom: insets.bottom + spacing.xl }]} testID="admin-menu-toast">
            <Feather name="check-circle" size={14} color="#5EAD6E" />
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        )}

        {/* Editor Modal */}
        <Modal
          visible={!!editing}
          animationType="slide"
          transparent
          onRequestClose={closeEditor}
        >
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ width: "100%" }}
            >
              <View style={[styles.modalSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHead}>
                  <Text style={styles.modalTitle}>
                    {editing?.mode === "add" ? "Nuovo piatto" : "Modifica piatto"}
                  </Text>
                  <Pressable onPress={closeEditor} hitSlop={12} testID="editor-close">
                    <Feather name="x" size={22} color={colors.onSurface} />
                  </Pressable>
                </View>

                {editing && (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.fieldLabel}>Nome piatto *</Text>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.input}
                        value={editing.draft.name}
                        onChangeText={(t) =>
                          setEditing({ ...editing, draft: { ...editing.draft, name: t } })
                        }
                        placeholder="Es. Spaghetti alle vongole"
                        placeholderTextColor={colors.muted}
                        testID="editor-name"
                      />
                    </View>

                    <Text style={styles.fieldLabel}>Descrizione</Text>
                    <View style={[styles.field, { minHeight: 72 }]}>
                      <TextInput
                        style={[styles.input, { textAlignVertical: "top", paddingTop: 8 }]}
                        value={editing.draft.description ?? ""}
                        onChangeText={(t) =>
                          setEditing({ ...editing, draft: { ...editing.draft, description: t } })
                        }
                        multiline
                        placeholder="Ingredienti, dettagli…"
                        placeholderTextColor={colors.muted}
                        testID="editor-description"
                      />
                    </View>

                    <View style={styles.fieldRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fieldLabel}>Prezzo</Text>
                        <View style={styles.field}>
                          <TextInput
                            style={styles.input}
                            value={editing.draft.price}
                            onChangeText={(t) =>
                              setEditing({ ...editing, draft: { ...editing.draft, price: t } })
                            }
                            placeholder="€ 12,00 · s.q."
                            placeholderTextColor={colors.muted}
                            testID="editor-price"
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fieldLabel}>Allergeni</Text>
                        <View style={styles.field}>
                          <TextInput
                            style={styles.input}
                            value={editing.allergensText}
                            onChangeText={(t) => setEditing({ ...editing, allergensText: t })}
                            placeholder="es. 1, 4, 14"
                            placeholderTextColor={colors.muted}
                            keyboardType="numbers-and-punctuation"
                            testID="editor-allergens"
                          />
                        </View>
                      </View>
                    </View>

                    <Text style={styles.fieldHint}>
                      Numeri da 1 a 14, separati da virgola. Consulta la legenda in app.
                    </Text>

                    <Pressable
                      onPress={saveEditor}
                      disabled={!editing.draft.name.trim()}
                      style={({ pressed }) => [
                        styles.saveBtn,
                        !editing.draft.name.trim() && { opacity: 0.4 },
                        pressed && { opacity: 0.85 },
                      ]}
                      testID="editor-save"
                    >
                      <Feather name="check" size={16} color={colors.onBrandPrimary} />
                      <Text style={styles.saveBtnText}>
                        {editing.mode === "add" ? "Aggiungi" : "Salva"}
                      </Text>
                    </Pressable>
                  </ScrollView>
                )}
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Confirm Modal */}
        <Modal
          visible={!!confirm}
          animationType="fade"
          transparent
          onRequestClose={() => setConfirm(null)}
        >
          <View style={styles.confirmBackdrop}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>
                {confirm?.kind === "delete" ? "Elimina piatto?" : "Ripristina menu originale?"}
              </Text>
              <Text style={styles.confirmMsg}>
                {confirm?.kind === "delete"
                  ? `"${confirm.name}" verrà rimosso dal menu.`
                  : "Tutte le modifiche verranno annullate e il menu tornerà all'originale."}
              </Text>
              <View style={styles.confirmRow}>
                <Pressable
                  onPress={() => setConfirm(null)}
                  style={({ pressed }) => [styles.confirmSecondary, pressed && { opacity: 0.85 }]}
                  testID="confirm-cancel"
                >
                  <Text style={styles.confirmSecondaryText}>Annulla</Text>
                </Pressable>
                <Pressable
                  onPress={confirm?.kind === "delete" ? performDelete : performReset}
                  style={({ pressed }) => [styles.confirmPrimary, pressed && { opacity: 0.85 }]}
                  testID="confirm-ok"
                >
                  <Text style={styles.confirmPrimaryText}>
                    {confirm?.kind === "delete" ? "Elimina" : "Ripristina"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
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
    fontSize: 28,
    color: colors.onSurface,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: 4,
  },
  resetText: {
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  categoryCard: {
    marginTop: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  categoryTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  categoryCount: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  itemsList: {
    borderTopWidth: 0.5,
    borderTopColor: colors.divider,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  itemName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.onSurface,
  },
  itemDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: 4,
    flexWrap: "wrap",
  },
  itemPrice: {
    fontFamily: fonts.displayBold,
    fontSize: 13,
    color: colors.brandPrimary,
  },
  itemAllergens: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  miniBtnDisabled: {
    opacity: 0.35,
  },
  addBtn: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.brandPrimary,
    borderStyle: "dashed",
  },
  addBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.brandPrimary,
    textTransform: "uppercase",
  },
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 0.5,
    borderColor: "#5EAD6E",
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  toastText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.onSurface,
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
  modalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.onSurface,
  },
  fieldLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: spacing.md,
    marginBottom: 6,
  },
  fieldRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  field: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    minHeight: 48,
  },
  input: {
    color: colors.onSurface,
    fontFamily: fonts.body,
    fontSize: 15,
    minHeight: 40,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  fieldHint: {
    fontFamily: fonts.body,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
  },
  saveBtn: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  saveBtnText: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  confirmTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    color: colors.onSurface,
  },
  confirmMsg: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceSecondary,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  confirmRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  confirmSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  confirmSecondaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.onSurface,
  },
  confirmPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
  },
  confirmPrimaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.onBrandPrimary,
  },
}));
