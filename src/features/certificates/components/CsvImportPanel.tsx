import { useRef, useState } from "react";
import Papa from "papaparse";
import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { Button, Select } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { SYSTEM_FIELD_KEYS } from "../types";
import type { CertEvent } from "../types";
import type { IssueCertificateRow } from "../certificatesService";

interface CsvImportPanelProps {
  event: CertEvent;
  onImport: (rows: IssueCertificateRow[]) => Promise<number | void>;
}

const IGNORE = "__ignore__";

/**
 * Upload a CSV of attendees, map each column to a field on the event's
 * template (or ignore it), then bulk-issue certificates. Only the mapped
 * data + a generated ID are written to Firestore — the CSV file itself is
 * never uploaded anywhere, it's parsed entirely in the browser.
 */
export function CsvImportPanel({ event, onImport }: CsvImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);

  const mappableTargets = event.fields.filter(
    (f) =>
      !SYSTEM_FIELD_KEYS.includes(f.key as (typeof SYSTEM_FIELD_KEYS)[number])
  );

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedHeaders = results.meta.fields ?? [];
        setHeaders(parsedHeaders);
        setRows(results.data);

        // Best-effort auto-map: match header text to a field's key or label.
        const auto: Record<string, string> = {};
        parsedHeaders.forEach((h) => {
          const norm = h.trim().toLowerCase();
          const match = mappableTargets.find(
            (f) =>
              f.key.toLowerCase() === norm || f.label.toLowerCase() === norm
          );
          auto[h] = match?.key ?? IGNORE;
        });
        setMapping(auto);
      },
      error: (err) => {
        toast.error(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const nameHeader = Object.entries(mapping).find(
    ([, target]) => target === "name"
  )?.[0];

  const handleIssue = async () => {
    if (!nameHeader) {
      toast.error('Map one column to "Recipient Name" before issuing.');
      return;
    }
    const issueRows: IssueCertificateRow[] = rows.map((row) => {
      const data: Record<string, string> = {};
      Object.entries(mapping).forEach(([header, target]) => {
        if (target === IGNORE || target === "name") return;
        data[target] = row[header] ?? "";
      });
      return { name: row[nameHeader] ?? "", data };
    });

    setImporting(true);
    try {
      const count = await onImport(issueRows);
      toast.success(`Issued ${count ?? issueRows.length} certificate(s)`);
      setRows([]);
      setHeaders([]);
      setMapping({});
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("Failed to issue certificates");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!event.templateUrl && (
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
            : "Click to choose a CSV file"}
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
                  <option value="name">Recipient Name</option>
                  {mappableTargets
                    .filter((f) => f.key !== "name")
                    .map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
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

          <Button
            onClick={handleIssue}
            loading={importing}
            disabled={!event.templateUrl}
          >
            Issue {rows.length} Certificate{rows.length === 1 ? "" : "s"}
          </Button>
        </>
      )}
    </div>
  );
}
