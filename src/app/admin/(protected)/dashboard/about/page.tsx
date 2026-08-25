import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminAboutManagement from "@/screens/admin/AdminAboutManagement";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminAboutManagement />
    </ProtectedRoute>
  );
}
