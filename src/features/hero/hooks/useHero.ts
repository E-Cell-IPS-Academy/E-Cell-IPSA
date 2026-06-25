import { useCallback, useEffect, useState } from "react";
import { getHero, saveHero } from "../heroService";
import { EMPTY_HERO } from "../types";
import type { HeroData, HeroFormValues } from "../types";

/**
 * Owns the hero document state and save operation for the admin page. The save
 * throws on failure so the page can surface a toast; the doc reloads after save.
 */
export function useHero() {
  const [hero, setHero] = useState<HeroData>({ ...EMPTY_HERO });
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setHero(await getHero());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (values: HeroFormValues) => {
      await saveHero(values);
      await reload();
    },
    [reload]
  );

  return { hero, loading, reload, save };
}
