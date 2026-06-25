import { SubmissionStatusBadge } from "./SubmissionStatusBadge";
import { formatDateTime } from "../utils";
import type { ContactSubmission } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-800">
        {value || "—"}
      </dd>
    </div>
  );
}

/** Read-only details view for a submission (shown in the modal). */
export function SubmissionDetails({ sub }: { sub: ContactSubmission }) {
  return (
    <div className="space-y-4">
      <SubmissionStatusBadge read={sub.read} />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" value={sub.name} />
        <Field label="Email" value={sub.email} />
        <Field label="Subject" value={sub.subject} />
        <Field label="Received" value={formatDateTime(sub.createdAt)} />
      </dl>

      <Field label="Message" value={sub.message} />
    </div>
  );
}
