import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface SocialLinkData {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

interface ContactData {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLinkData = {
  facebook: "https://facebook.com/ecell.ips.academy",
  instagram: "https://instagram.com/ecell_ips",
  linkedin: "https://linkedin.com/company/ecell-ips-academy",
  twitter: "https://twitter.com/ecell_ips",
  youtube: "https://youtube.com/@ecellips",
};

const DEFAULT_CONTACT: ContactData = {
  email: "ecell@ipsacademy.org",
  phone: "+91 731 2570631",
  addressLine1: "IPS Academy Campus",
  addressLine2: "Knowledge Village, Indore, MP",
};

const Footer = () => {
  const { isDark } = useTheme();
  const [socialLinksData, setSocialLinksData] = useState<SocialLinkData>(DEFAULT_SOCIAL_LINKS);
  const [contactData, setContactData] = useState<ContactData>(DEFAULT_CONTACT);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "siteContent", "settings"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();

          if (data.socialLinks) {
            setSocialLinksData({
              facebook: data.socialLinks.facebook || DEFAULT_SOCIAL_LINKS.facebook,
              instagram: data.socialLinks.instagram || DEFAULT_SOCIAL_LINKS.instagram,
              linkedin: data.socialLinks.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
              twitter: data.socialLinks.twitter || DEFAULT_SOCIAL_LINKS.twitter,
              youtube: data.socialLinks.youtube || DEFAULT_SOCIAL_LINKS.youtube,
            });
          }

          if (data.contact) {
            setContactData({
              email: data.contact.email || DEFAULT_CONTACT.email,
              phone: data.contact.phone || DEFAULT_CONTACT.phone,
              addressLine1: data.contact.addressLine1 || DEFAULT_CONTACT.addressLine1,
              addressLine2: data.contact.addressLine2 || DEFAULT_CONTACT.addressLine2,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const footerLinks = {
    quickLinks: [
      { name: "About E-Cell", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Past Events", href: "/past-events" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact Us", href: "/contact" },
    ],
    programs: [
      { name: "Startup Incubation", href: "/incubation" },
      { name: "Mentorship", href: "/mentorship" },
      { name: "Workshops", href: "/workshops" },
      { name: "Competitions", href: "/competitions" },
      { name: "Funding Support", href: "/funding" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Startup Stories", href: "/startup" },
      { name: "Resources", href: "/resources" },
      { name: "FAQs", href: "/faq" },
      { name: "Alumni Network", href: "/alumni" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Code of Conduct", href: "/conduct" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: socialLinksData.facebook,
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      href: socialLinksData.instagram,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: socialLinksData.linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: socialLinksData.twitter,
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Youtube,
      href: socialLinksData.youtube,
      label: "YouTube",
      color: "hover:text-red-500",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className={`border-t relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-black to-purple-900 border-white/10"
          : "bg-gradient-to-br from-gray-50 via-white to-purple-50 border-purple-100/30"
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMThoNnYxMnptMC0xOGgtNlYwaDZ2MTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* E-Cell Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/EcellLogo.png"
                  alt="E-Cell IPSA"
                  className="h-12 w-auto"
                />
                <div>
                  <div className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                    E-Cell IPSA
                  </div>
                  <div className="text-sm text-purple-400">
                    Entrepreneurship Cell
                  </div>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Fostering innovation and entrepreneurship at IPS Academy. Join
                us in building the next generation of successful entrepreneurs.
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <a
                  href={`mailto:${contactData.email}`}
                  className={`transition-colors duration-300 text-sm ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {contactData.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <a
                  href={`tel:${contactData.phone.replace(/\s/g, "")}`}
                  className={`transition-colors duration-300 text-sm ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {contactData.phone}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {contactData.addressLine1}
                  <br />
                  {contactData.addressLine2}
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex space-x-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${color} ${
                    isDark
                      ? "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
                      : "bg-purple-50 text-gray-500 hover:text-gray-900 hover:bg-purple-100"
                  }`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <motion.h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h3>
            <div className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className={`transition-colors duration-300 block text-sm ${
                      isDark ? "text-gray-400 hover:text-purple-300" : "text-gray-500 hover:text-purple-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <motion.h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Programs
            </motion.h3>
            <div className="space-y-3">
              {footerLinks.programs.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className={`transition-colors duration-300 block text-sm ${
                      isDark ? "text-gray-400 hover:text-purple-300" : "text-gray-500 hover:text-purple-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <motion.h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Resources
            </motion.h3>
            <div className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className={`transition-colors duration-300 block text-sm ${
                      isDark ? "text-gray-400 hover:text-purple-300" : "text-gray-500 hover:text-purple-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t ${isDark ? "border-white/10" : "border-purple-100/30"}`}>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                &copy; 2025 E-Cell IPS Academy. All rights reserved.
              </div>
              <div className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Fostering Innovation &bull; Building Entrepreneurs &bull; Creating Impact
              </div>
            </motion.div>

            <motion.div
              className="flex space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-xs transition-colors duration-300 ${
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>

            <motion.button
              onClick={scrollToTop}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
                  : "bg-purple-50 hover:bg-purple-100 text-gray-500 hover:text-gray-900"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
