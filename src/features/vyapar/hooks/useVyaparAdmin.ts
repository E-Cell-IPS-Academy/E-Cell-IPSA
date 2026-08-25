"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteVyaparRegistration,
  getVyaparStatus,
  listVyaparRegistrations,
  setVyaparStatus,
} from "../vyaparService";
import type { VyaparRegistration, VyaparStatus } from "../type";

/**
 * Owns VyapaarX admin state: the full registrations list plus the current
 * status flag. Operations throw on failure so the page can surface a toast;
 * the list reloads after each mutation.
 */
export function useVyaparAdmin() {
  const [registrations, setRegistrations] = useState<VyaparRegistration[]>([]);
  const [status, setStatus] = useState<VyaparStatus>("upcoming");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [regs, currentStatus] = await Promise.all([
        listVyaparRegistrations(),
        getVyaparStatus(),
      ]);
      setRegistrations(regs);
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const changeStatus = useCallback(async (next: VyaparStatus) => {
    await setVyaparStatus(next);
    setStatus(next);
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await deleteVyaparRegistration(id);
      await reload();
    },
    [reload]
  );

  return { registrations, status, loading, reload, changeStatus, remove };
}
