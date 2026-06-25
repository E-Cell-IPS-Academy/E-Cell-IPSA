import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeStats,
  deleteSubmission,
  getContactData,
  listSubmissions,
  markSubmissionRead,
  saveContactData,
} from "../contactService";
import type { ContactData, ContactSubmission } from "../types";

/**
 * Owns contact settings + submissions state for the admin page. Operations
 * throw on failure so the page can surface a toast; data reloads after writes.
 */
export function useContact() {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loadingContact, setLoadingContact] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const reloadContact = useCallback(async () => {
    setLoadingContact(true);
    try {
      setContact(await getContactData());
    } finally {
      setLoadingContact(false);
    }
  }, []);

  const reloadSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      setSubmissions(await listSubmissions());
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    void reloadContact();
    void reloadSubmissions();
  }, [reloadContact, reloadSubmissions]);

  const stats = useMemo(() => computeStats(submissions), [submissions]);

  const saveContact = useCallback(
    async (data: ContactData) => {
      await saveContactData(data);
      await reloadContact();
    },
    [reloadContact]
  );

  const markRead = useCallback(async (id: string) => {
    await markSubmissionRead(id);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    );
  }, []);

  const removeSubmission = useCallback(async (id: string) => {
    await deleteSubmission(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    contact,
    submissions,
    loadingContact,
    loadingSubmissions,
    stats,
    saveContact,
    markRead,
    removeSubmission,
  };
}
