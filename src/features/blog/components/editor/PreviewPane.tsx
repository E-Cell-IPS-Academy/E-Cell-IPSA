"use client";

import { useMemo } from "react";
import type { BlogFormValues } from "../../types";
import { estimateReadTime, hasBlocks, isBlockEmpty } from "../../lib/blocks";
import { todayISO } from "../../lib/format";
import { cn } from "@/shared/lib/cn";
import { NewspaperRoot } from "../public/NewspaperRoot";
import { ArticleView } from "../reader/ArticleView";
import type { PreviewDevice } from "./EditorTopBar";

/**
 * Renders the draft with the exact components readers get. The article lays
 * itself out from its own width (container queries), so the "Mobile" preview
 * is a true phone-width layout, not a scaled screenshot.
 */
export function PreviewPane({ values, device }: { values: BlogFormValues; device: PreviewDevice }) {
  const post = useMemo<BlogFormValues>(() => {
    const blocks = (values.blocks ?? []).filter((b) => !isBlockEmpty(b));
    return {
      ...values,
      blocks,
      readTime: hasBlocks({ blocks }) ? estimateReadTime(blocks) : values.readTime,
      publishedDate: values.publishedDate || todayISO(),
    };
  }, [values]);

  return (
    <div className="rounded-xl bg-slate-200/70 p-3 sm:p-6" data-testid="preview-pane">
      <p className="mb-3 text-center text-xs text-slate-500">
        Preview — this is exactly how readers will see the story
        {values.status !== "published" && " (not published yet)"}.
      </p>
      <div
        className={cn("mx-auto overflow-hidden rounded-lg border border-slate-300 shadow-sm transition-[max-width]", device === "mobile" ? "max-w-[390px]" : "max-w-full")}
        data-testid="preview-frame"
        data-device={device}
      >
        <NewspaperRoot>
          <div className="pb-10">
            <ArticleView post={post} preview />
          </div>
        </NewspaperRoot>
      </div>
    </div>
  );
}
