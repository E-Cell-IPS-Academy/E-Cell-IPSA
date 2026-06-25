import {
  Building2,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { Button, Card } from "@/shared/ui";
import { StartupStatusBadge } from "./StartupStatusBadge";
import type { Startup } from "../types";

interface StartupCardProps {
  startup: Startup;
  onView: (startup: Startup) => void;
  onEdit: (startup: Startup) => void;
  onDelete: (startup: Startup) => void;
}

/** Single startup tile for the admin grid. */
export function StartupCard({
  startup,
  onView,
  onEdit,
  onDelete,
}: StartupCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-slate-100">
        {startup.coverImage ? (
          <img
            src={startup.coverImage}
            alt={startup.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Building2 className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StartupStatusBadge status={startup.status} />
        </div>
        {startup.industry && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
            {startup.industry}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          {startup.logo ? (
            <img
              src={startup.logo}
              alt={`${startup.name} logo`}
              className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <Building2 className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
              {startup.name}
            </h3>
            <p className="line-clamp-2 text-sm text-slate-500">
              {startup.shortDescription}
            </p>
          </div>
        </div>

        <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Founded {startup.foundedYear || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="line-clamp-1">{startup.location || "—"}</span>
          </div>
          {!!startup.fundingAmount && startup.fundingAmount > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span>${startup.fundingAmount.toLocaleString()}</span>
            </div>
          )}
          {!!startup.employeeCount && startup.employeeCount > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{startup.employeeCount} employees</span>
            </div>
          )}
        </dl>

        <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => onView(startup)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(startup)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(startup)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
