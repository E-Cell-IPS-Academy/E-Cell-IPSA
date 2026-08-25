"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCertEvent,
  deleteCertEvent,
  listCertEvents,
} from "../certEventsService";
import { deleteCertificatesForEvent } from "../certificatesService";
import type { CertEvent, CertEventFormValues } from "../types";

/** Owns the events list for the certificates admin landing page. */
export function useCertEvents() {
  const [events, setEvents] = useState<CertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await listCertEvents());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (values: CertEventFormValues) => {
      const id = await createCertEvent(values);
      await reload();
      return id;
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteCertificatesForEvent(id);
      await deleteCertEvent(id);
      await reload();
    },
    [reload]
  );

  return { events, loading, reload, create, remove };
}
