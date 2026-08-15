import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminCertEventManageComplete from "@/screens/admin/AdminCertEventManageComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminCertEventManageComplete />
    </ProtectedRoute>
  );
}
