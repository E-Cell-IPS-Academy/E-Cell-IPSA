import { Input, Select, Textarea } from "@/shared/ui";
import { GALLERY_CATEGORIES, GALLERY_STATUSES } from "../types";
import type { Album, GalleryImageFormValues } from "../types";

interface GalleryMetadataFieldsProps {
  values: GalleryImageFormValues;
  albums: Album[];
  setField: <K extends keyof GalleryImageFormValues>(
    key: K,
    value: GalleryImageFormValues[K]
  ) => void;
  titleRequired?: boolean;
}

const csv = (list?: string[]) => (list ?? []).join(", ");
const fromCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** Shared metadata inputs used by both the upload and edit forms. */
export function GalleryMetadataFields({
  values,
  albums,
  setField,
  titleRequired = false,
}: GalleryMetadataFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Title"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="Image title"
          required={titleRequired}
        />
        <Select
          label="Category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
        >
          <option value="">Select category</option>
          {GALLERY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Description"
        value={values.description ?? ""}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Image description"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Album"
          value={values.album ?? ""}
          onChange={(e) => setField("album", e.target.value)}
        >
          <option value="">No album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.name}>
              {album.name}
            </option>
          ))}
        </Select>
        <Input
          label="Event name"
          value={values.eventName ?? ""}
          onChange={(e) => setField("eventName", e.target.value)}
          placeholder="Event name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Event date"
          type="date"
          value={values.eventDate ?? ""}
          onChange={(e) => setField("eventDate", e.target.value)}
        />
        <Input
          label="Location"
          value={values.location ?? ""}
          onChange={(e) => setField("location", e.target.value)}
          placeholder="Event location"
        />
      </div>

      <Input
        label="Photographer"
        value={values.photographer ?? ""}
        onChange={(e) => setField("photographer", e.target.value)}
        placeholder="Photographer name"
      />

      <Input
        label="Tags (comma separated)"
        value={csv(values.tags)}
        onChange={(e) => setField("tags", fromCsv(e.target.value))}
        placeholder="conference, startup, networking"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Status"
          value={values.status}
          onChange={(e) =>
            setField(
              "status",
              e.target.value as GalleryImageFormValues["status"]
            )
          }
        >
          {GALLERY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
        <div className="flex items-end gap-6 pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={values.isFeature}
              onChange={(e) => setField("isFeature", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={values.isFavorite}
              onChange={(e) => setField("isFavorite", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Favorite
          </label>
        </div>
      </div>
    </>
  );
}
