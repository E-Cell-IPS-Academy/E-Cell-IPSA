import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Input,
  Textarea,
} from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MilestonesEditor } from "./MilestonesEditor";
import { StatsEditor } from "./StatsEditor";
import type { AboutFormValues } from "../types";

interface AboutFormProps {
  initialValues: AboutFormValues;
  submitting?: boolean;
  onSubmit: (values: AboutFormValues) => void;
  onError?: (message: string) => void;
}

/** Create / edit form for the About page content. Owns its own field state. */
export function AboutForm({
  initialValues,
  submitting = false,
  onSubmit,
  onError,
}: AboutFormProps) {
  const [values, setValues] = useState<AboutFormValues>(initialValues);
  const [pendingRemoval, setPendingRemoval] = useState<{
    kind: "milestone" | "stat";
    index: number;
  } | null>(null);

  const setField = <K extends keyof AboutFormValues>(
    key: K,
    value: AboutFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const removeAt = <T,>(list: T[], index: number) =>
    list.filter((_, i) => i !== index);

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    const { kind, index } = pendingRemoval;
    if (kind === "milestone") {
      setField("milestones", removeAt(values.milestones, index));
    } else {
      setField("stats", removeAt(values.stats, index));
    }
    setPendingRemoval(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input
            label="Page Title"
            value={values.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="About Us"
          />
          <Textarea
            label="Description"
            rows={4}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="About page description…"
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              About Image
            </span>
            <ImageUploader
              label="Upload about image"
              value={values.aboutImage}
              folder="about"
              onUploaded={(url) => setField("aboutImage", url)}
              onError={onError}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mission &amp; Vision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Textarea
            label="Mission"
            rows={3}
            value={values.mission}
            onChange={(e) => setField("mission", e.target.value)}
            placeholder="Our mission…"
          />
          <Textarea
            label="Vision"
            rows={3}
            value={values.vision}
            onChange={(e) => setField("vision", e.target.value)}
            placeholder="Our vision…"
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Vision Image
            </span>
            <ImageUploader
              label="Upload vision image"
              value={values.visionImage}
              folder="about"
              onUploaded={(url) => setField("visionImage", url)}
              onError={onError}
            />
          </div>
        </CardContent>
      </Card>

      <MilestonesEditor
        milestones={values.milestones}
        onChange={(milestones) => setField("milestones", milestones)}
        onRemoveRequest={(index) =>
          setPendingRemoval({ kind: "milestone", index })
        }
      />

      <StatsEditor
        stats={values.stats}
        onChange={(stats) => setField("stats", stats)}
        onRemoveRequest={(index) => setPendingRemoval({ kind: "stat", index })}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save About Page
        </Button>
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title={
          pendingRemoval?.kind === "stat" ? "Remove stat" : "Remove milestone"
        }
        message={`Remove this ${pendingRemoval?.kind ?? "item"}? This cannot be undone.`}
        confirmLabel="Remove"
        destructive
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </form>
  );
}
