// Create /src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Plus,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AdminSession, DashboardStats } from "../types/admin";

const AdminDashboard: React.FC = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 3,
    totalStudents: 500,
    totalStartups: 25,
    monthlyGrowth: 15,
  });
  const [activeTab, setActiveTab] = useState<string>("overview");
  const navigate = useNavigate();
  console.log(setStats);
  useEffect(() => {
    // Check admin session
    const session = localStorage.getItem("adminSession");
    if (session) {
      try {
        const parsedSession: AdminSession = JSON.parse(session);
        setAdminSession(parsedSession);
      } catch (error) {
        console.error("Error parsing admin session:", error);
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = (): void => {
    localStorage.removeItem("adminSession");
    navigate("/admin/login");
  };

  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      permission: "view_analytics",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      permission: "manage_events",
    },
    { id: "users", label: "Users", icon: Users, permission: "manage_users" },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      permission: "manage_content",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      permission: "manage_settings",
    },
  ];

  const hasPermission = (permission: string): boolean => {
    return adminSession?.permissions.includes(permission as any) || false;
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-full w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">E-Cell IPS Academy</p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <p className="font-semibold text-white">{adminSession.username}</p>
            <p className="text-xs text-purple-400">{adminSession.role}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              if (!hasPermission(item.permission)) return null;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-xl border-b border-white/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
              <p className="text-gray-400">Manage your E-Cell dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Events",
                    value: stats.totalEvents,
                    change: "+2 this month",
                    icon: Calendar,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "Students Reached",
                    value: stats.totalStudents,
                    change: "+50 this month",
                    icon: Users,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Startups Mentored",
                    value: stats.totalStartups,
                    change: "+5 this month",
                    icon: TrendingUp,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Monthly Growth",
                    value: `${stats.monthlyGrowth}%`,
                    change: "+3% from last month",
                    icon: BarChart3,
                    color: "from-orange-500 to-red-500",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      action: "New event created",
                      time: "2 hours ago",
                      type: "event",
                    },
                    {
                      action: "User registered for IgniteX",
                      time: "4 hours ago",
                      type: "user",
                    },
                    {
                      action: "Content updated",
                      time: "1 day ago",
                      type: "content",
                    },
                    {
                      action: "Analytics report generated",
                      time: "2 days ago",
                      type: "report",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "event"
                            ? "bg-purple-500"
                            : activity.type === "user"
                            ? "bg-blue-500"
                            : activity.type === "content"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4 capitalize">
                {activeTab} Management
              </h3>
              <p className="text-gray-400 mb-6">
                This section is under development
              </p>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Settings className="w-8 h-8 text-white animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
