import type { ReactNode } from "react";
import type { BlogImage, ContentBlock } from "../../types";
import { parseVideoUrl } from "../../lib/video";
import { categorySlug } from "../../lib/format";
import { Inline } from "./Inline";
import { ArticleImage } from "./ArticleImage";

export type OpenLightbox = (images: BlogImage[], index: number) => void;

const IMAGE_SIZES: Record<string, string> = {
  small: "(min-width: 640px) 15rem, 100vw",
  medium: "(min-width: 640px) 26rem, 100vw",
  large: "(min-width: 720px) 42rem, 100vw",
  full: "(min-width: 1100px) 66rem, 100vw",
};

function Video({ url, caption }: { url: string; caption?: string }) {
  const video = parseVideoUrl(url);
  if (video.kind === "invalid") return null;
  return (
    <figure className="np-video">
      {video.kind === "iframe" ? (
        <div className="np-video-frame">
          <iframe
            src={video.embedUrl}
            title={caption || "Embedded video"}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : video.kind === "file" ? (
        <div className="np-video-frame">
          <video src={video.src} controls preload="metadata" />
        </div>
      ) : (
        <p>
          <a href={video.href} target="_blank" rel="noopener noreferrer">
            Watch video ↗
          </a>
        </p>
      )}
      {caption && <figcaption className="np-caption">{caption}</figcaption>}
    </figure>
  );
}

/** Renders the structured article body. Element order = block order. */
export function BlockRenderer({
  blocks,
  onOpenImage,
}: {
  blocks: ContentBlock[];
  onOpenImage: OpenLightbox;
}) {
  const usedIds = new Map<string, number>();
  const headingId = (text: string) => {
    const base = categorySlug(text) || "section";
    const n = usedIds.get(base) ?? 0;
    usedIds.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  let ledeUsed = false;

  const nodes: ReactNode[] = blocks.map((b) => {
    switch (b.type) {
      case "heading": {
        if (!b.text.trim()) return null;
        const Tag = `h${b.level}` as "h2" | "h3" | "h4";
        return (
          <Tag key={b.id} id={headingId(b.text)}>
            <Inline text={b.text} />
          </Tag>
        );
      }
      case "paragraph": {
        if (!b.text.trim()) return null;
        const lede = !ledeUsed && b.text.trim().length > 80;
        ledeUsed = true;
        return (
          <p key={b.id} className={lede ? "np-lede" : undefined}>
            <Inline text={b.text} />
          </p>
        );
      }
      case "image": {
        if (!b.image.src) return null;
        return (
          <figure key={b.id} className="np-fig" data-size={b.size} data-align={b.align}>
            <button
              type="button"
              className="np-zoom"
              onClick={() => onOpenImage([b.image], 0)}
              aria-haspopup="dialog"
            >
              <ArticleImage image={b.image} sizes={IMAGE_SIZES[b.size]} />
            </button>
            {b.image.caption && (
              <figcaption className="np-caption">{b.image.caption}</figcaption>
            )}
          </figure>
        );
      }
      case "gallery": {
        const images = b.images.filter((i) => i.src);
        if (!images.length) return null;
        return (
          <figure key={b.id} className="np-gallery">
            <div
              className="np-gallery-grid"
              style={{ ["--cols" as string]: b.columns }}
            >
              {images.map((img, i) => (
                <div key={img.src + i} className="np-gallery-item">
                  <button
                    type="button"
                    onClick={() => onOpenImage(images, i)}
                    aria-haspopup="dialog"
                  >
                    <ArticleImage
                      image={{ ...img, width: undefined, height: undefined }}
                      sizes="(min-width: 720px) 22rem, 50vw"
                    />
                  </button>
                </div>
              ))}
            </div>
            {b.caption && <figcaption className="np-caption">{b.caption}</figcaption>}
          </figure>
        );
      }
      case "quote": {
        if (!b.text.trim()) return null;
        return b.variant === "pull" ? (
          <aside key={b.id} className="np-pull">
            <p>
              <Inline text={b.text} />
            </p>
            {b.cite && <cite>{b.cite}</cite>}
          </aside>
        ) : (
          <blockquote key={b.id}>
            <p>
              <Inline text={b.text} />
            </p>
            {b.cite && <cite>{b.cite}</cite>}
          </blockquote>
        );
      }
      case "list": {
        const items = b.items.filter((i) => i.trim());
        if (!items.length) return null;
        const Tag = b.ordered ? "ol" : "ul";
        return (
          <Tag key={b.id}>
            {items.map((item, i) => (
              <li key={i}>
                <Inline text={item} />
              </li>
            ))}
          </Tag>
        );
      }
      case "divider":
        return (
          <div key={b.id} className="np-divider" role="separator" aria-hidden="true">
            * * *
          </div>
        );
      case "video":
        return <Video key={b.id} url={b.url} caption={b.caption} />;
    }
  });

  return <>{nodes}</>;
}
