import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/shared/ui";
import { EMPTY_MILESTONE } from "../types";
import type { MilestoneItem } from "../types";

interface MilestonesEditorProps {
  milestones: MilestoneItem[];
  onChange: (milestones: MilestoneItem[]) => void;
  onRemoveRequest: (index: number) => void;
}

/** Editable, reorderable list of timeline milestones. */
export function MilestonesEditor({
  milestones,
  onChange,
  onRemoveRequest,
}: MilestonesEditorProps) {
  const add = () => onChange([...milestones, { ...EMPTY_MILESTONE }]);

  const update = (index: number, field: keyof MilestoneItem, value: string) =>
    onChange(
      milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );

  const move = (index: number, dir: "up" | "down") => {
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= milestones.length) return;
    const next = [...milestones];
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones ({milestones.length})</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={add}
        >
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No milestones added yet
          </p>
        ) : (
          milestones.map((ms, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Milestone {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, "up")}
                    disabled={index === 0}
                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, "down")}
                    disabled={index === milestones.length - 1}
                    className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveRequest(index)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Remove milestone"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <Input
                  placeholder="Year"
                  value={ms.year}
                  onChange={(e) => update(index, "year", e.target.value)}
                />
                <div className="md:col-span-3">
                  <Input
                    placeholder="Title"
                    value={ms.title}
                    onChange={(e) => update(index, "title", e.target.value)}
                  />
                </div>
              </div>
              <Textarea
                rows={2}
                placeholder="Description…"
                value={ms.description}
                onChange={(e) => update(index, "description", e.target.value)}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
