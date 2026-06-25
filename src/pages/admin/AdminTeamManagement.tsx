// /src/pages/admin/AdminTeamManagement.tsx
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
  Edit,
  Trash2,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  Crown,
  FolderOpen,
  LayoutGrid,
  LayoutList,
  Star,
  Mail,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  UserX,
  Image as ImageIcon,
  ArrowUpDown,
  Layers,
  Hash,
  Activity,
  Sparkles,
  Globe,
  Award,
  Briefcase,
  Code,
  Cpu,
  Database,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Music,
  Camera,
  BookOpen,
  FileText,
  Settings,
  Wrench,
  Lightbulb,
  Flag,
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
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// ─── Icon Registry ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Crown, Star, Shield, Award, Briefcase, Code, Cpu, Database,
  Megaphone, Palette, PenTool, Rocket, Target, TrendingUp, Zap, Heart,
  Music, Camera, BookOpen, FileText, Settings, Wrench, Lightbulb, Flag,
  Globe, Activity, Sparkles, Layers,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const DynamicIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => {
  const IconComp = ICON_MAP[name];
  return IconComp ? <IconComp className={className} /> : <Users className={className} />;
};

// ─── Cloudinary Service (inline, same pattern as other admin pages) ───────────
class CloudinaryService {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async uploadFile(
    file: File,
    folder: string = "team"
  ): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", folder);
      formData.append("resource_type", "auto");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      return { url: data.secure_url, publicId: data.public_id };
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: string; // category ID
  isLead: boolean;
  photo: string;
  photoPublicId: string;
  bio: string;
  email: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    twitter?: string;
  };
  order: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface TeamStats {
  totalMembers: number;
  totalCategories: number;
  activeLeads: number;
  activeMembers: number;
  inactiveMembers: number;
}

type MemberModalMode = "create" | "edit" | null;
type CategoryModalMode = "create" | "edit" | null;
type ActiveTab = "members" | "categories";

// ─── Default form states ──────────────────────────────────────────────────────
const defaultMemberForm: Omit<TeamMember, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  position: "",
  category: "",
  isLead: false,
  photo: "",
  photoPublicId: "",
  bio: "",
  email: "",
  socialLinks: { linkedin: "", instagram: "", github: "", twitter: "" },
  order: 0,
  isActive: true,
};

