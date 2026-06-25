// Updated /src/pages/AdminDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  Plus,
  Eye,
  MessageSquare,
  Heart,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";
import type { DashboardStats } from "../types/admin";

const AdminDashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalEvents: 8,
    totalStudents: 1250,
    totalStartups: 35,
    monthlyGrowth: 23,
  });

  const [timeRange, setTimeRange] = useState<string>("7d");

  const recentActivities = [
    {
      id: 1,
      type: "event",
      action: "New event 'Startup Bootcamp 2025' was created",
      user: "Admin",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-purple-400",
    },
    {
      id: 2,
      type: "user",
      action: "50 new users registered for IgniteX",
      user: "System",
      time: "4 hours ago",
      icon: Users,
      color: "text-blue-400",
    },
    {
      id: 3,
      type: "blog",
      action: "Blog post 'AI in Entrepreneurship' was published",
      user: "Content Team",
      time: "6 hours ago",
      icon: MessageSquare,
      color: "text-green-400",
    },
    {
      id: 4,
      type: "startup",
      action: "GreenTech Solutions featured as Startup of the Week",
      user: "Admin",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ];

  const quickStats = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      change: "+2",
      changePercent: "+15%",
      trend: "up",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Events this month",
    },
    {
      title: "Active Users",
      value: stats.totalStudents,
      change: "+127",
      changePercent: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Registered users",
    },
    {
      title: "Startups Featured",
      value: stats.totalStartups,
      change: "+3",
      changePercent: "+9%",
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      description: "Featured startups",
    },
    {
      title: "Monthly Growth",
      value: `${stats.monthlyGrowth}%`,
      change: "+5%",
      changePercent: "+23%",
      trend: "up",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      description: "Growth rate",
    },
  ];

  const contentStats = [
    {
      title: "Blog Views",
      value: "45.2K",
      change: "+12%",
      icon: Eye,
      color: "text-purple-400",
    },
    {
      title: "Engagement",
      value: "89.5%",
      change: "+5%",
      icon: Heart,
      color: "text-red-400",
    },
    {
      title: "Comments",
      value: "1.2K",
      change: "+8%",
      icon: MessageSquare,
      color: "text-blue-400",
    },
    {
      title: "Avg. Read Time",
      value: "4.5m",
      change: "+15%",
      icon: Clock,
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening with your E-Cell platform.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          {/* Quick Action Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            {/* Background Gradient */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 ${stat.bgColor} rounded-full blur-3xl opacity-20`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">
                    {stat.changePercent}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">{stat.change}</span>
                <span className="text-gray-500">{stat.description}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Recent Activity
            </h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${activity.color}`}
                >
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium mb-1">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>by {activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Content Stats</h3>

          <div className="space-y-4">
            {contentStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-gray-300 text-sm">{stat.title}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{stat.value}</p>
                  <p className="text-green-400 text-xs">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors">
            View Analytics
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Create Event",
              description: "Add a new event",
              icon: Calendar,
              color: "from-purple-500 to-purple-600",
              href: "/admin/events/new",
            },
            {
              title: "Write Blog",
              description: "Create blog post",
              icon: MessageSquare,
              color: "from-green-500 to-green-600",
              href: "/admin/blogs/new",
            },
            {
              title: "Manage Users",
              description: "User management",
              icon: Users,
              color: "from-orange-500 to-orange-600",
              href: "/admin/users",
            },
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 text-left"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-1">{action.title}</h4>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
