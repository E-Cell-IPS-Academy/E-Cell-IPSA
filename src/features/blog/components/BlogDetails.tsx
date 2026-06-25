import { Badge } from "@/shared/ui";
import { BlogStatusBadge } from "./BlogStatusBadge";
import type { BlogPost } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

/** Read-only details view for a blog post (shown in the modal). */
export function BlogDetails({ blog }: { blog: BlogPost }) {
  return (
    <div className="space-y-6">
      {blog.featuredImage && (
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="h-56 w-full rounded-lg object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <BlogStatusBadge status={blog.status} />
        {blog.isFeature && <Badge tone="info">Featured</Badge>}
        {blog.category && <Badge>{blog.category}</Badge>}
      </div>

      <p className="text-sm text-slate-600">{blog.excerpt}</p>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Author" value={blog.author?.name ?? ""} />
        <Field
          label="Published date"
          value={
            blog.publishedDate
              ? new Date(blog.publishedDate).toLocaleDateString()
              : "Not published"
          }
        />
        <Field label="Read time" value={`${blog.readTime || 0} min`} />
        <Field label="Views" value={`${blog.viewCount}`} />
        <Field label="Slug" value={blog.slug} />
        <Field label="SEO title" value={blog.seoTitle ?? ""} />
      </dl>

      {blog.seoDescription && (
        <Field label="SEO description" value={blog.seoDescription} />
      )}

      {blog.tags && blog.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => (
              <Badge key={tag} tone="info">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Content preview
        </p>
        <div
          className="prose prose-sm max-w-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
