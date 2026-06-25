import { Image as ImageIcon, Palette, Video } from "lucide-react";
import { Input } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { HERO_BACKGROUND_TYPES } from "../types";
import type { HeroBackgroundType, HeroFormValues } from "../types";

interface HeroBackgroundFieldsProps {
  values: HeroFormValues;
  onChange: <K extends keyof HeroFormValues>(
    key: K,
    value: HeroFormValues[K]
  ) => void;
  onError?: (message: string) => void;
}

const TYPE_ICON: Record<HeroBackgroundType, typeof Palette> = {
  gradient: Palette,
  image: ImageIcon,
  video: Video,
};

/** Background-type picker plus the conditional video / image fields. */
export function HeroBackgroundFields({
  values,
  onChange,
  onError,
}: HeroBackgroundFieldsProps) {
  const showImage =
    values.backgroundType === "image" || values.backgroundType === "video";

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Background type
        </span>
        <div className="flex flex-wrap gap-2">
          {HERO_BACKGROUND_TYPES.map((type) => {
            const Icon = TYPE_ICON[type];
            const active = values.backgroundType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange("backgroundType", type)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {values.backgroundType === "video" && (
        <Input
          label="Video URL"
          value={values.videoUrl}
          onChange={(e) => onChange("videoUrl", e.target.value)}
          placeholder="https://… (mp4 URL)"
        />
      )}

      {showImage && (
        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">
            {values.backgroundType === "image"
              ? "Background image"
              : "Fallback image"}
          </span>
          <ImageUploader
            label="Upload background"
            value={values.backgroundUrl}
            folder="hero"
            onUploaded={(url) => onChange("backgroundUrl", url)}
            onError={onError}
          />
          <Input
            value={values.backgroundUrl}
            onChange={(e) => onChange("backgroundUrl", e.target.value)}
            placeholder="https://… (or paste a URL)"
            hint="Upload above, or paste an image URL directly."
          />
        </div>
      )}
    </div>
  );
}
