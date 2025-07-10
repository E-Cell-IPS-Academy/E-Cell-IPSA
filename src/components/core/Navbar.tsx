import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  console.log(activeDropdown);

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
                src="/EcellLogo.png"
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

                {/* Language Selector */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
