import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Save } from "lucide-react";
import { Button, Input, Textarea } from "@/shared/ui";
import { TeamIcon } from "./TeamIcon";
import { TEAM_ICON_OPTIONS } from "../types";
import type { TeamCategoryFormValues } from "../types";
import { cn } from "@/shared/lib/cn";

interface TeamCategoryFormProps {
  initialValues: TeamCategoryFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: TeamCategoryFormValues) => void;
  onCancel: () => void;
}

/** Create / edit form for a team category. Owns its own field state. */
export function TeamCategoryForm({
  initialValues,
  submitLabel,
  submitting = false,
  onSubmit,
  onCancel,
}: TeamCategoryFormProps) {
  const [values, setValues] = useState<TeamCategoryFormValues>(initialValues);

  const setField = <K extends keyof TeamCategoryFormValues>(
    key: K,
    value: TeamCategoryFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleOrder = (e: ChangeEvent<HTMLInputElement>) =>
    setField("order", parseInt(e.target.value, 10) || 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Category name"
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="e.g. Technical Team"
        required
      />

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Icon
        </span>
        <div className="grid grid-cols-8 gap-2 rounded-lg border border-slate-200 p-3">
          {TEAM_ICON_OPTIONS.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setField("icon", iconName)}
              title={iconName}
              className={cn(
                "flex items-center justify-center rounded-lg border p-2 transition-colors",
                values.icon === iconName
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                  : "border-transparent text-slate-500 hover:bg-slate-100"
              )}
            >
              <TeamIcon name={iconName} className="h-4 w-4" />
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Selected: <span className="text-indigo-600">{values.icon}</span>
        </p>
      </div>

      <Textarea
        label="Description"
        rows={3}
        value={values.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Brief description of this category…"
      />

      <Input
        label="Display order"
        type="number"
        min={0}
        value={values.order}
        onChange={handleOrder}
        placeholder="1"
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
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
