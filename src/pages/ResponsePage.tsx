import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  X,
  Save,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  BookOpen,
  Hash,
  User,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import * as XLSX from "xlsx";

interface HiringApplication {
  id: string;
  name: string;
  enrollmentNo: string;
  branch: string;
  year: string;
  contactNo: string;
  email: string;
  domain: string;
  experience: string;
  hasStartup: boolean;
  startupTurnover: string;
  status: string;
  submittedAt: any;
}

const HiringResponses: React.FC = () => {
  const [applications, setApplications] = useState<HiringApplication[]>([]);
  const [filteredData, setFilteredData] = useState<HiringApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<HiringApplication | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const years = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const domains = [
    "All",
    "Public Relation (PR)",
    "Marketing",
    "Social Media Management",
    "Graphics & Video Editing",
    "Web Development",
    "Promotions",
    "Event Management",
  ];
  const statuses = ["All", "pending", "reviewed", "accepted", "rejected"];
  const branches = [
    "Computer Science & Engineering",
    "Computer Science & Engineering (IOT)",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Data Science",
    "Chemical Engineering",
    "Artificial Intelligence & Machine Learning",
    "Fire Tech & Safety Engineering",
    "Computer Science & Engineering (CS)",
  ];

  // Fetch data from Firebase
  const fetchApplications = async () => {
    try {
      setIsLoading(true);

      // Try with orderBy first
      try {
        const q = query(
          collection(db, "hiring-applications"),
          orderBy("submittedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data: HiringApplication[] = [];

        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as HiringApplication);
        });

        setApplications(data);
        setFilteredData(data);
        console.log("Fetched applications:", data.length);
      } catch (orderError) {
        console.warn("OrderBy failed, trying without ordering:", orderError);

        // Fallback: fetch without orderBy
        const querySnapshot = await getDocs(
          collection(db, "hiring-applications")
        );
        const data: HiringApplication[] = [];

        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as HiringApplication);
        });

        // Sort in memory by submittedAt
        data.sort((a, b) => {
          const dateA = a.submittedAt?.toDate?.()?.getTime() || 0;
          const dateB = b.submittedAt?.toDate?.()?.getTime() || 0;
          return dateB - dateA;
        });

        setApplications(data);
        setFilteredData(data);
        console.log("Fetched applications (fallback):", data.length);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);

      // Show detailed error
      if (error instanceof Error) {
        alert(`Error fetching data: ${error.message}`);
      } else {
        alert("Error fetching data. Please check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.branch?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (filterYear && filterYear !== "All") {
      filtered = filtered.filter((app) => app.year === filterYear);
    }

    // Apply domain filter
    if (filterDomain && filterDomain !== "All") {
      filtered = filtered.filter((app) => app.domain === filterDomain);
    }

    // Apply status filter
    if (filterStatus && filterStatus !== "All") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [searchTerm, filterYear, filterDomain, filterStatus, applications]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((app) => ({
      Name: app.name,
      "Enrollment No": app.enrollmentNo || "N/A",
      Year: app.year,
      Branch: app.branch,
      "Contact No": app.contactNo,
      Email: app.email,
      Domain: app.domain,
      Experience: app.experience,
      "Has Startup": app.hasStartup ? "Yes" : "No",
      "Startup Turnover": app.startupTurnover || "N/A",
      Status: app.status,
      "Submitted At": app.submittedAt?.toDate?.()?.toLocaleString() || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hiring Applications");
    XLSX.writeFile(
      wb,
      `E-Cell_Hiring_Applications_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  // Delete application
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteDoc(doc(db, "hiring-applications", id));
        setApplications(applications.filter((app) => app.id !== id));
        alert("Application deleted successfully!");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Error deleting application. Please try again.");
      }
    }
  };

  // Start editing
  const startEdit = (application: HiringApplication) => {
    setEditingId(application.id);
    setEditForm({ ...application });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editForm) return;

    try {
      const { id, ...updateData } = editForm;
      await updateDoc(doc(db, "hiring-applications", id), updateData);

      setApplications(
        applications.map((app) => (app.id === id ? editForm : app))
      );

      setEditingId(null);
      setEditForm(null);
      alert("Application updated successfully!");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Error updating application. Please try again.");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // View details modal
  const ViewModal = ({ application }: { application: HiringApplication }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setViewingId(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Application Details
          </h2>
          <button
            onClick={() => setViewingId(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <p className="text-gray-800 font-medium">{application.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Enrollment No
              </label>
              <p className="text-gray-800">
                {application.enrollmentNo || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Year</label>
              <p className="text-gray-800">{application.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Branch
              </label>
              <p className="text-gray-800">{application.branch}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Domain Applied
              </label>
              <p className="text-gray-800 font-medium">{application.domain}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Contact No
              </label>
              <p className="text-gray-800">{application.contactNo}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{application.email}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                Experience / Skills
              </label>
              <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {application.experience || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Has Startup?
              </label>
              <p className="text-gray-800">
                {application.hasStartup ? "Yes" : "No"}
              </p>
            </div>
            {application.hasStartup && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Startup Turnover
                </label>
                <p className="text-gray-800">
                  {application.startupTurnover || "N/A"}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : application.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : application.status === "reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {application.status}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Submitted At
              </label>
              <p className="text-gray-800">
                {application.submittedAt?.toDate?.()?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                E-Cell Hiring - Applications Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredData.length} Applications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, enrollment, domain, branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Year Filter */}
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year === "All" ? "" : year}>
                      {year === "All" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain Filter */}
              <div className="relative flex-1">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {domains.map((domain) => (
                    <option key={domain} value={domain === "All" ? "" : domain}>
                      {domain === "All" ? "All Domains" : domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status === "All" ? "" : status}>
                      {status === "All"
                        ? "All Statuses"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain & Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-purple-600 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {application.enrollmentNo || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <GraduationCap className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.year || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {application.branch || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <Briefcase className="w-8 h-8 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {application.domain}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {application.email}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            {application.contactNo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {application.experience || "N/A"}
                      </div>
                      {application.hasStartup && (
                        <div className="text-xs text-green-600 mt-1">
                          Has Startup
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : application.status === "reviewed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {application.submittedAt
                            ?.toDate?.()
                            ?.toLocaleDateString() || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingId(application.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(application)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && editForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Application
              </h2>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment No
                </label>
                <input
                  type="text"
                  value={editForm.enrollmentNo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, enrollmentNo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm({ ...editForm, year: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <select
                  value={editForm.branch}
                  onChange={(e) =>
                    setEditForm({ ...editForm, branch: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact No
                </label>
                <input
                  type="tel"
                  value={editForm.contactNo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactNo: e.target.value })
                  }
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <select
                  value={editForm.domain}
                  onChange={(e) =>
                    setEditForm({ ...editForm, domain: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {domains
                    .filter((d) => d !== "All")
                    .map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience / Skills
                </label>
                <textarea
                  value={editForm.experience}
                  onChange={(e) =>
                    setEditForm({ ...editForm, experience: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Has Startup?
                </label>
                <select
                  value={editForm.hasStartup ? "true" : "false"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      hasStartup: e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {editForm.hasStartup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Turnover
                  </label>
                  <input
                    type="text"
                    value={editForm.startupTurnover}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        startupTurnover: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Modal */}
      {viewingId && (
        <ViewModal
          application={applications.find((app) => app.id === viewingId)!}
        />
      )}
    </div>
  );
};

export default HiringResponses;
