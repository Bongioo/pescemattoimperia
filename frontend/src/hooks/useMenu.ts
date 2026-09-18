import { useEffect, useState } from "react";
import { MENU as DEFAULT_MENU, MenuCategory, MenuItem } from "@/src/data/menu";
import {
  fetchMenu,
  saveMenu as saveMenuApi,
  resetMenuApi,
  ApiError,
} from "@/src/api";
import { forceLogout } from "@/src/hooks/useSettings";

type Listener = (menu: MenuCategory[]) => void;
const listeners = new Set<Listener>();
let currentMenu: MenuCategory[] = DEFAULT_MENU;
let menuLoaded = false;

function cloneDefault(): MenuCategory[] {
  return JSON.parse(JSON.stringify(DEFAULT_MENU));
}

function cloneMenu(menu: MenuCategory[]): MenuCategory[] {
  return menu.map((c) => ({
    ...c,
    items: c.items.map((i) => ({
      ...i,
      allergens: i.allergens ? [...i.allergens] : undefined,
    })),
  }));
}

function notify(menu: MenuCategory[]) {
  currentMenu = menu;
  listeners.forEach((l) => l(menu));
}

async function loadMenu(): Promise<MenuCategory[]> {
  try {
    const remote = await fetchMenu();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return remote as MenuCategory[];
    }
  } catch {
    /* fall back to default */
  }
  return cloneDefault();
}

async function pushMenu(menu: MenuCategory[]): Promise<boolean> {
  try {
    const saved = await saveMenuApi(menu);
    notify(saved);
    return true;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await forceLogout();
    }
    return false;
  }
}

export function useMenu(): { menu: MenuCategory[]; loaded: boolean; reload: () => Promise<void> } {
  const [state, setState] = useState<{ menu: MenuCategory[]; loaded: boolean }>({
    menu: currentMenu,
    loaded: menuLoaded,
  });

  useEffect(() => {
    let mounted = true;
    if (!menuLoaded) {
      menuLoaded = true;
      loadMenu().then((m) => {
        if (!mounted) return;
        notify(m);
      });
    }
    const l: Listener = (m) => setState({ menu: m, loaded: true });
    listeners.add(l);
    return () => {
      mounted = false;
      listeners.delete(l);
    };
  }, []);

  return {
    menu: state.menu,
    loaded: state.loaded,
    reload: async () => {
      const m = await loadMenu();
      notify(m);
    },
  };
}

export function getCurrentMenu(): MenuCategory[] {
  return currentMenu;
}

// ---------- Mutations (admin) ----------
export async function addItem(categoryId: string, item: MenuItem): Promise<boolean> {
  const menu = cloneMenu(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat) return false;
  cat.items.push(item);
  return pushMenu(menu);
}

export async function updateItem(
  categoryId: string,
  index: number,
  item: MenuItem,
): Promise<boolean> {
  const menu = cloneMenu(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat || index < 0 || index >= cat.items.length) return false;
  cat.items[index] = item;
  return pushMenu(menu);
}

export async function deleteItem(categoryId: string, index: number): Promise<boolean> {
  const menu = cloneMenu(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat || index < 0 || index >= cat.items.length) return false;
  cat.items.splice(index, 1);
  return pushMenu(menu);
}

export async function moveItem(
  categoryId: string,
  index: number,
  direction: -1 | 1,
): Promise<boolean> {
  const menu = cloneMenu(currentMenu);
  const cat = menu.find((c) => c.id === categoryId);
  if (!cat) return false;
  const target = index + direction;
  if (target < 0 || target >= cat.items.length) return false;
  const [moved] = cat.items.splice(index, 1);
  cat.items.splice(target, 0, moved);
  return pushMenu(menu);
}

export async function resetMenu(): Promise<boolean> {
  try {
    await resetMenuApi();
    const fresh = cloneDefault();
    notify(fresh);
    return true;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await forceLogout();
    }
    return false;
  }
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
