"use client";

import { Moon, Sun } from "lucide-react";
import { useEdition } from "./NewspaperRoot";

/** Day / Night edition switch. */
export function EditionToggle() {
  const { edition, toggle } = useEdition();
  return (
    <button
      type="button"
      className="np-edition-btn np-label"
      onClick={toggle}
      aria-pressed={edition === "night"}
    >
      {edition === "night" ? (
        <Sun size={14} aria-hidden="true" />
      ) : (
        <Moon size={14} aria-hidden="true" />
      )}
      {edition === "night" ? "Day edition" : "Night edition"}
    </button>
  );
}
