import { useEffect, useState } from "react";
import { storage } from "@/src/utils/storage";
import { MENU as DEFAULT_MENU, MenuCategory, MenuItem } from "@/src/data/menu";

const MENU_KEY = "settings.menu";

type Listener = (menu: MenuCategory[]) => void;
const listeners = new Set<Listener>();
let currentMenu: MenuCategory[] = DEFAULT_MENU;

function cloneDefault(): MenuCategory[] {
  return JSON.parse(JSON.stringify(DEFAULT_MENU));
}

function notify(menu: MenuCategory[]) {
  currentMenu = menu;
  listeners.forEach((l) => l(menu));
}

async function loadMenu(): Promise<MenuCategory[]> {
  const raw = await storage.getItem<any>(MENU_KEY, null as any);
  if (raw && Array.isArray(raw) && raw.length > 0) {
    return raw as MenuCategory[];
  }
  return cloneDefault();
}

async function persist(menu: MenuCategory[]): Promise<boolean> {
  const ok = await storage.setItem(MENU_KEY, menu as any);
  if (ok) notify(menu);
  return ok;
}

export function useMenu(): { menu: MenuCategory[]; reload: () => Promise<void> } {
  const [menu, setMenu] = useState<MenuCategory[]>(currentMenu);

  useEffect(() => {
    let mounted = true;
    loadMenu().then((m) => {
      if (mounted) {
        currentMenu = m;
        setMenu(m);
      }
    });
    const l: Listener = (m) => setMenu(m);
    listeners.add(l);
    return () => {
      mounted = false;
      listeners.delete(l);
    };
  }, []);

  return {
    menu,
    reload: async () => {
      const m = await loadMenu();
      notify(m);
    },
  };
}

export function getCurrentMenu(): MenuCategory[] {
  return currentMenu;
}

// --- Mutations ---

export async function addItem(categoryId: string, item: MenuItem): Promise<boolean> {
  const menu = cloneStructure(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat) return false;
  cat.items.push(item);
  return persist(menu);
}

export async function updateItem(
  categoryId: string,
  index: number,
  item: MenuItem,
): Promise<boolean> {
  const menu = cloneStructure(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat || index < 0 || index >= cat.items.length) return false;
  cat.items[index] = item;
  return persist(menu);
}

export async function deleteItem(categoryId: string, index: number): Promise<boolean> {
  const menu = cloneStructure(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat || index < 0 || index >= cat.items.length) return false;
  cat.items.splice(index, 1);
  return persist(menu);
}

export async function moveItem(
  categoryId: string,
  index: number,
  direction: -1 | 1,
): Promise<boolean> {
  const menu = cloneStructure(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat) return false;
  const target = index + direction;
  if (target < 0 || target >= cat.items.length) return false;
  const [moved] = cat.items.splice(index, 1);
  cat.items.splice(target, 0, moved);
  return persist(menu);
}

export async function resetMenu(): Promise<boolean> {
  const menu = cloneDefault();
  return persist(menu);
}

function cloneStructure(menu: MenuCategory[]): MenuCategory[] {
  return menu.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i, allergens: i.allergens ? [...i.allergens] : undefined })) }));
}

export function parseAllergens(text: string): number[] | undefined {
  const parts = text
    .split(/[,;\s]+/)
    .map((p) => parseInt(p, 10))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 14);
  if (parts.length === 0) return undefined;
  return Array.from(new Set(parts)).sort((a, b) => a - b);
}

export function formatAllergens(a: number[] | undefined): string {
  return a && a.length ? a.join(", ") : "";
}
