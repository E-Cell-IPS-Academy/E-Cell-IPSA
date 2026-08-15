"use client";

/** Render scale for the rasterized template — higher = sharper certificates. */
const RENDER_SCALE = 3;

/**
 * Converts page 1 of an uploaded PDF into a high-resolution PNG File, entirely
 * client-side. This lets admins upload a PDF-designed certificate template
 * (e.g. exported from Canva/Illustrator) while the rest of the pipeline keeps
 * treating templates as a single flat image, exactly like a PNG/JPG upload.
 *
 * pdfjs-dist is imported dynamically (rather than at module scope) because it
 * touches browser-only globals (e.g. DOMMatrix) as a side effect of import,
 * which would otherwise crash Next.js's server-side page-data collection for
 * any route that pulls this module in.
 */
export async function pdfFileToPngFile(file: File): Promise<File> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: RENDER_SCALE });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create canvas context.");

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed."))),
      "image/png"
    );
  });

  return new File([blob], file.name.replace(/\.pdf$/i, ".png"), {
    type: "image/png",
  });
}
