import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminContactManagement from "@/screens/admin/AdminContactManagement";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminContactManagement />
    </ProtectedRoute>
  );
}
