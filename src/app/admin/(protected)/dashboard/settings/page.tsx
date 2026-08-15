import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminSiteSettings from "@/screens/admin/AdminSiteSettings";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_settings">
      <AdminSiteSettings />
    </ProtectedRoute>
  );
}
