// /src/pages/admin/AdminBlogsComplete.tsx
import React, {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Calendar,
  User,
  Link,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Palette,
  Type,
  ExternalLink,
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
    folder: string = "blogs"
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

  async deleteFile(publicId: string): Promise<void> {
    try {
      console.log("Delete image:", publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  }
}

const cloudinaryService = new CloudinaryService();

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

interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
}

type ModalMode = "create" | "edit" | "view" | null;

// Rich Text Editor Component
const RichTextEditor: React.FC<{
  content: string;
  onChange: (content: string) => void;
}> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      const result = await cloudinaryService.uploadFile(
        imageFile,
        "blogs/content"
      );
      const imgTag = `<img src="${result.url}" alt="Blog image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
      execCommand("insertHTML", imgTag);
      setImageFile(null);
      setShowImageUpload(false);
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const changeFontSize = (size: string) => {
    execCommand("fontSize", size);
  };

  const changeTextColor = (color: string) => {
    execCommand("foreColor", color);
  };

  const changeBackgroundColor = (color: string) => {
    execCommand("backColor", color);
  };

  return (
    <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/20 bg-white/5">
        {/* Font Size */}
        <select
          onChange={(e) => changeFontSize(e.target.value)}
          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        <div className="w-px h-6 bg-white/20" />

        {/* Basic Formatting */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20" />

        {/* Text Color */}
        <div className="relative group">
          <button
            className="p-2 hover:bg-white/20 rounded transition-colors"
            title="Text Color"
          >
            <Palette className="w-4 h-4 text-white" />
          </button>
          <div className="absolute top-8 left-0 hidden group-hover:flex bg-black/90 border border-white/20 rounded-lg p-2 gap-1 z-10">
            {[
              "#000000",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#FF00FF",
              "#00FFFF",
              "#FFFFFF",
            ].map((color) => (
              <button
                key={color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => changeTextColor(color)}
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="relative group">
          <button
            className="p-2 hover:bg-white/20 rounded transition-colors"
            title="Background Color"
          >
            <Type className="w-4 h-4 text-white" />
          </button>
          <div className="absolute top-8 left-0 hidden group-hover:flex bg-black/90 border border-white/20 rounded-lg p-2 gap-1 z-10">
            {[
              "transparent",
              "#FFFF00",
              "#00FF00",
              "#00FFFF",
              "#FF00FF",
              "#FF0000",
              "#0000FF",
            ].map((color) => (
              <button
                key={color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => changeBackgroundColor(color)}
                className="w-6 h-6 rounded border border-white/20"
                style={{
                  backgroundColor: color === "transparent" ? "#333" : color,
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-white/20" />

        {/* Alignment */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyLeft")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyCenter")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyRight")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20" />

        {/* Lists */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20" />

        {/* Quote and Code */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("formatBlock", "blockquote")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("formatBlock", "pre")}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Code Block"
        >
          <Code className="w-4 h-4 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20" />

        {/* Link and Image */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4 text-white" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowImageUpload(true)}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4 text-white" />
        </button>

        {/* Headings */}
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
        >
          <option value="div">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 text-white bg-white/5 focus:outline-none"
        style={{
          lineHeight: "1.6",
          fontSize: "16px",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          execCommand("insertText", text);
        }}
      />

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Insert Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full mb-4 text-white"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowImageUpload(false)}
                className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                disabled={!imageFile || uploadingImage}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {uploadingImage ? "Uploading..." : "Insert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Blog service
class BlogService {
  private collection = "blogs";

  async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blogs");
    }
  }

  async createBlog(
    blogData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
    featuredImageFile?: File
  ): Promise<void> {
    try {
      let featuredImageUrl = "";
      let featuredImagePublicId = "";

      if (featuredImageFile) {
        const imageResult = await cloudinaryService.uploadFile(
          featuredImageFile,
          "blogs/featured"
        );
        featuredImageUrl = imageResult.url;
        featuredImagePublicId = imageResult.publicId;
      }

      // Calculate read time (average 200 words per minute)
      const wordCount = blogData.content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      await addDoc(collection(db, this.collection), {
        ...blogData,
        featuredImage: featuredImageUrl,
        featuredImagePublicId,
        readTime,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error("Failed to create blog");
    }
  }

  async updateBlog(
    blogId: string,
    blogData: Partial<BlogPost>,
    featuredImageFile?: File
  ): Promise<void> {
    try {
      const updateData: any = {
        ...blogData,
        updatedAt: serverTimestamp(),
      };

      if (featuredImageFile) {
        const imageResult = await cloudinaryService.uploadFile(
          featuredImageFile,
          "blogs/featured"
        );
        updateData.featuredImage = imageResult.url;
        updateData.featuredImagePublicId = imageResult.publicId;
      }

      // Recalculate read time if content changed
      if (blogData.content) {
        const wordCount = blogData.content
          .replace(/<[^>]*>/g, "")
          .split(/\s+/).length;
        updateData.readTime = Math.ceil(wordCount / 200);
      }

      await updateDoc(doc(db, this.collection, blogId), updateData);
    } catch (error) {
      console.error("Error updating blog:", error);
      throw new Error("Failed to update blog");
    }
  }

  async deleteBlog(
    blogId: string,
    featuredImagePublicId?: string
  ): Promise<void> {
    try {
      if (featuredImagePublicId) {
        await cloudinaryService.deleteFile(featuredImagePublicId);
      }
      await deleteDoc(doc(db, this.collection, blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw new Error("Failed to delete blog");
    }
  }

  async getBlogStats(blogs: BlogPost[]): Promise<BlogStats> {
    const stats = {
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      draft: blogs.filter((b) => b.status === "draft").length,
      archived: blogs.filter((b) => b.status === "archived").length,
      totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
    };
    return stats;
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
}

const blogService = new BlogService();

const AdminBlogsComplete: React.FC = () => {
  // State management
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalViews: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    category: "",
    tags: [],
    author: {
      name: "",
      email: "",
      bio: "",
    },
    publishedDate: "",
    seoTitle: "",
    seoDescription: "",
    isFeature: false,
    viewCount: 0,
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("");

  // Load blogs on component mount
  useEffect(() => {
    loadBlogs();
  }, []);

  // Update stats when blogs change
  useEffect(() => {
    loadStats();
  }, [blogs]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && modalMode === "create") {
      setFormData((prev) => ({
        ...prev,
        slug: blogService.generateSlug(prev.title),
      }));
    }
  }, [formData.title, modalMode]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await blogService.getAllBlogs();
      setBlogs(blogsData);
    } catch (error) {
      showNotification("error", "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await blogService.getBlogStats(blogs);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const handleAuthorChange = (field: keyof Author, value: string) => {
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showNotification("error", "Please select a valid image file");
        return;
      }

      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setFeaturedImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  // Modal functions
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      category: "",
      tags: [],
      author: {
        name: "",
        email: "",
        bio: "",
      },
      publishedDate: "",
      seoTitle: "",
      seoDescription: "",
      isFeature: false,
      viewCount: 0,
    });
    setFeaturedImageFile(null);
    setFeaturedImagePreview("");
  };

  const openEditModal = (blog: BlogPost) => {
    setModalMode("edit");
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      status: blog.status,
      category: blog.category,
      tags: blog.tags || [],
      author: blog.author,
      publishedDate: blog.publishedDate || "",
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      isFeature: blog.isFeature,
      viewCount: blog.viewCount,
    });
    setFeaturedImagePreview(blog.featuredImage || "");
    setFeaturedImageFile(null);
  };

  const openViewModal = (blog: BlogPost) => {
    setModalMode("view");
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedBlog(null);
    setFeaturedImageFile(null);
    setFeaturedImagePreview("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "create") {
        await blogService.createBlog(formData, featuredImageFile || undefined);
        showNotification("success", "Blog post created successfully!");
      } else if (modalMode === "edit" && selectedBlog) {
        await blogService.updateBlog(
          selectedBlog.id!,
          formData,
          featuredImageFile || undefined
        );
        showNotification("success", "Blog post updated successfully!");
      }

      await loadBlogs();
      closeModal();
    } catch (error) {
      showNotification("error", `Failed to ${modalMode} blog post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await blogService.deleteBlog(blog.id!, blog.featuredImagePublicId);
        showNotification("success", "Blog post deleted successfully!");
        await loadBlogs();
      } catch (error) {
        showNotification("error", "Failed to delete blog post");
      }
    }
  };

  const handleStatusChange = async (
    blog: BlogPost,
    newStatus: BlogPost["status"]
  ) => {
    try {
      await blogService.updateBlog(blog.id!, { status: newStatus });
      showNotification("success", "Blog status updated!");
      await loadBlogs();
    } catch (error) {
      showNotification("error", "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Blog Card Component
  const BlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Featured Image */}
      <div className="relative h-48">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
            blog.status
          )}`}
        >
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </div>

        {/* Feature Badge */}
        {blog.isFeature && (
          <div className="absolute top-4 right-16 px-3 py-1 bg-purple-500/80 text-white rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Actions Menu */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-8 bg-black/90 border border-white/20 rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-32">
              <button
                onClick={() => openViewModal(blog)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => openEditModal(blog)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Details */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
            {blog.category}
          </span>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Calendar className="w-3 h-3" />
            {blog.publishedDate
              ? new Date(blog.publishedDate).toLocaleDateString()
              : "Not published"}
          </div>
        </div>

        {/* Title & Excerpt */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{blog.readTime || 0} min read</span>
            <span>{blog.viewCount} views</span>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <select
            value={blog.status}
            onChange={(e) =>
              handleStatusChange(blog, e.target.value as BlogPost["status"])
            }
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex items-center gap-2">
            <a
              href={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="View Live"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
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
              Blog Management
            </h1>
            <p className="text-gray-400">
              Create, edit, and manage blog posts with rich content
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {[
            {
              title: "Total Posts",
              value: stats.total,
              color: "from-purple-500 to-purple-600",
              icon: FileText,
            },
            {
              title: "Published",
              value: stats.published,
              color: "from-green-500 to-green-600",
              icon: CheckCircle,
            },
            {
              title: "Draft",
              value: stats.draft,
              color: "from-yellow-500 to-yellow-600",
              icon: Edit,
            },
            {
              title: "Archived",
              value: stats.archived,
              color: "from-gray-500 to-gray-600",
              icon: FileText,
            },
            {
              title: "Total Views",
              value: stats.totalViews.toLocaleString(),
              color: "from-blue-500 to-blue-600",
              icon: Eye,
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
              <h3 className="text-xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
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
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse"
                >
                  <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria
              </p>
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
              >
                Create First Post
              </button>
            </div>
          )}
        </motion.div>

        {/* Modal */}
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
                className="bg-gray-900 border border-white/20 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {modalMode === "create" && "Create New Blog Post"}
                    {modalMode === "edit" && "Edit Blog Post"}
                    {modalMode === "view" && "Blog Post Details"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                  {modalMode === "view" && selectedBlog ? (
                    /* View Mode */
                    <div className="p-6 space-y-6">
                      {/* Featured Image */}
                      {selectedBlog.featuredImage && (
                        <img
                          src={selectedBlog.featuredImage}
                          alt={selectedBlog.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}

                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                              selectedBlog.status
                            )}`}
                          >
                            {selectedBlog.status}
                          </span>
                          {selectedBlog.isFeature && (
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                              Featured
                            </span>
                          )}
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            {selectedBlog.category}
                          </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">
                          {selectedBlog.title}
                        </h1>
                        <p className="text-gray-300 text-lg mb-6">
                          {selectedBlog.excerpt}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Article Info
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-gray-400 text-sm">Author</p>
                              <p className="text-white">
                                {selectedBlog.author.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">
                                Published Date
                              </p>
                              <p className="text-white">
                                {selectedBlog.publishedDate
                                  ? new Date(
                                      selectedBlog.publishedDate
                                    ).toLocaleDateString()
                                  : "Not published"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Read Time</p>
                              <p className="text-white">
                                {selectedBlog.readTime || 0} minutes
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Views</p>
                              <p className="text-white">
                                {selectedBlog.viewCount} views
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            SEO & URLs
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-gray-400 text-sm">Slug</p>
                              <p className="text-white font-mono text-sm">
                                {selectedBlog.slug}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">SEO Title</p>
                              <p className="text-white">
                                {selectedBlog.seoTitle || "Not set"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">
                                SEO Description
                              </p>
                              <p className="text-white">
                                {selectedBlog.seoDescription || "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedBlog.tags.map((tag, index) => (
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

                      {/* Content Preview */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Content Preview
                        </h3>
                        <div
                          className="prose prose-invert max-w-none bg-white/5 rounded-lg p-6 border border-white/10"
                          dangerouslySetInnerHTML={{
                            __html: selectedBlog.content,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Create/Edit Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            placeholder="Enter blog title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Slug *
                          </label>
                          <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            placeholder="url-friendly-slug"
                            required
                          />
                        </div>
                      </div>

                      {/* Category and Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Entrepreneurship">
                              Entrepreneurship
                            </option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Innovation">Innovation</option>
                            <option value="Startup Stories">
                              Startup Stories
                            </option>
                            <option value="Tips & Guides">Tips & Guides</option>
                            <option value="News">News</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Published Date
                          </label>
                          <input
                            type="date"
                            name="publishedDate"
                            value={formData.publishedDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Excerpt *
                        </label>
                        <textarea
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Brief description of the blog post"
                          required
                        />
                      </div>

                      {/* Featured Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Featured Image
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="featured-image-upload"
                          />
                          <label
                            htmlFor="featured-image-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </label>
                          {featuredImagePreview && (
                            <img
                              src={featuredImagePreview}
                              alt="Featured Preview"
                              className="w-20 h-12 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content Editor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Content *
                        </label>
                        <RichTextEditor
                          content={formData.content}
                          onChange={(content) =>
                            setFormData((prev) => ({ ...prev, content }))
                          }
                        />
                      </div>

                      {/* Author Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Author Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Author Name *
                            </label>
                            <input
                              type="text"
                              value={formData.author.name}
                              onChange={(e) =>
                                handleAuthorChange("name", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="Author name"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Author Email *
                            </label>
                            <input
                              type="email"
                              value={formData.author.email}
                              onChange={(e) =>
                                handleAuthorChange("email", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="author@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Author Bio
                          </label>
                          <textarea
                            value={formData.author.bio || ""}
                            onChange={(e) =>
                              handleAuthorChange("bio", e.target.value)
                            }
                            rows={2}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                            placeholder="Brief author bio"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.tags.join(", ")}
                          onChange={(e) => handleTagsChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., startup, technology, innovation"
                        />
                      </div>

                      {/* SEO Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          SEO Settings
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              SEO Title
                            </label>
                            <input
                              type="text"
                              name="seoTitle"
                              value={formData.seoTitle}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              placeholder="SEO optimized title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              SEO Description
                            </label>
                            <textarea
                              name="seoDescription"
                              value={formData.seoDescription}
                              onChange={handleInputChange}
                              rows={2}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                              placeholder="SEO meta description"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Featured Post Toggle */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isFeature"
                          name="isFeature"
                          checked={formData.isFeature}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label
                          htmlFor="isFeature"
                          className="text-sm font-medium text-gray-300"
                        >
                          Mark as featured post
                        </label>
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
                              {modalMode === "create"
                                ? "Creating..."
                                : "Updating..."}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {modalMode === "create"
                                ? "Create Post"
                                : "Update Post"}
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

export default AdminBlogsComplete;
