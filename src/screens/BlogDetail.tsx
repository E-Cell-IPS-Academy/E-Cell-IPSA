"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBlog, useBlogs } from "@/features/blog/hooks/useBlogs";
import { recordView } from "@/features/blog/blogService";
import { pickRelated, summarize } from "@/features/blog/lib/publication";
import { PUBLICATION } from "@/features/blog/lib/format";
import { NewspaperRoot } from "@/features/blog/components/public/NewspaperRoot";
import {
  ArticleSkeleton,
  StateMessage,
} from "@/features/blog/components/public/States";
import { ArticleView } from "@/features/blog/components/reader/ArticleView";
import { ReadingProgress } from "@/features/blog/components/reader/ReadingProgress";
import { RelatedStories } from "@/features/blog/components/reader/RelatedStories";

/** Public story page — /blog/[slug] */
export default function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ? decodeURIComponent(params.slug) : "";
  const { data: matches, loading, error } = useBlog(slug);
  const { data: allPosts } = useBlogs();
  const articleRef = useRef<HTMLElement>(null);

  const post = matches[0] ?? null;
  const related = useMemo(
    () => (post ? pickRelated(allPosts, post, 3) : []),
    [allPosts, post]
  );

  useEffect(() => {
    if (!post) return;
    document.title = `${post.seoTitle || post.title} | ${PUBLICATION.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", post.seoDescription || summarize(post.excerpt));
    void recordView(post.id);
  }, [post]);

  let content;
  if (loading) {
    content = <ArticleSkeleton />;
  } else if (error) {
    content = (
      <StateMessage
        role="alert"
        title="We couldn’t load this story"
        message="Something went wrong while fetching the article. Please try again in a moment."
        action={
          <Link href="/blog" className="np-btn">
            Back to Blogs
          </Link>
        }
      />
    );
  } else if (!post) {
    content = (
      <StateMessage
        role="status"
        title="Story not found"
        message="This story may have been moved, unpublished or never existed."
        action={
          <Link href="/blog" className="np-btn">
            Back to Blogs
          </Link>
        }
      />
    );
  } else {
    content = (
      <>
        <ReadingProgress target={articleRef} />
        <ArticleView post={post} backHref="/blog" articleRef={articleRef} />
        <div className="np-container">
          <RelatedStories posts={related} />
        </div>
      </>
    );
  }

  return (
    <NewspaperRoot page id="main-content">
      {content}
    </NewspaperRoot>
  );
}
