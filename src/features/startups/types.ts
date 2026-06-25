import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export type StartupStatus = "featured" | "upcoming" | "past";

/** A single founder of a startup. */
export interface Founder {
  name: string;
  position: string;
  bio: string;
  linkedin?: string;
  image?: string;
}

/** Social profile links for a startup. All optional. */
export interface StartupSocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

/** A single startup document. Field names match the admin Firestore schema. */
export interface Startup extends WithId {
  name: string;
  description: string;
  shortDescription: string;
  logo?: string;
  logoPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  industry: string;
  foundedYear: number;
  location: string;
  website?: string;
  status: StartupStatus;
  fundingStage: string;
  fundingAmount?: number;
  employeeCount?: number;
  founders: Founder[];
  achievements: string[];
  problem: string;
  solution: string;
  businessModel: string;
  targetMarket: string;
  socialLinks: StartupSocialLinks;
  featuredDate?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Shape the admin create/edit form works with (no server-managed fields). */
export type StartupFormValues = Omit<Startup, "id" | "createdAt" | "updatedAt">;

export interface StartupStats {
  total: number;
  featured: number;
  upcoming: number;
  past: number;
  totalFunding: number;
}

export const STARTUP_STATUSES: StartupStatus[] = [
  "featured",
  "upcoming",
  "past",
];

export const STARTUP_INDUSTRIES = [
  "Technology",
  "FinTech",
  "Healthcare",
  "Education",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Other",
];

export const FUNDING_STAGES = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Growth",
  "IPO",
];

export const STATUS_TONE: Record<
  StartupStatus,
  "info" | "success" | "neutral"
> = {
  featured: "success",
  upcoming: "info",
  past: "neutral",
};

export const EMPTY_STARTUP: StartupFormValues = {
  name: "",
  description: "",
  shortDescription: "",
  logo: "",
  logoPublicId: "",
  coverImage: "",
  coverImagePublicId: "",
  industry: "",
  foundedYear: new Date().getFullYear(),
  location: "",
  website: "",
  status: "upcoming",
  fundingStage: "Pre-Seed",
  fundingAmount: 0,
  employeeCount: 0,
  founders: [],
  achievements: [],
  problem: "",
  solution: "",
  businessModel: "",
  targetMarket: "",
  socialLinks: {},
  featuredDate: "",
  isActive: true,
};
