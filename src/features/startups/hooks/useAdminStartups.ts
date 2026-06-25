import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeStats,
  createStartup,
  deleteStartup,
  listStartups,
  updateStartup,
} from "../startupsService";
import type { Startup, StartupFormValues, StartupStatus } from "../types";

/**
 * Owns startups state and CRUD operations for the admin page. Operations throw
 * on failure so the page can surface a toast; the list reloads after each
 * mutation.
 */
export function useAdminStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setStartups(await listStartups());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(() => computeStats(startups), [startups]);

  const create = useCallback(
    async (values: StartupFormValues) => {
      await createStartup(values);
      await reload();
    },
    [reload]
  );

  const update = useCallback(
    async (id: string, values: Partial<StartupFormValues>) => {
      await updateStartup(id, values);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteStartup(id);
      await reload();
    },
    [reload]
  );

  const changeStatus = useCallback(
    (id: string, status: StartupStatus) => update(id, { status }),
    [update]
  );

  return {
    startups,
    loading,
    stats,
    reload,
    create,
    update,
    remove,
    changeStatus,
  };
}
