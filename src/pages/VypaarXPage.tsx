import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Users,
  Building,
  ArrowLeft,
  MapPin,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

interface FormData {
  startupName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  cityCollege: string;
  teamSize: string;
  teamMembers: string;
  category: string;
  customCategory: string;
  description: string;
  previousCompetition: string;
  wantGuidance: string;
}

const StartupRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    startupName: "",
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    cityCollege: "",
    teamSize: "",
    teamMembers: "",
    category: "",
    customCategory: "",
    description: "",
    previousCompetition: "",
    wantGuidance: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const categories = [
    "Fintech",
    "EdTech",
    "HealthTech",
    "AgriTech",
    "Social Impact",
    "SaaS / Tech",
    "Others",
  ];

  const teamSizes = ["1", "2-3", "4-5", "6-8", "9+"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.startupName.trim())
        newErrors.startupName = "Startup name is required";
      if (!formData.leaderName.trim())
        newErrors.leaderName = "Team leader name is required";
      if (!formData.leaderEmail.trim())
        newErrors.leaderEmail = "Email is required";
      if (!formData.leaderPhone.trim())
        newErrors.leaderPhone = "Phone number is required";
    }

    if (step === 2) {
      if (!formData.cityCollege.trim())
        newErrors.cityCollege = "City & College is required";
      if (!formData.teamSize) newErrors.teamSize = "Team size is required";
      if (!formData.teamMembers.trim())
        newErrors.teamMembers = "Team members list is required";
    }

    if (step === 3) {
      if (!formData.category) newErrors.category = "Category is required";
      if (formData.category === "Others" && !formData.customCategory.trim()) {
        newErrors.customCategory = "Please specify your category";
      }
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (formData.description.split(" ").length > 200) {
        newErrors.description = "Description must be under 200 words";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validateStep(3) ||
      !formData.previousCompetition ||
      !formData.wantGuidance
    ) {
      if (!formData.previousCompetition)
        setErrors((prev) => ({
          ...prev,
          previousCompetition: "Please select an option",
        }));
      if (!formData.wantGuidance)
        setErrors((prev) => ({
          ...prev,
          wantGuidance: "Please select an option",
        }));
      return;
    }

    setIsLoading(true);

    try {
      // Save to Firebase Firestore
      const registrationData = {
        ...formData,
        registrationDate: serverTimestamp(),
        status: "pending",
      };

      await addDoc(collection(db, "startup-registrations"), registrationData);

      alert("Registration successful! We'll contact you soon.");

      // Reset form
      setFormData({
        startupName: "",
        leaderName: "",
        leaderEmail: "",
        leaderPhone: "",
        cityCollege: "",
        teamSize: "",
        teamMembers: "",
        category: "",
        customCategory: "",
        description: "",
        previousCompetition: "",
        wantGuidance: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

      {/* Startup Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Startup / Team Name *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="startupName"
            value={formData.startupName}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.startupName ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="Enter your startup name"
          />
        </div>
        {errors.startupName && (
          <p className="text-red-400 text-sm mt-1">{errors.startupName}</p>
        )}
      </div>

      {/* Team Leader Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Leader's Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="leaderName"
            value={formData.leaderName}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.leaderName ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="Enter team leader's full name"
          />
        </div>
        {errors.leaderName && (
          <p className="text-red-400 text-sm mt-1">{errors.leaderName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Leader's Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="leaderEmail"
            value={formData.leaderEmail}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.leaderEmail ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="Enter email address"
          />
        </div>
        {errors.leaderEmail && (
          <p className="text-red-400 text-sm mt-1">{errors.leaderEmail}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Leader's Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="leaderPhone"
            value={formData.leaderPhone}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.leaderPhone ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="Enter phone number"
          />
        </div>
        {errors.leaderPhone && (
          <p className="text-red-400 text-sm mt-1">{errors.leaderPhone}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Team Information</h2>

      {/* City & College */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          City & College Name *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="cityCollege"
            value={formData.cityCollege}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.cityCollege ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="e.g., Mumbai, IIT Bombay"
          />
        </div>
        {errors.cityCollege && (
          <p className="text-red-400 text-sm mt-1">{errors.cityCollege}</p>
        )}
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Number of Team Members *
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="teamSize"
            value={formData.teamSize}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.teamSize ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
          >
            <option value="" className="bg-gray-800">
              Select team size
            </option>
            {teamSizes.map((size) => (
              <option key={size} value={size} className="bg-gray-800">
                {size}
              </option>
            ))}
          </select>
        </div>
        {errors.teamSize && (
          <p className="text-red-400 text-sm mt-1">{errors.teamSize}</p>
        )}
      </div>

      {/* Team Members */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Names of All Team Members *
        </label>
        <textarea
          name="teamMembers"
          value={formData.teamMembers}
          onChange={handleInputChange}
          rows={4}
          className={`w-full bg-white/5 border ${
            errors.teamMembers ? "border-red-500" : "border-white/10"
          } rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none`}
          placeholder="List all team member names (one per line)"
        />
        {errors.teamMembers && (
          <p className="text-red-400 text-sm mt-1">{errors.teamMembers}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Startup Details</h2>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Startup Category *
        </label>
        <div className="relative">
          <Lightbulb className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.category ? "border-red-500" : "border-white/10"
            } rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
          >
            <option value="" className="bg-gray-800">
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p className="text-red-400 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Custom Category */}
      {formData.category === "Others" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Specify Your Startup Category *
          </label>
          <input
            type="text"
            name="customCategory"
            value={formData.customCategory}
            onChange={handleInputChange}
            className={`w-full bg-white/5 border ${
              errors.customCategory ? "border-red-500" : "border-white/10"
            } rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
            placeholder="Enter your startup category"
          />
          {errors.customCategory && (
            <p className="text-red-400 text-sm mt-1">{errors.customCategory}</p>
          )}
        </motion.div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Brief Description of Your Startup Idea (Max 200 words) *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          className={`w-full bg-white/5 border ${
            errors.description ? "border-red-500" : "border-white/10"
          } rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none`}
          placeholder="Describe your startup idea, problem it solves, and target audience..."
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description}</p>
          )}
          <p className="text-gray-400 text-sm ml-auto">
            {
              formData.description.split(" ").filter((word) => word.length > 0)
                .length
            }
            /200 words
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Additional Information
      </h2>

      {/* Previous Competition */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Have you participated in any pitch competition before? *
        </label>
        <div className="space-y-3">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="previousCompetition"
                value={option}
                checked={formData.previousCompetition === option}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500/20"
              />
              <span className="ml-3 text-white">{option}</span>
            </label>
          ))}
        </div>
        {errors.previousCompetition && (
          <p className="text-red-400 text-sm mt-1">
            {errors.previousCompetition}
          </p>
        )}
      </div>

      {/* Guidance */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Do you want pitch preparation guidance from mentors? *
        </label>
        <div className="space-y-3">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="wantGuidance"
                value={option}
                checked={formData.wantGuidance === option}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500/20"
              />
              <span className="ml-3 text-white">{option}</span>
            </label>
          ))}
        </div>
        {errors.wantGuidance && (
          <p className="text-red-400 text-sm mt-1">{errors.wantGuidance}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl" />
      </div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Startup Registration
            </h1>
            <p className="text-gray-400">Join the E-Cell pitch competition</p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Basic Info</span>
              <span>Team Info</span>
              <span>Startup Details</span>
              <span>Final</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StartupRegistration;
