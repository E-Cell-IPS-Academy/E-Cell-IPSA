/**
 * Navbar — Font Architecture
 * ──────────────────────────────────────────────────────────────
 *  NAV LINKS  → "Outfit" (300 / 400)
 *               Why: clean, geometric — reads perfectly at 14px
 *
 *  CTA PILL   → "Outfit" (400) — slightly heavier than nav links
 *
 *  MOBILE TAB → "DM Mono" (400) — monospaced tab labels look sharp
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, Image, FileText, Phone, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("nav-fonts")) return;
    const link = document.createElement("link");
    link.id = "nav-fonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);
}

const F = {
  nav: "'Outfit', sans-serif",
  mono: "'DM Mono', monospace",
};

const Navbar: React.FC = () => {
  useFonts();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();

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
    { name: "Teams", href: "/team", icon: Users },
    { name: "Blogs", href: "/blog", icon: FileText },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* ── Top Navbar ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/40"
            : "bg-black/20 backdrop-blur-xl border-b border-white/[0.06]"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backdropFilter: isScrolled
            ? "blur(40px) saturate(180%)"
            : "blur(20px) saturate(140%)",
          WebkitBackdropFilter: isScrolled
            ? "blur(40px) saturate(180%)"
            : "blur(20px) saturate(140%)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-18">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center">
                <img
                  src="/EcellLogo.png"
                  alt="E-Cell IPSA Logo"
                  className="h-8 lg:h-11 w-auto object-contain drop-shadow-lg"
                />
              </Link>
            </motion.div>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div key={item.name}>
                    <Link
                      to={item.href}
                      style={{
                        fontFamily: F.nav,
                        fontSize: "0.8rem",
                        fontWeight: isActive ? 400 : 300,
                        letterSpacing: "0.02em",
                        color: isActive
                          ? "rgba(255,255,255,0.92)"
                          : "rgba(255,255,255,0.52)",
                        transition: "color 0.25s",
                        position: "relative",
                        paddingBottom: "0.35rem",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.88)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isActive
                          ? "rgba(255,255,255,0.92)"
                          : "rgba(255,255,255,0.52)")
                      }
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-px"
                          style={{
                            background:
                              "linear-gradient(90deg, #a78bfa, #60a5fa)",
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* CTA pill */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/hiring"
                  style={{
                    fontFamily: F.nav,
                    fontSize: "0.78rem",
                    fontWeight: 400,
                    letterSpacing: "0.03em",
                    color: "rgba(255,255,255,0.9)",
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(59,130,246,0.8))",
                    border: "1px solid rgba(167,139,250,0.25)",
                    padding: "0.45rem 1.1rem",
                    borderRadius: "999px",
                    backdropFilter: "blur(8px)",
                    display: "inline-block",
                  }}
                >
                  We're Hiring
                </Link>
              </motion.div>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/hiring"
                  style={{
                    fontFamily: F.nav,
                    fontSize: "0.7rem",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    color: "rgba(255,255,255,0.9)",
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(59,130,246,0.8))",
                    border: "1px solid rgba(167,139,250,0.2)",
                    padding: "0.38rem 0.85rem",
                    borderRadius: "999px",
                    display: "inline-block",
                  }}
                >
                  We're Hiring
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Bottom Navigation ── */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          className="mx-3 mb-3 rounded-2xl"
          style={{
            background: "rgba(10,0,18,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
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
                  className="flex flex-col items-center py-2 px-3 rounded-xl relative"
                  style={{ transition: "all 0.25s" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.12))",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className="w-4 h-4 relative z-10"
                    style={{
                      color: isActive ? "#a78bfa" : "rgba(255,255,255,0.35)",
                      filter: isActive
                        ? "drop-shadow(0 0 6px rgba(167,139,250,0.5))"
                        : "none",
                      transition: "all 0.25s",
                    }}
                  />

                  {/* Tab label — DM Mono */}
                  <span
                    className="mt-1 relative z-10"
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.08em",
                      color: isActive
                        ? "rgba(167,139,250,0.9)"
                        : "rgba(255,255,255,0.28)",
                      transition: "color 0.25s",
                    }}
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
