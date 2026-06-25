import {
  Download,
  Edit,
  Eye,
  Heart,
  Image as ImageIcon,
  Star,
  Trash2,
} from "lucide-react";
import { Button, Card } from "@/shared/ui";
import { GalleryStatusBadge } from "./GalleryStatusBadge";
import { formatFileSize } from "./formatFileSize";
import type { GalleryImage } from "../types";

interface GalleryCardProps {
  image: GalleryImage;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (image: GalleryImage) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onToggleFeature: (image: GalleryImage) => void;
  onToggleFavorite: (image: GalleryImage) => void;
}

/** Single gallery image tile for the admin grid. */
export function GalleryCard({
  image,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
  onToggleFeature,
  onToggleFavorite,
}: GalleryCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-square bg-slate-100">
        {image.thumbnailUrl || image.url ? (
          <img
            src={image.thumbnailUrl || image.url}
            alt={image.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        <label className="absolute left-3 top-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-white/90 shadow-sm">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(image.id)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <GalleryStatusBadge status={image.status} />
          {image.isFeature && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(image)}
          aria-label="Toggle favorite"
          className={`absolute bottom-3 right-3 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors ${
            image.isFavorite
              ? "text-red-600"
              : "text-slate-400 hover:text-red-600"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${image.isFavorite ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
          {image.title}
        </h3>
        {image.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {image.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{image.category || "—"}</span>
          <span>{formatFileSize(image.fileSize)}</span>
        </div>

        {image.tags && image.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {image.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                #{tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {image.stats?.views ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {image.stats?.downloads ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {image.stats?.likes ?? 0}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => onView(image)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(image)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle featured"
            className={image.isFeature ? "text-indigo-600" : ""}
            onClick={() => onToggleFeature(image)}
          >
            <Star
              className={`h-4 w-4 ${image.isFeature ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(image)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
