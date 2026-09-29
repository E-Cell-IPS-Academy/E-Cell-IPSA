"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useBlogs } from "@/features/blog/hooks/useBlogs";
import { useBlogFilters } from "@/features/blog/hooks/useBlogFilters";
import {
  buildCategories,
  buildFrontPage,
  filterPosts,
  newestFirst,
  pickTrending,
} from "@/features/blog/lib/publication";
import { NewspaperRoot } from "@/features/blog/components/public/NewspaperRoot";
import { Masthead } from "@/features/blog/components/public/Masthead";
import { FeaturedStory } from "@/features/blog/components/public/StoryCards";
import { EditorialGrid } from "@/features/blog/components/public/EditorialGrid";
import { LatestFeed } from "@/features/blog/components/public/LatestFeed";
import { Sidebar } from "@/features/blog/components/public/Sidebar";
import {
  ListingSkeleton,
  StateMessage,
} from "@/features/blog/components/public/States";
import { cn } from "@/shared/lib/cn";

/** Public blog landing page — /blog */
export default function BlogListing() {
  return (
    <Suspense
      fallback={
        <NewspaperRoot page>
          <div className="np-container">
            <ListingSkeleton />
          </div>
        </NewspaperRoot>
      }
    >
      <RetryBoundary />
    </Suspense>
  );
}

/** Remounts the data hook on retry so the Firestore listener restarts. */
function RetryBoundary() {
  const [attempt, setAttempt] = useState(0);
  return (
    <Listing key={attempt} onRetry={() => setAttempt((n) => n + 1)} />
  );
}

function Listing({ onRetry }: { onRetry: () => void }) {
  const { data: posts, loading, error } = useBlogs();
  const filters = useBlogFilters();
  const { category, tag, query, setQuery, clear, isFiltering } = filters;

  const categories = useMemo(() => buildCategories(posts), [posts]);
  const front = useMemo(() => buildFrontPage(posts), [posts]);
  const trending = useMemo(() => pickTrending(posts, 5), [posts]);
  const recent = useMemo(() => newestFirst(posts).slice(0, 4), [posts]);
  const results = useMemo(
    () => newestFirst(filterPosts(posts, { category, query, tag })),
    [posts, category, query, tag]
  );

  const activeName = categories.find((c) => c.slug === category)?.name;
  const resultsHeading = query.trim()
    ? `Results for “${query.trim()}”`
    : tag
      ? `Tagged “${tag}”`
      : (activeName ?? "Stories");

  let body;
  if (loading) {
    body = <ListingSkeleton />;
  } else if (error) {
    body = (
      <StateMessage
        role="alert"
        title="We couldn’t load the stories"
        message="Something went wrong while fetching the latest articles. Please check your connection and try again."
        action={
          <button type="button" className="np-btn" onClick={onRetry}>
            Try again
          </button>
        }
      />
    );
  } else if (posts.length === 0) {
    body = (
      <StateMessage
        role="status"
        title="The presses are warming up"
        message="No stories have been published yet. Check back soon for insights from the E-Cell community."
      />
    );
  } else if (isFiltering) {
    body = (
      <div className="np-main" style={{ marginTop: "2rem" }}>
        <div>
          {results.length > 0 ? (
            <LatestFeed
              // Reset "Load more" whenever the result set changes.
              key={`${category}|${tag}|${query}`}
              posts={results}
              heading={`${resultsHeading} (${results.length})`}
              headingId="np-results"
            />
          ) : (
            <StateMessage
              role="status"
              title="No stories found"
              message="Nothing matches your search or filter. Try a different keyword or browse all stories."
              action={
                <button type="button" className="np-btn np-btn--ghost" onClick={clear}>
                  Clear filters
                </button>
              }
            />
          )}
        </div>
        <Sidebar trending={trending} topics={categories} recent={recent} />
      </div>
    );
  } else {
    body = (
      <>
        {front.lead && <FeaturedStory post={front.lead} />}
        <EditorialGrid posts={front.grid} />
        <div
          className={cn("np-main", front.rest.length === 0 && "np-main--solo")}
          style={{ marginTop: "3rem" }}
        >
          {front.rest.length > 0 && (
            <LatestFeed posts={front.rest} heading="Latest Articles" />
          )}
          <Sidebar trending={trending} topics={categories} recent={recent} />
        </div>
      </>
    );
  }

  return (
    <NewspaperRoot page id="main-content">
      <div className="np-container">
        <Masthead
          categories={categories}
          activeCategory={category}
          query={query}
          onQuery={setQuery}
        />
        {isFiltering && !loading && !error && (
          <p className="np-meta" style={{ marginTop: "1rem" }}>
            <Link href="/blog" scroll={false} onClick={clear}>
              ← Front page
            </Link>
          </p>
        )}
        {body}
      </div>
    </NewspaperRoot>
  );
}
