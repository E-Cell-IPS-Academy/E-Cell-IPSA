import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  ChevronRight,
  Lock,
  Eye,
  Database,
  Cookie,
  Globe,
  UserCheck,
  Mail,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TOCItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const tocItems: TOCItem[] = [
  {
    id: "information-collection",
    title: "Information Collection",
    icon: <Database className="w-4 h-4" />,
  },
  {
    id: "use-of-data",
    title: "Use of Data",
    icon: <Eye className="w-4 h-4" />,
  },
  {
    id: "data-protection",
    title: "Data Protection",
    icon: <Lock className="w-4 h-4" />,
  },
  { id: "cookies", title: "Cookies", icon: <Cookie className="w-4 h-4" /> },
  {
    id: "third-party",
    title: "Third-party Services",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    id: "user-rights",
    title: "User Rights",
    icon: <UserCheck className="w-4 h-4" />,
  },
  { id: "contact", title: "Contact", icon: <Mail className="w-4 h-4" /> },
];

const LAST_UPDATED = "March 15, 2026";

const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("information-collection");
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (const section of sections.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SectionBlock: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
    index: number;
  }> = ({ id, title, children, index }) => (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={contentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-12 scroll-mt-32"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
          {index + 1}
        </span>
        {title}
      </h2>
      <div className="text-gray-300 leading-relaxed space-y-4">{children}</div>
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black" />

        {/* Shield animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/10 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-purple-500/5 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link to="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-400">Privacy Policy</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400"
          >
            Last updated: {LAST_UPDATED}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="relative py-16 px-6 pb-32">
        <div className="max-w-7xl mx-auto flex gap-12">
          {/* Sticky TOC Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-72 flex-shrink-0"
          >
            <div className="sticky top-32">
              <div
                className="p-6 rounded-2xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-300 ${
                        activeSection === item.id
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={
                          activeSection === item.id
                            ? "text-purple-400"
                            : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                      {item.title}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={scrollToTop}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to top
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12 p-6 rounded-2xl border border-white/10 bg-white/5"
            >
              <p className="text-gray-300 leading-relaxed">
                E-Cell IPS Academy ("we", "our", or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website, participate in our events, or use our
                services. Please read this policy carefully to understand our
                practices regarding your personal data.
              </p>
            </motion.div>

            <SectionBlock
              id="information-collection"
              title="Information We Collect"
              index={0}
            >
              <p>We may collect the following types of information:</p>
              <div className="space-y-3 mt-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Personal Information
                  </h4>
                  <p className="text-sm text-gray-400">
                    When you register for events, create an account, or contact
                    us, we may collect your name, email address, phone number,
                    college details, year of study, department, and other
                    details you voluntarily provide.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">Usage Data</h4>
                  <p className="text-sm text-gray-400">
                    We automatically collect information about how you interact
                    with our website, including your IP address, browser type,
                    pages visited, time spent on pages, and referral sources.
                    This helps us improve our services and user experience.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Event Participation Data
                  </h4>
                  <p className="text-sm text-gray-400">
                    When you participate in our events, competitions, or
                    workshops, we may collect project submissions, team
                    information, presentation materials, and feedback that you
                    provide during the event.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              id="use-of-data"
              title="How We Use Your Data"
              index={1}
            >
              <p>We use your information for the following purposes:</p>
              <ul className="list-none space-y-2 mt-4">
                {[
                  "To process event registrations and manage participation",
                  "To communicate about upcoming events, workshops, and opportunities",
                  "To send newsletters and updates (with your consent)",
                  "To improve our website, services, and user experience",
                  "To analyze trends and usage patterns for internal research",
                  "To respond to your inquiries and provide support",
                  "To maintain security and prevent fraud",
                  "To comply with legal obligations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>

            <SectionBlock
              id="data-protection"
              title="Data Protection"
              index={2}
            >
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">Encryption</h4>
                  <p className="text-sm text-gray-400">
                    All data transmitted between your browser and our servers is
                    encrypted using SSL/TLS protocols. Sensitive data stored in
                    our databases is encrypted at rest.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Access Controls
                  </h4>
                  <p className="text-sm text-gray-400">
                    Access to personal data is restricted to authorized E-Cell
                    team members who need it to perform their duties. We use
                    role-based access controls and regularly review access
                    permissions.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Data Retention
                  </h4>
                  <p className="text-sm text-gray-400">
                    We retain personal data only for as long as necessary to
                    fulfill the purposes outlined in this policy. Event-related
                    data is typically retained for 2 academic years. Account
                    data is retained until you request deletion.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock id="cookies" title="Cookies & Tracking" index={3}>
              <p>
                Our website uses cookies and similar tracking technologies to
                enhance your browsing experience and analyze site traffic.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Essential Cookies
                  </h4>
                  <p className="text-sm text-gray-400">
                    Required for basic site functionality such as
                    authentication, session management, and security. These
                    cannot be disabled.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-gray-400">
                    We use Firebase Analytics and Google Analytics to understand
                    how visitors interact with our site. This data is aggregated
                    and anonymized. You can opt out through your browser
                    settings.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              id="third-party"
              title="Third-party Services"
              index={4}
            >
              <p>
                We use the following third-party services that may process your
                data:
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    name: "Firebase / Google Cloud",
                    purpose: "Hosting, database, authentication, analytics",
                  },
                  {
                    name: "Google Forms",
                    purpose: "Event registrations and surveys",
                  },
                  {
                    name: "Cloudinary",
                    purpose: "Image storage and optimization",
                  },
                  {
                    name: "Social Media Platforms",
                    purpose: "Event promotion, community engagement",
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="p-4 bg-white/5 rounded-xl border border-white/5"
                  >
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {service.name}
                    </h4>
                    <p className="text-xs text-gray-500">{service.purpose}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Each third-party service has its own privacy policy governing
                the use of your data. We encourage you to review their policies.
              </p>
            </SectionBlock>

            <SectionBlock id="user-rights" title="Your Rights" index={5}>
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-none space-y-2 mt-4">
                {[
                  {
                    right: "Right to Access",
                    desc: "Request a copy of the personal data we hold about you.",
                  },
                  {
                    right: "Right to Rectification",
                    desc: "Request correction of inaccurate or incomplete data.",
                  },
                  {
                    right: "Right to Deletion",
                    desc: "Request deletion of your personal data, subject to legal retention requirements.",
                  },
                  {
                    right: "Right to Withdraw Consent",
                    desc: "Withdraw consent for data processing at any time by contacting us.",
                  },
                  {
                    right: "Right to Data Portability",
                    desc: "Request your data in a structured, machine-readable format.",
                  },
                  {
                    right: "Right to Object",
                    desc: "Object to processing of your data for marketing purposes.",
                  },
                ].map((item) => (
                  <li
                    key={item.right}
                    className="p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <span className="text-purple-300 font-semibold text-sm">
                      {item.right}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                To exercise any of these rights, please contact us using the
                details below. We will respond to your request within 30 days.
              </p>
            </SectionBlock>

            <SectionBlock id="contact" title="Contact Us" index={6}>
              <p>
                If you have questions about this Privacy Policy or wish to
                exercise your data rights, please contact us:
              </p>
              <div className="mt-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="space-y-3">
                  <p className="text-white font-semibold">E-Cell IPS Academy</p>
                  <p className="text-gray-400 text-sm">
                    IPS Academy Campus, Knowledge Village
                    <br />
                    Indore, Madhya Pradesh 452012, India
                  </p>
                  <p className="text-gray-400 text-sm">
                    Email:{" "}
                    <a
                      href="mailto:ecell@ipsacademy.org"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      ecell@ipsacademy.org
                    </a>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Phone: +91 731 2570631
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                We reserve the right to update this Privacy Policy at any time.
                Changes will be posted on this page with an updated revision
                date. We encourage you to review this policy periodically.
              </p>
            </SectionBlock>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
