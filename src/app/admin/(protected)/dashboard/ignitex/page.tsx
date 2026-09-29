import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { IgnitexAdminPage } from "@/features/ignitex/IgnitexAdminPage";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <IgnitexAdminPage />
    </ProtectedRoute>
  );
}
