import { useMemo, useState } from "react";
import { Download, Eye, Search, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useVyaparAdmin } from "./hooks/useVyaparAdmin";
import { downloadCsv, registrationsToCsv } from "./vyaparService";
import { STATUS_LABEL, VYAPAR_EVENT_NAME, VYAPAR_STATUSES } from "./type";
import type { VyaparRegistration, VyaparStatus } from "./type";

export function VyaparAdminPage() {
  const { registrations, status, loading, changeStatus, remove } =
    useVyaparAdmin();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<VyaparRegistration | null>(null);
  const [pendingDelete, setPendingDelete] = useState<VyaparRegistration | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(registrations.map((r) => r.category))).sort(),
    [registrations]
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return registrations.filter((r) => {
      const matchesSearch =
        r.startupName.toLowerCase().includes(term) ||
        r.leaderName.toLowerCase().includes(term) ||
        r.leaderEmail.toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "all" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [registrations, search, categoryFilter]);

  const handleStatusChange = async (next: VyaparStatus) => {
    setStatusSaving(true);
    try {
      await changeStatus(next);
      toast.success(`Registration status set to "${STATUS_LABEL[next]}"`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDownloadCsv = () => {
    if (registrations.length === 0) {
      toast.info("No responses to export yet");
      return;
    }
    const csv = registrationsToCsv(filtered);
    downloadCsv(
      csv,
      `vyapar-registrations-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("CSV downloaded");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("Registration deleted");
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete registration");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`${VYAPAR_EVENT_NAME} Registrations`}
        description="Control the registration page status and review submitted responses."
        actions={
          <Button
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleDownloadCsv}
          >
            Download CSV
          </Button>
        }
      />

      <Card className="mb-6 p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">
          Registration page status
        </p>
        <div className="flex flex-wrap gap-2">
          {VYAPAR_STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "primary" : "outline"}
              loading={statusSaving && status !== s}
              onClick={() => handleStatusChange(s)}
            >
              {STATUS_LABEL[s]}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The public <code>/register</code> page shows a "coming soon" screen
          while <strong>Upcoming</strong>, the live form while{" "}
          <strong>Started</strong>, and a "registration closed" screen once{" "}
          <strong>Ended</strong>.
        </p>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {registrations.length}
          </p>
          <p className="text-xs text-slate-500">Total responses</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {registrations.filter((r) => r.wantsMentorship === "Yes").length}
          </p>
          <p className="text-xs text-slate-500">Want mentorship</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {registrations.filter((r) => r.pitchedBefore === "Yes").length}
          </p>
          <p className="text-xs text-slate-500">Pitched before</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold text-slate-900">
            {categories.length}
          </p>
          <p className="text-xs text-slate-500">Categories represented</p>
        </Card>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by startup, leader name, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-56"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
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
          icon={<Users className="h-10 w-10" />}
          title="No responses found"
          description="Once teams start registering, their submissions will show up here."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Startup / Team</TH>
              <TH>Leader</TH>
              <TH>Contact</TH>
              <TH>Category</TH>
              <TH>Team size</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD className="font-medium text-slate-900">{r.startupName}</TD>
                <TD>{r.leaderName}</TD>
                <TD>
                  <div>{r.leaderEmail}</div>
                  <div className="text-xs text-slate-400">{r.leaderPhone}</div>
                </TD>
                <TD>
                  <Badge tone="info">
                    {r.category === "Others" && r.otherCategory
                      ? r.otherCategory
                      : r.category}
                  </Badge>
                </TD>
                <TD>{r.teamSize}</TD>
                <TD>
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(r)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPendingDelete(r)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="lg"
        title={selected?.startupName ?? "Registration details"}
      >
        {selected && (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Team Leader" value={selected.leaderName} />
              <Detail label="Email" value={selected.leaderEmail} />
              <Detail label="Phone" value={selected.leaderPhone} />
              <Detail
                label="College"
                value={
                  selected.collegeName === "Other" && selected.otherCollegeName
                    ? selected.otherCollegeName
                    : selected.collegeName
                }
              />
              <Detail label="Team Size" value={selected.teamSize} />
              <Detail
                label="Category"
                value={
                  selected.category === "Others" && selected.otherCategory
                    ? `${selected.category} — ${selected.otherCategory}`
                    : selected.category
                }
              />
              <Detail label="Pitched before?" value={selected.pitchedBefore} />
              <Detail
                label="Wants mentorship?"
                value={selected.wantsMentorship}
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Team Members ({selected.teamMembers.length})
              </p>
              {selected.teamMembers.length === 0 ? (
                <p className="mt-0.5 text-slate-500">No additional members</p>
              ) : (
                // ── UPDATED: show email instead of gender ──
                <ul className="mt-1 space-y-1">
                  {selected.teamMembers.map((m, i) => (
                    <li key={i} className="text-slate-800">
                      {i + 1}. {m.name}{" "}
                      <span className="text-slate-400">({m.email})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Detail
              label="Startup idea"
              value={selected.ideaDescription}
              block
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete registration"
        message={`Delete "${pendingDelete?.startupName}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function Detail({
  label,
  value,
  block = false,
}: {
  label: string;
  value: string;
  block?: boolean;
}) {
  return (
    <div className={block ? "col-span-full" : undefined}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap text-slate-800">{value}</p>
    </div>
  );
}
