import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeStats,
  createBlog,
  deleteBlog,
  listBlogs,
  updateBlog,
} from "../blogService";
import type { BlogFormValues, BlogPost, BlogStatus } from "../types";

/**
 * Owns blog state and CRUD operations for the admin page. Operations throw on
 * failure so the page can surface a toast; the list reloads after each mutation.
 */
export function useAdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setBlogs(await listBlogs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(() => computeStats(blogs), [blogs]);

  const create = useCallback(
    async (values: BlogFormValues) => {
      await createBlog(values);
      await reload();
    },
    [reload]
  );

  const update = useCallback(
    async (id: string, values: Partial<BlogFormValues>) => {
      await updateBlog(id, values);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteBlog(id);
      await reload();
    },
    [reload]
  );

  const changeStatus = useCallback(
    (id: string, status: BlogStatus) => update(id, { status }),
    [update]
  );

  return {
    blogs,
    loading,
    stats,
    reload,
    create,
    update,
    remove,
    changeStatus,
  };
}
