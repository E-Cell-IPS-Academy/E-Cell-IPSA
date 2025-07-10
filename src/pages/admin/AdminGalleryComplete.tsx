// /src/pages/admin/AdminGalleryComplete.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Download,
  Grid3X3,
  List,
  FolderPlus,
  Folder,
  Star,
  Share2,
  Heart,
} from "lucide-react";

// Firebase imports
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// Browser-compatible Cloudinary service
class CloudinaryService {
  private cloudName = "dszmnqzhk";
  private uploadPreset = "ml_default";

  async uploadFile(
    file: File,
    folder: string = "gallery"
  ): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", folder);
      formData.append("resource_type", "auto");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  async uploadMultiple(
    files: File[],
    folder: string = "gallery",
    onProgress?: (progress: number) => void
  ): Promise<Array<{ url: string; publicId: string }>> {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadFile(files[i], folder);
      results.push(result);
      if (onProgress) {
        onProgress(((i + 1) / files.length) * 100);
      }
    }
    return results;
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      console.log("Delete image:", publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  }

  generateOptimizedUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    const transformParams = [];

    if (transformations.width)
      transformParams.push(`w_${transformations.width}`);
    if (transformations.height)
      transformParams.push(`h_${transformations.height}`);
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.quality)
      transformParams.push(`q_${transformations.quality}`);
    if (transformations.format)
      transformParams.push(`f_${transformations.format}`);

    const transformString =
      transformParams.length > 0 ? transformParams.join(",") + "/" : "";
    return `${baseUrl}/${transformString}${publicId}`;
  }
}

const cloudinaryService = new CloudinaryService();

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

interface Album {
  id?: string;
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt?: Timestamp;
}

interface GalleryStats {
  totalImages: number;
  totalAlbums: number;
  totalViews: number;
  totalDownloads: number;
  storageUsed: number;
  featuredImages: number;
  publicImages: number;
  privateImages: number;
}

type ModalMode = "create" | "edit" | "view" | "upload" | "album" | null;
type ViewMode = "grid" | "list";

// Gallery service
class GalleryService {
  private imagesCollection = "gallery_images";
  private albumsCollection = "gallery_albums";

