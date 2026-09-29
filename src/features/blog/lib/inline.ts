/**
 * Tiny, safe inline markup used inside paragraph / quote / list text.
 *
 *   **bold**   *italic*   [label](https://url)   (newline → line break)
 *
 * Article text is parsed into a small tree and rendered as React nodes (or
 * escaped HTML) — author text is never injected as raw HTML, so there is no
 * XSS surface, and admins never have to write HTML by hand.
 */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "br" }
  | { type: "strong" | "em"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

/**
 * Alternation order matters: link, then bold (**), then italic (*), then \n.
 * Emphasis must hug its content (no space after the opening / before the
 * closing marker) so stray asterisks such as "5 * 3 * 2" are left alone.
 */
const TOKEN =
  /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|\*\*(\S(?:[^\n]*?\S)?)\*\*|\*([^\s*](?:[^*\n]*?[^\s*])?)\*|\n/g;

/** Only allow navigable, non-scripting URLs. */
export function safeHref(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[/#]/.test(trimmed) && !trimmed.startsWith("//")) return trimmed;
  return null;
}

export function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const re = new RegExp(TOKEN.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(source)) !== null) {
    if (m.index > last) {
      nodes.push({ type: "text", value: source.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      const children = parseInline(m[1]);
      if (href) nodes.push({ type: "link", href, children });
      else nodes.push(...children); // unsafe URL → keep the label as text
    } else if (m[3] !== undefined) {
      nodes.push({ type: "strong", children: parseInline(m[3]) });
    } else if (m[4] !== undefined) {
      nodes.push({ type: "em", children: parseInline(m[4]) });
    } else {
      nodes.push({ type: "br" });
    }
    last = m.index + m[0].length;
  }
  if (last < source.length) {
    nodes.push({ type: "text", value: source.slice(last) });
  }
  return nodes;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nodesToHtml(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
          return escapeHtml(n.value);
        case "br":
          return "<br />";
        case "strong":
          return `<strong>${nodesToHtml(n.children)}</strong>`;
        case "em":
          return `<em>${nodesToHtml(n.children)}</em>`;
        case "link":
          return `<a href="${escapeHtml(n.href)}" rel="noopener noreferrer">${nodesToHtml(n.children)}</a>`;
      }
    })
    .join("");
}

function nodesToText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      switch (n.type) {
        case "text":
          return n.value;
        case "br":
          return " ";
        default:
          return nodesToText(n.children);
      }
    })
    .join("");
}

/** Escaped HTML for `text` — used to keep the legacy `content` field in sync. */
export function inlineToHtml(text: string): string {
  return nodesToHtml(parseInline(text));
}

/** Markup-free text — used for read-time and search. */
export function inlineToText(text: string): string {
  return nodesToText(parseInline(text));
}
