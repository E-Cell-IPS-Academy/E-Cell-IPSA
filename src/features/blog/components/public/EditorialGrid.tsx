import type { BlogPost } from "../../types";
import { cn } from "@/shared/lib/cn";
import { BriefItem, StoryCard } from "./StoryCards";

/**
 * Newspaper-style "Top Stories" grid. Up to six posts are laid out as a large
 * lead, a column of two medium stories and an "In brief" headline list, with
 * hairline column rules. Degrades gracefully when there are fewer posts.
 */
export function EditorialGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;
  const mids = rest.slice(0, 2);
  const briefs = rest.slice(2, 5);

  return (
    <section aria-labelledby="np-top-stories">
      <div className="np-section-title">
        <h2 id="np-top-stories">Top Stories</h2>
      </div>
      <div
        className={cn(
          "np-grid",
          briefs.length === 0 && "np-grid--sparse",
          mids.length === 0 && "np-grid--solo"
        )}
      >
        <div className="np-grid-lead">
          <StoryCard post={lead} size="lead" />
        </div>
        {mids.length > 0 && (
          <div className="np-grid-mid">
            <div className="np-card-stack">
              {mids.map((p) => (
                <StoryCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
        {briefs.length > 0 && (
          <div className="np-grid-brief">
            <h3 className="np-side-title">In brief</h3>
            {briefs.map((p) => (
              <BriefItem key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
