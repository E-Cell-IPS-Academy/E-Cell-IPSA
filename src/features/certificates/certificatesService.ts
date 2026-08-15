import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { CertEvent, Certificate } from "./types";
import { getCertEvent } from "./certEventsService";

const COLLECTION = "certificates";
const BATCH_LIMIT = 450; // stay comfortably under Firestore's 500-op batch cap

/** Generates a short, URL-safe, human-typeable unique certificate ID. */
export function generateCertificateId(eventName: string): string {
  const prefix =
    eventName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "CERT";
  const random = Array.from(
    { length: 8 },
    () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
  ).join("");
  return `${prefix}-${random}`;
}

export interface IssueCertificateRow {
  name: string;
  salutation?: string;
  email: string;
}

/**
 * Bulk-issues certificates for one event. Only the mapped data + a freshly
 * generated unique ID are ever written — no PDF is created or stored here.
 * Returns the created records (including their certificate IDs) so the
 * caller can trigger notification emails.
 */
export async function issueCertificates(
  event: Pick<CertEvent, "id" | "name">,
  rows: IssueCertificateRow[]
): Promise<Certificate[]> {
  const created: Certificate[] = [];
  for (let i = 0; i < rows.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    const chunk = rows.slice(i, i + BATCH_LIMIT);
    for (const row of chunk) {
      const ref = doc(collection(db, COLLECTION));
      const certificateId = generateCertificateId(event.name);
      const record = {
        eventId: event.id,
        eventName: event.name,
        certificateId,
        name: row.name,
        salutation: row.salutation ?? "",
        email: row.email,
      };
      batch.set(ref, { ...record, issuedAt: serverTimestamp() });
      created.push({ id: ref.id, ...record });
    }
    await batch.commit();
  }
  return created;
}

/** Admin: every certificate issued for one event, newest first. */
export async function listCertificatesForEvent(
  eventId: string
): Promise<Certificate[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("eventId", "==", eventId))
  );
  const rows = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Certificate[];
  return rows.sort((a, b) => {
    const at = a.issuedAt?.toMillis?.() ?? 0;
    const bt = b.issuedAt?.toMillis?.() ?? 0;
    return bt - at;
  });
}

export async function deleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Deletes every certificate belonging to an event — used when the event itself is deleted. */
export async function deleteCertificatesForEvent(
  eventId: string
): Promise<void> {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("eventId", "==", eventId))
  );
  for (let i = 0; i < snap.docs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    snap.docs.slice(i, i + BATCH_LIMIT).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

/** Marks a certificate as emailed (best-effort bookkeeping, not a delivery guarantee). */
export async function markCertificateEmailed(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { emailSentAt: serverTimestamp() });
}

async function findCertificateByCode(
  certificateId: string
): Promise<Certificate | null> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("certificateId", "==", certificateId.trim().toUpperCase())
    )
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Certificate;
}

/**
 * Public download flow: looks up a certificate by ID *and* checks the name
 * matches (case-insensitive), acting as a lightweight shared-secret check
 * since certificate IDs alone aren't meant to be guessable download keys.
 */
export async function lookupCertificateForDownload(
  certificateId: string,
  name: string
): Promise<{ certificate: Certificate; event: CertEvent } | null> {
  const certificate = await findCertificateByCode(certificateId);
  if (!certificate) return null;
  const nameMatches =
    certificate.name.trim().toLowerCase() === name.trim().toLowerCase();
  if (!nameMatches) return null;
  const event = await getCertEvent(certificate.eventId);
  if (!event) return null;
  return { certificate, event };
}

/** Public verification flow: ID only, returns public-safe details or null. */
export async function verifyCertificate(
  certificateId: string
): Promise<Certificate | null> {
  return findCertificateByCode(certificateId);
}
