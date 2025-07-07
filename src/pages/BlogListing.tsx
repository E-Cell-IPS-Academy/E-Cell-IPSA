// Create /src/pages/BlogListing.tsx
import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost, BlogCategory, BlogFilter } from "../types/blog";

const BlogListing: React.FC = () => {
  const [filters, setFilters] = useState<BlogFilter>({
    category: "All",
    tag: "",
    search: "",
    sortBy: "latest",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mock blog data - replace with your actual blog posts
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Future of Entrepreneurship: AI and Innovation",
      slug: "future-entrepreneurship-ai-innovation",
      excerpt:
        "Exploring how artificial intelligence is reshaping the entrepreneurial landscape and creating new opportunities for startup founders.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/ai-entrepreneurship.jpg",
      author: {
        name: "Dr. Priya Sharma",
        avatar: "/images/authors/priya-sharma.jpg",
        bio: "AI Researcher and Startup Mentor",
      },
      category: "Technology",
      tags: ["AI", "Innovation", "Startups", "Future"],
      publishedAt: "2024-12-15",
      updatedAt: "2024-12-15",
      readTime: 8,
      views: 1250,
      likes: 89,
      featured: true,
    },
    {
      id: "2",
      title: "Building a Sustainable Startup: Lessons from IPS Academy",
      slug: "building-sustainable-startup-ips-academy",
      excerpt:
        "Key insights and practical strategies for creating environmentally conscious and financially sustainable businesses.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/sustainable-startup.jpg",
      author: {
        name: "Rahul Patel",
        avatar: "/images/authors/rahul-patel.jpg",
        bio: "Sustainability Expert and E-Cell Mentor",
      },
      category: "Sustainability",
      tags: ["Sustainability", "Green Business", "Environment"],
      publishedAt: "2024-12-10",
      updatedAt: "2024-12-10",
      readTime: 6,
      views: 980,
      likes: 67,
      featured: false,
    },
    {
      id: "3",
      title: "From Idea to IPO: Success Stories from E-Cell Alumni",
      slug: "idea-to-ipo-success-stories-alumni",
      excerpt:
        "Inspiring journeys of E-Cell graduates who transformed their college projects into billion-dollar companies.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/success-stories.jpg",
      author: {
        name: "Anita Desai",
        avatar: "/images/authors/anita-desai.jpg",
        bio: "E-Cell Alumni Coordinator",
      },
      category: "Success Stories",
      tags: ["Alumni", "Success", "IPO", "Journey"],
      publishedAt: "2024-12-05",
      updatedAt: "2024-12-05",
      readTime: 12,
      views: 2100,
      likes: 156,
      featured: true,
    },
    {
      id: "4",
      title: "Mastering the Art of Pitching: A Complete Guide",
      slug: "mastering-art-pitching-complete-guide",
      excerpt:
        "Everything you need to know about creating compelling pitch presentations that win investors and customers.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/pitching-guide.jpg",
      author: {
        name: "Vikram Singh",
        avatar: "/images/authors/vikram-singh.jpg",
        bio: "Investment Banker and Pitch Coach",
      },
      category: "Business Skills",
      tags: ["Pitching", "Presentation", "Investment", "Skills"],
      publishedAt: "2024-11-28",
      updatedAt: "2024-11-28",
      readTime: 10,
      views: 1680,
      likes: 124,
      featured: false,
    },
    {
      id: "5",
      title: "The Rise of Social Entrepreneurship in India",
      slug: "rise-social-entrepreneurship-india",
      excerpt:
        "How young entrepreneurs are using business as a force for good and creating positive social impact.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/social-entrepreneurship.jpg",
      author: {
        name: "Meera Joshi",
        avatar: "/images/authors/meera-joshi.jpg",
        bio: "Social Impact Researcher",
      },
      category: "Social Impact",
      tags: ["Social Impact", "India", "Change", "Society"],
      publishedAt: "2024-11-20",
      updatedAt: "2024-11-20",
      readTime: 7,
      views: 1420,
      likes: 98,
      featured: false,
    },
    {
      id: "6",
      title: "Blockchain and Cryptocurrency: The Next Frontier",
      slug: "blockchain-cryptocurrency-next-frontier",
      excerpt:
        "Understanding the potential of blockchain technology and its applications beyond cryptocurrency.",
      content: "Full blog content here...",
      featuredImage: "/images/blog/blockchain.jpg",
      author: {
        name: "Arjun Kumar",
        avatar: "/images/authors/arjun-kumar.jpg",
        bio: "Blockchain Developer and Researcher",
      },
      category: "Technology",
      tags: ["Blockchain", "Cryptocurrency", "Web3", "Innovation"],
      publishedAt: "2024-11-15",
      updatedAt: "2024-11-15",
      readTime: 9,
      views: 1890,
      likes: 134,
      featured: true,
    },
  ];

  const categories: BlogCategory[] = [
    {
      id: "all",
      name: "All",
      slug: "all",
      description: "All blog posts",
      count: blogPosts.length,
    },
    {
      id: "tech",
      name: "Technology",
      slug: "technology",
      description: "Tech and innovation",
      count: 2,
    },
    {
      id: "business",
      name: "Business Skills",
      slug: "business-skills",
      description: "Business development",
      count: 1,
    },
    {
      id: "success",
      name: "Success Stories",
      slug: "success-stories",
      description: "Inspiring journeys",
      count: 1,
    },
    {
      id: "sustainability",
      name: "Sustainability",
      slug: "sustainability",
      description: "Green business",
      count: 1,
    },
    {
      id: "social",
      name: "Social Impact",
      slug: "social-impact",
      description: "Social entrepreneurship",
      count: 1,
    },
  ];

  const featuredPosts = blogPosts.filter((post) => post.featured);
  

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      filters.category === "All" || post.category === filters.category;
    const matchesSearch =
      post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(filters.search.toLowerCase());
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
        return b.views - a.views;
      case "oldest":
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      case "latest":
      default:
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  });

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
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        <div
          className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="text-center p-6">
              <BookOpen className="w-12 h-12 text-white/50 mx-auto mb-2" />
              <p className="text-white/70 text-sm">{post.title}</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-medium">
            {post.category}
          </div>

          {/* Featured Badge */}
          {post.featured && (
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
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min read
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views.toLocaleString()}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-white mb-3 group-hover:text-purple-300 transition-colors ${
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-400">{post.author.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
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
            E-Cell
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
            </motion.div>
          )}
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
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
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* No Results */}
          {sortedPosts.length === 0 && (
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
                Try adjusting your search criteria
              </p>
              <button
                onClick={() =>
                  setFilters({
                    category: "All",
                    tag: "",
                    search: "",
                    sortBy: "latest",
                  })
                }
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { number: blogPosts.length, label: "Blog Posts" },
              { number: categories.length - 1, label: "Categories" },
              { number: "50K+", label: "Total Views" },
              { number: "1.2K", label: "Subscribers" },
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
      </div>
    </div>
  );
};

export default BlogListing;
