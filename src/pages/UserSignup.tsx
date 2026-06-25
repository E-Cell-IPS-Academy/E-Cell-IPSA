// Create /src/pages/UserSignup.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Type-only imports
import type { FormEvent, ChangeEvent } from "react";
import type { SignupCredentials } from "../types/user";

const UserSignup: React.FC = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const { signup, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const validateForm = (): string | null => {
    if (credentials.password !== credentials.confirmPassword) {
      return "Passwords do not match";
    }
    if (credentials.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!credentials.displayName.trim()) {
      return "Display name is required";
    }
    if (!acceptTerms) {
      return "Please accept the terms and conditions";
    }
    return null;
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await signup(credentials);
      alert(
        "Account created successfully! Please check your email for verification."
      );
      navigate("/login");
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; text: string; color: string } => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    const levels = [
      { text: "Very Weak", color: "text-red-500" },
      { text: "Weak", color: "text-orange-500" },
      { text: "Fair", color: "text-yellow-500" },
      { text: "Good", color: "text-green-500" },
      { text: "Strong", color: "text-green-400" },
    ];

    return { strength, ...levels[strength] };
  };

  const passwordStrength = getPasswordStrength(credentials.password);

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

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
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
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join E-Cell</h1>
            <p className="text-gray-400">Create your account to get started</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6"
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Display Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="displayName"
                  value={credentials.displayName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {credentials.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={passwordStrength.color}>
                      {passwordStrength.text}
                    </span>
                    <span className="text-gray-400">
                      {credentials.password.length}/6+ chars
                    </span>
                  </div>
                  <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength <= 1
                          ? "bg-red-500"
                          : passwordStrength.strength <= 2
                            ? "bg-orange-500"
                            : passwordStrength.strength <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                      style={{
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    credentials.confirmPassword &&
                    credentials.password !== credentials.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : credentials.confirmPassword &&
                          credentials.password === credentials.confirmPassword
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                        : "border-white/10 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {credentials.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {credentials.password === credentials.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3"
            >
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </motion.div>

            {/* Signup Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Google Signup */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSignup;
