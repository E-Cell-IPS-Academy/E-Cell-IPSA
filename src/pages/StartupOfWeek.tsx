import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Award,
  Target,
  Lightbulb,
  Linkedin,
  Twitter,
  Globe,
  ChevronRight,
  Filter,
  Search,
  Building,
  Rocket,
  Loader,
  AlertCircle,
} from "lucide-react";

// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust path as needed

// Types
interface Founder {
  name: string;
  position: string;
  bio: string;
  linkedin?: string;
  image?: string;
}

interface Startup {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  logo?: string;
  logoPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  industry: string;
  foundedYear: number;
  location: string;
  website?: string;
  status: "featured" | "upcoming" | "past";
  fundingStage: string;
  fundingAmount?: number;
  employeeCount?: number;
  founders: Founder[];
  achievements: string[];
  problem: string;
  solution: string;
  businessModel: string;
  targetMarket: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  featuredDate?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface StartupFilter {
  industry: string;
  stage: string;
  year: string;
  search: string;
}

// Startup service
class StartupService {
  private collection = "startups";

  async getFeaturedStartup(): Promise<Startup | null> {
    try {
      // First try the simple query without orderBy to avoid compound index
      const q = query(
        collection(db, this.collection),
        where("status", "==", "featured"),
        where("isActive", "==", true)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      // Get all featured startups and sort in memory
      const featuredStartups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Startup[];

      // Sort by createdAt (newest first) in memory
      featuredStartups.sort((a, b) => {
        const dateA = a.createdAt?.toDate().getTime() || 0;
        const dateB = b.createdAt?.toDate().getTime() || 0;
        return dateB - dateA;
      });

      return featuredStartups[0] || null;
    } catch (error) {
      console.error("Error fetching featured startup:", error);

      // Fallback: try even simpler query
      try {
        const simpleQuery = query(
          collection(db, this.collection),
          where("status", "==", "featured")
        );
        const fallbackSnapshot = await getDocs(simpleQuery);

        if (fallbackSnapshot.empty) {
          return null;
        }

        const featuredStartups = fallbackSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Startup))
          .filter((startup) => startup.isActive);

        // Sort in memory and return the most recent
        featuredStartups.sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() || 0;
          const dateB = b.createdAt?.toDate().getTime() || 0;
          return dateB - dateA;
        });

