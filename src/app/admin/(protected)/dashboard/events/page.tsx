import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminEvents from "@/screens/admin/AdminEvents";

export default function Page() {
  return (
    <ProtectedRoute requiredPermission="manage_events">
      <AdminEvents />
    </ProtectedRoute>
  );
}
