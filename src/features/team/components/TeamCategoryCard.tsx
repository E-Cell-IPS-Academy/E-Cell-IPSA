import {
  ChevronDown,
  ChevronUp,
  Crown,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { Button, Card } from "@/shared/ui";
import { TeamIcon } from "./TeamIcon";
import type { TeamCategory } from "../types";

interface TeamCategoryCardProps {
  category: TeamCategory;
  memberCount: number;
  leadCount: number;
  onEdit: (category: TeamCategory) => void;
  onDelete: (category: TeamCategory) => void;
  onMoveUp: (category: TeamCategory) => void;
  onMoveDown: (category: TeamCategory) => void;
}

/** Single category tile for the admin grid. */
export function TeamCategoryCard({
  category,
  memberCount,
  leadCount,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: TeamCategoryCardProps) {
  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <TeamIcon name={category.icon} className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => onMoveUp(category)}
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => onMoveDown(category)}
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => onEdit(category)}
            aria-label="Edit category"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(category)}
            aria-label="Delete category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold text-slate-900">
        {category.name}
      </h3>
      {category.description && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {category.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-slate-400" />
          {memberCount} member{memberCount !== 1 && "s"}
        </span>
        {leadCount > 0 && (
          <span className="flex items-center gap-1.5 text-amber-600">
            <Crown className="h-4 w-4" />
            {leadCount} lead
          </span>
        )}
        <span className="ml-auto font-mono text-xs text-slate-400">
          #{category.order}
        </span>
      </div>
    </Card>
  );
}
