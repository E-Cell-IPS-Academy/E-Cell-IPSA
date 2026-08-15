import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { EMPTY_CONTACT } from "./types";
import type { ContactData, ContactSubmission, SubmissionStats } from "./types";

const CONTACT_DOC = { collection: "siteContent", id: "contact" } as const;
const SUBMISSIONS = "contactSubmissions";

/** Data-access layer for contact. Pure Firestore — no UI, no upload concerns. */
export async function getContactData(): Promise<ContactData> {
  const snap = await getDoc(doc(db, CONTACT_DOC.collection, CONTACT_DOC.id));
  if (!snap.exists()) return EMPTY_CONTACT;
  const data = snap.data() as ContactData;
  return {
    ...EMPTY_CONTACT,
    ...data,
    socialLinks: { ...EMPTY_CONTACT.socialLinks, ...(data.socialLinks ?? {}) },
  };
}

export async function saveContactData(data: ContactData): Promise<void> {
  await setDoc(doc(db, CONTACT_DOC.collection, CONTACT_DOC.id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function listSubmissions(): Promise<ContactSubmission[]> {
  const q = query(collection(db, SUBMISSIONS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ContactSubmission[];
}

export async function markSubmissionRead(id: string): Promise<void> {
  await updateDoc(doc(db, SUBMISSIONS, id), { read: true });
}

export async function deleteSubmission(id: string): Promise<void> {
  await deleteDoc(doc(db, SUBMISSIONS, id));
}

export function computeStats(
  submissions: ContactSubmission[]
): SubmissionStats {
  const unread = submissions.filter((s) => !s.read).length;
  return {
    total: submissions.length,
    unread,
    read: submissions.length - unread,
  };
}
