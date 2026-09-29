import Link from "next/link";
import type { BlogPost } from "../../types";
import type { CategoryEntry } from "../../lib/publication";
import { formatDate, postDate, postHref } from "../../lib/format";

interface SidebarProps {
  trending: BlogPost[];
  topics: CategoryEntry[];
  recent: BlogPost[];
}

/**
 * Desktop: a sticky right rail. Mobile / tablet: the same three blocks stack
 * beneath the feed (see `.np-main` / `.np-aside` in the stylesheet).
 */
export function Sidebar({ trending, topics, recent }: SidebarProps) {
  const activeTopics = topics.filter((t) => t.count > 0);
  return (
    <aside className="np-aside" aria-label="More from the Chronicle">
      {trending.length > 0 && (
        <section className="np-side-block" aria-labelledby="np-trending">
          <h2 id="np-trending" className="np-side-title">
            Trending
          </h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {trending.map((p, i) => (
              <li key={p.id}>
                <Link href={postHref(p)} className="np-story np-trend">
                  <span className="np-trend-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <span className="np-kicker" style={{ display: "block" }}>
                      {p.category}
                    </span>
                    <span className="np-headline np-h-sm" style={{ display: "block" }}>
                      {p.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {activeTopics.length > 0 && (
        <section className="np-side-block" aria-labelledby="np-topics">
          <h2 id="np-topics" className="np-side-title">
            Popular topics
          </h2>
          <div>
            {activeTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/blog?category=${t.slug}`}
                scroll={false}
                className="np-topic"
              >
                <span>{t.name}</span>
                <span aria-label={`${t.count} stories`}>{t.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="np-side-block" aria-labelledby="np-recent">
          <h2 id="np-recent" className="np-side-title">
            Recently published
          </h2>
          {recent.map((p) => (
            <Link key={p.id} href={postHref(p)} className="np-story np-brief">
              <h3 className="np-headline np-h-sm">{p.title}</h3>
              <span className="np-meta">
                <span>{formatDate(postDate(p))}</span>
              </span>
            </Link>
          ))}
        </section>
      )}
    </aside>
  );
}
