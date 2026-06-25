import { formatDate } from "./utils";
import type { ContactSubmission } from "./types";

const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** Build and trigger download of a CSV of all contact-form submissions. */
export function exportSubmissionsCsv(submissions: ContactSubmission[]): void {
  const headers = ["Name", "Email", "Subject", "Message", "Date", "Read"];
  const rows = submissions.map((s) => [
    escape(s.name),
    s.email,
    escape(s.subject),
    escape(s.message),
    formatDate(s.createdAt),
    s.read ? "Yes" : "No",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
