import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Our Customers", href: "#" },
    { name: "Tech Solutions", href: "#" },
    { name: "Why Consolidator", href: "#" },
    { name: "About us", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

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
            <div className="text-xl lg:text-2xl font-bold text-white tracking-tight drop-shadow-lg">
              consolidator
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 py-2 drop-shadow-sm"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Language Selector & Rating */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  setActiveDropdown(activeDropdown === "lang" ? null : "lang")
                }
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
                    style={{
                      backdropFilter: "blur(40px) saturate(150%)",
                      WebkitBackdropFilter: "blur(40px) saturate(150%)",
                    }}
                  >
                    {["English", "Español", "Français", "Deutsch"].map(
                      (lang) => (
                        <button
                          key={lang}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {lang}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rating */}
            <motion.div
              className="flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-sm font-semibold text-white drop-shadow-sm">
                Login
              </span>
            </motion.div>
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
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-200 hover:text-white transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-white/20 bg-white/5 rounded-lg p-3 mt-4">
                  <span className="text-gray-200 font-medium">English</span>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">4.2</span>
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
