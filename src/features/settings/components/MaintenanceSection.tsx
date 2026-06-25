import { Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { SiteSettings } from "../types";

interface MaintenanceSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

/** Maintenance-mode toggle and warning. */
export function MaintenanceSection({
  settings,
  onChange,
}: MaintenanceSectionProps) {
  const { maintenanceMode } = settings;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Site status
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Maintenance mode
            </p>
            <p className="text-xs text-slate-500">
              When enabled, visitors see a maintenance page.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={maintenanceMode}
            onClick={() => onChange({ maintenanceMode: !maintenanceMode })}
            className={maintenanceMode ? "text-red-600" : "text-slate-400"}
          >
            {maintenanceMode ? (
              <ToggleRight className="h-9 w-9" />
            ) : (
              <ToggleLeft className="h-9 w-9" />
            )}
          </button>
        </div>
        {maintenanceMode && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Warning: the website is currently in maintenance mode. Only admins
            can access the site.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
