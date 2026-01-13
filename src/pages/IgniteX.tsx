import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Hash,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  FileText,
  Rocket,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

interface FormData {
  name: string;
  enrollmentNo: string;
  branch: string;
  year: string;
  contactNo: string;
  email: string;
  domain: string;
  experience: string;
  hasStartup: boolean;
  startupTurnover: string;
}

const HiringPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    enrollmentNo: "",
    branch: "",
    year: "",
    contactNo: "",
    email: "",
    domain: "",
    experience: "",
    hasStartup: false,
    startupTurnover: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const domains = [
    "Public Relation (PR)",
    "Marketing",
    "Social Media Management",
    "Graphics & Video Editing",
    "Web Development",
    "Promotions",
    "Event Management",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const branches = [
    "Computer Science & Engineering",
    "Computer Science & Engineering (IOT)",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Data Science",
    "Civil Engineering",
    "Chemical Engineering",
    "Artificial Intelligence & Machine Learning",
    "Fire Tech & Safety Engineering",
    "Mechanical Engineering",
    "Computer Science & Engineering (CS)",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firebase
      await addDoc(collection(db, "hiring-applications"), {
        ...formData,
        status: "pending",
        submittedAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      const timer = setTimeout(() => setShowConfetti(true), 1000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    color: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
      Math.floor(Math.random() * 5)
    ],
  }));

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        {/* Animated Confetti */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: particle.color,
                    left: `${particle.x}%`,
                    top: "-10px",
                  }}
                  initial={{ y: -10, opacity: 1, rotate: 0 }}
                  animate={{
                    y: "100vh",
                    opacity: 0,
                    rotate: 360,
                    x: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Back to Home Link */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl text-center"
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 200,
              }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                className="absolute inset-0 border-4 border-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Title Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl font-bold text-white mb-4"
            >
              <motion.span
                animate={{ color: ["#ffffff", "#10b981", "#ffffff"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Application Submitted!
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-400 text-lg mb-8"
            >
              Thank you for applying to E-Cell IPSA. Your application has been
              received and our team will review it shortly.
            </motion.p>

            {/* Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Status</span>
                </div>
                <p className="text-white font-bold">RECEIVED</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Review</span>
                </div>
                <p className="text-white font-bold">PENDING</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              onClick={() => {
                setIsSubmitted(false);
                setShowConfetti(false);
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              Edit Application
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 py-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Main Content - Horizontal Layout */}
      <div className="relative z-10 container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side - Header Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 lg:sticky lg:top-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin text-white leading-tight mb-4">
                E-Cell IPS ACADEMY
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
                  We're Hiring
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-md">
                Join our passionate team and be part of the entrepreneurial
                revolution
              </p>
            </motion.div>

            {/* Domains Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Open Positions
              </h3>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <span
                    key={domain}
                    className="px-3 py-1 bg-white/10 text-sm text-gray-300 rounded-full border border-white/10"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { number: "50+", label: "Members" },
                { number: "10+", label: "Events" },
                { number: "7", label: "Domains" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <h4 className="text-xl font-bold text-white">
                    {stat.number}
                  </h4>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-3/5 w-full"
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name & Enrollment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <User className="w-4 h-4 text-purple-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Hash className="w-4 h-4 text-blue-400" />
                      Enrollment No.
                    </label>
                    <input
                      type="text"
                      name="enrollmentNo"
                      value={formData.enrollmentNo}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 0201CS221XXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                </motion.div>

                {/* Row 2: Branch & Year */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <GraduationCap className="w-4 h-4 text-green-400" />
                      Branch
                    </label>
                    <div className="relative">
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 appearance-none"
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      Year
                    </label>
                    <div className="relative">
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 appearance-none"
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>

                {/* Row 3: Contact & Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Phone className="w-4 h-4 text-pink-400" />
                      Contact No.
                    </label>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      required
                      placeholder="9876543210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    />
                  </div>
                </motion.div>

                {/* Domain */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Briefcase className="w-4 h-4 text-orange-400" />
                    Domain
                  </label>
                  <div className="relative">
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 appearance-none"
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Experience / Skills
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Tell us about your experience, skills, and why you want to join E-Cell IPSA..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 resize-vertical"
                  />
                </motion.div>

                {/* Startup Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          Have a Startup?
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Share your entrepreneurial journey
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer group hover:bg-white/10 transition-all duration-300">
                    <div className="relative w-12 h-6 bg-white/10 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500 transition-all duration-300">
                      <input
                        type="checkbox"
                        name="hasStartup"
                        checked={formData.hasStartup}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-6" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white text-sm font-medium transition-colors">
                      Yes, I have a startup
                    </span>
                  </label>

                  <AnimatePresence>
                    {formData.hasStartup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-2"
                      >
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          Annual Turnover
                        </label>
                        <input
                          type="text"
                          name="startupTurnover"
                          value={formData.startupTurnover}
                          onChange={handleInputChange}
                          placeholder="e.g., ₹5 Lakhs"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Application...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HiringPage;
