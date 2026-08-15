import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  ChevronRight,
  CheckCircle,
  Users,
  UserCheck,
  Calendar,
  Award,
  AlertTriangle,
  RefreshCw,
  Scale,
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
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    id: "eligibility",
    title: "Eligibility",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    icon: <UserCheck className="w-4 h-4" />,
  },
  {
    id: "event-participation",
    title: "Event Participation",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    id: "modifications",
    title: "Modifications",
    icon: <RefreshCw className="w-4 h-4" />,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: <Scale className="w-4 h-4" />,
  },
];

const LAST_UPDATED = "March 15, 2026";

const TermsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
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

        {/* Floating document shapes */}
        <motion.div
          className="absolute top-1/3 left-[12%] w-16 h-20 border border-purple-500/15 rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.08), transparent)",
          }}
          animate={{ y: [-10, 10, -10], rotateZ: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[12%] w-14 h-18 border border-blue-500/15 rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.08), transparent)",
          }}
          animate={{ y: [10, -10, 10], rotateZ: [3, -3, 3] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
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
            <span className="text-purple-400">Terms of Service</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Terms of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Service
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
                Welcome to the E-Cell IPS Academy website. These Terms of
                Service ("Terms") govern your access to and use of our website,
                services, events, and programs. By accessing or using our
                services, you agree to be bound by these Terms. If you do not
                agree, please discontinue use immediately.
              </p>
            </motion.div>

            <SectionBlock id="acceptance" title="Acceptance of Terms" index={0}>
              <p>
                By accessing this website, registering for an account, or
                participating in any E-Cell event or program, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms of Service and our Privacy Policy.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you
                and E-Cell IPS Academy. If you are using our services on behalf
                of an organization, you represent that you have the authority to
                bind that organization to these Terms.
              </p>
              <p>
                Your continued use of the website following the posting of
                revised Terms means that you accept and agree to the changes.
              </p>
            </SectionBlock>

            <SectionBlock id="eligibility" title="Eligibility" index={1}>
              <p>To use our services, you must meet the following criteria:</p>
              <ul className="list-none space-y-2 mt-4">
                {[
                  "Be at least 16 years of age",
                  "Be a current student, alumnus, or faculty member of IPS Academy (for member-only features and events)",
                  "Provide accurate, truthful, and complete registration information",
                  "Not have been previously banned or removed from E-Cell activities for misconduct",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Some events may be open to students from other institutions.
                Specific eligibility requirements will be stated on individual
                event pages.
              </p>
            </SectionBlock>

            <SectionBlock id="user-accounts" title="User Accounts" index={2}>
              <p>
                When you create an account on our platform, you are responsible
                for:
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Account Security
                  </h4>
                  <p className="text-sm text-gray-400">
                    Maintaining the confidentiality of your account credentials
                    and restricting access to your account. You are responsible
                    for all activities that occur under your account.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Accurate Information
                  </h4>
                  <p className="text-sm text-gray-400">
                    Providing and maintaining accurate, current, and complete
                    information. Accounts with false or misleading information
                    may be suspended or terminated.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Account Termination
                  </h4>
                  <p className="text-sm text-gray-400">
                    We reserve the right to suspend or terminate accounts that
                    violate these Terms, our Code of Conduct, or for any reason
                    at our sole discretion with or without notice.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              id="event-participation"
              title="Event Participation"
              index={3}
            >
              <p>
                By registering for and participating in E-Cell events, you agree
                to the following:
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Registration
                  </h4>
                  <p className="text-sm text-gray-400">
                    Event registration is on a first-come, first-served basis
                    unless otherwise specified. Registrations are
                    non-transferable. You must register using your own identity
                    and credentials.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">Conduct</h4>
                  <p className="text-sm text-gray-400">
                    All participants must adhere to our Code of Conduct during
                    events. Disruptive, disrespectful, or inappropriate behavior
                    may result in immediate removal from the event and potential
                    ban from future events.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Photography & Recording
                  </h4>
                  <p className="text-sm text-gray-400">
                    Events may be photographed and recorded for promotional and
                    documentation purposes. By attending, you consent to the use
                    of your image in E-Cell marketing materials, social media,
                    and website.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Cancellations
                  </h4>
                  <p className="text-sm text-gray-400">
                    E-Cell reserves the right to cancel, reschedule, or modify
                    events at any time. Registered participants will be notified
                    via email or phone of any changes. If an event has a
                    registration fee, refund policies will be communicated on
                    the event page.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              id="intellectual-property"
              title="Intellectual Property"
              index={4}
            >
              <p>
                All content on this website, including but not limited to text,
                graphics, logos, images, audio clips, video clips, data
                compilations, and software, is the property of E-Cell IPS
                Academy or its content suppliers and is protected by Indian and
                international copyright laws.
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    E-Cell Content
                  </h4>
                  <p className="text-sm text-gray-400">
                    You may not reproduce, distribute, modify, create derivative
                    works of, publicly display, or use any content from our
                    website without prior written permission from E-Cell IPS
                    Academy.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    User Submissions
                  </h4>
                  <p className="text-sm text-gray-400">
                    Content you submit (e.g., project submissions, blog posts,
                    event entries) remains your intellectual property. However,
                    by submitting content, you grant E-Cell a non-exclusive,
                    worldwide, royalty-free license to use, display, and
                    distribute such content for promotional and educational
                    purposes.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="text-white font-semibold mb-2">
                    Competition Entries
                  </h4>
                  <p className="text-sm text-gray-400">
                    Startup ideas and projects submitted during competitions
                    remain the property of the participants. E-Cell does not
                    claim ownership of any intellectual property created during
                    events. Specific IP terms for individual events will be
                    communicated in event rules.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              id="liability"
              title="Limitation of Liability"
              index={5}
            >
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-200/80">
                    Please read this section carefully as it limits E-Cell IPS
                    Academy's liability to you.
                  </p>
                </div>
              </div>
              <p>
                To the maximum extent permitted by applicable law, E-Cell IPS
                Academy and its members, advisors, and affiliated institutions
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to
                your use of our services.
              </p>
              <p>
                Our website and services are provided "as is" and "as available"
                without warranties of any kind, either express or implied. We do
                not guarantee that the website will be uninterrupted, secure, or
                error-free.
              </p>
              <p>
                E-Cell is a student organization operating within IPS Academy
                and does not provide professional business, legal, financial, or
                investment advice. Any information provided through our events,
                mentorship programs, or resources is for educational purposes
                only.
              </p>
            </SectionBlock>

            <SectionBlock
              id="modifications"
              title="Modifications to Terms"
              index={6}
            >
              <p>
                E-Cell IPS Academy reserves the right to modify, update, or
                replace these Terms at any time at our sole discretion. Changes
                will be effective immediately upon posting to the website.
              </p>
              <p>
                We will make reasonable efforts to notify users of significant
                changes through email or a prominent notice on the website.
                However, it is your responsibility to review these Terms
                periodically.
              </p>
              <p>
                Your continued use of our services after any modifications to
                these Terms constitutes your acceptance of the revised Terms.
              </p>
            </SectionBlock>

            <SectionBlock id="governing-law" title="Governing Law" index={7}>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to its conflict of law
                provisions.
              </p>
              <p>
                Any disputes arising under or in connection with these Terms
                shall be subject to the exclusive jurisdiction of the courts
                located in Indore, Madhya Pradesh, India.
              </p>
              <div className="mt-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-white font-semibold mb-3">
                  Dispute Resolution
                </h4>
                <p className="text-sm text-gray-400">
                  Before pursuing formal legal action, both parties agree to
                  attempt to resolve any dispute through good-faith negotiation.
                  If the dispute cannot be resolved informally within 30 days,
                  either party may pursue formal remedies as permitted by law.
                </p>
              </div>
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-white font-semibold mb-3">Contact</h4>
                <p className="text-sm text-gray-400">
                  For questions about these Terms of Service, please contact us
                  at{" "}
                  <a
                    href="mailto:ecell@ipsacademy.org"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    ecell@ipsacademy.org
                  </a>
                </p>
              </div>
            </SectionBlock>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
