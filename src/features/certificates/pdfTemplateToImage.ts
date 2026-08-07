import * as pdfjsLib from "pdfjs-dist";
// Vite: bundle the worker as a URL so pdf.js can load it without extra server config.
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/** Render scale for the rasterized template — higher = sharper certificates. */
const RENDER_SCALE = 3;

/**
 * Converts page 1 of an uploaded PDF into a high-resolution PNG File, entirely
 * client-side. This lets admins upload a PDF-designed certificate template
 * (e.g. exported from Canva/Illustrator) while the rest of the pipeline keeps
 * treating templates as a single flat image, exactly like a PNG/JPG upload.
 */
export async function pdfFileToPngFile(file: File): Promise<File> {
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