const defaultCategoryForm: Omit<TeamCategory, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  icon: "Users",
  description: "",
  order: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const AdminTeamManagement: React.FC = () => {
  // ── State ─────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<TeamCategory[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    totalCategories: 0,
    activeLeads: 0,
    activeMembers: 0,
    inactiveMembers: 0,
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);

  // Member modal
  const [memberModalMode, setMemberModalMode] = useState<MemberModalMode>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] =
    useState<Omit<TeamMember, "id" | "createdAt" | "updatedAt">>(defaultMemberForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Category modal
  const [categoryModalMode, setCategoryModalMode] = useState<CategoryModalMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory | null>(null);
  const [categoryForm, setCategoryForm] =
    useState<Omit<TeamCategory, "id" | "createdAt" | "updatedAt">>(defaultCategoryForm);

  // Bulk select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "member" | "category";
    id: string;
    name: string;
  } | null>(null);

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ── Effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    computeStats();
  }, [members, categories]);

  // ── Notification helper ───────────────────────────────────────────────
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Data loading ──────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [catSnap, memSnap] = await Promise.all([
        getDocs(query(collection(db, "teamCategories"), orderBy("order", "asc"))),
        getDocs(query(collection(db, "teamMembers"), orderBy("order", "asc"))),
      ]);
      setCategories(
        catSnap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamCategory))
      );
      setMembers(
        memSnap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember))
      );
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const computeStats = () => {
    setStats({
      totalMembers: members.length,
      totalCategories: categories.length,
      activeLeads: members.filter((m) => m.isLead && m.isActive).length,
      activeMembers: members.filter((m) => m.isActive).length,
      inactiveMembers: members.filter((m) => !m.isActive).length,
    });
  };

  // ── Category CRUD ─────────────────────────────────────────────────────
  const openCategoryCreate = () => {
    setCategoryModalMode("create");
    setCategoryForm({ ...defaultCategoryForm, order: categories.length + 1 });
    setSelectedCategory(null);
  };

  const openCategoryEdit = (cat: TeamCategory) => {
    setCategoryModalMode("edit");
    setSelectedCategory(cat);
    setCategoryForm({
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      order: cat.order,
    });
  };

  const closeCategoryModal = () => {
    setCategoryModalMode(null);
    setSelectedCategory(null);
    setCategoryForm(defaultCategoryForm);
  };

  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (categoryModalMode === "create") {
        await addDoc(collection(db, "teamCategories"), {
          ...categoryForm,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showNotification("success", "Category created successfully!");
      } else if (categoryModalMode === "edit" && selectedCategory) {
        await updateDoc(doc(db, "teamCategories", selectedCategory.id), {
          ...categoryForm,
          updatedAt: serverTimestamp(),
        });
        showNotification("success", "Category updated successfully!");
      }
      await loadData();
      closeCategoryModal();
    } catch (err) {
      showNotification("error", "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryDelete = async (cat: TeamCategory) => {
    const linkedMembers = members.filter((m) => m.category === cat.id);
    if (linkedMembers.length > 0) {
      showNotification(
        "error",
        `Cannot delete "${cat.name}" — ${linkedMembers.length} member(s) are assigned to it.`
      );
      return;
    }
    setDeleteConfirm({ type: "category", id: cat.id, name: cat.name });
  };

  const reorderCategory = async (cat: TeamCategory, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const batch = writeBatch(db);
    batch.update(doc(db, "teamCategories", sorted[idx].id), {
      order: sorted[swapIdx].order,
      updatedAt: serverTimestamp(),
    });
    batch.update(doc(db, "teamCategories", sorted[swapIdx].id), {
      order: sorted[idx].order,
      updatedAt: serverTimestamp(),
    });
    try {
      await batch.commit();
      await loadData();
    } catch {
      showNotification("error", "Failed to reorder");
    }
  };

  // ── Member CRUD ───────────────────────────────────────────────────────
  const openMemberCreate = () => {
    setMemberModalMode("create");
    setMemberForm({ ...defaultMemberForm, order: members.length + 1 });
    setSelectedMember(null);
    setImageFile(null);
    setImagePreview("");
  };

  const openMemberEdit = (member: TeamMember) => {
    setMemberModalMode("edit");
    setSelectedMember(member);
    setMemberForm({
      name: member.name,
      position: member.position,
      category: member.category,
      isLead: member.isLead,
      photo: member.photo,
      photoPublicId: member.photoPublicId,
      bio: member.bio,
      email: member.email,
      socialLinks: { ...member.socialLinks },
      order: member.order,
      isActive: member.isActive,
    });
    setImagePreview(member.photo || "");
    setImageFile(null);
  };

  const closeMemberModal = () => {
    setMemberModalMode(null);
    setSelectedMember(null);
    setMemberForm(defaultMemberForm);
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
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
  };

  const handleMemberSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(!!imageFile);

    try {
      let photoUrl = memberForm.photo;
      let photoPublicId = memberForm.photoPublicId;

      if (imageFile) {
        const result = await cloudinaryService.uploadFile(imageFile, "team");
        photoUrl = result.url;
        photoPublicId = result.publicId;
      }

      // If setting as lead, remove lead from others in same category
      if (memberForm.isLead) {
        const existingLeads = members.filter(
          (m) =>
            m.category === memberForm.category &&
            m.isLead &&
            m.id !== selectedMember?.id
        );
        for (const lead of existingLeads) {
          await updateDoc(doc(db, "teamMembers", lead.id), {
            isLead: false,
            updatedAt: serverTimestamp(),
          });
        }
      }

      const payload = {
        ...memberForm,
        photo: photoUrl,
        photoPublicId,
      };

      if (memberModalMode === "create") {
        await addDoc(collection(db, "teamMembers"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showNotification("success", "Team member added successfully!");
      } else if (memberModalMode === "edit" && selectedMember) {
        await updateDoc(doc(db, "teamMembers", selectedMember.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        showNotification("success", "Team member updated successfully!");
      }

      await loadData();
      closeMemberModal();
    } catch (err) {
      showNotification("error", "Failed to save team member");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleMemberDelete = (member: TeamMember) => {
    setDeleteConfirm({ type: "member", id: member.id, name: member.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const colName =
        deleteConfirm.type === "member" ? "teamMembers" : "teamCategories";
      await deleteDoc(doc(db, colName, deleteConfirm.id));
      showNotification(
        "success",
        `${deleteConfirm.type === "member" ? "Member" : "Category"} deleted!`
      );
      await loadData();
    } catch {
      showNotification("error", "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Bulk actions ──────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const bulkSetActive = async (active: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        batch.update(doc(db, "teamMembers", id), {
          isActive: active,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      showNotification(
        "success",
        `${selectedIds.size} member(s) ${active ? "activated" : "deactivated"}`
      );
      setSelectedIds(new Set());
      await loadData();
    } catch {
      showNotification("error", "Bulk action failed");
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ── Helpers ───────────────────────────────────────────────────────────
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon || "Users";

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Notification ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className={`fixed top-4 right-4 z-[100] p-4 rounded-lg border backdrop-blur-md ${
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
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Delete Confirmation Dialog ────────────────────────────────── */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Confirm Delete</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-semibold">
                    "{deleteConfirm.name}"
                  </span>
                  ?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Team Management
            </h1>
            <p className="text-gray-400">
              Manage team categories, members, and their roles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCategoryCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Add Category
            </button>
            <button
              onClick={openMemberCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </motion.div>

        {/* ── Stats Cards ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {[
            {
              title: "Total Members",
              value: stats.totalMembers,
              icon: Users,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Categories",
              value: stats.totalCategories,
              icon: Layers,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Active Leads",
              value: stats.activeLeads,
              icon: Crown,
              color: "from-amber-500 to-orange-600",
            },
            {
              title: "Active",
              value: stats.activeMembers,
              icon: UserCheck,
              color: "from-green-500 to-emerald-600",
            },
            {
              title: "Inactive",
              value: stats.inactiveMembers,
              icon: UserX,
              color: "from-red-500 to-red-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/[0.08] transition-all duration-300"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Tab Switcher ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-1.5"
        >
          {(["members", "categories"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab === "members" ? (
                <Users className="w-4 h-4" />
              ) : (
                <FolderOpen className="w-4 h-4" />
              )}
              {tab === "members" ? "Team Members" : "Categories"}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab
                    ? "bg-purple-500/30 text-purple-300"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {tab === "members" ? members.length : categories.length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* MEMBERS TAB                                                     */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "members" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Filters & Controls */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members by name, role, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "table"
                        ? "bg-purple-500/30 text-purple-300"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-purple-500/30 text-purple-300"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center gap-3 pt-4 border-t border-white/10"
                >
                  <span className="text-sm text-purple-300 font-medium">
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={() => bulkSetActive(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Activate
                  </button>
                  <button
                    onClick={() => bulkSetActive(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Deactivate
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-gray-400 hover:text-white text-sm ml-auto transition-colors"
                  >
                    Clear selection
                  </button>
                </motion.div>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl border border-white/10 p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-1/3" />
                        <div className="h-3 bg-white/10 rounded w-1/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No members found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start by adding your first team member"}
                </p>
                <button
                  onClick={openMemberCreate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  Add First Member
                </button>
              </div>
            ) : viewMode === "table" ? (
              /* ── Table View ────────────────────────────────────────── */
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selectedIds.size === filteredMembers.length &&
                              filteredMembers.length > 0
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-white/30 bg-white/10 accent-purple-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredMembers.map((member, idx) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(member.id)}
                              onChange={() => toggleSelect(member.id)}
                              className="w-4 h-4 rounded border-white/30 bg-white/10 accent-purple-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center ring-2 ring-white/10">
                                  <span className="text-sm font-bold text-white">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-white font-medium text-sm">
                                  {member.name}
                                </p>
                                {member.email && (
                                  <p className="text-gray-500 text-xs">
                                    {member.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">
                            {member.position}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/15 text-purple-300 rounded-full text-xs font-medium">
                              <DynamicIcon
                                name={getCategoryIcon(member.category)}
                                className="w-3 h-3"
                              />
                              {getCategoryName(member.category)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {member.isLead ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                                <Crown className="w-3 h-3" />
                                Lead
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                member.isActive
                                  ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                  : "bg-red-500/20 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-400 text-sm font-mono">
                            {member.order}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openMemberEdit(member)}
                                className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMemberDelete(member)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ── Grid / Card View ──────────────────────────────────── */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/[0.08] hover:border-purple-500/20 transition-all duration-300 group"
                  >
                    {/* Card Header */}
                    <div className="relative h-24 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent">
                      {/* Status dot */}
                      <div
                        className={`absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-black ${
                          member.isActive ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      {member.isLead && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-amber-500/30 backdrop-blur-sm border border-amber-500/30 rounded-full">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-300 text-[10px] font-bold uppercase">
                            Lead
                          </span>
                        </div>
                      )}
                      {/* Actions */}
                      <div className="absolute top-3 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openMemberEdit(member)}
                          className="p-1.5 bg-black/50 backdrop-blur-sm rounded-md text-gray-300 hover:text-white transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMemberDelete(member)}
                          className="p-1.5 bg-black/50 backdrop-blur-sm rounded-md text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center -mt-10">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-900"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ring-4 ring-gray-900">
                          <span className="text-2xl font-bold text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 pt-3 text-center">
                      <h3 className="text-white font-semibold text-lg">
                        {member.name}
                      </h3>
                      <p className="text-purple-300 text-sm">{member.position}</p>
                      <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400 text-xs">
                        <DynamicIcon
                          name={getCategoryIcon(member.category)}
                          className="w-3 h-3"
                        />
                        {getCategoryName(member.category)}
                      </span>

                      {member.bio && (
                        <p className="text-gray-400 text-xs mt-3 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      {(member.socialLinks?.linkedin ||
                        member.socialLinks?.instagram ||
                        member.socialLinks?.github ||
                        member.socialLinks?.twitter) && (
                        <div className="flex justify-center gap-2 mt-3">
                          {member.socialLinks.linkedin && (
                            <a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {member.socialLinks.instagram && (
                            <a
                              href={member.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-pink-400 transition-colors"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {member.socialLinks.github && (
                            <a
                              href={member.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-white transition-colors"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {member.socialLinks.twitter && (
                            <a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-sky-400 transition-colors"
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* CATEGORIES TAB                                                  */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "categories" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl border border-white/10 p-6 animate-pulse"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16">
                <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No categories yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create categories to organize your team members
                </p>
                <button
                  onClick={openCategoryCreate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  Create First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...categories]
                  .sort((a, b) => a.order - b.order)
                  .map((cat, idx) => {
                    const memberCount = members.filter(
                      (m) => m.category === cat.id
                    ).length;
                    const leadCount = members.filter(
                      (m) => m.category === cat.id && m.isLead
                    ).length;

                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/[0.08] hover:border-purple-500/20 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
                            <DynamicIcon
                              name={cat.icon}
                              className="w-6 h-6 text-purple-300"
                            />
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Reorder */}
                            <button
                              onClick={() => reorderCategory(cat, "up")}
                              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                              title="Move up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => reorderCategory(cat, "down")}
                              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                              title="Move down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openCategoryEdit(cat)}
                              className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(cat)}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-white font-semibold text-lg mb-1">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {cat.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <Users className="w-4 h-4" />
                            <span>
                              {memberCount} member{memberCount !== 1 && "s"}
                            </span>
                          </div>
                          {leadCount > 0 && (
                            <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                              <Crown className="w-4 h-4" />
                              <span>{leadCount} lead</span>
                            </div>
                          )}
                          <span className="ml-auto text-gray-600 text-xs font-mono">
                            #{cat.order}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* MEMBER MODAL                                                    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <AnimatePresence>
          {memberModalMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
              onClick={closeMemberModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {memberModalMode === "create"
                      ? "Add Team Member"
                      : "Edit Team Member"}
                  </h2>
                  <button
                    onClick={closeMemberModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                  <form onSubmit={handleMemberSubmit} className="p-6 space-y-6">
                    {/* Photo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Photo
                      </label>
                      <div className="flex items-center gap-4">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-500/30"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="member-photo-upload"
                          />
                          <label
                            htmlFor="member-photo-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition-colors text-sm"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploading ? "Uploading..." : "Upload Photo"}
                          </label>
                          <p className="text-gray-500 text-xs mt-1">
                            Max 5MB. JPG, PNG, WebP
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name & Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={memberForm.name}
                          onChange={(e) =>
                            setMemberForm({ ...memberForm, name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Position / Role *
                        </label>
                        <input
                          type="text"
                          value={memberForm.position}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              position: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="e.g. Technical Head"
                          required
                        />
                      </div>
                    </div>

                    {/* Category & Lead & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={memberForm.category}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Team Lead
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setMemberForm({
                              ...memberForm,
                              isLead: !memberForm.isLead,
                            })
                          }
                          className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            memberForm.isLead
                              ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                              : "bg-white/10 border-white/20 text-gray-400 hover:text-white hover:bg-white/15"
                          }`}
                        >
                          <Crown className="w-4 h-4" />
                          {memberForm.isLead ? "Lead Enabled" : "Not a Lead"}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setMemberForm({
                              ...memberForm,
                              isActive: !memberForm.isActive,
                            })
                          }
                          className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            memberForm.isActive
                              ? "bg-green-500/20 border-green-500/30 text-green-400"
                              : "bg-red-500/20 border-red-500/30 text-red-400"
                          }`}
                        >
                          {memberForm.isActive ? (
                            <>
                              <Eye className="w-4 h-4" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" /> Inactive
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Lead warning */}
                    {memberForm.isLead && memberForm.category && (
                      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-amber-300 text-xs">
                          Only one lead per category. Setting this member as lead will
                          remove lead status from any existing lead in{" "}
                          <strong>{getCategoryName(memberForm.category)}</strong>.
                        </p>
                      </div>
                    )}

                    {/* Email & Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="email"
                            value={memberForm.email}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="member@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Order / Priority
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="number"
                            value={memberForm.order}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                order: parseInt(e.target.value) || 0,
                              })
                            }
                            min={0}
                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={memberForm.bio}
                        onChange={(e) =>
                          setMemberForm({ ...memberForm, bio: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="Short bio about the team member..."
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Social Links
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                          <input
                            type="url"
                            value={memberForm.socialLinks.linkedin || ""}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                socialLinks: {
                                  ...memberForm.socialLinks,
                                  linkedin: e.target.value,
                                },
                              })
                            }
                            className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            placeholder="LinkedIn URL"
                          />
                        </div>
                        <div className="relative">
                          <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                          <input
                            type="url"
                            value={memberForm.socialLinks.instagram || ""}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                socialLinks: {
                                  ...memberForm.socialLinks,
                                  instagram: e.target.value,
                                },
                              })
                            }
                            className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            placeholder="Instagram URL"
                          />
                        </div>
                        <div className="relative">
                          <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input
                            type="url"
                            value={memberForm.socialLinks.github || ""}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                socialLinks: {
                                  ...memberForm.socialLinks,
                                  github: e.target.value,
                                },
                              })
                            }
                            className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            placeholder="GitHub URL"
                          />
                        </div>
                        <div className="relative">
                          <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                          <input
                            type="url"
                            value={memberForm.socialLinks.twitter || ""}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                socialLinks: {
                                  ...memberForm.socialLinks,
                                  twitter: e.target.value,
                                },
                              })
                            }
                            className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            placeholder="Twitter / X URL"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={closeMemberModal}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {isSubmitting
                          ? isUploading
                            ? "Uploading..."
                            : "Saving..."
                          : memberModalMode === "create"
                          ? "Add Member"
                          : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* CATEGORY MODAL                                                  */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <AnimatePresence>
          {categoryModalMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
              onClick={closeCategoryModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-white/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {categoryModalMode === "create"
                      ? "Add Category"
                      : "Edit Category"}
                  </h2>
                  <button
                    onClick={closeCategoryModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleCategorySubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Technical Team"
                      required
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-8 gap-2 p-3 bg-white/5 border border-white/10 rounded-lg max-h-40 overflow-y-auto">
                      {ICON_OPTIONS.map((iconName) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            setCategoryForm({ ...categoryForm, icon: iconName })
                          }
                          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                            categoryForm.icon === iconName
                              ? "bg-purple-500/30 border border-purple-500/50 text-purple-300 ring-1 ring-purple-500/30"
                              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
                          }`}
                          title={iconName}
                        >
                          <DynamicIcon name={iconName} className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Selected: <span className="text-purple-300">{categoryForm.icon}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      placeholder="Brief description of this category..."
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Order
                    </label>
                    <div className="relative">
                      <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        value={categoryForm.order}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                        min={0}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={closeCategoryModal}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting
                        ? "Saving..."
                        : categoryModalMode === "create"
                        ? "Create Category"
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminTeamManagement;
