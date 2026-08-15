import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/AdminLogin";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

import UserLogin from "../pages/UserLogin";
import UserSignup from "../pages/UserSignup";
import UserDashboard from "../pages/UserDashboard";
import StartupRegistration from "../pages/VypaarXPage";
import HiringResponses from "../pages/ResponsePage";

import { PublicLayout } from "./PublicLayout";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./adminRoutes";

/** Nested admin routes, rendered inside ProtectedRoute + AdminLayout. */
function AdminArea() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          {adminRoutes.map(({ path, element, requiredPermission }) => (
            <Route
              key={path}
              path={path}
              element={
                requiredPermission ? (
                  <ProtectedRoute requiredPermission={requiredPermission}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}

/** Public routes, rendered inside the Navbar/Footer layout. */
function PublicArea() {
  return (
    <PublicLayout>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </PublicLayout>
  );
}

/** Top-level route table for the whole app. */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminArea />} />

      {/* Auth & special */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/register" element={<StartupRegistration />} />
      <Route path="/response" element={<HiringResponses />} />

      {/* User dashboard (public chrome) */}
      <Route
        path="/dashboard"
        element={
          <PublicLayout>
            <UserDashboard />
          </PublicLayout>
        }
      />

      {/* Public site */}
      <Route path="/*" element={<PublicArea />} />
    </Routes>
  );
}
