import type { Timestamp } from "firebase/firestore";

export type HeroBackgroundType = "video" | "image" | "gradient";

/** The single hero document stored at `siteContent/hero`. */
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
  backgroundType: HeroBackgroundType;
  backgroundUrl: string;
  updatedAt?: Timestamp;
}

/** Shape the editor form works with (no server-managed fields). */
export type HeroFormValues = Omit<HeroData, "updatedAt">;

export const HERO_BACKGROUND_TYPES: HeroBackgroundType[] = [
  "gradient",
  "image",
  "video",
];

export const EMPTY_HERO: HeroFormValues = {
  title: "",
  subtitle: "",
  description: "",
  ctaText: "",
  ctaLink: "",
  videoUrl: "",
  backgroundType: "gradient",
  backgroundUrl: "",
};
