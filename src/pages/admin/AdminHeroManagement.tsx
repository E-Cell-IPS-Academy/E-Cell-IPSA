// /src/pages/admin/AdminHeroManagement.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Monitor,
  Type,
  Link,
  Video,
  Image as ImageIcon,
  Palette,
  Eye,
  Loader2,
  Upload,
} from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// ── Types ──────────────────────────────────────────────────────────
interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
  backgroundType: "video" | "image" | "gradient";
  backgroundUrl: string;
  updatedAt?: Timestamp;
}

const DEFAULT_HERO: HeroData = {
  title: "",
  subtitle: "",
  description: "",
  ctaText: "",
  ctaLink: "",
  videoUrl: "",
  backgroundType: "gradient",
  backgroundUrl: "",
};

// ── Cloudinary helper ──────────────────────────────────────────────
class CloudinaryUploader {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async upload(file: File, folder = "hero"): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", this.uploadPreset);
    fd.append("folder", folder);
    fd.append("resource_type", "auto");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  }
}

const uploader = new CloudinaryUploader();

// ── Component ──────────────────────────────────────────────────────
const AdminHeroManagement: React.FC = () => {
  const [formData, setFormData] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load hero data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "siteContent", "hero"));
        if (snap.exists()) {
          const data = snap.data() as HeroData;
          setFormData({ ...DEFAULT_HERO, ...data });
        }
      } catch {
        showNotification("error", "Failed to load hero data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBgUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showNotification("error", "File must be under 10 MB");
      return;
    }
    try {
      setUploading(true);
      const url = await uploader.upload(file, "hero");
      setFormData((prev) => ({ ...prev, backgroundUrl: url }));
      showNotification("success", "Background uploaded!");
    } catch {
      showNotification("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "siteContent", "hero"), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      showNotification("success", "Hero section saved!");
    } catch {
      showNotification("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Gradient preview helper ──────────────────────────────────────
  const previewBg = (): React.CSSProperties => {
    if (formData.backgroundType === "image" && formData.backgroundUrl) {
      return {
        backgroundImage: `url(${formData.backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {
      background:
        "linear-gradient(135deg, #1e1b4b 0%, #0f0f23 50%, #1a0533 100%)",
    };
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
            <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
            <p className="text-gray-400">
              Manage the landing page hero content
            </p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </motion.div>

        {/* Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl border border-white/10 overflow-hidden"
                style={previewBg()}
              >
                <div className="bg-black/50 backdrop-blur-sm p-12 text-center space-y-4">
                  {formData.videoUrl && formData.backgroundType === "video" && (
                    <div className="mb-4 flex justify-center">
                      <Monitor className="w-8 h-8 text-purple-400" />
                      <span className="text-purple-400 text-sm ml-2">
                        Video background active
                      </span>
                    </div>
                  )}
                  <h2 className="text-4xl font-bold text-white">
                    {formData.title || "Hero Title"}
                  </h2>
                  <h3 className="text-2xl text-purple-300">
                    {formData.subtitle || "Subtitle"}
                  </h3>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    {formData.description || "Description text goes here..."}
                  </p>
                  {formData.ctaText && (
                    <button className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium">
                      {formData.ctaText}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-400" />
              Content
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Main heading"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Supporting text"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Hero description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  CTA Button Text
                </label>
                <input
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Get Started"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  CTA Link
                </label>
                <div className="relative">
                  <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="ctaLink"
                    value={formData.ctaLink}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="/events or https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background section */}
          <div className="p-6 border-t border-white/10 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Background
            </h2>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Background Type
              </label>
              <div className="flex gap-2">
                {(["gradient", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, backgroundType: t }))
                    }
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      formData.backgroundType === t
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {t === "gradient" && <Palette className="w-4 h-4" />}
                    {t === "image" && <ImageIcon className="w-4 h-4" />}
                    {t === "video" && <Video className="w-4 h-4" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {formData.backgroundType === "video" && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Video URL
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="https://... (mp4 URL)"
                  />
                </div>
              </div>
            )}

            {(formData.backgroundType === "image" ||
              formData.backgroundType === "video") && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  {formData.backgroundType === "image"
                    ? "Background Image"
                    : "Fallback Image"}
                </label>
                <div className="flex items-start gap-4">
                  {formData.backgroundUrl && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img
                        src={formData.backgroundUrl}
                        alt="Background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploading ? "Uploading..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBgUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500">Or paste URL below</p>
                    <input
                      name="backgroundUrl"
                      value={formData.backgroundUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="p-6 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Hero
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AdminHeroManagement;
