"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const fieldClass =
  "w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-400/60 focus:bg-white/[0.07]";
const labelClass = "block text-sm font-medium text-white/80 mb-2";

type Values = IgnitexSpeakerRegistrationFormValues;

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const FLOATERS = [
  { emoji: "🚀", left: "8%", top: "18%", size: 28, dur: 7, delay: 0 },
  { emoji: "✨", left: "88%", top: "14%", size: 24, dur: 6, delay: 1 },
  { emoji: "💡", left: "5%", top: "62%", size: 26, dur: 8, delay: 2 },
  { emoji: "🎤", left: "92%", top: "58%", size: 26, dur: 7.5, delay: 0.5 },
  { emoji: "⭐", left: "78%", top: "86%", size: 22, dur: 6.5, delay: 1.5 },
  { emoji: "🔥", left: "18%", top: "88%", size: 24, dur: 7, delay: 2.5 },
];

function FloatingEmojis() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {FLOATERS.map((f) => (
        <motion.span
          key={f.emoji + f.left}
          className="absolute select-none opacity-30"
          style={{ left: f.left, top: f.top, fontSize: f.size }}
          animate={{ y: [0, -22, 0], rotate: [-8, 8, -8] }}
          transition={{
            duration: f.dur,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {f.emoji}
        </motion.span>
      ))}
    </div>
  );
}

const CONFETTI_COLORS = ["#a855f7", "#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 420,
      y: -(60 + Math.random() * 220),
      rotate: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.15,
    }))
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 h-0 w-0" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block h-2.5 w-1.5 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 1.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function LaunchMeter({ filled, total }: { filled: number; total: number }) {
  const pct = Math.round((filled / total) * 100);
  const message =
    pct === 0
      ? "Warming up the engines…"
      : pct < 50
      ? "Fuelling up ⛽"
      : pct < 100
      ? "Almost ready for launch…"
      : "Ready for liftoff! 🚀";
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
        <span>{message}</span>
        <span>{pct}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="absolute -top-2.5"
          animate={{ left: `calc(${pct}% - 12px)` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <Rocket className="h-6 w-6 rotate-45 text-white drop-shadow-[0_0_6px_rgba(168,85,247,0.9)]" />
        </motion.div>
      </div>
    </div>
  );
}

function validate(v: Values): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.name.trim()) e.name = "Required";
  if (!v.year) e.year = "Required";
  if (!v.branch.trim()) e.branch = "Required";
  if (!v.enrollmentNo.trim()) e.enrollmentNo = "Required";
  if (!/^[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, "").replace(/^(\+91|91)/, "")))
    e.phone = "Enter a valid 10-digit phone number";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim()))
    e.email = "Enter a valid email address";
  if (!v.gender) e.gender = "Required";
  if (!v.collegeName) e.collegeName = "Required";
  return e;
}

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
    const found = validate(values);
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

const SPARKS = [
  { left: "42%", delay: 0.0, dur: 1.4, color: "#a855f7" },
  { left: "46%", delay: 0.3, dur: 1.2, color: "#3b82f6" },
  { left: "50%", delay: 0.1, dur: 1.6, color: "#f59e0b" },
  { left: "54%", delay: 0.5, dur: 1.3, color: "#ec4899" },
  { left: "58%", delay: 0.2, dur: 1.5, color: "#a855f7" },
  { left: "48%", delay: 0.7, dur: 1.2, color: "#f59e0b" },
  { left: "52%", delay: 0.9, dur: 1.4, color: "#3b82f6" },
];

/** Full-screen "ignition" splash shown each time the page loads/reloads. */
function IgnitexSplash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="ignitex-splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-hidden
        >
          {/* rising sparks */}
          {SPARKS.map((sp, i) => (
            <motion.span
              key={i}
              className="absolute bottom-[38%] h-2 w-2 rounded-full"
              style={{ left: sp.left, backgroundColor: sp.color, boxShadow: `0 0 12px ${sp.color}` }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-0, -220], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.3] }}
              transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          <div className="relative flex items-center justify-center">
            {/* ignition rings */}
            {[0, 0.6].map((d) => (
              <motion.span
                key={d}
                className="absolute h-40 w-40 rounded-full border-2 border-purple-400/50"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.8, delay: d, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute h-44 w-44 rounded-full bg-purple-500/25 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/IgniteX.png"
              alt=""
              className="relative h-32 w-auto sm:h-40 drop-shadow-[0_0_28px_rgba(168,85,247,0.7)]"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>

          <div className="mt-10 w-56 sm:w-72">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
            <motion.p
              className="mt-3 text-center text-xs tracking-[0.3em] text-white/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              IGNITING…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
