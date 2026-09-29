"use client";

import { useCallback, useMemo, useState } from "react";
import type { BlogFormValues, BlogImage } from "../../types";
import { hasBlocks } from "../../lib/blocks";
import { sanitizeHtml } from "../../lib/sanitize";
import { BlockRenderer } from "./BlockRenderer";
import { Lightbox } from "./Lightbox";

/**
 * The article text. Block-based posts render from `blocks`; legacy posts
 * (HTML written before the block editor) are sanitized and styled with the
 * same typography so old and new stories look consistent.
 */
export function ArticleBody({ post }: { post: Pick<BlogFormValues, "blocks" | "content"> }) {
  const [lightbox, setLightbox] = useState<{ images: BlogImage[]; index: number } | null>(null);
  const open = useCallback(
    (images: BlogImage[], index: number) => setLightbox({ images, index }),
    []
  );
  const legacyHtml = useMemo(
    () => (hasBlocks(post) ? "" : sanitizeHtml(post.content ?? "")),
    [post]
  );

  return (
    <>
      <div className="np-prose">
        {hasBlocks(post) ? (
          <BlockRenderer blocks={post.blocks ?? []} onOpenImage={open} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: legacyHtml }} />
        )}
      </div>
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
