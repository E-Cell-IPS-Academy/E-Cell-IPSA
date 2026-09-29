/**
 * Resolve a pasted video link into something safe to embed.
 * Only YouTube (privacy-enhanced domain), Vimeo and direct video files are
 * embedded; anything else is rendered as a plain link.
 */
export type ParsedVideo =
  | { kind: "iframe"; embedUrl: string; provider: "youtube" | "vimeo" }
  | { kind: "file"; src: string }
  | { kind: "link"; href: string }
  | { kind: "invalid" };

const YT_ID = /^[\w-]{11}$/;

export function parseVideoUrl(input: string): ParsedVideo {
  const raw = input.trim();
  if (!raw) return { kind: "invalid" };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { kind: "invalid" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { kind: "invalid" };
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    if (YT_ID.test(id)) {
      return {
        kind: "iframe",
        provider: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      };
    }
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id =
      url.searchParams.get("v") ??
      (["embed", "shorts", "live"].includes(parts[0] ?? "") ? parts[1] : "");
    if (id && YT_ID.test(id)) {
      return {
        kind: "iframe",
        provider: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      };
    }
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    if (id) {
      return {
        kind: "iframe",
        provider: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    return { kind: "file", src: url.toString() };
  }

  return { kind: "link", href: url.toString() };
}
