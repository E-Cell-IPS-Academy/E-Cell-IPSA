import { useMemo, useState } from "react";
import { Download, Inbox, Mail, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Spinner,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useContact } from "./hooks/useContact";
import { ContactSettingsForm } from "./components/ContactSettingsForm";
import { SubmissionsTable } from "./components/SubmissionsTable";
import { SubmissionDetails } from "./components/SubmissionDetails";
import { exportSubmissionsCsv } from "./csv";
import type { ContactData, ContactSubmission } from "./types";

type Tab = "settings" | "submissions";

const STAT_CARDS = [
  { key: "total", label: "Total" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
] as const;

export function ContactAdminPage() {
  const {
    contact,
    submissions,
    loadingContact,
    loadingSubmissions,
    stats,
    saveContact,
    markRead,
    removeSubmission,
  } = useContact();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("settings");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactSubmission | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.subject.toLowerCase().includes(term)
    );
  }, [submissions, search]);

  const handleSave = async (values: ContactData) => {
    setSaving(true);
    try {
      await saveContact(values);
      toast.success("Contact settings saved");
    } catch {
      toast.error("Failed to save contact settings");
    } finally {
      setSaving(false);
    }
  };

  const openSubmission = (sub: ContactSubmission) => {
    setViewing(sub);
    if (!sub.read) {
      markRead(sub.id)
        .then(() => setViewing((cur) => (cur ? { ...cur, read: true } : cur)))
        .catch(() => toast.error("Failed to mark as read"));
    }
  };

  const handleMarkRead = async (sub: ContactSubmission) => {
    try {
      await markRead(sub.id);
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await removeSubmission(pendingDelete.id);
      if (viewing?.id === pendingDelete.id) setViewing(null);
      toast.success("Submission deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete submission");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    exportSubmissionsCsv(submissions);
    toast.success("CSV exported");
  };

  return (
    <div>
      <PageHeader
        title="Contact"
        description="Manage public contact info and view form submissions."
        actions={
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
            <Button
              variant={tab === "settings" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("settings")}
            >
              Settings
            </Button>
            <Button
              variant={tab === "submissions" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("submissions")}
            >
              Submissions{stats.unread > 0 ? ` (${stats.unread})` : ""}
            </Button>
          </div>
        }
      />

      {tab === "settings" ? (
        loadingContact || !contact ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <ContactSettingsForm
            initialValues={contact}
            submitting={saving}
            onSubmit={handleSave}
          />
        )
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {STAT_CARDS.map((card) => (
              <Card key={card.key} className="p-4">
                <p className="text-2xl font-semibold text-slate-900">
                  {stats[card.key]}
                </p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </Card>
            ))}
          </div>

          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="Search submissions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExport}
                disabled={submissions.length === 0}
              >
                Export CSV
              </Button>
            </div>
          </Card>

          {loadingSubmissions ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-10 w-10" />}
              title="No submissions found"
              description="Contact-form submissions will appear here."
            />
          ) : (
            <SubmissionsTable
              submissions={filtered}
              onView={openSubmission}
              onMarkRead={handleMarkRead}
              onDelete={setPendingDelete}
            />
          )}
        </div>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        size="lg"
        title="Submission details"
        footer={
          viewing && (
            <>
              <Button
                variant="danger"
                onClick={() => setPendingDelete(viewing)}
              >
                Delete
              </Button>
              <a
                href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(
                  viewing.subject
                )}`}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                <Mail className="h-4 w-4" /> Reply
              </a>
            </>
          )
        }
      >
        {viewing && <SubmissionDetails sub={viewing} />}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete submission"
        message={`Delete the submission from "${pendingDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
