import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  User,
  Filter,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Star,
  Loader,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Timestamp } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import { useBlogs } from "@/features/blog";
import type { BlogPost } from "@/features/blog";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("blog-fonts")) return;
    const link = document.createElement("link");
    link.id = "blog-fonts";
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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}
interface BlogFilter {
  category: string;
  tag: string;
  search: string;
  sortBy: "latest" | "popular" | "oldest";
}

function generateCategories(blogs: BlogPost[]): BlogCategory[] {
  const map = new Map<string, number>();
  blogs.forEach((b) => map.set(b.category, (map.get(b.category) || 0) + 1));
  const cats: BlogCategory[] = [
    {
      id: "all",
      name: "All",
      slug: "all",
      description: "All blog posts",
      count: blogs.length,
    },
  ];
  map.forEach((count, name) =>
    cats.push({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: `${name} posts`,
      count,
    })
  );
  return cats;
}

const BlogListing: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
  const { data: blogs, loading, error } = useBlogs();
  const categories = useMemo(() => generateCategories(blogs), [blogs]);
  const [filters, setFilters] = useState<BlogFilter>({
    category: "All",
    tag: "",
    search: "",
    sortBy: "latest",
  });
  const [showFilters, setShowFilters] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const featuredPosts = blogs.filter((p) => p.isFeature);
  const filteredPosts = blogs.filter((p) => {
    const mc = filters.category === "All" || p.category === filters.category;
    const ms =
      p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.author.name.toLowerCase().includes(filters.search.toLowerCase());
    const mt =
      !filters.tag ||
      p.tags.some((t) => t.toLowerCase().includes(filters.tag.toLowerCase()));
    return mc && ms && mt;
  });
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filters.sortBy === "popular") return b.viewCount - a.viewCount;
    const ts = (p: BlogPost) =>
      p.publishedDate
        ? new Date(p.publishedDate).getTime()
        : p.createdAt?.toDate().getTime() || 0;
    return filters.sortBy === "oldest" ? ts(a) - ts(b) : ts(b) - ts(a);
  });

  const formatDate = (dateString?: string, timestamp?: Timestamp) => {
    const d = dateString ? new Date(dateString) : timestamp?.toDate();
    return d
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date";
  };
  const clearFilters = () =>
    setFilters({ category: "All", tag: "", search: "", sortBy: "latest" });

  const inputCls = `w-full border rounded-full focus:outline-none focus:border-white/30 transition-all ${isDark ? "bg-white/8 border-white/10 text-white placeholder-white/25" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"}`;

  const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({
    post,
    featured = false,
  }) => (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={`group ${isDark ? "bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/14" : "bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300"} backdrop-blur-sm rounded-2xl border overflow-hidden transition-all duration-300 ${featured ? "lg:col-span-2" : ""}`}
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div
          className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}
        >
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div
              className={`absolute inset-0 ${isDark ? "bg-white/3" : "bg-gray-100"} flex items-center justify-center`}
            >
              <BookOpen
                className={`w-12 h-12 ${isDark ? "text-white/20" : "text-gray-300"} mx-auto`}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          <div
            className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full"
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {post.category}
          </div>
          {post.isFeature && (
            <div
              className="absolute top-4 right-4 px-3 py-1 bg-amber-500/80 rounded-full flex items-center gap-1"
              style={{ fontFamily: F.mono, fontSize: "9px", color: "white" }}
            >
              <Star className="w-2.5 h-2.5" /> Featured
            </div>
          )}
        </div>

        <div className="p-6">
          <div
            className="flex items-center gap-4 mb-3"
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)",
            }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedDate, post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime || 5} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount.toLocaleString()}
            </span>
          </div>
          <h3
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: featured ? "1.1rem" : "0.95rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
              marginBottom: "0.5rem",
            }}
            className="line-clamp-2 group-hover:opacity-70 transition-opacity"
          >
            {post.title}
          </h3>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.78rem",
              lineHeight: 1.75,
              color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)",
              marginBottom: "1rem",
            }}
            className="line-clamp-3"
          >
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-7 h-7 ${isDark ? "bg-white/10" : "bg-gray-200"} rounded-full flex items-center justify-center`}
                >
                  <User
                    className={`w-3 h-3 ${isDark ? "text-white/40" : "text-gray-400"}`}
                  />
                </div>
              )}
              <div>
                <p
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                    color: isDark
                      ? "rgba(255,255,255,0.65)"
                      : "rgba(0,0,0,0.65)",
                  }}
                >
                  {post.author.name}
                </p>
                <p
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.08em",
                    color: isDark
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(0,0,0,0.28)",
                  }}
                  className="line-clamp-1"
                >
                  {post.author.bio || "Contributing Author"}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1"
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.28)",
              }}
            >
              <Heart className="w-3 h-3" />
              {Math.floor(post.viewCount * 0.1)}
            </div>
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    setFilters((p) => ({ ...p, tag }));
                  }}
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.08em",
                    color: isDark
                      ? "rgba(255,255,255,0.38)"
                      : "rgba(0,0,0,0.40)",
                  }}
                  className={`px-2 py-1 ${isDark ? "bg-white/8" : "bg-gray-100"} rounded-full cursor-pointer hover:bg-white/14 transition-colors`}
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    color: isDark
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(0,0,0,0.28)",
                  }}
                  className={`px-2 py-1 ${isDark ? "bg-white/8" : "bg-gray-100"} rounded-full`}
                >
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"} pt-24 pb-12`}
    >
      <div className="container mx-auto px-6 lg:px-8">
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
              color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)",
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
              fontSize: "clamp(2rem,5vw,3rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
              marginBottom: "0.75rem",
            }}
          >
            Blog
          </h1>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "clamp(0.78rem,1.3vw,0.9rem)",
              color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
              lineHeight: 1.7,
              maxWidth: "46ch",
              margin: "0 auto",
            }}
          >
            Insights, stories, and knowledge from the entrepreneurial ecosystem
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-md mx-auto mb-6">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Search blog posts…"
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "0.8rem",
              }}
              className={`${inputCls} pl-11 pr-4 py-3`}
            />
          </div>
          <div className="text-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "0.78rem",
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 ${isDark ? "bg-white/8 hover:bg-white/12 border-white/10 text-white/55" : "bg-white hover:bg-gray-50 border-gray-200 text-gray-600"} border rounded-full transition-colors`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters{" "}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`${isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-gray-200"} backdrop-blur-sm rounded-xl border p-6 mb-6`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.30)"
                        : "rgba(0,0,0,0.38)",
                    }}
                    className="block mb-3"
                  >
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          setFilters((p) => ({ ...p, category: cat.name }))
                        }
                        style={{
                          fontFamily: F.body,
                          fontWeight: 300,
                          fontSize: "0.78rem",
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${filters.category === cat.name ? (isDark ? "bg-white/12 text-white border border-white/20" : "bg-black/8 text-black border border-black/15") : isDark ? "text-white/50 hover:bg-white/8" : "text-gray-500 hover:bg-gray-100"}`}
                      >
                        {cat.name} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.30)"
                        : "rgba(0,0,0,0.38)",
                    }}
                    className="block mb-3"
                  >
                    Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tag…"
                    value={filters.tag}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, tag: e.target.value }))
                    }
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                    }}
                    className={`w-full px-3 py-2 ${isDark ? "bg-white/8 border-white/10 text-white placeholder-white/25" : "bg-white border-gray-200 text-gray-900"} border rounded-lg focus:outline-none focus:border-white/25 transition-colors`}
                  />
                  {filters.tag && (
                    <button
                      onClick={() => setFilters((p) => ({ ...p, tag: "" }))}
                      style={{
                        fontFamily: F.mono,
                        fontSize: "8px",
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.35)",
                      }}
                      className="mt-2 block"
                    >
                      Clear tag
                    </button>
                  )}
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: F.mono,
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.30)"
                        : "rgba(0,0,0,0.38)",
                    }}
                    className="block mb-3"
                  >
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        sortBy: e.target.value as any,
                      }))
                    }
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                    }}
                    className={`w-full px-3 py-2 ${isDark ? "bg-white/8 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"} border rounded-lg focus:outline-none focus:border-white/25 transition-colors`}
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={clearFilters}
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isDark
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(0,0,0,0.35)",
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader
                  className={`w-7 h-7 ${isDark ? "text-white/30" : "text-gray-400"}`}
                />
              </motion.div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.38)",
                }}
              >
                Loading blog posts…
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-10 h-10 text-red-500/60 mb-4" />
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1.1rem",
                  color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)",
                  marginBottom: "0.4rem",
                }}
              >
                Error Loading Blogs
              </h3>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)",
                  marginBottom: "1.5rem",
                }}
              >
                Failed to load blog posts. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                }}
                className={`px-6 py-3 ${isDark ? "bg-white text-black" : "bg-black text-white"} rounded-lg hover:opacity-85 transition-opacity`}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2
                    className={`flex items-center gap-2 mb-6`}
                    style={{
                      fontFamily: F.display,
                      fontWeight: 400,
                      fontSize: "1.1rem",
                      letterSpacing: "-0.01em",
                      color: isDark
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(0,0,0,0.68)",
                    }}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${isDark ? "text-white/35" : "text-gray-400"}`}
                    />{" "}
                    Featured Posts
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.slice(0, 2).map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 30 }
                        }
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                      >
                        <BlogCard post={post} featured />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.1rem",
                    letterSpacing: "-0.01em",
                    marginBottom: "1.5rem",
                    color: isDark
                      ? "rgba(255,255,255,0.72)"
                      : "rgba(0,0,0,0.65)",
                  }}
                >
                  All Posts ({sortedPosts.length})
                </h2>
                {sortedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 30 }
                        }
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                      >
                        <BlogCard post={post} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <BookOpen
                      className={`w-14 h-14 ${isDark ? "text-white/12" : "text-gray-300"} mx-auto mb-4`}
                    />
                    <h3
                      style={{
                        fontFamily: F.display,
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: isDark
                          ? "rgba(255,255,255,0.72)"
                          : "rgba(0,0,0,0.65)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      No posts found
                    </h3>
                    <p
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                        color: isDark
                          ? "rgba(255,255,255,0.30)"
                          : "rgba(0,0,0,0.35)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {blogs.length === 0
                        ? "No blog posts have been published yet."
                        : "Try adjusting your search criteria"}
                    </p>
                    <button
                      onClick={clearFilters}
                      style={{
                        fontFamily: F.body,
                        fontWeight: 300,
                        fontSize: "0.78rem",
                      }}
                      className={`px-6 py-3 ${isDark ? "bg-white text-black" : "bg-black text-white"} rounded-full hover:opacity-85 transition-opacity`}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {!loading && !error && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { number: blogs.length, label: "Blog Posts" },
                { number: categories.length - 1, label: "Categories" },
                {
                  number: blogs
                    .reduce((s, b) => s + b.viewCount, 0)
                    .toLocaleString(),
                  label: "Total Views",
                },
                { number: featuredPosts.length, label: "Featured" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <h3
                    style={{
                      fontFamily: F.number,
                      fontWeight: 300,
                      fontSize: "clamp(1.8rem,4vw,2.5rem)",
                      color: isDark
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(0,0,0,0.80)",
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
                      color: isDark
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(0,0,0,0.30)",
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

export default BlogListing;
