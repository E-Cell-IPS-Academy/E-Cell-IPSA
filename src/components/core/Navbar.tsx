import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (): void => {
      setActiveDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Past Events", href: "/past-events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blogs", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
    { name: "Startup", href: "/startup" },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setActiveDropdown(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string | null): string => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/50"
          : "bg-black/20 backdrop-blur-md border-b border-white/5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backdropFilter: isScrolled
          ? "blur(40px) saturate(150%)"
          : "blur(20px) saturate(120%)",
        WebkitBackdropFilter: isScrolled
          ? "blur(40px) saturate(150%)"
          : "blur(20px) saturate(120%)",
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center">
              <img
                src="https://ecell-ipsa.iesipsacademystudentclubs.org/assets/EcellLogo-s1TM4fVH.png"
                alt="E-Cell IPSA Logo"
                className="h-10 lg:h-12 w-auto object-contain drop-shadow-lg"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.name}>
                {item.href.startsWith("/") ? (
                  <Link
                    to={item.href}
                    className={`relative text-sm font-medium transition-all duration-300 py-2 drop-shadow-sm ${
                      location.pathname === item.href
                        ? "text-white"
                        : "text-gray-200 hover:text-white"
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
                ) : (
                  <a
                    href={item.href}
                    className="relative text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 py-2 drop-shadow-sm"
                  >
                    {item.name}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Authentication Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "lang" ? null : "lang");
                }}
              >
                <span>English</span>
                <motion.div
                  animate={{ rotate: activeDropdown === "lang" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "lang" && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-xl py-3 min-w-[140px] shadow-2xl shadow-black/50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {["English", "हिंदी", "Français", "Deutsch"].map((lang) => (
                      <button
                        key={lang}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Authentication */}
            {isAuthenticated && user ? (
              /* Logged In User */
              <>
                {/* Notifications */}
                <motion.button
                  className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </motion.button>

                {/* User Dropdown */}
                <div className="relative">
                  <motion.button
                    className="flex items-center space-x-3 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === "user" ? null : "user"
                      );
                    }}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user.displayName)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-24">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.button>

                  <AnimatePresence>
                    {activeDropdown === "user" && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-xl py-3 min-w-[220px] shadow-2xl shadow-black/50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                          {!user.emailVerified && (
                            <p className="text-xs text-orange-400 mt-1">
                              Email not verified
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <User className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Settings className="w-4 h-4" />
                            Profile Settings
                          </Link>

                          {/* Admin Panel Link (if user has admin privileges) */}
                          <Link
                            to="/admin/login"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-white/10 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Not Logged In */
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </Link>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-white/20 bg-black/80 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backdropFilter: "blur(30px) saturate(150%)",
                WebkitBackdropFilter: "blur(30px) saturate(150%)",
              }}
            >
              <div className="py-4 space-y-4">
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.href.startsWith("/") ? (
                      <Link
                        to={item.href}
                        className={`block py-3 px-2 rounded-lg transition-colors duration-300 ${
                          location.pathname === item.href
                            ? "text-white bg-white/10"
                            : "text-gray-200 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="block text-gray-200 hover:text-white transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-white/20">
                  {isAuthenticated && user ? (
                    /* Mobile User Menu */
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(user.displayName)}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 p-3 text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    /* Mobile Login/Signup */
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="block w-full text-center py-3 px-4 text-gray-200 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-center py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Language Selector */}
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-200 font-medium">English</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
