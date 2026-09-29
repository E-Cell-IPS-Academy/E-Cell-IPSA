"use client";

import { useCallback, useReducer } from "react";
import type { ContentBlock } from "../types";
import { cloneBlock, moveItem } from "../lib/blocks";

interface State {
  blocks: ContentBlock[];
  /** Snapshots taken before each structural change, newest last. */
  past: ContentBlock[][];
}

type Action =
  | { type: "insert"; index: number; blocks: ContentBlock[] }
  | { type: "replace"; block: ContentBlock }
  | { type: "remove"; id: string }
  | { type: "move"; id: string; to: number }
  | { type: "duplicate"; id: string }
  | { type: "undo" }
  | { type: "reset"; blocks: ContentBlock[] };

const MAX_HISTORY = 50;
const remember = (s: State): ContentBlock[][] =>
  [...s.past, s.blocks].slice(-MAX_HISTORY);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "insert": {
      const at = Math.max(0, Math.min(action.index, state.blocks.length));
      const blocks = [...state.blocks];
      blocks.splice(at, 0, ...action.blocks);
      return { blocks, past: remember(state) };
    }
    // Typing is not a structural change, so it is not added to undo history.
    case "replace":
      return {
        ...state,
        blocks: state.blocks.map((b) => (b.id === action.block.id ? action.block : b)),
      };
    case "remove":
      return {
        blocks: state.blocks.filter((b) => b.id !== action.id),
        past: remember(state),
      };
    case "move": {
      const from = state.blocks.findIndex((b) => b.id === action.id);
      if (from < 0 || from === action.to) return state;
      return { blocks: moveItem(state.blocks, from, action.to), past: remember(state) };
    }
    case "duplicate": {
      const i = state.blocks.findIndex((b) => b.id === action.id);
      if (i < 0) return state;
      const blocks = [...state.blocks];
      blocks.splice(i + 1, 0, cloneBlock(state.blocks[i]));
      return { blocks, past: remember(state) };
    }
    case "undo": {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return { blocks: previous, past: state.past.slice(0, -1) };
    }
    case "reset":
      return { blocks: action.blocks, past: [] };
  }
}

/** Block list state for the article editor: insert / edit / move / remove / undo. */
export function useBlockEditor(initial: ContentBlock[]) {
  const [state, dispatch] = useReducer(reducer, { blocks: initial, past: [] });

  return {
    blocks: state.blocks,
    canUndo: state.past.length > 0,
    insert: useCallback(
      (index: number, ...blocks: ContentBlock[]) =>
        dispatch({ type: "insert", index, blocks }),
      []
    ),
    replace: useCallback((block: ContentBlock) => dispatch({ type: "replace", block }), []),
    remove: useCallback((id: string) => dispatch({ type: "remove", id }), []),
    move: useCallback((id: string, to: number) => dispatch({ type: "move", id, to }), []),
    duplicate: useCallback((id: string) => dispatch({ type: "duplicate", id }), []),
    undo: useCallback(() => dispatch({ type: "undo" }), []),
    reset: useCallback((blocks: ContentBlock[]) => dispatch({ type: "reset", blocks }), []),
  };
}
