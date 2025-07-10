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
  AlertCircle,
  Search,
} from "lucide-react";

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
interface GalleryImage {
  id?: string;
  title: string;
  description?: string;
  url: string;
  publicId: string;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Utility function for className merging
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Gallery service
class PublicGalleryService {
  private imagesCollection = "gallery_images";

  async getPublicImages(): Promise<GalleryImage[]> {
    try {
      const q = query(
        collection(db, this.imagesCollection),
        where("status", "==", "public"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];
    } catch (error) {
      console.error("Error fetching public images:", error);

      // Fallback: try without orderBy
      try {
        const simpleQuery = query(
          collection(db, this.imagesCollection),
          where("status", "==", "public")
        );
        const fallbackSnapshot = await getDocs(simpleQuery);
        const images = fallbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GalleryImage[];

        // Sort in memory
        return images.sort((a, b) => {
          const dateA = a.createdAt?.toDate().getTime() || 0;
          const dateB = b.createdAt?.toDate().getTime() || 0;
          return dateB - dateA;
        });
      } catch (fallbackError) {
        console.error("Fallback query failed:", fallbackError);
        throw new Error("Failed to fetch gallery images");
      }
    }
  }

  async getFeaturedImages(): Promise<GalleryImage[]> {
    try {
      const q = query(
        collection(db, this.imagesCollection),
        where("status", "==", "public"),
        where("isFeature", "==", true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];
    } catch (error) {
      console.error("Error fetching featured images:", error);
      return [];
    }
  }

  async incrementViews(imageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.imagesCollection, imageId), {
        "stats.views": increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  async incrementDownloads(imageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.imagesCollection, imageId), {
        "stats.downloads": increment(1),
      });
    } catch (error) {
      console.error("Error incrementing downloads:", error);
    }
  }

  async incrementShares(imageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.imagesCollection, imageId), {
        "stats.shares": increment(1),
      });
    } catch (error) {
      console.error("Error incrementing shares:", error);
    }
  }
}

const galleryService = new PublicGalleryService();

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
}> = ({ className, title, description, header, onClick }) => {
  return (
    <motion.div
      className={cn(
        "group/bento cursor-pointer row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition duration-300 hover:bg-white/10 hover:border-white/20",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="mt-2 mb-2 font-sans font-bold text-white text-lg">
          {title}
        </div>
        <div className="font-sans text-sm font-normal text-gray-300 line-clamp-2">
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
    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
      {image.category}
    </div>

    {/* Featured Badge */}
    {image.isFeature && (
      <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-xs text-white font-medium">
        Featured
      </div>
    )}

    {/* Stats Overlay */}
    <div className="absolute bottom-3 left-3 flex items-center gap-3 opacity-0 group-hover/bento:opacity-100 transition-opacity">
      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
        <Eye className="w-3 h-3" />
        {image.stats.views}
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
        <Heart className="w-3 h-3" />
        {image.stats.likes}
      </div>
    </div>

    {/* Event Info */}
    {image.eventName && (
      <div className="absolute bottom-3 right-3 opacity-0 group-hover/bento:opacity-100 transition-opacity">
        <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
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
    if (isOpen && currentImage?.id) {
      // Increment view count when lightbox opens
      galleryService.incrementViews(currentImage.id);
    }
  }, [isOpen, currentIndex, currentImage?.id]);

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
    if (!currentImage?.id) return;

    try {
      // Create a link to download the image
      const link = document.createElement("a");
      link.href = currentImage.url;
      link.download = `${currentImage.title}.jpg`;
      link.target = "_blank";
      link.click();

      // Increment download count
      await galleryService.incrementDownloads(currentImage.id);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    if (!currentImage?.id) return;

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

      // Increment share count
      await galleryService.incrementShares(currentImage.id);
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
                <h3 className="text-xl font-bold text-white mb-2">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="text-gray-300 text-sm mb-3">
                    {currentImage.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
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
                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
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
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Eye className="w-4 h-4" />
                <span>{currentImage.stats.views} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Download className="w-4 h-4" />
                <span>{currentImage.stats.downloads} downloads</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Heart className="w-4 h-4" />
                <span>{currentImage.stats.likes} likes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
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
              className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm"
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
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const galleryData = await galleryService.getPublicImages();
      setImages(galleryData);
    } catch (err) {
      setError("Failed to load gallery images. Please try again later.");
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-white leading-tight mb-4">
            Event
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
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
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
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
              <p className="text-gray-400">Loading gallery...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Error Loading Gallery
              </h3>
              <p className="text-gray-400 text-center mb-6">{error}</p>
              <button
                onClick={loadGalleryImages}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Images Found
              </h3>
              <p className="text-gray-400 mb-6">
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
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
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
                  />
                </motion.div>
              ))}
            </BentoGrid>
          )}
        </motion.div>

        {/* Stats */}
        {!loading && !error && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                {
                  number: filteredImages.length,
                  label: filteredImages.length === 1 ? "Photo" : "Photos",
                },
                {
                  number: categories.length - 1,
                  label: "Categories",
                },
                {
                  number: filteredImages
                    .reduce((sum, img) => sum + img.stats.views, 0)
                    .toLocaleString(),
                  label: "Total Views",
                },
                {
                  number: filteredImages.filter((img) => img.isFeature).length,
                  label: "Featured",
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
