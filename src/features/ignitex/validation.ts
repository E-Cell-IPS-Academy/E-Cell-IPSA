import type { IgnitexSpeakerRegistrationFormValues } from "./types";

type Member = IgnitexSpeakerRegistrationFormValues;

/** Validates one person's details. `prefix` namespaces keys, e.g. "m0.". */
export function validateMember(v: Member, prefix = ""): Record<string, string> {
  const e: Record<string, string> = {};
  const k = (key: string) => `${prefix}${key}`;
  if (!v.name.trim()) e[k("name")] = "Required";
  if (!v.year) e[k("year")] = "Required";
  if (!v.branch.trim()) e[k("branch")] = "Required";
  if (!v.enrollmentNo.trim()) e[k("enrollmentNo")] = "Required";
  if (!/^[6-9]\d{9}$/.test(normalizePhone(v.phone)))
    e[k("phone")] = "Enter a valid 10-digit phone number";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    e[k("email")] = "Enter a valid email address";
  if (!v.gender) e[k("gender")] = "Required";
  if (!v.collegeName) e[k("collegeName")] = "Required";
  return e;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "").replace(/^(\+91|91)/, "");
}