  async getAllImages(): Promise<GalleryImage[]> {
    try {
      const q = query(
        collection(db, this.imagesCollection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GalleryImage[];
    } catch (error) {
      console.error("Error fetching images:", error);
      throw new Error("Failed to fetch images");
    }
  }

  async getAllAlbums(): Promise<Album[]> {
    try {
      const q = query(
        collection(db, this.albumsCollection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Album[];
    } catch (error) {
      console.error("Error fetching albums:", error);
      throw new Error("Failed to fetch albums");
    }
  }

  async createImage(
    imageData: Omit<GalleryImage, "id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    try {
      await addDoc(collection(db, this.imagesCollection), {
        ...imageData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating image:", error);
      throw new Error("Failed to create image");
    }
  }

  async createAlbum(albumData: Omit<Album, "id" | "createdAt">): Promise<void> {
    try {
      await addDoc(collection(db, this.albumsCollection), {
        ...albumData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating album:", error);
      throw new Error("Failed to create album");
    }
  }

  async updateImage(
    imageId: string,
    imageData: Partial<GalleryImage>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.imagesCollection, imageId), {
        ...imageData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating image:", error);
      throw new Error("Failed to update image");
    }
  }

  async deleteImage(imageId: string, publicId?: string): Promise<void> {
    try {
      if (publicId) {
        await cloudinaryService.deleteFile(publicId);
      }
      await deleteDoc(doc(db, this.imagesCollection, imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete image");
    }
  }

  async deleteAlbum(albumId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.albumsCollection, albumId));
    } catch (error) {
      console.error("Error deleting album:", error);
      throw new Error("Failed to delete album");
    }
  }

  async getGalleryStats(images: GalleryImage[]): Promise<GalleryStats> {
    const stats = {
      totalImages: images.length,
      totalAlbums: 0, // Would need to fetch albums
      totalViews: images.reduce((sum, img) => sum + img.stats.views, 0),
      totalDownloads: images.reduce((sum, img) => sum + img.stats.downloads, 0),
      storageUsed: images.reduce((sum, img) => sum + img.fileSize, 0),
      featuredImages: images.filter((img) => img.isFeature).length,
      publicImages: images.filter((img) => img.status === "public").length,
      privateImages: images.filter((img) => img.status === "private").length,
    };
    return stats;
  }
}

const galleryService = new GalleryService();

const AdminGalleryComplete: React.FC = () => {
  // State management
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [stats, setStats] = useState<GalleryStats>({
    totalImages: 0,
    totalAlbums: 0,
    totalViews: 0,
    totalDownloads: 0,
    storageUsed: 0,
    featuredImages: 0,
    publicImages: 0,
    privateImages: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    title: "",
    description: "",
    category: "",
    album: "",
    tags: [],
    eventName: "",
    eventDate: "",
    location: "",
    photographer: "",
    isFeature: false,
    isFavorite: false,
    status: "public",
  });
  const [albumFormData, setAlbumFormData] = useState<Partial<Album>>({
    name: "",
    description: "",
  });
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadGalleryData();
  }, []);

  // Update stats when images change
  useEffect(() => {
    loadStats();
  }, [images]);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      const [imagesData, albumsData] = await Promise.all([
        galleryService.getAllImages(),
        galleryService.getAllAlbums(),
      ]);
      setImages(imagesData);
      setAlbums(albumsData);
    } catch (error) {
      showNotification("error", "Failed to load gallery data");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await galleryService.getGalleryStats(images);
      setStats({
        ...statsData,
        totalAlbums: albums.length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // Filter images
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || image.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || image.status === statusFilter;
    const matchesAlbum =
      selectedAlbum === "all" || image.album === selectedAlbum;

    return matchesSearch && matchesCategory && matchesStatus && matchesAlbum;
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAlbumInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAlbumFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);
  };

  // Modal functions
  const openUploadModal = () => {
    setModalMode("upload");
    setUploadFiles([]);
    setUploadProgress(0);
  };

  const openCreateAlbumModal = () => {
    setModalMode("album");
    setAlbumFormData({
      name: "",
      description: "",
    });
  };

  const openEditModal = (image: GalleryImage) => {
    setModalMode("edit");
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      category: image.category,
      album: image.album,
      tags: image.tags,
      eventName: image.eventName,
      eventDate: image.eventDate,
      location: image.location,
      photographer: image.photographer,
      isFeature: image.isFeature,
      isFavorite: image.isFavorite,
      status: image.status,
    });
  };

  const openViewModal = (image: GalleryImage) => {
    setModalMode("view");
    setSelectedImage(image);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedImage(null);
    setUploadFiles([]);
    setFormData({
      title: "",
      description: "",
      category: "",
      album: "",
      tags: [],
      eventName: "",
      eventDate: "",
      location: "",
      photographer: "",
      isFeature: false,
      isFavorite: false,
      status: "public",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "edit" && selectedImage) {
        await galleryService.updateImage(selectedImage.id!, formData);
        showNotification("success", "Image updated successfully!");
      }
      await loadGalleryData();
      closeModal();
    } catch (error) {
      showNotification("error", `Failed to ${modalMode} image`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const uploadResults = await cloudinaryService.uploadMultiple(
        uploadFiles,
        "gallery",
        setUploadProgress
      );

      for (let i = 0; i < uploadResults.length; i++) {
        const result = uploadResults[i];
        const file = uploadFiles[i];

        // Create image data
        const imageData: Omit<GalleryImage, "id" | "createdAt" | "updatedAt"> =
          {
            title: formData.title || file.name.split(".")[0],
            description: formData.description || "",
            url: result.url,
            publicId: result.publicId,
            thumbnailUrl: cloudinaryService.generateOptimizedUrl(
              result.publicId,
              {
                width: 300,
                height: 200,
                crop: "fill",
                quality: "auto",
              }
            ),
            category: formData.category || "general",
            album: formData.album || "",
            tags: formData.tags || [],
            eventName: formData.eventName || "",
            eventDate: formData.eventDate || "",
            location: formData.location || "",
            photographer: formData.photographer || "",
            uploadedBy: "admin", // Replace with actual user
            isFeature: formData.isFeature || false,
            isFavorite: formData.isFavorite || false,
            status: formData.status || "public",
            fileSize: file.size,
            dimensions: {
              width: 0, // Would need to read from image
              height: 0,
            },
            metadata: {
              dateCreated: new Date().toISOString(),
            },
            stats: {
              views: 0,
              downloads: 0,
              likes: 0,
              shares: 0,
            },
          };

        await galleryService.createImage(imageData);
      }

      showNotification(
        "success",
        `${uploadFiles.length} image(s) uploaded successfully!`
      );
      await loadGalleryData();
      closeModal();
    } catch (error) {
      showNotification("error", "Failed to upload images");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleCreateAlbum = async () => {
    if (!albumFormData.name) return;

    setIsSubmitting(true);
    try {
      await galleryService.createAlbum({
        name: albumFormData.name,
        description: albumFormData.description || "",
        imageCount: 0,
      });
      showNotification("success", "Album created successfully!");
      await loadGalleryData();
      closeModal();
    } catch (error) {
      showNotification("error", "Failed to create album");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (window.confirm(`Are you sure you want to delete "${image.title}"?`)) {
      try {
        await galleryService.deleteImage(image.id!, image.publicId);
        showNotification("success", "Image deleted successfully!");
        await loadGalleryData();
      } catch (error) {
        showNotification("error", "Failed to delete image");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedImages.length} image(s)?`
      )
    ) {
      try {
        for (const imageId of selectedImages) {
          const image = images.find((img) => img.id === imageId);
          if (image) {
            await galleryService.deleteImage(imageId, image.publicId);
          }
        }
        showNotification(
          "success",
          `${selectedImages.length} image(s) deleted successfully!`
        );
        setSelectedImages([]);
        await loadGalleryData();
      } catch (error) {
        showNotification("error", "Failed to delete images");
      }
    }
  };

  const handleToggleFeature = async (image: GalleryImage) => {
    try {
      await galleryService.updateImage(image.id!, {
        isFeature: !image.isFeature,
      });
      showNotification(
        "success",
        `Image ${image.isFeature ? "removed from" : "added to"} featured!`
      );
      await loadGalleryData();
    } catch (error) {
      showNotification("error", "Failed to update feature status");
    }
  };

  const handleToggleFavorite = async (image: GalleryImage) => {
    try {
      await galleryService.updateImage(image.id!, {
        isFavorite: !image.isFavorite,
      });
      await loadGalleryData();
    } catch (error) {
      showNotification("error", "Failed to update favorite status");
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    setSelectedImages(
      selectedImages.length === filteredImages.length
        ? []
        : filteredImages.map((img) => img.id!)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "public":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "private":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Image Card Component
  const ImageCard: React.FC<{ image: GalleryImage }> = ({ image }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={image.thumbnailUrl || image.url}
          alt={image.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <button
              onClick={() => openViewModal(image)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => openEditModal(image)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => handleDelete(image)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full backdrop-blur-sm transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={selectedImages.includes(image.id!)}
            onChange={() => handleImageSelect(image.id!)}
            className="w-4 h-4 text-purple-600 bg-white/20 backdrop-blur-sm border-white/30 rounded focus:ring-purple-500 focus:ring-2"
          />
        </div>

        {/* Status & Feature Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {image.isFeature && (
            <div className="px-2 py-1 bg-purple-500/80 text-white rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          <div
            className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(
              image.status
            )}`}
          >
            {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
          </div>
        </div>

        {/* Favorite Heart */}
        <button
          onClick={() => handleToggleFavorite(image)}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            image.isFavorite
              ? "bg-red-500/80 text-white"
              : "bg-white/20 text-white/60 hover:text-white"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${image.isFavorite ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Image Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 truncate">
          {image.title}
        </h3>

        {image.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {image.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>{image.category}</span>
          <span>{formatFileSize(image.fileSize)}</span>
        </div>

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {image.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {image.stats.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {image.stats.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {image.stats.likes}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleFeature(image)}
              className={`p-1 rounded transition-colors ${
                image.isFeature
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              <Star
                className={`w-4 h-4 ${image.isFeature ? "fill-current" : ""}`}
              />
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-red-500/20 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gallery Management
          </h1>
          <p className="text-gray-400">
            Upload, organize, and manage event photos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateAlbumModal}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            New Album
          </button>
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Upload Images
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4"
      >
        {[
          {
            title: "Total Images",
            value: stats.totalImages,
            color: "from-purple-500 to-purple-600",
            icon: ImageIcon,
          },
          {
            title: "Albums",
            value: stats.totalAlbums,
            color: "from-blue-500 to-blue-600",
            icon: Folder,
          },
          {
            title: "Total Views",
            value: stats.totalViews.toLocaleString(),
            color: "from-green-500 to-green-600",
            icon: Eye,
          },
          {
            title: "Downloads",
            value: stats.totalDownloads.toLocaleString(),
            color: "from-orange-500 to-orange-600",
            icon: Download,
          },
          {
            title: "Storage Used",
            value: formatFileSize(stats.storageUsed),
            color: "from-cyan-500 to-cyan-600",
            icon: Upload,
          },
          {
            title: "Featured",
            value: stats.featuredImages,
            color: "from-yellow-500 to-yellow-600",
            icon: Star,
          },
          {
            title: "Public",
            value: stats.publicImages,
            color: "from-emerald-500 to-emerald-600",
            icon: CheckCircle,
          },
          {
            title: "Private",
            value: stats.privateImages,
            color: "from-red-500 to-red-600",
            icon: AlertCircle,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
          >
            <div
              className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search images by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="events">Events</option>
            <option value="conferences">Conferences</option>
            <option value="workshops">Workshops</option>
            <option value="competitions">Competitions</option>
            <option value="networking">Networking</option>
            <option value="general">General</option>
          </select>

          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Albums</option>
            {albums.map((album) => (
              <option key={album.id} value={album.name}>
                {album.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedImages.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {selectedImages.length} image(s) selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {selectedImages.length === filteredImages.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl border border-white/10 animate-pulse"
              >
                <div className="aspect-square bg-white/10 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <ImageCard image={image} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or upload some images
            </p>
            <button
              onClick={openUploadModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
            >
              Upload First Images
            </button>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "upload" && "Upload Images"}
                  {modalMode === "edit" && "Edit Image"}
                  {modalMode === "view" && "Image Details"}
                  {modalMode === "album" && "Create Album"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                {modalMode === "upload" && (
                  <div className="p-6 space-y-6">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Images
                      </label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <Upload className="w-12 h-12 text-gray-400" />
                          <div>
                            <p className="text-white font-medium">
                              Click to upload images
                            </p>
                            <p className="text-gray-400 text-sm">
                              or drag and drop
                            </p>
                          </div>
                        </label>
                      </div>

                      {uploadFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-white font-medium mb-2">
                            {uploadFiles.length} file(s) selected
                          </p>
                          <div className="space-y-2">
                            {uploadFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-white/5 rounded"
                              >
                                <span className="text-gray-300 text-sm">
                                  {file.name}
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">
                            Upload Progress
                          </span>
                          <span className="text-white font-medium">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title (optional for bulk)
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Image title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="">Select category</option>
                          <option value="events">Events</option>
                          <option value="conferences">Conferences</option>
                          <option value="workshops">Workshops</option>
                          <option value="competitions">Competitions</option>
                          <option value="networking">Networking</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="Image description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Album
                        </label>
                        <select
                          name="album"
                          value={formData.album || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="">No album</option>
                          {albums.map((album) => (
                            <option key={album.id} value={album.name}>
                              {album.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Name
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={formData.eventName || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Event name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Date
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Event location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Photographer
                      </label>
                      <input
                        type="text"
                        name="photographer"
                        value={formData.photographer || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Photographer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags?.join(", ") || ""}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., conference, startup, networking"
                      />
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isFeature"
                          name="isFeature"
                          checked={formData.isFeature || false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label
                          htmlFor="isFeature"
                          className="text-sm font-medium text-gray-300"
                        >
                          Mark as featured
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status || "public"}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={uploadFiles.length === 0 || isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload {uploadFiles.length} Image(s)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {modalMode === "album" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Album Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={albumFormData.name || ""}
                        onChange={handleAlbumInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Enter album name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={albumFormData.description || ""}
                        onChange={handleAlbumInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="Album description"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateAlbum}
                        disabled={!albumFormData.name || isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Create Album
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {modalMode === "view" && selectedImage && (
                  <div className="p-6 space-y-6">
                    {/* Large Image */}
                    <div className="relative">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    </div>

                    {/* Image Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Image Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-400 text-sm">Title</p>
                            <p className="text-white">{selectedImage.title}</p>
                          </div>
                          {selectedImage.description && (
                            <div>
                              <p className="text-gray-400 text-sm">
                                Description
                              </p>
                              <p className="text-white">
                                {selectedImage.description}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-400 text-sm">Category</p>
                            <p className="text-white">
                              {selectedImage.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Status</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                                selectedImage.status
                              )}`}
                            >
                              {selectedImage.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Statistics
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Views</span>
                            <span className="text-white">
                              {selectedImage.stats.views}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              Downloads
                            </span>
                            <span className="text-white">
                              {selectedImage.stats.downloads}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Likes</span>
                            <span className="text-white">
                              {selectedImage.stats.likes}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              File Size
                            </span>
                            <span className="text-white">
                              {formatFileSize(selectedImage.fileSize)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalMode === "edit" && selectedImage && (
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Image title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="">Select category</option>
                          <option value="events">Events</option>
                          <option value="conferences">Conferences</option>
                          <option value="workshops">Workshops</option>
                          <option value="competitions">Competitions</option>
                          <option value="networking">Networking</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="Image description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Album
                        </label>
                        <select
                          name="album"
                          value={formData.album || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="">No album</option>
                          {albums.map((album) => (
                            <option key={album.id} value={album.name}>
                              {album.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Name
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={formData.eventName || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Event name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Event Date
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Event location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Photographer
                      </label>
                      <input
                        type="text"
                        name="photographer"
                        value={formData.photographer || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Photographer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags?.join(", ") || ""}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="e.g., conference, startup, networking"
                      />
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="editIsFeature"
                          name="isFeature"
                          checked={formData.isFeature || false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label
                          htmlFor="editIsFeature"
                          className="text-sm font-medium text-gray-300"
                        >
                          Mark as featured
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="editIsFavorite"
                          name="isFavorite"
                          checked={formData.isFavorite || false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <label
                          htmlFor="editIsFavorite"
                          className="text-sm font-medium text-gray-300"
                        >
                          Mark as favorite
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status || "public"}
                          onChange={handleInputChange}
                          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update Image
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGalleryComplete;
