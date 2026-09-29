"use client";

import { createContext, useContext } from "react";
import type { BlogImage } from "../../types";

export interface EditorContextValue {
  /** Upload files to Cloudinary; resolves with the successfully uploaded images. */
  uploadFiles: (files: File[], options?: { folder?: string }) => Promise<BlogImage[]>;
  /** Every image uploaded for / used in this post (the "Images" tray). */
  media: BlogImage[];
  addMedia: (images: BlogImage[]) => void;
  /** Surface an error to the author (toast). */
  notify: (message: string) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export const EditorProvider = EditorContext.Provider;

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx;
}
