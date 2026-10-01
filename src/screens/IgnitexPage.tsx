"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Loader,
  Mic2,
  Rocket,
  Trophy,
} from "lucide-react";
import {
  DuplicateRegistrationError,
  EMPTY_IGNITEX_SPEAKER_REGISTRATION,
  IGNITEX_COLLEGE_OPTIONS,
  IGNITEX_COMPETITION_DATE_LABEL,
  IGNITEX_EVENT_NAME,
  IGNITEX_GENDER_OPTIONS,
  IGNITEX_SPEAKER_DATE_LABEL,
  IGNITEX_YEAR_OPTIONS,
  submitSpeakerRegistration,
  useIgnitexSettings,
} from "@/features/ignitex";
import type { IgnitexSpeakerRegistrationFormValues } from "@/features/ignitex";
import { validateMember } from "@/features/ignitex/validation";
import {
  Confetti,
  Field,
  FloatingEmojis,
  IgnitexSplash,
  LaunchMeter,
  fieldClass,
} from "@/features/ignitex/components/shared";

type Values = IgnitexSpeakerRegistrationFormValues;

function SpeakerSessionForm({ closedReason }: { closedReason: string | null }) {
  const [values, setValues] = useState<Values>(
    EMPTY_IGNITEX_SPEAKER_REGISTRATION
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const rest = { ...prev };
      delete rest[key];
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const found = validateMember(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitSpeakerRegistration(values);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof DuplicateRegistrationError
          ? err.message
          : "Something went wrong submitting your registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative text-center py-6">
        <Confetti />
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          You&apos;re in! 🎉
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Thanks, <strong>{values.name}</strong>. Your seat for the Speaker
          Session on {IGNITEX_SPEAKER_DATE_LABEL} is confirmed. We&apos;ll reach out
          at <span className="text-purple-300">{values.email}</span> with
          details.
        </p>
      </div>
    );
  }

  if (closedReason) {
    return (
      <p className="text-center text-gray-300 py-6">
        {closedReason}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <LaunchMeter
        filled={Object.values(values).filter((v) => v.trim() !== "").length}
        total={Object.keys(values).length}
      />
      <Field label="Name" htmlFor="ix-name" error={errors.name}>
        <input
          id="ix-name"
          className={fieldClass}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="name"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <Field label="Year" htmlFor="ix-year" error={errors.year}>
          <select
            id="ix-year"
            className={fieldClass}
            value={values.year}
            onChange={(e) => set("year", e.target.value)}
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
        <Field label="Branch" htmlFor="ix-branch" error={errors.branch}>
          <input
            id="ix-branch"
            className={fieldClass}
            value={values.branch}
            onChange={(e) => set("branch", e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <Field
          label="Enrollment No. / Computer Code"
          htmlFor="ix-enroll"
          error={errors.enrollmentNo}
        >
          <input
            id="ix-enroll"
            className={fieldClass}
            value={values.enrollmentNo}
            onChange={(e) => set("enrollmentNo", e.target.value)}
          />
        </Field>
        <Field label="Phone No." htmlFor="ix-phone" error={errors.phone}>
          <input
            id="ix-phone"
            type="tel"
            inputMode="numeric"
            className={fieldClass}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <Field label="E-mail" htmlFor="ix-email" error={errors.email}>
          <input
            id="ix-email"
            type="email"
            className={fieldClass}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Gender" htmlFor="ix-gender" error={errors.gender}>
          <select
            id="ix-gender"
            className={fieldClass}
            value={values.gender}
            onChange={(e) => set("gender", e.target.value)}
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
      </div>

      <Field
        label="College Name"
        htmlFor="ix-college"
        error={errors.collegeName}
      >
        <select
          id="ix-college"
          className={fieldClass}
          value={values.collegeName}
          onChange={(e) => set("collegeName", e.target.value)}
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

      {submitError && (
        <p role="alert" className="text-sm text-red-400 text-center">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Rocket className="w-4 h-4" />
        )}
        {submitting ? "Launching…" : "Count me in!"}
      </button>
    </form>
  );
}

const IgnitexPage: React.FC = () => {
  const { closedReason, loading } = useIgnitexSettings();
  const [splash, setSplash] = useState(true);

  // Keep the splash up for a minimum time so the animation always plays, and
  // until the settings have loaded so the form doesn't flash in afterwards.
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);
  const showSplash = splash || loading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 pt-28 pb-24 sm:px-8 lg:px-12 xl:px-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      </div>

      <IgnitexSplash show={showSplash} />
      <FloatingEmojis />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full"
      >
        <div className="text-center mb-10">
          <h1 className="sr-only">{IGNITEX_EVENT_NAME}</h1>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/IgniteX.png"
              alt={IGNITEX_EVENT_NAME}
              className="mx-auto h-28 w-auto sm:h-36 drop-shadow-[0_0_24px_rgba(168,85,247,0.45)]"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Speaker Session */}
          <section
            id="speaker-session"
            className="lg:col-span-3 xl:col-span-4 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <Mic2 className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Speaker Session
                </h2>
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {IGNITEX_SPEAKER_DATE_LABEL} · Individual registration
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader className="w-7 h-7 text-purple-400 animate-spin" />
              </div>
            ) : (
              <SpeakerSessionForm closedReason={closedReason} />
            )}
          </section>

          {/* Competition — coming soon only, no form */}
          <section
            id="competition"
            className="lg:col-span-2 xl:col-span-1 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center h-fit"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Competition</h2>
            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {IGNITEX_COMPETITION_DATE_LABEL}
            </p>
            <span className="mt-5 inline-block rounded-full border border-purple-400/40 bg-purple-500/15 px-5 py-1.5 text-sm font-semibold tracking-widest text-purple-200">
              COMING SOON
            </span>
          </section>
        </div>
      </motion.div>
    </main>
  );
};

export default IgnitexPage;
