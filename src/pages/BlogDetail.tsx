import React, { useState, useEffect, useMemo } from "react";
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
import type { Timestamp } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import { useBlog, useBlogs } from "@/features/blog";
import type { BlogPost } from "@/features/blog";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("blogdetail-fonts")) return;
    const link = document.createElement("link");
    link.id = "blogdetail-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400&family=Outfit:wght@300;400&display=swap";
    document.head.appendChild(link);
  }, []);
}

const F = {
  display: "'Instrument Serif', Georgia, serif",
  mono: "'DM Mono', monospace",
  body: "'Outfit', sans-serif",
};

/**
 * Rank published posts related to the current one: same-category first, falling
 * back to any published post, ordered by shared-tag count then view count.
 */
function pickRelatedPosts(allPosts: BlogPost[], current: BlogPost): BlogPost[] {
  const others = allPosts.filter((p) => p.id !== current.id);
  const sameCategory = others.filter((p) => p.category === current.category);
  const pool = sameCategory.length >= 2 ? sameCategory : others;
  return [...pool]
    .sort((a, b) => {
      const at = a.tags.filter((t) => current.tags.includes(t)).length;
      const bt = b.tags.filter((t) => current.tags.includes(t)).length;
      return at !== bt ? bt - at : b.viewCount - a.viewCount;
    })
    .slice(0, 2);
}

const getBlogSlugFromURL = (): string => {
  const s = window.location.pathname.split("/");
  return s[s.length - 1] || "";
};

