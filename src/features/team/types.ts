import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

/** Social profile links for a team member. All optional. */
export interface TeamSocialLinks {
  linkedin?: string;
  instagram?: string;
  github?: string;
  twitter?: string;
}

/** A team category grouping (e.g. Technical, Design). Mirrors the admin schema. */
export interface TeamCategory extends WithId {
  name: string;
  icon: string;
  description: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** A single team member document. Field names match the admin Firestore schema. */
export interface TeamMember extends WithId {
  name: string;
  position: string;
  category: string; // category ID
  isLead: boolean;
  photo: string;
  photoPublicId: string;
  bio: string;
  email: string;
  socialLinks: TeamSocialLinks;
  order: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Shape the member create/edit form works with (no server-managed fields). */
export type TeamMemberFormValues = Omit<
  TeamMember,
  "id" | "createdAt" | "updatedAt"
>;

/** Shape the category create/edit form works with (no server-managed fields). */
export type TeamCategoryFormValues = Omit<
  TeamCategory,
  "id" | "createdAt" | "updatedAt"
>;

export interface TeamStats {
  totalMembers: number;
  totalCategories: number;
  activeLeads: number;
  activeMembers: number;
  inactiveMembers: number;
}

/** Icon names available to categories (subset of lucide-react icons). */
export const TEAM_ICON_OPTIONS = [
  "Users",
  "Crown",
  "Star",
  "Shield",
  "Award",
  "Briefcase",
  "Code",
  "Cpu",
  "Database",
  "Megaphone",
  "Palette",
  "PenTool",
  "Rocket",
  "Target",
  "TrendingUp",
  "Zap",
  "Heart",
  "Music",
  "Camera",
  "BookOpen",
  "FileText",
  "Settings",
  "Wrench",
  "Lightbulb",
  "Flag",
  "Globe",
  "Activity",
  "Sparkles",
  "Layers",
] as const;

export type TeamIconName = (typeof TEAM_ICON_OPTIONS)[number];

export const EMPTY_TEAM_MEMBER: TeamMemberFormValues = {
  name: "",
  position: "",
  category: "",
  isLead: false,
  photo: "",
  photoPublicId: "",
  bio: "",
  email: "",
  socialLinks: { linkedin: "", instagram: "", github: "", twitter: "" },
  order: 0,
  isActive: true,
};

export const EMPTY_TEAM_CATEGORY: TeamCategoryFormValues = {
  name: "",
  icon: "Users",
  description: "",
  order: 0,
};
