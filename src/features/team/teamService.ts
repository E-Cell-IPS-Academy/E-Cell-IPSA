import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { TeamCategory, TeamMember } from "./types";

const MEMBERS_COLLECTION = "teamMembers";
const CATEGORIES_COLLECTION = "teamCategories";

/** Data-access layer for the public team feature. Pure Firestore — no UI. */
export async function listActiveMembers(): Promise<TeamMember[]> {
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamMember[];
}

export async function listCategories(): Promise<TeamCategory[]> {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamCategory[];
}
