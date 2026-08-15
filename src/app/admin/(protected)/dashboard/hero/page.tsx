import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminHeroManagement from "@/screens/admin/AdminHeroManagement";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminHeroManagement />
    </ProtectedRoute>
  );
}
