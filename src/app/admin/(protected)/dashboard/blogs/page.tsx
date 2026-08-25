import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminBlogsComplete from "@/screens/admin/AdminBlogsComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminBlogsComplete />
    </ProtectedRoute>
  );
}
