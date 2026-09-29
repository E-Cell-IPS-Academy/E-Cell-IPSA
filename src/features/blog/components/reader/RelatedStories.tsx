import type { BlogPost } from "../../types";
import { StoryCard } from "../public/StoryCards";

/** "More from the Chronicle" — three related stories at the end of an article. */
export function RelatedStories({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="np-related" aria-labelledby="np-related-title">
      <div className="np-rule-double" aria-hidden="true" />
      <div className="np-section-title" style={{ marginTop: "1.5rem" }}>
        <h2 id="np-related-title">Related Stories</h2>
      </div>
      <div className="np-related-grid">
        {posts.map((p) => (
          <StoryCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
