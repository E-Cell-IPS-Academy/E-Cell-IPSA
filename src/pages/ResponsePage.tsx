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
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
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

interface Registration {
  id: string;
  startupName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  cityCollege: string;
  teamSize: string;
  teamMembers: string;
  category: string;
  customCategory: string;
  description: string;
  previousCompetition: string;
  wantGuidance: string;
  registrationDate: any;
  status: string;
}

const Response: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredData, setFilteredData] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Registration | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const categories = [
    "All",
    "Fintech",
    "EdTech",
    "HealthTech",
    "AgriTech",
    "Social Impact",
    "SaaS / Tech",
    "Others",
  ];

  // Fetch data from Firebase
  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "startup-registrations"),
        orderBy("registrationDate", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data: Registration[] = [];

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        } as Registration);
      });

      setRegistrations(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      alert("Error fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = registrations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.leaderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.cityCollege.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory && filterCategory !== "All") {
      filtered = filtered.filter((reg) => reg.category === filterCategory);
    }

    setFilteredData(filtered);
  }, [searchTerm, filterCategory, registrations]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((reg) => ({
      "Startup Name": reg.startupName,
      "Leader Name": reg.leaderName,
      "Leader Email": reg.leaderEmail,
      "Leader Phone": reg.leaderPhone,
      "City & College": reg.cityCollege,
      "Team Size": reg.teamSize,
      "Team Members": reg.teamMembers,
      Category: reg.category === "Others" ? reg.customCategory : reg.category,
      Description: reg.description,
      "Previous Competition": reg.previousCompetition,
      "Want Guidance": reg.wantGuidance,
      Status: reg.status,
      "Registration Date":
        reg.registrationDate?.toDate?.()?.toLocaleString() || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(
      wb,
      `VyapaarX_Registrations_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Delete registration
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await deleteDoc(doc(db, "startup-registrations", id));
        setRegistrations(registrations.filter((reg) => reg.id !== id));
        alert("Registration deleted successfully!");
      } catch (error) {
        console.error("Error deleting registration:", error);
        alert("Error deleting registration. Please try again.");
      }
    }
  };

  // Start editing
  const startEdit = (registration: Registration) => {
    setEditingId(registration.id);
    setEditForm({ ...registration });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editForm) return;

    try {
      const { id, ...updateData } = editForm;
      await updateDoc(doc(db, "startup-registrations", id), updateData);

      setRegistrations(
        registrations.map((reg) => (reg.id === id ? editForm : reg))
      );

      setEditingId(null);
      setEditForm(null);
      alert("Registration updated successfully!");
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Error updating registration. Please try again.");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  // View details modal
  const ViewModal = ({ registration }: { registration: Registration }) => (
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
            Registration Details
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
                Startup Name
              </label>
              <p className="text-gray-800 font-medium">
                {registration.startupName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Leader Name
              </label>
              <p className="text-gray-800">{registration.leaderName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{registration.leaderEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-800">{registration.leaderPhone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                City & College
              </label>
              <p className="text-gray-800">{registration.cityCollege}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Team Size
              </label>
              <p className="text-gray-800">{registration.teamSize}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Category
              </label>
              <p className="text-gray-800">
                {registration.category === "Others"
                  ? registration.customCategory
                  : registration.category}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Previous Competition
              </label>
              <p className="text-gray-800">
                {registration.previousCompetition}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Team Members
            </label>
            <p className="text-gray-800 whitespace-pre-line">
              {registration.teamMembers}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <p className="text-gray-800">{registration.description}</p>
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
          <p className="text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredData.length} Registrations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === "All" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startup Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leader Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.startupName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.category === "Others"
                              ? registration.customCategory
                              : registration.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.leaderName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {registration.leaderEmail}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {registration.leaderPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Team Size: {registration.teamSize}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.cityCollege}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {registration.category === "Others"
                          ? registration.customCategory
                          : registration.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {registration.registrationDate
                          ?.toDate?.()
                          ?.toLocaleDateString() || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingId(registration.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(registration)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(registration.id)}
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
              <p className="text-gray-500">No registrations found</p>
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
                Edit Registration
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
                  Startup Name
                </label>
                <input
                  type="text"
                  value={editForm.startupName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startupName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leader Name
                </label>
                <input
                  type="text"
                  value={editForm.leaderName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, leaderName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.leaderEmail}
                  onChange={(e) =>
                    setEditForm({ ...editForm, leaderEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.leaderPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, leaderPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City & College
                </label>
                <input
                  type="text"
                  value={editForm.cityCollege}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cityCollege: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <select
                  value={editForm.teamSize}
                  onChange={(e) =>
                    setEditForm({ ...editForm, teamSize: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <textarea
                  value={editForm.teamMembers}
                  onChange={(e) =>
                    setEditForm({ ...editForm, teamMembers: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Fintech">Fintech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="SaaS / Tech">SaaS / Tech</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {editForm.category === "Others" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Category
                  </label>
                  <input
                    type="text"
                    value={editForm.customCategory}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        customCategory: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Competition
                </label>
                <select
                  value={editForm.previousCompetition}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      previousCompetition: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Want Guidance
                </label>
                <select
                  value={editForm.wantGuidance}
                  onChange={(e) =>
                    setEditForm({ ...editForm, wantGuidance: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
          registration={registrations.find((r) => r.id === viewingId)!}
        />
      )}
    </div>
  );
};

export default Response;
