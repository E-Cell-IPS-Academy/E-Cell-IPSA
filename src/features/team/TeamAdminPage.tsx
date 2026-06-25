import { useMemo, useState } from "react";
import { FolderOpen, Plus, Search, Users } from "lucide-react";
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
import { useTeamAdmin } from "./hooks/useTeamAdmin";
import { TeamMemberCard } from "./components/TeamMemberCard";
import { TeamMemberForm } from "./components/TeamMemberForm";
import { TeamCategoryCard } from "./components/TeamCategoryCard";
import { TeamCategoryForm } from "./components/TeamCategoryForm";
import { EMPTY_TEAM_CATEGORY, EMPTY_TEAM_MEMBER } from "./types";
import type {
  TeamCategory,
  TeamCategoryFormValues,
  TeamMember,
  TeamMemberFormValues,
} from "./types";

type Tab = "members" | "categories";
type ModalMode = "create" | "edit" | null;

const memberToForm = (m: TeamMember): TeamMemberFormValues => ({
  name: m.name,
  position: m.position,
  category: m.category,
  isLead: m.isLead,
  photo: m.photo,
  photoPublicId: m.photoPublicId,
  bio: m.bio,
  email: m.email,
  socialLinks: { ...m.socialLinks },
  order: m.order,
  isActive: m.isActive,
});

const categoryToForm = (c: TeamCategory): TeamCategoryFormValues => ({
  name: c.name,
  icon: c.icon,
  description: c.description,
  order: c.order,
});

const STAT_CARDS = [
  { key: "totalMembers", label: "Members" },
  { key: "totalCategories", label: "Categories" },
  { key: "activeLeads", label: "Active leads" },
  { key: "activeMembers", label: "Active" },
  { key: "inactiveMembers", label: "Inactive" },
] as const;

export function TeamAdminPage() {
  const {
    members,
    categories,
    loading,
    stats,
    saveMember,
    removeMember,
    saveCategory,
    removeCategory,
    reorderCategory,
  } = useTeamAdmin();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("members");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const [memberMode, setMemberMode] = useState<ModalMode>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [pendingMember, setPendingMember] = useState<TeamMember | null>(null);

  const [categoryMode, setCategoryMode] = useState<ModalMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory | null>(
    null
  );
  const [pendingCategory, setPendingCategory] = useState<TeamCategory | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "Unknown";
  const categoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon ?? "Users";

  const filteredMembers = useMemo(() => {
    const term = search.toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(term) ||
        m.position.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "all" || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [members, search, categoryFilter]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  const handleMemberSubmit = async (values: TeamMemberFormValues) => {
    setSubmitting(true);
    try {
      await saveMember(values, selectedMember?.id);
      toast.success(memberMode === "edit" ? "Member updated" : "Member added");
      setMemberMode(null);
      setSelectedMember(null);
    } catch {
      toast.error("Failed to save team member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (values: TeamCategoryFormValues) => {
    setSubmitting(true);
    try {
      await saveCategory(values, selectedCategory?.id);
      toast.success(
        categoryMode === "edit" ? "Category updated" : "Category created"
      );
      setCategoryMode(null);
      setSelectedCategory(null);
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const requestDeleteCategory = (category: TeamCategory) => {
    const linked = members.filter((m) => m.category === category.id);
    if (linked.length > 0) {
      toast.error(
        `Cannot delete "${category.name}" — ${linked.length} member(s) assigned.`
      );
      return;
    }
    setPendingCategory(category);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (pendingMember) {
        await removeMember(pendingMember.id);
        toast.success("Member deleted");
        setPendingMember(null);
      } else if (pendingCategory) {
        await removeCategory(pendingCategory.id);
        toast.success("Category deleted");
        setPendingCategory(null);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const reorder = async (category: TeamCategory, direction: "up" | "down") => {
    try {
      await reorderCategory(category, direction);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage team categories, members, and their roles."
        actions={
          <>
            <Button
              variant="outline"
              leftIcon={<FolderOpen className="h-4 w-4" />}
              onClick={() => {
                setSelectedCategory(null);
                setCategoryMode("create");
              }}
            >
              Add category
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelectedMember(null);
                setMemberMode("create");
              }}
            >
              Add member
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-4">
            <p className="text-2xl font-semibold text-slate-900">
              {stats[card.key]}
            </p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {(["members", "categories"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors " +
              (tab === t
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100")
            }
          >
            {t === "members"
              ? `Members (${members.length})`
              : `Categories (${categories.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : tab === "members" ? (
        <>
          <Card className="mb-6 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="Search by name, role, email…"
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
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {filteredMembers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-10 w-10" />}
              title="No members found"
              description="Try adjusting your filters, or add your first team member."
              action={
                <Button
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedMember(null);
                    setMemberMode("create");
                  }}
                >
                  Add member
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  categoryName={categoryName(member.category)}
                  categoryIcon={categoryIcon(member.category)}
                  onEdit={(m) => {
                    setSelectedMember(m);
                    setMemberMode("edit");
                  }}
                  onDelete={setPendingMember}
                />
              ))}
            </div>
          )}
        </>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-10 w-10" />}
          title="No categories yet"
          description="Create categories to organize your team members."
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelectedCategory(null);
                setCategoryMode("create");
              }}
            >
              Create category
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((category) => (
            <TeamCategoryCard
              key={category.id}
              category={category}
              memberCount={
                members.filter((m) => m.category === category.id).length
              }
              leadCount={
                members.filter((m) => m.category === category.id && m.isLead)
                  .length
              }
              onEdit={(c) => {
                setSelectedCategory(c);
                setCategoryMode("edit");
              }}
              onDelete={requestDeleteCategory}
              onMoveUp={(c) => reorder(c, "up")}
              onMoveDown={(c) => reorder(c, "down")}
            />
          ))}
        </div>
      )}

      <Modal
        open={memberMode !== null}
        onClose={() => {
          setMemberMode(null);
          setSelectedMember(null);
        }}
        size="xl"
        title={memberMode === "edit" ? "Edit team member" : "Add team member"}
      >
        <TeamMemberForm
          initialValues={
            selectedMember ? memberToForm(selectedMember) : EMPTY_TEAM_MEMBER
          }
          categories={categories}
          submitLabel={memberMode === "edit" ? "Save changes" : "Add member"}
          submitting={submitting}
          onSubmit={handleMemberSubmit}
          onCancel={() => {
            setMemberMode(null);
            setSelectedMember(null);
          }}
          onError={(message) => toast.error(message)}
        />
      </Modal>

      <Modal
        open={categoryMode !== null}
        onClose={() => {
          setCategoryMode(null);
          setSelectedCategory(null);
        }}
        size="lg"
        title={categoryMode === "edit" ? "Edit category" : "Add category"}
      >
        <TeamCategoryForm
          initialValues={
            selectedCategory
              ? categoryToForm(selectedCategory)
              : { ...EMPTY_TEAM_CATEGORY, order: categories.length + 1 }
          }
          submitLabel={
            categoryMode === "edit" ? "Save changes" : "Create category"
          }
          submitting={submitting}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setCategoryMode(null);
            setSelectedCategory(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!pendingMember || !!pendingCategory}
        title={pendingMember ? "Delete member" : "Delete category"}
        message={`Delete "${
          pendingMember?.name ?? pendingCategory?.name
        }"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setPendingMember(null);
          setPendingCategory(null);
        }}
      />
    </div>
  );
}
