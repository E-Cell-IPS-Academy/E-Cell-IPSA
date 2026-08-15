import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminTeamManagement from "@/screens/admin/AdminTeamManagement";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminTeamManagement />
    </ProtectedRoute>
  );
}
