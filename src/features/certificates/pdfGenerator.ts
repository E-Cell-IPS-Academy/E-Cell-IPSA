"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFDocument as PDFDocumentType, PDFFont, PDFPage } from "pdf-lib";
import type {
  CertEvent,
  CertFieldPlacement,
  Certificate,
  FontFamily,
  TextBlockPlacement,
} from "./types";
import { NAME_TOKEN, mergedRecipientName } from "./types";

const STANDARD_FONT_MAP: Record<
  FontFamily,
  { regular: StandardFonts; bold: StandardFonts }
> = {
  helvetica: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold,
  },
  times: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
  },
  courier: { regular: StandardFonts.Courier, bold: StandardFonts.CourierBold },
};

/** Embeds (and caches) the font for a given family + weight combination. */
function makeFontResolver(pdfDoc: PDFDocumentType) {
  const cache = new Map<string, PDFFont>();
  return async (fontFamily: FontFamily, bold?: boolean): Promise<PDFFont> => {
    const key = `${fontFamily}-${bold ? "bold" : "regular"}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const standardFont = bold
      ? STANDARD_FONT_MAP[fontFamily].bold
      : STANDARD_FONT_MAP[fontFamily].regular;
    const font = await pdfDoc.embedFont(standardFont);
    cache.set(key, font);
    return font;
  };
}

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
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
}

/** Greedy word-wrap: splits text into lines no wider than maxWidth at fontSize. */
function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSingleLineField(
  page: PDFPage,
  value: string,
  field: CertFieldPlacement,
  font: PDFFont,
  pageWidth: number,
  pageHeight: number
): void {
  if (!value) return;
  const textWidth = font.widthOfTextAtSize(value, field.fontSize);
  let x = (field.xPct / 100) * pageWidth;
  if (field.align === "center") x -= textWidth / 2;
  else if (field.align === "right") x -= textWidth;
  const y = pageHeight - (field.yPct / 100) * pageHeight - field.fontSize;
  const [r, g, b] = hexToRgb01(field.color);
  page.drawText(value, {
    x,
    y,
    size: field.fontSize,
    font,
    color: rgb(r, g, b),
  });
}

function drawWrappedBlock(
  page: PDFPage,
  text: string,
  block: TextBlockPlacement,
  font: PDFFont,
  pageWidth: number,
  pageHeight: number
): void {
  const maxWidth = (block.widthPct / 100) * pageWidth;
  const lines = wrapText(text, font, block.fontSize, maxWidth);
  const lineHeight = (block.lineHeightPct / 100) * pageHeight;
  const [r, g, b] = hexToRgb01(block.color);

  // Vertically center the block around yPct so it grows/shrinks evenly as text changes.
  const totalHeight = lineHeight * (lines.length - 1);
  const startYFromTop = (block.yPct / 100) * pageHeight - totalHeight / 2;

  lines.forEach((line, i) => {
    const lineWidth = font.widthOfTextAtSize(line, block.fontSize);
    let x = (block.xPct / 100) * pageWidth;
    if (block.align === "center") x -= lineWidth / 2;
    else if (block.align === "right") x -= lineWidth;
    const yFromTop = startYFromTop + i * lineHeight;
    const y = pageHeight - yFromTop - block.fontSize;
    page.drawText(line, {
      x,
      y,
      size: block.fontSize,
      font,
      color: rgb(r, g, b),
    });
  });
}

/**
 * Renders one certificate PDF entirely in the browser: fetch the template
 * image, merge {{NAME}} into the body paragraph and word-wrap it, draw the
 * certificate ID, return the raw bytes. Nothing is uploaded or persisted
 * anywhere — the caller decides what to do with the bytes.
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

  const resolveFont = makeFontResolver(pdfDoc);
  const font = await resolveFont(
    event.bodyPlacement.fontFamily,
    event.bodyPlacement.bold
  );
  const idFont = await resolveFont(
    event.certificateIdPlacement.fontFamily,
    event.certificateIdPlacement.bold
  );

  const bodyText = event.bodyTemplate.replaceAll(
    NAME_TOKEN,
    mergedRecipientName(cert)
  );
  drawWrappedBlock(page, bodyText, event.bodyPlacement, font, width, height);
  drawSingleLineField(
    page,
    cert.certificateId,
    event.certificateIdPlacement,
    idFont,
    width,
    height
  );

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
