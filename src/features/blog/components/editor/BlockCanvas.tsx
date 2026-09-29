"use client";

import { Fragment, useEffect, useState } from "react";
import type { DragEvent } from "react";
import type { ContentBlock } from "../../types";
import { createBlock } from "../../lib/blocks";
import { BlockEditor } from "./blocks/BlockEditor";
import { BlockInserter } from "./BlockInserter";
import { BlockShell } from "./BlockShell";
import { BLOCK_DRAG_TYPE, dragHasFiles, imageFilesFrom } from "./dnd";

interface BlockCanvasProps {
  blocks: ContentBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onInsert: (index: number, block: ContentBlock) => void;
  onReplace: (block: ContentBlock) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, to: number) => void;
  onDuplicate: (id: string) => void;
  /** Image files dropped from the desktop onto a position in the article. */
  onFilesDropped: (files: File[], index: number) => void;
}

/**
 * The article body as an ordered list of editable blocks. Blocks can be
 * inserted anywhere (the "+" between blocks), reordered by drag-and-drop or
 * the move buttons, and image files can be dropped straight between them.
 */
export function BlockCanvas({
  blocks,
  selectedId,
  onSelect,
  onInsert,
  onReplace,
  onRemove,
  onMove,
  onDuplicate,
  onFilesDropped,
}: BlockCanvasProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [drop, setDrop] = useState<number | null>(null);

  // A file dropped outside a drop target would make the browser navigate away
  // to the image and lose the whole draft — swallow those at window level.
  useEffect(() => {
    const stop = (e: globalThis.DragEvent) => {
      if (dragHasFiles(e)) e.preventDefault();
    };
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  const indexFor = (e: DragEvent<HTMLElement>, i: number) => {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientY < r.top + r.height / 2 ? i : i + 1;
  };

  const reset = () => {
    setDragId(null);
    setDrop(null);
  };

  const handleOver = (i: number) => (e: DragEvent<HTMLElement>) => {
    if (!dragId && !dragHasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = dragId ? "move" : "copy";
    setDrop(indexFor(e, i));
  };

  const handleDrop = (i: number) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const at = indexFor(e, i);
    if (dragId) {
      const from = blocks.findIndex((b) => b.id === dragId);
      if (from >= 0) onMove(dragId, at > from ? at - 1 : at);
    } else {
      const files = imageFilesFrom(e);
      if (files.length) onFilesDropped(files, at);
    }
    reset();
  };

  return (
    <div
      onDragOver={(e) => {
        if (!dragId && !dragHasFiles(e)) return;
        e.preventDefault(); // allow dropping in the gaps between blocks
        // Only the empty area *below* the blocks means "append"; the thin gaps
        // between blocks keep the position computed by the nearest block.
        if (e.target === e.currentTarget) setDrop(blocks.length);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const at = drop ?? blocks.length;
        if (dragId) {
          const from = blocks.findIndex((b) => b.id === dragId);
          if (from >= 0) onMove(dragId, at > from ? at - 1 : at);
        } else {
          const files = imageFilesFrom(e);
          if (files.length) onFilesDropped(files, at);
        }
        reset();
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrop(null);
      }}
      data-testid="block-canvas"
    >
      {blocks.length === 0 && (
        <p className="mb-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Your article is empty. Add a paragraph, heading or image — or drop image files here.
        </p>
      )}

      {blocks.length > 0 && (
        <BlockInserter label="Insert block at the start" onPick={(b) => onInsert(0, b)} />
      )}

      {blocks.map((block, i) => (
        <Fragment key={block.id}>
          <BlockShell
            block={block}
            index={i}
            count={blocks.length}
            selected={selectedId === block.id}
            isDragging={dragId === block.id}
            dropIndicator={drop === i ? "before" : drop === blocks.length && i === blocks.length - 1 ? "after" : null}
            onSelect={() => onSelect(block.id)}
            onMove={(delta) => onMove(block.id, i + delta)}
            onDuplicate={() => onDuplicate(block.id)}
            onDelete={() => onRemove(block.id)}
            onHandleDragStart={(e, card) => {
              e.dataTransfer.setData(BLOCK_DRAG_TYPE, block.id);
              e.dataTransfer.effectAllowed = "move";
              if (card) e.dataTransfer.setDragImage(card, 24, 24);
              setDragId(block.id);
            }}
            onHandleDragEnd={reset}
            onDragOver={handleOver(i)}
            onDrop={handleDrop(i)}
            onDragLeave={() => undefined}
          >
            <BlockEditor
              block={block}
              onChange={onReplace}
              onInsertParagraphAfter={() => onInsert(i + 1, createBlock("paragraph"))}
            />
          </BlockShell>
          {i < blocks.length - 1 && (
            <BlockInserter label={`Insert block after block ${i + 1}`} onPick={(b) => onInsert(i + 1, b)} />
          )}
        </Fragment>
      ))}

      <BlockInserter prominent label="Add block at the end" onPick={(b) => onInsert(blocks.length, b)} />
    </div>
  );
}
