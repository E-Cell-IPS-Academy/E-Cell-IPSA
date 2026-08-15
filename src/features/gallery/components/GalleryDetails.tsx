import { Badge } from "@/shared/ui";
import { GalleryStatusBadge } from "./GalleryStatusBadge";
import { formatFileSize } from "./formatFileSize";
import type { GalleryImage } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

/** Read-only details view for a gallery image (shown in the modal). */
export function GalleryDetails({ image }: { image: GalleryImage }) {
  return (
    <div className="space-y-6">
      <img
        src={image.url}
        alt={image.title}
        className="max-h-96 w-full rounded-lg object-contain"
      />

      <div className="flex items-center gap-2">
        <GalleryStatusBadge status={image.status} />
        {image.category && <Badge>{image.category}</Badge>}
        {image.isFeature && <Badge tone="info">Featured</Badge>}
      </div>

      {image.description && (
        <p className="text-sm text-slate-600">{image.description}</p>
      )}

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Album" value={image.album ?? ""} />
        <Field label="Event" value={image.eventName ?? ""} />
        <Field label="Event date" value={image.eventDate ?? ""} />
        <Field label="Location" value={image.location ?? ""} />
        <Field label="Photographer" value={image.photographer ?? ""} />
        <Field label="File size" value={formatFileSize(image.fileSize)} />
      </dl>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Views" value={String(image.stats?.views ?? 0)} />
        <Field label="Downloads" value={String(image.stats?.downloads ?? 0)} />
        <Field label="Likes" value={String(image.stats?.likes ?? 0)} />
        <Field label="Shares" value={String(image.stats?.shares ?? 0)} />
      </dl>

      {image.tags && image.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {image.tags.map((tag) => (
              <Badge key={tag} tone="info">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
