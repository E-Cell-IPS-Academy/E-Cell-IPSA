import type { BlogImage } from "../types";

/**
 * Image delivery + upload helpers.
 *
 * Images live on Cloudinary. Delivery URLs are rewritten on the fly to request
 * an automatically-chosen modern format (f_auto), automatic quality (q_auto)
 * and a width appropriate for the layout — so a 4 MB phone photo is served as
 * a ~100 KB responsive image. Non-Cloudinary URLs (legacy posts) pass through.
 */

const CLOUDINARY_UPLOAD =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export const isCloudinaryUrl = (src: string) => CLOUDINARY_UPLOAD.test(src);

/** Rewrite a Cloudinary URL to a width-limited, auto-format, auto-quality variant. */
export function optimizedUrl(src: string, width?: number): string {
  const match = CLOUDINARY_UPLOAD.exec(src);
  if (!match) return src;
  const transform = ["f_auto", "q_auto", width ? `w_${width}` : "", "c_limit"]
    .filter(Boolean)
    .join(",");
  return `${match[1]}${transform}/${match[2]}`;
}

const DEFAULT_WIDTHS = [480, 768, 1080, 1600];

/** `srcset` for a Cloudinary image, never asking for more pixels than exist. */
export function buildSrcSet(
  src: string,
  naturalWidth?: number,
  widths: number[] = DEFAULT_WIDTHS
): string | undefined {
  if (!isCloudinaryUrl(src)) return undefined;
  const usable = widths.filter((w) => !naturalWidth || w <= naturalWidth);
  const list = usable.length ? usable : [widths[0]];
  return list.map((w) => `${optimizedUrl(src, w)} ${w}w`).join(", ");
}

/** True when both dimensions are known, so we can reserve the exact box. */
export const hasDimensions = (img: Pick<BlogImage, "width" | "height">) =>
  !!img.width && !!img.height;

/* -------------------------------------------------------------------------- */
/* Client-side preparation before upload                                      */
/* -------------------------------------------------------------------------- */

const MAX_DIMENSION = 2400;
const RESIZABLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Downscale very large photos in the browser before uploading (faster uploads,
 * less storage). Small images, GIFs and SVGs are sent untouched. Falls back to
 * the original file on any failure — optimisation must never block an upload.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!RESIZABLE.includes(file.type)) return file;
  if (typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    if (longest <= MAX_DIMENSION) {
      bitmap.close();
      return file;
    }
    const scale = MAX_DIMENSION / longest;
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, file.type, 0.88)
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name, { type: file.type });
  } catch {
    return file;
  }
}
