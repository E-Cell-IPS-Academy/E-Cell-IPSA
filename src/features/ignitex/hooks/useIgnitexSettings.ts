"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { IgnitexEventStatus } from "../types";

/**
 * Live subscription to settings/ignitex. The form is live only when the event
 * status is "started" (the default if never set) and registration is enabled.
 */
export function useIgnitexSettings(): {
  registrationOpen: boolean;
  status: IgnitexEventStatus;
  closedReason: string | null;
  loading: boolean;
} {
  const [status, setStatus] = useState<IgnitexEventStatus>("started");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "ignitex"),
      (snap) => {
        const data = snap.data();
        setStatus((data?.eventStatus as IgnitexEventStatus) ?? "started");
        setEnabled(data?.registrationOpen !== false);
        setLoading(false);
      },
      () => setLoading(false) // fail open
    );
    return () => unsub();
  }, []);

  let closedReason: string | null = null;
  if (status === "upcoming") {
    closedReason = "Speaker Session registration opens soon. Stay tuned!";
  } else if (status === "ended") {
    closedReason = "Registration for the Speaker Session has ended.";
  } else if (!enabled) {
    closedReason = "Registration for the Speaker Session is currently closed.";
  }

  return { registrationOpen: closedReason === null, status, closedReason, loading };
}
