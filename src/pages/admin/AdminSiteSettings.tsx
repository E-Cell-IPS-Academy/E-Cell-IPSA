// /src/pages/admin/AdminSiteSettings.tsx
import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  Globe,
  Loader2,
  Upload,
  Image as ImageIcon,
  Type,
  Megaphone,
  Shield,
  Palette,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ToggleLeft,
  ToggleRight,
  Link,
  ExternalLink,
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

// ── Types ──────────────────────────────────────────────────────────
interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link: string;
  bgColor: string;
}

interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  socialLinks: SocialLinks;
  footerText: string;
  copyrightYear: string;
  maintenanceMode: boolean;
  announcementBar: AnnouncementBar;
  updatedAt?: Timestamp;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "",
  tagline: "",
  logo: "",
  favicon: "",
  socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "" },
  footerText: "",
  copyrightYear: new Date().getFullYear().toString(),
  maintenanceMode: false,
  announcementBar: { enabled: false, text: "", link: "", bgColor: "#7c3aed" },
};

// ── Cloudinary helper ──────────────────────────────────────────────
class CloudinaryUploader {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async upload(file: File, folder = "site"): Promise<string> {
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

// ── Predefined colors for the picker ───────────────────────────────
const COLOR_PRESETS = [
  "#7c3aed", "#8b5cf6", "#6d28d9", "#4f46e5", "#3b82f6",
  "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899",
  "#f97316", "#14b8a6", "#6366f1", "#d946ef", "#84cc16",
];

// ── Component ──────────────────────────────────────────────────────
const AdminSiteSettings: React.FC = () => {
  const [formData, setFormData] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load settings
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "siteContent", "settings"));
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          setFormData({
            ...DEFAULT_SETTINGS,
            ...data,
            socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...(data.socialLinks || {}) },
            announcementBar: { ...DEFAULT_SETTINGS.announcementBar, ...(data.announcementBar || {}) },
          });
        }
      } catch {
        showNotification("error", "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  const handleAnnouncementChange = (key: keyof AnnouncementBar, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      announcementBar: { ...prev.announcementBar, [key]: value },
    }));
  };

  // Image uploads
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showNotification("error", "File must be under 2 MB");
      return;
    }
    const setUploading = field === "logo" ? setUploadingLogo : setUploadingFavicon;
    try {
      setUploading(true);
      const url = await uploader.upload(file, "site");
      setFormData((prev) => ({ ...prev, [field]: url }));
      showNotification("success", `${field === "logo" ? "Logo" : "Favicon"} uploaded!`);
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
      await setDoc(doc(db, "siteContent", "settings"), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      showNotification("success", "Settings saved!");
    } catch {
      showNotification("error", "Failed to save settings");
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
          <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
          <p className="text-gray-400">Configure global site options and branding</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Branding ──────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-purple-400" />
                Branding
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Site Name</label>
                  <input name="siteName" value={formData.siteName} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="E-Cell IPSA" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Tagline</label>
                  <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Empowering Entrepreneurs" />
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 flex items-center justify-center">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                    {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} className="hidden" disabled={uploadingLogo} />
                  </label>
                  {formData.logo && (
                    <input
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      placeholder="or paste URL"
                    />
                  )}
                </div>
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 flex items-center justify-center">
                    {formData.favicon ? (
                      <img src={formData.favicon} alt="Favicon" className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <Globe className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                    {uploadingFavicon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingFavicon ? "Uploading..." : "Upload Favicon"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon")} className="hidden" disabled={uploadingFavicon} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Footer ────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Footer
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Footer Text</label>
                <textarea name="footerText" value={formData.footerText} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="Footer text content..." />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Copyright Year</label>
                <input name="copyrightYear" value={formData.copyrightYear} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 max-w-xs" placeholder="2024" />
              </div>
            </div>
          </motion.div>

          {/* ── Social Links ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-purple-400" />
                Social Links
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {([
                { key: "facebook" as const, icon: Facebook, placeholder: "Facebook URL" },
                { key: "instagram" as const, icon: Instagram, placeholder: "Instagram URL" },
                { key: "linkedin" as const, icon: Linkedin, placeholder: "LinkedIn URL" },
                { key: "twitter" as const, icon: Twitter, placeholder: "Twitter / X URL" },
                { key: "youtube" as const, icon: Youtube, placeholder: "YouTube URL" },
              ]).map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="relative">
                  <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={formData.socialLinks[key]}
                    onChange={(e) => handleSocialChange(key, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Maintenance Mode ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Site Status
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between py-3 px-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <p className="text-white text-sm font-medium">Maintenance Mode</p>
                  <p className="text-gray-500 text-xs">When enabled, visitors see a maintenance page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className={formData.maintenanceMode ? "text-red-400" : "text-gray-500"}
                >
                  {formData.maintenanceMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>
              {formData.maintenanceMode && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  Warning: The website is currently in maintenance mode. Only admins can access the site.
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* ── Announcement Bar ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                Announcement Bar
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Enable toggle */}
              <div className="flex items-center justify-between py-3 px-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <p className="text-white text-sm font-medium">Show Announcement Bar</p>
                  <p className="text-gray-500 text-xs">Display a banner at the top of the site</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAnnouncementChange("enabled", !formData.announcementBar.enabled)}
                  className="text-purple-400"
                >
                  {formData.announcementBar.enabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                </button>
              </div>

              {formData.announcementBar.enabled && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                  {/* Preview */}
                  <div className="rounded-xl overflow-hidden">
                    <div className="py-2.5 px-4 text-center text-white text-sm font-medium" style={{ backgroundColor: formData.announcementBar.bgColor }}>
                      {formData.announcementBar.text || "Announcement text here..."}
                      {formData.announcementBar.link && (
                        <span className="ml-2 underline opacity-80">Learn more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Text</label>
                    <input
                      value={formData.announcementBar.text}
                      onChange={(e) => handleAnnouncementChange("text", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      placeholder="Announcement message..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Link (optional)</label>
                    <div className="relative">
                      <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={formData.announcementBar.link}
                        onChange={(e) => handleAnnouncementChange("link", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Background Color</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Color presets */}
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleAnnouncementChange("bgColor", color)}
                          className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                            formData.announcementBar.bgColor === color ? "border-white scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {/* Custom color input */}
                      <div className="flex items-center gap-2 ml-2">
                        <Palette className="w-4 h-4 text-gray-400" />
                        <input
                          type="color"
                          value={formData.announcementBar.bgColor}
                          onChange={(e) => handleAnnouncementChange("bgColor", e.target.value)}
                          className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                        />
                        <input
                          value={formData.announcementBar.bgColor}
                          onChange={(e) => handleAnnouncementChange("bgColor", e.target.value)}
                          className="w-24 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                          placeholder="#7c3aed"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ── Save ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Settings</>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
