import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "../../types";
import { postHref } from "../../lib/format";
import { StoryImage } from "./StoryImage";
import { StoryMeta } from "./StoryMeta";
import { cn } from "@/shared/lib/cn";

interface CardProps {
  post: BlogPost;
  size?: "lead" | "mid";
  className?: string;
}

/** Vertical story card — the building block of the editorial grid. */
export function StoryCard({ post, size = "mid", className }: CardProps) {
  const lead = size === "lead";
  return (
    <Link href={postHref(post)} className={cn("np-story np-card", className)}>
      <StoryImage
        src={post.featuredImage}
        alt={post.featuredImageAlt}
        width={post.featuredImageWidth}
        ratio={lead ? "4-3" : "3-2"}
        sizes={lead ? "(min-width: 900px) 46vw, 100vw" : "(min-width: 900px) 22vw, 100vw"}
        fallback={post.category}
      />
      <span className="np-kicker">{post.category}</span>
      <h3 className={cn("np-headline", lead ? "np-h-lg" : "np-h-md")}>
        {post.title}
      </h3>
      {(lead || post.excerpt) && (
        <p className={cn("np-excerpt", lead ? "np-clamp-3" : "np-clamp-2")}>
          {post.excerpt}
        </p>
      )}
      <StoryMeta post={post} author={lead} />
    </Link>
  );
}

/** Headline-only item for the "In brief" column. */
export function BriefItem({ post }: { post: BlogPost }) {
  return (
    <Link href={postHref(post)} className="np-story np-brief">
      <span className="np-kicker">{post.category}</span>
      <h3 className="np-headline np-h-sm">{post.title}</h3>
      <StoryMeta post={post} author={false} readTime={false} />
    </Link>
  );
}

/** Horizontal row for the chronological feed (thumbnail on the right). */
export function StoryRow({ post }: { post: BlogPost }) {
  return (
    <Link
      href={postHref(post)}
      className={cn("np-story np-row", !post.featuredImage && "np-row--noimg")}
    >
      <div className="np-row-body">
        <span className="np-kicker">{post.category}</span>
        <h3 className="np-headline np-h-md">{post.title}</h3>
        {post.excerpt && <p className="np-excerpt np-clamp-2">{post.excerpt}</p>}
        <StoryMeta post={post} />
      </div>
      {post.featuredImage && (
        <StoryImage
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          width={post.featuredImageWidth}
          ratio="4-3"
          sizes="(min-width: 640px) 208px, 104px"
          className="self-start"
        />
      )}
    </Link>
  );
}

/** The lead story: large cover, bold headline, excerpt and a Read Story button. */
export function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <article className="np-hero np-story" aria-labelledby="np-featured-title">
      <Link href={postHref(post)} tabIndex={-1} aria-hidden="true">
        <StoryImage
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          width={post.featuredImageWidth}
          ratio="4-3"
          sizes="(min-width: 900px) 58vw, 100vw"
          priority
          fallback={post.category}
        />
      </Link>
      <div className="np-hero-text">
        <span className="np-kicker">
          {post.isFeature ? "Featured story · " : "Latest · "}
          {post.category}
        </span>
        <h2 id="np-featured-title" className="np-headline np-h-xl">
          <Link href={postHref(post)}>{post.title}</Link>
        </h2>
        {/* Deck if the story has one, otherwise the excerpt — never both. */}
        {post.subtitle ? (
          <p className="np-deck" style={{ textAlign: "left", margin: 0 }}>
            {post.subtitle}
          </p>
        ) : (
          post.excerpt && <p className="np-excerpt np-clamp-3">{post.excerpt}</p>
        )}
        <StoryMeta post={post} />
        <Link href={postHref(post)} className="np-btn">
          Read Story <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
