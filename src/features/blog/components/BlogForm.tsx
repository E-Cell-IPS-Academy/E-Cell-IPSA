import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { BLOG_CATEGORIES, BLOG_STATUSES, generateSlug } from "../types";
import type { Author, BlogFormValues } from "../types";

interface BlogFormProps {
  initialValues: BlogFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: BlogFormValues) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

const csv = (list?: string[]) => (list ?? []).join(", ");
const fromCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** Create / edit form for a blog post. Owns its own field state. */
export function BlogForm({
  initialValues,
  submitLabel,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(initialValues);

  const setField = <K extends keyof BlogFormValues>(
    key: K,
    value: BlogFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const setAuthor = (field: keyof Author, value: string) =>
    setValues((prev) => ({
      ...prev,
      author: { ...prev.author, [field]: value },
    }));

  const handleTitle = (title: string) =>
    setValues((prev) => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : generateSlug(title),
    }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader
        label="Featured image"
        value={values.featuredImage}
        folder="blogs/featured"
        onUploaded={(url, publicId) => {
          setField("featuredImage", url);
          setField("featuredImagePublicId", publicId);
        }}
        onError={onError}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Title"
          value={values.title}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="Enter blog title"
          required
        />
        <Input
          label="Slug"
          value={values.slug}
          onChange={(e) => setField("slug", e.target.value)}
          placeholder="url-friendly-slug"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          label="Category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          required
        >
          <option value="">Select category</option>
          {BLOG_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          value={values.status}
          onChange={(e) =>
            setField("status", e.target.value as BlogFormValues["status"])
          }
        >
          {BLOG_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
        <Input
          label="Published date"
          type="date"
          value={values.publishedDate ?? ""}
          onChange={(e) => setField("publishedDate", e.target.value)}
        />
      </div>

      <Textarea
        label="Excerpt"
        rows={3}
        value={values.excerpt}
        onChange={(e) => setField("excerpt", e.target.value)}
        placeholder="Brief description of the blog post"
        required
      />

      <Textarea
        label="Content"
        rows={12}
        value={values.content}
        onChange={(e) => setField("content", e.target.value)}
        placeholder="Write the post content here. HTML is supported."
        hint="HTML is supported. Read time is calculated automatically."
        required
      />

      <div className="rounded-lg border border-slate-200 p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">
          Author information
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Author name"
            value={values.author.name}
            onChange={(e) => setAuthor("name", e.target.value)}
            placeholder="Author name"
            required
          />
          <Input
            label="Author email"
            type="email"
            value={values.author.email}
            onChange={(e) => setAuthor("email", e.target.value)}
            placeholder="author@example.com"
            required
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Author bio"
            rows={2}
            value={values.author.bio ?? ""}
            onChange={(e) => setAuthor("bio", e.target.value)}
            placeholder="Brief author bio"
          />
        </div>
      </div>

      <Input
        label="Tags (comma separated)"
        value={csv(values.tags)}
        onChange={(e) => setField("tags", fromCsv(e.target.value))}
        placeholder="startup, technology, innovation"
      />

      <div className="rounded-lg border border-slate-200 p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">SEO settings</p>
        <div className="space-y-4">
          <Input
            label="SEO title"
            value={values.seoTitle ?? ""}
            onChange={(e) => setField("seoTitle", e.target.value)}
            placeholder="SEO optimized title"
          />
          <Textarea
            label="SEO description"
            rows={2}
            value={values.seoDescription ?? ""}
            onChange={(e) => setField("seoDescription", e.target.value)}
            placeholder="SEO meta description"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.isFeature}
          onChange={(e) => setField("isFeature", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Mark as featured post
      </label>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
