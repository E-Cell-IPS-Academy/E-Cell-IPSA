import { buildSrcSet, optimizedUrl } from "../../lib/imageUtils";
import { cn } from "@/shared/lib/cn";

interface StoryImageProps {
  src?: string;
  /** Decorative by default — cards already carry the headline as link text. */
  alt?: string;
  ratio?: "16-10" | "3-2" | "4-3";
  sizes?: string;
  width?: number;
  /** Above-the-fold image: load eagerly and at high priority. */
  priority?: boolean;
  /** Text shown when the story has no image. */
  fallback?: string;
  className?: string;
}

/**
 * Cropped, aspect-ratio-locked story image with a responsive `srcset`
 * (Cloudinary f_auto/q_auto variants) and lazy loading. No image → a quiet
 * typographic placeholder rather than a broken box.
 */
export function StoryImage({
  src,
  alt = "",
  ratio = "16-10",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  width,
  priority = false,
  fallback,
  className,
}: StoryImageProps) {
  return (
    <div className={cn("np-media", `np-ar-${ratio}`, className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={optimizedUrl(src, 1080)}
          srcSet={buildSrcSet(src, width)}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
        />
      ) : (
        <div className="np-media-empty" aria-hidden="true">
          {fallback}
        </div>
      )}
    </div>
  );
}
