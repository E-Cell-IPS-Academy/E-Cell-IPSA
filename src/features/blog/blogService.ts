import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { sortByCreatedAtDesc } from "@/shared/lib/sort";
import { calculateReadTime } from "./types";
import type { BlogFormValues, BlogPost, BlogStats } from "./types";
import { blocksToHtml, estimateReadTime } from "./lib/blocks";

const COLLECTION = "blogs";

/* -------------------------------------------------------------------------- */
/* Public reads (consumed by the public-facing blog pages)                    */
/* -------------------------------------------------------------------------- */

/** Published posts, newest first. Pure Firestore — no UI. */
export async function listPublishedPosts(): Promise<BlogPost[]> {
  // Single where() needs no composite index; sort newest-first in JS.
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "published")
  );
  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
  return sortByCreatedAtDesc(posts);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Query by slug only (single where = no composite index); verify status in JS.
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const post = { id: d.id, ...d.data() } as BlogPost;
  return post.status === "published" ? post : null;
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

/**
 * Firestore rejects `undefined` field values. Deep-remove them from plain
 * objects/arrays (Timestamps, FieldValues etc. are class instances and are
 * left untouched).
 */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return value;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

/**
 * Fields derived from the article body. For block-based posts `content` is
 * regenerated as HTML from `blocks` (so search, exports and older readers keep
 * working) and `readTime` is estimated from words + images.
 */
function withDerivedFields(
  values: Partial<BlogFormValues>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...values };
  if (values.blocks !== undefined) {
    out.content = blocksToHtml(values.blocks);
    out.readTime = estimateReadTime(values.blocks);
  } else if (values.content !== undefined) {
    out.readTime = calculateReadTime(values.content);
  }
  return stripUndefined(out);
}

/** Creates the post and resolves with its new document id. */
export async function createBlog(values: BlogFormValues): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...withDerivedFields(values),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(
  id: string,
  values: Partial<BlogFormValues>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...withDerivedFields(values),
    updatedAt: serverTimestamp(),
  });
}

/** True when another post already uses `slug` (posts are addressed by slug). */
export async function isSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const q = query(collection(db, COLLECTION), where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

/**
 * Count one read of a published post (once per browser session). Best-effort:
 * failures (e.g. Firestore rules disallowing public writes) are ignored so
 * reading is never affected.
 */
export async function recordView(id: string): Promise<void> {
  try {
    const key = `blog_viewed_${id}`;
    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }
    await updateDoc(doc(db, COLLECTION, id), { viewCount: increment(1) });
  } catch {
    /* ignore */
  }
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
