"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { BlogFormValues, BlogImage, ContentBlock } from "../../types";
import { BLOG_CATEGORIES, BLOG_STATUSES } from "../../types";
import type { FieldErrors } from "../../lib/validation";
import type { PendingUpload } from "../../hooks/useImageUploads";
import { cn } from "@/shared/lib/cn";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { MediaPanel } from "./MediaPanel";
import { TagInput } from "./TagInput";

type Tab = "details" | "images" | "seo";

interface SettingsPanelProps {
  values: BlogFormValues;
  isNew: boolean;
  errors: FieldErrors;
  blocks: ContentBlock[];
  media: BlogImage[];
  pending: PendingUpload[];
  onChange: (patch: Partial<BlogFormValues>) => void;
  onSlugEdited: () => void;
  onGenerateExcerpt: () => void;
  onUploadMedia: (files: File[]) => void;
  onInsertImage: (image: BlogImage) => void;
  onUseAsCover: (image: BlogImage) => void;
  onRemoveMedia: (image: BlogImage) => void;
  /** Lets the editor jump to a tab when validation fails. */
  tab: Tab;
  onTab: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "images", label: "Images" },
  { id: "seo", label: "SEO" },
];

export type { Tab as SettingsTab };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 border-t border-slate-100 pt-4 first:border-0 first:pt-0">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Right-hand sidebar: publishing details, image library and SEO. */
export function SettingsPanel(props: SettingsPanelProps) {
  const { values, isNew, errors, onChange, tab, onTab } = props;
  const [advancedAuthor, setAdvancedAuthor] = useState(false);
  const categories = values.category && !BLOG_CATEGORIES.includes(values.category)
    ? [values.category, ...BLOG_CATEGORIES]
    : BLOG_CATEGORIES;

  const setAuthor = (field: "name" | "email" | "bio", value: string) =>
    onChange({ author: { ...values.author, [field]: value } });

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div role="tablist" aria-label="Post settings" className="flex border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => onTab(t.id)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
              tab === t.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            {t.label}
            {t.id === "images" && props.media.length > 0 && (
              <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{props.media.length}</span>
            )}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="space-y-5 p-4">
        {tab === "details" && (
          <>
            <Section title="Publishing">
              <Select label="Status" value={values.status} onChange={(e) => onChange({ status: e.target.value as BlogFormValues["status"] })}>
                {BLOG_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
              <Input
                label="Publish date"
                type="date"
                value={values.publishedDate ?? ""}
                onChange={(e) => onChange({ publishedDate: e.target.value })}
                hint="Leave empty to use today's date when you publish."
              />
              <label className="flex items-start gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={values.isFeature}
                  onChange={(e) => onChange({ isFeature: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  Feature this story
                  <span className="block text-xs text-slate-500">Shown as the lead story on the blog page.</span>
                </span>
              </label>
            </Section>

            <Section title="Classification">
              <Select label="Category" value={values.category} error={errors.category} onChange={(e) => onChange({ category: e.target.value })}>
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <TagInput tags={values.tags} onChange={(tags) => onChange({ tags })} />
            </Section>

            <Section title="Summary & URL">
              <div>
                <Textarea
                  label="Summary (excerpt)"
                  rows={4}
                  maxLength={300}
                  value={values.excerpt}
                  error={errors.excerpt}
                  onChange={(e) => onChange({ excerpt: e.target.value })}
                  hint={`${values.excerpt.length}/300 — appears on story cards and in search results.`}
                />
                <Button size="sm" variant="ghost" className="mt-1" onClick={props.onGenerateExcerpt}>
                  Generate from article
                </Button>
              </div>
              <Input
                label="URL slug"
                value={values.slug}
                error={errors.slug}
                onChange={(e) => {
                  props.onSlugEdited();
                  onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") });
                }}
                hint={
                  !isNew && values.status === "published"
                    ? "Live post — changing this breaks existing links to it."
                    : `Public address: /blog/${values.slug || "your-slug"}`
                }
              />
            </Section>

            <Section title="Author">
              <Input label="Author name" value={values.author.name} error={errors.author} onChange={(e) => setAuthor("name", e.target.value)} placeholder="Full name" />
              <Input label="Author email" type="email" value={values.author.email} onChange={(e) => setAuthor("email", e.target.value)} placeholder="Optional — not shown publicly" />
              {advancedAuthor || values.author.bio ? (
                <Textarea label="Author bio" rows={3} value={values.author.bio ?? ""} onChange={(e) => setAuthor("bio", e.target.value)} hint="Shown in the “About the author” box." />
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setAdvancedAuthor(true)}>+ Add author bio</Button>
              )}
            </Section>
          </>
        )}

        {tab === "images" && (
          <MediaPanel
            media={props.media}
            blocks={props.blocks}
            pending={props.pending}
            onUpload={props.onUploadMedia}
            onInsert={props.onInsertImage}
            onUseAsCover={props.onUseAsCover}
            onRemove={props.onRemoveMedia}
          />
        )}

        {tab === "seo" && (
          <>
            <Input
              label="SEO title"
              value={values.seoTitle ?? ""}
              maxLength={70}
              onChange={(e) => onChange({ seoTitle: e.target.value })}
              hint={`${(values.seoTitle ?? "").length}/70 — defaults to the story title.`}
            />
            <Textarea
              label="SEO description"
              rows={3}
              maxLength={170}
              value={values.seoDescription ?? ""}
              onChange={(e) => onChange({ seoDescription: e.target.value })}
              hint={`${(values.seoDescription ?? "").length}/170 — defaults to the summary.`}
            />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Search preview</p>
              <p className="mt-1 truncate text-base text-indigo-700">{values.seoTitle || values.title || "Story title"}</p>
              <p className="truncate text-xs text-emerald-700">/blog/{values.slug || "your-slug"}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{values.seoDescription || values.excerpt || "Story summary appears here."}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
