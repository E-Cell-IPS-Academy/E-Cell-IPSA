import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminGalleryComplete from "@/screens/admin/AdminGalleryComplete";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_content">
      <AdminGalleryComplete />
    </ProtectedRoute>
  );
}
