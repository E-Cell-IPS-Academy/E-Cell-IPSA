import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

/** System fields are always auto-filled at PDF generation time — never CSV-mapped. */
export const SYSTEM_FIELD_KEYS = [
  "certificateId",
  "eventName",
  "issuedDate",
] as const;
export type SystemFieldKey = (typeof SYSTEM_FIELD_KEYS)[number];

/** The one field every event ships with by default besides the system ones. */
export const NAME_FIELD_KEY = "name" as const;

export type TextAlign = "left" | "center" | "right";

/** Where and how one field is drawn on the certificate template. */
export interface CertFieldPlacement {
  key: string; // "name" | "certificateId" | "eventName" | "issuedDate" | custom key
  label: string;
  xPct: number; // 0–100, left offset as % of template width
  yPct: number; // 0–100, top offset as % of template height
  fontSize: number;
  color: string; // hex, e.g. "#1a1a1a"
  align: TextAlign;
  bold?: boolean;
  /** Custom (non-system, non-name) fields can be removed; built-ins cannot. */
  removable?: boolean;
}

export function defaultFieldPlacements(): CertFieldPlacement[] {
  return [
    {
      key: NAME_FIELD_KEY,
      label: "Recipient Name",
      xPct: 50,
      yPct: 45,
      fontSize: 32,
      color: "#1a1a1a",
      align: "center",
      bold: true,
    },
    {
      key: "eventName",
      label: "Event Name",
      xPct: 50,
      yPct: 55,
      fontSize: 18,
      color: "#333333",
      align: "center",
    },
    {
      key: "issuedDate",
      label: "Issue Date",
      xPct: 50,
      yPct: 65,
      fontSize: 14,
      color: "#555555",
      align: "center",
    },
    {
      key: "certificateId",
      label: "Certificate ID",
      xPct: 50,
      yPct: 92,
      fontSize: 10,
      color: "#777777",
      align: "center",
    },
  ];
}

/** An event under which certificates are issued (one template shared by all). */
export interface CertEvent extends WithId {
  name: string;
  description?: string;
  templateUrl: string;
  templateFormat: "png" | "jpg";
  templateWidth: number;
  templateHeight: number;
  fields: CertFieldPlacement[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type CertEventFormValues = Pick<CertEvent, "name" | "description">;

export const EMPTY_CERT_EVENT: CertEventFormValues = {
  name: "",
  description: "",
};

/** A single issued certificate. Only data + ID are stored — never the rendered PDF. */
export interface Certificate extends WithId {
  eventId: string;
  eventName: string;
  certificateId: string;
  name: string;
  data: Record<string, string>;
  issuedAt?: Timestamp;
}

/** Result of a public download/verify lookup by certificate ID. */
export interface CertificateLookupResult {
  certificate: Certificate;
  event: CertEvent;
}
