import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

/** Display name for the current edition — update here to rename it everywhere. */
export const VYAPAR_EVENT_NAME = "VyapaarX 3.O";

/** Controls what the public /register page shows. Set from the admin panel. */
export type VyaparStatus = "upcoming" | "started" | "ended";

export const VYAPAR_STATUSES: VyaparStatus[] = ["upcoming", "started", "ended"];

export const STATUS_TONE: Record<VyaparStatus, "info" | "success" | "neutral"> =
  {
    upcoming: "info",
    started: "success",
    ended: "neutral",
  };

export const STATUS_LABEL: Record<VyaparStatus, string> = {
  upcoming: "Upcoming",
  started: "Started",
  ended: "Ended",
};

/** Startup categories offered in the registration form. */
export const VYAPAR_CATEGORIES = [
  "Fintech",
  "EdTech",
  "HealthTech",
  "AgriTech",
  "Social Impact",
  "SaaS / Tech",
  "Others",
] as const;

export type VyaparCategory = (typeof VYAPAR_CATEGORIES)[number];

/** College options for the registration form. Selecting "Other" reveals a free-text field. */
export const COLLEGE_OPTIONS = ["IPS Academy Indore", "Other"] as const;

/** Options for the "Number of Team Members" dropdown. Capped at 6. */
export const TEAM_SIZE_OPTIONS = ["1", "2", "3", "4", "5", "6"] as const;

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export type YesNo = "Yes" | "No";

/** One additional team member (besides the leader): name + gender. */
export interface TeamMemberEntry {
  name: string;
  gender: string;
}

export function emptyTeamMemberEntry(): TeamMemberEntry {
  return { name: "", gender: "" };
}

/** A single registration submission for VyapaarX. */
export interface VyaparRegistration extends WithId {
  startupName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  collegeName: string;
  otherCollegeName?: string;
  teamSize: string;
  teamMembers: TeamMemberEntry[];
  category: string;
  otherCategory?: string;
  ideaDescription: string;
  pitchedBefore: YesNo;
  wantsMentorship: YesNo;
  createdAt?: Timestamp;
}

/** Shape the public form works with (no server-managed fields). */
export type VyaparRegistrationFormValues = Omit<
  VyaparRegistration,
  "id" | "createdAt"
>;

export const EMPTY_VYAPAR_REGISTRATION: VyaparRegistrationFormValues = {
  startupName: "",
  leaderName: "",
  leaderEmail: "",
  leaderPhone: "",
  collegeName: "",
  otherCollegeName: "",
  teamSize: "",
  teamMembers: [],
  category: "",
  otherCategory: "",
  ideaDescription: "",
  pitchedBefore: "No",
  wantsMentorship: "No",
};
