
import { motion } from "framer-motion";
import { Star, Facebook, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { name: "Our customers", href: "#" },
    { name: "Tech solutions", href: "#" },
    { name: "Why consolidator", href: "#" },
    { name: "About us", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  return (
    <motion.footer
      className="bg-black border-t border-white/10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-white tracking-tight">
                consolidator
              </div>
            </motion.div>

            {/* Contact Email */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Mail className="w-5 h-5 text-gray-400" />
              <a
                href="mailto:SALES@CONSOLIDATOR.AERO"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                SALES@CONSOLIDATOR.AERO
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Section - Links */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 block"
                >
                  {link.name}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Left - Company Info */}
            <motion.div
              className="text-center lg:text-left space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-sm text-gray-400">
                LLC Tickets Consolidator
              </div>
              <div className="text-sm text-gray-500">
                © 2024 Consolidator. All rights reserved.
              </div>
            </motion.div>

            {/* Center - Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </motion.div>

            {/* Right - Trustpilot Rating */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-gray-400">Excellent</span>
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-green-400 fill-current"
                  />
                ))}
                <Star className="w-4 h-4 text-gray-400 fill-current" />
              </div>
              <motion.div
                className="text-sm font-bold text-white"
                whileHover={{ scale: 1.05 }}
              >
                Trustpilot
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
