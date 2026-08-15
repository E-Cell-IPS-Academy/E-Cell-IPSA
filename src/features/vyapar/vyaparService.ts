"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type {
  VyaparRegistration,
  VyaparRegistrationFormValues,
  VyaparStatus,
} from "./type";

const COLLECTION = "vyaparRegistrations";
const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC_ID = "vyapar";

export async function submitVyaparRegistration(
  values: VyaparRegistrationFormValues
): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
  });
}

export async function listVyaparRegistrations(): Promise<VyaparRegistration[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as VyaparRegistration[];
}

export async function deleteVyaparRegistration(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function getVyaparStatus(): Promise<VyaparStatus> {
  const snap = await getDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID));
  const status = snap.exists() ? (snap.data().status as VyaparStatus) : null;
  return status ?? "upcoming";
}

export async function setVyaparStatus(status: VyaparStatus): Promise<void> {
  await setDoc(
    doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID),
    { status, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export function registrationsToCsv(regs: VyaparRegistration[]): string {
  const headers = [
    "Startup / Team Name",
    "Team Leader's Full Name",
    "Team Leader's Email",
    "Team Leader's Phone",
    "College",
    "Number of Team Members",
    "Team Member Names & Emails",
    "Startup Category",
    "Other Category",
    "Idea Description",
    "Pitched Before",
    "Wants Mentorship",
    "Submitted At",
  ];

  const escape = (value: unknown): string =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const formatCollege = (r: VyaparRegistration): string =>
    r.collegeName === "Other" && r.otherCollegeName
      ? r.otherCollegeName
      : r.collegeName;

  // Updated to use email instead of gender
  const formatMembers = (r: VyaparRegistration): string =>
    (r.teamMembers ?? []).map((m) => `${m.name} (${m.email})`).join("; ");

  const rows = regs.map((r) =>
    [
      r.startupName,
      r.leaderName,
      r.leaderEmail,
      r.leaderPhone,
      formatCollege(r),
      r.teamSize,
      formatMembers(r),
      r.category,
      r.otherCategory ?? "",
      r.ideaDescription,
      r.pitchedBefore,
      r.wantsMentorship,
      r.createdAt?.toDate?.().toLocaleString() ?? "",
    ]
      .map(escape)
      .join(",")
  );

  return [headers.map(escape).join(","), ...rows].join("\r\n");
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
