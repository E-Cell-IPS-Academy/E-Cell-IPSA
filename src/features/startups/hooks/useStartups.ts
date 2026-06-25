import { orderBy, where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import type { Startup } from "../types";

/**
 * Live list of active startups, newest first. Backed by the shared
 * `useCollection` hook so listener cleanup and error handling are centralized.
 */
export function useStartups() {
  return useCollection<Startup>(
    "startups",
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
}

/** Live list of featured startups, newest first. */
export function useFeaturedStartups() {
  return useCollection<Startup>(
    "startups",
    where("status", "==", "featured"),
    orderBy("createdAt", "desc")
  );
}
