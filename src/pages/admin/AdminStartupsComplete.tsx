// /src/pages/admin/AdminStartupsComplete.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Building2,
  Star,
  Users,
  Calendar,
  ExternalLink,
  Globe,
  DollarSign,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";

// Firebase imports
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// Browser-compatible Cloudinary service
class CloudinaryService {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async uploadFile(
    file: File,
    folder: string = "startups"
  ): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", folder);
      formData.append("resource_type", "auto");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      console.log("Delete image:", publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  }
}

const cloudinaryService = new CloudinaryService();

// Types
interface Founder {
  name: string;
  position: string;
  bio: string;
  linkedin?: string;
  image?: string;
}

interface Startup {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  logo?: string;
  logoPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  industry: string;
  foundedYear: number;
  location: string;
  website?: string;
  status: "featured" | "upcoming" | "past";
  fundingStage: string;
  fundingAmount?: number;
  employeeCount?: number;
  founders: Founder[];
  achievements: string[];
  problem: string;
  solution: string;
  businessModel: string;
  targetMarket: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  featuredDate?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface StartupStats {
  total: number;
  featured: number;
  upcoming: number;
  past: number;
  totalFunding: number;
}

type ModalMode = "create" | "edit" | "view" | null;

// Startups service
class StartupsService {
  private collection = "startups";

  async getAllStartups(): Promise<Startup[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Startup[];
    } catch (error) {
      console.error("Error fetching startups:", error);
      throw new Error("Failed to fetch startups");
    }
  }

