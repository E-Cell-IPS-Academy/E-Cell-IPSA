// Create /src/pages/Gallery.tsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";

// Utility function for className merging (replace with your actual cn function)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Gallery Image interface
interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

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
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
      {/* Placeholder for actual image */}
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <span className="text-white/50 text-sm">{image.title}</span>
      </div>
    </div>
    <div className="absolute inset-0 bg-black/0 group-hover/bento:bg-black/30 transition-all duration-300" />
    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
      {image.category}
    </div>
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
          <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
              <p className="text-gray-300 mb-4">{currentImage.description}</p>
              <p className="text-sm text-gray-400">
                Category: {currentImage.category}
              </p>
              <p className="text-sm text-gray-400">Date: {currentImage.date}</p>
            </div>
          </div>

          {/* Image Info Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {currentImage.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {currentImage.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mock gallery data - replace with your actual images
  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      title: "IgniteX 2024",
      description:
        "Entrepreneurship conference with industry leaders and innovative startups",
      imageUrl: "/images/ignitex-2024.jpg",
      category: "Events",
      date: "December 3, 2024",
    },
    {
      id: "2",
      title: "Pitching Contest",
      description:
        "Students presenting their innovative business ideas to expert judges",
      imageUrl: "/images/pitching-contest.jpg",
      category: "Competitions",
      date: "October 4, 2024",
    },
    {
      id: "3",
      title: "Induction Program",
      description:
        "Welcome ceremony for new E-Cell members and orientation session",
      imageUrl: "/images/induction-2024.jpg",
      category: "Events",
      date: "September 19, 2024",
    },
    {
      id: "4",
      title: "Startup Workshop",
      description:
        "Hands-on workshop on business model development and validation",
      imageUrl: "/images/startup-workshop.jpg",
      category: "Workshops",
      date: "November 15, 2024",
    },
    {
      id: "5",
      title: "Networking Session",
      description:
        "Meet and connect with fellow entrepreneurs and industry mentors",
      imageUrl: "/images/networking.jpg",
      category: "Networking",
      date: "October 20, 2024",
    },
    {
      id: "6",
      title: "Innovation Lab",
      description: "Student teams working on cutting-edge technology solutions",
      imageUrl: "/images/innovation-lab.jpg",
      category: "Innovation",
      date: "November 8, 2024",
    },
    {
      id: "7",
      title: "Guest Speaker Series",
      description:
        "Industry expert sharing insights on entrepreneurial journey",
      imageUrl: "/images/guest-speaker.jpg",
      category: "Events",
      date: "December 12, 2024",
    },
    {
      id: "8",
      title: "Hackathon 2024",
      description: "48-hour coding marathon to solve real-world problems",
      imageUrl: "/images/hackathon.jpg",
      category: "Competitions",
      date: "November 22, 2024",
    },
  ];

  const categories = [
    "All",
    ...Array.from(new Set(galleryImages.map((img) => img.category))),
  ];

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

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

        {/* Gallery Grid */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
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
                  description={image.description}
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
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: filteredImages.length, label: "Photos" },
              { number: categories.length - 1, label: "Categories" },
              { number: "3", label: "Years of Memories" },
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
