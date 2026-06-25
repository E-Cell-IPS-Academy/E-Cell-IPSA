import { useCallback, useEffect, useState } from "react";
import { getAbout, saveAbout } from "../aboutService";
import { EMPTY_ABOUT } from "../types";
import type { AboutFormValues } from "../types";

/**
 * Owns About page content state and the save operation for the admin page. The
 * save throws on failure so the page can surface a toast; content reloads after.
 */
export function useAbout() {
  const [about, setAbout] = useState<AboutFormValues>(EMPTY_ABOUT);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setAbout(await getAbout());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (values: AboutFormValues) => {
      await saveAbout(values);
      await reload();
    },
    [reload]
  );

  return { about, loading, reload, save };
}
