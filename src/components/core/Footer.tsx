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
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("footer-fonts")) return;
    const link = document.createElement("link");
    link.id = "footer-fonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

// ─── Types & defaults ─────────────────────────────────────────

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

const DEFAULT_SOCIAL: SocialLinkData = {
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

// ─── Shared style helpers ─────────────────────────────────────
const linkStyle: React.CSSProperties = {
  fontFamily: F.body,
  fontSize: "0.78rem",
  fontWeight: 300,
  color: "rgba(255,255,255,0.38)",
  display: "block",
  transition: "color 0.2s",
  lineHeight: 1.5,
};

// ─────────────────────────────────────────────────────────────

const Footer = () => {
  useFonts();

  const [social, setSocial] = useState<SocialLinkData>(DEFAULT_SOCIAL);
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteContent", "settings"));
        if (snap.exists()) {
          const d = snap.data();
          if (d.socialLinks) setSocial({ ...DEFAULT_SOCIAL, ...d.socialLinks });
          if (d.contact) setContact({ ...DEFAULT_CONTACT, ...d.contact });
        }
      } catch {}
    })();
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
      { name: "Competitions", href: "/competitions" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Startup Stories", href: "/startup" },
      { name: "FAQs", href: "/faq" },
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
      href: social.facebook,
      label: "Facebook",
      hoverColor: "#3b82f6",
    },
    {
      icon: Instagram,
      href: social.instagram,
      label: "Instagram",
      hoverColor: "#ec4899",
    },
    {
      icon: Linkedin,
      href: social.linkedin,
      label: "LinkedIn",
      hoverColor: "#60a5fa",
    },
    {
      icon: Twitter,
      href: social.twitter,
      label: "Twitter",
      hoverColor: "#60a5fa",
    },
    {
      icon: Youtube,
      href: social.youtube,
      label: "YouTube",
      hoverColor: "#ef4444",
    },
  ];

  return (
    <motion.footer
      className="border-t relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0a000f 0%, #060008 50%, #09000d 100%)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Ambient glow top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: "rgba(120,40,200,0.06)",
          filter: "blur(120px)",
          top: -100,
          right: -100,
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 py-14 relative z-10">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/EcellLogo.png"
                  alt="E-Cell IPSA"
                  className="h-10 w-auto"
                />
                <div>
                  {/* Brand name — Instrument Serif */}
                  <div
                    style={{
                      fontFamily: F.display,
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.88)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    E-Cell IPSA
                  </div>
                  {/* Tagline — Outfit 300 italic */}
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.7rem",
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "#a78bfa",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Entrepreneurship Cell
                  </div>
                </div>
              </div>

              {/* Description — Outfit 300 */}
              <p
                style={{
                  fontFamily: F.body,
                  fontSize: "0.78rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.32)",
                  maxWidth: "34ch",
                }}
              >
                Fostering innovation and entrepreneurship at IPS Academy. Join
                us in building the next generation of successful entrepreneurs.
              </p>
            </motion.div>

            {/* Contact info — Outfit 300 */}
            <motion.div
              className="space-y-2.5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Mail,
                  href: `mailto:${contact.email}`,
                  text: contact.email,
                },
                {
                  icon: Phone,
                  href: `tel:${contact.phone.replace(/\s/g, "")}`,
                  text: contact.phone,
                },
              ].map(({ icon: Icon, href, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon
                    style={{
                      width: 13,
                      height: 13,
                      color: "#a78bfa",
                      flexShrink: 0,
                    }}
                  />
                  <a
                    href={href}
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.75rem",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.35)",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
                    }
                  >
                    {text}
                  </a>
                </div>
              ))}
              <div className="flex items-start gap-2.5">
                <MapPin
                  style={{
                    width: 13,
                    height: 13,
                    color: "#a78bfa",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.30)",
                    lineHeight: 1.6,
                  }}
                >
                  {contact.addressLine1}
                  <br />
                  {contact.addressLine2}
                </div>
              </div>
            </motion.div>

            {/* Social icons */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 34,
                    height: 34,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.35)",
                    transition: "all 0.2s",
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = hoverColor;
                    (e.currentTarget as HTMLElement).style.borderColor =
                      hoverColor + "40";
                    (e.currentTarget as HTMLElement).style.background =
                      hoverColor + "15";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.35)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.04)";
                  }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Link columns — DM Mono headings, Outfit 300 links */}
          {[
            { title: "Quick Links", links: footerLinks.quickLinks, delay: 0 },
            { title: "Programs", links: footerLinks.programs, delay: 0.1 },
            { title: "Resources", links: footerLinks.resources, delay: 0.2 },
          ].map(({ title, links, delay }) => (
            <div key={title} className="space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
                viewport={{ once: true }}
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </motion.p>

              <div className="space-y-2.5">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: delay + i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.href}
                      style={linkStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(167,139,250,0.8)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.38)")
                      }
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Copyright — Outfit 300 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                fontWeight: 300,
                color: "rgba(255,255,255,0.28)",
              }}
            >
              &copy; 2025 E-Cell IPS Academy. All rights reserved.
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.65rem",
                fontWeight: 300,
                color: "rgba(255,255,255,0.18)",
                marginTop: "0.2rem",
                letterSpacing: "0.03em",
              }}
            >
              Fostering Innovation &bull; Building Entrepreneurs &bull; Creating
              Impact
            </div>
          </motion.div>

          {/* Legal links — DM Mono */}
          <motion.div
            className="flex gap-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                style={{
                  fontFamily: F.mono,
                  fontSize: "8px",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.22)",
                  transition: "color 0.2s",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.22)")
                }
              >
                {link.name}
              </Link>
            ))}
          </motion.div>

          {/* Back to top — Outfit 300 */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "rgba(167,139,250,0.25)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.06)")
            }
          >
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                fontWeight: 300,
                color: "rgba(255,255,255,0.40)",
              }}
            >
              Back to top
            </span>
            <ArrowUp
              style={{ width: 12, height: 12, color: "rgba(255,255,255,0.30)" }}
            />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
