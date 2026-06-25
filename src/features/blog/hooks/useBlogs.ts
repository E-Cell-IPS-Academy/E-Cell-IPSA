import { orderBy, where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import type { BlogPost } from "../types";

/**
 * Live list of published blog posts, newest first. Backed by the shared
 * `useCollection` hook so listener cleanup and error handling are centralized.
 */
export function useBlogs() {
  return useCollection<BlogPost>(
    "blogs",
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
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
