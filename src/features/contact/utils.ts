import type { Timestamp } from "firebase/firestore";

/** Format a Firestore timestamp as a short locale date, or "—" when missing. */
export function formatDate(value?: Timestamp): string {
  if (!value) return "—";
  return new Date(value.seconds * 1000).toLocaleDateString();
}

/** Format a Firestore timestamp as a full locale date-time, or "Unknown". */
export function formatDateTime(value?: Timestamp): string {
  if (!value) return "Unknown";
  return new Date(value.seconds * 1000).toLocaleString();
}
