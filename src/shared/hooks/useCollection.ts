import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export interface WithId {
  id: string;
}

interface UseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Subscribe to a Firestore collection in real time with correct listener
 * cleanup. Centralizes the `onSnapshot` + `return () => unsub()` pattern so
 * pages don't leak listeners or forget error handling.
 *
 * @example const { data: events, loading } = useCollection<Event>("events", orderBy("date", "desc"));
 */
export function useCollection<T extends WithId>(
  path: string,
  ...constraints: QueryConstraint[]
): UseCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Constraints are passed as a rest arg (new array each render); serialize a
  // stable key so the effect only re-subscribes when they actually change.
  const constraintsKey = useMemo(
    () => JSON.stringify(constraints.map((c) => ({ ...c }))),
    [constraints]
  );

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, path), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T)
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, constraintsKey]);

  return { data, loading, error };
}
