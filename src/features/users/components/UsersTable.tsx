import { CheckCircle2, Eye, Trash2, User } from "lucide-react";
import {
  Badge,
  Button,
  Select,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/shared/ui";
import { UserTypeBadge } from "./UserBadges";
import { USER_STATUSES } from "../types";
import type { UserRecord, UserStatus } from "../types";

interface UsersTableProps {
  users: UserRecord[];
  onView: (user: UserRecord) => void;
  onDelete: (user: UserRecord) => void;
  onStatusChange: (user: UserRecord, status: UserStatus) => void;
  onToggleVerification: (user: UserRecord) => void;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Tabular list of users for the admin grid. */
export function UsersTable({
  users,
  onView,
  onDelete,
  onStatusChange,
  onToggleVerification,
}: UsersTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>User</TH>
          <TH>Type</TH>
          <TH>Affiliation</TH>
          <TH>Status</TH>
          <TH>Verified</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {users.map((user) => (
          <TR key={user.id}>
            <TD>
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {user.name || "Unknown user"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>
            </TD>
            <TD>
              <UserTypeBadge type={user.userType} />
            </TD>
            <TD className="text-slate-600">
              <span className="line-clamp-1">
                {user.institution || user.company || "—"}
              </span>
            </TD>
            <TD>
              <Select
                aria-label={`Status for ${user.name}`}
                className="w-32 py-1.5 text-xs"
                value={user.status}
                onChange={(e) =>
                  onStatusChange(user, e.target.value as UserStatus)
                }
              >
                {USER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {cap(s)}
                  </option>
                ))}
              </Select>
            </TD>
            <TD>
              {user.isVerified ? (
                <Badge tone="success">Verified</Badge>
              ) : (
                <span className="text-xs text-slate-400">No</span>
              )}
            </TD>
            <TD>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => onView(user)}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => onToggleVerification(user)}
                >
                  {user.isVerified ? "Unverify" : "Verify"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => onDelete(user)}
                >
                  Delete
                </Button>
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