        return featuredStartups[0] || null;
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw new Error("Failed to fetch featured startup");
      }
    }
  }

  async getAllStartups(): Promise<Startup[]> {
    try {
      // Try simple query first
      const q = query(
        collection(db, this.collection),
        where("isActive", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const startups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Startup[];

      // Sort in memory by createdAt (newest first)
      return startups.sort((a, b) => {
        const dateA = a.createdAt?.toDate().getTime() || 0;
        const dateB = b.createdAt?.toDate().getTime() || 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error fetching startups:", error);

      // Ultimate fallback: get all startups and filter/sort in memory
      try {
        const querySnapshot = await getDocs(collection(db, this.collection));
        const allStartups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Startup[];

        // Filter active startups and sort in memory
        return allStartups
          .filter((startup) => startup.isActive)
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate().getTime() || 0;
            const dateB = b.createdAt?.toDate().getTime() || 0;
            return dateB - dateA;
          });
      } catch (fallbackError) {
        console.error("Ultimate fallback failed:", fallbackError);
        throw new Error("Failed to fetch startups");
      }
    }
  }

  async getPastStartups(): Promise<Startup[]> {
    try {
      const allStartups = await this.getAllStartups();
      return allStartups.filter((startup) => startup.status === "past");
    } catch (error) {
      console.error("Error fetching past startups:", error);
      return [];
    }
  }
}

const startupService = new StartupService();

const StartupOfWeek: React.FC = () => {
  const [featuredStartup, setFeaturedStartup] = useState<Startup | null>(null);
  const [pastStartups, setPastStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StartupFilter>({
    industry: "All",
    stage: "All",
    year: "All",
    search: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      const [featured, past] = await Promise.all([
        startupService.getFeaturedStartup(),
        startupService.getPastStartups(),
      ]);

      setFeaturedStartup(featured);
      setPastStartups(past);
    } catch (err) {
      setError("Failed to load startups. Please try again later.");
      console.error("Error loading startups:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStartups = pastStartups.filter((startup) => {
    const matchesIndustry =
      filters.industry === "All" || startup.industry === filters.industry;
    const matchesStage =
      filters.stage === "All" || startup.fundingStage === filters.stage;
    const matchesYear =
      filters.year === "All" || startup.foundedYear.toString() === filters.year;
    const matchesSearch =
      startup.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      startup.shortDescription
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      startup.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesIndustry && matchesStage && matchesYear && matchesSearch;
  });

  // Generate filter options from actual data
  const industries = [
    "All",
    ...Array.from(new Set(pastStartups.map((s) => s.industry))),
  ];
  const stages = [
    "All",
    ...Array.from(new Set(pastStartups.map((s) => s.fundingStage))),
  ];
  const years = [
    "All",
    ...Array.from(new Set(pastStartups.map((s) => s.foundedYear.toString()))),
  ].sort((a, b) => b.localeCompare(a));

  const formatDate = (dateString?: string, timestamp?: Timestamp) => {
    if (dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Recently";
  };

  // Glassmorphism card component
  const GlassCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }> = ({ children, className = "", hover = true }) => (
    <div
      className={`
        relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl
        ${
          hover
            ? "hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            : ""
        }
        ${className}
      `}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      {children}
    </div>
  );

  const StartupCard: React.FC<{ startup: Startup; small?: boolean }> = ({
    startup,
    small = false,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer"
      onClick={() => {
        if (startup.website) {
          window.open(startup.website, "_blank");
        }
      }}
    >
      <GlassCard className={`overflow-hidden ${small ? "h-full" : ""}`}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${small ? "h-32" : "h-48"}`}>
          {startup.coverImage ? (
            <img
              src={startup.coverImage}
              alt={startup.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <div className="text-center p-4">
                <Building
                  className={`${
                    small ? "w-8 h-8" : "w-12 h-12"
                  } text-white/50 mx-auto mb-2`}
                />
                <p className={`text-white/70 ${small ? "text-xs" : "text-sm"}`}>
                  {startup.name}
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Industry Badge */}
          <div
            className={`absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full ${
              small ? "text-xs" : "text-sm"
            } text-white font-medium`}
          >
            {startup.industry}
          </div>

          {/* Status Badge */}
          <div
            className={`absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500/80 to-blue-500/80 backdrop-blur-sm rounded-full ${
              small ? "text-xs" : "text-sm"
            } text-white font-medium flex items-center gap-1`}
          >
            <Star className="w-3 h-3" />
            Past
          </div>
        </div>

        {/* Content */}
        <div className={`${small ? "p-4" : "p-6"}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3
                className={`${
                  small ? "text-lg" : "text-xl"
                } font-bold text-white mb-1 group-hover:text-purple-300 transition-colors`}
              >
                {startup.name}
              </h3>
              <p
                className={`${
                  small ? "text-sm" : "text-base"
                } text-purple-300 font-medium`}
              >
                {startup.industry}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-gray-300 mb-4 ${
              small ? "text-sm line-clamp-2" : "line-clamp-3"
            }`}
          >
            {startup.shortDescription}
          </p>

          {/* Key Metrics */}
          {!small && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg font-bold text-white">
                    {startup.fundingStage}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Funding Stage</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg font-bold text-white">
                    {startup.employeeCount || "N/A"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Team Size</p>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div
            className={`flex items-center gap-4 text-gray-400 mb-4 ${
              small ? "text-xs" : "text-sm"
            }`}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {startup.foundedYear}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {startup.location}
            </div>
          </div>

          {/* Founders */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {startup.founders.slice(0, 3).map((founder, index) => (
                <div
                  key={index}
                  className={`${
                    small ? "w-6 h-6" : "w-8 h-8"
                  } bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-gray-900`}
                >
                  <span
                    className={`${
                      small ? "text-xs" : "text-sm"
                    } text-white font-semibold`}
                  >
                    {founder.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p
                className={`${
                  small ? "text-xs" : "text-sm"
                } text-white font-medium`}
              >
                {startup.founders[0]?.name}
                {startup.founders.length > 1 &&
                  ` +${startup.founders.length - 1}`}
              </p>
              <p className={`${small ? "text-xs" : "text-sm"} text-gray-400`}>
                {startup.founders[0]?.position}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {startup.fundingAmount && startup.fundingAmount > 0 && (
                <div
                  className={`flex items-center gap-1 text-gray-400 ${
                    small ? "text-xs" : "text-sm"
                  }`}
                >
                  <DollarSign className="w-3 h-3" />$
                  {startup.fundingAmount.toLocaleString()}
                </div>
              )}
              <div
                className={`flex items-center gap-1 text-gray-400 ${
                  small ? "text-xs" : "text-sm"
                }`}
              >
                <Users className="w-3 h-3" />
                {startup.employeeCount || "N/A"}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader className="w-8 h-8 text-purple-500 mx-auto" />
          </motion.div>
          <p className="text-gray-400">Loading startups...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Error Loading Startups
          </h3>
          <p className="text-gray-400 text-center mb-6">{error}</p>
          <button
            onClick={loadStartups}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight mb-4">
            Startup
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              of the Week
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Celebrating innovative startups from our entrepreneurial ecosystem
          </p>
        </motion.div>

        {/* Current Week Startup - Large Feature */}
        {featuredStartup ? (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-purple-400 fill-current" />
                Featured Startup
              </h2>
              <p className="text-gray-400">
                {formatDate(
                  featuredStartup.featuredDate,
                  featuredStartup.createdAt
                )}
              </p>
            </div>

            <GlassCard className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left - Image & Basic Info */}
                <div className="p-6">
                  {/* Cover Image */}
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    {featuredStartup.coverImage ? (
                      <img
                        src={featuredStartup.coverImage}
                        alt={featuredStartup.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <div className="text-center p-8">
                          <Rocket className="w-16 h-16 text-white/50 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {featuredStartup.name}
                          </h3>
                          <p className="text-gray-300">
                            {featuredStartup.shortDescription}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                      {featuredStartup.industry}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-sm text-white font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4 text-center" hover={false}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-white">
                          {featuredStartup.fundingStage}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 font-medium">
                        Funding Stage
                      </p>
                    </GlassCard>

                    <GlassCard className="p-4 text-center" hover={false}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-white">
                          {featuredStartup.employeeCount || "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 font-medium">
                        Team Size
                      </p>
                    </GlassCard>

                    {featuredStartup.fundingAmount &&
                      featuredStartup.fundingAmount > 0 && (
                        <GlassCard
                          className="p-4 text-center col-span-2"
                          hover={false}
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-white">
                              ${featuredStartup.fundingAmount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 font-medium">
                            Funding Raised
                          </p>
                        </GlassCard>
                      )}
                  </div>
                </div>

                {/* Right - Details */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {featuredStartup.name}
                    </h3>
                    <p className="text-xl text-purple-300 font-medium mb-4">
                      {featuredStartup.shortDescription}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {featuredStartup.description}
                    </p>
                  </div>

                  {/* Founders */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Founders
                    </h4>
                    <div className="space-y-3">
                      {featuredStartup.founders.map((founder, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {founder.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {founder.name}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {founder.position}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Founded</p>
                      <p className="text-white font-medium">
                        {featuredStartup.foundedYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Location</p>
                      <p className="text-white font-medium">
                        {featuredStartup.location}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    {featuredStartup.website && (
                      <a
                        href={featuredStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                    <div className="flex items-center gap-2">
                      {featuredStartup.socialLinks?.linkedin && (
                        <a
                          href={featuredStartup.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {featuredStartup.socialLinks?.twitter && (
                        <a
                          href={featuredStartup.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        ) : (
          /* No Featured Startup */
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center"
          >
            <GlassCard className="p-12">
              <Rocket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Featured Startup This Week
              </h3>
              <p className="text-gray-400">
                Check back soon for our next featured startup!
              </p>
            </GlassCard>
          </motion.section>
        )}

        {/* Achievements, Problem, Solution */}
        {featuredStartup && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Achievements */}
              {featuredStartup.achievements &&
                featuredStartup.achievements.length > 0 && (
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-xl font-bold text-white">
                        Achievements
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {featuredStartup.achievements.map(
                        (achievement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">
                              {achievement}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </GlassCard>
                )}

              {/* Problem Solved */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">
                    Problem Solved
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {featuredStartup.problem}
                </p>
              </GlassCard>

              {/* Solution */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Solution</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {featuredStartup.solution}
                </p>
              </GlassCard>
            </div>
          </motion.section>
        )}

        {/* Previous Startups */}
        <motion.section
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              Previous Featured Startups
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <Filter className="w-4 h-4 text-white" />
              <span className="text-white">Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GlassCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search startups..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  {/* Industry Filter */}
                  <select
                    value={filters.industry}
                    onChange={(e) =>
                      setFilters({ ...filters, industry: e.target.value })
                    }
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {industries.map((industry) => (
                      <option
                        key={industry}
                        value={industry}
                        className="bg-gray-800"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>

                  {/* Stage Filter */}
                  <select
                    value={filters.stage}
                    onChange={(e) =>
                      setFilters({ ...filters, stage: e.target.value })
                    }
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage} className="bg-gray-800">
                        {stage}
                      </option>
                    ))}
                  </select>

                  {/* Year Filter */}
                  <select
                    value={filters.year}
                    onChange={(e) =>
                      setFilters({ ...filters, year: e.target.value })
                    }
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-gray-800">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() =>
                      setFilters({
                        industry: "All",
                        stage: "All",
                        year: "All",
                        search: "",
                      })
                    }
                    className="px-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Startup Grid */}
          {filteredStartups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStartups.map((startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <StartupCard startup={startup} small />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No startups found
              </h3>
              <p className="text-gray-400">
                {pastStartups.length === 0
                  ? "No past startups have been featured yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <GlassCard className="p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Want to Be Featured?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Submit your startup to be considered for our weekly spotlight
                and reach thousands of entrepreneurs, investors, and innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/submit-startup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  <Rocket className="w-5 h-5" />
                  Submit Your Startup
                </a>
                <a
                  href="/nomination"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors border border-white/20"
                >
                  <Star className="w-5 h-5" />
                  Nominate a Startup
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Statistics */}
        {pastStartups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                {
                  number: (featuredStartup ? 1 : 0) + pastStartups.length,
                  label: "Startups Featured",
                },
                {
                  number: industries.length - 1,
                  label: "Industries",
                },
                {
                  number: pastStartups
                    .reduce(
                      (sum, startup) => sum + (startup.employeeCount || 0),
                      0
                    )
                    .toLocaleString(),
                  label: "Total Employees",
                },
                {
                  number: `${pastStartups
                    .reduce(
                      (sum, startup) => sum + (startup.fundingAmount || 0),
                      0
                    )
                    .toLocaleString()}`,
                  label: "Total Funding",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartupOfWeek;
