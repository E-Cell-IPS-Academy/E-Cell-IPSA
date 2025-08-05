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

const Footer = () => {
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
      href: "https://facebook.com/ecell.ips.academy",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/ecell_ips",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/ecell-ips-academy",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/ecell_ips",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/@ecellips",
      label: "YouTube",
      color: "hover:text-red-500",
    },
  ];
  

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 via-black to-purple-900 border-t border-white/10 relative overflow-hidden"
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
                  <div className="text-2xl font-bold text-white tracking-tight">
                    E-Cell IPSA
                  </div>
                  <div className="text-sm text-purple-300">
                    Entrepreneurship Cell
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
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
                  href="mailto:ecell@ipsacademy.org"
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  ecell@ipsacademy.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <a
                  href="tel:+917312570631"
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  +91 731 2570631
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  IPS Academy Campus
                  <br />
                  Knowledge Village, Indore, MP
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
                  className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300 ${color}`}
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
              className="text-lg font-semibold text-white"
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
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300 block text-sm"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <motion.h3
              className="text-lg font-semibold text-white"
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
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300 block text-sm"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <motion.h3
              className="text-lg font-semibold text-white"
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
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-300 block text-sm"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Left - Copyright */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-sm text-gray-400">
                © 2025 E-Cell IPS Academy. All rights reserved.
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Fostering Innovation • Building Entrepreneurs • Creating Impact
              </div>
            </motion.div>

            {/* Center - Legal Links */}
            <motion.div
              className="flex space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>

            {/* Right - Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-all duration-300"
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