  async createStartup(
    startupData: Omit<Startup, "id" | "createdAt" | "updatedAt">,
    logoFile?: File,
    coverFile?: File
  ): Promise<void> {
    try {
      let logoUrl = "";
      let logoPublicId = "";
      let coverImageUrl = "";
      let coverImagePublicId = "";

      if (logoFile) {
        const logoResult = await cloudinaryService.uploadFile(
          logoFile,
          "startups/logos"
        );
        logoUrl = logoResult.url;
        logoPublicId = logoResult.publicId;
      }

      if (coverFile) {
        const coverResult = await cloudinaryService.uploadFile(
          coverFile,
          "startups/covers"
        );
        coverImageUrl = coverResult.url;
        coverImagePublicId = coverResult.publicId;
      }

      await addDoc(collection(db, this.collection), {
        ...startupData,
        logo: logoUrl,
        logoPublicId,
        coverImage: coverImageUrl,
        coverImagePublicId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating startup:", error);
      throw new Error("Failed to create startup");
    }
  }

  async updateStartup(
    startupId: string,
    startupData: Partial<Startup>,
    logoFile?: File,
    coverFile?: File
  ): Promise<void> {
    try {
      const updateData: any = {
        ...startupData,
        updatedAt: serverTimestamp(),
      };

      if (logoFile) {
        const logoResult = await cloudinaryService.uploadFile(
          logoFile,
          "startups/logos"
        );
        updateData.logo = logoResult.url;
        updateData.logoPublicId = logoResult.publicId;
      }

      if (coverFile) {
        const coverResult = await cloudinaryService.uploadFile(
          coverFile,
          "startups/covers"
        );
        updateData.coverImage = coverResult.url;
        updateData.coverImagePublicId = coverResult.publicId;
      }

      await updateDoc(doc(db, this.collection, startupId), updateData);
    } catch (error) {
      console.error("Error updating startup:", error);
      throw new Error("Failed to update startup");
    }
  }

  async deleteStartup(
    startupId: string,
    logoPublicId?: string,
    coverImagePublicId?: string
  ): Promise<void> {
    try {
      if (logoPublicId) {
        await cloudinaryService.deleteFile(logoPublicId);
      }
      if (coverImagePublicId) {
        await cloudinaryService.deleteFile(coverImagePublicId);
      }
      await deleteDoc(doc(db, this.collection, startupId));
    } catch (error) {
      console.error("Error deleting startup:", error);
      throw new Error("Failed to delete startup");
    }
  }

  async getStartupStats(startups: Startup[]): Promise<StartupStats> {
    const stats = {
      total: startups.length,
      featured: startups.filter((s) => s.status === "featured").length,
      upcoming: startups.filter((s) => s.status === "upcoming").length,
      past: startups.filter((s) => s.status === "past").length,
      totalFunding: startups.reduce(
        (sum, s) => sum + (s.fundingAmount || 0),
        0
      ),
    };
    return stats;
  }
}

const startupsService = new StartupsService();

const AdminStartupsComplete: React.FC = () => {
  // State management
  const [startups, setStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState<StartupStats>({
    total: 0,
    featured: 0,
    upcoming: 0,
    past: 0,
    totalFunding: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Omit<Startup, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    shortDescription: "",
    industry: "",
    foundedYear: new Date().getFullYear(),
    location: "",
    website: "",
    status: "upcoming",
    fundingStage: "Pre-Seed",
    fundingAmount: 0,
    employeeCount: 0,
    founders: [],
    achievements: [],
    problem: "",
    solution: "",
    businessModel: "",
    targetMarket: "",
    socialLinks: {},
    featuredDate: "",
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  // Load startups on component mount
  useEffect(() => {
    loadStartups();
  }, []);

  // Update stats when startups change
  useEffect(() => {
    loadStats();
  }, [startups]);

  const loadStartups = async () => {
    try {
      setLoading(true);
      const startupsData = await startupsService.getAllStartups();
      setStartups(startupsData);
    } catch (error) {
      showNotification("error", "Failed to load startups");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await startupsService.getStartupStats(startups);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // Filter startups
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || startup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    imageType: "logo" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showNotification("error", "Please select a valid image file");
        return;
      }

      if (imageType === "logo") {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setCoverFile(file);
        const reader = new FileReader();
        reader.onload = () => setCoverPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleArrayFieldChange = (field: "achievements", value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSocialLinksChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  // Handle founders
  const addFounder = () => {
    setFormData((prev) => ({
      ...prev,
      founders: [...prev.founders, { name: "", position: "", bio: "" }],
    }));
  };

  const updateFounder = (
    index: number,
    field: keyof Founder,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      founders: prev.founders.map((founder, i) =>
        i === index ? { ...founder, [field]: value } : founder
      ),
    }));
  };

  const removeFounder = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      founders: prev.founders.filter((_, i) => i !== index),
    }));
  };

  // Modal functions
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      industry: "",
      foundedYear: new Date().getFullYear(),
      location: "",
      website: "",
      status: "upcoming",
      fundingStage: "Pre-Seed",
      fundingAmount: 0,
      employeeCount: 0,
      founders: [],
      achievements: [],
      problem: "",
      solution: "",
      businessModel: "",
      targetMarket: "",
      socialLinks: {},
      featuredDate: "",
      isActive: true,
    });
    setLogoFile(null);
    setLogoPreview("");
    setCoverFile(null);
    setCoverPreview("");
  };

  const openEditModal = (startup: Startup) => {
    setModalMode("edit");
    setSelectedStartup(startup);
    setFormData({
      name: startup.name,
      description: startup.description,
      shortDescription: startup.shortDescription,
      industry: startup.industry,
      foundedYear: startup.foundedYear,
      location: startup.location,
      website: startup.website || "",
      status: startup.status,
      fundingStage: startup.fundingStage,
      fundingAmount: startup.fundingAmount || 0,
      employeeCount: startup.employeeCount || 0,
      founders: startup.founders || [],
      achievements: startup.achievements || [],
      problem: startup.problem,
      solution: startup.solution,
      businessModel: startup.businessModel,
      targetMarket: startup.targetMarket,
      socialLinks: startup.socialLinks || {},
      featuredDate: startup.featuredDate || "",
      isActive: startup.isActive,
    });
    setLogoPreview(startup.logo || "");
    setCoverPreview(startup.coverImage || "");
    setLogoFile(null);
    setCoverFile(null);
  };

  const openViewModal = (startup: Startup) => {
    setModalMode("view");
    setSelectedStartup(startup);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedStartup(null);
    setLogoFile(null);
    setLogoPreview("");
    setCoverFile(null);
    setCoverPreview("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        await startupsService.createStartup(
          formData,
          logoFile || undefined,
          coverFile || undefined
        );
        showNotification("success", "Startup created successfully!");
      } else if (modalMode === "edit" && selectedStartup) {
        await startupsService.updateStartup(
          selectedStartup.id!,
          formData,
          logoFile || undefined,
          coverFile || undefined
        );
        showNotification("success", "Startup updated successfully!");
      }

      await loadStartups();
      closeModal();
    } catch (error) {
      showNotification("error", `Failed to ${modalMode} startup`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (startup: Startup) => {
    if (window.confirm(`Are you sure you want to delete "${startup.name}"?`)) {
      try {
        await startupsService.deleteStartup(
          startup.id!,
          startup.logoPublicId,
          startup.coverImagePublicId
        );
        showNotification("success", "Startup deleted successfully!");
        await loadStartups();
      } catch (error) {
        showNotification("error", "Failed to delete startup");
      }
    }
  };

  const handleStatusChange = async (
    startup: Startup,
    newStatus: Startup["status"]
  ) => {
    try {
      await startupsService.updateStartup(startup.id!, { status: newStatus });
      showNotification("success", "Startup status updated!");
      await loadStartups();
    } catch (error) {
      showNotification("error", "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "featured":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "past":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Startup Card Component
  const StartupCard: React.FC<{ startup: Startup }> = ({ startup }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48">
        {startup.coverImage ? (
          <img
            src={startup.coverImage}
            alt={startup.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
            startup.status
          )}`}
        >
          {startup.status === "featured" && (
            <Star className="w-3 h-3 inline mr-1" />
          )}
          {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
        </div>

        {/* Actions Menu */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-8 bg-black/90 border border-white/20 rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-32">
              <button
                onClick={() => openViewModal(startup)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => openEditModal(startup)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(startup)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Startup Details */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {startup.logo ? (
            <img
              src={startup.logo}
              alt={`${startup.name} logo`}
              className="w-16 h-16 object-cover rounded-xl border border-white/20"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {startup.name}
            </h3>
            <p className="text-purple-300 text-sm mb-2">{startup.industry}</p>
            <p className="text-gray-300 text-sm line-clamp-2">
              {startup.shortDescription}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Founded {startup.foundedYear}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{startup.location}</span>
          </div>
          {startup.fundingAmount && startup.fundingAmount > 0 && (
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>${startup.fundingAmount.toLocaleString()}</span>
            </div>
          )}
          {startup.employeeCount && startup.employeeCount > 0 && (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{startup.employeeCount} employees</span>
            </div>
          )}
        </div>

        {/* Founders */}
        {startup.founders && startup.founders.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Founders:</p>
            <div className="flex flex-wrap gap-2">
              {startup.founders.slice(0, 3).map((founder, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                >
                  {founder.name}
                </span>
              ))}
              {startup.founders.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
                  +{startup.founders.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {startup.socialLinks?.linkedin && (
              <a
                href={startup.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Status Change */}
          <select
            value={startup.status}
            onChange={(e) =>
              handleStatusChange(startup, e.target.value as Startup["status"])
            }
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="featured">Featured</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

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
            Startup Management
          </h1>
          <p className="text-gray-400">
            Manage featured startups and startup of the week
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Startup
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          {
            title: "Total",
            value: stats.total,
            color: "from-purple-500 to-purple-600",
            icon: Building2,
          },
          {
            title: "Featured",
            value: stats.featured,
            color: "from-green-500 to-green-600",
            icon: Star,
          },
          {
            title: "Upcoming",
            value: stats.upcoming,
            color: "from-blue-500 to-blue-600",
            icon: TrendingUp,
          },
          {
            title: "Past",
            value: stats.past,
            color: "from-gray-500 to-gray-600",
            icon: Award,
          },
          {
            title: "Total Funding",
            value: `$${stats.totalFunding.toLocaleString()}`,
            color: "from-orange-500 to-orange-600",
            icon: DollarSign,
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
              placeholder="Search startups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="featured">Featured</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </motion.div>

      {/* Startups Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse"
              >
                <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup, index) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <StartupCard startup={startup} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No startups found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
            >
              Add First Startup
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalMode && (
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
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "create" && "Add New Startup"}
                  {modalMode === "edit" && "Edit Startup"}
                  {modalMode === "view" && "Startup Details"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                {modalMode === "view" && selectedStartup ? (
                  /* View Mode */
                  <div className="p-6 space-y-6">
                    {/* Cover Image */}
                    {selectedStartup.coverImage && (
                      <img
                        src={selectedStartup.coverImage}
                        alt={selectedStartup.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}

                    {/* Header Section */}
                    <div className="flex items-start gap-6">
                      {selectedStartup.logo && (
                        <img
                          src={selectedStartup.logo}
                          alt={`${selectedStartup.name} logo`}
                          className="w-24 h-24 object-cover rounded-xl border border-white/20"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {selectedStartup.name}
                        </h3>
                        <p className="text-purple-300 text-lg mb-2">
                          {selectedStartup.industry}
                        </p>
                        <p className="text-gray-300">
                          {selectedStartup.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm">Founded</p>
                            <p className="text-white">
                              {selectedStartup.foundedYear}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Location</p>
                            <p className="text-white">
                              {selectedStartup.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Funding Stage
                            </p>
                            <p className="text-white">
                              {selectedStartup.fundingStage}
                            </p>
                          </div>
                          {selectedStartup.fundingAmount &&
                            selectedStartup.fundingAmount > 0 && (
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Funding Amount
                                </p>
                                <p className="text-white">
                                  $
                                  {selectedStartup.fundingAmount.toLocaleString()}
                                </p>
                              </div>
                            )}
                          {selectedStartup.employeeCount &&
                            selectedStartup.employeeCount > 0 && (
                              <div>
                                <p className="text-gray-400 text-sm">
                                  Team Size
                                </p>
                                <p className="text-white">
                                  {selectedStartup.employeeCount} employees
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Status & Links
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm">Status</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                                selectedStartup.status
                              )}`}
                            >
                              {selectedStartup.status}
                            </span>
                          </div>
                          {selectedStartup.website && (
                            <div>
                              <p className="text-gray-400 text-sm">Website</p>
                              <a
                                href={selectedStartup.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 underline"
                              >
                                {selectedStartup.website}
                              </a>
                            </div>
                          )}
                          {selectedStartup.featuredDate && (
                            <div>
                              <p className="text-gray-400 text-sm">
                                Featured Date
                              </p>
                              <p className="text-white">
                                {selectedStartup.featuredDate}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Description
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedStartup.description}
                      </p>
                    </div>

                    {/* Business Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Problem
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selectedStartup.problem}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Solution
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selectedStartup.solution}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Business Model
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selectedStartup.businessModel}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Target Market
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selectedStartup.targetMarket}
                        </p>
                      </div>
                    </div>

                    {/* Founders */}
                    {selectedStartup.founders &&
                      selectedStartup.founders.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Founders
                          </h4>
                          <div className="space-y-4">
                            {selectedStartup.founders.map((founder, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                              >
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h5 className="text-white font-medium">
                                    {founder.name}
                                  </h5>
                                  <p className="text-purple-300 text-sm">
                                    {founder.position}
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {founder.bio}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Achievements */}
                    {selectedStartup.achievements &&
                      selectedStartup.achievements.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Achievements
                          </h4>
                          <div className="space-y-2">
                            {selectedStartup.achievements.map(
                              (achievement, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Award className="w-4 h-4 text-green-400" />
                                  <span className="text-gray-300 text-sm">
                                    {achievement}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  /* Create/Edit Form */
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Images Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Startup Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "logo")}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Logo
                          </label>
                          {logoPreview && (
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>

                      {/* Cover Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cover Image
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "cover")}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label
                            htmlFor="cover-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Cover
                          </label>
                          {coverPreview && (
                            <img
                              src={coverPreview}
                              alt="Cover Preview"
                              className="w-20 h-12 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Startup Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Enter startup name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Industry *
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          required
                        >
                          <option value="">Select industry</option>
                          <option value="Technology">Technology</option>
                          <option value="FinTech">FinTech</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="SaaS">SaaS</option>
                          <option value="AI/ML">AI/ML</option>
                          <option value="IoT">IoT</option>
                          <option value="Blockchain">Blockchain</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Short Description *
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Brief one-line description"
                        required
                      />
                    </div>

                    {/* Full Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="Detailed description of the startup"
                        required
                      />
                    </div>

                    {/* Location, Founded Year, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="City, Country"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Founded Year *
                        </label>
                        <input
                          type="number"
                          name="foundedYear"
                          value={formData.foundedYear}
                          onChange={handleInputChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="featured">Featured</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                    </div>

                    {/* Website and Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Featured Date
                        </label>
                        <input
                          type="date"
                          name="featuredDate"
                          value={formData.featuredDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Funding Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Funding Stage
                        </label>
                        <select
                          name="fundingStage"
                          value={formData.fundingStage}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="Pre-Seed">Pre-Seed</option>
                          <option value="Seed">Seed</option>
                          <option value="Series A">Series A</option>
                          <option value="Series B">Series B</option>
                          <option value="Series C">Series C</option>
                          <option value="Growth">Growth</option>
                          <option value="IPO">IPO</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Funding Amount ($)
                        </label>
                        <input
                          type="number"
                          name="fundingAmount"
                          value={formData.fundingAmount}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Team Size
                        </label>
                        <input
                          type="number"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Problem Statement *
                        </label>
                        <textarea
                          name="problem"
                          value={formData.problem}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="What problem does this startup solve?"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Solution *
                        </label>
                        <textarea
                          name="solution"
                          value={formData.solution}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="How does this startup solve the problem?"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Business Model *
                        </label>
                        <textarea
                          name="businessModel"
                          value={formData.businessModel}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="How does the startup make money?"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Target Market *
                        </label>
                        <textarea
                          name="targetMarket"
                          value={formData.targetMarket}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Who are the target customers?"
                          required
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Social Media Links
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="url"
                          value={formData.socialLinks.linkedin || ""}
                          onChange={(e) =>
                            handleSocialLinksChange("linkedin", e.target.value)
                          }
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="LinkedIn URL"
                        />
                        <input
                          type="url"
                          value={formData.socialLinks.twitter || ""}
                          onChange={(e) =>
                            handleSocialLinksChange("twitter", e.target.value)
                          }
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Twitter URL"
                        />
                        <input
                          type="url"
                          value={formData.socialLinks.instagram || ""}
                          onChange={(e) =>
                            handleSocialLinksChange("instagram", e.target.value)
                          }
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Instagram URL"
                        />
                        <input
                          type="url"
                          value={formData.socialLinks.facebook || ""}
                          onChange={(e) =>
                            handleSocialLinksChange("facebook", e.target.value)
                          }
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Facebook URL"
                        />
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Achievements (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.achievements.join(", ")}
                        onChange={(e) =>
                          handleArrayFieldChange("achievements", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., Winner of XYZ Award, $1M in funding raised, 10k+ users"
                      />
                    </div>

                    {/* Founders */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-300">
                          Founders
                        </label>
                        <button
                          type="button"
                          onClick={addFounder}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Founder
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.founders.map((founder, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-white font-medium">
                                Founder {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeFounder(index)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={founder.name}
                                onChange={(e) =>
                                  updateFounder(index, "name", e.target.value)
                                }
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                placeholder="Founder name"
                              />
                              <input
                                type="text"
                                value={founder.position}
                                onChange={(e) =>
                                  updateFounder(
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                placeholder="Position/Title"
                              />
                            </div>

                            <textarea
                              value={founder.bio}
                              onChange={(e) =>
                                updateFounder(index, "bio", e.target.value)
                              }
                              rows={2}
                              className="w-full mt-4 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                              placeholder="Founder bio"
                            />

                            <input
                              type="url"
                              value={founder.linkedin || ""}
                              onChange={(e) =>
                                updateFounder(index, "linkedin", e.target.value)
                              }
                              className="w-full mt-4 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="LinkedIn URL (optional)"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-300"
                      >
                        Mark as active startup
                      </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {modalMode === "create"
                              ? "Creating..."
                              : "Updating..."}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {modalMode === "create"
                              ? "Create Startup"
                              : "Update Startup"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStartupsComplete;
