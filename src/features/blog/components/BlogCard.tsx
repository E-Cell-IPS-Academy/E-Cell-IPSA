import { Calendar, Edit, Eye, FileText, Trash2, User } from "lucide-react";
import { Button, Card } from "@/shared/ui";
import { BlogStatusBadge } from "./BlogStatusBadge";
import type { BlogPost } from "../types";

interface BlogCardProps {
  blog: BlogPost;
  onView: (blog: BlogPost) => void;
  onEdit: (blog: BlogPost) => void;
  onDelete: (blog: BlogPost) => void;
}

/** Single blog post tile for the admin grid. */
export function BlogCard({ blog, onView, onEdit, onDelete }: BlogCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-slate-100">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <FileText className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <BlogStatusBadge status={blog.status} />
        </div>
        {blog.isFeature && (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          {blog.category && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {blog.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {blog.publishedDate
              ? new Date(blog.publishedDate).toLocaleDateString()
              : "Unpublished"}
          </span>
        </div>

        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
          {blog.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {blog.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            <span className="line-clamp-1">{blog.author?.name || "—"}</span>
          </div>
          <span className="text-xs text-slate-400">
            {blog.readTime || 0} min · {blog.viewCount} views
          </span>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => onView(blog)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(blog)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(blog)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
