import { useMemo, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useAdminStartups } from "./hooks/useAdminStartups";
import { StartupCard } from "./components/StartupCard";
import { StartupForm } from "./components/StartupForm";
import { StartupDetails } from "./components/StartupDetails";
import { EMPTY_STARTUP, STARTUP_STATUSES } from "./types";
import type { Startup, StartupFormValues } from "./types";

type ModalMode = "create" | "edit" | "view" | null;

const toFormValues = (s: Startup): StartupFormValues => ({
  name: s.name,
  description: s.description,
  shortDescription: s.shortDescription,
  logo: s.logo ?? "",
  logoPublicId: s.logoPublicId ?? "",
  coverImage: s.coverImage ?? "",
  coverImagePublicId: s.coverImagePublicId ?? "",
  industry: s.industry,
  foundedYear: s.foundedYear,
  location: s.location,
  website: s.website ?? "",
  status: s.status,
  fundingStage: s.fundingStage,
  fundingAmount: s.fundingAmount ?? 0,
  employeeCount: s.employeeCount ?? 0,
  founders: s.founders ?? [],
  achievements: s.achievements ?? [],
  problem: s.problem,
  solution: s.solution,
  businessModel: s.businessModel,
  targetMarket: s.targetMarket,
  socialLinks: s.socialLinks ?? {},
  featuredDate: s.featuredDate ?? "",
  isActive: s.isActive,
});

const STAT_CARDS = [
  { key: "total", label: "Total", format: (v: number) => String(v) },
  { key: "featured", label: "Featured", format: (v: number) => String(v) },
  { key: "upcoming", label: "Upcoming", format: (v: number) => String(v) },
  { key: "past", label: "Past", format: (v: number) => String(v) },
  {
    key: "totalFunding",
    label: "Total funding",
    format: (v: number) => `$${v.toLocaleString()}`,
  },
] as const;

export function StartupsAdminPage() {
  const { startups, loading, stats, create, update, remove } =
    useAdminStartups();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Startup | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Startup | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return startups.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.industry.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [startups, search, statusFilter]);

  const closeModal = () => {
    setMode(null);
    setSelected(null);
  };

  const handleSubmit = async (values: StartupFormValues) => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await create(values);
        toast.success("Startup created");
      } else if (mode === "edit" && selected) {
        await update(selected.id, values);
        toast.success("Startup updated");
      }
      closeModal();
    } catch {
      toast.error(
        `Failed to ${mode === "create" ? "create" : "update"} startup`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("Startup deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete startup");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Startups"
        description="Manage featured startups and startup of the week."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelected(null);
              setMode("create");
            }}
          >
            Add startup
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-4">
            <p className="text-2xl font-semibold text-slate-900">
              {card.format(stats[card.key])}
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
              placeholder="Search startups…"
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
            {STARTUP_STATUSES.map((s) => (
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
          icon={<Building2 className="h-10 w-10" />}
          title="No startups found"
          description="Try adjusting your search, or add your first startup."
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelected(null);
                setMode("create");
              }}
            >
              Add startup
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((startup) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              onView={(s) => {
                setSelected(s);
                setMode("view");
              }}
              onEdit={(s) => {
                setSelected(s);
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
        title={mode === "edit" ? "Edit startup" : "Add startup"}
      >
        <StartupForm
          initialValues={selected ? toFormValues(selected) : EMPTY_STARTUP}
          submitLabel={mode === "edit" ? "Update startup" : "Create startup"}
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
        title={selected?.name ?? "Startup details"}
      >
        {selected && <StartupDetails startup={selected} />}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete startup"
        message={`Delete "${pendingDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
