import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";
import type { CertEvent, CertFieldPlacement, Certificate } from "./types";

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16
  );
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

function formatIssuedDate(cert: Certificate): string {
  const millis = cert.issuedAt?.toMillis?.();
  const date = millis ? new Date(millis) : new Date();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resolveFieldValue(
  field: CertFieldPlacement,
  event: CertEvent,
  cert: Certificate
): string {
  switch (field.key) {
    case "name":
      return cert.name;
    case "certificateId":
      return cert.certificateId;
    case "eventName":
      return cert.eventName || event.name;
    case "issuedDate":
      return formatIssuedDate(cert);
    default:
      return cert.data[field.key] ?? "";
  }
}

/**
 * Renders one certificate PDF entirely in the browser: fetch the template
 * image, draw each configured field on top of it, return the raw bytes.
 * Nothing is uploaded or persisted anywhere — the caller decides what to do
 * with the bytes (trigger a download, in this app's case).
 */
export async function generateCertificatePdf(
  event: CertEvent,
  cert: Certificate
): Promise<Uint8Array> {
  const imageResponse = await fetch(event.templateUrl);
  if (!imageResponse.ok) {
    throw new Error("Could not load the certificate template image.");
  }
  const imageBytes = await imageResponse.arrayBuffer();

  const pdfDoc = await PDFDocument.create();
  const image =
    event.templateFormat === "png"
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

  const { width, height } = image.size();
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const field of event.fields) {
    const value = resolveFieldValue(field, event, cert);
    if (!value) continue;

    const font: PDFFont = field.bold ? boldFont : regularFont;
    const fontSize = field.fontSize;
    const textWidth = font.widthOfTextAtSize(value, fontSize);

    let x = (field.xPct / 100) * width;
    if (field.align === "center") x -= textWidth / 2;
    else if (field.align === "right") x -= textWidth;

    // Field yPct is measured from the top (matches the visual editor);
    // pdf-lib's origin is bottom-left, so flip it and drop by ~fontSize to
    // align the text baseline with where the label sits visually.
    const yFromTop = (field.yPct / 100) * height;
    const y = height - yFromTop - fontSize;

    const [r, g, b] = hexToRgb01(field.color);
    page.drawText(value, { x, y, size: fontSize, font, color: rgb(r, g, b) });
  }

  return pdfDoc.save();
}

/** Triggers a browser download of the generated PDF bytes. */
export function downloadCertificatePdf(
  bytes: Uint8Array,
  filename: string
): void {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
