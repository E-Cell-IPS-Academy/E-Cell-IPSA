// Create /src/pages/BlogDetail.tsx
import React, { useState } from "react";
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
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../types/blog";

const BlogDetail: React.FC = () => {
  
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Mock blog data - replace with actual API call
  const blogPost: BlogPost = {
    id: "1",
    title: "The Future of Entrepreneurship: AI and Innovation",
    slug: "future-entrepreneurship-ai-innovation",
    excerpt:
      "Exploring how artificial intelligence is reshaping the entrepreneurial landscape and creating new opportunities for startup founders.",
    content: `
      <p>The entrepreneurial landscape is undergoing a revolutionary transformation, driven primarily by advances in artificial intelligence and machine learning technologies. As we stand at the crossroads of innovation, entrepreneurs today have unprecedented opportunities to leverage AI for creating solutions that were unimaginable just a decade ago.</p>

      <h2>The AI Revolution in Startups</h2>
      <p>Artificial Intelligence is no longer a futuristic concept relegated to science fiction. It has become a practical tool that entrepreneurs can harness to solve real-world problems, optimize operations, and create new business models. From natural language processing to computer vision, AI technologies are democratizing access to powerful capabilities that were once available only to tech giants.</p>

      <p>Consider the impact of GPT models on content creation, or how computer vision is transforming retail through automated checkout systems. These technologies are not just enhancing existing businesses; they're creating entirely new categories of products and services.</p>

      <h2>Key Areas of Innovation</h2>
      <p>Several key areas are emerging as hotbeds for AI-driven entrepreneurship:</p>

      <h3>1. Healthcare Technology</h3>
      <p>AI-powered diagnostic tools are revolutionizing healthcare delivery, making accurate diagnosis more accessible and affordable. Startups are developing AI systems that can detect diseases from medical imaging, predict health outcomes, and personalize treatment plans.</p>

      <h3>2. Education and Learning</h3>
      <p>Personalized learning platforms powered by AI are transforming how we approach education. These systems adapt to individual learning styles and paces, making quality education more accessible and effective.</p>

      <h3>3. Sustainable Technology</h3>
      <p>AI is playing a crucial role in addressing climate change and sustainability challenges. From optimizing energy consumption to developing new materials, AI-driven startups are at the forefront of creating a more sustainable future.</p>

      <h2>Challenges and Opportunities</h2>
      <p>While the opportunities are immense, entrepreneurs venturing into AI face unique challenges. The technical complexity of AI systems requires either deep technical expertise or strategic partnerships with AI specialists. Additionally, ethical considerations around AI deployment, data privacy, and algorithmic bias are increasingly important.</p>

      <p>However, these challenges also represent opportunities for entrepreneurs who can navigate them successfully. Building ethical AI systems, creating user-friendly interfaces for complex technologies, and developing AI tools that enhance human capabilities rather than replace them are all areas ripe for innovation.</p>

      <h2>The Road Ahead</h2>
      <p>The future belongs to entrepreneurs who can effectively combine human creativity with AI capabilities. The most successful ventures will be those that use AI not as a replacement for human intelligence, but as an augmentation tool that amplifies human potential.</p>

      <p>As we look towards the future, the integration of AI in entrepreneurship will only deepen. The entrepreneurs who start building these capabilities today will be the ones leading the next wave of innovation. The question isn't whether AI will transform entrepreneurship, but how quickly entrepreneurs can adapt and harness its power for positive change.</p>
    `,
    featuredImage: "/images/blog/ai-entrepreneurship.jpg",
    author: {
      name: "Dr. Priya Sharma",
      avatar: "/images/authors/priya-sharma.jpg",
      bio: "AI Researcher and Startup Mentor with over 10 years of experience in machine learning and entrepreneurship. She has guided over 50 startups in implementing AI solutions.",
    },
    category: "Technology",
    tags: [
      "AI",
      "Innovation",
      "Startups",
      "Future",
      "Technology",
      "Machine Learning",
    ],
    publishedAt: "2024-12-15",
    updatedAt: "2024-12-15",
    readTime: 8,
    views: 1250,
    likes: 89,
    featured: true,
  };

  // Related posts - mock data
  const relatedPosts: BlogPost[] = [
    {
      id: "2",
      title: "Building a Sustainable Startup: Lessons from IPS Academy",
      slug: "building-sustainable-startup-ips-academy",
      excerpt:
        "Key insights and practical strategies for creating environmentally conscious businesses.",
      content: "",
      featuredImage: "/images/blog/sustainable-startup.jpg",
      author: {
        name: "Rahul Patel",
        avatar: "/images/authors/rahul-patel.jpg",
        bio: "Sustainability Expert",
      },
      category: "Sustainability",
      tags: ["Sustainability", "Green Business"],
      publishedAt: "2024-12-10",
      updatedAt: "2024-12-10",
      readTime: 6,
      views: 980,
      likes: 67,
      featured: false,
    },
    {
      id: "3",
      title: "Mastering the Art of Pitching: A Complete Guide",
      slug: "mastering-art-pitching-complete-guide",
      excerpt:
        "Everything you need to know about creating compelling pitch presentations.",
      content: "",
      featuredImage: "/images/blog/pitching-guide.jpg",
      author: {
        name: "Vikram Singh",
        avatar: "/images/authors/vikram-singh.jpg",
        bio: "Investment Banker and Pitch Coach",
      },
      category: "Business Skills",
      tags: ["Pitching", "Presentation"],
      publishedAt: "2024-11-28",
      updatedAt: "2024-11-28",
      readTime: 10,
      views: 1680,
      likes: 124,
      featured: false,
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
    setShowShareModal(false);
  };

  // If post not found
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link
            to="/blog"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium"
          >
            Back to Blog
          </Link>
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
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
                {new Date(blogPost.publishedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{blogPost.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                {blogPost.views.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between border-t border-b border-white/10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {blogPost.author.name}
                </h3>
                <p className="text-gray-400 text-sm">{blogPost.author.bio}</p>
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
                  {blogPost.likes + (isLiked ? 1 : 0)}
                </span>
              </button>

              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isBookmarked
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/20 rounded-full transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {blogPost.title}
                </h2>
                <p className="text-gray-300">Featured Image Placeholder</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
        >
          <div
            className="text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.75",
            }}
          />
        </motion.article>

        {/* Tags */}
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
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 rounded-full text-sm cursor-pointer transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

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
            Like this post
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="text-white font-medium">{post.title}</h3>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.section>
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
