import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminUsersComplete from "@/screens/admin/AdminUsersComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_users">
      <AdminUsersComplete />
    </ProtectedRoute>
  );
}
