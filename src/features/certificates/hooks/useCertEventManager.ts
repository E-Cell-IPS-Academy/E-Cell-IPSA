import { useCallback, useEffect, useState } from "react";
import {
  getCertEvent,
  updateCertEventDetails,
  updateCertEventFields,
  updateCertEventTemplate,
} from "../certEventsService";
import {
  deleteCertificate,
  issueCertificates,
  listCertificatesForEvent,
} from "../certificatesService";
import type {
  CertEvent,
  CertEventFormValues,
  CertFieldPlacement,
  Certificate,
} from "../types";
import type { IssueCertificateRow } from "../certificatesService";

/** Owns everything the single-event manage page needs: event, fields, certificates. */
export function useCertEventManager(eventId: string | undefined) {
  const [event, setEvent] = useState<CertEvent | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const [ev, certs] = await Promise.all([
        getCertEvent(eventId),
        listCertificatesForEvent(eventId),
      ]);
      setEvent(ev);
      setCertificates(certs);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveDetails = useCallback(
    async (values: CertEventFormValues) => {
      if (!eventId) return;
      await updateCertEventDetails(eventId, values);
      await reload();
    },
    [eventId, reload]
  );

  const saveTemplate = useCallback(
    async (template: {
      templateUrl: string;
      templateFormat: "png" | "jpg";
      templateWidth: number;
      templateHeight: number;
    }) => {
      if (!eventId) return;
      await updateCertEventTemplate(eventId, template);
      await reload();
    },
    [eventId, reload]
  );

  const saveFields = useCallback(
    async (fields: CertFieldPlacement[]) => {
      if (!eventId) return;
      await updateCertEventFields(eventId, fields);
      await reload();
    },
    [eventId, reload]
  );

  const importRows = useCallback(
    async (rows: IssueCertificateRow[]) => {
      if (!eventId || !event) return 0;
      const count = await issueCertificates(
        { id: eventId, name: event.name },
        rows
      );
      await reload();
      return count;
    },
    [eventId, event, reload]
  );

  const removeCertificate = useCallback(
    async (id: string) => {
      await deleteCertificate(id);
      await reload();
    },
    [reload]
  );

  return {
    event,
    certificates,
    loading,
    reload,
    saveDetails,
    saveTemplate,
    saveFields,
    importRows,
    removeCertificate,
  };
}
