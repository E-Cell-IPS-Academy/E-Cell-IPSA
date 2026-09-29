import type { BlogImage, ContentBlock, HeadingLevel } from "../types";
import { createBlock, emptyImage, newId } from "./blocks";
import { parseVideoUrl } from "./video";
import { safeHref } from "./inline";

/**
 * Convert legacy hand-written HTML into editor blocks so old posts can be
 * opened in the block editor. Best-effort: unknown structures fall back to
 * paragraphs of their text. The original HTML is preserved on the post as
 * `legacyContent` so nothing is lost. Browser-only (DOMParser).
 */

function inlineMarkup(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\*/g, "\\*").replace(/\s+/g, " ");
  }
  if (!(node instanceof Element)) return "";
  const inner = Array.from(node.childNodes).map(inlineMarkup).join("");
  switch (node.tagName.toLowerCase()) {
    case "strong":
    case "b":
      return inner.trim() ? `**${inner.trim()}**` : inner;
    case "em":
    case "i":
      return inner.trim() ? `*${inner.trim()}*` : inner;
    case "br":
      return "\n";
    case "a": {
      const href = safeHref(node.getAttribute("href") ?? "");
      return href && inner.trim() ? `[${inner.trim().replace(/[\]\n]/g, " ")}](${href})` : inner;
    }
    default:
      return inner;
  }
}

const clean = (s: string) => s.replace(/\\\*/g, "*").replace(/[ \t]+\n/g, "\n").trim();
const markup = (el: Element) => clean(Array.from(el.childNodes).map(inlineMarkup).join(""));

function imageFrom(img: Element, caption = ""): BlogImage | null {
  const src = img.getAttribute("src") ?? "";
  if (!/^https?:\/\//i.test(src)) return null;
  const w = Number(img.getAttribute("width"));
  const h = Number(img.getAttribute("height"));
  return {
    src,
    alt: img.getAttribute("alt") ?? "",
    caption,
    ...(w && h ? { width: w, height: h } : {}),
  };
}

export function htmlToBlocks(html: string): ContentBlock[] {
  if (!html.trim() || typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: ContentBlock[] = [];

  const pushImage = (image: BlogImage | null) => {
    if (image) blocks.push({ id: newId(), type: "image", image, align: "center", size: "large" });
  };

  const walk = (parent: Element) => {
    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent ?? "").trim();
        if (text) blocks.push({ id: newId(), type: "paragraph", text });
        continue;
      }
      if (!(node instanceof Element)) continue;
      const tag = node.tagName.toLowerCase();

      // Non-content elements: their text is code, not article copy.
      if (["script", "style", "noscript", "template", "head", "link", "meta"].includes(tag)) continue;

      if (/^h[1-6]$/.test(tag)) {
        const raw = Number(tag[1]);
        const level = Math.min(4, Math.max(2, raw)) as HeadingLevel;
        const text = clean(node.textContent ?? "");
        if (text) blocks.push({ id: newId(), type: "heading", level, text });
      } else if (tag === "p") {
        const img = node.querySelector("img");
        const text = markup(node);
        if (img && !text) pushImage(imageFrom(img));
        else if (text) blocks.push({ id: newId(), type: "paragraph", text });
      } else if (tag === "img") {
        pushImage(imageFrom(node));
      } else if (tag === "figure") {
        const img = node.querySelector("img");
        const caption = clean(node.querySelector("figcaption")?.textContent ?? "");
        if (img) pushImage(imageFrom(img, caption));
      } else if (tag === "blockquote") {
        const text = clean(node.textContent ?? "");
        if (text) blocks.push({ id: newId(), type: "quote", variant: "quote", text, cite: "" });
      } else if (tag === "ul" || tag === "ol") {
        const items = Array.from(node.querySelectorAll(":scope > li")).map(markup).filter(Boolean);
        if (items.length) blocks.push({ id: newId(), type: "list", ordered: tag === "ol", items });
      } else if (tag === "hr") {
        blocks.push({ id: newId(), type: "divider" });
      } else if (tag === "iframe") {
        const src = node.getAttribute("src") ?? "";
        if (parseVideoUrl(src).kind === "iframe") {
          blocks.push({ id: newId(), type: "video", url: src, caption: "" });
        }
      } else if (["div", "section", "article", "span"].includes(tag)) {
        walk(node);
      } else {
        const text = clean(node.textContent ?? "");
        if (text) blocks.push({ id: newId(), type: "paragraph", text });
      }
    }
  };

  walk(doc.body);
  return blocks;
}


/* -------------------------------------------------------------------------- */
/* Repair blocks loaded from Firestore                                        */
/* -------------------------------------------------------------------------- */

const KNOWN_TYPES = new Set([
  "heading", "paragraph", "image", "gallery", "quote", "list", "divider", "video",
]);

const asImage = (raw: unknown): BlogImage => ({
  ...emptyImage(),
  ...(raw && typeof raw === "object" ? (raw as Partial<BlogImage>) : {}),
});

/**
 * Saved posts can contain blocks from older editors (e.g. type "html"/"text")
 * or with a missing `type`/`id`/fields. The editor assumes every block is
 * well-formed, so one bad block crashes the whole page. This keeps valid
 * blocks (filling any missing fields), converts salvageable ones to
 * paragraphs, and drops the rest.
 */
export function normalizeBlocks(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: ContentBlock[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const b = item as Record<string, unknown>;
    const id = typeof b.id === "string" && b.id ? b.id : newId();

    if (typeof b.type === "string" && KNOWN_TYPES.has(b.type)) {
      const base = createBlock(b.type as ContentBlock["type"]);
      const merged = { ...base, ...b, id } as Record<string, unknown>;
      if (b.type === "image") merged.image = asImage(b.image);
      if (b.type === "gallery")
        merged.images = Array.isArray(b.images) ? b.images.map(asImage) : [];
      if (b.type === "list" && !Array.isArray(b.items)) merged.items = [""];
      out.push(merged as unknown as ContentBlock);
      continue;
    }

    // Unknown type: salvage any text/html it carries.
    const text = [b.html, b.content, b.text, b.value].find(
      (v): v is string => typeof v === "string" && v.trim() !== ""
    );
    if (!text) continue;
    const converted = /<[a-z][\s\S]*>/i.test(text) ? htmlToBlocks(text) : [];
    if (converted.length) out.push(...converted);
    else
      out.push({
        ...createBlock("paragraph"),
        text: text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      } as ContentBlock);
  }
  return out;
}