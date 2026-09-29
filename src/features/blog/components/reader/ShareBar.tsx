"use client";

import { useEffect, useState } from "react";
import { Check, Facebook, Link2, Linkedin, MessageCircle, Share2, Twitter } from "lucide-react";

interface ShareBarProps {
  title: string;
  /** Preview mode: render inert buttons. */
  disabled?: boolean;
  label?: string;
}

/** Share to X, LinkedIn, Facebook, WhatsApp; copy link; native share on phones. */
export function ShareBar({ title, disabled = false, label = "Share" }: ShareBarProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const enc = encodeURIComponent;
  const links = [
    { name: "X (Twitter)", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="np-share" role="group" aria-label="Share this story">
      <span className="np-label">{label}</span>
      {links.map(({ name, icon: Icon, href }) => (
        <a
          key={name}
          className="np-iconbtn"
          href={disabled || !url ? undefined : href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          aria-disabled={disabled || !url}
          title={`Share on ${name}`}
        >
          <Icon size={17} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        className="np-iconbtn"
        onClick={copy}
        disabled={disabled}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <Check size={17} aria-hidden="true" /> : <Link2 size={17} aria-hidden="true" />}
      </button>
      {canNativeShare && !disabled && (
        <button
          type="button"
          className="np-iconbtn"
          onClick={() => navigator.share({ title, url }).catch(() => undefined)}
          aria-label="Share via…"
          title="Share via…"
        >
          <Share2 size={17} aria-hidden="true" />
        </button>
      )}
      <span className="np-meta" role="status" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
