/**
 * Client-side sorting helpers.
 *
 * Public list queries filter with a single `where(...)` and sort here in JS
 * instead of adding `orderBy(...)` to the query. A `where` + `orderBy` on
 * different fields requires a Firestore COMPOSITE INDEX; without it the query
 * throws "The query requires an index" and the page renders empty. For a site
 * this size, sorting in memory is cheap and removes that deployment footgun.
 */

/** Convert a Firestore Timestamp (or timestamp-like value) to milliseconds. */
export function tsToMillis(value: unknown): number {
  if (value && typeof value === "object") {
    const o = value as { toMillis?: () => number; seconds?: number };
    if (typeof o.toMillis === "function") return o.toMillis();
    if (typeof o.seconds === "number") return o.seconds * 1000;
  }
  return 0;
}

/** Newest first, by a `createdAt` Firestore timestamp. */
export function sortByCreatedAtDesc<T extends { createdAt?: unknown }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => tsToMillis(b.createdAt) - tsToMillis(a.createdAt)
  );
}

/** Ascending by a numeric `order` field (missing values sort first). */
export function sortByOrderAsc<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
