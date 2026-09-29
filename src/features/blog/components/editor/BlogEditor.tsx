"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { ConfirmDialog } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import type { BlogFormValues, BlogImage, BlogPost, BlogStatus, ContentBlock } from "../../types";
import { EMPTY_BLOG, generateSlug } from "../../types";
import {
  collectImages,
  createBlock,
  galleryBlockFrom,
  hasBlocks,
  imageBlockFrom,
  imagesMissingAlt,
  isBlockEmpty,
  blocksToPlainText,
} from "../../lib/blocks";
import { htmlToBlocks, normalizeBlocks } from "../../lib/legacy";
import { todayISO } from "../../lib/format";
import { summarize } from "../../lib/publication";
import { validateDraft, validatePublish } from "../../lib/validation";
import type { FieldErrors } from "../../lib/validation";
import { isSlugTaken } from "../../blogService";
import { useBlockEditor } from "../../hooks/useBlockEditor";
import { useImageUploads } from "../../hooks/useImageUploads";
import { AutoTextarea } from "./AutoTextarea";
import { BlockCanvas } from "./BlockCanvas";
import { CoverImageField, coverFromImage } from "./CoverImageField";
import type { CoverValues } from "./CoverImageField";
import { EditorProvider } from "./EditorContext";
import { EditorTopBar } from "./EditorTopBar";
import type { EditorMode, PreviewDevice } from "./EditorTopBar";
import { PreviewPane } from "./PreviewPane";
import { SettingsPanel } from "./SettingsPanel";
import type { SettingsTab } from "./SettingsPanel";

/** Form state minus the two collections managed separately (blocks, media). */
type EditorValues = Omit<BlogFormValues, "blocks" | "media">;

interface BlogEditorProps {
  /** The post being edited, or null to write a new one. */
  post: BlogPost | null;
  onClose: () => void;
  create: (values: BlogFormValues) => Promise<string>;
  update: (id: string, values: Partial<BlogFormValues>) => Promise<void>;
}

const mergeMedia = (...lists: BlogImage[][]): BlogImage[] => {
  const seen = new Map<string, BlogImage>();
  for (const img of lists.flat()) if (img.src && !seen.has(img.src)) seen.set(img.src, img);
  return [...seen.values()];
};

