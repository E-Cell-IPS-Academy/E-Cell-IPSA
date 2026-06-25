import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Users,
  FileText,
  Image,
  UsersRound,
  Layout,
  Info,
  Phone,
  Wrench,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { cn } from "../../shared/lib/cn";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  permission: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: "/admin/dashboard",
    permission: "view_analytics",
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    href: "/admin/dashboard/events",
    permission: "manage_events",
  },
  {
    id: "startups",
    label: "Startups",
    icon: Users,
    href: "/admin/dashboard/startups",
    permission: "manage_content",
  },
  {
    id: "blogs",
    label: "Blog Posts",
    icon: FileText,
    href: "/admin/dashboard/blogs",
    permission: "manage_content",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: Image,
    href: "/admin/dashboard/gallery",
    permission: "manage_content",
  },
  {
    id: "team",
    label: "Team",
    icon: UsersRound,
    href: "/admin/dashboard/team",
    permission: "manage_content",
  },
  {
    id: "hero",
    label: "Hero Section",
    icon: Layout,
    href: "/admin/dashboard/hero",
    permission: "manage_content",
  },
  {
    id: "about",
    label: "About Page",
    icon: Info,
    href: "/admin/dashboard/about",
    permission: "manage_content",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Phone,
    href: "/admin/dashboard/contact",
    permission: "manage_content",
  },
  {
    id: "settings",
    label: "Site Settings",
    icon: Wrench,
    href: "/admin/dashboard/settings",
    permission: "manage_settings",
  },
];

function titleFromPath(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/dashboard")
    return "Dashboard";
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const NavLinks: React.FC<{
  items: SidebarItem[];
  pathname: string;
  hasPermission: (p: string) => boolean;
  onNavigate?: () => void;
}> = ({ items, pathname, hasPermission, onNavigate }) => (
  <nav className="flex-1 space-y-1 overflow-y-auto p-3">
    {items.map((item) => {
      if (!hasPermission(item.permission)) return null;
      const isActive =
        pathname === item.href ||
        (item.href === "/admin/dashboard" && pathname === "/admin");
      return (
        <Link
          key={item.id}
          to={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-indigo-50 font-medium text-indigo-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <item.icon className="h-[18px] w-[18px]" />
          <span>{item.label}</span>
        </Link>
      );
    })}
  </nav>
);

const Brand: React.FC = () => (
  <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
      <Shield className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">Admin</p>
      <p className="text-xs text-slate-500">E-Cell IPS Academy</p>
    </div>
  </div>
);

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { adminSession, logout, hasPermission } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  if (!adminSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Brand />
        <NavLinks
          items={SIDEBAR_ITEMS}
          pathname={location.pathname}
          hasPermission={hasPermission}
        />
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="flex h-full w-64 flex-col bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <span className="text-sm font-semibold text-slate-900">
                  Admin
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks
                items={SIDEBAR_ITEMS}
                pathname={location.pathname}
                hasPermission={hasPermission}
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="border-t border-slate-200 p-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {titleFromPath(location.pathname)}
                </h1>
                <p className="hidden text-xs text-slate-500 md:block">
                  Manage your E-Cell content
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((v) => !v);
                }}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User className="h-4 w-4" />
                </span>
                <span className="hidden text-left md:block">
                  <span className="block text-sm font-medium text-slate-900">
                    {adminSession.username}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {adminSession.role}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/admin/dashboard/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-57px)] p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
