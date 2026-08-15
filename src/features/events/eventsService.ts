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
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { EventFormValues, EventItem, EventStats } from "./types";

const COLLECTION = "events";

/** Data-access layer for events. Pure Firestore — no UI, no upload concerns. */
export async function listEvents(): Promise<EventItem[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EventItem[];
}

export async function createEvent(values: EventFormValues): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(
  id: string,
  values: Partial<EventFormValues>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function computeStats(events: EventItem[]): EventStats {
  return {
    total: events.length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    completed: events.filter((e) => e.status === "completed").length,
    cancelled: events.filter((e) => e.status === "cancelled").length,
    totalAttendees: events.reduce((sum, e) => sum + (e.attendees || 0), 0),
  };
}
