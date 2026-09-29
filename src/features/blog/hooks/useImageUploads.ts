"use client";

import { useCallback, useState } from "react";
import { useCloudinaryUpload } from "@/shared/hooks/useCloudinaryUpload";
import type { BlogImage } from "../types";
import { newId } from "../lib/blocks";
import { prepareImageForUpload } from "../lib/imageUtils";

export interface PendingUpload {
  id: string;
  name: string;
  /** 0–100 */
  progress: number;
}

export const MAX_UPLOAD_MB = 15;
const isImage = (f: File) => f.type.startsWith("image/") && f.type !== "image/svg+xml";

/**
 * Uploads article images to Cloudinary (unsigned preset, via the shared hook).
 * Large photos are shrunk in the browser first. Several files upload in
 * parallel with independent progress; failures are reported per file and never
 * abort the others.
 */
export function useImageUploads(onError: (message: string) => void) {
  const { upload } = useCloudinaryUpload();
  const [pending, setPending] = useState<PendingUpload[]>([]);

  const uploadFiles = useCallback(
    async (input: File[], options?: { folder?: string }): Promise<BlogImage[]> => {
      const files = input.filter((f) => {
        if (!isImage(f)) {
          onError(`“${f.name}” is not a supported image (use JPG, PNG, WebP or GIF).`);
          return false;
        }
        if (f.size > MAX_UPLOAD_MB * 1024 * 1024) {
          onError(`“${f.name}” is larger than ${MAX_UPLOAD_MB} MB.`);
          return false;
        }
        return true;
      });

      const jobs = files.map((file) => ({ id: newId(), file }));
      setPending((p) => [...p, ...jobs.map((j) => ({ id: j.id, name: j.file.name, progress: 0 }))]);

      const results = await Promise.all(
        jobs.map(async ({ id, file }): Promise<BlogImage | null> => {
          try {
            const prepared = await prepareImageForUpload(file);
            const res = await upload(prepared, {
              folder: options?.folder ?? "blogs/content",
              resourceType: "image",
              onProgress: (progress) =>
                setPending((p) => p.map((x) => (x.id === id ? { ...x, progress } : x))),
            });
            return {
              src: res.secureUrl,
              publicId: res.publicId,
              alt: "",
              caption: "",
              ...(res.width && res.height ? { width: res.width, height: res.height } : {}),
            };
          } catch (err) {
            onError(`Could not upload “${file.name}”: ${err instanceof Error ? err.message : "upload failed"}`);
            return null;
          } finally {
            setPending((p) => p.filter((x) => x.id !== id));
          }
        })
      );
      return results.filter((r): r is BlogImage => r !== null);
    },
    [upload, onError]
  );

  return { uploadFiles, pending, uploading: pending.length > 0 };
}
