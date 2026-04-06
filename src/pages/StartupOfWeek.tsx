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
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ─── Google Fonts ─────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — page h1, section headings, startup name
// LABEL   → "DM Mono"           — badges (industry, stage), meta info, stat labels, filter labels
// BODY    → "Outfit" 300        — descriptions, founder names, body text, buttons
function useFonts() {
  useEffect(() => {
    if (document.getElementById("startup-fonts")) return;
    const link = document.createElement("link");
    link.id = "startup-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&family=Cormorant+Garamond:wght@300&display=swap";
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
  number: "'Cormorant Garamond', Georgia, serif",
};

// Types — unchanged
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

class StartupService {
  private collection = "startups";
  async getFeaturedStartup(): Promise<Startup | null> {
    try {
      const snap = await getDocs(
        query(
          collection(db, this.collection),
          where("status", "==", "featured"),
          where("isActive", "==", true),
        ),
      );
      if (snap.empty) return null;
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Startup[];
      return (
        list.sort(
          (a, b) =>
            (b.createdAt?.toDate().getTime() || 0) -
            (a.createdAt?.toDate().getTime() || 0),
        )[0] || null
      );
    } catch {
      try {
        const snap = await getDocs(
          query(
            collection(db, this.collection),
            where("status", "==", "featured"),
          ),
        );
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Startup)
          .filter((s) => s.isActive);
        return (
          list.sort(
            (a, b) =>
              (b.createdAt?.toDate().getTime() || 0) -
              (a.createdAt?.toDate().getTime() || 0),
          )[0] || null
        );
      } catch {
        throw new Error("Failed to fetch featured startup");
      }
    }
  }
  async getAllStartups(): Promise<Startup[]> {
    try {
      const snap = await getDocs(
        query(collection(db, this.collection), where("isActive", "==", true)),
      );
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Startup[];
      return list.sort(
        (a, b) =>
          (b.createdAt?.toDate().getTime() || 0) -
          (a.createdAt?.toDate().getTime() || 0),
      );
    } catch {
      const snap = await getDocs(collection(db, this.collection));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Startup[];
    }
  }
  async getPastStartups(): Promise<Startup[]> {
    try {
      const all = await this.getAllStartups();
      return all.filter((s) => s.status === "past");
    } catch {
      return [];
    }
  }
}

const startupService = new StartupService();

const StartupOfWeek: React.FC = () => {
  useFonts();
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
  const [showFilters, setShowFilters] = useState(false);
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
    } catch {
      setError("Failed to load startups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStartups = pastStartups.filter((s) => {
    return (
      (filters.industry === "All" || s.industry === filters.industry) &&
      (filters.stage === "All" || s.fundingStage === filters.stage) &&
      (filters.year === "All" || s.foundedYear.toString() === filters.year) &&
      (s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.shortDescription
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        s.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

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
    const d = dateString ? new Date(dateString) : timestamp?.toDate();
    return d
      ? d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Recently";
  };

  const GlassCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }> = ({ children, className = "", hover = true }) => (
    <div
      className={`relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${hover ? "hover:bg-white/8 hover:border-white/15 transition-all duration-300" : ""} ${className}`}
      style={{
        background:
          "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
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
        if (startup.website) window.open(startup.website, "_blank");
      }}
    >
      <GlassCard className={`overflow-hidden ${small ? "h-full" : ""}`}>
        <div className={`relative overflow-hidden ${small ? "h-32" : "h-48"}`}>
          {startup.coverImage ? (
            <img
              src={startup.coverImage}
              alt={startup.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-white/3 flex items-center justify-center">
              <Building
                className={`${small ? "w-8 h-8" : "w-12 h-12"} text-white/25 mx-auto`}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          {/* Industry badge — DM Mono */}
          <div
            className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
            style={{
              fontFamily: F.mono,
              fontSize: "8px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {startup.industry}
          </div>
          {/* Past badge — neutral */}
          <div
            className="absolute top-3 right-3 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full flex items-center gap-1"
            style={{
              fontFamily: F.mono,
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.60)",
            }}
          >
            <Star className="w-2.5 h-2.5" /> Past
          </div>
        </div>

        <div className={small ? "p-4" : "p-6"}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Name — Instrument Serif */}
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: small ? "0.95rem" : "1.05rem",
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: "0.15rem",
                }}
                className="group-hover:opacity-70 transition-opacity"
              >
                {startup.name}
              </h3>
              {/* Industry — DM Mono */}
              <p
                style={{
                  fontFamily: F.mono,
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.30)",
                }}
              >
                {startup.industry}
              </p>
            </div>
          </div>

          {/* Description — Outfit 300 */}
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: small ? "0.75rem" : "0.82rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.40)",
              marginBottom: "0.75rem",
            }}
            className={small ? "line-clamp-2" : "line-clamp-3"}
          >
            {startup.shortDescription}
          </p>

          {!small && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Funding Stage", value: startup.fundingStage },
                { label: "Team Size", value: startup.employeeCount || "N/A" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.80)",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {value}
                  </div>
                  <p
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Meta — DM Mono */}
          <div
            className="flex items-center gap-4 mb-4"
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {startup.foundedYear}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {startup.location}
            </span>
          </div>

          {/* Founders */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {startup.founders.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className={`${small ? "w-6 h-6" : "w-8 h-8"} bg-white/10 rounded-full flex items-center justify-center border-2 border-black`}
                >
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.60)",
                    }}
                  >
                    {f.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: small ? "0.72rem" : "0.78rem",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {startup.founders[0]?.name}
                {startup.founders.length > 1
                  ? ` +${startup.founders.length - 1}`
                  : ""}
              </p>
              <p
                style={{
                  fontFamily: F.mono,
                  fontSize: "8px",
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                {startup.founders[0]?.position}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3"
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              {startup.fundingAmount && startup.fundingAmount > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />$
                  {startup.fundingAmount.toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {startup.employeeCount || "N/A"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  // Loading & error states
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader className="w-7 h-7 text-white/30 mx-auto" />
          </motion.div>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Loading startups…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500/60 mx-auto mb-4" />
          <h3
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.80)",
              marginBottom: "0.4rem",
            }}
          >
            Error Loading Startups
          </h3>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={loadStartups}
            style={{ fontFamily: F.body, fontWeight: 300, fontSize: "0.82rem" }}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // Shared select style
  const selectStyle: React.CSSProperties = {
    fontFamily: F.body,
    fontWeight: 300,
    fontSize: "0.78rem",
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              marginBottom: "0.75rem",
            }}
          >
            E-Cell IPS Academy
          </p>
          <h1
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem,6vw,3.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: "rgba(255,255,255,0.88)",
              marginBottom: "0.75rem",
            }}
          >
            Startup <span style={{ fontStyle: "normal" }}>of the Week</span>
          </h1>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "clamp(0.78rem,1.3vw,0.9rem)",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.75,
              maxWidth: "44ch",
              margin: "0 auto",
            }}
          >
            Celebrating innovative startups from our entrepreneurial ecosystem
          </p>
        </motion.div>

        {/* Featured Startup */}
        {featuredStartup ? (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              {/* Section heading — Instrument Serif */}
              <h2
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1.3rem",
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.80)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              >
                <Star className="w-5 h-5 text-amber-400 fill-current" />{" "}
                Featured Startup
              </h2>
              <p
                style={{
                  fontFamily: F.mono,
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {formatDate(
                  featuredStartup.featuredDate,
                  featuredStartup.createdAt,
                )}
              </p>
            </div>

            <GlassCard className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left */}
                <div className="p-6">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    {featuredStartup.coverImage ? (
                      <img
                        src={featuredStartup.coverImage}
                        alt={featuredStartup.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/3 flex items-center justify-center">
                        <div className="text-center p-8">
                          <Rocket className="w-14 h-14 text-white/20 mx-auto mb-3" />
                          <h3
                            style={{
                              fontFamily: F.display,
                              fontWeight: 400,
                              fontSize: "1.1rem",
                              color: "rgba(255,255,255,0.70)",
                              marginBottom: "0.3rem",
                            }}
                          >
                            {featuredStartup.name}
                          </h3>
                          <p
                            style={{
                              fontFamily: F.body,
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              color: "rgba(255,255,255,0.38)",
                            }}
                          >
                            {featuredStartup.shortDescription}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Badges — DM Mono */}
                    <div
                      className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full"
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.70)",
                      }}
                    >
                      {featuredStartup.industry}
                    </div>
                    <div
                      className="absolute top-4 right-4 px-2.5 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full flex items-center gap-1"
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.1em",
                        color: "white",
                      }}
                    >
                      <Star className="w-2.5 h-2.5" /> Featured
                    </div>
                  </div>

                  {/* Metrics — Instrument Serif numbers */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Funding Stage",
                        value: featuredStartup.fundingStage,
                      },
                      {
                        label: "Team Size",
                        value: featuredStartup.employeeCount || "N/A",
                      },
                    ].map(({ label, value }) => (
                      <GlassCard
                        key={label}
                        className="p-4 text-center"
                        hover={false}
                      >
                        <div
                          style={{
                            fontFamily: F.display,
                            fontWeight: 400,
                            fontSize: "1.1rem",
                            color: "rgba(255,255,255,0.80)",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {value}
                        </div>
                        <p
                          style={{
                            fontFamily: F.mono,
                            fontSize: "8px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.28)",
                          }}
                        >
                          {label}
                        </p>
                      </GlassCard>
                    ))}
                    {featuredStartup.fundingAmount &&
                      featuredStartup.fundingAmount > 0 && (
                        <GlassCard
                          className="p-4 text-center col-span-2"
                          hover={false}
                        >
                          <div
                            style={{
                              fontFamily: F.display,
                              fontWeight: 400,
                              fontSize: "1.1rem",
                              color: "rgba(255,255,255,0.80)",
                              marginBottom: "0.2rem",
                            }}
                          >
                            ${featuredStartup.fundingAmount.toLocaleString()}
                          </div>
                          <p
                            style={{
                              fontFamily: F.mono,
                              fontSize: "8px",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.28)",
                            }}
                          >
                            Funding Raised
                          </p>
                        </GlassCard>
                      )}
                  </div>
                </div>

                {/* Right */}
                <div className="p-6">
                  <div className="mb-6">
                    {/* Startup name — Instrument Serif */}
                    <h3
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "clamp(1.4rem,3vw,2rem)",
                        letterSpacing: "-0.02em",
                        color: "rgba(255,255,255,0.88)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {featuredStartup.name}
                    </h3>
                    {/* Short desc — Outfit 300 */}
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.50)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {featuredStartup.shortDescription}
                    </p>
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.82rem",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.38)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {featuredStartup.description}
                    </p>
                  </div>

                  {/* Founders */}
                  <div className="mb-5">
                    <p
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.28)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Founders
                    </p>
                    <div className="space-y-3">
                      {featuredStartup.founders.map((founder, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/8 rounded-full flex items-center justify-center flex-shrink-0">
                            <span
                              style={{
                                fontFamily: F.mono,
                                fontSize: "9px",
                                color: "rgba(255,255,255,0.55)",
                              }}
                            >
                              {founder.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p
                              style={{
                                fontFamily: F.body,
                                fontWeight: 400,
                                fontSize: "0.82rem",
                                color: "rgba(255,255,255,0.75)",
                              }}
                            >
                              {founder.name}
                            </p>
                            <p
                              style={{
                                fontFamily: F.mono,
                                fontSize: "8px",
                                letterSpacing: "0.06em",
                                color: "rgba(255,255,255,0.28)",
                              }}
                            >
                              {founder.position}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company info — DM Mono labels, Outfit values */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {[
                      { label: "Founded", value: featuredStartup.foundedYear },
                      { label: "Location", value: featuredStartup.location },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p
                          style={{
                            fontFamily: F.mono,
                            fontSize: "8px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.25)",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            fontFamily: F.body,
                            fontWeight: 300,
                            fontSize: "0.82rem",
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions — Outfit 300 */}
                  <div className="flex items-center gap-3">
                    {featuredStartup.website && (
                      <a
                        href={featuredStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: F.body,
                          fontWeight: 300,
                          fontSize: "0.78rem",
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" /> Visit Website
                      </a>
                    )}
                    <div className="flex items-center gap-2">
                      {featuredStartup.socialLinks?.linkedin && (
                        <a
                          href={featuredStartup.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/8 hover:bg-white/15 rounded-full transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-white/50" />
                        </a>
                      )}
                      {featuredStartup.socialLinks?.twitter && (
                        <a
                          href={featuredStartup.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/8 hover:bg-white/15 rounded-full transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-white/50" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center"
          >
            <GlassCard className="p-12">
              <Rocket className="w-14 h-14 text-white/15 mx-auto mb-4" />
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: "0.4rem",
                }}
              >
                No Featured Startup This Week
              </h3>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.30)",
                }}
              >
                Check back soon for our next featured startup!
              </p>
            </GlassCard>
          </motion.section>
        )}

        {/* Achievements / Problem / Solution */}
        {featuredStartup && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStartup.achievements?.length > 0 && (
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-emerald-400/70" />
                    <h3
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.78)",
                      }}
                    >
                      Achievements
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {featuredStartup.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-white/30 rounded-full mt-2.5 flex-shrink-0" />
                        <span
                          style={{
                            fontFamily: F.body,
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.42)",
                          }}
                        >
                          {a}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
              {[
                {
                  icon: Target,
                  label: "Problem Solved",
                  color: "text-blue-400/60",
                  text: featuredStartup.problem,
                },
                {
                  icon: Lightbulb,
                  label: "Solution",
                  color: "text-amber-400/60",
                  text: featuredStartup.solution,
                },
              ].map(({ icon: Icon, label, color, text }) => (
                <GlassCard key={label} className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <h3
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.78)",
                      }}
                    >
                      {label}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.40)",
                    }}
                  >
                    {text}
                  </p>
                </GlassCard>
              ))}
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
            <h2
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "1.2rem",
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Previous Featured Startups
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-full transition-colors text-white/45"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GlassCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                    <input
                      type="text"
                      placeholder="Search startups…"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      style={selectStyle}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/8 border border-white/10 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-white/20"
                    />
                  </div>
                  {[
                    { key: "industry", values: industries },
                    { key: "stage", values: stages },
                    { key: "year", values: years },
                  ].map(({ key, values }) => (
                    <select
                      key={key}
                      value={filters[key as keyof StartupFilter]}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.value })
                      }
                      style={selectStyle}
                      className="px-4 py-2.5 bg-white/8 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                    >
                      {values.map((v) => (
                        <option key={v} value={v} className="bg-gray-900">
                          {v}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
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
                    style={{
                      fontFamily: F.mono,
                      fontSize: "8px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.30)",
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {filteredStartups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStartups.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <StartupCard startup={s} small />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="w-14 h-14 text-white/10 mx-auto mb-4" />
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.70)",
                  marginBottom: "0.3rem",
                }}
              >
                No startups found
              </h3>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.30)",
                }}
              >
                {pastStartups.length === 0
                  ? "No past startups have been featured yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <GlassCard className="p-12">
            <div className="max-w-3xl mx-auto">
              <h2
                style={{
                  fontFamily: F.display,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1.4rem,3vw,2rem)",
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: "0.75rem",
                }}
              >
                Want to Be Featured?
              </h2>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "clamp(0.78rem,1.2vw,0.875rem)",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.38)",
                  maxWidth: "46ch",
                  margin: "0 auto 2rem",
                }}
              >
                Submit your startup to be considered for our weekly spotlight
                and reach thousands of entrepreneurs, investors, and innovators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/submit-startup"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.82rem",
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                >
                  <Rocket className="w-4 h-4" /> Submit Your Startup
                </a>
                <a
                  href="/nomination"
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.82rem",
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 hover:bg-white/14 text-white rounded-full transition-colors border border-white/10"
                >
                  <Star className="w-4 h-4" /> Nominate a Startup
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Stats */}
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
                { number: industries.length - 1, label: "Industries" },
                {
                  number: pastStartups
                    .reduce((s, st) => s + (st.employeeCount || 0), 0)
                    .toLocaleString(),
                  label: "Total Employees",
                },
                {
                  number: `$${pastStartups.reduce((s, st) => s + (st.fundingAmount || 0), 0).toLocaleString()}`,
                  label: "Total Funding",
                },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <h3
                    style={{
                      fontFamily: F.number,
                      fontWeight: 300,
                      fontSize: "clamp(1.8rem,4vw,2.5rem)",
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1,
                      marginBottom: "0.35rem",
                    }}
                  >
                    {stat.number}
                  </h3>
                  <p
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {stat.label}
                  </p>
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
