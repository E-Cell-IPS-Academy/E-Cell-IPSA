"use client";

import type { ReactNode, Ref } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BlogFormValues } from "../../types";
import {
  PUBLICATION,
  categorySlug,
  formatDate,
  initials,
  isoDate,
  postDate,
} from "../../lib/format";
import type { BlogPost } from "../../types";
import { buildSrcSet, optimizedUrl } from "../../lib/imageUtils";
import { ArticleBody } from "./ArticleBody";
import { ShareBar } from "./ShareBar";
import { EditionToggle } from "../public/EditionToggle";

type ArticleData = BlogFormValues & Partial<Pick<BlogPost, "createdAt">>;

interface ArticleViewProps {
  post: ArticleData;
  /** Public page: show the back link + share buttons + linked tags. */
  backHref?: string;
  /** Admin preview: inert links and share buttons. */
  preview?: boolean;
  /** Forwarded to the <article> (used for the reading-progress bar). */
  articleRef?: Ref<HTMLElement>;
  children?: ReactNode;
}

/**
 * The full editorial article layout. Used by the public story page and,
 * unchanged, by the admin's live preview — so "what you preview is what
 * readers get".
 */
export function ArticleView({
  post,
  backHref,
  preview = false,
  articleRef,
  children,
}: ArticleViewProps) {
  const date = postDate({
    publishedDate: post.publishedDate,
    createdAt: post.createdAt,
  });
  const category = post.category || "Uncategorised";
  const tags = post.tags ?? [];

  return (
    <article className="np-article" ref={articleRef} aria-labelledby="np-article-title">
      <div className="np-article-wrap">
        <div className="np-rule-thick" aria-hidden="true" />
        <div className="np-crumb np-label">
          {backHref ? (
            <Link href={backHref}>
              <ArrowLeft size={14} aria-hidden="true" /> Back to Blogs
            </Link>
          ) : (
            <span>{PUBLICATION.name}</span>
          )}
          {!preview && <EditionToggle />}
        </div>

        <header className="np-art-head">
          {preview ? (
            <span className="np-kicker">{category}</span>
          ) : (
            <Link
              href={`/blog?category=${categorySlug(category)}`}
              className="np-kicker"
            >
              {category}
            </Link>
          )}
          <h1 id="np-article-title" className="np-art-title">
            {post.title || "Untitled story"}
          </h1>
          {post.subtitle && <p className="np-deck">{post.subtitle}</p>}

          <div className="np-byline">
            <div className="np-author-line">
              <span className="np-avatar" aria-hidden="true">
                {post.author?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.author.avatar} alt="" />
                ) : (
                  initials(post.author?.name ?? "")
                )}
              </span>
              <div>
                <div className="np-author-name">
                  By {post.author?.name || "E-Cell Editorial"}
                </div>
                <div className="np-meta">
                  {date && <time dateTime={isoDate(date)}>{formatDate(date, "long")}</time>}
                  <span>{post.readTime || 1} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <figure className="np-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizedUrl(post.featuredImage, 1600)}
              srcSet={buildSrcSet(post.featuredImage, post.featuredImageWidth, [768, 1080, 1600, 2000])}
              sizes="(min-width: 1100px) 66rem, 100vw"
              alt={post.featuredImageAlt || ""}
              width={post.featuredImageWidth || undefined}
              height={post.featuredImageHeight || undefined}
              loading="eager"
              decoding="async"
              {...{ fetchPriority: "high" }}
            />
            {post.featuredImageCaption && (
              <figcaption className="np-caption">{post.featuredImageCaption}</figcaption>
            )}
          </figure>
        )}

        <ArticleBody post={post} />

        <footer className="np-foot">
          {tags.length > 0 && (
            <div className="np-tags" aria-label="Tags">
              {tags.map((t) =>
                preview ? (
                  <span key={t} className="np-tag">
                    {t}
                  </span>
                ) : (
                  <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="np-tag">
                    {t}
                  </Link>
                )
              )}
            </div>
          )}

          <ShareBar title={post.title} disabled={preview} label="Share this story" />

          {post.author?.name && (
            <div className="np-author-box">
              <span className="np-avatar" aria-hidden="true">
                {post.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.author.avatar} alt="" />
                ) : (
                  initials(post.author.name)
                )}
              </span>
              <div>
                <div className="np-label" style={{ color: "var(--np-muted)" }}>
                  About the author
                </div>
                <div className="np-author-name">{post.author.name}</div>
                <p>{post.author.bio || "Contributing writer at E-Cell IPS Academy."}</p>
              </div>
            </div>
          )}

          {backHref && (
            <p style={{ marginTop: "2rem" }}>
              <Link href={backHref} className="np-btn np-btn--ghost">
                <ArrowLeft size={14} aria-hidden="true" /> Back to Blogs
              </Link>
            </p>
          )}
        </footer>
        {children}
      </div>
    </article>
  );
}
