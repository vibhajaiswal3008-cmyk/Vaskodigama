"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/misc";
import { useToast } from "@/components/shared/toast";

const KEY = "vk-cookie-prefs";

interface Prefs {
  analytics: boolean;
  preferences: boolean;
}

/** Footer button that opens cookie preferences. No auto pop-up on load. */
export function CookiePreferencesButton() {
  const [open, setOpen] = useState(false);
  // Lazy init from localStorage. The prefs only render inside the modal (after
  // a client click), so there is no SSR/hydration mismatch on first paint.
  const [prefs, setPrefs] = useState<Prefs>(() => {
    if (typeof window === "undefined") {
      return { analytics: false, preferences: true };
    }
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored) return JSON.parse(stored) as Prefs;
    } catch {
      /* ignore */
    }
    return { analytics: false, preferences: true };
  });
  const { toast } = useToast();

  function save() {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    setOpen(false);
    toast({ title: "Cookie preferences saved", tone: "success" });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-primary"
      >
        Cookie preferences
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cookie preferences"
        description="Choose which cookies this demonstration may use. Essential cookies are always on."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save preferences</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-surface p-3">
            <p className="text-sm font-semibold text-navy">Essential</p>
            <p className="text-sm text-muted">
              Required for the site to function. Always active.
            </p>
          </div>
          <Checkbox
            checked={prefs.preferences}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, preferences: e.target.checked }))
            }
            label={
              <span>
                <span className="font-semibold text-navy">Preferences</span> —
                remember your settings such as dismissed banners.
              </span>
            }
          />
          <Checkbox
            checked={prefs.analytics}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, analytics: e.target.checked }))
            }
            label={
              <span>
                <span className="font-semibold text-navy">Analytics</span> —
                help us understand which pages are useful (illustrative; no
                tracker is actually loaded in this build).
              </span>
            }
          />
        </div>
      </Modal>
    </>
  );
}
