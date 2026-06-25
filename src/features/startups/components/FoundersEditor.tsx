import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "@/shared/ui";
import type { Founder } from "../types";

interface FoundersEditorProps {
  founders: Founder[];
  onChange: (founders: Founder[]) => void;
}

/** Add / edit / remove the list of startup founders. */
export function FoundersEditor({ founders, onChange }: FoundersEditorProps) {
  const add = () =>
    onChange([...founders, { name: "", position: "", bio: "" }]);

  const update = (index: number, field: keyof Founder, value: string) =>
    onChange(
      founders.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );

  const remove = (index: number) =>
    onChange(founders.filter((_, i) => i !== index));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Founders</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={add}
        >
          Add founder
        </Button>
      </div>
      <div className="space-y-3">
        {founders.map((founder, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-slate-200 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Founder {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded p-1 text-red-500 hover:bg-red-50"
                aria-label="Remove founder"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                placeholder="Founder name"
                value={founder.name}
                onChange={(e) => update(index, "name", e.target.value)}
              />
              <Input
                placeholder="Position / title"
                value={founder.position}
                onChange={(e) => update(index, "position", e.target.value)}
              />
            </div>
            <Textarea
              rows={2}
              placeholder="Short bio"
              value={founder.bio}
              onChange={(e) => update(index, "bio", e.target.value)}
            />
            <Input
              type="url"
              placeholder="LinkedIn URL (optional)"
              value={founder.linkedin ?? ""}
              onChange={(e) => update(index, "linkedin", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
