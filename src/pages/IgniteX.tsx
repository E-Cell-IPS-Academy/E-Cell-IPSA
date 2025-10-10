import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Building2,
  Hash,
  CheckCircle,
  AlertCircle,
  Users,
  Code,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

interface FormData {
  studentName: string;
  initials: string;
  year: string;
  branch: string;
  enrollmentNumber: string;
  computerCode: string;
  phoneNumber: string;
  email: string;
  gender: string;
  collegeName: string;
}

interface FormErrors {
  studentName?: string;
  initials?: string;
  year?: string;
  branch?: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  collegeName?: string;
}

const IgniteXRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    initials: "",
    year: "",
    branch: "",
    enrollmentNumber: "",
    computerCode: "",
    phoneNumber: "",
    email: "",
    gender: "",
    collegeName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const years = ["I", "II", "III", "IV"];
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
  const genders = ["Male", "Female", "Other", "Prefer not to say"];
  const colleges = [
    "IPS Academy Institute of Engineering and Science, Indore",
    "IPS Academy Institute of Engineering and Science, Indore (Off-Campus 1)",
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    } else if (formData.studentName.trim().length < 3) {
      newErrors.studentName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.studentName)) {
      newErrors.studentName = "Name should only contain letters";
    }

    if (!formData.initials.trim()) {
      newErrors.initials = "Initials are required";
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.initials)) {
      newErrors.initials = "Initials should only contain letters and dots";
    }

    if (!formData.year) {
      newErrors.year = "Please select your year";
    }

    if (!formData.branch) {
      newErrors.branch = "Please select your branch";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Invalid phone number (10 digits, starts with 6-9)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.collegeName) {
      newErrors.collegeName = "Please select your college";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add to Firebase Firestore
      const docRef = await addDoc(collection(db, "ignitex-registrations"), {
        ...formData,
        registrationDate: serverTimestamp(),
        status: "registered",
      });

      console.log("Document written with ID:", docRef.id);
      console.log("Registration submitted:", formData);

      setSubmitStatus("success");

      // Reset form
      setFormData({
        studentName: "",
        initials: "",
        year: "",
        branch: "",
        enrollmentNumber: "",
        computerCode: "",
        phoneNumber: "",
        email: "",
        gender: "",
        collegeName: "",
      });
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error submitting registration:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-white mb-4">
            IgniteX{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              2.0
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Student Registration
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4"></div>
        </motion.div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-500/20 border border-green-500 rounded-xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-400 font-semibold">
                Registration Successful!
              </p>
              <p className="text-green-300 text-sm">
                You have been registered for IgniteX 2.0
              </p>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/20 border border-red-500 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold">Registration Failed</p>
              <p className="text-red-300 text-sm">Please try again later</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 lg:p-12"
        >
          <div className="space-y-6">
            {/* Student Name and Initials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Student Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.studentName ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.studentName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.studentName}
                  </motion.p>
                )}
              </motion.div>

              {/* Initials */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initials *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.initials ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Mr./Ms."
                  />
                </div>
                {errors.initials && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.initials}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Year and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.year ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-gray-900">
                      Select Year
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-gray-900">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.year && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.year}
                  </motion.p>
                )}
              </motion.div>

              {/* Branch */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.branch ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-gray-900">
                      Select Branch
                    </option>
                    {branches.map((branch) => (
                      <option
                        key={branch}
                        value={branch}
                        className="bg-gray-900"
                      >
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.branch && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.branch}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Enrollment Number and Computer Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrollment Number */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enrollment Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Optional"
                  />
                </div>
              </motion.div>

              {/* Computer Code */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Computer Code
                </label>
                <div className="relative">
                  <Code className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="computerCode"
                    value={formData.computerCode}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Optional"
                  />
                </div>
              </motion.div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.phoneNumber ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="10-digit mobile number"
                  />
                </div>
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.email ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Gender and College */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.gender ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-gray-900">
                      Select Gender
                    </option>
                    {genders.map((gender) => (
                      <option
                        key={gender}
                        value={gender}
                        className="bg-gray-900"
                      >
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.gender && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.gender}
                  </motion.p>
                )}
              </motion.div>

              {/* College Name */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  College Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.collegeName ? "border-red-500" : "border-white/20"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-gray-900">
                      Select College
                    </option>
                    {colleges.map((college) => (
                      <option
                        key={college}
                        value={college}
                        className="bg-gray-900"
                      >
                        {college}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.collegeName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    {errors.collegeName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30"
              } text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : (
                "Register for IgniteX 2.0"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8 text-gray-400 text-sm"
        >
          <p>All fields marked with * are required</p>
        </motion.div>
      </div>
    </div>
  );
};

export default IgniteXRegistration;
