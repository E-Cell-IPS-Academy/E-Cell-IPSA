import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeStats,
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
} from "../eventsService";
import type { EventFormValues, EventItem, EventStatus } from "../types";

/**
 * Owns events state and CRUD operations for the admin page. Operations throw on
 * failure so the page can surface a toast; the list reloads after each mutation.
 */
export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await listEvents());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(() => computeStats(events), [events]);

  const create = useCallback(
    async (values: EventFormValues) => {
      await createEvent(values);
      await reload();
    },
    [reload]
  );

  const update = useCallback(
    async (id: string, values: Partial<EventFormValues>) => {
      await updateEvent(id, values);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteEvent(id);
      await reload();
    },
    [reload]
  );

  const changeStatus = useCallback(
    (id: string, status: EventStatus) => update(id, { status }),
    [update]
  );

  return {
    events,
    loading,
    stats,
    reload,
    create,
    update,
    remove,
    changeStatus,
  };
}
