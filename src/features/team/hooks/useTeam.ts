import { orderBy, where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import { sortByOrderAsc } from "@/shared/lib/sort";
import type { TeamCategory, TeamMember } from "../types";

/**
 * Live list of active team members, ordered by `order` ascending. Backed by the
 * shared `useCollection` hook so listener cleanup and error handling are
 * centralized.
 */
export function useTeamMembers() {
  const result = useCollection<TeamMember>(
    "teamMembers",
    where("isActive", "==", true)
  );
  return { ...result, data: sortByOrderAsc(result.data) };
}

/** Live list of team categories, ordered by `order` ascending. */
export function useTeamCategories() {
  return useCollection<TeamCategory>("teamCategories", orderBy("order", "asc"));
}
