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
} from "./types";
import { defaultFieldPlacements } from "./types";

const COLLECTION = "certEvents";

/** All events, newest first. Single orderBy — no composite index needed. */
export async function listCertEvents(): Promise<CertEvent[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CertEvent[];
}

export async function getCertEvent(id: string): Promise<CertEvent | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CertEvent) : null;
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
    fields: defaultFieldPlacements(),
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

export async function updateCertEventFields(
  id: string,
  fields: CertFieldPlacement[]
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    fields,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCertEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
