"use client";

import { useRef, useState } from "react";
import { Images, RefreshCw, Trash2 } from "lucide-react";
import type { BlogFormValues, BlogImage } from "../../types";
import { optimizedUrl } from "../../lib/imageUtils";
import { cn } from "@/shared/lib/cn";
import { Button, Spinner } from "@/shared/ui";
import { useEditor } from "./EditorContext";
import { fieldClass } from "./controls";
import { DropZone } from "./blocks/ImageBlocks";
import { TrayPicker } from "./TrayPicker";

export type CoverValues = Pick<
  BlogFormValues,
  | "featuredImage"
  | "featuredImagePublicId"
  | "featuredImageAlt"
  | "featuredImageCaption"
  | "featuredImageWidth"
  | "featuredImageHeight"
>;

/** Empty patch used to clear the cover (Firestore-safe: no undefined values). */
export const NO_COVER: CoverValues = {
  featuredImage: "",
  featuredImagePublicId: "",
  featuredImageAlt: "",
  featuredImageCaption: "",
  featuredImageWidth: 0,
  featuredImageHeight: 0,
};

export const coverFromImage = (img: BlogImage): CoverValues => ({
  featuredImage: img.src,
  featuredImagePublicId: img.publicId ?? "",
  featuredImageAlt: img.alt,
  featuredImageCaption: img.caption ?? "",
  featuredImageWidth: img.width ?? 0,
  featuredImageHeight: img.height ?? 0,
});

/**
 * The story's cover image. Independent of images used inside the article body:
 * it has its own alt text and caption and is uploaded to its own folder.
 */
export function CoverImageField({
  value,
  onChange,
}: {
  value: CoverValues;
  onChange: (patch: Partial<CoverValues>) => void;
}) {
  const { uploadFiles, media } = useEditor();
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);
  const replace = useRef<HTMLInputElement>(null);

  const upload = async (files: File[]) => {
    setBusy(true);
    try {
      const [img] = await uploadFiles(files.slice(0, 1), { folder: "blogs/featured" });
      if (img) {
        onChange({
          ...coverFromImage(img),
          // keep any alt/caption already written when replacing the file
          featuredImageAlt: value.featuredImageAlt || "",
          featuredImageCaption: value.featuredImageCaption || "",
        });
      }
    } finally {
      setBusy(false);
    }
  };

  if (!value.featuredImage) {
    return (
      <section aria-label="Cover image" className="space-y-2">
        <DropZone
          busy={busy}
          multiple={false}
          label="Add a cover image (shown on story cards and at the top of the article)"
          onFiles={upload}
          onPickFromPost={() => setPicker(true)}
          hasMedia={media.length > 0}
        />
        {picker && (
          <TrayPicker
            media={media}
            onPick={([img]) => {
              if (img) onChange(coverFromImage(img));
              setPicker(false);
            }}
            onClose={() => setPicker(false)}
          />
        )}
      </section>
    );
  }

  return (
    <section aria-label="Cover image" className="grid gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <div>
        <div className="relative overflow-hidden rounded-lg bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optimizedUrl(value.featuredImage, 640)}
            alt={value.featuredImageAlt || "Cover image preview"}
            className="max-h-52 w-full object-cover"
          />
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Spinner />
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => replace.current?.click()}>
            Replace
          </Button>
          {media.length > 0 && (
            <Button size="sm" variant="ghost" leftIcon={<Images className="h-3.5 w-3.5" />} onClick={() => setPicker((p) => !p)}>
              From post
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => onChange(NO_COVER)}>
            Remove
          </Button>
        </div>
        <input
          ref={replace}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Replace cover image"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void upload(files);
          }}
        />
      </div>
      <div className="space-y-3">
        <div>
          <label htmlFor="cover-alt" className="mb-1 block text-xs font-medium text-slate-600">Cover alternative text</label>
          <input
            id="cover-alt"
            value={value.featuredImageAlt ?? ""}
            onChange={(e) => onChange({ featuredImageAlt: e.target.value })}
            placeholder="Describe the cover image"
            className={cn(fieldClass, !value.featuredImageAlt?.trim() && "border-amber-300")}
          />
        </div>
        <div>
          <label htmlFor="cover-caption" className="mb-1 block text-xs font-medium text-slate-600">Cover caption</label>
          <input
            id="cover-caption"
            value={value.featuredImageCaption ?? ""}
            onChange={(e) => onChange({ featuredImageCaption: e.target.value })}
            placeholder="Optional — shown under the cover image"
            className={fieldClass}
          />
        </div>
        {picker && (
          <TrayPicker
            media={media}
            onPick={([img]) => {
              if (img) onChange(coverFromImage(img));
              setPicker(false);
            }}
            onClose={() => setPicker(false)}
          />
        )}
      </div>
    </section>
  );
}
