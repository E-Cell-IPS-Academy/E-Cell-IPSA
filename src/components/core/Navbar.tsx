import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, Image, FileText, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/past-events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: Image },
    { name: "Blogs", href: "/blog", icon: FileText },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? isDark
              ? "bg-black/70 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/50"
              : "bg-white/70 backdrop-blur-2xl border-b border-purple-200/30 shadow-2xl shadow-purple-500/5"
            : isDark
            ? "bg-black/30 backdrop-blur-xl border-b border-white/10"
            : "bg-white/30 backdrop-blur-xl border-b border-purple-100/20"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backdropFilter: isScrolled
            ? "blur(40px) saturate(180%)"
            : "blur(20px) saturate(150%)",
          WebkitBackdropFilter: isScrolled
            ? "blur(40px) saturate(180%)"
            : "blur(20px) saturate(150%)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center">
                <img
                  src="/EcellLogo.png"
                  alt="E-Cell IPSA Logo"
                  className="h-8 lg:h-12 w-auto object-contain drop-shadow-lg"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.div key={item.name}>
                  <Link
                    to={item.href}
                    className={`relative text-sm font-medium transition-all duration-300 py-2 drop-shadow-sm ${
                      location.pathname === item.href
                        ? isDark
                          ? "text-white"
                          : "text-gray-900"
                        : isDark
                        ? "text-gray-200 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg w-full"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* IgniteX Registration Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/hiring"
                  className="relative px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-purple-500/30"
                >
                  <span className="relative z-10">We're Hiring</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Right Side */}
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/hiring"
                  className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-purple-500/30"
                >
                  We're Hiring
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          className={`mx-3 mb-3 rounded-2xl border shadow-2xl ${
            isDark
              ? "border-white/20 bg-black/60 shadow-black/50"
              : "border-purple-200/30 bg-white/60 shadow-purple-500/10"
          }`}
          style={{
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
          }}
        >
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 relative"
                >
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl border ${
                        isDark
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30"
                          : "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/30"
                      }`}
                      layoutId="activeBottomTab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                      isActive
                        ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                        : isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1 font-medium relative z-10 transition-all duration-300 ${
                      isActive
                        ? "text-purple-300"
                        : isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
