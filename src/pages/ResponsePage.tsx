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
  MapPin,
  Calendar,
  ArrowLeft,
  BookOpen,
  Hash,
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

interface IgniteXRegistration {
  id: string;
  studentName: string;
  year: string;
  branch: string;
  enrollmentNumber: string;
  phoneNumber: string;
  email: string;
  campus: string;
  registrationDate: any;
  status: string;
}

const IgniteXResponses: React.FC = () => {
  const [registrations, setRegistrations] = useState<IgniteXRegistration[]>([]);
  const [filteredData, setFilteredData] = useState<IgniteXRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<IgniteXRegistration | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const years = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const campuses = ["All", "Vijaynagar Campus", "Rajendra Nagar Campus"];

  // Fetch data from Firebase
  // Improved fetchRegistrations function
  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);

      // Try with orderBy first
      try {
        const q = query(
          collection(db, "ignitex-registrations"),
          orderBy("registrationDate", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data: IgniteXRegistration[] = [];

        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as IgniteXRegistration);
        });

        setRegistrations(data);
        setFilteredData(data);
        console.log("Fetched registrations:", data.length);
      } catch (orderError) {
        console.warn("OrderBy failed, trying without ordering:", orderError);

        // Fallback: fetch without orderBy
        const querySnapshot = await getDocs(
          collection(db, "ignitex-registrations")
        );
        const data: IgniteXRegistration[] = [];

        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          } as IgniteXRegistration);
        });

        // Sort in memory by registrationDate
        data.sort((a, b) => {
          const dateA = a.registrationDate?.toDate?.()?.getTime() || 0;
          const dateB = b.registrationDate?.toDate?.()?.getTime() || 0;
          return dateB - dateA;
        });

        setRegistrations(data);
        setFilteredData(data);
        console.log("Fetched registrations (fallback):", data.length);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);

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
    fetchRegistrations();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = registrations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.enrollmentNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          reg.branch.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply year filter
    if (filterYear && filterYear !== "All") {
      filtered = filtered.filter((reg) => reg.year === filterYear);
    }

    // Apply campus filter
    if (filterCampus && filterCampus !== "All") {
      filtered = filtered.filter((reg) => reg.campus === filterCampus);
    }

    setFilteredData(filtered);
  }, [searchTerm, filterYear, filterCampus, registrations]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((reg) => ({
      "Student Name": reg.studentName,
      Year: reg.year,
      Branch: reg.branch,
      "Enrollment Number": reg.enrollmentNumber,
      "Phone Number": reg.phoneNumber,
      Email: reg.email,
      Campus: reg.campus,
      Status: reg.status,
      "Registration Date":
        reg.registrationDate?.toDate?.()?.toLocaleString() || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IgniteX Registrations");
    XLSX.writeFile(
      wb,
      `IgniteX_2.0_Registrations_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Delete registration
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await deleteDoc(doc(db, "ignitex-registrations", id));
        setRegistrations(registrations.filter((reg) => reg.id !== id));
        alert("Registration deleted successfully!");
      } catch (error) {
        console.error("Error deleting registration:", error);
        alert("Error deleting registration. Please try again.");
      }
    }
  };

  // Start editing
  const startEdit = (registration: IgniteXRegistration) => {
    setEditingId(registration.id);
    setEditForm({ ...registration });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editForm) return;

    try {
      const { id, ...updateData } = editForm;
      await updateDoc(doc(db, "ignitex-registrations", id), updateData);

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
  const ViewModal = ({
    registration,
  }: {
    registration: IgniteXRegistration;
  }) => (
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
                Student Name
              </label>
              <p className="text-gray-800 font-medium">
                {registration.studentName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Year</label>
              <p className="text-gray-800">{registration.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Branch
              </label>
              <p className="text-gray-800">{registration.branch}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Enrollment Number
              </label>
              <p className="text-gray-800">{registration.enrollmentNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{registration.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-800">{registration.phoneNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Campus
              </label>
              <p className="text-gray-800">{registration.campus}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <p className="text-gray-800">{registration.status}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Registration Date
            </label>
            <p className="text-gray-800">
              {registration.registrationDate?.toDate?.()?.toLocaleString() ||
                "N/A"}
            </p>
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
                IgniteX 2.0 - Admin Dashboard
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
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, enrollment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Year Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white w-full sm:w-auto"
                >
                  {years.map((year) => (
                    <option key={year} value={year === "All" ? "" : year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filterCampus}
                  onChange={(e) => setFilterCampus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white w-full sm:w-auto"
                >
                  {campuses.map((campus) => (
                    <option key={campus} value={campus === "All" ? "" : campus}>
                      {campus}
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
                    Student Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
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
                        <Users className="w-8 h-8 text-purple-600 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.studentName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {registration.enrollmentNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <GraduationCap className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.year}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {registration.branch}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <Mail className="w-8 h-8 text-green-600 mr-3 flex-shrink-0 mt-1" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate">
                            {registration.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            {registration.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {registration.campus.replace(" Campus", "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {registration.registrationDate
                            ?.toDate?.()
                            ?.toLocaleDateString() || "N/A"}
                        </span>
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
                  Student Name
                </label>
                <input
                  type="text"
                  value={editForm.studentName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, studentName: e.target.value })
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
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={(e) =>
                    setEditForm({ ...editForm, branch: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  value={editForm.enrollmentNumber}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      enrollmentNumber: e.target.value,
                    })
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
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  value={editForm.campus}
                  onChange={(e) =>
                    setEditForm({ ...editForm, campus: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Vijaynagar Campus">Vijaynagar Campus</option>
                  <option value="Rajendra Nagar Campus">
                    Rajendra Nagar Campus
                  </option>
                </select>
              </div>

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
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="cancelled">Cancelled</option>
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

export default IgniteXResponses;
