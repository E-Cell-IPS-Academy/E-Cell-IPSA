"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  IGNITEX_SPEAKER_SESSION,
  type IgnitexCompetition,
  type IgnitexCompetitionRegistration,
  type IgnitexEventStatus,
  type IgnitexSettings,
  type IgnitexSpeakerRegistration,
  type IgnitexSpeakerRegistrationFormValues,
} from "./types";

// Separate collection from VyaparX; doc holds all IgniteX events via eventType.
const COLLECTION = "ignitexRegistrations";

export class DuplicateRegistrationError extends Error {
  constructor() {
    super("This email is already registered for the Speaker Session.");
    this.name = "DuplicateRegistrationError";
  }
}

/** Deterministic id => one registration per email per event. */
function registrationId(eventType: string, email: string): string {
  return `${eventType}__${email.trim().toLowerCase()}`.replace(/[/\s]/g, "_");
}

export async function submitSpeakerRegistration(
  values: IgnitexSpeakerRegistrationFormValues
): Promise<void> {
  const email = values.email.trim().toLowerCase();
  const ref = doc(
    db,
    COLLECTION,
    registrationId(IGNITEX_SPEAKER_SESSION, email)
  );

  // Friendly duplicate check. If rules disallow public reads this is skipped
  // and the deterministic id still prevents duplicate records.
  try {
    const existing = await getDoc(ref);
    if (existing.exists()) throw new DuplicateRegistrationError();
  } catch (err) {
    if (err instanceof DuplicateRegistrationError) throw err;
  }

  await setDoc(ref, {
    name: values.name.trim(),
    year: values.year,
    branch: values.branch.trim(),
    enrollmentNo: values.enrollmentNo.trim(),
    phone: values.phone.trim(),
    email,
    gender: values.gender,
    collegeName: values.collegeName,
    eventType: IGNITEX_SPEAKER_SESSION,
    createdAt: serverTimestamp(),
  });
}

/**
 * All speaker-session registrations, newest first. Sorted client-side so no
 * composite Firestore index is required.
 */
export async function listSpeakerRegistrations(): Promise<
  IgnitexSpeakerRegistration[]
> {
  const q = query(
    collection(db, COLLECTION),
    where("eventType", "==", IGNITEX_SPEAKER_SESSION)
  );
  const snap = await getDocs(q);
  const regs = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as IgnitexSpeakerRegistration[];
  return regs.sort(
    (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  );
}

// ---------------------------------------------------------------------------
// Admin: settings + CSV
// ---------------------------------------------------------------------------

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC_ID = "ignitex";

export async function getIgnitexSettings(): Promise<IgnitexSettings> {
  const snap = await getDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID));
  const data = snap.data();
  return {
    registrationOpen: data?.registrationOpen !== false,
    // No settings doc yet => the form is live ("started").
    eventStatus: (data?.eventStatus as IgnitexEventStatus) ?? "started",
  };
}

export async function saveIgnitexSettings(input: {
  registrationOpen: boolean;
  eventStatus: IgnitexEventStatus;
}): Promise<void> {
  await setDoc(
    doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID),
    {
      registrationOpen: input.registrationOpen,
      eventStatus: input.eventStatus,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

const csvCell = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export function registrationsToCsv(regs: IgnitexSpeakerRegistration[]): string {
  const headers = [
    "Name",
    "Year",
    "Branch",
    "Enrollment No / Computer Code",
    "Phone",
    "Email",
    "Gender",
    "College Name",
    "Event",
    "Registered At",
  ];
  const rows = regs.map((r) =>
    [
      r.name,
      r.year,
      r.branch,
      r.enrollmentNo,
      r.phone,
      r.email,
      r.gender,
      r.collegeName,
      r.eventType,
      r.createdAt ? r.createdAt.toDate().toLocaleString() : "",
    ]
      .map(csvCell)
      .join(",")
  );
  return [headers.map(csvCell).join(","), ...rows].join("\n");
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Competition (team) registrations
// ---------------------------------------------------------------------------

const COMPETITION_COLLECTION = "ignitexCompetitionRegistrations";

export class DuplicateTeamError extends Error {
  constructor() {
    super("A team with this leader email is already registered for this competition.");
    this.name = "DuplicateTeamError";
  }
}

/** members[0] is the team leader. One team per leader email per competition. */
export async function submitCompetitionRegistration(
  competition: IgnitexCompetition,
  members: IgnitexSpeakerRegistrationFormValues[]
): Promise<void> {
  const cleaned = members.map((m) => ({
    name: m.name.trim(),
    year: m.year,
    branch: m.branch.trim(),
    enrollmentNo: m.enrollmentNo.trim(),
    phone: m.phone.trim(),
    email: m.email.trim().toLowerCase(),
    gender: m.gender,
    collegeName: m.collegeName,
  }));
  const leaderEmail = cleaned[0].email;
  const ref = doc(
    db,
    COMPETITION_COLLECTION,
    registrationId(competition.eventType, leaderEmail)
  );

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) throw new DuplicateTeamError();
  } catch (err) {
    if (err instanceof DuplicateTeamError) throw err;
  }

  await setDoc(ref, {
    eventType: competition.eventType,
    competitionTitle: competition.title,
    teamSize: competition.teamSize,
    leaderEmail,
    members: cleaned,
    createdAt: serverTimestamp(),
  });
}

/** Admin: all competition team registrations, newest first. */
export async function listCompetitionRegistrations(): Promise<
  IgnitexCompetitionRegistration[]
> {
  const snap = await getDocs(collection(db, COMPETITION_COLLECTION));
  const regs = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as IgnitexCompetitionRegistration[];
  return regs.sort(
    (a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  );
}

/** One row per team; each member's details sit in their own columns. */
export function competitionRegistrationsToCsv(
  regs: IgnitexCompetitionRegistration[]
): string {
  const memberHeaders = (n: number) => [
    `Member ${n} Name`,
    `Member ${n} Year`,
    `Member ${n} Branch`,
    `Member ${n} Enrollment No`,
    `Member ${n} Phone`,
    `Member ${n} Email`,
    `Member ${n} Gender`,
    `Member ${n} College`,
  ];
  const headers = [
    "Competition",
    ...memberHeaders(1),
    ...memberHeaders(2),
    "Registered At",
  ];
  const memberCells = (m?: IgnitexSpeakerRegistrationFormValues) => [
    m?.name ?? "",
    m?.year ?? "",
    m?.branch ?? "",
    m?.enrollmentNo ?? "",
    m?.phone ?? "",
    m?.email ?? "",
    m?.gender ?? "",
    m?.collegeName ?? "",
  ];
  const rows = regs.map((r) =>
    [
      r.competitionTitle,
      ...memberCells(r.members?.[0]),
      ...memberCells(r.members?.[1]),
      r.createdAt ? r.createdAt.toDate().toLocaleString() : "",
    ]
      .map(csvCell)
      .join(",")
  );
  return [headers.map(csvCell).join(","), ...rows].join("\n");
}
