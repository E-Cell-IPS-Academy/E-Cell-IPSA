import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import { Button, Input, Textarea } from "@/shared/ui";
import { EMPTY_ALBUM } from "../types";
import type { AlbumFormValues } from "../types";

interface AlbumFormProps {
  submitting?: boolean;
  onSubmit: (values: AlbumFormValues) => void;
  onCancel: () => void;
}

/** Create-album form. */
export function AlbumForm({
  submitting = false,
  onSubmit,
  onCancel,
}: AlbumFormProps) {
  const [values, setValues] = useState<AlbumFormValues>({ ...EMPTY_ALBUM });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Album name"
        value={values.name}
        onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
        placeholder="Enter album name"
        required
      />
      <Textarea
        label="Description"
        value={values.description ?? ""}
        onChange={(e) =>
          setValues((p) => ({ ...p, description: e.target.value }))
        }
        placeholder="Album description"
      />

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={!values.name.trim()}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Create album
        </Button>
      </div>
    </form>
  );
}
