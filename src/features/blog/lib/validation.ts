import type { BlogFormValues } from "../types";
import { isBlockEmpty } from "./blocks";

export type FieldErrors = Partial<Record<
  "title" | "slug" | "excerpt" | "category" | "author" | "content",
  string
>>;

/** Minimum needed to save a draft: just a title (so it can be found again). */
export function validateDraft(v: Pick<BlogFormValues, "title">): FieldErrors {
  return v.title.trim() ? {} : { title: "Add a title before saving." };
}

/** Everything a reader-facing post needs before it can go live. */
export function validatePublish(
  v: Pick<BlogFormValues, "title" | "slug" | "excerpt" | "category" | "author" | "blocks" | "content">
): FieldErrors {
  const errors: FieldErrors = {};
  if (!v.title.trim()) errors.title = "A title is required to publish.";
  if (!v.slug.trim()) errors.slug = "A URL slug is required to publish.";
  if (!v.excerpt.trim()) errors.excerpt = "Write a short summary — it appears on story cards.";
  if (!v.category) errors.category = "Choose a category.";
  if (!v.author?.name.trim()) errors.author = "Add the author's name.";
  const hasBlocks = (v.blocks ?? []).some((b) => !isBlockEmpty(b));
  const hasLegacy = !(v.blocks ?? []).length && !!v.content?.trim();
  if (!hasBlocks && !hasLegacy) errors.content = "Add some content to the article.";
  return errors;
}
