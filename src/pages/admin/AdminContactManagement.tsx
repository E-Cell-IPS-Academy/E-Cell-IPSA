// /src/pages/admin/AdminContactManagement.tsx
import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Trash2,
  Eye,
  Download,
  Search,
  X,
  MailOpen,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// ── Types ──────────────────────────────────────────────────────────
interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

interface ContactData {
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  formEnabled: boolean;
  socialLinks: SocialLinks;
  updatedAt?: Timestamp;
}

interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
  read: boolean;
}

const DEFAULT_CONTACT: ContactData = {
  email: "",
  phone: "",
  address: "",
  mapEmbedUrl: "",
  formEnabled: true,
  socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "" },
};

type ActiveTab = "settings" | "submissions";

// ── Component ──────────────────────────────────────────────────────
const AdminContactManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("settings");
  const [formData, setFormData] = useState<ContactData>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Submissions state
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subLoading, setSubLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingSub, setViewingSub] = useState<ContactSubmission | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Load data ────────────────────────────────────────────────────
  useEffect(() => {
    loadContactData();
    loadSubmissions();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, "siteContent", "contact"));
      if (snap.exists()) {
        const data = snap.data() as ContactData;
        setFormData({
          ...DEFAULT_CONTACT,
          ...data,
          socialLinks: { ...DEFAULT_CONTACT.socialLinks, ...(data.socialLinks || {}) },
        });
      }
    } catch {
      showNotification("error", "Failed to load contact data");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setSubLoading(true);
      const q = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission)));
    } catch {
      showNotification("error", "Failed to load submissions");
    } finally {
      setSubLoading(false);
    }
  };

  // ── Contact settings handlers ────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  const handleSaveContact = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "siteContent", "contact"), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      showNotification("success", "Contact settings saved!");
    } catch {
      showNotification("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Submissions handlers ─────────────────────────────────────────
  const markAsRead = async (sub: ContactSubmission) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", sub.id!), { read: true });
      setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, read: true } : s)));
      if (viewingSub?.id === sub.id) setViewingSub({ ...sub, read: true });
      showNotification("success", "Marked as read");
    } catch {
      showNotification("error", "Failed to update");
    }
  };

  const deleteSubmission = async (sub: ContactSubmission) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await deleteDoc(doc(db, "contactSubmissions", sub.id!));
      setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
      if (viewingSub?.id === sub.id) setViewingSub(null);
      showNotification("success", "Submission deleted");
    } catch {
      showNotification("error", "Failed to delete");
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Date", "Read"];
    const rows = submissions.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.message.replace(/"/g, '""')}"`,
      s.createdAt ? new Date((s.createdAt as any).seconds * 1000).toLocaleDateString() : "",
      s.read ? "Yes" : "No",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "CSV exported!");
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = submissions.filter((s) => !s.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold text-white mb-2">Contact Management</h1>
          <p className="text-gray-400">Manage contact info and view form submissions</p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === "settings" ? "bg-purple-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" /> Settings
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === "submissions" ? "bg-purple-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Submissions
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{unreadCount}</span>
            )}
          </button>
        </motion.div>

        {/* ── SETTINGS TAB ───────────────────────────────────────── */}
        {activeTab === "settings" && (
          <motion.form onSubmit={handleSaveContact} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Contact Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="contact@ecell.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="+91 ..." />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" placeholder="Full address..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Google Maps Embed URL</label>
                  <input name="mapEmbedUrl" value={formData.mapEmbedUrl} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="https://www.google.com/maps/embed?..." />
                </div>

                {/* Form enabled toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <p className="text-white text-sm font-medium">Contact Form</p>
                    <p className="text-gray-500 text-xs">Enable or disable the public contact form</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, formEnabled: !prev.formEnabled }))}
                    className="text-purple-400"
                  >
                    {formData.formEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
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
            </div>

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-colors"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
              </button>
            </div>
          </motion.form>
        )}

        {/* ── SUBMISSIONS TAB ────────────────────────────────────── */}
        {activeTab === "submissions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Total", value: submissions.length, color: "from-purple-500 to-purple-600" },
                { label: "Unread", value: unreadCount, color: "from-red-500 to-red-600" },
                { label: "Read", value: submissions.length - unreadCount, color: "from-green-500 to-green-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{s.value}</span>
                  </div>
                  <span className="text-gray-300 text-sm">{s.label}</span>
                </div>
              ))}
            </div>

            {/* List */}
            {subLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No submissions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`bg-white/5 border rounded-xl p-5 hover:bg-white/10 transition-colors cursor-pointer ${
                      sub.read ? "border-white/10" : "border-purple-500/30 bg-purple-500/5"
                    }`}
                    onClick={() => {
                      setViewingSub(sub);
                      if (!sub.read) markAsRead(sub);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!sub.read && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
                          <h3 className={`font-semibold truncate ${sub.read ? "text-gray-300" : "text-white"}`}>{sub.name}</h3>
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            {sub.createdAt ? new Date((sub.createdAt as any).seconds * 1000).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{sub.email}</p>
                        <p className="text-sm text-purple-400 font-medium mt-1">{sub.subject}</p>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{sub.message}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {!sub.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead(sub); }}
                            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                            title="Mark as read"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSubmission(sub); }}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Submission Detail Modal ────────────────────────────── */}
        <AnimatePresence>
          {viewingSub && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setViewingSub(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">Submission Detail</h2>
                  <button onClick={() => setViewingSub(null)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
                    <p className="text-white">{viewingSub.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                    <p className="text-purple-400">{viewingSub.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Subject</label>
                    <p className="text-white">{viewingSub.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Message</label>
                    <p className="text-gray-300 whitespace-pre-wrap">{viewingSub.message}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Received</label>
                    <p className="text-gray-400 text-sm">
                      {viewingSub.createdAt ? new Date((viewingSub.createdAt as any).seconds * 1000).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-between">
                  <button
                    onClick={() => deleteSubmission(viewingSub)}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <a
                    href={`mailto:${viewingSub.email}?subject=Re: ${viewingSub.subject}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Reply
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContactManagement;
