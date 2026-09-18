import { useEffect, useState, useCallback } from "react";
import { storage } from "@/src/utils/storage";
import { forceLogout } from "@/src/hooks/useSettings";

const NOTICE_KEY = "cookie_notice.acknowledged";

type Listener = (v: boolean) => void;
const listeners = new Set<Listener>();
let acknowledged: boolean | null = null;

function notify(v: boolean) {
  acknowledged = v;
  listeners.forEach((l) => l(v));
}

/**
 * Manages the first-visit informational cookie notice.
 * The site uses only strictly necessary local storage, so this is an
 * informational acknowledgment, not a consent gate.
 */
export function useCookieNotice(): {
  loaded: boolean;
  visible: boolean;
  acknowledge: () => Promise<void>;
  reopen: () => void;
} {
  const [state, setState] = useState<{ loaded: boolean; visible: boolean }>({
    loaded: acknowledged !== null,
    visible: acknowledged === false,
  });

  useEffect(() => {
    let mounted = true;
    if (acknowledged === null) {
      storage.getItem<boolean>(NOTICE_KEY, false).then((v) => {
        if (!mounted) return;
        acknowledged = !!v;
        setState({ loaded: true, visible: !acknowledged });
      });
    }
    const l: Listener = (v) => setState({ loaded: true, visible: !v });
    listeners.add(l);
    return () => {
      mounted = false;
      listeners.delete(l);
    };
  }, []);

  const acknowledge = useCallback(async () => {
    await storage.setItem(NOTICE_KEY, true);
    notify(true);
  }, []);

  const reopen = useCallback(() => {
    notify(false);
  }, []);

  return {
    loaded: state.loaded,
    visible: state.visible,
    acknowledge,
    reopen,
  };
}

export async function clearLocalPreferences(): Promise<void> {
  // Only clear per-device data: admin JWT and the informativa acknowledgment.
  // Menu and phone are now server-side and shared across all users.
  await forceLogout();
  await storage.removeItem(NOTICE_KEY);
  notify(false);
}

// Global registry so any screen can trigger reopening the notice
let reopenNotice: () => void = () => {};
export function registerReopenNotice(fn: () => void) {
  reopenNotice = fn;
}
export function triggerReopenNotice() {
  reopenNotice();
}
