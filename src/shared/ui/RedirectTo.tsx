"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side equivalent of react-router's `<Navigate to="..." replace />`.
 * Redirects on mount using the App Router, replacing the current history entry.
 */
export default function RedirectTo({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return null;
}
