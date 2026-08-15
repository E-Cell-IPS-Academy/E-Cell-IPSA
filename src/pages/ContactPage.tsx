import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Loader,
} from "lucide-react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — page h1 "Get In Touch", card headings
// LABEL   → "DM Mono"           — form field labels, "Contact Information", social platform names
// BODY    → "Outfit" 300        — input placeholder text, descriptions, button labels, addresses
function useFonts() {
  useEffect(() => {
    if (document.getElementById("contact-fonts")) return;
    const link = document.createElement("link");
    link.id = "contact-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// Types
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  organization?: string;
  preferredContact: "email" | "phone" | "either";
}

interface ContactInfo {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  coordinates: { lat: number; lng: number };
}

class ContactService {
  private collection = "contact_submissions";
  async submitContact(contactData: ContactForm): Promise<void> {
    try {
      await addDoc(collection(db, this.collection), {
        ...contactData,
        submittedAt: serverTimestamp(),
        status: "new",
        ipAddress: await this.getClientIP(),
      });
    } catch {
      throw new Error("Failed to submit contact form");
    }
  }
  private async getClientIP(): Promise<string> {
    try {
      const r = await fetch("https://api.ipify.org?format=json");
      const d = await r.json();
      return d.ip || "unknown";
    } catch {
      return "unknown";
    }
  }
}

const contactService = new ContactService();

const ContactPage: React.FC = () => {
  useFonts();

  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
    organization: "",
    preferredContact: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const defaultContactInfo: ContactInfo = {
    address: "IPS Academy Campus, Knowledge Village",
    city: "Indore",
    state: "Madhya Pradesh",
    postalCode: "452012",
    country: "India",
    phone: "+91 731 2570631",
    email: "ecell@ipsacademy.org",
    website: "https://ecell.ipsacademy.org",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    socialLinks: {
      linkedin: "https://linkedin.com/company/ecell-ips-academy",
      twitter: "https://twitter.com/ecell_ips",
      instagram: "https://instagram.com/ecell_ips",
      facebook: "https://facebook.com/ecell.ips.academy",
    },
    coordinates: { lat: 22.655899779432467, lng: 75.82072097535772 },
  };

  const [contactInfo, setContactInfo] =
    useState<ContactInfo>(defaultContactInfo);
  const [mapEmbedUrl, setMapEmbedUrl] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.943374193864!2d75.82072097535772!3d22.655899779432467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd9732905ba3%3A0xb086d4368f83ed6e!2sIPS%20Academy%20Gate%20No.%2002!5e0!3m2!1sen!2sin!4v1752119183392!5m2!1sen!2sin"
  );

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "contact"));
        if (snap.exists()) {
          const d = snap.data();
          setContactInfo((prev) => ({
            ...prev,
            ...(d.address && { address: d.address }),
            ...(d.city && { city: d.city }),
            ...(d.state && { state: d.state }),
            ...(d.postalCode && { postalCode: d.postalCode }),
            ...(d.country && { country: d.country }),
            ...(d.phone && { phone: d.phone }),
            ...(d.email && { email: d.email }),
            ...(d.website && { website: d.website }),
            ...(d.hours && { hours: { ...prev.hours, ...d.hours } }),
            ...(d.socialLinks && {
              socialLinks: { ...prev.socialLinks, ...d.socialLinks },
            }),
            ...(d.coordinates && {
              coordinates: { ...prev.coordinates, ...d.coordinates },
            }),
          }));
          if (d.mapEmbedUrl) setMapEmbedUrl(d.mapEmbedUrl);
        }
      } catch {}
    })();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showNotification("error", "Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await contactService.submitContact(formData);
      showNotification(
        "success",
        "Thank you! Your message has been sent successfully. We'll get back to you soon."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
        organization: "",
        preferredContact: "email",
      });
    } catch {
      showNotification(
        "error",
        "Failed to send your message. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  const getDirectionsUrl = () =>
    `https://www.google.com/maps/dir/?api=1&destination=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`;

  const GlassCard: React.FC<{
    children: React.ReactNode;
    className?: string;
  }> = ({ children, className = "" }) => (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
      }}
    >
      {children}
    </div>
  );

  // ── Shared input style ──────────────────────────────────────
  const inputClass =
    "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors";
  const inputStyle: React.CSSProperties = {
    fontFamily: F.body,
    fontWeight: 300,
    fontSize: "0.82rem",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg border max-w-md ${notification.type === "success" ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-red-500/20 border-red-500/30 text-red-400"}`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.82rem",
                }}
              >
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Label — DM Mono */}
          <p
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: "0.75rem",
            }}
          >
            Let's Connect
          </p>

          {/* H1 — Instrument Serif */}
          <h1
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: "rgba(255,255,255,0.88)",
              marginBottom: "0.75rem",
            }}
          >
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Touch
            </span>
          </h1>

          {/* Sub — Outfit 300 */}
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.75,
              maxWidth: "46ch",
              margin: "0 auto",
            }}
          >
            Ready to start your entrepreneurial journey? We're here to help you
            every step of the way.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                {/* Form heading — Instrument Serif */}
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.15rem",
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Full Name *",
                      name: "name",
                      type: "text",
                      value: formData.name,
                      placeholder: "Your full name",
                      required: true,
                    },
                    {
                      label: "Email Address *",
                      name: "email",
                      type: "email",
                      value: formData.email,
                      placeholder: "your.email@example.com",
                      required: true,
                    },
                  ].map(
                    ({ label, name, type, value, placeholder, required }) => (
                      <div key={name}>
                        <label
                          style={{
                            fontFamily: F.mono,
                            fontSize: "8px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.35)",
                          }}
                          className="block mb-2"
                        >
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={value}
                          onChange={handleInputChange}
                          className={inputClass}
                          style={inputStyle}
                          placeholder={placeholder}
                          required={required}
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Phone & Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Phone Number",
                      name: "phone",
                      type: "tel",
                      value: formData.phone,
                      placeholder: "+91 98765 43210",
                    },
                    {
                      label: "Organization/Company",
                      name: "organization",
                      type: "text",
                      value: formData.organization,
                      placeholder: "Your organization",
                    },
                  ].map(({ label, name, type, value, placeholder }) => (
                    <div key={name}>
                      <label
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.35)",
                        }}
                        className="block mb-2"
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className={inputClass}
                        style={inputStyle}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* Category & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                      }}
                      className="block mb-2"
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={inputClass}
                      style={inputStyle}
                    >
                      {[
                        "general",
                        "partnership",
                        "mentorship",
                        "events",
                        "media",
                        "careers",
                        "support",
                      ].map((v) => (
                        <option
                          key={v}
                          value={v}
                          className="bg-gray-800 capitalize"
                        >
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                          {v === "general" ? " Inquiry" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                      }}
                      className="block mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Brief subject line"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                    className="block mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    placeholder="Tell us about your inquiry, project, or how we can help you…"
                    required
                  />
                </div>

                {/* Preferred Contact */}
                <div>
                  <label
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                    className="block mb-3"
                  >
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-5">
                    {[
                      { value: "email", label: "Email", icon: Mail },
                      { value: "phone", label: "Phone", icon: Phone },
                      { value: "either", label: "Either", icon: MessageSquare },
                    ].map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value={value}
                          checked={formData.preferredContact === value}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 focus:ring-purple-500 focus:ring-2"
                        />
                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                        <span
                          style={{
                            fontFamily: F.body,
                            fontWeight: 300,
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit — Outfit 400 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: F.body,
                    fontWeight: 400,
                    fontSize: "0.82rem",
                    letterSpacing: "0.02em",
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-5"
          >
            {/* Contact Details */}
            <GlassCard className="p-6">
              {/* Heading — Instrument Serif */}
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.88)",
                  marginBottom: "1.25rem",
                }}
              >
                Contact Information
              </h3>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Address
                    </p>
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.65,
                      }}
                    >
                      {contactInfo.address}
                      <br />
                      {contactInfo.city}, {contactInfo.state}{" "}
                      {contactInfo.postalCode}
                      <br />
                      {contactInfo.country}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: "#c4b5fd",
                      }}
                      className="hover:text-purple-200 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Email
                    </p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: "#c4b5fd",
                      }}
                      className="hover:text-purple-200 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Website
                    </p>
                    <a
                      href={contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: "#c4b5fd",
                      }}
                      className="hover:text-purple-200 transition-colors"
                    >
                      {contactInfo.website}
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social Links */}
            <GlassCard className="p-6">
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.88)",
                  marginBottom: "1rem",
                }}
              >
                Follow Us
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    platform: "LinkedIn",
                    icon: Linkedin,
                    url: contactInfo.socialLinks.linkedin,
                    hoverClass: "hover:text-blue-400",
                  },
                  {
                    platform: "Twitter",
                    icon: Twitter,
                    url: contactInfo.socialLinks.twitter,
                    hoverClass: "hover:text-blue-400",
                  },
                  {
                    platform: "Instagram",
                    icon: Instagram,
                    url: contactInfo.socialLinks.instagram,
                    hoverClass: "hover:text-pink-400",
                  },
                  {
                    platform: "Facebook",
                    icon: Facebook,
                    url: contactInfo.socialLinks.facebook,
                    hoverClass: "hover:text-blue-500",
                  },
                ].map(({ platform, icon: Icon, url, hoverClass }) =>
                  url ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 ${hoverClass} transition-all duration-300`}
                    >
                      <Icon className="w-4 h-4" />
                      <span
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {platform}
                      </span>
                    </a>
                  ) : null
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              {/* Map heading — Instrument Serif */}
              <h2
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                Find Us
              </h2>
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>

            <div className="relative h-96 rounded-xl overflow-hidden">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                title="IPS Academy Location"
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}

export default ContactPage;
