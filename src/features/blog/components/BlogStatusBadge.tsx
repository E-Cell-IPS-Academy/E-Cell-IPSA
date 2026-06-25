import { Badge } from "@/shared/ui";
import { STATUS_TONE } from "../types";
import type { BlogStatus } from "../types";

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
