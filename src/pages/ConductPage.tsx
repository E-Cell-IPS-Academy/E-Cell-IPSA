import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  MessageSquareWarning,
  Ban,
  ShieldAlert,
  Handshake,
  ChevronRight,
  ArrowLeft,
  Mail,
  Flag,
  Sparkles,
  CheckCircle2,
  XCircle,
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

const values = [
  {
    icon: Heart,
    title: "Respect",
    desc: "Treat every member with dignity regardless of background, skill level, gender, ethnicity, or personal beliefs.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    desc: "Foster teamwork and open dialogue. Uplift others and share knowledge freely within the community.",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    desc: "Embrace creative thinking and constructive experimentation. Failure is a step toward discovery.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Inclusivity",
    desc: "Create a welcoming environment where everyone feels safe to participate, contribute, and grow.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const expectedBehavior = [
  "Use welcoming and inclusive language in all communications, online and offline.",
  "Be respectful of differing viewpoints; engage in healthy debate, not personal attacks.",
  "Gracefully accept constructive criticism and offer feedback with empathy.",
  "Focus on what is best for the community and collective growth of all members.",
  "Give proper credit for ideas, code, and contributions from others.",
  "Maintain professionalism during events, workshops, pitch sessions, and competitions.",
];

const prohibitedBehavior = [
  "Harassment, intimidation, bullying, or stalking of any community member.",
  "Discriminatory language or actions based on gender, race, religion, disability, or appearance.",
  "Sharing others' private information without explicit consent.",
  "Plagiarism of code, business plans, or intellectual property in competitions or programs.",
  "Disrupting events or meetings through repeated interruptions or hostile behavior.",
  "Any form of academic dishonesty, fraud, or misrepresentation in applications.",
];

const reportingSteps = [
  { step: "Document", desc: "Record the incident with details and save any screenshots or evidence.", icon: MessageSquareWarning },
  { step: "Report", desc: "Email ecell@ipsacademy.org or speak privately to any core team member.", icon: Flag },
  { step: "Review", desc: "The conduct committee will review the report confidentially within 5 business days.", icon: ShieldAlert },
  { step: "Resolution", desc: "Appropriate action will be taken and the reporter informed of the outcome.", icon: CheckCircle2 },
];

const consequences = [
  { level: "First Offense", action: "Private verbal or written warning with a clear explanation of the violation.", color: "text-yellow-400", border: "border-yellow-500/20" },
  { level: "Second Offense", action: "Temporary suspension from E-Cell events and programs for a determined period.", color: "text-orange-400", border: "border-orange-500/20" },
  { level: "Severe Violation", action: "Immediate removal from all E-Cell activities and revocation of membership privileges.", color: "text-red-400", border: "border-red-500/20" },
];

const ConductPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px]"
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-5%", left: "-8%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[110px]"
          animate={{ x: [0, -40, 30, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "5%", right: "-5%" }}
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
          <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-400">Code of Conduct</span>
          </motion.nav>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }} className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Heart className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Building Together</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl font-black text-white mb-6">
            Code of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Conduct</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-gray-400 max-w-2xl mx-auto">
            E-Cell IPS Academy is committed to providing a welcoming, inclusive, and harassment-free environment for everyone in our community.
          </motion.p>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Our Core{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Values</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-12 max-w-lg mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            The principles that guide every interaction in our community
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 h-full text-center group hover:border-purple-500/30 transition-all duration-500">
                  <motion.div
                    className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${v.gradient} rounded-2xl flex items-center justify-center`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <v.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expected & Prohibited Behavior */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expected */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Expected Behavior</h2>
              </div>
              <ul className="space-y-4">
                {expectedBehavior.map((item, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Prohibited */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Prohibited Behavior</h2>
              </div>
              <ul className="space-y-4">
                {prohibitedBehavior.map((item, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                  >
                    <Ban className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Reporting Process */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Reporting{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Process</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-12 max-w-lg mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            If you experience or witness a violation, here is how to report it
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {reportingSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <GlassCard className="p-6 text-center relative group hover:border-purple-500/40 transition-all duration-500 h-full">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
                    {i + 1}
                  </div>
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-500/20"
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                  >
                    <s.icon className="w-7 h-7 text-purple-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.step}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                  {i < 3 && <ChevronRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500/50" />}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consequences */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-black text-center text-white mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Enforcement{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Actions</span>
          </motion.h2>
          <motion.p className="text-gray-400 text-center mb-12 max-w-lg mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Violations are addressed proportionally to ensure fairness
          </motion.p>
          <div className="space-y-4">
            {consequences.map((c, i) => (
              <motion.div key={c.level} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <GlassCard className={`p-6 border ${c.border} hover:border-purple-500/30 transition-all duration-500`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className={`text-sm font-bold ${c.color} px-3 py-1 bg-white/5 rounded-full whitespace-nowrap self-start`}>{c.level}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{c.action}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <GlassCard className="p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5" />
              <div className="relative z-10">
                <Heart className="w-12 h-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">Need to Report Something?</h2>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto">All reports are handled confidentially. We take every concern seriously.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:ecell@ipsacademy.org" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25">
                    <Mail className="w-5 h-5" /> Report via Email
                  </a>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">Contact Page</Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ConductPage;
