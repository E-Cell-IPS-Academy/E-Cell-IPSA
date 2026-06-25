import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export type BlogStatus = "draft" | "published" | "archived";

/** Author byline embedded on a blog post. Mirrors the admin Firestore schema. */
export interface Author {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

/** A single blog post document. Field names match the admin Firestore schema. */
export interface BlogPost extends WithId {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  status: BlogStatus;
  category: string;
  tags: string[];
  author: Author;
  publishedDate?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  isFeature: boolean;
  viewCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Shape the create/edit form works with (no server-managed fields). */
export type BlogFormValues = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
}

export const BLOG_STATUSES: BlogStatus[] = ["draft", "published", "archived"];

export const BLOG_CATEGORIES = [
  "Entrepreneurship",
  "Technology",
  "Business",
  "Innovation",
  "Startup Stories",
  "Tips & Guides",
  "News",
];

export const STATUS_TONE: Record<
  BlogStatus,
  "info" | "success" | "neutral" | "danger" | "warning"
> = {
  draft: "warning",
  published: "success",
  archived: "neutral",
};

export const EMPTY_BLOG: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  featuredImagePublicId: "",
  status: "draft",
  category: "",
  tags: [],
  author: {
    name: "",
    email: "",
    bio: "",
  },
  publishedDate: "",
  seoTitle: "",
  seoDescription: "",
  isFeature: false,
  viewCount: 0,
};

/** Slugify a title into a URL-friendly string. */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Estimate read time in minutes (~200 words per minute, strips HTML). */
export function calculateReadTime(content: string): number {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}
