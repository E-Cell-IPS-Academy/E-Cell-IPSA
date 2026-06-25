import {
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
import type { UserRecord, UserStats } from "./types";

const COLLECTION = "users";

/** Data-access layer for users. Pure Firestore — no UI, no upload concerns. */
export async function listUsers(): Promise<UserRecord[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UserRecord[];
}

export async function updateUser(
  id: string,
  values: Partial<UserRecord>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function computeStats(users: UserRecord[]): UserStats {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: users.length,
    students: users.filter((u) => u.userType === "student").length,
    entrepreneurs: users.filter((u) => u.userType === "entrepreneur").length,
    professionals: users.filter((u) => u.userType === "professional").length,
    alumni: users.filter((u) => u.userType === "alumni").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    verified: users.filter((u) => u.isVerified).length,
    newThisMonth: users.filter(
      (u) => u.createdAt && u.createdAt.toDate() >= thisMonth
    ).length,
  };
}
