import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminCertEventsComplete from "@/screens/admin/AdminCertEventsComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminCertEventsComplete />
    </ProtectedRoute>
  );
}
