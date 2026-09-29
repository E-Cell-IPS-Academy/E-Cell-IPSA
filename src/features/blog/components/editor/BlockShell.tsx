"use client";

import type { DragEvent, ReactNode } from "react";
import { ArrowDown, ArrowUp, Copy, GripVertical, Trash2 } from "lucide-react";
import type { ContentBlock } from "../../types";
import { cn } from "@/shared/lib/cn";
import { BLOCK_ICON, BLOCK_LABEL } from "./blockMeta";
import { IconBtn } from "./controls";

interface BlockShellProps {
  block: ContentBlock;
  index: number;
  count: number;
  selected: boolean;
  /** Where the dragged item would land relative to this block. */
  dropIndicator: "before" | "after" | null;
  isDragging: boolean;
  onSelect: () => void;
  onMove: (delta: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onHandleDragStart: (e: DragEvent<HTMLButtonElement>, cardEl: HTMLElement | null) => void;
  onHandleDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  children: ReactNode;
}

/**
 * Card chrome around every block: drag handle, type label and actions.
 * Reordering works by drag-and-drop *and* by the Move up / Move down buttons,
 * so it is fully usable from the keyboard.
 */
export function BlockShell({
  block,
  index,
  count,
  selected,
  dropIndicator,
  isDragging,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
  onHandleDragStart,
  onHandleDragEnd,
  onDragOver,
  onDrop,
  onDragLeave,
  children,
}: BlockShellProps) {
  const Icon = BLOCK_ICON[block.type] ?? BLOCK_ICON.paragraph;
  const label = BLOCK_LABEL[block.type] ?? "Unknown";

  return (
    <section
      aria-label={`${label} block, ${index + 1} of ${count}`}
      data-block-id={block.id}
      data-block-type={block.type}
      onFocusCapture={onSelect}
      onPointerDownCapture={onSelect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      className={cn(
        "relative rounded-xl border bg-white transition-shadow",
        selected ? "border-indigo-300 shadow-md ring-1 ring-indigo-200" : "border-slate-200",
        isDragging && "opacity-40"
      )}
    >
      {dropIndicator === "before" && (
        <div aria-hidden="true" className="absolute -top-2 left-0 right-0 z-20 h-1 rounded-full bg-indigo-500" />
      )}
      {dropIndicator === "after" && (
        <div aria-hidden="true" className="absolute -bottom-2 left-0 right-0 z-20 h-1 rounded-full bg-indigo-500" />
      )}

      <header className="flex items-center gap-1 border-b border-slate-100 px-2 py-1.5">
        <button
          type="button"
          draggable
          aria-label={`Drag to reorder ${label.toLowerCase()} block`}
          title="Drag to reorder"
          onDragStart={(e) => onHandleDragStart(e, e.currentTarget.closest("section"))}
          onDragEnd={onHandleDragEnd}
          className="inline-flex h-8 w-7 cursor-grab items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </span>
        <div className="ml-auto flex items-center">
          <IconBtn label="Move block up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Move block down" disabled={index === count - 1} onClick={() => onMove(1)}>
            <ArrowDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Duplicate block" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Delete block" danger onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </header>

      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}