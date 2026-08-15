import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Check,
  Copy,
  Download,
  Linkedin,
  Loader,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  lookupCertificateForDownload,
  generateCertificatePdf,
  downloadCertificatePdf,
  mergedRecipientName,
} from "@/features/certificates";
import type { CertificateLookupResult } from "@/features/certificates";

const fieldClass =
  "w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-purple-400/60 focus:bg-white/[0.07]";

function verificationUrl(certificateId: string): string {
  return `${window.location.origin}/verify?id=${encodeURIComponent(
    certificateId
  )}`;
}

export default function CertificateDownloadPage() {
  const [name, setName] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertificateLookupResult | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !certificateId.trim()) {
      setError("Please enter both your name and certificate ID.");
      return;
    }
    setSearching(true);
    setError(null);
    setResult(null);
    setPdfBytes(null);
    try {
      const found = await lookupCertificateForDownload(certificateId, name);
      if (!found) {
        setError(
          "No certificate found for that name and ID. Double-check both and try again."
        );
        return;
      }
      const bytes = await generateCertificatePdf(
        found.event,
        found.certificate
      );
      setResult(found);
      setPdfBytes(bytes);
    } catch {
      setError(
        "Something went wrong generating your certificate. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !result) return;
    downloadCertificatePdf(pdfBytes, `${result.certificate.certificateId}.pdf`);
  };

  const handleLinkedInShare = () => {
    if (!result) return;
    const url = verificationUrl(result.certificate.certificateId);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const detailsText = (r: CertificateLookupResult) =>
    [
      `🏆 ${r.event.name}`,
      `Awarded to: ${mergedRecipientName(r.certificate)}`,
      `Certificate ID: ${r.certificate.certificateId}`,
      `Verify: ${verificationUrl(r.certificate.certificateId)}`,
    ].join("\n");

  const handleCopyDetails = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(detailsText(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy to clipboard.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 px-4 py-16 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Download Your Certificate
          </h1>
          <p className="text-gray-400">
            Enter your name and certificate ID exactly as issued.
          </p>
        </div>

        {!result ? (
          <form
            onSubmit={handleSearch}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <input
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As it appears on your certificate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Certificate ID
              </label>
              <input
                className={`${fieldClass} uppercase`}
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g. WEBD-7F3K9A2B"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={searching}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {searching ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {searching ? "Searching…" : "Find My Certificate"}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {mergedRecipientName(result.certificate)}
              </h2>
              <p className="text-gray-400">{result.event.name}</p>
              <p className="mt-1 font-mono text-xs text-purple-300">
                {result.certificate.certificateId}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={handleLinkedInShare}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white bg-[#0A66C2] hover:bg-[#0958a8] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>
              <button
                onClick={handleCopyDetails}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium text-white/80 bg-white/5 border border-white/15 hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Details"}
              </button>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setPdfBytes(null);
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-300"
            >
              Look up a different certificate
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
