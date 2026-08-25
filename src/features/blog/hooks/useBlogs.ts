"use client";

import { where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import { sortByCreatedAtDesc } from "@/shared/lib/sort";
import type { BlogPost } from "../types";

/**
 * Live list of published blog posts, newest first. Backed by the shared
 * `useCollection` hook so listener cleanup and error handling are centralized.
 */
export function useBlogs() {
  const result = useCollection<BlogPost>(
    "blogs",
    where("status", "==", "published")
  );
  return { ...result, data: sortByCreatedAtDesc(result.data) };
}

/**
 * Live single published post matched by `slug`. Returns the same
 * `{ data, loading, error }` shape; `data[0]` is the post (or undefined).
 */
export function useBlog(slug: string) {
  return useCollection<BlogPost>(
    "blogs",
    where("slug", "==", slug),
    where("status", "==", "published")
  );
}
