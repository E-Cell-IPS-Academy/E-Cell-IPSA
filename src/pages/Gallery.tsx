// ─────────────────────────────────────────────────────────────────────────────
// Gallery.tsx — fonts updated only
// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY → "Instrument Serif"  — page title "Event Gallery"
// LABEL   → "DM Mono"           — category filters, badges, meta labels
// BODY    → "Outfit" 300        — descriptions, card text, search placeholder
// ─────────────────────────────────────────────────────────────────────────────

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
import { useGalleryImages, type GalleryImage } from "../features/gallery";

function useFonts() {
  useEffect(() => {
    if (document.getElementById("gallery-fonts")) return;
    const link = document.createElement("link");
    link.id = "gallery-fonts";
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

const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const BentoGrid: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 lg:grid-cols-4",
      className
    )}
  >
    {children}
  </div>
);

const BentoGridItem: React.FC<{
  className?: string;
  title: string;
  description: string;
  header: React.ReactNode;
  onClick?: () => void;
  isDark: boolean;
}> = ({ className, title, description, header, onClick, isDark }) => (
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
      {/* Card title — Instrument Serif */}
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 400,
          fontSize: "0.9rem",
          letterSpacing: "-0.01em",
          color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)",
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      {/* Card description — Outfit 300 */}
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 300,
          fontSize: "0.75rem",
          lineHeight: 1.6,
          color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
        }}
        className="line-clamp-2"
      >
        {description}
      </div>
    </div>
  </motion.div>
);

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
    <div className="absolute inset-0 bg-black/0 group-hover/bento:bg-black/30 transition-all duration-300" />
    <div
      className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
      style={{
        fontFamily: F.mono,
        fontSize: "8px",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {image.category}
    </div>
    {image.isFeature && (
      <div
        className="absolute top-3 left-3 px-2 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full"
        style={{ fontFamily: F.mono, fontSize: "8px", color: "white" }}
      >
        Featured
      </div>
    )}
    <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover/bento:opacity-100 transition-opacity">
      <div
        className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
        style={{
          fontFamily: F.mono,
          fontSize: "8px",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <Eye className="w-3 h-3" />
        {image.stats.views}
      </div>
      <div
        className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
        style={{
          fontFamily: F.mono,
          fontSize: "8px",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <Heart className="w-3 h-3" />
        {image.stats.likes}
      </div>
    </div>
    {image.eventName && (
      <div className="absolute bottom-3 right-3 opacity-0 group-hover/bento:opacity-100 transition-opacity">
        <div
          className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full"
          style={{
            fontFamily: F.body,
            fontWeight: 300,
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {image.eventName}
        </div>
      </div>
    )}
  </div>
);

const Lightbox: React.FC<{
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  const img = images[currentIndex];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose, onNext, onPrev]);

  const handleDownload = () => {
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `${img.title}.jpg`;
    a.target = "_blank";
    a.click();
  };
  const handleShare = async () => {
    if (!img) return;
    try {
      if (navigator.share)
        await navigator.share({
          title: img.title,
          text: img.description,
          url: window.location.href,
        });
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch {}
  };

  if (!isOpen || !img) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-60 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>
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
              className="absolute left-6 top-1/2 -translate-y-1/2 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
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
              className="absolute right-6 top-1/2 -translate-y-1/2 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-contain max-h-[75vh]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6"
          >
            <div className="flex items-end justify-between">
              <div className="flex-1">
                {/* Lightbox title — Instrument Serif */}
                <h3
                  style={{
                    fontFamily: F.display,
                    fontWeight: 400,
                    fontSize: "1.05rem",
                    color: "rgba(255,255,255,0.90)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {img.title}
                </h3>
                {img.description && (
                  <p
                    style={{
                      fontFamily: F.body,
                      fontWeight: 300,
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.65,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {img.description}
                  </p>
                )}
                {/* Meta — DM Mono */}
                <div
                  className="flex flex-wrap items-center gap-4 mb-3"
                  style={{
                    fontFamily: F.mono,
                    fontSize: "8px",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {img.eventName && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {img.eventName}
                    </span>
                  )}
                  {img.eventDate && (
                    <span>{new Date(img.eventDate).toLocaleDateString()}</span>
                  )}
                  {img.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {img.location}
                    </span>
                  )}
                  {img.photographer && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {img.photographer}
                    </span>
                  )}
                </div>
                {img.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {img.tags.slice(0, 5).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: F.mono,
                          fontSize: "8px",
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.55)",
                        }}
                        className="px-2 py-1 bg-white/20 rounded-full"
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
            {/* Stats — DM Mono */}
            <div
              className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20"
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {img.stats.views} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {img.stats.downloads} downloads
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {img.stats.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {img.stats.shares} shares
              </span>
            </div>
          </motion.div>
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full"
              style={{
                fontFamily: F.mono,
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Gallery: React.FC = () => {
  useFonts();
  const { isDark } = useTheme();
  const { data: images, loading } = useGalleryImages();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const categories = [
    "All",
    ...Array.from(new Set(images.map((i) => i.category))),
  ];
  const filteredImages = images.filter((img) => {
    const mc = selectedCategory === "All" || img.category === selectedCategory;
    const ms =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some((t) =>
        t.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      img.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
    return mc && ms;
  });

  const openLightbox = (i: number) => {
    setSelectedImageIndex(i);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
  };
  const nextImage = () =>
    setSelectedImageIndex((p) => (p === filteredImages.length - 1 ? 0 : p + 1));
  const prevImage = () =>
    setSelectedImageIndex((p) => (p === 0 ? filteredImages.length - 1 : p - 1));

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gradient-to-br from-gray-900 via-black to-purple-900" : "bg-gradient-to-br from-gray-50 via-white to-purple-50"} pt-24 pb-12`}
    >
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
              color: "#a78bfa",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Our Moments
          </p>
          <h1
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)",
              marginBottom: "0.75rem",
            }}
          >
            Event{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gallery
            </span>
          </h1>
          <p
            style={{
              fontFamily: F.body,
              fontWeight: 300,
              fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
              color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)",
              lineHeight: 1.7,
              maxWidth: "46ch",
              margin: "0 auto",
            }}
          >
            Explore moments from our entrepreneurial journey and community
            events
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            />
            <input
              type="text"
              placeholder="Search images…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontFamily: F.body,
                fontWeight: 300,
                fontSize: "0.8rem",
              }}
              className={`w-full pl-11 pr-4 py-3 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-gray-400" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"} border rounded-lg focus:outline-none focus:border-purple-500`}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontFamily: F.mono,
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${selectedCategory === cat ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" : isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery */}
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
                <Loader className="w-8 h-8 text-purple-500" />
              </motion.div>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)",
                }}
              >
                Loading gallery…
              </p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3
                style={{
                  fontFamily: F.display,
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)",
                  marginBottom: "0.4rem",
                }}
              >
                No Images Found
              </h3>
              <p
                style={{
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)",
                  marginBottom: "1.5rem",
                }}
              >
                {searchTerm
                  ? "Try adjusting your search terms or filters"
                  : `No images in ${selectedCategory}`}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  style={{
                    fontFamily: F.body,
                    fontWeight: 300,
                    fontSize: "0.78rem",
                  }}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
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
                    className={`${index % 7 === 3 || index % 7 === 6 ? "md:col-span-2" : ""} ${index % 11 === 5 ? "md:row-span-2" : ""}`}
                    onClick={() => openLightbox(index)}
                    isDark={isDark}
                  />
                </motion.div>
              ))}
            </BentoGrid>
          )}
        </motion.div>
      </div>

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

export { Gallery as default };
