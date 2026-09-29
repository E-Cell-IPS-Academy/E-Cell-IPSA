"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useAdminBlogs } from "./hooks/useAdminBlogs";
import { BlogCard } from "./components/BlogCard";
import { BlogEditor } from "./components/editor/BlogEditor";
import { BlogDetails } from "./components/BlogDetails";
import { BLOG_STATUSES } from "./types";
import type { BlogPost } from "./types";
import { validatePublish } from "./lib/validation";
import { todayISO } from "./lib/format";

/** list = the grid of posts; editor = full-page block editor; view = details modal. */
type Mode = "list" | "editor" | "view";

const STAT_CARDS = [
  { key: "total", label: "Total" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
  { key: "totalViews", label: "Views" },
] as const;

export function BlogAdminPage() {
  const { blogs, loading, stats, create, update, remove, changeStatus } = useAdminBlogs();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(term) ||
        b.excerpt.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const backToList = () => {
    setMode("list");
    setSelected(null);
  };

  /** Publish / unpublish straight from the list (publishing re-checks the required fields). */
  const toggleStatus = async (blog: BlogPost) => {
    try {
      if (blog.status === "published") {
        await changeStatus(blog.id, "draft");
        toast.success("Story unpublished");
        return;
      }
      const problems = validatePublish(blog);
      if (Object.keys(problems).length) {
        toast.error(`Open the editor to finish this story first: ${Object.values(problems).join(" ")}`);
        return;
      }
      await update(blog.id, { status: "published", publishedDate: blog.publishedDate || todayISO() });
      toast.success("Story published");
    } catch {
      toast.error("Could not change the story status");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("Blog post deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete blog post");
    } finally {
      setDeleting(false);
    }
  };

  if (mode === "editor") {
    return (
      // key: opening a different post (or "new") always starts from a clean editor
      <BlogEditor key={selected?.id ?? "new"} post={selected} onClose={backToList} create={create} update={update} />
    );
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Create, edit, and manage blog posts."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelected(null);
              setMode("editor");
            }}
          >
            Create post
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-4">
            <p className="text-2xl font-semibold text-slate-900">
              {stats[card.key]}
            </p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search blog posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {BLOG_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No blog posts found"
          description="Try adjusting your search, or create your first post."
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelected(null);
                setMode("editor");
              }}
            >
              Create post
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onView={(b) => {
                setSelected(b);
                setMode("view");
              }}
              onEdit={(b) => {
                setSelected(b);
                setMode("editor");
              }}
              onToggleStatus={toggleStatus}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={mode === "view"}
        onClose={backToList}
        size="lg"
        title={selected?.title ?? "Blog post details"}
      >
        {selected && <BlogDetails blog={selected} />}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete blog post"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
