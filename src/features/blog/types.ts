"use client";

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

/* -------------------------------------------------------------------------- */
/* Structured article content (block model)                                   */
/* -------------------------------------------------------------------------- */

export type ImageAlign = "left" | "center" | "right";
/** small ≈ 30% of the column, medium ≈ 50%, large = column, full = wide breakout. */
export type ImageSize = "small" | "medium" | "large" | "full";
export type HeadingLevel = 2 | 3 | 4;
export type GalleryColumns = 2 | 3 | 4;

/**
 * An image hosted on Cloudinary. Only the URL + metadata are stored in
 * Firestore — never the binary. `width`/`height` let the reader reserve space
 * (no layout shift) and keep the correct aspect ratio.
 */
export interface BlogImage {
  src: string;
  publicId?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface BlockBase {
  /** Stable id used as the React key and drag-and-drop handle. */
  id: string;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  level: HeadingLevel;
  text: string;
}

/** `text` supports light inline markup: **bold**, *italic*, [label](url). */
export interface ParagraphBlock extends BlockBase {
  type: "paragraph";
  text: string;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  image: BlogImage;
  align: ImageAlign;
  size: ImageSize;
}

export interface GalleryBlock extends BlockBase {
  type: "gallery";
  images: BlogImage[];
  columns: GalleryColumns;
  caption?: string;
}

export interface QuoteBlock extends BlockBase {
  type: "quote";
  /** "quote" is an inline blockquote, "pull" is a large pull quote. */
  variant: "quote" | "pull";
  text: string;
  cite?: string;
}

export interface ListBlock extends BlockBase {
  type: "list";
  ordered: boolean;
  items: string[];
}

export interface DividerBlock extends BlockBase {
  type: "divider";
}

export interface VideoBlock extends BlockBase {
  type: "video";
  url: string;
  caption?: string;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | GalleryBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | VideoBlock;

export type BlockType = ContentBlock["type"];

/** A single blog post document. Field names match the admin Firestore schema. */
export interface BlogPost extends WithId {
  title: string;
  /** Deck / standfirst shown under the headline. */
  subtitle?: string;
  slug: string;
  excerpt: string;
  /**
   * HTML rendering of the article. For block-based posts this is regenerated
   * from `blocks` on every save (so search and older readers keep working);
   * for legacy posts it is the original hand-written HTML.
   */
  content: string;
  /** Structured content. Absent on legacy posts written before the block editor. */
  blocks?: ContentBlock[];
  /** Original HTML kept the first time a legacy post is converted to blocks. */
  legacyContent?: string;
  /** Cover image — independent of any image used inside the article body. */
  featuredImage?: string;
  featuredImagePublicId?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;
  /** Every image uploaded for this post, so it can be re-inserted elsewhere. */
  media?: BlogImage[];
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

/** Sections shown in the public publication navigation, in display order. */
export const PRIMARY_CATEGORIES = [
  "Entrepreneurship",
  "Startups",
  "Innovation",
  "Technology",
  "Leadership",
  "E-Cell Updates",
];

/**
 * Categories offered in the editor. The original categories are kept so that
 * posts written before the redesign still resolve to a valid option.
 */
export const BLOG_CATEGORIES = [
  ...PRIMARY_CATEGORIES,
  "Business",
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
  subtitle: "",
  slug: "",
  excerpt: "",
  content: "",
  blocks: [],
  featuredImage: "",
  featuredImagePublicId: "",
  featuredImageAlt: "",
  featuredImageCaption: "",
  media: [],
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
    // Trim AFTER converting spaces: "  hello " must not become "-hello-", and a
    // title with no Latin letters (e.g. Hindi) must become "" (not "-").
    .replace(/^-+|-+$/g, "");
}

/** Estimate read time in minutes (~200 words per minute, strips HTML). */
export function calculateReadTime(content: string): number {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}
