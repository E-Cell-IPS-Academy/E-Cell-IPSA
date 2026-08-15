import { Badge } from "@/shared/ui";
import { STATUS_TONE } from "../types";
import type { EventStatus } from "../types";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
