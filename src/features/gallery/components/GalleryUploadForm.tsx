import { useState } from "react";
import type { FormEvent } from "react";
import { Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryMetadataFields } from "./GalleryMetadataFields";
import { buildThumbnailUrl } from "../galleryService";
import { EMPTY_GALLERY_IMAGE } from "../types";
import type { Album, GalleryImageFormValues } from "../types";

export interface UploadedImagePayload extends GalleryImageFormValues {
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}

interface GalleryUploadFormProps {
  albums: Album[];
  submitting?: boolean;
  onSubmit: (images: UploadedImagePayload[]) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

interface Uploaded {
  url: string;
  publicId: string;
}

/** Multi-image upload form: upload to Cloudinary, then tag shared metadata. */
export function GalleryUploadForm({
  albums,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}: GalleryUploadFormProps) {
  const [values, setValues] = useState<GalleryImageFormValues>({
    ...EMPTY_GALLERY_IMAGE,
  });
  const [uploaded, setUploaded] = useState<Uploaded[]>([]);
  const [pending, setPending] = useState(0);

  const setField = <K extends keyof GalleryImageFormValues>(
    key: K,
    value: GalleryImageFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const addUploader = () => setPending((n) => n + 1);

  const handleUploaded = (url: string, publicId: string) => {
    if (!url) return;
    setUploaded((prev) => [...prev, { url, publicId }]);
    setPending((n) => Math.max(0, n - 1));
  };

  const removeUploaded = (index: number) =>
    setUploaded((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (uploaded.length === 0) {
      onError?.("Please upload at least one image.");
      return;
    }
    const images: UploadedImagePayload[] = uploaded.map((u) => ({
      ...values,
      title: values.title.trim() || `Image ${u.publicId.split("/").pop()}`,
      url: u.url,
      publicId: u.publicId,
      thumbnailUrl: buildThumbnailUrl(u.url),
    }));
    onSubmit(images);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Images ({uploaded.length} uploaded)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={addUploader}
          >
            Add image
          </Button>
        </div>

        {uploaded.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {uploaded.map((u, index) => (
              <div
                key={u.publicId}
                className="group relative overflow-hidden rounded-lg border border-slate-200"
              >
                <img
                  src={u.url}
                  alt="Uploaded"
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(index)}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {Array.from({
            length: Math.max(pending, uploaded.length === 0 ? 1 : 0),
          }).map((_, i) => (
            <ImageUploader
              key={`uploader-${uploaded.length}-${i}`}
              label="Upload image"
              folder="gallery"
              onUploaded={handleUploaded}
              onError={onError}
            />
          ))}
        </div>
      </div>

      <GalleryMetadataFields
        values={values}
        albums={albums}
        setField={setField}
      />

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={uploaded.length === 0}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save {uploaded.length || ""} image{uploaded.length === 1 ? "" : "s"}
        </Button>
      </div>
    </form>
  );
}
