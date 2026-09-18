import { storage } from "@/src/utils/storage";
import type { MenuCategory } from "@/src/data/menu";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const TOKEN_KEY = "auth.token";

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn("EXPO_PUBLIC_BACKEND_URL not set — backend calls will fail.");
}

// ---------- Token storage ----------
export async function getToken(): Promise<string | null> {
  return storage.getItem<string>(TOKEN_KEY, "");
}

export async function setToken(token: string): Promise<void> {
  await storage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await storage.removeItem(TOKEN_KEY);
}

// ---------- Low-level fetch ----------
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  { auth = false }: { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (auth) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.detail ?? "";
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// ---------- Auth ----------
export type TokenResponse = { access_token: string; token_type: string; expires_in: number };

export async function loginApi(username: string, password: string): Promise<TokenResponse> {
  const data = await request<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  await setToken(data.access_token);
  return data;
}

export async function logoutApi(): Promise<void> {
  await clearToken();
}

export async function isAuthenticated(): Promise<boolean> {
  const t = await getToken();
  return !!t;
}

// ---------- Settings ----------
export async function fetchPhone(): Promise<string | null> {
  const data = await request<{ phone: string | null }>("/api/settings/phone");
  return data.phone ?? null;
}

export async function savePhone(phone: string): Promise<string> {
  const data = await request<{ phone: string }>(
    "/api/settings/phone",
    { method: "PUT", body: JSON.stringify({ phone }) },
    { auth: true },
  );
  return data.phone;
}

export async function fetchMenu(): Promise<MenuCategory[] | null> {
  const data = await request<{ menu: MenuCategory[] | null }>("/api/settings/menu");
  return data.menu ?? null;
}

export async function saveMenu(menu: MenuCategory[]): Promise<MenuCategory[]> {
  const data = await request<{ menu: MenuCategory[] }>(
    "/api/settings/menu",
    { method: "PUT", body: JSON.stringify({ menu }) },
    { auth: true },
  );
  return data.menu;
}

export async function resetMenuApi(): Promise<void> {
  await request<{ menu: null }>(
    "/api/settings/menu",
    { method: "DELETE" },
    { auth: true },
  );
}
