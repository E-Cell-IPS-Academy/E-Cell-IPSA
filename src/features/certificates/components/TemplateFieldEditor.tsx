import { useRef, useState } from "react";
import { Bold, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button, Input, Select } from "@/shared/ui";
import type { CertFieldPlacement, TextAlign } from "../types";

interface TemplateFieldEditorProps {
  templateUrl: string;
  fields: CertFieldPlacement[];
  onChange: (fields: CertFieldPlacement[]) => void;
}

function slugify(label: string): string {
  return (
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || `field_${Date.now()}`
  );
}

/**
 * Drag-and-drop placement editor: renders the uploaded template with each
 * field as a draggable chip on top of it, plus a per-field settings panel
 * below (font size, color, alignment, bold). Positions are stored as
 * percentages so they scale with the template regardless of its resolution.
 */
export function TemplateFieldEditor({
  templateUrl,
  fields,
  onChange,
}: TemplateFieldEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  const updateField = (key: string, patch: Partial<CertFieldPlacement>) => {
    onChange(fields.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  };

  const removeField = (key: string) => {
    onChange(fields.filter((f) => f.key !== key));
  };

  const addCustomField = () => {
    const label = window.prompt("Field label (e.g. Course, Grade, Score)");
    if (!label?.trim()) return;
    const key = slugify(label);
    if (fields.some((f) => f.key === key)) {
      window.alert("A field with that name already exists.");
      return;
    }
    onChange([
      ...fields,
      {
        key,
        label: label.trim(),
        xPct: 50,
        yPct: 50,
        fontSize: 16,
        color: "#1a1a1a",
        align: "center" as TextAlign,
        removable: true,
      },
    ]);
  };

  const pointerToPct = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const xPct = Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100)
    );
    const yPct = Math.min(
      100,
      Math.max(0, ((clientY - rect.top) / rect.height) * 100)
    );
    return { xPct, yPct };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingKey) return;
    const pct = pointerToPct(e.clientX, e.clientY);
    if (!pct) return;
    updateField(draggingKey, pct);
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDraggingKey(null)}
        onPointerLeave={() => setDraggingKey(null)}
        className="relative w-full select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      >
        <img
          src={templateUrl}
          alt="Certificate template"
          className="pointer-events-none block w-full"
          draggable={false}
        />
        {fields.map((field) => (
          <div
            key={field.key}
            onPointerDown={(e) => {
              e.preventDefault();
              setDraggingKey(field.key);
            }}
            style={{
              position: "absolute",
              left: `${field.xPct}%`,
              top: `${field.yPct}%`,
              transform: "translate(-50%, -50%)",
              color: field.color,
              fontSize: Math.min(field.fontSize, 22),
              fontWeight: field.bold ? 700 : 400,
            }}
            className="flex cursor-grab items-center gap-1 whitespace-nowrap rounded-md border border-dashed border-indigo-400 bg-white/80 px-2 py-1 text-xs shadow-sm active:cursor-grabbing"
          >
            <GripVertical className="h-3 w-3 shrink-0 text-indigo-400" />
            {field.label}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.key}
            className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-5"
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs text-slate-500">Label</label>
              <Input
                value={field.label}
                onChange={(e) =>
                  updateField(field.key, { label: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">
                Font size
              </label>
              <Input
                type="number"
                min={8}
                max={96}
                value={field.fontSize}
                onChange={(e) =>
                  updateField(field.key, {
                    fontSize: Number(e.target.value) || field.fontSize,
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Color</label>
              <input
                type="color"
                value={field.color}
                onChange={(e) =>
                  updateField(field.key, { color: e.target.value })
                }
                className="h-9 w-full cursor-pointer rounded-md border border-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Align</label>
              <Select
                value={field.align}
                onChange={(e) =>
                  updateField(field.key, {
                    align: e.target.value as TextAlign,
                  })
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Select>
            </div>
            <div className="flex items-end justify-between gap-2">
              <button
                type="button"
                onClick={() => updateField(field.key, { bold: !field.bold })}
                className={`flex h-9 flex-1 items-center justify-center gap-1 rounded-md border text-xs font-medium ${
                  field.bold
                    ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <Bold className="h-3.5 w-3.5" />
                Bold
              </button>
              {field.removable && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeField(field.key)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={addCustomField}
      >
        Add custom field
      </Button>
      <p className="text-xs text-slate-400">
        Drag any label directly on the template to reposition it. Custom fields
        (e.g. "Course", "Score") can later be mapped to a CSV column when you
        import attendees.
      </p>
    </div>
  );
}
