import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminStartupsComplete from "@/screens/admin/AdminStartupsComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminStartupsComplete />
    </ProtectedRoute>
  );
}
