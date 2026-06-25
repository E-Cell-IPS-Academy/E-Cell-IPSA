import { useMemo, useState } from "react";
import { Calendar, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
  ConfirmDialog,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useEvents } from "./hooks/useEvents";
import { EventCard } from "./components/EventCard";
import { EventForm } from "./components/EventForm";
import { EventDetails } from "./components/EventDetails";
import { EMPTY_EVENT, EVENT_STATUSES } from "./types";
import type { EventFormValues, EventItem } from "./types";

type ModalMode = "create" | "edit" | "view" | null;

const toFormValues = (e: EventItem): EventFormValues => ({
  title: e.title,
  description: e.description,
  date: e.date,
  time: e.time,
  location: e.location,
  status: e.status,
  attendees: e.attendees,
  maxAttendees: e.maxAttendees,
  category: e.category,
  price: e.price ?? 0,
  image: e.image ?? "",
  imagePublicId: e.imagePublicId ?? "",
  tags: e.tags ?? [],
  requirements: e.requirements ?? [],
  agenda: e.agenda ?? [],
  speakers: e.speakers ?? [],
});

const STAT_CARDS = [
  { key: "total", label: "Total" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "totalAttendees", label: "Attendees" },
] as const;

export function EventsAdminPage() {
  const { events, loading, stats, create, update, remove } = useEvents();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const closeModal = () => {
    setMode(null);
    setSelected(null);
  };

  const handleSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await create(values);
        toast.success("Event created");
      } else if (mode === "edit" && selected) {
        await update(selected.id, values);
        toast.success("Event updated");
      }
      closeModal();
    } catch {
      toast.error(`Failed to ${mode === "create" ? "create" : "update"} event`);
    } finally {
      setSubmitting(false);
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
        title="Events"
        description="Create, manage, and monitor all E-Cell events."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelected(null);
              setMode("create");
            }}
          >
            Create event
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-4">
            <p className="text-2xl font-semibold text-slate-900">
              {stats[card.key]}
            </p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          title="No events found"
          description="Try adjusting your search, or create your first event."
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelected(null);
                setMode("create");
              }}
            >
              Create event
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={(e) => {
                setSelected(e);
                setMode("view");
              }}
              onEdit={(e) => {
                setSelected(e);
                setMode("edit");
              }}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={mode === "create" || mode === "edit"}
        onClose={closeModal}
        size="xl"
        title={mode === "edit" ? "Edit event" : "Create event"}
      >
        <EventForm
          initialValues={selected ? toFormValues(selected) : EMPTY_EVENT}
          submitLabel={mode === "edit" ? "Update event" : "Create event"}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          onError={(message) => toast.error(message)}
        />
      </Modal>

      <Modal
        open={mode === "view"}
        onClose={closeModal}
        size="lg"
        title={selected?.title ?? "Event details"}
      >
        {selected && <EventDetails event={selected} />}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete event"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
