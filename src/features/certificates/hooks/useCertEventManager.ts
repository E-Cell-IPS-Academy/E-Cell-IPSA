"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCertEvent,
  updateCertEventDetails,
  updateCertEventTemplate,
  updateCertEventBody,
  updateCertEventIdPlacement,
  updateCertEventEmailTemplate,
} from "../certEventsService";
import {
  deleteCertificate,
  issueCertificates,
  listCertificatesForEvent,
  markCertificateEmailed,
} from "../certificatesService";
import { defaultEmailSubject, defaultEmailBody } from "../types";
import type {
  CertEvent,
  CertEventFormValues,
  CertFieldPlacement,
  Certificate,
  TextBlockPlacement,
} from "../types";
import type { IssueCertificateRow } from "../certificatesService";

interface SendEmailsResult {
  sent: number;
  failed: number;
}

/**
 * Where the certificate-mailer route lives. Defaults to the same-origin
 * Next.js Route Handler (src/app/api/send-certificate-emails/route.ts) —
 * no separate backend to deploy. Only set NEXT_PUBLIC_CERT_MAILER_URL if
 * you're calling a differently-hosted instance, e.g.:
 *   NEXT_PUBLIC_CERT_MAILER_URL=https://your-other-deploy.vercel.app/api/send-certificate-emails
 */
const MAILER_URL =
  process.env.NEXT_PUBLIC_CERT_MAILER_URL || "/api/send-certificate-emails";

/**
 * Calls the small backend that sends each recipient their Full Name +
 * Certificate ID + download link via nodemailer, using the admin-authored
 * subject/body (with {{NAME}}/{{EVENT}} tokens the backend substitutes per
 * recipient). This is the one part of the certificates feature that isn't
 * pure client + Firestore — email sending has to happen server-side so SMTP
 * credentials never reach the browser.
 */
async function sendCertificateEmails(
  event: CertEvent,
  certs: Certificate[]
): Promise<SendEmailsResult> {
  const origin = window.location.origin;
  const adminKey = process.env.NEXT_PUBLIC_CERT_MAIL_API_KEY;
  const response = await fetch(MAILER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(adminKey ? { "x-admin-key": adminKey } : {}),
    },
    body: JSON.stringify({
      eventName: event.name,
      emailSubject: event.emailSubject || defaultEmailSubject(),
      emailBody: event.emailBody || defaultEmailBody(),
      origin,
      downloadUrl: `${origin}/certificate`,
      certificates: certs.map((c) => ({
        id: c.id,
        name: c.name,
        salutation: c.salutation,
        email: c.email,
        certificateId: c.certificateId,
      })),
    }),
  });
  if (!response.ok) {
    throw new Error(`Email service responded with ${response.status}`);
  }
  return response.json();
}

/** Owns everything the single-event manage page needs: event, layout, certificates. */
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

  const saveLayout = useCallback(
    async (
      bodyTemplate: string,
      bodyPlacement: TextBlockPlacement,
      certificateIdPlacement: CertFieldPlacement
    ) => {
      if (!eventId) return;
      await updateCertEventBody(eventId, bodyTemplate, bodyPlacement);
      await updateCertEventIdPlacement(eventId, certificateIdPlacement);
      await reload();
    },
    [eventId, reload]
  );

  const saveEmailTemplate = useCallback(
    async (emailSubject: string, emailBody: string) => {
      if (!eventId) return;
      await updateCertEventEmailTemplate(eventId, emailSubject, emailBody);
      await reload();
    },
    [eventId, reload]
  );

  const importRows = useCallback(
    async (rows: IssueCertificateRow[]): Promise<Certificate[]> => {
      if (!eventId || !event) return [];
      const created = await issueCertificates(
        { id: eventId, name: event.name },
        rows
      );
      await reload();
      return created;
    },
    [eventId, event, reload]
  );

  const sendEmails = useCallback(
    async (certs: Certificate[]): Promise<SendEmailsResult> => {
      if (!event) return { sent: 0, failed: certs.length };
      const result = await sendCertificateEmails(event, certs);
      await Promise.all(
        certs.map((c) => markCertificateEmailed(c.id).catch(() => undefined))
      );
      await reload();
      return result;
    },
    [event, reload]
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
    saveLayout,
    saveEmailTemplate,
    importRows,
    sendEmails,
    removeCertificate,
  };
}