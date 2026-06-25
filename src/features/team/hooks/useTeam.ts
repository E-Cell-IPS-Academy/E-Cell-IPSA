import { orderBy, where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import type { TeamCategory, TeamMember } from "../types";

/**
 * Live list of active team members, ordered by `order` ascending. Backed by the
 * shared `useCollection` hook so listener cleanup and error handling are
 * centralized.
 */
export function useTeamMembers() {
  return useCollection<TeamMember>(
    "teamMembers",
    where("isActive", "==", true),
    orderBy("order", "asc")
  );
}

/** Live list of team categories, ordered by `order` ascending. */
export function useTeamCategories() {
  return useCollection<TeamCategory>("teamCategories", orderBy("order", "asc"));
}
