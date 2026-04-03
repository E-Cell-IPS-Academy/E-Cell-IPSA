import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Eye,
  Heart,
  Calendar,
  MapPin,
  User,
  Loader,
  Search,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Types
interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  album?: string;
  tags: string[];
  eventName?: string;
  eventDate?: string;
  location?: string;
  photographer?: string;
  uploadedBy: string;
  isFeature: boolean;
  isFavorite: boolean;
  status: "public" | "private" | "archived";
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    camera?: string;
    settings?: string;
    dateCreated?: string;
  };
  stats: {
    views: number;
    downloads: number;
    likes: number;
    shares: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Static Gallery Data
const staticGalleryImages: GalleryImage[] = [
  {
    id: "1",
    title: "Innovation Summit 2024",
    description:
      "Entrepreneurs showcasing their innovative solutions at our annual summit.",
    url: "/gallery/1.jpg",
    thumbnailUrl: "/gallery/1.jpg",
    category: "Events",
    album: "Annual Summit",
    tags: ["innovation", "entrepreneurship", "summit", "networking"],
    eventName: "Innovation Summit 2024",
    eventDate: "2024-03-15",
    location: "Mumbai, India",
    photographer: "Rahul Sharma",
    uploadedBy: "ecell-admin",
    isFeature: true,
    isFavorite: true,
    status: "public",
    fileSize: 2048000,
    dimensions: { width: 1920, height: 1080 },
    metadata: {
      camera: "Canon EOS R5",
      settings: "f/2.8, 1/200s, ISO 400",
      dateCreated: "2024-03-15T10:30:00Z",
    },
    stats: { views: 2500, downloads: 450, likes: 320, shares: 89 },
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Startup Pitch Competition",
    description:
      "Young entrepreneurs presenting their business ideas to a panel of judges.",
    url: "/gallery/2.jpg",
    thumbnailUrl:
      "/gallery/2.jpg",
    category: "Competitions",
    album: "Pitch Events",
    tags: ["startup", "pitch", "competition", "business"],
    eventName: "VypaarX Pitch Competition",
    eventDate: "2024-02-20",
    location: "Bangalore, India",
    photographer: "Priya Patel",
    uploadedBy: "ecell-admin",
    isFeature: true,
    isFavorite: false,
    status: "public",
    fileSize: 1800000,
    dimensions: { width: 1600, height: 900 },
    metadata: {
      camera: "Sony A7 III",
      settings: "f/4.0, 1/125s, ISO 800",
      dateCreated: "2024-02-20T14:15:00Z",
    },
    stats: { views: 1800, downloads: 280, likes: 195, shares: 67 },
    createdAt: "2024-02-20T14:15:00Z",
    updatedAt: "2024-02-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Mentorship Session",
    description:
      "Industry experts sharing valuable insights with aspiring entrepreneurs.",
    url: "/gallery/4.jpg",
    thumbnailUrl:
      "/gallery/4.jpg",
    category: "Workshops",
    album: "Learning Sessions",
    tags: ["mentorship", "guidance", "learning", "experts"],
    eventName: "Mentor Connect Session",
    eventDate: "2024-01-10",
    location: "Delhi, India",
    photographer: "Amit Kumar",
    uploadedBy: "ecell-admin",
    isFeature: false,
    isFavorite: true,
    status: "public",
    fileSize: 2200000,
    dimensions: { width: 1920, height: 1280 },
    metadata: {
      camera: "Nikon D850",
      settings: "f/5.6, 1/60s, ISO 1000",
      dateCreated: "2024-01-10T16:45:00Z",
    },
    stats: { views: 1200, downloads: 180, likes: 145, shares: 34 },
    createdAt: "2024-01-10T16:45:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
  },
  {
    id: "4",
    title: "Product Launch Event",
    description:
      "Celebrating the successful launch of a startup's innovative product.",
    url: "/gallery/3.jpg",
    thumbnailUrl:
      "/gallery/3.jpg",
    category: "Events",
    album: "Product Launches",
    tags: ["product", "launch", "innovation", "celebration"],
    eventName: "TechStart Product Launch",
    eventDate: "2023-12-05",
    location: "Pune, India",
    photographer: "Sarah Johnson",
    uploadedBy: "ecell-admin",
    isFeature: false,
    isFavorite: false,
    status: "public",
    fileSize: 1900000,
    dimensions: { width: 1600, height: 1067 },
    metadata: {
      camera: "Canon EOS 5D",
      settings: "f/3.5, 1/100s, ISO 640",
      dateCreated: "2023-12-05T19:20:00Z",
    },
    stats: { views: 980, downloads: 120, likes: 87, shares: 23 },
    createdAt: "2023-12-05T19:20:00Z",
    updatedAt: "2023-12-05T19:20:00Z",
  },
  {
    id: "5",
    title: "Team Building Workshop",
    description: "Entrepreneurs learning collaboration and team dynamics.",
    url: "/gallery/8.jpg",
    thumbnailUrl:
      "/gallery/8.jpg",
    category: "Workshops",
    album: "Skill Development",
    tags: ["teamwork", "collaboration", "workshop", "skills"],
    eventName: "Leadership & Team Building",
    eventDate: "2023-11-18",
    location: "Chennai, India",
    photographer: "Michael Chen",
    uploadedBy: "ecell-admin",
    isFeature: true,
    isFavorite: false,
    status: "public",
    fileSize: 1650000,
    dimensions: { width: 1500, height: 1000 },
    metadata: {
      camera: "Fujifilm X-T4",
      settings: "f/2.8, 1/160s, ISO 320",
      dateCreated: "2023-11-18T11:30:00Z",
    },
    stats: { views: 1500, downloads: 210, likes: 167, shares: 45 },
    createdAt: "2023-11-18T11:30:00Z",
    updatedAt: "2023-11-18T11:30:00Z",
  },
  {
    id: "6",
    title: "Networking Mixer",
    description:
      "Entrepreneurs connecting and building valuable relationships.",
    url: "/gallery/6.jpg",
    thumbnailUrl:
      "/gallery/6.jpg",
    category: "Networking",
    album: "Community Events",
    tags: ["networking", "connections", "community", "relationships"],
    eventName: "Monthly Networking Mixer",
    eventDate: "2023-10-25",
    location: "Hyderabad, India",
    photographer: "Lisa Wang",
    uploadedBy: "ecell-admin",
    isFeature: false,
    isFavorite: true,
    status: "public",
    fileSize: 1750000,
    dimensions: { width: 1800, height: 1200 },
    metadata: {
      camera: "Canon EOS R6",
      settings: "f/4.0, 1/80s, ISO 1600",
      dateCreated: "2023-10-25T18:45:00Z",
    },
    stats: { views: 1100, downloads: 145, likes: 98, shares: 28 },
    createdAt: "2023-10-25T18:45:00Z",
    updatedAt: "2023-10-25T18:45:00Z",
  },
];

// Utility function for className merging
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// BentoGrid Components
const BentoGrid: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem: React.FC<{
  className?: string;
  title: string;
  description: string;
  header: React.ReactNode;
  onClick?: () => void;
  isDark: boolean;
}> = ({ className, title, description, header, onClick, isDark }) => {
  return (
    <motion.div
      className={cn(
        `group/bento cursor-pointer row-span-1 flex flex-col justify-between space-y-4 rounded-xl border ${isDark ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20" : "border-gray-200 bg-white/80 hover:bg-white hover:border-gray-300"} backdrop-blur-sm p-4 transition duration-300`,
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className={`mt-2 mb-2 font-sans font-light ${isDark ? "text-white" : "text-gray-900"} text-base`}>
          {title}
        </div>
        <div className={`font-sans text-sm font-light ${isDark ? "text-gray-300" : "text-gray-600"} line-clamp-2`}>
          {description}
        </div>
      </div>
    </motion.div>
  );
};

// Image component for the gallery items
const GalleryImageComponent: React.FC<{
  image: GalleryImage;
  className?: string;
}> = ({ image, className }) => (
  <div className={cn("relative overflow-hidden rounded-lg h-full", className)}>
    <img
      src={image.thumbnailUrl || image.url}
      alt={image.title}
      className="w-full h-full object-cover"
      loading="lazy"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover/bento:bg-black/30 transition-all duration-300" />

    {/* Category Badge */}
    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-light">
      {image.category}
    </div>

    {/* Featured Badge */}
    {image.isFeature && (
      <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-xs text-white font-light">
        Featured
      </div>
    )}

    {/* Stats Overlay */}
    <div className="absolute bottom-3 left-3 flex items-center gap-3 opacity-0 group-hover/bento:opacity-100 transition-opacity">
      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-light">
        <Eye className="w-3 h-3" />
        {image.stats.views}
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-light">
        <Heart className="w-3 h-3" />
        {image.stats.likes}
      </div>
    </div>

    {/* Event Info */}
    {image.eventName && (
      <div className="absolute bottom-3 right-3 opacity-0 group-hover/bento:opacity-100 transition-opacity">
        <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-light">
          {image.eventName}
        </div>
      </div>
    )}
  </div>
);

// Lightbox Modal Component
const Lightbox: React.FC<{
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      // Create a link to download the image
      const link = document.createElement("a");
      link.href = currentImage.url;
      link.download = `${currentImage.title}.jpg`;
      link.target = "_blank";
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: currentImage.title,
          text: currentImage.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-60 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </>
        )}

        {/* Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Image */}
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="w-full h-full object-contain max-h-[75vh]"
            />
          </div>

          {/* Image Info Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6"
          >
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-light text-white mb-2">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="text-gray-300 text-sm font-light mb-3">
                    {currentImage.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-light text-gray-400 mb-3">
                  {currentImage.eventName && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{currentImage.eventName}</span>
                    </div>
                  )}
                  {currentImage.eventDate && (
                    <span>
                      {new Date(currentImage.eventDate).toLocaleDateString()}
                    </span>
                  )}
                  {currentImage.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentImage.location}</span>
                    </div>
                  )}
                  {currentImage.photographer && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{currentImage.photographer}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {currentImage.tags && currentImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentImage.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 text-white text-xs font-light rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 ml-6">
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-light">
                <Eye className="w-4 h-4" />
                <span>{currentImage.stats.views} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-light">
                <Download className="w-4 h-4" />
                <span>{currentImage.stats.downloads} downloads</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-light">
                <Heart className="w-4 h-4" />
                <span>{currentImage.stats.likes} likes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-light">
                <Share2 className="w-4 h-4" />
                <span>{currentImage.stats.shares} shares</span>
              </div>
            </div>
          </motion.div>

          {/* Image Counter */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-light"
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Gallery Component
const Gallery: React.FC = () => {
  const { isDark } = useTheme();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    // Simulate loading time then set static data
    const loadStaticImages = () => {
      setTimeout(() => {
        setImages(staticGalleryImages);
        setLoading(false);
      }, 1000); // 1 second loading simulation
    };

    loadStaticImages();
  }, []);

  // Get unique categories from images
  const categories = [
    "All",
    ...Array.from(new Set(images.map((img) => img.category))),
  ];

  // Filter images based on category and search
  const filteredImages = images.filter((img) => {
    const matchesCategory =
      selectedCategory === "All" || img.category === selectedCategory;
    const matchesSearch =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      img.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-gray-900 via-black to-purple-900" : "bg-gradient-to-br from-gray-50 via-white to-purple-50"} pt-24 pb-12`}>
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-thin ${isDark ? "text-white" : "text-gray-900"} leading-tight mb-4`}>
            Event
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gallery
            </span>
          </h1>
          <p className={`text-lg font-light ${isDark ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
            Explore moments from our entrepreneurial journey and community
            events
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"} border rounded-lg focus:outline-none focus:border-purple-500 text-sm font-light`}
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-light text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : isDark ? "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white" : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Content */}
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
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light`}>Loading gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-light ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                No Images Found
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-light mb-6`}>
                {searchTerm
                  ? "Try adjusting your search terms or filters"
                  : `No images found in ${selectedCategory} category`}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-light transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* Gallery Grid */
            <BentoGrid className="mb-12">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                  }
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <BentoGridItem
                    title={image.title}
                    description={image.description || ""}
                    header={
                      <GalleryImageComponent image={image} className="flex-1" />
                    }
                    className={`${
                      index % 7 === 3 || index % 7 === 6 ? "md:col-span-2" : ""
                    } ${index % 11 === 5 ? "md:row-span-2" : ""}`}
                    onClick={() => openLightbox(index)}
                    isDark={isDark}
                  />
                </motion.div>
              ))}
            </BentoGrid>
          )}
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default Gallery;
