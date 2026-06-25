import { MailOpen, Trash2 } from "lucide-react";
import { Button, Table, TBody, TD, TH, THead, TR } from "@/shared/ui";
import { SubmissionStatusBadge } from "./SubmissionStatusBadge";
import { formatDate } from "../utils";
import type { ContactSubmission } from "../types";

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onView: (sub: ContactSubmission) => void;
  onMarkRead: (sub: ContactSubmission) => void;
  onDelete: (sub: ContactSubmission) => void;
}

/** Data table of contact-form submissions. */
export function SubmissionsTable({
  submissions,
  onView,
  onMarkRead,
  onDelete,
}: SubmissionsTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Status</TH>
          <TH>Name</TH>
          <TH>Subject</TH>
          <TH>Received</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {submissions.map((sub) => (
          <TR
            key={sub.id}
            className="cursor-pointer"
            onClick={() => onView(sub)}
          >
            <TD>
              <SubmissionStatusBadge read={sub.read} />
            </TD>
            <TD>
              <span
                className={
                  sub.read ? "text-slate-700" : "font-semibold text-slate-900"
                }
              >
                {sub.name}
              </span>
              <span className="block text-xs text-slate-400">{sub.email}</span>
            </TD>
            <TD className="max-w-xs truncate">{sub.subject}</TD>
            <TD className="whitespace-nowrap text-slate-500">
              {formatDate(sub.createdAt)}
            </TD>
            <TD onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1">
                {!sub.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkRead(sub)}
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <MailOpen className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(sub)}
                  aria-label="Delete submission"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
