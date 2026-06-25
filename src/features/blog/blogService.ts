import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { calculateReadTime } from "./types";
import type { BlogFormValues, BlogPost, BlogStats } from "./types";

const COLLECTION = "blogs";

/* -------------------------------------------------------------------------- */
/* Public reads (consumed by the public-facing blog pages)                    */
/* -------------------------------------------------------------------------- */

/** Published posts, newest first. Pure Firestore — no UI. */
export async function listPublishedPosts(): Promise<BlogPost[]> {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BlogPost;
}

/* -------------------------------------------------------------------------- */
/* Admin CRUD (consumed by the admin dashboard)                               */
/* -------------------------------------------------------------------------- */

/** Every post, newest first — for the admin list. */
export async function listBlogs(): Promise<BlogPost[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
}

export async function createBlog(values: BlogFormValues): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...values,
    readTime: calculateReadTime(values.content),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBlog(
  id: string,
  values: Partial<BlogFormValues>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...values,
    ...(values.content !== undefined
      ? { readTime: calculateReadTime(values.content) }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export function computeStats(blogs: BlogPost[]): BlogStats {
  return {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
    archived: blogs.filter((b) => b.status === "archived").length,
    totalViews: blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0),
  };
}
