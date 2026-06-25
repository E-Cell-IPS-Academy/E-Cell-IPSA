import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Startup, StartupFormValues, StartupStats } from "./types";

const COLLECTION = "startups";

/** Data-access layer for the public startups feature. Pure Firestore — no UI. */
export async function listActiveStartups(): Promise<Startup[]> {
  const q = query(
    collection(db, COLLECTION),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Startup[];
}

export async function listFeaturedStartups(): Promise<Startup[]> {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "featured"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Startup[];
}

/** Admin data-access layer. Pure Firestore — no UI, no upload concerns. */
export async function listStartups(): Promise<Startup[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Startup[];
}

export async function createStartup(values: StartupFormValues): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateStartup(
  id: string,
  values: Partial<StartupFormValues>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStartup(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function computeStats(startups: Startup[]): StartupStats {
  return {
    total: startups.length,
    featured: startups.filter((s) => s.status === "featured").length,
    upcoming: startups.filter((s) => s.status === "upcoming").length,
    past: startups.filter((s) => s.status === "past").length,
    totalFunding: startups.reduce((sum, s) => sum + (s.fundingAmount || 0), 0),
  };
}
