"use client";

import type { BlogImage, ContentBlock } from "../../types";
import { optimizedUrl } from "../../lib/imageUtils";
import { Button, Badge } from "@/shared/ui";
import { ImagePlus, Trash2, Star } from "lucide-react";
import type { PendingUpload } from "../../hooks/useImageUploads";
import { DropZone } from "./blocks/ImageBlocks";
import { IconBtn } from "./controls";

interface MediaPanelProps {
  media: BlogImage[];
  blocks: ContentBlock[];
  pending: PendingUpload[];
  onUpload: (files: File[]) => void;
  onInsert: (image: BlogImage) => void;
  onUseAsCover: (image: BlogImage) => void;
  onRemove: (image: BlogImage) => void;
}

/** How many times an image is used in the article body. */
function usageOf(src: string, blocks: ContentBlock[]) {
  let n = 0;
  for (const b of blocks) {
    if (b.type === "image" && b.image.src === src) n++;
    if (b.type === "gallery") n += b.images.filter((i) => i.src === src).length;
  }
  return n;
}

/**
 * The post's image library. Upload many images at once, then insert each one
 * anywhere in the article (after the selected block, or at the end).
 */
export function MediaPanel({ media, blocks, pending, onUpload, onInsert, onUseAsCover, onRemove }: MediaPanelProps) {
  return (
    <div className="space-y-4">
      <DropZone
        busy={false}
        multiple
        label="Upload images for this article"
        onFiles={onUpload}
        onPickFromPost={() => undefined}
        hasMedia={false}
      />

      {pending.length > 0 && (
        <ul className="space-y-2" aria-label="Uploads in progress">
          {pending.map((p) => (
            <li key={p.id} className="text-xs text-slate-600">
              <div className="mb-1 flex justify-between">
                <span className="truncate pr-2">{p.name}</span>
                <span>{p.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${p.name}`}>
                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${p.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {media.length === 0 ? (
        <p className="text-sm text-slate-500">
          No images yet. Uploaded images appear here so you can place them anywhere in the story.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3" aria-label="Images in this post">
          {media.map((img) => {
            const used = usageOf(img.src, blocks);
            return (
              <li key={img.src} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={optimizedUrl(img.src, 320)} alt={img.alt || "Uploaded image"} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute left-1.5 top-1.5">
                    <Badge tone={used ? "success" : "neutral"}>{used ? `Used ×${used}` : "Unused"}</Badge>
                  </span>
                </div>
                <div className="flex items-center gap-1 p-1.5">
                  <Button size="sm" variant="outline" className="flex-1 px-2" leftIcon={<ImagePlus className="h-3.5 w-3.5" />} onClick={() => onInsert(img)}>
                    Insert
                  </Button>
                  <IconBtn label="Use as cover image" onClick={() => onUseAsCover(img)}>
                    <Star className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    label={used ? "Remove it from the article before deleting" : "Remove from this post's images"}
                    danger
                    disabled={used > 0}
                    onClick={() => onRemove(img)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-slate-500">
        Images are hosted on Cloudinary and optimised automatically. Removing an image here detaches it from the post; the file stays in your Cloudinary library.
      </p>
    </div>
  );
}
