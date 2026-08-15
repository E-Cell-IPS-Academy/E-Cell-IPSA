import { Badge } from "@/shared/ui";
import { STATUS_TONE, USER_TYPE_TONE } from "../types";
import type { UserStatus, UserType } from "../types";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function UserTypeBadge({ type }: { type: UserType }) {
  return <Badge tone={USER_TYPE_TONE[type]}>{cap(type)}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{cap(status)}</Badge>;
}
