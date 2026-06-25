// /src/pages/admin/AdminAboutManagement.tsx
import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2,
  Target,
  Eye,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Milestone,
  Type,
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

// ── Types ──────────────────────────────────────────────────────────
interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  aboutImage: string;
  visionImage: string;
  milestones: MilestoneItem[];
  stats: StatItem[];
  updatedAt?: Timestamp;
}

const DEFAULT_ABOUT: AboutData = {
  title: "",
  description: "",
  mission: "",
  vision: "",
  aboutImage: "",
  visionImage: "",
  milestones: [],
  stats: [],
};

// ── Cloudinary helper ──────────────────────────────────────────────
class CloudinaryUploader {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async upload(file: File, folder = "about"): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", this.uploadPreset);
    fd.append("folder", folder);
    fd.append("resource_type", "auto");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  }
}

const uploader = new CloudinaryUploader();

// ── Component ──────────────────────────────────────────────────────
const AdminAboutManagement: React.FC = () => {
  const [formData, setFormData] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [uploadingVision, setUploadingVision] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "siteContent", "about"));
        if (snap.exists()) {
          setFormData({ ...DEFAULT_ABOUT, ...snap.data() as AboutData });
        }
      } catch {
        showNotification("error", "Failed to load about data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Image uploads
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: "aboutImage" | "visionImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image must be under 5 MB");
      return;
    }
    const setUploading = field === "aboutImage" ? setUploadingAbout : setUploadingVision;
    try {
      setUploading(true);
      const url = await uploader.upload(file, "about");
      setFormData((prev) => ({ ...prev, [field]: url }));
      showNotification("success", "Image uploaded!");
    } catch {
      showNotification("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Milestones ───────────────────────────────────────────────────
  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { year: "", title: "", description: "" }],
    }));
  };

  const updateMilestone = (idx: number, field: keyof MilestoneItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    }));
  };

  const removeMilestone = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx),
    }));
  };

  const moveMilestone = (idx: number, dir: "up" | "down") => {
    const arr = [...formData.milestones];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    setFormData((prev) => ({ ...prev, milestones: arr }));
  };

  // ── Stats ────────────────────────────────────────────────────────
  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "", icon: "" }],
    }));
  };

  const updateStat = (idx: number, field: keyof StatItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
  };

  const removeStat = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "siteContent", "about"), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      showNotification("success", "About page saved!");
    } catch {
      showNotification("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-md ${
                notification.type === "success"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-red-500/20 border-red-500/30 text-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">About Page</h1>
          <p className="text-gray-400">Manage the About page content, milestones, and stats</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Core Content ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-400" />
                Core Content
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Page Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="About Us" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="About page description..." />
              </div>

              {/* About image */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">About Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    {formData.aboutImage ? (
                      <img src={formData.aboutImage} alt="About" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-600" /></div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                    {uploadingAbout ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingAbout ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "aboutImage")} className="hidden" disabled={uploadingAbout} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Mission & Vision ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Mission & Vision
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Mission</label>
                <textarea name="mission" value={formData.mission} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="Our mission..." />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Vision</label>
                <textarea name="vision" value={formData.vision} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="Our vision..." />
              </div>

              {/* Vision image */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Vision Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    {formData.visionImage ? (
                      <img src={formData.visionImage} alt="Vision" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center"><Eye className="w-6 h-6 text-gray-600" /></div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                    {uploadingVision ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingVision ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "visionImage")} className="hidden" disabled={uploadingVision} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Milestones ────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Milestone className="w-5 h-5 text-purple-400" />
                Milestones ({formData.milestones.length})
              </h2>
              <button type="button" onClick={addMilestone} className="flex items-center gap-1 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formData.milestones.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No milestones added yet</p>
              ) : (
                formData.milestones.map((ms, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-400 font-medium">Milestone {idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveMilestone(idx, "up")} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                        <button type="button" onClick={() => moveMilestone(idx, "down")} disabled={idx === formData.milestones.length - 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                        <button type="button" onClick={() => removeMilestone(idx)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input value={ms.year} onChange={(e) => updateMilestone(idx, "year", e.target.value)} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Year" />
                      <input value={ms.title} onChange={(e) => updateMilestone(idx, "title", e.target.value)} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 md:col-span-3" placeholder="Title" />
                    </div>
                    <textarea value={ms.description} onChange={(e) => updateMilestone(idx, "description", e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="Description..." />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* ── Stats ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Stats ({formData.stats.length})
              </h2>
              <button type="button" onClick={addStat} className="flex items-center gap-1 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formData.stats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No stats added yet</p>
              ) : (
                formData.stats.map((st, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-purple-400 font-medium">Stat {idx + 1}</span>
                      <button type="button" onClick={() => removeStat(idx)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input value={st.label} onChange={(e) => updateStat(idx, "label", e.target.value)} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Label (e.g. Events)" />
                      <input value={st.value} onChange={(e) => updateStat(idx, "value", e.target.value)} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Value (e.g. 50+)" />
                      <input value={st.icon} onChange={(e) => updateStat(idx, "icon", e.target.value)} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Icon name (e.g. trophy)" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* ── Submit ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save About Page</>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AdminAboutManagement;
