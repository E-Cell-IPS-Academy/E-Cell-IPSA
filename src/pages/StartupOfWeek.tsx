// Create /src/pages/StartupOfWeek.tsx
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
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
} from "lucide-react";
import { Link } from "react-router-dom";

// Types
interface Founder {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  linkedIn?: string;
  twitter?: string;
}

interface KeyMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  description?: string;
}

interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  logo?: string;
  coverImage?: string;
  website: string;
  industry: string;
  stage: string;
  foundedYear: number;
  location: string;
  teamSize: string;
  funding: string;
  valuation?: string;
  founders: Founder[];
  keyMetrics: KeyMetric[];
  achievements: string[];
  challengesSolved: string[];
  futureGoals: string[];
  socialLinks: SocialLinks;
  weekFeatured: string;
  weekNumber: number;
  year: number;
  featured: boolean;
}

interface StartupFilter {
  industry: string;
  stage: string;
  year: string;
  search: string;
}

const StartupOfWeek: React.FC = () => {
  const [filters, setFilters] = useState<StartupFilter>({
    industry: "All",
    stage: "All",
    year: "All",
    search: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mock startup data
  const startups: Startup[] = [
    {
      id: "1",
      name: "GreenTech Solutions",
      tagline: "Sustainable Technology for Tomorrow",
      description:
        "Revolutionary solar panel technology that increases efficiency by 40% while reducing costs.",
      fullDescription:
        "GreenTech Solutions is pioneering the next generation of solar energy technology. Our breakthrough photovoltaic cells use innovative materials to achieve unprecedented efficiency rates while maintaining cost-effectiveness. Founded by IPS Academy alumni, the company has already secured partnerships with major energy providers and is scaling rapidly across India.",
      logo: "/images/startups/greentech-logo.png",
      coverImage: "/images/startups/greentech-cover.jpg",
      website: "https://greentechsolutions.com",
      industry: "CleanTech",
      stage: "Series A",
      foundedYear: 2023,
      location: "Indore, India",
      teamSize: "25-50",
      funding: "$2.5M",
      valuation: "$15M",
      founders: [
        {
          name: "Priya Sharma",
          role: "CEO & Co-founder",
          bio: "Former Tesla engineer with 8 years in renewable energy",
          avatar: "/images/founders/priya-sharma.jpg",
          linkedIn: "https://linkedin.com/in/priya-sharma",
          twitter: "https://twitter.com/priya_greentech",
        },
        {
          name: "Rahul Patel",
          role: "CTO & Co-founder",
          bio: "PhD in Materials Science from IIT Bombay",
          avatar: "/images/founders/rahul-patel.jpg",
          linkedIn: "https://linkedin.com/in/rahul-patel-cto",
        },
      ],
      keyMetrics: [
        {
          label: "Energy Efficiency",
          value: "94%",
          trend: "up",
          description: "40% above industry standard",
        },
        {
          label: "Cost Reduction",
          value: "35%",
          trend: "up",
          description: "Compared to traditional panels",
        },
        {
          label: "Installations",
          value: "500+",
          trend: "up",
          description: "Across 5 states",
        },
        {
          label: "Revenue Growth",
          value: "300%",
          trend: "up",
          description: "Year over year",
        },
      ],
      achievements: [
        "Winner of IPS Academy Innovation Challenge 2023",
        "Featured in Forbes 30 Under 30 - Energy",
        "Partnership with Tata Power announced",
        "Patent approved for breakthrough cell technology",
      ],
      challengesSolved: [
        "High cost of solar installations",
        "Low efficiency in cloudy conditions",
        "Complex maintenance requirements",
        "Limited financing options for consumers",
      ],
      futureGoals: [
        "Expand to 10 states by end of 2025",
        "Launch residential solar subscription model",
        "Develop energy storage solutions",
        "International expansion to Southeast Asia",
      ],
      socialLinks: {
        website: "https://greentechsolutions.com",
        linkedin: "https://linkedin.com/company/greentech-solutions",
        twitter: "https://twitter.com/greentechsol",
        instagram: "https://instagram.com/greentechsolutions",
      },
      weekFeatured: "2024-12-16",
      weekNumber: 51,
      year: 2024,
      featured: true,
    },
    {
      id: "2",
      name: "HealthAI",
      tagline: "AI-Powered Healthcare Diagnostics",
      description:
        "Making medical diagnosis accessible through smartphone-based AI analysis.",
      fullDescription:
        "HealthAI leverages artificial intelligence to democratize healthcare diagnostics. Using advanced computer vision and machine learning, patients can get preliminary medical assessments through their smartphones.",
      logo: "/images/startups/healthai-logo.png",
      coverImage: "/images/startups/healthai-cover.jpg",
      website: "https://healthai.in",
      industry: "HealthTech",
      stage: "Seed",
      foundedYear: 2023,
      location: "Mumbai, India",
      teamSize: "15-25",
      funding: "$1.2M",
      founders: [
        {
          name: "Dr. Anita Desai",
          role: "CEO & Founder",
          bio: "Former radiologist with AI research background",
          avatar: "/images/founders/anita-desai.jpg",
        },
      ],
      keyMetrics: [
        { label: "Accuracy Rate", value: "92%", trend: "up" },
        { label: "Users", value: "50K+", trend: "up" },
        { label: "Diagnoses", value: "100K+", trend: "up" },
        { label: "Partner Clinics", value: "200+", trend: "up" },
      ],
      achievements: [
        "FDA-equivalent approval in India",
        "Partnership with Apollo Hospitals",
        "Featured in TechCrunch",
      ],
      challengesSolved: [
        "Limited access to specialists",
        "High diagnostic costs",
        "Long waiting times",
      ],
      futureGoals: [
        "Expand to rural areas",
        "Launch telemedicine platform",
        "International regulatory approvals",
      ],
      socialLinks: {
        website: "https://healthai.in",
        linkedin: "https://linkedin.com/company/healthai",
      },
      weekFeatured: "2024-12-09",
      weekNumber: 50,
      year: 2024,
      featured: false,
    },
    {
      id: "3",
      name: "EduNext",
      tagline: "Personalized Learning for Every Student",
      description:
        "AI-driven educational platform that adapts to individual learning styles and pace.",
      fullDescription:
        "EduNext is transforming education through personalized AI tutoring that adapts to each student's unique learning style, pace, and preferences.",
      logo: "/images/startups/edunext-logo.png",
      coverImage: "/images/startups/edunext-cover.jpg",
      website: "https://edunext.edu",
      industry: "EdTech",
      stage: "Series A",
      foundedYear: 2022,
      location: "Bangalore, India",
      teamSize: "50-100",
      funding: "$5M",
      valuation: "$25M",
      founders: [
        {
          name: "Vikram Singh",
          role: "CEO & Co-founder",
          bio: "Former Google product manager",
          avatar: "/images/founders/vikram-singh.jpg",
        },
      ],
      keyMetrics: [
        { label: "Students", value: "1M+", trend: "up" },
        { label: "Improvement Rate", value: "85%", trend: "up" },
        { label: "Retention", value: "78%", trend: "up" },
        { label: "Partner Schools", value: "500+", trend: "up" },
      ],
      achievements: [
        "Raised Series A from Sequoia",
        "Partnership with CBSE",
        "Used in 500+ schools",
      ],
      challengesSolved: [
        "One-size-fits-all education",
        "Teacher shortage",
        "Learning outcome tracking",
      ],
      futureGoals: [
        "Reach 5M students by 2025",
        "Launch in Africa",
        "Develop VR learning modules",
      ],
      socialLinks: {
        website: "https://edunext.edu",
      },
      weekFeatured: "2024-12-02",
      weekNumber: 49,
      year: 2024,
      featured: false,
    },
  ];

  const currentWeekStartup = startups.find((s) => s.featured) || startups[0];
  const previousStartups = startups.filter((s) => !s.featured);

  const filteredStartups = previousStartups.filter((startup) => {
    const matchesIndustry =
      filters.industry === "All" || startup.industry === filters.industry;
    const matchesStage =
      filters.stage === "All" || startup.stage === filters.stage;
    const matchesYear =
      filters.year === "All" || startup.year.toString() === filters.year;
    const matchesSearch =
      startup.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      startup.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesIndustry && matchesStage && matchesYear && matchesSearch;
  });

  const industries = [
    "All",
    ...Array.from(new Set(startups.map((s) => s.industry))),
  ];
  const stages = ["All", ...Array.from(new Set(startups.map((s) => s.stage)))];
  const years = [
    "All",
    ...Array.from(new Set(startups.map((s) => s.year.toString()))),
  ];

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
    >
      <GlassCard className={`overflow-hidden ${small ? "h-full" : ""}`}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden ${small ? "h-32" : "h-48"}`}>
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
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Industry Badge */}
          <div
            className={`absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full ${
              small ? "text-xs" : "text-sm"
            } text-white font-medium`}
          >
            {startup.industry}
          </div>

          {/* Week Badge */}
          <div
            className={`absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 backdrop-blur-sm rounded-full ${
              small ? "text-xs" : "text-sm"
            } text-white font-medium`}
          >
            Week {startup.weekNumber}
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
                {startup.tagline}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-gray-300 mb-4 ${
              small ? "text-sm line-clamp-2" : "line-clamp-3"
            }`}
          >
            {startup.description}
          </p>

          {/* Key Metrics */}
          {!small && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {startup.keyMetrics.slice(0, 2).map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-lg font-bold text-white">
                      {metric.value}
                    </span>
                    {metric.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                </div>
              ))}
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
              {new Date(startup.weekFeatured).toLocaleDateString()}
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
                {startup.founders[0]?.role}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1 text-gray-400 ${
                  small ? "text-xs" : "text-sm"
                }`}
              >
                <DollarSign className="w-3 h-3" />
                {startup.funding}
              </div>
              <div
                className={`flex items-center gap-1 text-gray-400 ${
                  small ? "text-xs" : "text-sm"
                }`}
              >
                <Users className="w-3 h-3" />
                {startup.teamSize}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

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
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              This Week's Featured Startup
            </h2>
            <p className="text-gray-400">
              Week {currentWeekStartup.weekNumber}, {currentWeekStartup.year}
            </p>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Image & Basic Info */}
              <div>
                {/* Cover Image */}
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Rocket className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {currentWeekStartup.name}
                      </h3>
                      <p className="text-gray-300">
                        {currentWeekStartup.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-sm text-white font-medium">
                    {currentWeekStartup.industry}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm text-white font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentWeekStartup.keyMetrics.map((metric, index) => (
                    <GlassCard
                      key={index}
                      className="p-4 text-center"
                      hover={false}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-white">
                          {metric.value}
                        </span>
                        {metric.trend === "up" && (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-300 font-medium">
                        {metric.label}
                      </p>
                      {metric.description && (
                        <p className="text-xs text-gray-400 mt-1">
                          {metric.description}
                        </p>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Right - Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {currentWeekStartup.name}
                  </h3>
                  <p className="text-xl text-purple-300 font-medium mb-4">
                    {currentWeekStartup.tagline}
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {currentWeekStartup.fullDescription}
                  </p>
                </div>

                {/* Founders */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Founders
                  </h4>
                  <div className="space-y-3">
                    {currentWeekStartup.founders.map((founder, index) => (
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
                            {founder.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Stage</p>
                    <p className="text-white font-medium">
                      {currentWeekStartup.stage}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Founded</p>
                    <p className="text-white font-medium">
                      {currentWeekStartup.foundedYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Funding</p>
                    <p className="text-white font-medium">
                      {currentWeekStartup.funding}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Team Size</p>
                    <p className="text-white font-medium">
                      {currentWeekStartup.teamSize}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <a
                    href={currentWeekStartup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                  <div className="flex items-center gap-2">
                    {currentWeekStartup.socialLinks.linkedin && (
                      <a
                        href={currentWeekStartup.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {currentWeekStartup.socialLinks.twitter && (
                      <a
                        href={currentWeekStartup.socialLinks.twitter}
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

        {/* Achievements, Challenges, Goals */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Achievements */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Achievements</h3>
              </div>
              <ul className="space-y-3">
                {currentWeekStartup.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{achievement}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Challenges Solved */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">
                  Problems Solved
                </h3>
              </div>
              <ul className="space-y-3">
                {currentWeekStartup.challengesSolved.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Future Goals */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Future Goals</h3>
              </div>
              <ul className="space-y-3">
                {currentWeekStartup.futureGoals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </motion.section>

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
              </GlassCard>
            </motion.div>
          )}

          {/* Startup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => (
              <Link
                key={startup.id}
                to={`/startup/${startup.id}`}
                className="block"
              >
                <StartupCard startup={startup} small />
              </Link>
            ))}
          </div>

          {filteredStartups.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No startups found
              </h3>
              <p className="text-gray-400">
                Try adjusting your filters to see more results.
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
                <Link
                  to="/submit-startup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                >
                  <Rocket className="w-5 h-5" />
                  Submit Your Startup
                </Link>
                <Link
                  to="/nomination"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors border border-white/20"
                >
                  <Star className="w-5 h-5" />
                  Nominate a Startup
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
};

export default StartupOfWeek;
