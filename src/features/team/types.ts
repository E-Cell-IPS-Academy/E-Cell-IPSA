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
