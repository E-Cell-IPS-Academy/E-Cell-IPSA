"use client";

import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/shared/feedback";
import ECellLoader from "@/components/core/Loader";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);

  if (showLoader) {
    return <ECellLoader onComplete={() => setShowLoader(false)} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
