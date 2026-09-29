import type { DragEvent } from "react";

/** Custom drag type used when reordering blocks (distinguishes it from file drops). */
export const BLOCK_DRAG_TYPE = "application/x-ecell-block";

export const dragHasFiles = (e: DragEvent | globalThis.DragEvent) =>
  Array.from(e.dataTransfer?.types ?? []).includes("Files");

export const imageFilesFrom = (e: DragEvent) =>
  Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
