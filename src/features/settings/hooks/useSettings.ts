import { useCallback, useEffect, useState } from "react";
import { getSettings, saveSettings } from "../settingsService";
import { EMPTY_SETTINGS } from "../types";
import type { SiteSettings } from "../types";

/**
 * Owns site-settings state and persistence for the admin page. `save` throws on
 * failure so the page can surface a toast.
 */
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSettings(await getSettings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await saveSettings(settings);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  return { settings, setSettings, loading, saving, load, save };
}
