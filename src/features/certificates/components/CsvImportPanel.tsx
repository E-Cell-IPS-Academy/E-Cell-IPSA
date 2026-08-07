import { useRef, useState } from "react";
import Papa from "papaparse";
import { FileSpreadsheet, Mail, UploadCloud } from "lucide-react";
import { Button, Select } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import type { Certificate } from "../types";
import type { IssueCertificateRow } from "../certificatesService";

interface CsvImportPanelProps {
  hasTemplate: boolean;
  onImport: (rows: IssueCertificateRow[]) => Promise<Certificate[]>;
  onSendEmails: (
    certs: Certificate[]
  ) => Promise<{ sent: number; failed: number }>;
}

const IGNORE = "__ignore__";
const TARGETS = [
  { value: "name", label: "Full Name" },
  { value: "salutation", label: "Salutation (Mr./Ms.)" },
  { value: "email", label: "Email" },
];

/**
 * Upload a CSV of Name / Salutation / Email, map columns, then bulk-issue
 * certificates and optionally email each recipient their certificate ID +
 * download link. The CSV itself is parsed entirely in the browser and never
 * uploaded anywhere.
 */
export function CsvImportPanel({
  hasTemplate,
  onImport,
  onSendEmails,
}: CsvImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [issued, setIssued] = useState<Certificate[] | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedHeaders = results.meta.fields ?? [];
        setHeaders(parsedHeaders);
        setRows(results.data);
        setIssued(null);

        const auto: Record<string, string> = {};
        parsedHeaders.forEach((h) => {
          const norm = h.trim().toLowerCase();
          if (/^(full\s*)?name$/.test(norm)) auto[h] = "name";
          else if (/salut|title|mr\/ms|prefix/.test(norm))
            auto[h] = "salutation";
          else if (/email/.test(norm)) auto[h] = "email";
          else auto[h] = IGNORE;
        });
        setMapping(auto);
      },
      error: (err) => toast.error(`Failed to parse CSV: ${err.message}`),
    });
  };

  const headerFor = (target: string) =>
    Object.entries(mapping).find(([, t]) => t === target)?.[0];

  const handleIssue = async () => {
    const nameHeader = headerFor("name");
    const emailHeader = headerFor("email");
    if (!nameHeader || !emailHeader) {
      toast.error('Map one column to "Full Name" and one to "Email".');
      return;
    }
    const salutationHeader = headerFor("salutation");

    const issueRows: IssueCertificateRow[] = rows.map((row) => ({
      name: row[nameHeader] ?? "",
      salutation: salutationHeader ? (row[salutationHeader] ?? "") : "",
      email: row[emailHeader] ?? "",
    }));

    setImporting(true);
    try {
      const created = await onImport(issueRows);
      setIssued(created);
      toast.success(`Issued ${created.length} certificate(s)`);
    } catch {
      toast.error("Failed to issue certificates");
    } finally {
      setImporting(false);
    }
  };

  const handleSendEmails = async () => {
    if (!issued || issued.length === 0) return;
    setEmailing(true);
    try {
      const { sent, failed } = await onSendEmails(issued);
      if (failed === 0) {
        toast.success(`Emailed ${sent} recipient(s)`);
      } else {
        toast.error(`Emailed ${sent}, failed for ${failed}`);
      }
    } catch {
      toast.error(
        "Couldn't reach the email service. Check the backend is deployed and configured."
      );
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!hasTemplate && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Upload a certificate template first — imported attendees can't be
          issued certificates without one.
        </p>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 hover:border-slate-400"
      >
        <UploadCloud className="h-5 w-5" />
        <span className="text-sm font-medium">
          {headers.length > 0
            ? `${rows.length} row(s) loaded — click to replace`
            : "Click to choose a CSV file (Name, Salutation, Email)"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {headers.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Map CSV columns
            </p>
            {headers.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <div className="flex w-40 items-center gap-1.5 truncate text-sm text-slate-600">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-slate-400" />
                  {h}
                </div>
                <Select
                  className="flex-1"
                  value={mapping[h] ?? IGNORE}
                  onChange={(e) =>
                    setMapping((m) => ({ ...m, [h]: e.target.value }))
                  }
                >
                  <option value={IGNORE}>Ignore this column</option>
                  {TARGETS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {headers.map((h) => (
                      <td key={h} className="px-3 py-2 text-slate-600">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 5 && (
              <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-400">
                +{rows.length - 5} more row(s)
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleIssue}
              loading={importing}
              disabled={!hasTemplate}
            >
              Issue {rows.length} Certificate{rows.length === 1 ? "" : "s"}
            </Button>
            {issued && issued.length > 0 && (
              <Button
                variant="outline"
                leftIcon={<Mail className="h-4 w-4" />}
                loading={emailing}
                onClick={handleSendEmails}
              >
                Email {issued.length} Recipient{issued.length === 1 ? "" : "s"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
