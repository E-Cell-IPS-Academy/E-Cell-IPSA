// /src/pages/admin/AdminUsersComplete.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Eye,
  Trash2,
  MoreVertical,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Building2,
  Award,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  UserPlus,
  Shield,
  Clock,
  TrendingUp,
  BookOpen,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

// Firebase imports
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  userType: "student" | "entrepreneur" | "professional" | "alumni" | "other";
  status: "active" | "inactive" | "suspended" | "pending";
  interests: string[];
  skills: string[];

  // Student specific
  institution?: string;
  course?: string;
  year?: string;
  studentId?: string;
  gpa?: number;

  // Professional specific
  company?: string;
  position?: string;
  experience?: string;
  salary?: string;

  // Contact & Social
  location: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;

  // Platform activity
  joinedDate: string;
  lastLogin?: string;
  isVerified: boolean;
  eventsAttended: number;
  blogsRead: number;
  profileCompletion: number;

  // Additional details
  achievements: string[];
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
    url?: string;
    technologies: string[];
  }>;

  createdAt?: any;
  updatedAt?: any;
}

interface UserStats {
  total: number;
  students: number;
  entrepreneurs: number;
  professionals: number;
  alumni: number;
  active: number;
  inactive: number;
  verified: number;
  newThisMonth: number;
}

type ModalMode = "view" | "edit" | null;

// Users service
class UsersService {
  private collection = "users";

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserProfile[];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<UserProfile>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, userId), {
        ...userData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  async getUserStats(users: UserProfile[]): Promise<UserStats> {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: users.length,
      students: users.filter((u) => u.userType === "student").length,
      entrepreneurs: users.filter((u) => u.userType === "entrepreneur").length,
      professionals: users.filter((u) => u.userType === "professional").length,
      alumni: users.filter((u) => u.userType === "alumni").length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      verified: users.filter((u) => u.isVerified).length,
      newThisMonth: users.filter(
        (u) => u.createdAt && new Date(u.createdAt.toDate()) >= thisMonth
      ).length,
    };
    return stats;
  }
}

const usersService = new UsersService();

