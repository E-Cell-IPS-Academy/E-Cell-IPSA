import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, FilePlus, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Spinner,
  Textarea,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useCertEvents } from "./hooks/useCertEvents";
import { EMPTY_CERT_EVENT } from "./types";
import type { CertEvent, CertEventFormValues } from "./types";

export function CertEventsAdminPage() {
  const { events, loading, create, remove } = useCertEvents();
  const navigate = useNavigate();
  const toast = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [values, setValues] = useState<CertEventFormValues>(EMPTY_CERT_EVENT);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CertEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async () => {
    if (!values.name.trim()) {
      toast.error("Event name is required");
      return;
    }
    setSaving(true);
    try {
      const id = await create(values);
      toast.success("Event created");
      setShowCreate(false);
      setValues(EMPTY_CERT_EVENT);
      navigate(`/admin/dashboard/certificates/${id}`);
    } catch {
      toast.error("Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("Event deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Create events, upload a template, import attendees, and issue certificates."
        actions={
          <Button
            leftIcon={<FilePlus className="h-4 w-4" />}
            onClick={() => setShowCreate(true)}
          >
            New Event
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Award className="h-10 w-10" />}
          title="No certificate events yet"
          description="Create one to upload a template and start issuing certificates."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className="cursor-pointer p-4 transition-shadow hover:shadow-md"
              onClick={() => navigate(`/admin/dashboard/certificates/${ev.id}`)}
            >
              <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {ev.templateUrl ? (
                  <img
                    src={ev.templateUrl}
                    alt={ev.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Award className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <h3 className="font-semibold text-slate-900">{ev.name}</h3>
              {ev.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                  {ev.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  Manage attendees
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDelete(ev);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New certificate event"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Event name
            </label>
            <Input
              value={values.name}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
              placeholder="e.g. Web Dev Bootcamp 2026"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description (optional)
            </label>
            <Textarea
              rows={3}
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete event"
        message={`Delete "${pendingDelete?.name}" and all its issued certificates? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
