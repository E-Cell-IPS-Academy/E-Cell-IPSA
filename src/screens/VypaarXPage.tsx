"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  useVyaparStatus,
  submitVyaparRegistration,
  EMPTY_VYAPAR_REGISTRATION,
  VYAPAR_CATEGORIES,
  VYAPAR_EVENT_NAME,
  TEAM_SIZE_OPTIONS,
  COLLEGE_OPTIONS,
  emptyTeamMemberEntry,
} from "@/features/vyapar";
import type {
  VyaparRegistrationFormValues,
  TeamMemberEntry,
} from "@/features/vyapar";

// ── BMC image from Cloudinary ─────────────────────────────────────────
const BMC_IMAGE_URL =
  "https://res.cloudinary.com/dszmnqzhk/image/upload/v1786110806/ikz7imtyzgkagwz3abjo.png";

// ── Shared field styling ───────────────────────────────────────────────
const fieldClass =
  "w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-400/60 focus:bg-white/[0.07]";
const labelClass = "block text-sm font-medium text-white/80 mb-2";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Back link ──────────────────────────────────────────────────────────
function BackHome() {
  return (
    <Link
      href="/"
      className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Home
    </Link>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      <BackHome />
      {children}
    </div>
  );
}

/* ── "Upcoming" screen ────────────────────────────────────────────────── */
function RegistrationUpcoming() {
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Registrations Opening Soon
          </h1>
          <p className="text-gray-400 mb-2">
            {VYAPAR_EVENT_NAME} — E-Cell IPSA Pitching Competition
          </p>
          <p className="text-gray-300 leading-relaxed">
            We're putting the finishing touches on this year's{" "}
            {VYAPAR_EVENT_NAME}. Registration hasn't opened yet — check back
            soon or follow our socials for the announcement.
          </p>
        </div>
      </motion.div>
    </PageShell>
  );
}

/* ── "Ended" screen ───────────────────────────────────────────────────── */
function RegistrationEnded() {
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Registration Closed
          </h1>
          <p className="text-gray-400 mb-6">
            {VYAPAR_EVENT_NAME} — E-Cell IPSA Pitching Competition
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
            <h3 className="text-lg font-bold text-white mb-2">Thank you!</h3>
            <p className="text-gray-300 leading-relaxed">
              Thank you for your interest in {VYAPAR_EVENT_NAME}. The
              registration period has ended. We received an overwhelming
              response and are excited to see the innovation from our
              participants.
            </p>
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}

/* ── BMC reminder with both image and text list ────────────────────── */
const BMC_POINTS = [
  "Key Partners",
  "Key Activities",
  "Value Proposition",
  "Customer Relationships",
  "Customer Segments",
  "Key Resources",
  "Channels",
  "Cost Structure",
  "Revenue Streams",
];

