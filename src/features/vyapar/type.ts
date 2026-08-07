import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export const VYAPAR_EVENT_NAME = "VyapaarX 3.O";

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

export const COLLEGE_OPTIONS = ["IPS Academy Indore", "Other"] as const;

/** Total team members including leader – limited to 2-4 */
export const TEAM_SIZE_OPTIONS = ["2", "3", "4"] as const;

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const; // kept if needed elsewhere

export type YesNo = "Yes" | "No";

/** One additional team member – name + email */
export interface TeamMemberEntry {
  name: string;
  email: string;
}

export function emptyTeamMemberEntry(): TeamMemberEntry {
  return { name: "", email: "" };
}

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
