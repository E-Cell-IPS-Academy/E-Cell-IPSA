import { Badge } from "@/shared/ui";

export function SubmissionStatusBadge({ read }: { read: boolean }) {
  return (
    <Badge tone={read ? "neutral" : "info"}>{read ? "Read" : "Unread"}</Badge>
  );
}
