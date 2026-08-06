import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  ImagePlus,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Spinner,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useCloudinaryUpload } from "@/shared/hooks";
import { useCertEventManager } from "./hooks/useCertEventManager";
import { TemplateFieldEditor } from "./components/TemplateFieldEditor";
import { CsvImportPanel } from "./components/CsvImportPanel";
import type { Certificate } from "./types";

type Tab = "template" | "import" | "certificates";

export function CertEventManagePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { upload, uploading, progress } = useCloudinaryUpload();

  const {
    event,
    certificates,
    loading,
    saveTemplate,
    saveFields,
    importRows,
    removeCertificate,
  } = useCertEventManager(eventId);

  const [tab, setTab] = useState<Tab>("template");
  const [pendingDelete, setPendingDelete] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleTemplateFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG or JPG).");
      return;
    }
    try {
      const result = await upload(file, {
        folder: "certificate-templates",
        resourceType: "image",
      });
      await saveTemplate({
        templateUrl: result.secureUrl,
        templateFormat: result.format === "png" ? "png" : "jpg",
        templateWidth: result.width ?? 0,
        templateHeight: result.height ?? 0,
      });
      toast.success("Template uploaded");
    } catch {
      toast.error("Failed to upload template");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await removeCertificate(pendingDelete.id);
      toast.success("Certificate deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete certificate");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <EmptyState
        icon={<Award className="h-10 w-10" />}
        title="Event not found"
        description="It may have been deleted."
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/certificates")}
        className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        All events
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <Award className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{event.name}</h1>
          {event.description && (
            <p className="text-sm text-slate-500">{event.description}</p>
          )}
        </div>
        <Badge tone="info" className="ml-auto">
          {certificates.length} issued
        </Badge>
      </div>

      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {(
          [
            { id: "template", label: "Template & Fields" },
            { id: "import", label: "Import Attendees" },
            { id: "certificates", label: "Issued Certificates" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "template" && (
        <Card className="p-5">
          {!event.templateUrl ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:border-slate-400">
              {uploading ? (
                <>
                  <Spinner />
                  <p className="text-sm text-slate-500">
                    Uploading… {progress}%
                  </p>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">
                    Upload certificate template
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG or JPG — this is the base design certificates are
                    generated on top of
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleTemplateFile(e.target.files?.[0])}
              />
            </label>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Drag fields to position them on the template
                </p>
                <label className="cursor-pointer">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    <UploadCloud className="h-3.5 w-3.5" />
                    Replace template
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleTemplateFile(e.target.files?.[0])}
                  />
                </label>
              </div>
              <TemplateFieldEditor
                templateUrl={event.templateUrl}
                fields={event.fields}
                onChange={(fields) => void saveFields(fields)}
              />
            </>
          )}
        </Card>
      )}

      {tab === "import" && (
        <Card className="p-5">
          <CsvImportPanel event={event} onImport={importRows} />
        </Card>
      )}

      {tab === "certificates" &&
        (certificates.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No certificates issued yet"
            description='Import a CSV of attendees from the "Import Attendees" tab.'
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Certificate ID</TH>
                <TH>Name</TH>
                <TH>Details</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {certificates.map((c) => (
                <TR key={c.id}>
                  <TD className="font-mono text-xs">{c.certificateId}</TD>
                  <TD className="font-medium text-slate-900">{c.name}</TD>
                  <TD>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(c.data).map(([k, v]) =>
                        v ? (
                          <Badge key={k} tone="neutral">
                            {k}: {v}
                          </Badge>
                        ) : null
                      )}
                    </div>
                  </TD>
                  <TD>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingDelete(c)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        ))}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete certificate"
        message={`Revoke the certificate for "${pendingDelete?.name}" (${pendingDelete?.certificateId})? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
