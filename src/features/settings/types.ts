import type { Timestamp } from "firebase/firestore";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link: string;
  bgColor: string;
}

/** Global site settings stored in the `siteContent/settings` document. */
export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  socialLinks: SocialLinks;
  footerText: string;
  copyrightYear: string;
  maintenanceMode: boolean;
  announcementBar: AnnouncementBar;
  updatedAt?: Timestamp;
}

export const SOCIAL_FIELDS: { key: keyof SocialLinks; placeholder: string }[] =
  [
    { key: "facebook", placeholder: "Facebook URL" },
    { key: "instagram", placeholder: "Instagram URL" },
    { key: "linkedin", placeholder: "LinkedIn URL" },
    { key: "twitter", placeholder: "Twitter / X URL" },
    { key: "youtube", placeholder: "YouTube URL" },
  ];

export const COLOR_PRESETS = [
  "#7c3aed",
  "#8b5cf6",
  "#6d28d9",
  "#4f46e5",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#d946ef",
  "#84cc16",
];

export const EMPTY_SETTINGS: SiteSettings = {
  siteName: "",
  tagline: "",
  logo: "",
  favicon: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  footerText: "",
  copyrightYear: new Date().getFullYear().toString(),
  maintenanceMode: false,
  announcementBar: { enabled: false, text: "", link: "", bgColor: "#7c3aed" },
};
