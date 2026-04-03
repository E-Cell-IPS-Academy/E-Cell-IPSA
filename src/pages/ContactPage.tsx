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

// Firebase imports
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust path as needed

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
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Contact service
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
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw new Error("Failed to submit contact form");
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // This is a simple way to get IP - in production you might want to use a more robust solution
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "unknown";
    } catch {
      return "unknown";
    }
  }
}

const contactService = new ContactService();

const ContactPage: React.FC = () => {
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

  // Default contact info - used as fallback if Firestore data is unavailable
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
    coordinates: {
      lat: 22.655899779432467,
      lng: 75.82072097535772,
    },
  };

  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string>(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.943374193864!2d75.82072097535772!3d22.655899779432467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd9732905ba3%3A0xb086d4368f83ed6e!2sIPS%20Academy%20Gate%20No.%2002!5e0!3m2!1sen!2sin!4v1752119183392!5m2!1sen!2sin"
  );

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "contact"));
        if (snap.exists()) {
          const data = snap.data();
          setContactInfo((prev) => ({
            ...prev,
            ...(data.address && { address: data.address }),
            ...(data.city && { city: data.city }),
            ...(data.state && { state: data.state }),
            ...(data.postalCode && { postalCode: data.postalCode }),
            ...(data.country && { country: data.country }),
            ...(data.phone && { phone: data.phone }),
            ...(data.email && { email: data.email }),
            ...(data.website && { website: data.website }),
            ...(data.hours && { hours: { ...prev.hours, ...data.hours } }),
            ...(data.socialLinks && {
              socialLinks: { ...prev.socialLinks, ...data.socialLinks },
            }),
            ...(data.coordinates && {
              coordinates: { ...prev.coordinates, ...data.coordinates },
            }),
          }));
          if (data.mapEmbedUrl) {
            setMapEmbedUrl(data.mapEmbedUrl);
          }
        }
      } catch (err) {
        console.error("Failed to fetch contact content:", err);
        // Defaults remain in place
      }
    };
    fetchContactContent();
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

      // Reset form
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
    } catch (error) {
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

  const getDirectionsUrl = () => {
    const { lat, lng } = contactInfo.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

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
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg border max-w-md ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-red-500/20 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">{notification.message}</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight mb-4">
            Get In
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your entrepreneurial journey? We're here to help you
            every step of the way.
          </p>
        </motion.div>

        {/* Main Content Grid */}
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone and Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization/Company
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your organization"
                    />
                  </div>
                </div>

                {/* Category and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="general" className="bg-gray-800">
                        General Inquiry
                      </option>
                      <option value="partnership" className="bg-gray-800">
                        Partnership
                      </option>
                      <option value="mentorship" className="bg-gray-800">
                        Mentorship
                      </option>
                      <option value="events" className="bg-gray-800">
                        Events
                      </option>
                      <option value="media" className="bg-gray-800">
                        Media
                      </option>
                      <option value="careers" className="bg-gray-800">
                        Careers
                      </option>
                      <option value="support" className="bg-gray-800">
                        Support
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Brief subject line"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Tell us about your inquiry, project, or how we can help you..."
                    required
                  />
                </div>

                {/* Preferred Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4">
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
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-gray-300 text-sm">
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
                  <Phone className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Website</p>
                    <a
                      href={contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                    >
                      {contactInfo.website}
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social Links */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    platform: "LinkedIn",
                    icon: Linkedin,
                    url: contactInfo.socialLinks.linkedin,
                    color: "hover:text-blue-400",
                  },
                  {
                    platform: "Twitter",
                    icon: Twitter,
                    url: contactInfo.socialLinks.twitter,
                    color: "hover:text-blue-400",
                  },
                  {
                    platform: "Instagram",
                    icon: Instagram,
                    url: contactInfo.socialLinks.instagram,
                    color: "hover:text-pink-400",
                  },
                  {
                    platform: "Facebook",
                    icon: Facebook,
                    url: contactInfo.socialLinks.facebook,
                    color: "hover:text-blue-500",
                  },
                ].map(
                  ({ platform, icon: Icon, url, color }) =>
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 ${color} transition-all duration-300`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{platform}</span>
                      </a>
                    )
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Find Us</h2>
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            <div className="relative h-96 rounded-xl overflow-hidden">
              {/* Google Maps Embed */}
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

// Extend Window interface for Google Maps (no longer needed but keeping for potential future use)
declare global {
  interface Window {
    google?: any;
    initMap?: () => void;
  }
}

export default ContactPage;
