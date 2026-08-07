import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type {
  CertEvent,
  CertEventFormValues,
  CertFieldPlacement,
  TextBlockPlacement,
} from "./types";
import {
  defaultBodyPlacement,
  defaultBodyTemplate,
  defaultCertificateIdPlacement,
  defaultEmailSubject,
  defaultEmailBody,
} from "./types";

const COLLECTION = "certEvents";

/**
 * Backfills fields added after this feature first shipped (fontFamily on
 * placements, email template) so events created earlier don't crash the PDF
 * generator or email sender — they just fall back to sensible defaults
 * until the admin re-saves that section.
 */
function normalizeCertEvent(raw: CertEvent): CertEvent {
  return {
    ...raw,
    bodyPlacement: { ...defaultBodyPlacement(), ...raw.bodyPlacement },
    certificateIdPlacement: {
      ...defaultCertificateIdPlacement(),
      ...raw.certificateIdPlacement,
    },
    emailSubject: raw.emailSubject || defaultEmailSubject(),
    emailBody: raw.emailBody || defaultEmailBody(),
  };
}

/** All events, newest first. Single orderBy — no composite index needed. */
export async function listCertEvents(): Promise<CertEvent[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    normalizeCertEvent({ id: d.id, ...d.data() } as CertEvent)
  );
}

export async function getCertEvent(id: string): Promise<CertEvent | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists()
    ? normalizeCertEvent({ id: snap.id, ...snap.data() } as CertEvent)
    : null;
}

export async function createCertEvent(
  values: CertEventFormValues
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...values,
    templateUrl: "",
    templateFormat: "png",
    templateWidth: 0,
    templateHeight: 0,
    bodyTemplate: defaultBodyTemplate(),
    bodyPlacement: defaultBodyPlacement(),
    certificateIdPlacement: defaultCertificateIdPlacement(),
    emailSubject: defaultEmailSubject(),
    emailBody: defaultEmailBody(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCertEventDetails(
  id: string,
  values: CertEventFormValues
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCertEventTemplate(
  id: string,
  template: {
    templateUrl: string;
    templateFormat: "png" | "jpg";
    templateWidth: number;
    templateHeight: number;
  }
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...template,
    updatedAt: serverTimestamp(),
  });
}

/** Persists the body paragraph text + its position/style in one write. */
export async function updateCertEventBody(
  id: string,
  bodyTemplate: string,
  bodyPlacement: TextBlockPlacement
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    bodyTemplate,
    bodyPlacement,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCertEventIdPlacement(
  id: string,
  certificateIdPlacement: CertFieldPlacement
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    certificateIdPlacement,
    updatedAt: serverTimestamp(),
  });
}

/** Persists the admin-authored email subject + intro text in one write. */
export async function updateCertEventEmailTemplate(
  id: string,
  emailSubject: string,
  emailBody: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    emailSubject,
    emailBody,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCertEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
