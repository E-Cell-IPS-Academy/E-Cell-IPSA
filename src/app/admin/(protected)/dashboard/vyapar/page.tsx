import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminVyaparComplete from "@/screens/admin/AdminVyaparComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminVyaparComplete />
    </ProtectedRoute>
  );
}
