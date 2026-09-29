"use client";

import { useState } from "react";
import type { BlogPost } from "../../types";
import { StoryRow } from "./StoryCards";

const PAGE_SIZE = 6;

/** Chronological feed with a "Load more" pager. Remount (key) to reset. */
export function LatestFeed({
  posts,
  heading,
  headingId = "np-latest",
}: {
  posts: BlogPost[];
  heading: string;
  headingId?: string;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = posts.slice(0, visible);
  const remaining = posts.length - shown.length;

  return (
    <section aria-labelledby={headingId}>
      <div className="np-section-title" style={{ marginTop: 0 }}>
        <h2 id={headingId}>{heading}</h2>
      </div>
      <div>
        {shown.map((p) => (
          <StoryRow key={p.id} post={p} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "2rem" }} aria-live="polite">
        {remaining > 0 ? (
          <button
            type="button"
            className="np-btn np-btn--ghost"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load more stories ({remaining} remaining)
          </button>
        ) : (
          posts.length > PAGE_SIZE && (
            <p className="np-meta" style={{ justifyContent: "center" }}>
              You&apos;ve reached the end
            </p>
          )
        )}
      </div>
    </section>
  );
}