const AdminUsersComplete: React.FC = () => {
  // State management
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    students: 0,
    entrepreneurs: 0,
    professionals: 0,
    alumni: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    newThisMonth: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Update stats when users change
  useEffect(() => {
    loadStats();
  }, [users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await usersService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      showNotification("error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await usersService.getUserStats(users);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // Fixed filteredUsers logic - replace lines 248-262 in your component

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      (user.institution &&
        user.institution.toLowerCase().includes(searchLower)) ||
      (user.company && user.company.toLowerCase().includes(searchLower));

    const matchesUserType =
      userTypeFilter === "all" || user.userType === userTypeFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesUserType && matchesStatus;
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const openViewModal = (user: UserProfile) => {
    setModalMode("view");
    setSelectedUser(user);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const handleStatusChange = async (
    user: UserProfile,
    newStatus: UserProfile["status"]
  ) => {
    try {
      await usersService.updateUser(user.id, { status: newStatus });
      showNotification("success", "User status updated!");
      await loadUsers();
    } catch (error) {
      showNotification("error", "Failed to update status");
    }
  };

  const handleVerificationToggle = async (user: UserProfile) => {
    try {
      await usersService.updateUser(user.id, { isVerified: !user.isVerified });
      showNotification(
        "success",
        `User ${user.isVerified ? "unverified" : "verified"}!`
      );
      await loadUsers();
    } catch (error) {
      showNotification("error", "Failed to update verification");
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (
      window.confirm(`Are you sure you want to delete user "${user.name}"?`)
    ) {
      try {
        await usersService.deleteUser(user.id);
        showNotification("success", "User deleted successfully!");
        await loadUsers();
      } catch (error) {
        showNotification("error", "Failed to delete user");
      }
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "student":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "entrepreneur":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "professional":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "alumni":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "student":
        return GraduationCap;
      case "entrepreneur":
        return TrendingUp;
      case "professional":
        return Briefcase;
      case "alumni":
        return Award;
      default:
        return User;
    }
  };

  // Fixed UserCard Component - replace the existing UserCard component

  const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => {
    const TypeIcon = getUserTypeIcon(user.userType);

    // Safe string capitalization helper
    const safeCapitalize = (str: string | undefined) => {
      if (!str || typeof str !== "string") return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-16 h-16 object-cover rounded-full border-2 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">
                  {user.name || "Unknown User"}
                </h3>
                {user.isVerified && (
                  <div title="Verified">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">
                {user.email || "No email"}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getUserTypeColor(
                    user.userType
                  )}`}
                >
                  <TypeIcon className="w-3 h-3" />
                  {safeCapitalize(user.userType)}
                </span>
                <span
                  className={`inline-block px-2 py-1 rounded-full border text-xs ${getStatusColor(
                    user.status
                  )}`}
                >
                  {safeCapitalize(user.status)}
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative group">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-8 bg-black/90 border border-white/20 rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-32">
                <button
                  onClick={() => openViewModal(user)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleVerificationToggle(user)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                >
                  {user.isVerified ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {user.isVerified ? "Unverify" : "Verify"}
                </button>
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Institution/Company */}
          <div className="space-y-2 mb-4">
            {user.institution && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>{user.institution}</span>
                {user.course && <span>• {user.course}</span>}
                {user.year && <span>• Year {user.year}</span>}
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{user.company}</span>
                {user.position && <span>• {user.position}</span>}
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {user.skills.length > 4 && (
                  <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
                    +{user.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Activity Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-white">
                {user.eventsAttended || 0}
              </p>
              <p className="text-xs text-gray-400">Events</p>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user.blogsRead || 0}
              </p>
              <p className="text-xs text-gray-400">Blogs Read</p>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user.profileCompletion || 0}%
              </p>
              <p className="text-xs text-gray-400">Profile</p>
            </div>
          </div>

          {/* Status Change */}
          <div className="mt-4">
            <select
              value={user.status || "pending"}
              onChange={(e) =>
                handleStatusChange(
                  user,
                  e.target.value as UserProfile["status"]
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-red-500/20 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400">
            Manage all registered users and their profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors">
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4"
      >
        {[
          {
            title: "Total Users",
            value: stats.total,
            color: "from-purple-500 to-purple-600",
            icon: Users,
          },
          {
            title: "Students",
            value: stats.students,
            color: "from-blue-500 to-blue-600",
            icon: GraduationCap,
          },
          {
            title: "Entrepreneurs",
            value: stats.entrepreneurs,
            color: "from-green-500 to-green-600",
            icon: TrendingUp,
          },
          {
            title: "Professionals",
            value: stats.professionals,
            color: "from-orange-500 to-orange-600",
            icon: Briefcase,
          },
          {
            title: "Alumni",
            value: stats.alumni,
            color: "from-yellow-500 to-yellow-600",
            icon: Award,
          },
          {
            title: "Active",
            value: stats.active,
            color: "from-emerald-500 to-emerald-600",
            icon: CheckCircle,
          },
          {
            title: "Verified",
            value: stats.verified,
            color: "from-cyan-500 to-cyan-600",
            icon: Shield,
          },
          {
            title: "New This Month",
            value: stats.newThisMonth,
            color: "from-pink-500 to-pink-600",
            icon: Clock,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
          >
            <div
              className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, institution, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Types</option>
            <option value="student">Students</option>
            <option value="entrepreneur">Entrepreneurs</option>
            <option value="professional">Professionals</option>
            <option value="alumni">Alumni</option>
            <option value="other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <UserCard user={user} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </motion.div>

      {/* User Details Modal */}
      <AnimatePresence>
        {modalMode === "view" && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-12 h-12 object-cover rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.isVerified && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </h2>
                    <p className="text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
                {/* Status & Type */}
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getUserTypeColor(
                      selectedUser.userType
                    )}`}
                  >
                    {React.createElement(
                      getUserTypeIcon(selectedUser.userType),
                      { className: "w-4 h-4" }
                    )}
                    {selectedUser.userType.charAt(0).toUpperCase() +
                      selectedUser.userType.slice(1)}
                  </span>
                  <span
                    className={`inline-block px-4 py-2 rounded-full border ${getStatusColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status.charAt(0).toUpperCase() +
                      selectedUser.status.slice(1)}
                  </span>
                  {selectedUser.isVerified && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                      <Shield className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Bio */}
                {selectedUser.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      About
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{selectedUser.email}</p>
                        </div>
                      </div>

                      {selectedUser.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Phone</p>
                            <p className="text-white">{selectedUser.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white">{selectedUser.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Joined</p>
                          <p className="text-white">
                            {new Date(
                              selectedUser.joinedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {selectedUser.lastLogin && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-gray-400 text-sm">Last Login</p>
                            <p className="text-white">
                              {new Date(
                                selectedUser.lastLogin
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {selectedUser.userType === "student"
                        ? "Academic Information"
                        : "Professional Information"}
                    </h3>
                    <div className="space-y-3">
                      {selectedUser.userType === "student" ? (
                        <>
                          {selectedUser.institution && (
                            <div className="flex items-center gap-3">
                              <GraduationCap className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Institution
                                </p>
                                <p className="text-white">
                                  {selectedUser.institution}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.course && (
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">Course</p>
                                <p className="text-white">
                                  {selectedUser.course}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.year && (
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">Year</p>
                                <p className="text-white">
                                  Year {selectedUser.year}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.studentId && (
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Student ID
                                </p>
                                <p className="text-white">
                                  {selectedUser.studentId}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.gpa && (
                            <div className="flex items-center gap-3">
                              <Star className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">GPA</p>
                                <p className="text-white">{selectedUser.gpa}</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {selectedUser.company && (
                            <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">Company</p>
                                <p className="text-white">
                                  {selectedUser.company}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.position && (
                            <div className="flex items-center gap-3">
                              <Briefcase className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Position
                                </p>
                                <p className="text-white">
                                  {selectedUser.position}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedUser.experience && (
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Experience
                                </p>
                                <p className="text-white">
                                  {selectedUser.experience}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedUser.interests &&
                    selectedUser.interests.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Social & Portfolio Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.linkedin && (
                      <a
                        href={selectedUser.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-blue-400" />
                        <span className="text-white">LinkedIn Profile</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}

                    {selectedUser.github && (
                      <a
                        href={selectedUser.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Github className="w-5 h-5 text-gray-400" />
                        <span className="text-white">GitHub Profile</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}

                    {selectedUser.portfolio && (
                      <a
                        href={selectedUser.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Globe className="w-5 h-5 text-green-400" />
                        <span className="text-white">Portfolio Website</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}

                    {selectedUser.twitter && (
                      <a
                        href={selectedUser.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Twitter className="w-5 h-5 text-cyan-400" />
                        <span className="text-white">Twitter Profile</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}

                    {selectedUser.instagram && (
                      <a
                        href={selectedUser.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <span className="text-white">Instagram Profile</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}

                    {selectedUser.facebook && (
                      <a
                        href={selectedUser.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-blue-500" />
                        <span className="text-white">Facebook Profile</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Projects */}
                {selectedUser.projects && selectedUser.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Projects
                    </h3>
                    <div className="space-y-4">
                      {selectedUser.projects.map((project, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium">
                              {project.name}
                            </h4>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedUser.achievements &&
                    selectedUser.achievements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Achievements
                        </h3>
                        <div className="space-y-2">
                          {selectedUser.achievements.map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-gray-300 text-sm">
                                  {achievement}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {selectedUser.certifications &&
                    selectedUser.certifications.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Certifications
                        </h3>
                        <div className="space-y-2">
                          {selectedUser.certifications.map(
                            (certification, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300 text-sm">
                                  {certification}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Activity Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Platform Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedUser.eventsAttended || 0}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Events Attended
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedUser.blogsRead || 0}
                      </div>
                      <div className="text-gray-400 text-sm">Blogs Read</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedUser.profileCompletion || 0}%
                      </div>
                      <div className="text-gray-400 text-sm">
                        Profile Complete
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedUser.createdAt
                          ? Math.floor(
                              (new Date().getTime() -
                                selectedUser.createdAt.toDate().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0}
                      </div>
                      <div className="text-gray-400 text-sm">Days Active</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleVerificationToggle(selectedUser)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedUser.isVerified
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {selectedUser.isVerified ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {selectedUser.isVerified
                      ? "Remove Verification"
                      : "Verify User"}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </button>

                  <button
                    onClick={() => handleDeleteUser(selectedUser)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersComplete;
