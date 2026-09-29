"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { BlogImage } from "../../types";
import { optimizedUrl } from "../../lib/imageUtils";

interface LightboxProps {
  images: BlogImage[];
  startIndex: number;
  onClose: () => void;
}

/**
 * Full-screen image viewer. Esc closes, ←/→ navigate, focus moves into the
 * dialog and returns to the trigger on close. Rendered in a portal so it is
 * never clipped by the article's layout containment.
 */
export function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const many = images.length > 1;

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) step(1);
      else if (e.key === "ArrowLeft" && many) step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [onClose, step, many]);

  const image = images[index];
  if (!image || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="np-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <div className="np-lightbox-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimizedUrl(image.src, 1800)}
          alt={image.alt}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          ref={closeRef}
          type="button"
          className="np-lb-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close image viewer"
        >
          <X size={20} aria-hidden="true" />
        </button>
        {many && (
          <>
            <button
              type="button"
              className="np-lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="np-lb-next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <p className="np-lightbox-cap" aria-live="polite" onClick={(e) => e.stopPropagation()}>
        {image.caption}
        {many && (
          <span style={{ display: "block", opacity: 0.6, fontSize: "0.8rem", marginTop: 4 }}>
            {index + 1} / {images.length}
          </span>
        )}
      </p>
    </div>,
    document.body
  );
}
