import type {
  BlockType,
  BlogImage,
  BlogPost,
  ContentBlock,
  GalleryBlock,
  ImageBlock,
} from "../types";
import { escapeHtml, inlineToHtml, inlineToText } from "./inline";
import { parseVideoUrl } from "./video";

/* -------------------------------------------------------------------------- */
/* Creation                                                                   */
/* -------------------------------------------------------------------------- */

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `b_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyImage(): BlogImage {
  return { src: "", alt: "", caption: "" };
}

/** Build a new, empty block of the requested type. */
export function createBlock(type: BlockType): ContentBlock {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "paragraph":
      return { id, type, text: "" };
    case "image":
      return { id, type, image: emptyImage(), align: "center", size: "large" };
    case "gallery":
      return { id, type, images: [], columns: 3, caption: "" };
    case "quote":
      return { id, type, variant: "quote", text: "", cite: "" };
    case "list":
      return { id, type, ordered: false, items: [""] };
    case "divider":
      return { id, type };
    case "video":
      return { id, type, url: "", caption: "" };
    case "html":
      return { id, type, html: "" };
  }
}

export function imageBlockFrom(image: BlogImage): ImageBlock {
  return {
    id: newId(),
    type: "image",
    image,
    align: "center",
    size: "large",
  };
}

export function galleryBlockFrom(images: BlogImage[]): GalleryBlock {
  return {
    id: newId(),
    type: "gallery",
    images,
    columns: images.length === 2 ? 2 : images.length >= 4 ? 4 : 3,
    caption: "",
  };
}

/** Deep-copy a block with a fresh id. */
export function cloneBlock(block: ContentBlock): ContentBlock {
  return { ...(JSON.parse(JSON.stringify(block)) as ContentBlock), id: newId() };
}

/* -------------------------------------------------------------------------- */
/* Array helpers                                                              */
/* -------------------------------------------------------------------------- */

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
  return next;
}

/* -------------------------------------------------------------------------- */
/* Inspection                                                                 */
/* -------------------------------------------------------------------------- */

/** A block with nothing worth publishing (ignored when saving / counting). */
export function isBlockEmpty(block: ContentBlock): boolean {
  switch (block.type) {
    case "heading":
    case "paragraph":
    case "quote":
      return block.text.trim() === "";
    case "image":
      return block.image.src === "";
    case "gallery":
      return block.images.length === 0;
    case "list":
      return block.items.every((i) => i.trim() === "");
    case "video":
      return block.url.trim() === "";
    case "html":
      return block.html.trim() === "";
    case "divider":
      return false;
  }
}

/** Every image referenced by the blocks, de-duplicated by URL. */
export function collectImages(blocks: ContentBlock[]): BlogImage[] {
  const seen = new Map<string, BlogImage>();
  for (const b of blocks) {
    const imgs =
      b.type === "image" ? [b.image] : b.type === "gallery" ? b.images : [];
    for (const img of imgs) {
      if (img.src && !seen.has(img.src)) seen.set(img.src, img);
    }
  }
  return [...seen.values()];
}

/** Images that are missing alternative text — surfaced as an editor warning. */
export function imagesMissingAlt(blocks: ContentBlock[]): number {
  let count = 0;
  for (const b of blocks) {
    if (b.type === "image" && b.image.src && !b.image.alt.trim()) count++;
    if (b.type === "gallery") {
      count += b.images.filter((i) => i.src && !i.alt.trim()).length;
    }
  }
  return count;
}

/* -------------------------------------------------------------------------- */
/* Serialization                                                              */
/* -------------------------------------------------------------------------- */

export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
        case "paragraph":
          return inlineToText(b.text);
        case "quote":
          return inlineToText(b.text);
        case "list":
          return b.items.map(inlineToText).join(" ");
        case "image":
          return b.image.caption ?? "";
        case "gallery":
          return b.caption ?? "";
        case "video":
          return b.caption ?? "";
        case "divider":
          return "";
        case "html":
          return b.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

function imgHtml(img: BlogImage): string {
  const dims =
    img.width && img.height ? ` width="${img.width}" height="${img.height}"` : "";
  return `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}"${dims} loading="lazy" />`;
}

function figure(inner: string, caption?: string): string {
  const cap = caption?.trim() ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
  return `<figure>${inner}${cap}</figure>`;
}

/**
 * HTML rendering of the article. Persisted in the legacy `content` field so
 * anything still reading `content` (search, exports, older admin views) keeps
 * working. The public reader renders `blocks` directly, not this string.
 */
export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .filter((b) => !isBlockEmpty(b))
    .map((b): string => {
      switch (b.type) {
        case "heading":
          return `<h${b.level}>${inlineToHtml(b.text)}</h${b.level}>`;
        case "paragraph":
          return `<p>${inlineToHtml(b.text)}</p>`;
        case "image":
          return figure(imgHtml(b.image), b.image.caption);
        case "gallery":
          return figure(b.images.map(imgHtml).join(""), b.caption);
        case "quote": {
          const cite = b.cite?.trim()
            ? `<cite>${escapeHtml(b.cite)}</cite>`
            : "";
          return `<blockquote><p>${inlineToHtml(b.text)}</p>${cite}</blockquote>`;
        }
        case "list": {
          const tag = b.ordered ? "ol" : "ul";
          const items = b.items
            .filter((i) => i.trim())
            .map((i) => `<li>${inlineToHtml(i)}</li>`)
            .join("");
          return `<${tag}>${items}</${tag}>`;
        }
        case "divider":
          return "<hr />";
        case "html":
          return b.html;
        case "video": {
          const v = parseVideoUrl(b.url);
          const href = v.kind === "iframe" ? v.embedUrl : v.kind === "file" ? v.src : v.kind === "link" ? v.href : "";
          return href
            ? figure(
              `<p><a href="${escapeHtml(href)}" rel="noopener noreferrer">${escapeHtml(href)}</a></p>`,
              b.caption
            )
            : "";
        }
      }
    })
    .join("\n");
}

/* -------------------------------------------------------------------------- */
/* Read time                                                                  */
/* -------------------------------------------------------------------------- */

const WORDS_PER_MINUTE = 200;
const SECONDS_PER_IMAGE = 8;

/** Reading time in whole minutes (≥ 1): words at 200 wpm plus a little per image. */
export function estimateReadTime(blocks: ContentBlock[]): number {
  const text = blocksToPlainText(blocks).trim();
  const words = text ? text.split(/\s+/).length : 0;
  const images = blocks.reduce(
    (n, b) =>
      n + (b.type === "image" ? 1 : b.type === "gallery" ? b.images.length : 0),
    0
  );
  const minutes = words / WORDS_PER_MINUTE + (images * SECONDS_PER_IMAGE) / 60;
  return Math.max(1, Math.ceil(minutes));
}

/** True when the post carries structured content the new renderer can use. */
export function hasBlocks(post: Pick<BlogPost, "blocks">): boolean {
  return Array.isArray(post.blocks) && post.blocks.length > 0;
}