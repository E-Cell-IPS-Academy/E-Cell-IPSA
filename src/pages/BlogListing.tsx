import React, { useState, useRef, useEffect } from "react";
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

// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust path as needed

// Types
interface Author {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[];
  author: Author;
  publishedDate?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  isFeature: boolean;
  viewCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

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

// Blog service
class PublicBlogService {
  private collection = "blogs";

  async getPublishedBlogs(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];
    } catch (error) {
      console.error("Error fetching published blogs:", error);

      // Fallback: try without orderBy
      try {
        const simpleQuery = query(
          collection(db, this.collection),
          where("status", "==", "published")
        );
        const fallbackSnapshot = await getDocs(simpleQuery);
        const blogs = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];

        // Sort in memory
        return blogs.sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() || 0;
          const dateB = b.createdAt?.toDate().getTime() || 0;
          return dateB - dateA;
        });
      } catch (fallbackError) {
        console.error("Fallback query failed:", fallbackError);
        throw new Error("Failed to fetch blog posts");
      }
    }
  }

  async getFeaturedBlogs(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where("status", "==", "published"),
        where("isFeature", "==", true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
      return [];
    }
  }

  async incrementViewCount(blogId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collection, blogId), {
        viewCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  generateCategories(blogs: BlogPost[]): BlogCategory[] {
    const categoryMap = new Map<string, number>();

    blogs.forEach((blog) => {
      categoryMap.set(blog.category, (categoryMap.get(blog.category) || 0) + 1);
    });

    const categories: BlogCategory[] = [
      {
        id: "all",
        name: "All",
        slug: "all",
        description: "All blog posts",
        count: blogs.length,
      },
    ];

    categoryMap.forEach((count, categoryName) => {
      categories.push({
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
        description: `${categoryName} related posts`,
        count,
      });
    });

    return categories;
  }

  getAllTags(blogs: BlogPost[]): string[] {
    const tagSet = new Set<string>();
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }
}

const blogService = new PublicBlogService();

const BlogListing: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilter>({
    category: "All",
    tag: "",
    search: "",
    sortBy: "latest",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await blogService.getPublishedBlogs();
      setBlogs(blogData);

      // Generate categories from actual blog data
      const categoryData = blogService.generateCategories(blogData);
      setCategories(categoryData);
    } catch (err) {
      setError("Failed to load blog posts. Please try again later.");
      console.error("Error loading blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const featuredPosts = blogs.filter((post) => post.isFeature);

  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      filters.category === "All" || post.category === filters.category;
    const matchesSearch =
      post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.author.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesTag =
      !filters.tag ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(filters.tag.toLowerCase())
      );

    return matchesCategory && matchesSearch && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (filters.sortBy) {
      case "popular":
        return b.viewCount - a.viewCount;
      case "oldest":
        const dateA = a.publishedDate
          ? new Date(a.publishedDate).getTime()
          : a.createdAt
          ? a.createdAt.toDate().getTime()
          : 0;
        const dateB = b.publishedDate
          ? new Date(b.publishedDate).getTime()
          : b.createdAt
          ? b.createdAt.toDate().getTime()
          : 0;
        return dateA - dateB;
      case "latest":
      default:
        const latestA = a.publishedDate
          ? new Date(a.publishedDate).getTime()
          : a.createdAt
          ? a.createdAt.toDate().getTime()
          : 0;
        const latestB = b.publishedDate
          ? new Date(b.publishedDate).getTime()
          : b.createdAt
          ? b.createdAt.toDate().getTime()
          : 0;
        return latestB - latestA;
    }
  });

  const handleBlogClick = async (blogId: string) => {
    // Increment view count when blog is clicked
    await blogService.incrementViewCount(blogId);
  };

  const formatDate = (dateString?: string, timestamp?: Timestamp) => {
    if (dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else if (timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Unknown date";
  };

  const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({
    post,
    featured = false,
  }) => (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={`group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="block"
        onClick={() => handleBlogClick(post.id!)}
      >
        {/* Featured Image */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <div className="text-center p-6">
                <BookOpen className="w-12 h-12 text-white/50 mx-auto mb-2" />
                <p className="text-white/70 text-sm line-clamp-2">
                  {post.title}
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-medium">
            {post.category}
          </div>

          {/* Featured Badge */}
          {post.isFeature && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs text-white font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedDate, post.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime || 5} min read
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount.toLocaleString()}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {post.author.bio || "Contributing Author"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">
                  {Math.floor(post.viewCount * 0.1)}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-full hover:bg-purple-500/20 hover:text-purple-300 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setFilters((prev) => ({ ...prev, tag }));
                  }}
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-xs text-gray-400 rounded-full">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );

  const clearFilters = () => {
    setFilters({
      category: "All",
      tag: "",
      search: "",
      sortBy: "latest",
    });
  };

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
            E-Cell IPS ACADEMY
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, stories, and knowledge from the entrepreneurial ecosystem
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
          </div>

          {/* Filter Toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            category: category.name,
                          }))
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.category === category.name
                            ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tag..."
                    value={filters.tag}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, tag: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {filters.tag && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, tag: "" }))
                        }
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Clear tag filter
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Blog Content */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Error Loading Blogs
              </h3>
              <p className="text-gray-400 text-center mb-6">{error}</p>
              <button
                onClick={loadBlogs}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    Featured Posts
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.slice(0, 2).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 30 }
                        }
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <BlogCard post={post} featured />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  All Posts ({sortedPosts.length})
                </h2>
                {sortedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 30 }
                        }
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <BlogCard post={post} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* No Results */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {blogs.length === 0
                        ? "No blog posts have been published yet."
                        : "Try adjusting your search criteria"}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Stats */}
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
                    .reduce((sum, blog) => sum + blog.viewCount, 0)
                    .toLocaleString(),
                  label: "Total Views",
                },
                { number: featuredPosts.length, label: "Featured" },
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

export default BlogListing;
