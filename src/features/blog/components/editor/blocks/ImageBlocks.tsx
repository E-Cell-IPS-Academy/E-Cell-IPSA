"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Images, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import type { BlogImage, GalleryBlock, ImageBlock } from "../../../types";
import { optimizedUrl } from "../../../lib/imageUtils";
import { moveItem } from "../../../lib/blocks";
import { cn } from "@/shared/lib/cn";
import { Button, Spinner } from "@/shared/ui";
import { useEditor } from "../EditorContext";
import { IconBtn, Segmented, fieldClass } from "../controls";
import { dragHasFiles, imageFilesFrom } from "../dnd";
import { TrayPicker } from "../TrayPicker";

/** Warning shown until an image has alternative text. */
function AltHint({ missing }: { missing: boolean }) {
  return (
    <p className={cn("mt-1 text-xs", missing ? "text-amber-600" : "text-slate-500")}>
      {missing
        ? "Recommended: describe this image for readers who can't see it."
        : "Describes the image to screen readers and if it fails to load."}
    </p>
  );
}

/* ------------------------------ Drop zone ------------------------------- */

export function DropZone({
  busy,
  multiple,
  label,
  onFiles,
  onPickFromPost,
  hasMedia,
}: {
  busy: boolean;
  multiple: boolean;
  label: string;
  onFiles: (files: File[]) => void;
  onPickFromPost: () => void;
  hasMedia: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  // stopPropagation: dropping on THIS zone fills this block instead of
  // inserting a new block next to it (the block shell also handles file drops).
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const files = imageFilesFrom(e);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      onDragOver={(e) => {
        if (!dragHasFiles(e)) return;
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
        over ? "border-indigo-400 bg-indigo-50" : "border-slate-300 bg-slate-50"
      )}
    >
      {busy ? (
        <>
          <Spinner />
          <p className="text-sm text-slate-500">Uploading…</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-7 w-7 text-slate-500" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => input.current?.click()} leftIcon={<ImagePlus className="h-4 w-4" />}>
              Upload {multiple ? "images" : "image"}
            </Button>
            {hasMedia && (
              <Button size="sm" variant="ghost" onClick={onPickFromPost} leftIcon={<Images className="h-4 w-4" />}>
                Choose from this post
              </Button>
            )}
          </div>
        </>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        aria-label={multiple ? "Upload images" : "Upload image"}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

/* ------------------------------ Single image ---------------------------- */

export function ImageBlockEditor({ block, onChange }: { block: ImageBlock; onChange: (b: ImageBlock) => void }) {
  const { uploadFiles, media, addMedia } = useEditor();
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);
  const replaceInput = useRef<HTMLInputElement>(null);
  const img = block.image;

  const upload = async (files: File[]) => {
    setBusy(true);
    try {
      const [uploaded] = await uploadFiles(files.slice(0, 1));
      if (uploaded) {
        addMedia([uploaded]);
        // Keep any alt text / caption the author already wrote (e.g. when replacing).
        onChange({ ...block, image: { ...uploaded, alt: img.alt, caption: img.caption ?? "" } });
      }
    } finally {
      setBusy(false);
    }
  };

  const choose = ([picked]: BlogImage[]) => {
    if (picked) onChange({ ...block, image: { ...picked, alt: img.alt || picked.alt, caption: img.caption || picked.caption || "" } });
    setPicker(false);
  };

  if (!img.src) {
    return (
      <div className="space-y-3">
        <DropZone
          busy={busy}
          multiple={false}
          label="Drop an image here, or upload one"
          onFiles={upload}
          onPickFromPost={() => setPicker(true)}
          hasMedia={media.length > 0}
        />
        {picker && <TrayPicker media={media} onPick={choose} onClose={() => setPicker(false)} />}
      </div>
    );
  }

  const inline = block.size === "small" || block.size === "medium";

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div>
        <div className="relative overflow-hidden rounded-lg bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optimizedUrl(img.src, 600)}
            alt={img.alt || "Uploaded image preview"}
            width={img.width}
            height={img.height}
            className="mx-auto max-h-64 w-full object-contain"
          />
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Spinner />
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => replaceInput.current?.click()}>
            Replace
          </Button>
          {media.length > 1 && (
            <Button size="sm" variant="ghost" leftIcon={<Images className="h-3.5 w-3.5" />} onClick={() => setPicker((p) => !p)}>
              Swap
            </Button>
          )}
        </div>
        <input
          ref={replaceInput}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Replace image"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void upload(files);
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={`alt-${block.id}`}>
            Alternative text
          </label>
          <input
            id={`alt-${block.id}`}
            value={img.alt}
            onChange={(e) => onChange({ ...block, image: { ...img, alt: e.target.value } })}
            placeholder="e.g. Students sketching a business model on a whiteboard"
            className={cn(fieldClass, !img.alt.trim() && "border-amber-300")}
          />
          <AltHint missing={!img.alt.trim()} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={`cap-${block.id}`}>
            Caption
          </label>
          <input
            id={`cap-${block.id}`}
            value={img.caption ?? ""}
            onChange={(e) => onChange({ ...block, image: { ...img, caption: e.target.value } })}
            placeholder="Optional — shown under the image"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Segmented
            label="Size"
            value={block.size}
            onChange={(size) => onChange({ ...block, size })}
            options={[
              { value: "small", label: "Small", title: "Small inline image" },
              { value: "medium", label: "Medium", title: "Medium inline image" },
              { value: "large", label: "Large", title: "Full width of the text column" },
              { value: "full", label: "Full width", title: "Wider than the text column" },
            ]}
          />
          <Segmented
            label="Alignment"
            value={block.align}
            disabled={!inline}
            onChange={(align) => onChange({ ...block, align })}
            options={[
              { value: "left", label: "Left", title: "Text wraps on the right" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right", title: "Text wraps on the left" },
            ]}
          />
        </div>
        {!inline && (
          <p className="text-xs text-slate-500">Large and full-width images span the column, so alignment doesn&apos;t apply.</p>
        )}
        {picker && <TrayPicker media={media} onPick={choose} onClose={() => setPicker(false)} />}
      </div>
    </div>
  );
}

/* -------------------------------- Gallery ------------------------------- */

export function GalleryEditor({ block, onChange }: { block: GalleryBlock; onChange: (b: GalleryBlock) => void }) {
  const { uploadFiles, media, addMedia } = useEditor();
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);

  const addImages = (images: BlogImage[]) => {
    const existing = new Set(block.images.map((i) => i.src));
    const fresh = images.filter((i) => !existing.has(i.src));
    if (fresh.length) onChange({ ...block, images: [...block.images, ...fresh] });
  };

  const upload = async (files: File[]) => {
    setBusy(true);
    try {
      const uploaded = await uploadFiles(files);
      if (uploaded.length) {
        addMedia(uploaded);
        addImages(uploaded);
      }
    } finally {
      setBusy(false);
    }
  };

  const setImage = (i: number, patch: Partial<BlogImage>) =>
    onChange({ ...block, images: block.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)) });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Segmented
          label="Columns"
          value={block.columns}
          onChange={(columns) => onChange({ ...block, columns })}
          options={[
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
          ]}
        />
        <p className="pb-1 text-xs text-slate-500">{block.images.length} image{block.images.length === 1 ? "" : "s"} · click a thumbnail to enlarge on the live page</p>
      </div>

      {block.images.length > 0 && (
        <ol className="space-y-2" aria-label="Gallery images">
          {block.images.map((img, i) => (
            <li key={img.src} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optimizedUrl(img.src, 200)} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover sm:h-20 sm:w-20" />
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <div>
                  <input
                    aria-label={`Alternative text for image ${i + 1}`}
                    value={img.alt}
                    onChange={(e) => setImage(i, { alt: e.target.value })}
                    placeholder="Alt text"
                    className={cn(fieldClass, "py-1.5", !img.alt.trim() && "border-amber-300")}
                  />
                </div>
                <input
                  aria-label={`Caption for image ${i + 1}`}
                  value={img.caption ?? ""}
                  onChange={(e) => setImage(i, { caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className={cn(fieldClass, "py-1.5")}
                />
              </div>
              <div className="flex shrink-0 flex-col justify-center sm:flex-row">
                <IconBtn label={`Move image ${i + 1} up`} disabled={i === 0} onClick={() => onChange({ ...block, images: moveItem(block.images, i, i - 1) })}>
                  <ArrowUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn label={`Move image ${i + 1} down`} disabled={i === block.images.length - 1} onClick={() => onChange({ ...block, images: moveItem(block.images, i, i + 1) })}>
                  <ArrowDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label={`Remove image ${i + 1} from gallery`} danger onClick={() => onChange({ ...block, images: block.images.filter((_, idx) => idx !== i) })}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </li>
          ))}
        </ol>
      )}

      <DropZone
        busy={busy}
        multiple
        label={block.images.length ? "Add more images — drop several at once" : "Drop several images here, or upload them"}
        onFiles={upload}
        onPickFromPost={() => setPicker(true)}
        hasMedia={media.length > 0}
      />
      {picker && (
        <TrayPicker
          media={media}
          multiple
          onPick={(imgs) => {
            addImages(imgs);
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
        />
      )}

      <input
        aria-label="Gallery caption"
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="Gallery caption (optional)"
        className={fieldClass}
      />
    </div>
  );
}
