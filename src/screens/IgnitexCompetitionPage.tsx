"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Loader,
  Rocket,
  Users,
} from "lucide-react";
import {
  DuplicateTeamError,
  EMPTY_IGNITEX_SPEAKER_REGISTRATION,
  IGNITEX_COLLEGE_OPTIONS,
  IGNITEX_COMPETITIONS,
  IGNITEX_COMPETITION_DATE_LABEL,
  IGNITEX_EVENT_NAME,
  IGNITEX_GENDER_OPTIONS,
  IGNITEX_YEAR_OPTIONS,
  submitCompetitionRegistration,
} from "@/features/ignitex";
import type {
  IgnitexCompetition,
  IgnitexSpeakerRegistrationFormValues,
} from "@/features/ignitex";
import { validateMember } from "@/features/ignitex/validation";
import {
  Confetti,
  Field,
  FloatingEmojis,
  IgnitexSplash,
  LaunchMeter,
  fieldClass,
} from "@/features/ignitex/components/shared";

type Member = IgnitexSpeakerRegistrationFormValues;

function MemberFields({
  index,
  values,
  errors,
  onChange,
}: {
  index: number;
  values: Member;
  errors: Record<string, string>;
  onChange: <K extends keyof Member>(key: K, value: Member[K]) => void;
}) {
  const id = (name: string) => `m${index}-${name}`;
  const err = (name: string) => errors[`m${index}.${name}`];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-bold text-white">
          {index + 1}
        </span>
        <h3 className="font-semibold text-white">
          {index === 0 ? "Member 1 (Team Leader)" : `Member ${index + 1}`}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <Field label="Name" htmlFor={id("name")} error={err("name")}>
          <input
            id={id("name")}
            className={fieldClass}
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            autoComplete="off"
          />
        </Field>
        <Field label="Year" htmlFor={id("year")} error={err("year")}>
          <select
            id={id("year")}
            className={fieldClass}
            value={values.year}
            onChange={(e) => onChange("year", e.target.value)}
          >
            <option value="" disabled className="text-black">
              Select…
            </option>
            {IGNITEX_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y} className="text-black">
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Branch" htmlFor={id("branch")} error={err("branch")}>
          <input
            id={id("branch")}
            className={fieldClass}
            value={values.branch}
            onChange={(e) => onChange("branch", e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </Field>
        <Field
          label="Enrollment No. / Computer Code"
          htmlFor={id("enroll")}
          error={err("enrollmentNo")}
        >
          <input
            id={id("enroll")}
            className={fieldClass}
            value={values.enrollmentNo}
            onChange={(e) => onChange("enrollmentNo", e.target.value)}
          />
        </Field>
        <Field label="Phone No." htmlFor={id("phone")} error={err("phone")}>
          <input
            id={id("phone")}
            type="tel"
            inputMode="numeric"
            className={fieldClass}
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </Field>
        <Field label="E-mail" htmlFor={id("email")} error={err("email")}>
          <input
            id={id("email")}
            type="email"
            className={fieldClass}
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Field>
        <Field label="Gender" htmlFor={id("gender")} error={err("gender")}>
          <select
            id={id("gender")}
            className={fieldClass}
            value={values.gender}
            onChange={(e) => onChange("gender", e.target.value)}
          >
            <option value="" disabled className="text-black">
              Select…
            </option>
            {IGNITEX_GENDER_OPTIONS.map((g) => (
              <option key={g} value={g} className="text-black">
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="College Name"
          htmlFor={id("college")}
          error={err("collegeName")}
        >
          <select
            id={id("college")}
            className={fieldClass}
            value={values.collegeName}
            onChange={(e) => onChange("collegeName", e.target.value)}
          >
            <option value="" disabled className="text-black">
              Select…
            </option>
            {IGNITEX_COLLEGE_OPTIONS.map((c) => (
              <option key={c} value={c} className="text-black">
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function CompetitionForm({ competition }: { competition: IgnitexCompetition }) {
  const [members, setMembers] = useState<Member[]>(() =>
    Array.from({ length: competition.teamSize }, () => ({
      ...EMPTY_IGNITEX_SPEAKER_REGISTRATION,
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const change =
    (index: number) =>
    <K extends keyof Member>(key: K, value: Member[K]) => {
      setMembers((prev) =>
        prev.map((m, i) => (i === index ? { ...m, [key]: value } : m))
      );
      setErrors((prev) => {
        const k = `m${index}.${String(key)}`;
        if (!prev[k]) return prev;
        const rest = { ...prev };
        delete rest[k];
        return rest;
      });
    };

  const validateAll = () => {
    const found: Record<string, string> = {};
    members.forEach((m, i) => Object.assign(found, validateMember(m, `m${i}.`)));
    // Teammates must be different people.
    for (let i = 1; i < members.length; i++) {
      for (let j = 0; j < i; j++) {
        if (
          members[i].email.trim() &&
          members[i].email.trim().toLowerCase() ===
            members[j].email.trim().toLowerCase()
        )
          found[`m${i}.email`] ||= "Each member needs a different e-mail";
        if (
          members[i].enrollmentNo.trim() &&
          members[i].enrollmentNo.trim().toLowerCase() ===
            members[j].enrollmentNo.trim().toLowerCase()
        )
          found[`m${i}.enrollmentNo`] ||= "Each member needs a different enrollment no.";
      }
    }
    return found;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateAll();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitCompetitionRegistration(competition, members);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof DuplicateTeamError
          ? err.message
          : "Something went wrong submitting your registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative py-8 text-center">
        <Confetti />
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">
          Your team is in! 🎉
        </h3>
        <p className="mx-auto max-w-lg leading-relaxed text-gray-300">
          <strong>{members.map((m) => m.name).join(" & ")}</strong> are
          registered for {competition.title} on {IGNITEX_COMPETITION_DATE_LABEL}.
          We&apos;ll reach out at{" "}
          <span className="text-purple-300">{members[0].email}</span> with
          details.
        </p>
      </div>
    );
  }

  const fieldsPerMember = Object.keys(EMPTY_IGNITEX_SPEAKER_REGISTRATION).length;
  const filled = members.reduce(
    (n, m) => n + Object.values(m).filter((v) => v.trim() !== "").length,
    0
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <LaunchMeter filled={filled} total={fieldsPerMember * members.length} />
      {members.map((m, i) => (
        <MemberFields
          key={i}
          index={i}
          values={m}
          errors={errors}
          onChange={change(i)}
        />
      ))}

      {submitError && (
        <p role="alert" className="text-center text-sm text-red-400">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3.5 font-semibold text-white transition-colors hover:from-purple-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Rocket className="h-4 w-4" />
        )}
        {submitting ? "Launching…" : `Register team for ${competition.title}`}
      </button>
    </form>
  );
}

const IgnitexCompetitionPage: React.FC = () => {
  const [splash, setSplash] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const selected = IGNITEX_COMPETITIONS.find((c) => c.id === selectedId) ?? null;

  const choose = (id: string) => {
    setSelectedId(id);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 pb-24 pt-28 sm:px-8 lg:px-12 xl:px-16">
      <IgnitexSplash show={splash} />
      <FloatingEmojis />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full"
      >
        <div className="mb-10 text-center">
          <h1 className="sr-only">{IGNITEX_EVENT_NAME} Competitions</h1>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/IgniteX.png"
              alt={IGNITEX_EVENT_NAME}
              className="mx-auto h-28 w-auto drop-shadow-[0_0_24px_rgba(168,85,247,0.45)] sm:h-36"
            />
          </motion.div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-gray-300">
            <CalendarDays className="h-4 w-4" />
            Competitions · {IGNITEX_COMPETITION_DATE_LABEL}
          </p>
        </div>

        {/* Competition picker */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {IGNITEX_COMPETITIONS.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.id)}
                aria-pressed={active}
                className={`group rounded-3xl border p-6 text-left backdrop-blur-2xl transition-all sm:p-8 ${
                  active
                    ? "border-purple-400/70 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <motion.span
                    className="text-4xl"
                    whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  >
                    {c.emoji}
                  </motion.span>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                    <Users className="h-3.5 w-3.5" />
                    {c.teamSize} members team
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{c.title}</h2>
                <p className="mt-1 text-gray-300">{c.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-300">
                  {active ? "Selected — fill in your team below" : "Register your team"}
                  <Rocket className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Registration form */}
        <div ref={formRef} className="scroll-mt-28">
          {selected ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">
                  {selected.emoji} {selected.title} — Team Registration
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {IGNITEX_COMPETITION_DATE_LABEL} · {selected.teamSize} members
                  per team
                </p>
              </div>
              <CompetitionForm key={selected.id} competition={selected} />
            </section>
          ) : (
            <p className="text-center text-sm text-gray-400">
              Pick a competition above to register your team.
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default IgnitexCompetitionPage;
