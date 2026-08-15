"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, ShieldCheck, ShieldX, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  verifyCertificate,
  mergedRecipientName,
} from "@/features/certificates";
import type { Certificate } from "@/features/certificates";

const fieldClass =
  "w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-400/60 focus:bg-white/[0.07]";

function formatIssuedDate(cert: Certificate): string {
  const millis = cert.issuedAt?.toMillis?.();
  if (!millis) return "—";
  return new Date(millis).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CertificateVerifyPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams?.get("id") ?? "";
  const [certificateId, setCertificateId] = useState(initialId);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const runVerify = async (id: string) => {
    if (!id.trim()) return;
    setChecking(true);
    setChecked(false);
    try {
      const found = await verifyCertificate(id);
      setCertificate(found);
    } finally {
      setChecking(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    if (initialId) {
      void runVerify(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runVerify(certificateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 py-16 sm:px-6 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Verify a Certificate
          </h1>
          <p className="text-gray-400">
            Paste the certificate ID to confirm it's genuine.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <input
            className={`${fieldClass} uppercase text-center tracking-wider`}
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="e.g. WEBD-7F3K9A2B"
          />
          <button
            type="submit"
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checking ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {checking ? "Verifying…" : "Verify"}
          </button>
        </form>

        {checked && !checking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 rounded-2xl border p-6 text-center ${
              certificate
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            {certificate ? (
              <>
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white mb-3">
                  Valid Certificate
                </p>
                <div className="space-y-1 text-sm text-gray-300 text-left mx-auto max-w-xs">
                  <Row label="Name" value={mergedRecipientName(certificate)} />
                  <Row label="Event" value={certificate.eventName} />
                  <Row label="Issued" value={formatIssuedDate(certificate)} />
                  <Row
                    label="Certificate ID"
                    value={certificate.certificateId}
                    mono
                  />
                </div>
              </>
            ) : (
              <>
                <ShieldX className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white mb-1">
                  Invalid Certificate
                </p>
                <p className="text-sm text-gray-400">
                  No certificate matches that ID. Check for typos and try again.
                </p>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className={mono ? "font-mono text-purple-300" : "text-white"}>
        {value}
      </span>
    </div>
  );
}
