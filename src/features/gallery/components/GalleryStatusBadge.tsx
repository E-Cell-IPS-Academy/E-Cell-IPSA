import { Badge } from "@/shared/ui";
import { GALLERY_STATUS_TONE } from "../types";
import type { GalleryStatus } from "../types";

export function GalleryStatusBadge({ status }: { status: GalleryStatus }) {
  return (
    <Badge tone={GALLERY_STATUS_TONE[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
