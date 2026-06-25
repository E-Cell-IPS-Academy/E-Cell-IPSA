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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { sortByOrderAsc } from "@/shared/lib/sort";
import type {
  TeamCategory,
  TeamCategoryFormValues,
  TeamMember,
  TeamMemberFormValues,
  TeamStats,
} from "./types";

const MEMBERS_COLLECTION = "teamMembers";
const CATEGORIES_COLLECTION = "teamCategories";

/** Data-access layer for the public team feature. Pure Firestore — no UI. */
export async function listActiveMembers(): Promise<TeamMember[]> {
  // Single where() needs no composite index; sort by order in JS.
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  const members = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as TeamMember[];
  return sortByOrderAsc(members);
}

export async function listCategories(): Promise<TeamCategory[]> {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamCategory[];
}

// ── Admin data access (all members, ordered) ──────────────────────────────────
export async function listMembers(): Promise<TeamMember[]> {
  const q = query(collection(db, MEMBERS_COLLECTION), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamMember[];
}

// ── Member CRUD ───────────────────────────────────────────────────────────────
export async function createMember(
  values: TeamMemberFormValues
): Promise<void> {
  await addDoc(collection(db, MEMBERS_COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateMember(
  id: string,
  values: Partial<TeamMemberFormValues>
): Promise<void> {
  await updateDoc(doc(db, MEMBERS_COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, MEMBERS_COLLECTION, id));
}

/**
 * Clears the lead flag from every other member in `category`, so only the given
 * member remains lead. `exceptId` skips the member being saved.
 */
export async function clearOtherLeads(
  members: TeamMember[],
  category: string,
  exceptId?: string
): Promise<void> {
  const others = members.filter(
    (m) => m.category === category && m.isLead && m.id !== exceptId
  );
  if (others.length === 0) return;
  const batch = writeBatch(db);
  others.forEach((m) => {
    batch.update(doc(db, MEMBERS_COLLECTION, m.id), {
      isLead: false,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function setMembersActive(
  ids: string[],
  isActive: boolean
): Promise<void> {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  ids.forEach((id) => {
    batch.update(doc(db, MEMBERS_COLLECTION, id), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

// ── Category CRUD ─────────────────────────────────────────────────────────────
export async function createCategory(
  values: TeamCategoryFormValues
): Promise<void> {
  await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(
  id: string,
  values: Partial<TeamCategoryFormValues>
): Promise<void> {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

/** Swaps the `order` of two adjacent categories (move up / down). */
export async function swapCategoryOrder(
  a: TeamCategory,
  b: TeamCategory
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, CATEGORIES_COLLECTION, a.id), {
    order: b.order,
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(db, CATEGORIES_COLLECTION, b.id), {
    order: a.order,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

// ── Derived data ──────────────────────────────────────────────────────────────
export function computeTeamStats(
  members: TeamMember[],
  categories: TeamCategory[]
): TeamStats {
  return {
    totalMembers: members.length,
    totalCategories: categories.length,
    activeLeads: members.filter((m) => m.isLead && m.isActive).length,
    activeMembers: members.filter((m) => m.isActive).length,
    inactiveMembers: members.filter((m) => !m.isActive).length,
  };
}
