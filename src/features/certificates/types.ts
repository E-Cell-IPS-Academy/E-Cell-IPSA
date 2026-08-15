import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export type TextAlign = "left" | "center" | "right";

/** The built-in PDF fonts we expose — no font files to upload/embed, always available. */
export const FONT_FAMILIES = [
  { value: "helvetica", label: "Helvetica (Sans-serif)" },
  { value: "times", label: "Times New Roman (Serif)" },
  { value: "courier", label: "Courier (Monospace)" },
] as const;

export type FontFamily = (typeof FONT_FAMILIES)[number]["value"];

/** A positioned, single-line field (used for the Certificate ID). */
export interface CertFieldPlacement {
  xPct: number; // 0–100, left offset as % of template width
  yPct: number; // 0–100, top offset as % of template height
  fontSize: number;
  fontFamily: FontFamily;
  color: string; // hex
  align: TextAlign;
  bold?: boolean;
}

/** A positioned, word-wrapped paragraph block (used for the certificate body). */
export interface TextBlockPlacement extends CertFieldPlacement {
  widthPct: number; // 0–100, wrap width as % of template width
  lineHeightPct: number; // line spacing as % of template height
}

/** Token replaced with the recipient's salutation + name, e.g. "Mr. Rahul Sharma". */
export const NAME_TOKEN = "{{NAME}}";
/** Token replaced with the event's name, in both the certificate body and emails. */
export const EVENT_TOKEN = "{{EVENT}}";

export function defaultBodyTemplate(): string {
  return `This is to certify that ${NAME_TOKEN}, from IPS Academy, Institute of Engineering & Science, Indore, has actively participated in the event organized by the department. We appreciate their enthusiasm, collaborative spirit, and valuable contribution to the success of the event.`;
}

export function defaultBodyPlacement(): TextBlockPlacement {
  return {
    xPct: 50,
    yPct: 45,
    widthPct: 70,
    fontSize: 16,
    fontFamily: "helvetica",
    color: "#1a1a1a",
    align: "center",
    lineHeightPct: 5,
  };
}

export function defaultCertificateIdPlacement(): CertFieldPlacement {
  return {
    xPct: 50,
    yPct: 92,
    fontSize: 10,
    fontFamily: "helvetica",
    color: "#777777",
    align: "center",
  };
}

export function defaultEmailSubject(): string {
  return `Your certificate for ${EVENT_TOKEN} is ready`;
}

export function defaultEmailBody(): string {
  return `Hi ${NAME_TOKEN},\n\nYour certificate for ${EVENT_TOKEN} has been issued. Use the details below to download it any time.`;
}

/** An event under which certificates are issued (one template shared by all). */
export interface CertEvent extends WithId {
  name: string;
  description?: string;
  templateUrl: string;
  templateFormat: "png" | "jpg";
  templateWidth: number;
  templateHeight: number;
  /** Paragraph text with a {{NAME}} token — the only per-recipient merge field in the body. */
  bodyTemplate: string;
  bodyPlacement: TextBlockPlacement;
  certificateIdPlacement: CertFieldPlacement;
  /** Editable email subject/intro — supports {{NAME}} and {{EVENT}}. Sent as-is to the backend. */
  emailSubject: string;
  emailBody: string;
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
  salutation?: string;
  email: string;
  emailSentAt?: Timestamp;
  issuedAt?: Timestamp;
}

/** Result of a public download/verify lookup by certificate ID. */
export interface CertificateLookupResult {
  certificate: Certificate;
  event: CertEvent;
}

/** Merges salutation + name the same way everywhere {{NAME}} is substituted. */
export function mergedRecipientName(
  cert: Pick<Certificate, "name" | "salutation">
): string {
  return cert.salutation ? `${cert.salutation} ${cert.name}` : cert.name;
}
