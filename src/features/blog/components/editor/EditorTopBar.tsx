"use client";

import { ArrowLeft, Eye, ExternalLink, Monitor, Pencil, Save, Smartphone, Undo2 } from "lucide-react";
import type { BlogStatus } from "../../types";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { BlogStatusBadge } from "../BlogStatusBadge";

export type EditorMode = "edit" | "preview";
export type PreviewDevice = "desktop" | "mobile";

interface EditorTopBarProps {
  status: BlogStatus;
  dirty: boolean;
  saving: boolean;
  isNew: boolean;
  uploading: boolean;
  canUndo: boolean;
  mode: EditorMode;
  device: PreviewDevice;
  liveHref: string | null;
  onBack: () => void;
  onUndo: () => void;
  onMode: (m: EditorMode) => void;
  onDevice: (d: PreviewDevice) => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}

/** Sticky action bar: navigation, edit/preview switch and save / publish. */
export function EditorTopBar(p: EditorTopBarProps) {
  const published = p.status === "published";

  return (
    <div className="sticky top-[57px] z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={p.onBack}>
          Posts
        </Button>
        <BlogStatusBadge status={p.status} />
        <span className="text-xs text-slate-500" role="status" aria-live="polite">
          {p.uploading ? "Uploading images…" : p.saving ? "Saving…" : p.dirty ? "Unsaved changes" : p.isNew ? "Not saved yet" : "All changes saved"}
        </span>

        <div className="mx-auto flex items-center gap-2" role="group" aria-label="Editor view">
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
            {([
              ["edit", "Edit", Pencil],
              ["preview", "Preview", Eye],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={p.mode === id}
                onClick={() => p.onMode(id)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                  p.mode === id ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {p.mode === "preview" && (
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-300" role="group" aria-label="Preview device">
              {([
                ["desktop", "Desktop preview", Monitor],
                ["mobile", "Mobile preview", Smartphone],
              ] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  title={label}
                  aria-pressed={p.device === id}
                  onClick={() => p.onDevice(id)}
                  className={cn(
                    "inline-flex h-8 w-9 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                    p.device === id ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Undo2 className="h-4 w-4" />} disabled={!p.canUndo} onClick={p.onUndo} title="Undo the last block change">
            Undo
          </Button>
          {p.liveHref && (
            <a
              href={p.liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View live
            </a>
          )}
          <Button variant={published ? "primary" : "outline"} size="sm" leftIcon={<Save className="h-4 w-4" />} loading={p.saving} onClick={p.onSave}>
            {published ? "Save changes" : "Save draft"}
          </Button>
          {published ? (
            <Button variant="outline" size="sm" disabled={p.saving} onClick={p.onUnpublish}>
              Unpublish
            </Button>
          ) : (
            <Button size="sm" disabled={p.saving} onClick={p.onPublish}>
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
