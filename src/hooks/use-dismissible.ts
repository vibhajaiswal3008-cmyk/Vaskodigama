"use client";

import { useSyncExternalStore } from "react";

/**
 * Read a "dismissed" flag from localStorage in a hydration-safe, lint-clean way.
 *
 * Using useSyncExternalStore (rather than useState + useEffect) is the React-
 * blessed way to subscribe to an external store: it avoids the
 * `set-state-in-effect` pitfall and handles SSR via the server snapshot.
 *
 * Server snapshot is `false` (not dismissed) so the element renders in the SSR
 * HTML; on the client the real localStorage value takes over after hydration.
 */
export function useDismissible(key: string) {
  const eventName = `vk-dismiss:${key}`;

  const subscribe = (cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener(eventName, cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener(eventName, cb);
    };
  };

  const dismissed = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) === "1",
    () => false,
  );

  const dismiss = () => {
    localStorage.setItem(key, "1");
    window.dispatchEvent(new Event(eventName));
  };

  return { dismissed, dismiss };
}
