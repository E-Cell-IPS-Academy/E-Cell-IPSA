import type { CSSProperties } from "react";
import { optimizeImage, toEmbedUrl } from "../types";
import type { ContentBlock } from "../types";

interface ArticleBodyProps {
    blocks: ContentBlock[];
    /** Matches the page theme. Drives the `ed-dark` class only. */
    dark?: boolean;
    className?: string;
}

/**
 * Renders the structured body of an article. Pure presentation — the same
 * component backs the public article page and the admin preview, so what an
 * editor sees before publishing is what readers get.
 */
export function ArticleBody({ blocks, dark, className = "" }: ArticleBodyProps) {
    if (blocks.length === 0) {
        return (
            <p className="ed-empty">This article has no content blocks yet.</p>
        );
    }

    return (
        <div className={`ed-article ${dark ? "ed-dark" : ""} ${className}`}>
            {blocks.map((block) => (
                <Block key={block.id} block={block} />
            ))}
        </div>
    );
}

function Block({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "heading": {
            const Tag = (`h${block.level}` as unknown) as "h2";
            return <Tag className={`ed-h ed-h${block.level}`}>{block.text}</Tag>;
        }

        case "paragraph":
            return (
                <p
                    className={block.lead ? "ed-p ed-lead" : "ed-p"}
                    dangerouslySetInnerHTML={{ __html: block.text }}
                />
            );

        case "image":
            return (
                <figure className={`ed-figure ed-img-${block.align}`}>
                    <img
                        src={optimizeImage(block.url, block.align === "full" ? 1400 : 800)}
                        alt={block.alt}
                        loading="lazy"
                        decoding="async"
                        className="ed-img"
                    />
                    {block.caption && (
                        <figcaption className="ed-caption">{block.caption}</figcaption>
                    )}
                </figure>
            );

        case "gallery":
            return (
                <figure className="ed-figure ed-img-full">
                    <div
                        className="ed-gallery"
                        style={
                            { "--cols": block.columns } as CSSProperties
                        }
                    >
                        {block.images.map((img, i) => (
                            <figure key={`${img.url}-${i}`} className="ed-gallery-item">
                                <img
                                    src={optimizeImage(img.url, 800)}
                                    alt={img.alt}
                                    loading="lazy"
                                    decoding="async"
                                />
                                {img.caption && (
                                    <figcaption className="ed-caption">{img.caption}</figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                    {block.caption && (
                        <figcaption className="ed-caption">{block.caption}</figcaption>
                    )}
                </figure>
            );

        case "quote":
            return (
                <blockquote
                    className={block.variant === "pull" ? "ed-pullquote" : "ed-blockquote"}
                >
                    <p>{block.text}</p>
                    {block.attribution && <cite>{block.attribution}</cite>}
                </blockquote>
            );

        case "list":
            return block.style === "numbered" ? (
                <ol className="ed-list ed-list-num">
                    {block.items.filter(Boolean).map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ol>
            ) : (
                <ul className="ed-list">
                    {block.items.filter(Boolean).map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ul>
            );

        case "divider":
            return <hr className="ed-rule" aria-hidden />;

        case "video":
            return (
                <figure className="ed-figure ed-img-full">
                    <div className="ed-video">
                        <iframe
                            src={toEmbedUrl(block.url)}
                            title={block.caption || "Embedded video"}
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    {block.caption && (
                        <figcaption className="ed-caption">{block.caption}</figcaption>
                    )}
                </figure>
            );

        case "html":
            return (
                <div
                    className="ed-html"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                />
            );

        default:
            return null;
    }
}