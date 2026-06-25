import type { Timestamp } from "firebase/firestore";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

/** Editable public contact-info settings (siteContent/contact document). */
export interface ContactData {
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  formEnabled: boolean;
  socialLinks: SocialLinks;
  updatedAt?: Timestamp;
}

/** A single contact-form submission (contactSubmissions collection). */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: Timestamp;
}

export interface SubmissionStats {
  total: number;
  unread: number;
  read: number;
}

export const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "twitter", label: "Twitter / X URL" },
  { key: "youtube", label: "YouTube URL" },
];

export const EMPTY_CONTACT: ContactData = {
  email: "",
  phone: "",
  address: "",
  mapEmbedUrl: "",
  formEnabled: true,
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
};
