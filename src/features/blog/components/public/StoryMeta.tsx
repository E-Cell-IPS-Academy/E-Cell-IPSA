import type { BlogPost } from "../../types";
import { formatDate, isoDate, postDate } from "../../lib/format";

/** Dateline-style metadata: author · date · reading time. */
export function StoryMeta({
  post,
  author = true,
  readTime = true,
}: {
  post: BlogPost;
  author?: boolean;
  readTime?: boolean;
}) {
  const date = postDate(post);
  return (
    <div className="np-meta">
      {author && post.author?.name && (
        <span className="np-meta-author">{post.author.name}</span>
      )}
      {date && (
        <time className="np-meta-date" dateTime={isoDate(date)}>
          {formatDate(date)}
        </time>
      )}
      {readTime && (
        <span className="np-meta-read">{post.readTime || 1} min read</span>
      )}
    </div>
  );
}
