import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeStats,
  deleteUser,
  listUsers,
  updateUser,
} from "../usersService";
import type { UserRecord, UserStatus } from "../types";

/**
 * Owns users state and operations for the admin page. Operations throw on
 * failure so the page can surface a toast; the list reloads after each mutation.
 */
export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await listUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(() => computeStats(users), [users]);

  const update = useCallback(
    async (id: string, values: Partial<UserRecord>) => {
      await updateUser(id, values);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteUser(id);
      await reload();
    },
    [reload]
  );

  const changeStatus = useCallback(
    (id: string, status: UserStatus) => update(id, { status }),
    [update]
  );

  const toggleVerification = useCallback(
    (user: UserRecord) => update(user.id, { isVerified: !user.isVerified }),
    [update]
  );

  return {
    users,
    loading,
    stats,
    reload,
    update,
    remove,
    changeStatus,
    toggleVerification,
  };
}