/** Build the editor's starting state; converts legacy HTML posts into blocks. */
function initialState(post: BlogPost | null) {
  if (!post) {
    const { blocks: _blocks, media: _media, ...values } = EMPTY_BLOG;
    void _blocks; void _media;
    return { values: values as EditorValues, blocks: [createBlock("paragraph")], media: [] as BlogImage[], converted: false };
  }

  let blocks: ContentBlock[] = hasBlocks(post) ? normalizeBlocks(post.blocks) : htmlToBlocks(post.content ?? "");
  const converted = blocks.length === 0 && !!post.content?.trim();
  if (converted) blocks = htmlToBlocks(post.content ?? "");
  if (converted && blocks.length === 0) {
    const text = (post.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    blocks = text ? [{ ...createBlock("paragraph"), text } as ContentBlock] : [];
  }
  if (blocks.length === 0) blocks = [createBlock("paragraph")];

  const values: EditorValues = {
    title: post.title,
    subtitle: post.subtitle ?? "",
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    legacyContent: converted ? (post.legacyContent ?? post.content) : (post.legacyContent ?? ""),
    featuredImage: post.featuredImage ?? "",
    featuredImagePublicId: post.featuredImagePublicId ?? "",
    featuredImageAlt: post.featuredImageAlt ?? "",
    featuredImageCaption: post.featuredImageCaption ?? "",
    featuredImageWidth: post.featuredImageWidth ?? 0,
    featuredImageHeight: post.featuredImageHeight ?? 0,
    status: post.status,
    category: post.category,
    tags: post.tags ?? [],
    author: { name: post.author?.name ?? "", email: post.author?.email ?? "", bio: post.author?.bio ?? "" },
    publishedDate: post.publishedDate ?? "",
    readTime: post.readTime,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    isFeature: post.isFeature,
    viewCount: post.viewCount ?? 0,
  };
  return { values, blocks, media: mergeMedia(post.media ?? [], collectImages(blocks)), converted };
}

/** Full-page article editor (replaces the old raw-HTML modal form). */
export function BlogEditor({ post, onClose, create, update }: BlogEditorProps) {
  const toast = useToast();
  const [init] = useState(() => initialState(post));

  const [values, setValues] = useState<EditorValues>(init.values);
  const [media, setMedia] = useState<BlogImage[]>(init.media);
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const editor = useBlockEditor(init.blocks);
  const { blocks } = editor;

  const [mode, setMode] = useState<EditorMode>("edit");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [tab, setTab] = useState<SettingsTab>("details");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [showConverted, setShowConverted] = useState(init.converted);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const notifyError = useCallback((m: string) => toast.error(m), [toast]);
  const { uploadFiles, pending, uploading } = useImageUploads(notifyError);

  /* --------------------------- dirty tracking --------------------------- */
  const serialized = useMemo(() => JSON.stringify({ values, blocks, media }), [values, blocks, media]);
  const [baseline, setBaseline] = useState(serialized);
  const dirty = serialized !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ------------------------------ field edits ------------------------------ */
  const patch = useCallback((p: Partial<EditorValues>) => {
    setValues((v) => ({ ...v, ...p }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(p)) delete next[key as keyof FieldErrors];
      return next;
    });
  }, []);

  const onTitle = (title: string) =>
    setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : generateSlug(title) }));

  const addMedia = useCallback((images: BlogImage[]) => setMedia((m) => mergeMedia(m, images)), []);

  /* ------------------------------ block actions ---------------------------- */
  const reveal = (id: string) =>
    setTimeout(() => document.querySelector(`[data-block-id="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 60);

  const insertAt = (index: number, block: ContentBlock) => {
    editor.insert(index, block);
    setSelectedId(block.id);
    reveal(block.id);
  };

  const insertAfterSelected = (block: ContentBlock) => {
    const i = selectedId ? blocks.findIndex((b) => b.id === selectedId) : -1;
    insertAt(i >= 0 ? i + 1 : blocks.length, block);
  };

  const removeBlock = (id: string) => {
    const b = blocks.find((x) => x.id === id);
    editor.remove(id);
    if (b && !isBlockEmpty(b)) toast.info("Block deleted — press Undo in the toolbar to bring it back.");
  };

  const handleFilesDropped = async (files: File[], index: number) => {
    const images = await uploadFiles(files);
    if (!images.length) return;
    addMedia(images);
    insertAt(index, images.length === 1 ? imageBlockFrom(images[0]) : galleryBlockFrom(images));
    toast.success(images.length === 1 ? "Image added — remember its alt text and caption." : `${images.length} images added as a gallery.`);
  };

  const uploadToLibrary = async (files: File[]) => {
    const images = await uploadFiles(files);
    if (!images.length) return;
    addMedia(images);
    toast.success(`${images.length} image${images.length === 1 ? "" : "s"} uploaded — use Insert to place them in the story.`);
  };

  /* --------------------------------- saving -------------------------------- */
  const uniqueSlug = async (base: string, excludeId: string | null): Promise<string | null> => {
    for (let n = 1; n <= 10; n++) {
      const candidate = n === 1 ? base : `${base}-${n}`;
      if (!(await isSlugTaken(candidate, excludeId ?? undefined))) return candidate;
      if (slugTouched) return null; // the author chose this slug on purpose
    }
    return null;
  };

  const persist = async (status: BlogStatus): Promise<boolean> => {
    if (saving) return false;
    const cleaned = blocks.filter((b) => !isBlockEmpty(b));
    let slug = values.slug.trim() || generateSlug(values.title) || `story-${Date.now().toString(36)}`;
    const candidate = { ...values, slug, status, blocks: cleaned };

    const found = status === "published" ? validatePublish(candidate) : validateDraft(candidate);
    if (Object.keys(found).length) {
      setErrors(found);
      if (found.category || found.excerpt || found.slug || found.author) setTab("details");
      toast.error(`${status === "published" ? "Can’t publish yet" : "Can’t save yet"}: ${Object.values(found).join(" ")}`);
      return false;
    }

    setSaving(true);
    try {
      const free = await uniqueSlug(slug, postId);
      if (!free) {
        setErrors({ slug: "That URL is already used by another story. Choose a different slug." });
        setTab("details");
        toast.error("That URL slug is already used by another story.");
        return false;
      }
      slug = free;

      const publishedDate = status === "published" && !values.publishedDate ? todayISO() : values.publishedDate;
      const payload: BlogFormValues = { ...values, slug, status, publishedDate, blocks: cleaned, media };

      if (postId) await update(postId, payload);
      else setPostId(await create(payload));

      const nextValues = { ...values, slug, status, publishedDate };
      setValues(nextValues);
      setBaseline(JSON.stringify({ values: nextValues, blocks, media }));
      setErrors({});
      toast.success(
        status === "published" ? (values.status === "published" ? "Changes saved" : "Story published") : status === "draft" && values.status === "published" ? "Story unpublished — saved as draft" : "Draft saved"
      );
      return true;
    } catch (err) {
      toast.error(`Could not save the story${err instanceof Error ? `: ${err.message}` : "."}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/⌘+S saves; the ref keeps the handler pointed at the latest state.
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void persistRef.current(valuesRef.current.status);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  /* --------------------------------- render -------------------------------- */
  const fullValues: BlogFormValues = { ...values, blocks, media };
  const missingAlt = imagesMissingAlt(blocks) + (values.featuredImage && !values.featuredImageAlt?.trim() ? 1 : 0);
  const cover: CoverValues = values;

  return (
    <EditorProvider value={{ uploadFiles, media, addMedia, notify: notifyError }}>
      <div className="pb-16">
        <EditorTopBar
          status={values.status}
          dirty={dirty}
          saving={saving}
          isNew={!postId}
          uploading={uploading}
          canUndo={editor.canUndo}
          mode={mode}
          device={device}
          liveHref={postId && values.status === "published" && values.slug ? `/blog/${values.slug}` : null}
          onBack={() => (dirty ? setConfirmLeave(true) : onClose())}
          onUndo={editor.undo}
          onMode={setMode}
          onDevice={setDevice}
          onSave={() => void persist(values.status)}
          onPublish={() => void persist("published")}
          onUnpublish={() => void persist("draft")}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="min-w-0 space-y-5">
            {showConverted && (
              <div role="note" className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="flex-1">
                  This story was written in the old HTML editor, so it has been converted into blocks. Please look it over before saving — the original HTML is kept as a backup.
                </p>
                <button type="button" aria-label="Dismiss notice" onClick={() => setShowConverted(false)} className="rounded p-0.5 hover:bg-indigo-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {mode === "preview" ? (
              <PreviewPane values={fullValues} device={device} />
            ) : (
              <>
                {missingAlt > 0 && (
                  <div role="status" className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {missingAlt} image{missingAlt === 1 ? " is" : "s are"} missing alternative text. Add it for accessibility (optional — you can still publish).
                  </div>
                )}
                {pending.length > 0 && (
                  <div role="status" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    Uploading {pending.length} image{pending.length === 1 ? "" : "s"}…{" "}
                    {Math.round(pending.reduce((s, p) => s + p.progress, 0) / pending.length)}%
                  </div>
                )}

                <CoverImageField value={cover} onChange={(p) => patch(p)} />

                <div>
                  <label htmlFor="story-title" className="sr-only">Headline</label>
                  <AutoTextarea
                    id="story-title"
                    value={values.title}
                    onChange={(e) => onTitle(e.target.value.replace(/\n/g, " "))}
                    placeholder="Story headline"
                    aria-invalid={!!errors.title}
                    className="w-full resize-none overflow-hidden border-0 bg-transparent px-0 font-serif text-3xl font-extrabold leading-tight text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-0 sm:text-4xl"
                  />
                  {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                  <label htmlFor="story-subtitle" className="sr-only">Subtitle</label>
                  <AutoTextarea
                    id="story-subtitle"
                    value={values.subtitle ?? ""}
                    onChange={(e) => patch({ subtitle: e.target.value.replace(/\n/g, " ") })}
                    placeholder="Subtitle or standfirst (optional)"
                    className="mt-1 w-full resize-none overflow-hidden border-0 bg-transparent px-0 font-serif text-lg italic leading-snug text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-0"
                  />
                </div>

                {errors.content && <p role="alert" className="text-sm text-red-600">{errors.content}</p>}

                <BlockCanvas
                  blocks={blocks}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onInsert={insertAt}
                  onReplace={editor.replace}
                  onRemove={removeBlock}
                  onMove={(id, to) => editor.move(id, Math.max(0, Math.min(to, blocks.length - 1)))}
                  onDuplicate={editor.duplicate}
                  onFilesDropped={handleFilesDropped}
                />
              </>
            )}
          </div>

          <aside aria-label="Story settings" className="min-w-0 lg:sticky lg:top-36 lg:self-start">
            <SettingsPanel
              values={fullValues}
              isNew={!postId}
              errors={errors}
              blocks={blocks}
              media={media}
              pending={pending}
              tab={tab}
              onTab={setTab}
              onChange={patch}
              onSlugEdited={() => setSlugTouched(true)}
              onGenerateExcerpt={() => patch({ excerpt: summarize(blocksToPlainText(blocks), 200) })}
              onUploadMedia={uploadToLibrary}
              onInsertImage={(img) => insertAfterSelected(imageBlockFrom(img))}
              onUseAsCover={(img) => patch(coverFromImage(img))}
              onRemoveMedia={(img) => setMedia((m) => m.filter((x) => x.src !== img.src))}
            />
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        title="Discard unsaved changes?"
        message="You have changes that haven’t been saved. If you leave now they will be lost."
        confirmLabel="Discard changes"
        destructive
        onConfirm={onClose}
        onCancel={() => setConfirmLeave(false)}
      />
    </EditorProvider>
  );
}