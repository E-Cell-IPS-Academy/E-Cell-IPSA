import { tsToMillis } from "@/shared/lib/sort";
import type { BlogPost } from "../types";

/** Publication identity — change here to rename the blog everywhere. */
export const PUBLICATION = {
  name: "The E-Cell Chronicle",
  tagline:
    "Stories, insights and ideas from the entrepreneurial ecosystem at IPS Academy, Indore.",
  org: "E-Cell IPS Academy",
  place: "Indore",
} as const;

/** Parse "YYYY-MM-DD" as a LOCAL date (new Date("2026-09-20") would be UTC). */
function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Best available publication date: `publishedDate`, else Firestore `createdAt`. */
export function postDate(
  post: Pick<BlogPost, "publishedDate" | "createdAt">
): Date | null {
  if (post.publishedDate) {
    const d = parseISODate(post.publishedDate);
    if (d) return d;
  }
  const ms = tsToMillis(post.createdAt);
  return ms ? new Date(ms) : null;
}

export const postTime = (
  post: Pick<BlogPost, "publishedDate" | "createdAt">
) => postDate(post)?.getTime() ?? 0;

export function formatDate(
  d: Date | null,
  style: "short" | "long" = "short"
): string {
  if (!d) return "";
  return d.toLocaleDateString(
    "en-GB",
    style === "long"
      ? { day: "numeric", month: "long", year: "numeric" }
      : { day: "numeric", month: "short", year: "numeric" }
  );
}

/** Machine-readable value for <time dateTime>. */
export function isoDate(d: Date | null): string | undefined {
  if (!d) return undefined;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const todayISO = () => isoDate(new Date()) as string;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "•";

export const postHref = (post: Pick<BlogPost, "slug">) => `/blog/${post.slug}`;

export const categorySlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
