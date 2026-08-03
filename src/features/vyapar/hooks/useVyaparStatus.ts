import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { VyaparStatus } from "../type";

interface UseVyaparStatusResult {
  status: VyaparStatus;
  loading: boolean;
}

/**
 * Live subscription to the VyapaarX registration status (upcoming / started /
 * ended), so the public /register page updates immediately when an admin
 * changes it — no refresh needed. Defaults to "upcoming" until the doc loads
 * or if it has never been set.
 */
export function useVyaparStatus(): UseVyaparStatusResult {
  const [status, setStatus] = useState<VyaparStatus>("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "vyapar"),
      (snap) => {
        const data = snap.data();
        setStatus((data?.status as VyaparStatus) ?? "upcoming");
        setLoading(false);
      },
      () => {
        // If the read fails (e.g. rules), fail open to "upcoming" rather than
        // silently blocking the page.
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { status, loading };
}
