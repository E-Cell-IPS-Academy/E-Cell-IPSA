"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { BlogImage } from "../../types";
import { optimizedUrl } from "../../lib/imageUtils";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";

interface TrayPickerProps {
  media: BlogImage[];
  multiple?: boolean;
  onPick: (images: BlogImage[]) => void;
  onClose: () => void;
}

/** Choose one or more images already uploaded to this post. */
export function TrayPicker({ media, multiple = false, onPick, onClose }: TrayPickerProps) {
  const [chosen, setChosen] = useState<string[]>([]);

  const toggle = (img: BlogImage) => {
    if (!multiple) {
      onPick([img]);
      return;
    }
    setChosen((c) => (c.includes(img.src) ? c.filter((s) => s !== img.src) : [...c, img.src]));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" role="group" aria-label="Images in this post">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600">
          {media.length ? "Images in this post" : "No images uploaded yet"}
        </p>
        <button
          type="button"
          aria-label="Close image picker"
          onClick={onClose}
          className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {media.map((img) => {
          const on = chosen.includes(img.src);
          return (
            <li key={img.src}>
              <button
                type="button"
                aria-pressed={multiple ? on : undefined}
                onClick={() => toggle(img)}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-md border-2 bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  on ? "border-indigo-500" : "border-transparent hover:border-indigo-300"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizedUrl(img.src, 240)}
                  alt={img.alt || "Uploaded image"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {on && (
                  <span className="absolute right-1 top-1 rounded-full bg-indigo-600 p-0.5 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {multiple && media.length > 0 && (
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            disabled={chosen.length === 0}
            onClick={() => onPick(media.filter((m) => chosen.includes(m.src)))}
          >
            Add {chosen.length || ""} selected
          </Button>
        </div>
      )}
    </div>
  );
}