const BlogDetail: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
  const slug = getBlogSlugFromURL();
  const { data: matches, loading: postLoading, error } = useBlog(slug);
  const { data: allPosts } = useBlogs();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const blogPost = matches[0] ?? null;
  const loading = slug ? postLoading : false;

  const relatedPosts = useMemo(
    () => (blogPost ? pickRelatedPosts(allPosts, blogPost) : []),
    [allPosts, blogPost]
  );

  useEffect(() => {
    if (!blogPost) return;
    document.title = blogPost.seoTitle || blogPost.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", blogPost.seoDescription || blogPost.excerpt);
  }, [blogPost]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) localStorage.setItem(`bookmark_${blogPost?.id}`, "true");
    else localStorage.removeItem(`bookmark_${blogPost?.id}`);
  };
  const handleShare = (platform: string) => {
    if (!blogPost) return;
    const url = window.location.href;
    if (platform === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    else if (platform === "facebook")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    else if (platform === "linkedin")
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(blogPost.title)}`,
        "_blank"
      );
    else if (platform === "copy")
      navigator.clipboard
        .writeText(url)
        .then(() => alert("Link copied!"))
        .catch(() => alert("Failed to copy link"));
    setShowShareModal(false);
  };

  const formatDate = (dateString?: string, timestamp?: Timestamp) => {
    const d = dateString ? new Date(dateString) : timestamp?.toDate();
    return d
      ? d.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
  };
  const formatShortDate = (dateString?: string, timestamp?: Timestamp) => {
    const d = dateString ? new Date(dateString) : timestamp?.toDate();
    return d ? d.toLocaleDateString() : "Unknown date";
  };

  const actionBtnCls = `transition-all duration-300 ${isDark ? "bg-white/6 text-white/45 hover:bg-white/10 hover:text-white/70 border border-white/8" : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200"}`;

  if (loading)
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"} flex items-center justify-center`}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader
              className={`w-7 h-7 ${isDark ? "text-white/30" : "text-gray-400"} mx-auto`}
            />
          </motion.div>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.78rem",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.38)",
            }}
          >
            Loading blog post…
          </p>
        </div>
      </div>
    );

  if (error || !blogPost)
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"} flex items-center justify-center`}
      >
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500/60 mx-auto mb-4" />
          <h1
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "1.2rem",
              color: isDark ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.72)",
              marginBottom: "0.5rem",
            }}
          >
            {error ? "Failed to Load Post" : "Post Not Found"}
          </h1>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.78rem",
              color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.38)",
              marginBottom: "1.5rem",
            }}
          >
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/blog"
            style={{ fontFamily: F.body, fontWeight: 300, fontSize: "0.82rem" }}
            className={`px-6 py-3 ${isDark ? "bg-white text-black" : "bg-black text-white"} rounded-full hover:opacity-85 transition-opacity`}
          >
            Back to Blog
          </a>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-black" : "bg-gray-50"} pt-24 pb-12`}
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <a
            href="/blog"
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "0.82rem",
              color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
            }}
            className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </a>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category badges — DM Mono */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
              className={`px-4 py-2 ${isDark ? "bg-white/6 border-white/10 text-white/45" : "bg-black/5 border-gray-200 text-gray-500"} border rounded-full`}
            >
              {blogPost.category}
            </span>
            {blogPost.isFeature && (
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "8px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
                className="px-4 py-2 bg-amber-500/15 border border-amber-500/25 text-amber-400/70 rounded-full"
              >
                Featured
              </span>
            )}
          </div>

          {/* Title — Instrument Serif */}
          <h1
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(1.6rem,4vw,2.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
              marginBottom: "1.5rem",
            }}
          >
            {blogPost.title}
          </h1>

          {/* Meta — DM Mono */}
          <div
            className="flex flex-wrap items-center gap-5 mb-6"
            style={{
              fontFamily: F.mono,
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)",
            }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blogPost.publishedDate, blogPost.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blogPost.readTime || 5} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blogPost.viewCount.toLocaleString()} views
            </span>
          </div>

          {/* Author + actions */}
          <div
            className={`flex items-center justify-between border-t border-b ${isDark ? "border-white/6" : "border-gray-200"} py-5`}
          >
            <div className="flex items-center gap-4">
              {blogPost.author.avatar ? (
                <img
                  src={blogPost.author.avatar}
                  alt={blogPost.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-10 h-10 ${isDark ? "bg-white/8" : "bg-gray-200"} rounded-full flex items-center justify-center`}
                >
                  <User
                    className={`w-5 h-5 ${isDark ? "text-white/35" : "text-gray-400"}`}
                  />
                </div>
              )}
              <div>
                <h3
                  style={{
                    fontFamily: F.body,
                    fontWeight: 400,
                    fontSize: "0.85rem",
                    color: isDark
                      ? "rgba(255,255,255,0.75)"
                      : "rgba(0,0,0,0.72)",
                  }}
                >
                  {blogPost.author.name}
                </h3>
                <p
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.06em",
                    color: isDark
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(0,0,0,0.30)",
                  }}
                >
                  {blogPost.author.bio || "Contributing Author"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isLiked ? "bg-red-500/15 text-red-400 border border-red-500/25" : actionBtnCls}`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`}
                />
                {Math.floor(blogPost.viewCount * 0.1) + (isLiked ? 1 : 0)}
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full ${isBookmarked ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : actionBtnCls}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className={`p-2 rounded-full ${actionBtnCls}`}
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
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

        {/* Article content — Outfit 300 applied via CSS class */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div
            className={`prose ${isDark ? "prose-invert" : "prose-gray"} prose-base max-w-none leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "1rem",
              lineHeight: "1.85",
              color: isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.65)",
            }}
          />
        </motion.article>

        {/* Tags — DM Mono */}
        {blogPost.tags?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h3
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)",
                marginBottom: "0.75rem",
              }}
            >
              Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.1em",
                  }}
                  className={`px-4 py-2 ${isDark ? "bg-white/6 border-white/8 text-white/40 hover:bg-white/12" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"} border rounded-full cursor-pointer transition-colors duration-300`}
                  onClick={() => {
                    window.location.href = `/blog?tag=${encodeURIComponent(tag)}`;
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`flex items-center justify-center gap-4 py-7 border-t border-b ${isDark ? "border-white/6" : "border-gray-200"} mb-12`}
        >
          {[
            {
              onClick: handleLike,
              icon: ThumbsUp,
              label: isLiked ? "Liked!" : "Like this post",
              active: isLiked,
              activeCls: "bg-red-500/15 text-red-400 border-red-500/25",
            },
            {
              onClick: () => {},
              icon: MessageCircle,
              label: "Comment",
              active: false,
              activeCls: "",
            },
            {
              onClick: () => setShowShareModal(true),
              icon: Share2,
              label: "Share",
              active: false,
              activeCls: "",
            },
          ].map(({ onClick, icon: Icon, label, active, activeCls }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "0.78rem",
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${active ? `${activeCls} border` : `${actionBtnCls}`}`}
            >
              <Icon className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
                color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.65)",
                marginBottom: "2rem",
              }}
            >
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className={`group ${isDark ? "bg-white/4 border-white/8 hover:bg-white/7 hover:border-white/14" : "bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300"} backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300`}
                >
                  <a href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-44 overflow-hidden">
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
                          <h3
                            style={{
                              fontFamily: F.display,
                              fontWeight: 400,
                              fontSize: "0.85rem",
                              color: isDark
                                ? "rgba(255,255,255,0.50)"
                                : "rgba(0,0,0,0.45)",
                            }}
                            className="text-center p-4 line-clamp-3"
                          >
                            {post.title}
                          </h3>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      <div
                        className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.1em",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        {post.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3
                        style={{
                          fontFamily: F.display,
                          fontWeight: 400,
                          fontSize: "0.92rem",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.3,
                          color: isDark
                            ? "rgba(255,255,255,0.80)"
                            : "rgba(0,0,0,0.78)",
                          marginBottom: "0.4rem",
                        }}
                        className="line-clamp-2 group-hover:opacity-70 transition-opacity"
                      >
                        {post.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: F.body,
                          fontWeight: 300,
                          fontSize: "0.75rem",
                          lineHeight: 1.65,
                          color: isDark
                            ? "rgba(255,255,255,0.32)"
                            : "rgba(0,0,0,0.40)",
                          marginBottom: "0.75rem",
                        }}
                        className="line-clamp-2"
                      >
                        {post.excerpt}
                      </p>
                      <div
                        className="flex items-center gap-3"
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.08em",
                          color: isDark
                            ? "rgba(255,255,255,0.22)"
                            : "rgba(0,0,0,0.28)",
                        }}
                      >
                        <span>
                          {formatShortDate(post.publishedDate, post.createdAt)}
                        </span>
                        <span>{post.readTime || 5} min</span>
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
            className={`${isDark ? "bg-black/90 border-white/10" : "bg-white border-gray-200"} border rounded-2xl p-6 max-w-md w-full`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "1rem",
                color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.75)",
                marginBottom: "1rem",
              }}
            >
              Share this post
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  platform: "twitter",
                  icon: Twitter,
                  label: "Twitter",
                  cls: "bg-blue-500/10 border-blue-500/20 text-blue-400/80 hover:bg-blue-500/20",
                },
                {
                  platform: "facebook",
                  icon: Facebook,
                  label: "Facebook",
                  cls: "bg-blue-600/10 border-blue-600/20 text-blue-400/80 hover:bg-blue-600/20",
                },
                {
                  platform: "linkedin",
                  icon: Linkedin,
                  label: "LinkedIn",
                  cls: "bg-blue-700/10 border-blue-700/20 text-blue-400/80 hover:bg-blue-700/20",
                },
                {
                  platform: "copy",
                  icon: LinkIcon,
                  label: "Copy Link",
                  cls: `${isDark ? "bg-white/6 border-white/10 text-white/45 hover:bg-white/12" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}`,
                },
              ].map(({ platform, icon: Icon, label, cls }) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                  }}
                  className={`flex items-center gap-2.5 p-3 border rounded-xl transition-colors ${cls}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogDetail;
