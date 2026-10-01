import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { IgnitexCompetitionAdminPage } from "@/features/ignitex/IgnitexCompetitionAdminPage";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <IgnitexCompetitionAdminPage />
    </ProtectedRoute>
  );
}
