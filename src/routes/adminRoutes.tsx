import type { AdminRouteConfig } from "./types";

import AdminDashboard from "../pages/AdminDashboard";
import AdminEventsComplete from "../pages/admin/AdminEvents";
import AdminBlogsComplete from "../pages/admin/AdminBlogsComplete";
import AdminStartupsComplete from "../pages/admin/AdminStartupsComplete";
import AdminUsersComplete from "../pages/admin/AdminUsersComplete";
import AdminGalleryComplete from "../pages/admin/AdminGalleryComplete";
import AdminTeamManagement from "../pages/admin/AdminTeamManagement";
import AdminHeroManagement from "../pages/admin/AdminHeroManagement";
import AdminAboutManagement from "../pages/admin/AdminAboutManagement";
import AdminContactManagement from "../pages/admin/AdminContactManagement";
import AdminSiteSettings from "../pages/admin/AdminSiteSettings";

/**
 * Admin routes (rendered inside ProtectedRoute + AdminLayout).
 * Paths are relative to the "/admin/*" mount point in AppRoutes.
 * `requiredPermission` gates the route behind a nested permission check.
 */
export const adminRoutes: AdminRouteConfig[] = [
  { path: "/", element: <AdminDashboard /> },
  { path: "/dashboard", element: <AdminDashboard /> },
  {
    path: "/dashboard/events",
    element: <AdminEventsComplete />,
    requiredPermission: "manage_events",
  },
  {
    path: "/dashboard/startups",
    element: <AdminStartupsComplete />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/blogs",
    element: <AdminBlogsComplete />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/users",
    element: <AdminUsersComplete />,
    requiredPermission: "manage_users",
  },
  {
    path: "/dashboard/gallery",
    element: <AdminGalleryComplete />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/team",
    element: <AdminTeamManagement />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/hero",
    element: <AdminHeroManagement />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/about",
    element: <AdminAboutManagement />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/contact",
    element: <AdminContactManagement />,
    requiredPermission: "manage_content",
  },
  {
    path: "/dashboard/settings",
    element: <AdminSiteSettings />,
    requiredPermission: "manage_settings",
  },
];
