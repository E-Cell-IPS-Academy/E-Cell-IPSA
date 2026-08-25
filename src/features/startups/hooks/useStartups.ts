"use client";

import { where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import { sortByCreatedAtDesc } from "@/shared/lib/sort";
import type { Startup } from "../types";

/**
 * Live list of active startups, newest first. Backed by the shared
 * `useCollection` hook so listener cleanup and error handling are centralized.
 */
export function useStartups() {
  const result = useCollection<Startup>(
    "startups",
    where("isActive", "==", true)
  );
  return { ...result, data: sortByCreatedAtDesc(result.data) };
}

/** Live list of featured startups, newest first. */
export function useFeaturedStartups() {
  const result = useCollection<Startup>(
    "startups",
    where("status", "==", "featured")
  );
  return { ...result, data: sortByCreatedAtDesc(result.data) };
}
