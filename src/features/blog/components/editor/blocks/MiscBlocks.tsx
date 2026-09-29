"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { VideoBlock } from "../../../types";
import { parseVideoUrl } from "../../../lib/video";
import { fieldClass } from "../controls";

export function VideoEditor({ block, onChange }: { block: VideoBlock; onChange: (b: VideoBlock) => void }) {
  const parsed = parseVideoUrl(block.url);
  const empty = !block.url.trim();

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`video-${block.id}`} className="mb-1 block text-xs font-medium text-slate-600">
          Video link
        </label>
        <input
          id={`video-${block.id}`}
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…  or  https://vimeo.com/…"
          className={fieldClass}
        />
        {!empty && (
          <p
            role="status"
            className={`mt-1.5 flex items-center gap-1.5 text-xs ${parsed.kind === "invalid" ? "text-red-600" : "text-emerald-700"}`}
          >
            {parsed.kind === "invalid" ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {parsed.kind === "iframe" && `${parsed.provider === "youtube" ? "YouTube" : "Vimeo"} video will be embedded.`}
            {parsed.kind === "file" && "Video file will be embedded with a player."}
            {parsed.kind === "link" && "This site can't be embedded — readers will see a “Watch video” link."}
            {parsed.kind === "invalid" && "That doesn't look like a valid link."}
          </p>
        )}
      </div>
      <input
        aria-label="Video caption"
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder="Caption (optional)"
        className={fieldClass}
      />
    </div>
  );
}

export function DividerEditor() {
  return (
    <p aria-hidden="true" className="select-none py-1 text-center text-lg tracking-[0.7em] text-slate-300">
      * * *
    </p>
  );
}
