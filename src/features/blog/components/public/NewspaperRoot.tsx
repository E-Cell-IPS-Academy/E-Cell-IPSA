"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import "../../styles/newspaper.css";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,700;0,800;0,900;1,400;1,500;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap";

export type Edition = "day" | "night";
const STORAGE_KEY = "ecell-blog-edition";

interface EditionContextValue {
  edition: Edition;
  toggle: () => void;
}
const EditionContext = createContext<EditionContextValue | null>(null);

/** Current edition + toggle; safe (no-op) outside a <NewspaperRoot>. */
export function useEdition(): EditionContextValue {
  return (
    useContext(EditionContext) ?? { edition: "day", toggle: () => undefined }
  );
}

interface NewspaperRootProps {
  children: ReactNode;
  /** Adds the full-page padding (clears the fixed site navbar). */
  page?: boolean;
  className?: string;
  id?: string;
}

/**
 * Scope + theme provider for every editorial surface. Loads the publication
 * fonts (React 19 hoists <link precedence> into <head> and de-duplicates it)
 * and owns the reader's Day / Night edition choice.
 */
export function NewspaperRoot({
  children,
  page = false,
  className,
  id,
}: NewspaperRootProps) {
  const [edition, setEdition] = useState<Edition>("day");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "day" || saved === "night") setEdition(saved);
    } catch {
      /* storage unavailable — stay on the default edition */
    }
  }, []);

  const toggle = useCallback(() => {
    setEdition((prev) => {
      const next: Edition = prev === "day" ? "night" : "day";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ edition, toggle }), [edition, toggle]);

  return (
    <EditionContext.Provider value={value}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={FONTS_URL} precedence="np-fonts" />
      <div
        id={id}
        className={cn("np-root", page && "np-page", className)}
        data-edition={edition}
      >
        {children}
      </div>
    </EditionContext.Provider>
  );
}
