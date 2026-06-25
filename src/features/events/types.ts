import type { Timestamp } from "firebase/firestore";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface Speaker {
  name: string;
  title: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
}

/** A single event document. Named `EventItem` to avoid shadowing the DOM `Event`. */
export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: EventStatus;
  attendees: number;
  maxAttendees: number;
  category: string;
  price?: number;
  image?: string;
  imagePublicId?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: string[];
  speakers?: Speaker[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Shape the create/edit form works with (no server-managed fields). */
export type EventFormValues = Omit<EventItem, "id" | "createdAt" | "updatedAt">;

export interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  totalAttendees: number;
}

export const EVENT_STATUSES: EventStatus[] = [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
];

export const EVENT_CATEGORIES = [
  "Conference",
  "Workshop",
  "Competition",
  "Networking",
  "Seminar",
];

export const STATUS_TONE: Record<
  EventStatus,
  "info" | "success" | "neutral" | "danger"
> = {
  upcoming: "info",
  ongoing: "success",
  completed: "neutral",
  cancelled: "danger",
};

export const EMPTY_EVENT: EventFormValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  status: "upcoming",
  attendees: 0,
  maxAttendees: 100,
  category: "",
  price: 0,
  image: "",
  imagePublicId: "",
  tags: [],
  requirements: [],
  agenda: [],
  speakers: [],
};
