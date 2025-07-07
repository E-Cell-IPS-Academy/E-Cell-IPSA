// Create /src/pages/UserDashboard.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Trophy,
  BookOpen,
  Settings,
  Mail,
  MapPin,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserStats {
  eventsAttended: number;
  certificatesEarned: number;
  networkConnections: number;
  skillsLearned: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  status: "upcoming" | "completed" | "registered";
  image?: string;
}

interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  event: string;
}

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Mock data - replace with real API calls
  const [userStats] = useState<UserStats>({
    eventsAttended: 5,
    certificatesEarned: 3,
    networkConnections: 25,
    skillsLearned: 12,
  });

  const [upcomingEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Startup Pitch Competition 2025",
      date: "2025-01-15",
      status: "registered",
    },
    {
      id: "2",
      title: "AI in Entrepreneurship Workshop",
      date: "2025-01-20",
      status: "upcoming",
    },
  ]);

  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      title: "Entrepreneurship Fundamentals",
      issuedDate: "2024-12-03",
      event: "IgniteX 2024",
    },
    {
      id: "2",
      title: "Pitch Presentation Skills",
      issuedDate: "2024-10-04",
      event: "Pitching Contest",
    },
  ]);

  const handleResendVerification = async (): Promise<void> => {
    try {
      await resendVerificationEmail();
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user.displayName || "User"}!
              </h1>
              <p className="text-gray-400">
                Track your entrepreneurial journey and achievements
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </motion.button>
          </div>

          {/* Email Verification Alert */}
          {!user.emailVerified && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-orange-300 font-medium">
                      Email not verified
                    </p>
                    <p className="text-orange-400 text-sm">
                      Please verify your email to access all features
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResendVerification}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  Resend
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Events Attended",
              value: userStats.eventsAttended,
              icon: Calendar,
              color: "from-purple-500 to-pink-500",
              change: "+2 this month",
            },
            {
              title: "Certificates Earned",
              value: userStats.certificatesEarned,
              icon: Trophy,
              color: "from-blue-500 to-cyan-500",
              change: "+1 this month",
            },
            {
              title: "Network Connections",
              value: userStats.networkConnections,
              icon: User,
              color: "from-green-500 to-emerald-500",
              change: "+5 this month",
            },
            {
              title: "Skills Learned",
              value: userStats.skillsLearned,
              icon: BookOpen,
              color: "from-orange-500 to-red-500",
              change: "+3 this month",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Profile</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mb-6">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <h4 className="text-lg font-semibold text-white">
                  {user.displayName || "User"}
                </h4>
                <p className="text-gray-400 text-sm">{user.email}</p>
                {user.emailVerified && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">Verified</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Indore, India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined December 2024</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-left">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Register for Event</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-left">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <span className="text-white">View Certificates</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-left">
                  <User className="w-5 h-5 text-green-400" />
                  <span className="text-white">Connect with Peers</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Events & Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Upcoming Events */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Upcoming Events
                </h3>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {event.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {event.status === "registered" ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          Registered
                        </span>
                      ) : (
                        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
                          Register
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Certificates */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Recent Certificates
                </h3>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {cert.title}
                        </h4>
                        <p className="text-gray-400 text-xs">{cert.event}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 hover:text-yellow-300 text-xs font-medium">
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">
                Recent Activity
              </h3>

              <div className="space-y-4">
                {[
                  {
                    action: "Completed IgniteX 2024 event",
                    time: "2 days ago",
                    icon: CheckCircle,
                    color: "text-green-400",
                  },
                  {
                    action: "Earned Entrepreneurship Fundamentals certificate",
                    time: "3 days ago",
                    icon: Trophy,
                    color: "text-yellow-400",
                  },
                  {
                    action: "Registered for Startup Pitch Competition",
                    time: "1 week ago",
                    icon: Calendar,
                    color: "text-blue-400",
                  },
                  {
                    action: "Connected with 5 new entrepreneurs",
                    time: "2 weeks ago",
                    icon: User,
                    color: "text-purple-400",
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
