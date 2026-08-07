import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ImagePlus,
  Mail,
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
import { CertificateLayoutEditor } from "./components/CertificateLayoutEditor";
import { EmailTemplateEditor } from "./components/EmailTemplateEditor";
import { CsvImportPanel } from "./components/CsvImportPanel";
import { pdfFileToPngFile } from "./pdfTemplateToImage";
import {
  mergedRecipientName,
  defaultEmailSubject,
  defaultEmailBody,
} from "./types";
import type {
  Certificate,
  CertFieldPlacement,
  TextBlockPlacement,
} from "./types";

type Tab = "template" | "email" | "import" | "certificates";

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
    saveLayout,
    saveEmailTemplate,
    importRows,
    sendEmails,
    removeCertificate,
  } = useCertEventManager(eventId);

  const [tab, setTab] = useState<Tab>("template");
  const [converting, setConverting] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [bulkSending, setBulkSending] = useState(false);

  const handleTemplateFile = async (file: File | undefined) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error("Please choose a PNG, JPG, or PDF file.");
      return;
    }

    try {
      let uploadFile = file;
      if (isPdf) {
        setConverting(true);
        uploadFile = await pdfFileToPngFile(file);
        setConverting(false);
      }
      const result = await upload(uploadFile, {
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
      setConverting(false);
      toast.error(
        isPdf
          ? "Couldn't convert that PDF. Try exporting page 1 as a PNG/JPG instead."
          : "Failed to upload template"
      );
    }
  };

  const handleSaveLayout = async (
    bodyTemplate: string,
    bodyPlacement: TextBlockPlacement,
    certificateIdPlacement: CertFieldPlacement
  ) => {
    setSavingLayout(true);
    try {
      await saveLayout(bodyTemplate, bodyPlacement, certificateIdPlacement);
      toast.success("Layout saved");
    } catch {
      toast.error("Failed to save layout");
    } finally {
      setSavingLayout(false);
    }
  };

  const handleSaveEmailTemplate = async (subject: string, body: string) => {
    setSavingEmail(true);
    try {
      await saveEmailTemplate(subject, body);
      toast.success("Email template saved");
    } catch {
      toast.error("Failed to save email template");
    } finally {
      setSavingEmail(false);
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

  const handleSendOne = async (cert: Certificate) => {
    setSendingIds((prev) => new Set(prev).add(cert.id));
    try {
      const { sent } = await sendEmails([cert]);
      if (sent > 0) toast.success(`Emailed ${cert.email}`);
      else toast.error(`Failed to email ${cert.email}`);
    } catch {
      toast.error(
        "Couldn't reach the email service. Check the backend is deployed and configured."
      );
    } finally {
      setSendingIds((prev) => {
        const next = new Set(prev);
        next.delete(cert.id);
        return next;
      });
    }
  };

  const unsentCertificates = certificates.filter((c) => !c.emailSentAt);

  const handleSendAllUnsent = async () => {
    if (unsentCertificates.length === 0) return;
    setBulkSending(true);
    try {
      const { sent, failed } = await sendEmails(unsentCertificates);
      if (failed === 0) toast.success(`Emailed ${sent} recipient(s)`);
      else toast.error(`Emailed ${sent}, failed for ${failed}`);
    } catch {
      toast.error(
        "Couldn't reach the email service. Check the backend is deployed and configured."
      );
    } finally {
      setBulkSending(false);
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
            { id: "template", label: "Template & Layout" },
            { id: "email", label: "Email Template" },
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
              {uploading || converting ? (
                <>
                  <Spinner />
                  <p className="text-sm text-slate-500">
                    {converting
                      ? "Converting PDF page 1…"
                      : `Uploading… ${progress}%`}
                  </p>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">
                    Upload certificate template
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, or PDF — this is the base design certificates are
                    generated on top of. PDFs are converted to an image
                    automatically (page 1 only).
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleTemplateFile(e.target.files?.[0])}
              />
            </label>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Position the body text and certificate ID
                </p>
                <label className="cursor-pointer">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    <UploadCloud className="h-3.5 w-3.5" />
                    Replace template
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleTemplateFile(e.target.files?.[0])}
                  />
                </label>
              </div>
              <CertificateLayoutEditor
                key={event.id}
                templateUrl={event.templateUrl}
                templateWidth={event.templateWidth}
                bodyTemplate={event.bodyTemplate}
                bodyPlacement={event.bodyPlacement}
                certificateIdPlacement={event.certificateIdPlacement}
                saving={savingLayout}
                onSave={handleSaveLayout}
              />
            </>
          )}
        </Card>
      )}

      {tab === "email" && (
        <EmailTemplateEditor
          key={event.id}
          emailSubject={event.emailSubject || defaultEmailSubject()}
          emailBody={event.emailBody || defaultEmailBody()}
          saving={savingEmail}
          onSave={handleSaveEmailTemplate}
        />
      )}

      {tab === "import" && (
        <Card className="p-5">
          <CsvImportPanel
            hasTemplate={!!event.templateUrl}
            onImport={importRows}
            onSendEmails={(certs) => sendEmails(certs)}
          />
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
          <>
            {unsentCertificates.length > 0 && (
              <div className="mb-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Mail className="h-4 w-4" />}
                  loading={bulkSending}
                  onClick={handleSendAllUnsent}
                >
                  Email All Unsent ({unsentCertificates.length})
                </Button>
              </div>
            )}
            <Table>
              <THead>
                <TR>
                  <TH>Certificate ID</TH>
                  <TH>Name</TH>
                  <TH>Email</TH>
                  <TH>Emailed</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {certificates.map((c) => (
                  <TR key={c.id}>
                    <TD className="font-mono text-xs">{c.certificateId}</TD>
                    <TD className="font-medium text-slate-900">
                      {mergedRecipientName(c)}
                    </TD>
                    <TD>{c.email}</TD>
                    <TD>
                      {c.emailSentAt ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Sent
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Not yet</span>
                      )}
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={sendingIds.has(c.id)}
                          onClick={() => handleSendOne(c)}
                        >
                          <Mail className="h-4 w-4 text-indigo-500" />
                        </Button>
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
          </>
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
