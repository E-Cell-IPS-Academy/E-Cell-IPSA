import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearOtherLeads,
  computeTeamStats,
  createCategory,
  createMember,
  deleteCategory,
  deleteMember,
  listCategories,
  listMembers,
  setMembersActive,
  swapCategoryOrder,
  updateCategory,
  updateMember,
} from "../teamService";
import type {
  TeamCategory,
  TeamCategoryFormValues,
  TeamMember,
  TeamMemberFormValues,
} from "../types";

/**
 * Owns admin state and CRUD operations for team members and categories.
 * Operations throw on failure so the page can surface a toast; lists reload
 * after each mutation.
 */
export function useTeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [nextMembers, nextCategories] = await Promise.all([
        listMembers(),
        listCategories(),
      ]);
      setMembers(nextMembers);
      setCategories(nextCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(
    () => computeTeamStats(members, categories),
    [members, categories]
  );

  // ── Members ─────────────────────────────────────────────────────────────
  const saveMember = useCallback(
    async (values: TeamMemberFormValues, id?: string) => {
      if (values.isLead && values.category) {
        await clearOtherLeads(members, values.category, id);
      }
      if (id) {
        await updateMember(id, values);
      } else {
        await createMember(values);
      }
      await reload();
    },
    [members, reload]
  );

  const removeMember = useCallback(
    async (id: string) => {
      await deleteMember(id);
      await reload();
    },
    [reload]
  );

  const bulkSetActive = useCallback(
    async (ids: string[], isActive: boolean) => {
      await setMembersActive(ids, isActive);
      await reload();
    },
    [reload]
  );

  // ── Categories ──────────────────────────────────────────────────────────
  const saveCategory = useCallback(
    async (values: TeamCategoryFormValues, id?: string) => {
      if (id) {
        await updateCategory(id, values);
      } else {
        await createCategory(values);
      }
      await reload();
    },
    [reload]
  );

  const removeCategory = useCallback(
    async (id: string) => {
      await deleteCategory(id);
      await reload();
    },
    [reload]
  );

  const reorderCategory = useCallback(
    async (category: TeamCategory, direction: "up" | "down") => {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((c) => c.id === category.id);
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= sorted.length) return;
      await swapCategoryOrder(sorted[index], sorted[swapIndex]);
      await reload();
    },
    [categories, reload]
  );

  return {
    members,
    categories,
    loading,
    stats,
    reload,
    saveMember,
    removeMember,
    bulkSetActive,
    saveCategory,
    removeCategory,
    reorderCategory,
  };
}
