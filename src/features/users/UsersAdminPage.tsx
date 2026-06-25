import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useUsers } from "./hooks/useUsers";
import { UsersTable } from "./components/UsersTable";
import { UserDetails } from "./components/UserDetails";
import { USER_STATUSES, USER_TYPES } from "./types";
import type { UserRecord, UserStatus } from "./types";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const STAT_CARDS = [
  { key: "total", label: "Total" },
  { key: "students", label: "Students" },
  { key: "entrepreneurs", label: "Entrepreneurs" },
  { key: "professionals", label: "Professionals" },
  { key: "alumni", label: "Alumni" },
  { key: "active", label: "Active" },
  { key: "verified", label: "Verified" },
  { key: "newThisMonth", label: "New this month" },
] as const;

export function UsersAdminPage() {
  const { users, loading, stats, remove, changeStatus, toggleVerification } =
    useUsers();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<UserRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.institution?.toLowerCase().includes(term) ||
        u.company?.toLowerCase().includes(term);
      const matchesType = typeFilter === "all" || u.userType === typeFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, search, typeFilter, statusFilter]);

  const handleStatusChange = async (user: UserRecord, status: UserStatus) => {
    try {
      await changeStatus(user.id, status);
      toast.success("User status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleVerification = async (user: UserRecord) => {
    try {
      await toggleVerification(user);
      toast.success(user.isVerified ? "User unverified" : "User verified");
      if (selected?.id === user.id) {
        setSelected({ ...user, isVerified: !user.isVerified });
      }
    } catch {
      toast.error("Failed to update verification");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await remove(pendingDelete.id);
      toast.success("User deleted");
      if (selected?.id === pendingDelete.id) setSelected(null);
      setPendingDelete(null);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage all registered users and their profiles."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
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
              placeholder="Search by name, email, institution, or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-44"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All types</option>
            {USER_TYPES.map((t) => (
              <option key={t} value={t}>
                {cap(t)}
              </option>
            ))}
          </Select>
          <Select
            className="sm:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {cap(s)}
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
          title="No users found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <UsersTable
          users={filtered}
          onView={setSelected}
          onDelete={setPendingDelete}
          onStatusChange={handleStatusChange}
          onToggleVerification={handleToggleVerification}
        />
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="xl"
        title={selected?.name ?? "User details"}
      >
        {selected && (
          <UserDetails
            user={selected}
            onToggleVerification={handleToggleVerification}
            onDelete={setPendingDelete}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete user"
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
