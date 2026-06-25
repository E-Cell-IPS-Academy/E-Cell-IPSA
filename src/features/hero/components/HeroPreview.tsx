import { Monitor } from "lucide-react";
import type { CSSProperties } from "react";
import type { HeroFormValues } from "../types";

interface HeroPreviewProps {
  values: HeroFormValues;
}

/** Read-only visual preview of how the public hero will render. */
export function HeroPreview({ values }: HeroPreviewProps) {
  const background: CSSProperties =
    values.backgroundType === "image" && values.backgroundUrl
      ? {
          backgroundImage: `url(${values.backgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #0f0f23 50%, #1a0533 100%)",
        };

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200"
      style={background}
    >
      <div className="space-y-4 bg-black/50 p-10 text-center">
        {values.backgroundType === "video" && values.videoUrl && (
          <div className="flex items-center justify-center gap-2 text-sm text-indigo-200">
            <Monitor className="h-4 w-4" />
            Video background active
          </div>
        )}
        <h2 className="text-3xl font-bold text-white">
          {values.title || "Hero Title"}
        </h2>
        <h3 className="text-xl text-indigo-200">
          {values.subtitle || "Subtitle"}
        </h3>
        <p className="mx-auto max-w-2xl text-slate-200">
          {values.description || "Description text goes here…"}
        </p>
        {values.ctaText && (
          <button
            type="button"
            className="mt-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-slate-900"
          >
            {values.ctaText}
          </button>
        )}
      </div>
    </div>
  );
}
