import type { BlogImage } from "../../types";
import { buildSrcSet, optimizedUrl } from "../../lib/imageUtils";

/** Responsive, aspect-ratio-safe image (reserves space → no layout shift). */
export function ArticleImage({
  image,
  sizes,
  eager = false,
}: {
  image: BlogImage;
  sizes: string;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedUrl(image.src, 1080)}
      srcSet={buildSrcSet(image.src, image.width)}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
