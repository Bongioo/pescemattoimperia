import { useEffect, useState, useCallback } from "react";
import { storage } from "@/src/utils/storage";
import { RESTAURANT_INFO } from "@/src/data/menu";

const PHONE_KEY = "settings.phone";

type Listener = (phone: string) => void;
const listeners = new Set<Listener>();
let currentPhone: string = RESTAURANT_INFO.phone;

function notify(phone: string) {
  currentPhone = phone;
  listeners.forEach((l) => l(phone));
}

async function loadPhone(): Promise<string> {
  const raw = await storage.getItem<string>(PHONE_KEY, "");
  if (raw && typeof raw === "string" && raw.length > 0) return raw;
  return RESTAURANT_INFO.phone;
}

export async function updatePhoneNumber(next: string): Promise<boolean> {
  const cleaned = next.trim();
  if (!cleaned) return false;
  const ok = await storage.setItem(PHONE_KEY, cleaned);
  if (ok) notify(cleaned);
  return ok;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  if (digits.length >= 7) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  return raw;
}

export function usePhoneNumber(): { phone: string; phoneDisplay: string } {
  const [phone, setPhone] = useState<string>(currentPhone);

  useEffect(() => {
    let mounted = true;
    loadPhone().then((p) => {
      if (mounted) {
        currentPhone = p;
        setPhone(p);
      }
    });
    const l: Listener = (p) => setPhone(p);
    listeners.add(l);
    return () => {
      mounted = false;
      listeners.delete(l);
    };
  }, []);

  return { phone, phoneDisplay: formatPhone(phone) };
}

// Admin session (in-memory only; cleared on app restart)
let adminAuthenticated = false;
const authListeners = new Set<(v: boolean) => void>();

export function useAdminAuth(): {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
} {
  const [isAuth, setIsAuth] = useState<boolean>(adminAuthenticated);

  useEffect(() => {
    const l = (v: boolean) => setIsAuth(v);
    authListeners.add(l);
    return () => {
      authListeners.delete(l);
    };
  }, []);

  const login = useCallback((user: string, pass: string) => {
    const expectedUser = process.env.EXPO_PUBLIC_ADMIN_USER ?? "";
    const expectedPass = process.env.EXPO_PUBLIC_ADMIN_PASS ?? "";
    if (user.trim() === expectedUser && pass === expectedPass) {
      adminAuthenticated = true;
      authListeners.forEach((f) => f(true));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    adminAuthenticated = false;
    authListeners.forEach((f) => f(false));
  }, []);

  return { isAuthenticated: isAuth, login, logout };
}
