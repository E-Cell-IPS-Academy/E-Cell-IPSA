"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

/**
 * Chrome + auth gate for every /admin/* route except /admin/login.
 * Mirrors the old <ProtectedRoute><AdminLayout>...</AdminLayout></ProtectedRoute>
 * wrapping in AppRoutes.tsx's AdminArea.
 */
export default function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
