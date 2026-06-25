import { useCallback, useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
}

/**
 * Single source of truth for Cloudinary uploads from the client.
 *
 * Uses an UNSIGNED upload preset — no API secret is ever shipped to the
 * browser. Replaces the ~8 duplicated inline upload classes that previously
 * lived in each admin page.
 */
export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      options?: { folder?: string; resourceType?: "image" | "video" | "auto" }
    ): Promise<CloudinaryUploadResult> => {
      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error(
          "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
        );
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      const resourceType = options?.resourceType ?? "auto";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      if (options?.folder) formData.append("folder", options.folder);

      try {
        const result = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`
            );
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
              }
            };
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve({
                  url: data.url,
                  secureUrl: data.secure_url,
                  publicId: data.public_id,
                  width: data.width,
                  height: data.height,
                  format: data.format,
                  resourceType: data.resource_type,
                  bytes: data.bytes,
                });
              } else {
                reject(new Error(`Upload failed (${xhr.status})`));
              }
            };
            xhr.onerror = () =>
              reject(new Error("Network error during upload"));
            xhr.send(formData);
          }
        );
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const uploadMany = useCallback(
    (files: File[], options?: Parameters<typeof upload>[1]) =>
      Promise.all(files.map((f) => upload(f, options))),
    [upload]
  );

  return { upload, uploadMany, uploading, progress, error };
}
