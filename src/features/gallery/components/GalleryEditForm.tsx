import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/shared/ui";
import { GalleryMetadataFields } from "./GalleryMetadataFields";
import type { Album, GalleryImageFormValues } from "../types";

interface GalleryEditFormProps {
  initialValues: GalleryImageFormValues;
  albums: Album[];
  submitting?: boolean;
  onSubmit: (values: GalleryImageFormValues) => void;
  onCancel: () => void;
}

/** Edit form for an existing gallery image. */
export function GalleryEditForm({
  initialValues,
  albums,
  submitting = false,
  onSubmit,
  onCancel,
}: GalleryEditFormProps) {
  const [values, setValues] = useState<GalleryImageFormValues>(initialValues);

  const setField = <K extends keyof GalleryImageFormValues>(
    key: K,
    value: GalleryImageFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <GalleryMetadataFields
        values={values}
        albums={albums}
        setField={setField}
        titleRequired
      />

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Update image
        </Button>
      </div>
    </form>
  );
}
