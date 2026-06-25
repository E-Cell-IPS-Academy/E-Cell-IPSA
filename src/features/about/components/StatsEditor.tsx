import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";
import { EMPTY_STAT } from "../types";
import type { StatItem } from "../types";

interface StatsEditorProps {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
  onRemoveRequest: (index: number) => void;
}

/** Editable list of headline stats (label / value / icon). */
export function StatsEditor({
  stats,
  onChange,
  onRemoveRequest,
}: StatsEditorProps) {
  const add = () => onChange([...stats, { ...EMPTY_STAT }]);

  const update = (index: number, field: keyof StatItem, value: string) =>
    onChange(stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats ({stats.length})</CardTitle>
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
        {stats.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No stats added yet
          </p>
        ) : (
          stats.map((st, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Stat {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveRequest(index)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Input
                  placeholder="Label (e.g. Events)"
                  value={st.label}
                  onChange={(e) => update(index, "label", e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 50+)"
                  value={st.value}
                  onChange={(e) => update(index, "value", e.target.value)}
                />
                <Input
                  placeholder="Icon name (e.g. trophy)"
                  value={st.icon}
                  onChange={(e) => update(index, "icon", e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