function BMCReminder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-300">
        📊 PPT Requirements
      </h3>
      <p className="mt-1 text-sm text-white/80">
        Your pitch presentation <strong>must</strong> cover the following
        Business Model Canvas points:
      </p>

      {/* Image */}
      <div className="mt-3 overflow-hidden rounded-lg">
        <img
          src={BMC_IMAGE_URL}
          alt="Business Model Canvas – PPT Requirements"
          className="w-full object-contain"
        />
      </div>

      {/* Text list */}
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-white/70 sm:grid-cols-3">
        {BMC_POINTS.map((point) => (
          <li key={point} className="flex items-center gap-1.5">
            <span className="text-purple-400">•</span> {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Registration form ───────────────────────────────────────────────── */
function RegistrationForm() {
  const [values, setValues] = useState<VyaparRegistrationFormValues>(
    EMPTY_VYAPAR_REGISTRATION
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof VyaparRegistrationFormValues>(
    key: K,
    value: VyaparRegistrationFormValues[K]
  ) => setValues((v) => ({ ...v, [key]: value }));

  // ── Team size: total members = selected number; additional = total - 1 ──
  const handleTeamSizeChange = (size: string) => {
    const total = Number(size) || 0;
    const additionalCount = Math.max(0, total - 1);
    setValues((v) => {
      const members = [...v.teamMembers];
      while (members.length < additionalCount)
        members.push(emptyTeamMemberEntry());
      members.length = additionalCount;
      return { ...v, teamSize: size, teamMembers: members };
    });
  };

  const setMember = (index: number, patch: Partial<TeamMemberEntry>) =>
    setValues((v) => ({
      ...v,
      teamMembers: v.teamMembers.map((m, i) =>
        i === index ? { ...m, ...patch } : m
      ),
    }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!values.startupName.trim()) next.startupName = "Required";
    if (!values.leaderName.trim()) next.leaderName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(values.leaderEmail))
      next.leaderEmail = "Enter a valid email address";
    if (!values.leaderPhone.trim()) next.leaderPhone = "Required";
    if (!values.collegeName) next.collegeName = "Required";
    if (values.collegeName === "Other" && !values.otherCollegeName?.trim())
      next.otherCollegeName = "Please specify your college name";
    if (!values.teamSize) next.teamSize = "Required";
    else {
      const total = Number(values.teamSize);
      const expectedAdditional = total - 1;
      if (values.teamMembers.length !== expectedAdditional) {
        next.teamSize = `Please select a valid team size (${total} members total)`;
      }
    }
    values.teamMembers.forEach((m, i) => {
      if (!m.name.trim()) next[`member-${i}-name`] = "Required";
      if (!/^\S+@\S+\.\S+$/.test(m.email))
        next[`member-${i}-email`] = "Enter a valid email address";
    });
    if (!values.category) next.category = "Required";
    if (values.category === "Others" && !values.otherCategory?.trim())
      next.otherCategory = "Please specify your category";
    if (!values.ideaDescription.trim()) next.ideaDescription = "Required";
    else if (wordCount(values.ideaDescription) > 200)
      next.ideaDescription = `Keep it under 200 words (currently ${wordCount(
        values.ideaDescription
      )})`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitVyaparRegistration(values);
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong submitting your registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              You're registered!
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Thanks for registering <strong>{values.startupName}</strong> for{" "}
              {VYAPAR_EVENT_NAME}. We'll reach out to{" "}
              <span className="text-purple-300">{values.leaderEmail}</span> with
              next steps.
            </p>
          </div>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 py-16 sm:px-6 relative">
      <BackHome />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Register for {VYAPAR_EVENT_NAME}
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-300" />
            E-Cell IPSA Pitching Competition
          </p>
        </div>

        {/* BMC reminder (image + list) */}
        {/* <BMCReminder /> */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <Field label="Startup / Team Name" error={errors.startupName}>
            <input
              className={fieldClass}
              value={values.startupName}
              onChange={(e) => set("startupName", e.target.value)}
              placeholder="e.g. Nimbus Labs"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Team Leader's Full Name" error={errors.leaderName}>
              <input
                className={fieldClass}
                value={values.leaderName}
                onChange={(e) => set("leaderName", e.target.value)}
              />
            </Field>
            <Field
              label="Team Leader's Email Address"
              error={errors.leaderEmail}
            >
              <input
                type="email"
                className={fieldClass}
                value={values.leaderEmail}
                onChange={(e) => set("leaderEmail", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Team Leader's Phone Number"
              error={errors.leaderPhone}
            >
              <input
                className={fieldClass}
                value={values.leaderPhone}
                onChange={(e) => set("leaderPhone", e.target.value)}
              />
            </Field>
            <Field label="College Name" error={errors.collegeName}>
              <select
                className={fieldClass}
                value={values.collegeName}
                onChange={(e) => set("collegeName", e.target.value)}
              >
                <option value="" disabled className="text-black">
                  Select…
                </option>
                {COLLEGE_OPTIONS.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <AnimatePresence>
            {values.collegeName === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Field
                  label="Specify your college name"
                  error={errors.otherCollegeName}
                >
                  <input
                    className={fieldClass}
                    value={values.otherCollegeName}
                    onChange={(e) => set("otherCollegeName", e.target.value)}
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            label="Total Number of Team Members (including leader)"
            error={errors.teamSize}
          >
            <select
              className={fieldClass}
              value={values.teamSize}
              onChange={(e) => handleTeamSizeChange(e.target.value)}
            >
              <option value="" disabled className="text-black">
                Select…
              </option>
              {TEAM_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n} className="text-black">
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <AnimatePresence>
            {values.teamMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <p className={labelClass}>Names of Additional Team Members</p>
                {values.teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4"
                  >
                    <Field
                      label={`Team Member ${i + 1} — Name`}
                      error={errors[`member-${i}-name`]}
                    >
                      <input
                        className={fieldClass}
                        value={member.name}
                        onChange={(e) => setMember(i, { name: e.target.value })}
                      />
                    </Field>
                    <Field
                      label={`Team Member ${i + 1} — Email`}
                      error={errors[`member-${i}-email`]}
                    >
                      <input
                        type="email"
                        className={fieldClass}
                        value={member.email}
                        onChange={(e) =>
                          setMember(i, { email: e.target.value })
                        }
                        placeholder="member@example.com"
                      />
                    </Field>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Startup Category" error={errors.category}>
            <select
              className={fieldClass}
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="" disabled className="text-black">
                Select…
              </option>
              {VYAPAR_CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <AnimatePresence>
            {values.category === "Others" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Field
                  label="If 'Others', specify your startup category"
                  error={errors.otherCategory}
                >
                  <input
                    className={fieldClass}
                    value={values.otherCategory}
                    onChange={(e) => set("otherCategory", e.target.value)}
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            label="Brief Description of Your Startup Idea (max 200 words)"
            error={errors.ideaDescription}
            hint={`${wordCount(values.ideaDescription)}/200 words`}
          >
            <textarea
              className={fieldClass}
              rows={5}
              value={values.ideaDescription}
              onChange={(e) => set("ideaDescription", e.target.value)}
            />
          </Field>

          <YesNoField
            label="Have you participated in any pitch competition before?"
            value={values.pitchedBefore}
            onChange={(v) => set("pitchedBefore", v)}
          />

          <YesNoField
            label="Do you want pitch preparation guidance from mentors?"
            value={values.wantsMentorship}
            onChange={(v) => set("wantsMentorship", v)}
          />

          {submitError && (
            <p className="text-sm text-red-400 text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader className="w-4 h-4 animate-spin" />}
            {submitting ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
        <BMCReminder />
      </motion.div>
    </div>
  );
}

/* ── Field and YesNoField components ─────────────────────────────────── */
function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-white/30">{hint}</p>
      ) : null}
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-3">
        {(["Yes", "No"] as const).map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors ${
              value === opt
                ? "bg-purple-500/20 border-purple-400/60 text-white"
                : "bg-white/5 border-white/15 text-white/60 hover:bg-white/[0.08]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Top-level: pick screen based on status ─────────────────────────── */
const VypaarXPage: React.FC = () => {
  const { status, loading } = useVyaparStatus();

  if (loading) {
    return (
      <PageShell>
        <Loader className="w-8 h-8 text-purple-400 animate-spin relative z-10" />
      </PageShell>
    );
  }

  if (status === "upcoming") return <RegistrationUpcoming />;
  if (status === "ended") return <RegistrationEnded />;
  return <RegistrationForm />;
};

export default VypaarXPage;
