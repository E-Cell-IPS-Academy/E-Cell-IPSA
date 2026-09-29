"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { CategoryEntry } from "../../lib/publication";
import { PUBLICATION, formatDate } from "../../lib/format";
import { EditionToggle } from "./EditionToggle";

interface MastheadProps {
  categories: CategoryEntry[];
  /** Active category slug, or "" for the front page. */
  activeCategory: string;
  query: string;
  onQuery: (value: string) => void;
}

/** Publication header: dateline, title, tagline, section navigation, search. */
export function Masthead({
  categories,
  activeCategory,
  query,
  onQuery,
}: MastheadProps) {
  const [today, setToday] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rendered after mount: the server's "today" can differ from the reader's.
  useEffect(() => setToday(formatDate(new Date(), "long")), []);

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const closeSearch = () => {
    setSearchOpen(false);
    onQuery("");
  };

  return (
    <header className="np-masthead">
      <div className="np-dateline np-label">
        <span suppressHydrationWarning>{today || "\u00a0"}</span>
        <span className="np-center">
          {PUBLICATION.org} · {PUBLICATION.place}
        </span>
        <EditionToggle />
      </div>

      <h1 className="np-title">
        {/* Keep the brand name unbroken: "The E-Cell / Chronicle", never "E- / Cell". */}
        {PUBLICATION.name.includes("E-Cell") ? (
          <>
            {PUBLICATION.name.split("E-Cell")[0]}
            <span style={{ whiteSpace: "nowrap" }}>E-Cell</span>
            {PUBLICATION.name.split("E-Cell")[1]}
          </>
        ) : (
          PUBLICATION.name
        )}
      </h1>
      <p className="np-tagline">{PUBLICATION.tagline}</p>

      <div className="np-rule-double" aria-hidden="true" />
      <div className="np-navbar" data-searching={searchOpen}>
        <nav className="np-nav" aria-label="Sections">
          <Link
            href="/blog"
            scroll={false}
            className="np-nav-link"
            aria-current={activeCategory === ""}
          >
            All Stories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog?category=${c.slug}`}
              scroll={false}
              className="np-nav-link"
              aria-current={activeCategory === c.slug}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <form
          role="search"
          className="np-search"
          data-open={searchOpen}
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="np-search-input" className="sr-only">
            Search stories
          </label>
          <input
            id="np-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search stories…"
            autoComplete="off"
          />
          {searchOpen ? (
            <button
              type="button"
              className="np-iconbtn np-search-toggle"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <X size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="np-iconbtn np-search-toggle"
              onClick={openSearch}
              aria-label="Search stories"
              aria-expanded={false}
            >
              <Search size={18} aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
      <div className="np-rule-hair" aria-hidden="true" />
    </header>
  );
}
