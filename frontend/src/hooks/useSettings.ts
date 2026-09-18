import { useEffect, useState, useCallback } from "react";
import { RESTAURANT_INFO } from "@/src/data/menu";
import {
  fetchPhone,
  savePhone as savePhoneApi,
  loginApi,
  logoutApi,
  getToken,
  clearToken,
  ApiError,
} from "@/src/api";

// ---------- Phone number (server-side) ----------
type PhoneListener = (phone: string) => void;
const phoneListeners = new Set<PhoneListener>();
let currentPhone: string = RESTAURANT_INFO.phone;
let phoneLoaded = false;

function notifyPhone(phone: string) {
  currentPhone = phone;
  phoneListeners.forEach((l) => l(phone));
}

async function loadPhone(): Promise<string> {
  try {
    const remote = await fetchPhone();
    if (remote && remote.length > 0) return remote;
  } catch {
    /* offline / not seeded: fall back to default */
  }
  return RESTAURANT_INFO.phone;
}

export async function updatePhoneNumber(next: string): Promise<boolean> {
  const cleaned = next.trim();
  if (!cleaned) return false;
  try {
    const saved = await savePhoneApi(cleaned);
    notifyPhone(saved);
    return true;
  } catch {
    return false;
  }
}

export async function resetPhoneToDefault(): Promise<boolean> {
  // Best-effort: revert local UI to default. Server value stays until admin overwrites.
  notifyPhone(RESTAURANT_INFO.phone);
  return true;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return raw;
}

export function usePhoneNumber(): { phone: string; phoneDisplay: string } {
  const [phone, setPhone] = useState<string>(currentPhone);

  useEffect(() => {
    let mounted = true;
    if (!phoneLoaded) {
      phoneLoaded = true;
      loadPhone().then((p) => {
        if (!mounted) return;
        notifyPhone(p);
      });
    }
    const l: PhoneListener = (p) => setPhone(p);
    phoneListeners.add(l);
    return () => {
      mounted = false;
      phoneListeners.delete(l);
    };
  }, []);

  return { phone, phoneDisplay: formatPhone(phone) };
}

// ---------- Admin auth (JWT via backend) ----------
type AuthListener = (v: boolean) => void;
const authListeners = new Set<AuthListener>();
let adminAuthenticated: boolean | null = null;

function notifyAuth(v: boolean) {
  adminAuthenticated = v;
  authListeners.forEach((f) => f(v));
}

async function bootstrapAuth() {
  const t = await getToken();
  notifyAuth(!!t);
}

export function useAdminAuth(): {
  isAuthenticated: boolean;
  loaded: boolean;
  login: (user: string, pass: string) => Promise<string | null>;
  logout: () => Promise<void>;
} {
  const [state, setState] = useState<{ isAuth: boolean; loaded: boolean }>({
    isAuth: !!adminAuthenticated,
    loaded: adminAuthenticated !== null,
  });

  useEffect(() => {
    if (adminAuthenticated === null) {
      bootstrapAuth();
    }
    const l: AuthListener = (v) => setState({ isAuth: v, loaded: true });
    authListeners.add(l);
    return () => {
      authListeners.delete(l);
    };
  }, []);

  const login = useCallback(async (user: string, pass: string): Promise<string | null> => {
    try {
      await loginApi(user.trim(), pass);
      notifyAuth(true);
      return null;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        return "Credenziali non valide. Riprova.";
      }
      return "Impossibile connettersi al server. Riprova più tardi.";
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    notifyAuth(false);
  }, []);

  return { isAuthenticated: state.isAuth, loaded: state.loaded, login, logout };
}

export async function forceLogout(): Promise<void> {
  await clearToken();
  notifyAuth(false);
}
