import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export const IGNITEX_EVENT_NAME = "IgniteX 3.O";

/** Event identifier stored on every registration document. */
export const IGNITEX_SPEAKER_SESSION = "ignitex-speaker-session";

export const IGNITEX_SPEAKER_DATE_LABEL = "12 October";
export const IGNITEX_COMPETITION_DATE_LABEL = "10 October";

export const IGNITEX_COLLEGE_OPTIONS = [
  "IPS Academy Indore — Main Campus",
  "IPS Academy — Off Campus",
] as const;

export const IGNITEX_GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export const IGNITEX_YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

export interface IgnitexSpeakerRegistrationFormValues {
  name: string;
  year: string;
  branch: string;
  enrollmentNo: string;
  phone: string;
  email: string;
  gender: string;
  collegeName: string;
}

export interface IgnitexSpeakerRegistration
  extends WithId,
    IgnitexSpeakerRegistrationFormValues {
  eventType: typeof IGNITEX_SPEAKER_SESSION;
  createdAt?: Timestamp;
}

export const EMPTY_IGNITEX_SPEAKER_REGISTRATION: IgnitexSpeakerRegistrationFormValues =
  {
    name: "",
    year: "",
    branch: "",
    enrollmentNo: "",
    phone: "",
    email: "",
    gender: "",
    collegeName: "",
  };

/**
 * Settings doc (settings/ignitex). Status drives the public page:
 * upcoming = "opens soon", started = live form, ended = closed.
 */
export interface IgnitexSettings {
  registrationOpen: boolean;
  eventStatus?: IgnitexEventStatus;
}

export type IgnitexEventStatus = "upcoming" | "started" | "ended";

export const IGNITEX_EVENT_STATUSES: IgnitexEventStatus[] = [
  "upcoming",
  "started",
  "ended",
];

export const IGNITEX_STATUS_LABEL: Record<IgnitexEventStatus, string> = {
  upcoming: "Upcoming",
  started: "Started",
  ended: "Ended",
};
