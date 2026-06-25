// /src/pages/admin/AdminEventsComplete.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  MoreVertical,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  User,
  Image as ImageIcon,
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

// Types
interface Speaker {
  name: string;
  title: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
}

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  attendees: number;
  maxAttendees: number;
  category: string;
  price?: number;
  image?: string;
  imagePublicId?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: string[];
  speakers?: Speaker[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface EventStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  totalAttendees: number;
}

type ModalMode = "create" | "edit" | "view" | null;

// Browser-compatible Cloudinary service class
class CloudinaryService {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // You need to create this in Cloudinary dashboard

  async uploadFile(
    file: File,
    folder: string = "events"
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
      // Note: For deletion, you'll need to implement a backend endpoint
      // or use Cloudinary's Admin API with proper authentication
      // For now, we'll just log this - implement backend deletion for production
      console.log("Delete image:", publicId);

      // If you have a backend endpoint for deletion:
      // const response = await fetch(`/api/cloudinary/delete`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ publicId })
      // });
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      // Don't throw error for deletion failures to avoid blocking other operations
    }
  }

  // Generate optimized URL with transformations
  generateOptimizedUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    const transformParams = [];

    if (transformations.width)
      transformParams.push(`w_${transformations.width}`);
    if (transformations.height)
      transformParams.push(`h_${transformations.height}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.quality)
      transformParams.push(`q_${transformations.quality}`);
    if (transformations.format)
      transformParams.push(`f_${transformations.format}`);

    const transformString =
      transformParams.length > 0 ? `${transformParams.join(",")}` : "";
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  // Generate thumbnail
  generateThumbnail(publicId: string, size: number = 150): string {
    return this.generateOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: "fill",
      quality: "auto",
      format: "webp",
    });
  }
}

const cloudinaryService = new CloudinaryService();

// Events service class
class EventsService {
  private collection = "events";

  async getAllEvents(): Promise<Event[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Failed to fetch events");
    }
  }

  async createEvent(
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt">,
    imageFile?: File
  ): Promise<void> {
    try {
      let imageUrl = "";
      let imagePublicId = "";

      if (imageFile) {
        const uploadResult = await cloudinaryService.uploadFile(
          imageFile,
          "events"
        );
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      await addDoc(collection(db, this.collection), {
        ...eventData,
        image: imageUrl,
        imagePublicId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event");
    }
  }

  async updateEvent(
    eventId: string,
    eventData: Partial<Event>,
    imageFile?: File
  ): Promise<void> {
    try {
      const updateData: any = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };

      if (imageFile) {
        const uploadResult = await cloudinaryService.uploadFile(
          imageFile,
          "events"
        );
        updateData.image = uploadResult.url;
        updateData.imagePublicId = uploadResult.publicId;
      }

      await updateDoc(doc(db, this.collection, eventId), updateData);
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Failed to update event");
    }
  }

  async deleteEvent(eventId: string, imagePublicId?: string): Promise<void> {
    try {
      if (imagePublicId) {
        await cloudinaryService.deleteFile(imagePublicId);
      }
      await deleteDoc(doc(db, this.collection, eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Failed to delete event");
    }
  }

  async getEventsStats(events: Event[]): Promise<EventStats> {
    const stats = {
      total: events.length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      ongoing: events.filter((e) => e.status === "ongoing").length,
      completed: events.filter((e) => e.status === "completed").length,
      cancelled: events.filter((e) => e.status === "cancelled").length,
      totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
    };
    return stats;
  }
}

const eventsService = new EventsService();

const AdminEventsComplete: React.FC = () => {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    totalAttendees: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Omit<Event, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "upcoming",
    attendees: 0,
    maxAttendees: 100,
    category: "",
    price: 0,
    tags: [],
    requirements: [],
    agenda: [],
    speakers: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Update stats when events change
  useEffect(() => {
    loadStats();
  }, [events]);

  // Load events from Firestore
  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      showNotification("error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const statsData = await eventsService.getEventsStats(events);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showNotification("error", "Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showNotification("error", "Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle array fields (tags, requirements, agenda)
  const handleArrayFieldChange = (
    field: "tags" | "requirements" | "agenda",
    value: string
  ) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  // Handle speakers
  const addSpeaker = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [...(prev.speakers || []), { name: "", title: "", bio: "" }],
    }));
  };

  const updateSpeaker = (
    index: number,
    field: keyof Speaker,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      speakers: (prev.speakers || []).map((speaker, i) =>
        i === index ? { ...speaker, [field]: value } : speaker
      ),
    }));
  };

  const removeSpeaker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      speakers: (prev.speakers || []).filter((_, i) => i !== index),
    }));
  };

  // Modal functions
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      status: "upcoming",
      attendees: 0,
      maxAttendees: 100,
      category: "",
      price: 0,
      tags: [],
      requirements: [],
      agenda: [],
      speakers: [],
    });
    setImageFile(null);
    setImagePreview("");
  };

  const openEditModal = (event: Event) => {
    setModalMode("edit");
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      status: event.status,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
      category: event.category,
      price: event.price || 0,
      tags: event.tags || [],
      requirements: event.requirements || [],
      agenda: event.agenda || [],
      speakers: event.speakers || [],
    });
    setImagePreview(event.image || "");
    setImageFile(null);
  };

  const openViewModal = (event: Event) => {
    setModalMode("view");
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedEvent(null);
    setImageFile(null);
    setImagePreview("");
  };

  // CRUD Operations
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(!!imageFile);

    try {
      if (modalMode === "create") {
        await eventsService.createEvent(formData, imageFile || undefined);
        showNotification("success", "Event created successfully!");
      } else if (modalMode === "edit" && selectedEvent) {
        await eventsService.updateEvent(
          selectedEvent.id!,
          formData,
          imageFile || undefined
        );
        showNotification("success", "Event updated successfully!");
      }

      await loadEvents();
      closeModal();
    } catch (error) {
      showNotification("error", `Failed to ${modalMode} event`);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (event: Event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await eventsService.deleteEvent(event.id!, event.imagePublicId);
        showNotification("success", "Event deleted successfully!");
        await loadEvents();
      } catch (error) {
        showNotification("error", "Failed to delete event");
      }
    }
  };

  const handleStatusChange = async (
    event: Event,
    newStatus: Event["status"]
  ) => {
    try {
      await eventsService.updateEvent(event.id!, { status: newStatus });
      showNotification("success", "Event status updated!");
      await loadEvents();
    } catch (error) {
      showNotification("error", "Failed to update status");
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ongoing":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Event Card Component
  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Event Image */}
      <div className="relative h-48">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
          {event.category}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">
              {event.description}
            </p>
          </div>

          {/* Actions Menu */}
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-8 bg-black/90 border border-white/20 rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-32">
              <button
                onClick={() => openViewModal(event)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => openEditModal(event)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(event)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Event Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users className="w-4 h-4" />
            <span>
              {event.attendees}/{event.maxAttendees} attendees
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Registration</span>
            <span className="text-white font-medium">
              {Math.round((event.attendees / event.maxAttendees) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (event.attendees / event.maxAttendees) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2">
          <select
            value={event.status}
            onChange={(e) =>
              handleStatusChange(event, e.target.value as Event["status"])
            }
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              Events Management
            </h1>
            <p className="text-gray-400">
              Create, manage, and monitor all E-Cell events
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            {
              title: "Total",
              value: stats.total,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Upcoming",
              value: stats.upcoming,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Ongoing",
              value: stats.ongoing,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Completed",
              value: stats.completed,
              color: "from-gray-500 to-gray-600",
            },
            {
              title: "Cancelled",
              value: stats.cancelled,
              color: "from-red-500 to-red-600",
            },
            {
              title: "Attendees",
              value: stats.totalAttendees,
              color: "from-orange-500 to-orange-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <Calendar className="w-5 h-5 text-white" />
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
                placeholder="Search events..."
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
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
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria
              </p>
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
              >
                Create First Event
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
                    {modalMode === "create" && "Create New Event"}
                    {modalMode === "edit" && "Edit Event"}
                    {modalMode === "view" && "Event Details"}
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
                  {modalMode === "view" && selectedEvent ? (
                    /* View Mode */
                    <div className="p-6 space-y-6">
                      {selectedEvent.image && (
                        <img
                          src={selectedEvent.image}
                          alt={selectedEvent.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Basic Information
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-gray-400 text-sm">Title</p>
                              <p className="text-white">
                                {selectedEvent.title}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">
                                Description
                              </p>
                              <p className="text-white">
                                {selectedEvent.description}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Category</p>
                              <p className="text-white">
                                {selectedEvent.category}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                                  selectedEvent.status
                                )}`}
                              >
                                {selectedEvent.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Event Details
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-gray-400 text-sm">
                                Date & Time
                              </p>
                              <p className="text-white">
                                {selectedEvent.date} at {selectedEvent.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Location</p>
                              <p className="text-white">
                                {selectedEvent.location}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Attendees</p>
                              <p className="text-white">
                                {selectedEvent.attendees}/
                                {selectedEvent.maxAttendees}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Price</p>
                              <p className="text-white">
                                {selectedEvent.price
                                  ? `₹${selectedEvent.price}`
                                  : "Free"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEvent.speakers &&
                        selectedEvent.speakers.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">
                              Speakers
                            </h3>
                            <div className="space-y-4">
                              {selectedEvent.speakers.map((speaker, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-white font-medium">
                                      {speaker.name}
                                    </h4>
                                    <p className="text-purple-300 text-sm">
                                      {speaker.title}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                      {speaker.bio}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    /* Create/Edit Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Image
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploading ? "Uploading..." : "Upload Image"}
                          </label>
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Max file size: 5MB. Supported formats: JPG, PNG, WebP
                        </p>
                      </div>

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            placeholder="Enter event title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Competition">Competition</option>
                            <option value="Networking">Networking</option>
                            <option value="Seminar">Seminar</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Enter event description"
                          required
                        />
                      </div>

                      {/* Date, Time, Location */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time *
                          </label>
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
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
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

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
                          placeholder="Enter event location"
                          required
                        />
                      </div>

                      {/* Attendees and Price */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Attendees
                          </label>
                          <input
                            type="number"
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Attendees *
                          </label>
                          <input
                            type="number"
                            name="maxAttendees"
                            value={formData.maxAttendees}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="0 for free"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.requirements?.join(", ") || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("tags", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., entrepreneurship, technology, innovation"
                        />
                      </div>

                      {/* Requirements */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Requirements (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.requirements?.join(", ") || ""}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "requirements",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., laptop required, prior registration needed"
                        />
                      </div>

                      {/* Agenda */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Agenda (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.agenda?.join(", ") || ""}
                          onChange={(e) =>
                            handleArrayFieldChange("agenda", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., Opening keynote, Panel discussion, Networking"
                        />
                      </div>

                      {/* Speakers */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-gray-300">
                            Speakers
                          </label>
                          <button
                            type="button"
                            onClick={addSpeaker}
                            className="flex items-center gap-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Speaker
                          </button>
                        </div>

                        <div className="space-y-4">
                          {formData.speakers?.map((speaker, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white/5 rounded-lg border border-white/10"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-medium">
                                  Speaker {index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeSpeaker(index)}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={speaker.name}
                                  onChange={(e) =>
                                    updateSpeaker(index, "name", e.target.value)
                                  }
                                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                  placeholder="Speaker name"
                                />
                                <input
                                  type="text"
                                  value={speaker.title}
                                  onChange={(e) =>
                                    updateSpeaker(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                  placeholder="Speaker title/designation"
                                />
                              </div>

                              <textarea
                                value={speaker.bio}
                                onChange={(e) =>
                                  updateSpeaker(index, "bio", e.target.value)
                                }
                                rows={2}
                                className="w-full mt-4 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                                placeholder="Speaker bio"
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <input
                                  type="url"
                                  value={speaker.linkedin || ""}
                                  onChange={(e) =>
                                    updateSpeaker(
                                      index,
                                      "linkedin",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                  placeholder="LinkedIn URL (optional)"
                                />
                                <input
                                  type="url"
                                  value={speaker.twitter || ""}
                                  onChange={(e) =>
                                    updateSpeaker(
                                      index,
                                      "twitter",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                  placeholder="Twitter URL (optional)"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
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
                          disabled={isSubmitting || isUploading}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              {isUploading
                                ? "Uploading..."
                                : modalMode === "create"
                                ? "Creating..."
                                : "Updating..."}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {modalMode === "create"
                                ? "Create Event"
                                : "Update Event"}
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
    </div>
  );
};

export default AdminEventsComplete;
