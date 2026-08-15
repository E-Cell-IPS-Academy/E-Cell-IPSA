import { Badge } from "@/shared/ui";
import { STATUS_TONE } from "../types";
import type { StartupStatus } from "../types";

export function StartupStatusBadge({ status }: { status: StartupStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
