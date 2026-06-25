import type { ReactNode } from "react";
import Navbar from "../components/core/Navbar";
import Footer from "../components/core/Footer";

/** Shared chrome (Navbar + Footer) for all public-facing pages. */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
