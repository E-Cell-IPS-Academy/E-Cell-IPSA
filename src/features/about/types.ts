import type { Timestamp } from "firebase/firestore";

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}

/** The About page content document (`siteContent/about`). */
export interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  aboutImage: string;
  visionImage: string;
  milestones: MilestoneItem[];
  stats: StatItem[];
  updatedAt?: Timestamp;
}

/** Shape the editor works with (no server-managed fields). */
export type AboutFormValues = Omit<AboutData, "updatedAt">;

export const EMPTY_MILESTONE: MilestoneItem = {
  year: "",
  title: "",
  description: "",
};

export const EMPTY_STAT: StatItem = {
  label: "",
  value: "",
  icon: "",
};

export const EMPTY_ABOUT: AboutFormValues = {
  title: "",
  description: "",
  mission: "",
  vision: "",
  aboutImage: "",
  visionImage: "",
  milestones: [],
  stats: [],
};
