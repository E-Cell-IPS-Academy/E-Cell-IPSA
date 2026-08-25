import type { ReactNode } from "react";
import { PublicLayout } from "@/routes/PublicLayout";

export default function PublicGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
