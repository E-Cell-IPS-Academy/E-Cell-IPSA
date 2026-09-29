"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { ContentBlock } from "../../types";
import { cn } from "@/shared/lib/cn";
import { BLOCK_OPTIONS } from "./blockMeta";

interface BlockInserterProps {
  /** Called with a freshly-created block of the chosen type. */
  onPick: (block: ContentBlock) => void;
  /** Prominent variant used at the end of the article. */
  prominent?: boolean;
  label?: string;
}

/** "+" control (with popover menu) for inserting a block at a position. */
export function BlockInserter({ onPick, prominent = false, label = "Insert block here" }: BlockInserterProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative flex items-center", prominent ? "justify-center py-2" : "h-6 justify-center")}>
      {!prominent && (
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200" />
      )}
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative z-10 inline-flex items-center gap-1.5 rounded-full border bg-white text-xs font-medium shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          prominent
            ? "border-indigo-200 px-4 py-2 text-indigo-700 hover:bg-indigo-50"
            : "h-5 w-5 justify-center border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
        )}
      >
        <Plus className={prominent ? "h-4 w-4" : "h-3 w-3"} aria-hidden="true" />
        {prominent && "Add block"}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Block types"
          className="absolute left-1/2 top-full z-30 mt-2 grid w-[min(28rem,86vw)] -translate-x-1/2 grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl sm:grid-cols-3"
        >
          {BLOCK_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitem"
              onClick={() => {
                onPick(o.create());
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg p-2 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <o.icon className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-800">{o.label}</span>
                <span className="block truncate text-xs text-slate-500">{o.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
