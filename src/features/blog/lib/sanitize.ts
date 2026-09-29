/**
 * Allow-list HTML sanitizer for LEGACY posts (hand-written HTML stored in
 * `content` before the block editor existed). Everything not explicitly
 * allowed is dropped: scripts, event handlers, inline styles, unknown tags,
 * javascript:/data: URLs. Browser-only (uses DOMParser); on the server it
 * returns "" — legacy content is only ever rendered after client data load.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em",
  "i", "u", "s", "sub", "sup", "a", "ul", "ol", "li", "blockquote", "figure",
  "figcaption", "img", "pre", "code", "span", "div", "table", "thead",
  "tbody", "tr", "th", "td", "iframe",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  iframe: ["src", "title", "width", "height", "allowfullscreen"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

const IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
]);

function safeUrl(value: string, kind: "link" | "media"): string | null {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (kind === "link" && /^(mailto:|tel:)/i.test(v)) return v;
  if (/^\/(?!\/)/.test(v) || (kind === "link" && v.startsWith("#"))) return v;
  return null;
}

function cleanNode(node: Element): void {
  for (const child of Array.from(node.children)) {
    const tag = child.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      // Drop dangerous containers wholesale; unwrap harmless unknown tags.
      if (["script", "style", "object", "embed", "form", "svg", "math", "template", "noscript"].includes(tag)) {
        child.remove();
      } else {
        cleanNode(child);
        child.replaceWith(...Array.from(child.childNodes));
      }
      continue;
    }

    const allowed = ALLOWED_ATTRS[tag] ?? [];
    for (const attr of Array.from(child.attributes)) {
      if (!allowed.includes(attr.name.toLowerCase())) child.removeAttribute(attr.name);
    }

    if (tag === "a") {
      const href = child.getAttribute("href");
      const safe = href ? safeUrl(href, "link") : null;
      if (safe) {
        child.setAttribute("href", safe);
        child.setAttribute("rel", "noopener noreferrer");
      } else child.removeAttribute("href");
    }

    if (tag === "img") {
      const src = child.getAttribute("src");
      const safe = src ? safeUrl(src, "media") : null;
      if (!safe) {
        child.remove();
        continue;
      }
      child.setAttribute("src", safe);
      child.setAttribute("loading", "lazy");
    }

    if (tag === "iframe") {
      let ok = false;
      try {
        const src = child.getAttribute("src") ?? "";
        ok = /^https:\/\//i.test(src) && IFRAME_HOSTS.has(new URL(src).hostname);
      } catch {
        ok = false;
      }
      if (!ok) {
        child.remove();
        continue;
      }
    }

    cleanNode(child);
  }
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof DOMParser === "undefined") return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  cleanNode(doc.body);
  return doc.body.innerHTML;
}
