import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  User,
  Share2,
  Bookmark,
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link2 as LinkIcon,
  Loader,
  AlertCircle,
} from "lucide-react";

// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
  Timestamp,
  limit,
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

// Blog detail service
class BlogDetailService {
  private collection = "blogs";

  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(
        collection(db, this.collection),
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as BlogPost;
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      throw new Error("Failed to fetch blog post");
    }
  }

  async getRelatedPosts(
    currentPostId: string,
    category: string,
    tags: string[]
  ): Promise<BlogPost[]> {
    try {
      // First try to get posts from the same category
      const categoryQuery = query(
        collection(db, this.collection),
        where("status", "==", "published"),
        where("category", "==", category),
        limit(6)
      );

      const categorySnapshot = await getDocs(categoryQuery);
      let relatedPosts = categorySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost))
        .filter((post) => post.id !== currentPostId);

      // If we don't have enough related posts, get any published posts
      if (relatedPosts.length < 2) {
        const generalQuery = query(
          collection(db, this.collection),
          where("status", "==", "published"),
          limit(6)
        );

        const generalSnapshot = await getDocs(generalQuery);
        const allPosts = generalSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost))
          .filter((post) => post.id !== currentPostId);

        // Combine and deduplicate
        const combinedPosts = [...relatedPosts, ...allPosts];
        const uniquePosts = Array.from(
          new Map(combinedPosts.map((post) => [post.id, post])).values()
        );

        relatedPosts = uniquePosts;
      }

      // Sort by relevance (same tags, then by view count)
      return relatedPosts
        .sort((a, b) => {
          const aTagMatches = a.tags.filter((tag) => tags.includes(tag)).length;
          const bTagMatches = b.tags.filter((tag) => tags.includes(tag)).length;

          if (aTagMatches !== bTagMatches) {
            return bTagMatches - aTagMatches;
          }

          return b.viewCount - a.viewCount;
        })
        .slice(0, 2);
    } catch (error) {
      console.error("Error fetching related posts:", error);
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

  async incrementLikes(blogId: string): Promise<void> {
    try {
      // Note: You might want to add a likes field to your blog schema
      // For now, we'll track this separately or use view count as a proxy
      console.log("Like incremented for blog:", blogId);
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  }
}

const blogDetailService = new BlogDetailService();

// Get slug from URL - you'll need to implement this based on your routing
const getBlogSlugFromURL = (): string => {
  // This is a simple implementation - adjust based on your routing solution
  const pathSegments = window.location.pathname.split("/");
  return pathSegments[pathSegments.length - 1] || "";
};

const BlogDetail: React.FC = () => {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [viewCountIncremented, setViewCountIncremented] =
    useState<boolean>(false);

  const slug = getBlogSlugFromURL();

  useEffect(() => {
    if (slug) {
      loadBlogPost(slug);
    } else {
      setError("No blog slug provided");
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // Increment view count after a short delay (to avoid bots)
    if (blogPost && !viewCountIncremented) {
      const timer = setTimeout(() => {
        blogDetailService.incrementViewCount(blogPost.id!);
        setViewCountIncremented(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [blogPost, viewCountIncremented]);

  const loadBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      const post = await blogDetailService.getBlogBySlug(postSlug);

      if (!post) {
        setError("Blog post not found");
        return;
      }

      setBlogPost(post);

      // Load related posts
      const related = await blogDetailService.getRelatedPosts(
        post.id!,
        post.category,
        post.tags
      );
      setRelatedPosts(related);

      // Update page title and meta description
      document.title = post.seoTitle || post.title;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          post.seoDescription || post.excerpt
        );
      }
    } catch (err) {
      setError("Failed to load blog post. Please try again later.");
      console.error("Error loading blog post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blogPost) return;

    setIsLiked(!isLiked);

    if (!isLiked) {
      await blogDetailService.incrementLikes(blogPost.id!);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);

    // You can implement bookmark functionality here
    // For example, save to localStorage or user's account
    if (!isBookmarked) {
      localStorage.setItem(`bookmark_${blogPost?.id}`, "true");
    } else {
      localStorage.removeItem(`bookmark_${blogPost?.id}`);
    }
  };

  const handleShare = (platform: string) => {
    if (!blogPost) return;

    const url = window.location.href;
    const title = blogPost.title;
    const text = blogPost.excerpt;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
            text
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert("Link copied to clipboard!");
          })
          .catch(() => {
            alert("Failed to copy link");
          });
        break;
    }
    setShowShareModal(false);
  };

  const formatDate = (dateString?: string, timestamp?: Timestamp) => {
    if (dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown date";
  };

  const formatShortDate = (dateString?: string, timestamp?: Timestamp) => {
    if (dateString) {
      return new Date(dateString).toLocaleDateString();
    } else if (timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return "Unknown date";
  };

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
          <p className="text-gray-400">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || "Post Not Found"}
          </h1>
          <p className="text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/blog"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </a>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
              {blogPost.category}
            </span>
            {blogPost.isFeature && (
              <span className="ml-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {blogPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {formatDate(blogPost.publishedDate, blogPost.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{blogPost.readTime || 5} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                {blogPost.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between border-t border-b border-white/10 py-6">
            <div className="flex items-center gap-4">
              {blogPost.author.avatar ? (
                <img
                  src={blogPost.author.avatar}
                  alt={blogPost.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {blogPost.author.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {blogPost.author.bio || "Contributing Author"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isLiked
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">
                  {Math.floor(blogPost.viewCount * 0.1) + (isLiked ? 1 : 0)}
                </span>
              </button>

              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isBookmarked
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20 rounded-full transition-all duration-300"
                title="Share this post"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        {blogPost.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <img
                src={blogPost.featuredImage}
                alt={blogPost.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div
            className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.75",
            }}
          />
        </motion.article>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white/10 hover:bg-purple-500/20 hover:text-purple-300 border border-white/20 text-gray-300 rounded-full text-sm cursor-pointer transition-colors duration-300"
                  onClick={() => {
                    // Navigate to blog listing with tag filter
                    window.location.href = `/blog?tag=${encodeURIComponent(
                      tag
                    )}`;
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 py-8 border-t border-b border-white/10 mb-12"
        >
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              isLiked
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20"
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked!" : "Like this post"}
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20 rounded-full transition-all duration-300">
            <MessageCircle className="w-5 h-5" />
            Comment
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20 rounded-full transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <a href={`/blog/${post.slug}`} className="block">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <div className="text-center p-4">
                            <h3 className="text-white font-medium line-clamp-3">
                              {post.title}
                            </h3>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {formatShortDate(post.publishedDate, post.createdAt)}
                        </span>
                        <span>{post.readTime || 5} min read</span>
                        <span>{post.viewCount} views</span>
                      </div>
                    </div>
                  </a>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Share this post
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-300 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-3 p-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-700/30 rounded-lg text-blue-300 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="flex items-center gap-3 p-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-300 transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogDetail;
