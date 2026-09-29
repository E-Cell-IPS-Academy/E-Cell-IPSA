import { PRIMARY_CATEGORIES } from "../types";
import type { BlogPost } from "../types";
import { categorySlug, postTime } from "./format";
import { inlineToText } from "./inline";

export interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}

export interface PostFilters {
  /** Category slug, or "" for all. */
  category: string;
  query: string;
  tag: string;
}

export const newestFirst = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => postTime(b) - postTime(a));

/**
 * Section navigation: the six house sections always appear (in order, even if
 * empty) followed by any extra categories that have posts.
 */
export function buildCategories(posts: BlogPost[]): CategoryEntry[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  const primary = PRIMARY_CATEGORIES.map((name) => ({
    name,
    slug: categorySlug(name),
    count: counts.get(name) ?? 0,
  }));
  const extras = [...counts.entries()]
    .filter(([name]) => !PRIMARY_CATEGORIES.includes(name))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }));
  return [...primary, ...extras];
}

export function filterPosts(posts: BlogPost[], f: PostFilters): BlogPost[] {
  const q = f.query.trim().toLowerCase();
  const tag = f.tag.trim().toLowerCase();
  return posts.filter((p) => {
    if (f.category && categorySlug(p.category ?? "") !== f.category) return false;
    if (tag && !(p.tags ?? []).some((t) => t.toLowerCase() === tag)) return false;
    if (!q) return true;
    const haystack = [
      p.title,
      p.subtitle,
      p.excerpt,
      p.author?.name,
      p.category,
      ...(p.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export interface FrontPage {
  lead: BlogPost | null;
  /** Up to 6 stories: [leadCard, mid, mid, brief, brief, brief]. */
  grid: BlogPost[];
  /** Everything else — the chronological "Latest" feed. */
  rest: BlogPost[];
}

export const GRID_SIZE = 6;

/** Split newest-first posts into the hero, the editorial grid and the feed. */
export function buildFrontPage(posts: BlogPost[]): FrontPage {
  const sorted = newestFirst(posts);
  const lead = sorted.find((p) => p.isFeature) ?? sorted[0] ?? null;
  const others = sorted.filter((p) => p.id !== lead?.id);
  return {
    lead,
    grid: others.slice(0, GRID_SIZE),
    rest: others.slice(GRID_SIZE),
  };
}

/** Most-read first (viewCount), then featured, then newest. */
export function pickTrending(posts: BlogPost[], count = 5): BlogPost[] {
  return [...posts]
    .sort(
      (a, b) =>
        (b.viewCount ?? 0) - (a.viewCount ?? 0) ||
        Number(!!b.isFeature) - Number(!!a.isFeature) ||
        postTime(b) - postTime(a)
    )
    .slice(0, count);
}

/** Same-category / shared-tag stories first, topped up with the newest. */
export function pickRelated(
  all: BlogPost[],
  current: BlogPost,
  count = 3
): BlogPost[] {
  const score = (p: BlogPost) =>
    (p.category === current.category ? 2 : 0) +
    (p.tags ?? []).filter((t) => (current.tags ?? []).includes(t)).length;
  return all
    .filter((p) => p.id !== current.id)
    .sort((a, b) => score(b) - score(a) || postTime(b) - postTime(a))
    .slice(0, count);
}

/** Plain-text summary safe for meta descriptions. */
export const summarize = (text: string, max = 160) => {
  const t = inlineToText(text).replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};
