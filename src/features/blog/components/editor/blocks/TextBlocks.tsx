"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Bold, Italic, Link2 } from "lucide-react";
import type { HeadingBlock, ListBlock, ParagraphBlock, QuoteBlock } from "../../../types";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { IconBtn, Segmented, fieldClass } from "../controls";

/* ------------------------------ Paragraph ------------------------------- */

export function ParagraphEditor({
  block,
  onChange,
  onInsertAfter,
}: {
  block: ParagraphBlock;
  onChange: (b: ParagraphBlock) => void;
  onInsertAfter: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const selection = useRef<[number, number]>([0, 0]);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("https://");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [block.text]);

  const apply = (next: string, from: number, to: number) => {
    onChange({ ...block, text: next });
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(from, to);
    });
  };

  const wrap = (mark: string) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const chosen = value.slice(s, e) || "text";
    apply(value.slice(0, s) + mark + chosen + mark + value.slice(e), s + mark.length, s + mark.length + chosen.length);
  };

  const openLink = () => {
    const el = ref.current;
    if (el) selection.current = [el.selectionStart, el.selectionEnd];
    setLinkOpen(true);
  };

  const applyLink = () => {
    const [s, e] = selection.current;
    const value = block.text;
    const label = value.slice(s, e) || url;
    const md = `[${label}](${url.trim()})`;
    setLinkOpen(false);
    setUrl("https://");
    apply(value.slice(0, s) + md + value.slice(e), s, s + md.length);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const key = e.key.toLowerCase();
    if (key === "b") { e.preventDefault(); wrap("**"); }
    else if (key === "i") { e.preventDefault(); wrap("*"); }
    else if (key === "k") { e.preventDefault(); openLink(); }
    else if (key === "enter") { e.preventDefault(); onInsertAfter(); }
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-1" role="toolbar" aria-label="Text formatting">
        <IconBtn label="Bold (Ctrl/⌘ B)" onClick={() => wrap("**")}><Bold className="h-4 w-4" /></IconBtn>
        <IconBtn label="Italic (Ctrl/⌘ I)" onClick={() => wrap("*")}><Italic className="h-4 w-4" /></IconBtn>
        <IconBtn label="Add link (Ctrl/⌘ K)" onClick={openLink}><Link2 className="h-4 w-4" /></IconBtn>
        <span className="ml-2 hidden text-xs text-slate-500 sm:inline">Ctrl/⌘ + Enter adds a new paragraph</span>
      </div>
      {linkOpen && (
        <div className="mb-2 flex items-center gap-2">
          <input
            autoFocus
            type="url"
            aria-label="Link address"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); applyLink(); }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            className={fieldClass}
          />
          <Button size="sm" onClick={applyLink}>Apply</Button>
          <Button size="sm" variant="ghost" onClick={() => setLinkOpen(false)}>Cancel</Button>
        </div>
      )}
      <textarea
        ref={ref}
        rows={2}
        aria-label="Paragraph text"
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Write a paragraph… use **bold**, *italic* and [links](https://…)"
        className="w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-serif text-[1.05rem] leading-relaxed text-slate-900 placeholder:text-slate-400 hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

/* ------------------------------- Heading -------------------------------- */

const HEADING_SIZE = { 2: "text-2xl", 3: "text-xl", 4: "text-sm uppercase tracking-wider" } as const;

export function HeadingEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <div className="space-y-3">
      <Segmented
        label="Heading level"
        value={block.level}
        onChange={(level) => onChange({ ...block, level })}
        options={[
          { value: 2, label: "H2", title: "Section heading" },
          { value: 3, label: "H3", title: "Sub-heading" },
          { value: 4, label: "H4", title: "Small label heading" },
        ]}
      />
      <input
        aria-label={`Heading text (H${block.level})`}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Section heading"
        className={cn(
          "w-full rounded-lg border border-transparent bg-transparent px-2 py-1 font-serif font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          HEADING_SIZE[block.level]
        )}
      />
    </div>
  );
}

/* -------------------------------- Quote --------------------------------- */

export function QuoteEditor({ block, onChange }: { block: QuoteBlock; onChange: (b: QuoteBlock) => void }) {
  return (
    <div className="space-y-3">
      <Segmented
        label="Style"
        value={block.variant}
        onChange={(variant) => onChange({ ...block, variant })}
        options={[
          { value: "quote", label: "Quote", title: "Indented quotation inside the text" },
          { value: "pull", label: "Pull quote", title: "Large highlighted quote" },
        ]}
      />
      <textarea
        aria-label="Quote text"
        rows={3}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="The quote or highlight…"
        className={cn(fieldClass, "font-serif text-lg italic leading-snug")}
      />
      <input
        aria-label="Attribution"
        value={block.cite ?? ""}
        onChange={(e) => onChange({ ...block, cite: e.target.value })}
        placeholder="Attribution (optional) — e.g. Founder, Batch 4"
        className={fieldClass}
      />
    </div>
  );
}

/* --------------------------------- List --------------------------------- */

export function ListEditor({ block, onChange }: { block: ListBlock; onChange: (b: ListBlock) => void }) {
  return (
    <div className="space-y-3">
      <Segmented
        label="List type"
        value={block.ordered ? "numbered" : "bulleted"}
        onChange={(v) => onChange({ ...block, ordered: v === "numbered" })}
        options={[
          { value: "bulleted", label: "Bulleted" },
          { value: "numbered", label: "Numbered" },
        ]}
      />
      <textarea
        aria-label="List items, one per line"
        rows={Math.max(3, block.items.length + 1)}
        value={block.items.join("\n")}
        onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
        placeholder={"One item per line\nSecond item\nThird item"}
        className={cn(fieldClass, "font-serif text-base leading-relaxed")}
      />
      <p className="text-xs text-slate-500">One item per line. Bold, italic and links work here too.</p>
    </div>
  );
}
