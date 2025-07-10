// Fixed /src/components/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BarChart3,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  permission: string;
  badge?: number;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const { adminSession, logout, hasPermission } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
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
      badge: 3,
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
      icon: FileText,
      href: "/admin/dashboard/gallery",
      permission: "manage_content",
    },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileDropdown) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileDropdown]);

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -200 }}
        className="fixed left-0 top-0 h-full w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 z-40 hidden lg:block"
        style={{
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">E-Cell IPS Academy</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-white/10">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {adminSession.username}
                  </p>
                  <p className="text-xs text-purple-400">{adminSession.role}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Last login:{" "}
                {new Date(adminSession.loginTime).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              if (!hasPermission(item.permission)) return null;

              const isActive =
                location.pathname === item.href ||
                (item.href === "/admin/dashboard" &&
                  location.pathname === "/admin");

              return (
                <motion.div key={item.id}>
                  <Link
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              className="w-64 h-full bg-black/90 backdrop-blur-xl border-r border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white">Admin Panel</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {sidebarItems.map((item) => {
                    if (!hasPermission(item.permission)) return null;

                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - FIXED: Added proper margin and transition */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 bg-black/50 backdrop-blur-xl border-b border-white/10 z-30"
          style={{
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
          }}
        >
          <div className="flex items-center justify-between p-4 lg:p-6">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-400 hover:text-white lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Page Title */}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {location.pathname === "/admin/dashboard" ||
                  location.pathname === "/admin"
                    ? "Dashboard"
                    : location.pathname
                        .split("/")
                        .pop()
                        ?.replace("-", " ")
                        ?.split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                </h2>
                <p className="text-sm text-gray-400 hidden md:block">
                  Manage your E-Cell administration
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {adminSession.username}
                    </p>
                    <p className="text-xs text-gray-400">{adminSession.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl py-2 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>
                      <div className="border-t border-white/10 my-2" />
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
