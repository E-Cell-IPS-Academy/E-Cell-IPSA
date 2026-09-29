"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Listing filters kept in the URL (?category=startups&tag=ai&q=funding) so
 * views are shareable and the Back button behaves. Category and tag come
 * straight from the URL; the search box keeps local state for instant typing
 * and writes to the URL after a short pause.
 */
export function useBlogFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? "/blog";

  const category = params?.get("category") ?? "";
  const tag = params?.get("tag") ?? "";
  const urlQuery = params?.get("q") ?? "";

  const [query, setQueryState] = useState(urlQuery);
  const lastPushed = useRef(urlQuery);

  // Adopt external URL changes (Back/Forward, "clear filters" links) — but not
  // the echo of our own debounced write, which would clobber fast typing.
  useEffect(() => {
    if (urlQuery !== lastPushed.current) {
      lastPushed.current = urlQuery;
      setQueryState(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (query === lastPushed.current) return;
    const timer = window.setTimeout(() => {
      lastPushed.current = query;
      const next = new URLSearchParams(params?.toString() ?? "");
      if (query.trim()) next.set("q", query);
      else next.delete("q");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, params, pathname, router]);

  const clear = useCallback(() => {
    lastPushed.current = "";
    setQueryState("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    category,
    tag,
    query,
    setQuery: setQueryState,
    clear,
    isFiltering: !!(category || tag || query.trim()),
  };
}
