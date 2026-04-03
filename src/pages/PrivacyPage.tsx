import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Cookie,
  Users,
  Mail,
  FileText,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${className}`}
    style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    }}
  >
    {children}
  </div>
);

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Personal information you provide when registering for events, workshops, or competitions (name, email, phone number, college, year of study).",
      "Account information when you create an account on our platform (username, password hash, profile details).",
      "Usage data collected automatically such as browser type, device information, IP address, pages visited, and interaction patterns.",
      "Information submitted through contact forms, feedback surveys, and mentorship applications.",
      "Event participation records, competition submissions, and workshop attendance data.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To manage event registrations, send confirmations, and provide event-related communications.",
      "To match mentees with appropriate mentors based on skills, interests, and goals.",
      "To improve our website, services, and user experience through analytics.",
      "To send newsletters, event announcements, and relevant updates (with your consent).",
      "To evaluate competition submissions and facilitate judging processes.",
      "To maintain internal records for incubation programs and funding applications.",
    ],
  },
  {
    icon: Lock,
    title: "Data Protection & Security",
    content: [
      "We use industry-standard encryption (SSL/TLS) for all data transmitted between your browser and our servers.",
      "Passwords are hashed using secure algorithms and are never stored in plain text.",
      "Access to personal data is restricted to authorized E-Cell team members on a need-to-know basis.",
      "We use Firebase security rules to protect database access and prevent unauthorized data retrieval.",
      "Regular security audits are conducted to identify and address potential vulnerabilities.",
    ],
  },
  {
    icon: Users,
    title: "Data Sharing & Third Parties",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share anonymized, aggregated data with partners for research and improvement purposes.",
      "Event sponsors may receive participant lists only with your explicit opt-in consent.",
      "We use Firebase (Google) for authentication and data storage, subject to Google's privacy policies.",
      "Mentors receive only relevant information about their assigned mentees necessary for the program.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your session and authentication state.",
      "Analytics cookies help us understand how visitors interact with our website.",
      "You can control cookie preferences through your browser settings at any time.",
      "We do not use cookies for advertising or cross-site tracking purposes.",
    ],
  },
  {
    icon: FileText,
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal data at any time.",
      "You can opt out of non-essential communications by unsubscribing from our mailing list.",
      "You may request a copy of all personal data we hold about you.",
      "You can request account deletion by contacting us at ecell@ipsacademy.org.",
      "We will respond to data access and deletion requests within 30 business days.",
    ],
  },
];

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px]"
          animate={{ x: [0, 50, -30, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-5%", right: "-5%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]"
          animate={{ x: [0, -40, 20, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", left: "-5%" }}
        />
      </div>

      {/* Back Button */}
      <motion.div className="fixed top-24 left-6 z-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Back</span>
        </Link>
      </motion.div>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-400">Privacy Policy</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Your Privacy Matters</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6"
          >
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Policy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-4"
          >
            We are committed to protecting your personal information and being transparent about how we use it.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500"
          >
            Last updated: April 1, 2026
          </motion.p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <section.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, j) => (
                    <motion.li
                      key={j}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.05 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}

          {/* Contact for Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:ecell@ipsacademy.org"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    ecell@ipsacademy.org
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Contact Page
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
