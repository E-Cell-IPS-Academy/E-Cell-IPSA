import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions } from "cloudinary";

// Configure Cloudinary (you'll need to set these environment variables)
cloudinary.config({
  cloud_name: "dszmnqzhk",
  api_key: "676712822751913",
  api_secret: "xDXxBdqO4vBH2y7vk47rgIla4Ck",
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  transformation?: any[];
  quality?: string | number;
  format?: string;
  width?: number;
  height?: number;
  crop?: string;
  overwrite?: boolean;
  unique_filename?: boolean;
  use_filename?: boolean;
  eager?: any[];
  tags?: string[];
}

class CloudinaryService {
  // Upload file to Cloudinary
  async uploadFile(
    file: File,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Convert File to base64 for upload
      const fileBuffer = await this.fileToBuffer(file);
      const base64File = `data:${file.type};base64,${fileBuffer.toString(
        "base64"
      )}`;

      const uploadOptions: UploadApiOptions = {
        resource_type: "auto" as const,
        quality: "auto",
        fetch_format: "auto",
        ...options,
      };

      const result = await cloudinary.uploader.upload(
        base64File,
        uploadOptions
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload file to Cloudinary");
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileOptions = {
          ...options,
          public_id: options.public_id
            ? `${options.public_id}_${index}`
            : undefined,
        };
        return this.uploadFile(file, fileOptions);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw new Error("Failed to upload multiple files");
    }
  }

  // Upload from URL
  async uploadFromUrl(
    url: string,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions: UploadApiOptions = {
        resource_type: "auto" as const,
        quality: "auto",
        fetch_format: "auto",
        ...options,
      };

      const result = await cloudinary.uploader.upload(url, uploadOptions);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
      };
    } catch (error) {
      console.error("Error uploading from URL:", error);
      throw new Error("Failed to upload from URL");
    }
  }

  // Delete file from Cloudinary
  async deleteFile(
    publicId: string,
    resourceType: string = "auto"
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type:
          resourceType === "auto"
            ? "image"
            : (resourceType as "image" | "video" | "raw"),
      });
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(
    publicIds: string[],
    resourceType: string = "auto"
  ): Promise<void> {
    try {
      const deletePromises = publicIds.map((publicId) =>
        this.deleteFile(publicId, resourceType)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting multiple files:", error);
      throw new Error("Failed to delete multiple files");
    }
  }

  // Generate optimized URL with transformations
  generateOptimizedUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
      effect?: string;
      overlay?: string;
      gravity?: string;
      radius?: string | number;
      opacity?: number;
      background?: string;
    } = {}
  ): string {
    try {
      return cloudinary.url(publicId, {
        ...transformations,
        secure: true,
        fetch_format: "auto",
        quality: transformations.quality || "auto",
      });
    } catch (error) {
      console.error("Error generating optimized URL:", error);
      return "";
    }
  }

  // Generate thumbnail
  generateThumbnail(
    publicId: string,
    size: number = 150,
    crop: string = "fill"
  ): string {
    return this.generateOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop,
      quality: "auto",
      format: "webp",
    });
  }

  // Generate responsive images
  generateResponsiveUrls(
    publicId: string,
    breakpoints: number[] = [400, 800, 1200, 1600]
  ): { [key: string]: string } {
    const responsiveUrls: { [key: string]: string } = {};

    breakpoints.forEach((width) => {
      responsiveUrls[`w_${width}`] = this.generateOptimizedUrl(publicId, {
        width,
        crop: "scale",
        quality: "auto",
        format: "webp",
      });
    });

    return responsiveUrls;
  }

  // Get file info
  async getFileInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error("Error getting file info:", error);
      throw new Error("Failed to get file info");
    }
  }

  // Search files by tags
  async searchByTags(tags: string[], maxResults: number = 50): Promise<any[]> {
    try {
      const result = await cloudinary.search
        .expression(`tags:${tags.join(" OR tags:")}`)
        .max_results(maxResults)
        .execute();

      return result.resources;
    } catch (error) {
      console.error("Error searching by tags:", error);
      throw new Error("Failed to search by tags");
    }
  }

  // Get usage statistics
  async getUsageStats(): Promise<any> {
    try {
      const result = await cloudinary.api.usage();
      return result;
    } catch (error) {
      console.error("Error getting usage stats:", error);
      throw new Error("Failed to get usage stats");
    }
  }

  // Create archive (zip) of multiple files
  async createArchive(
    publicIds: string[],
    archiveName: string = "archive"
  ): Promise<{ secure_url: string; public_id: string }> {
    try {
      const result = await cloudinary.uploader.create_archive({
        public_ids: publicIds,
        resource_type: "auto" as const,
        type: "upload",
        target_format: "zip",
        mode: "create",
        skip_transformation_name: true,
        flatten_folders: true,
        keep_derived: true,
        tags: ["archive"],
        public_id: archiveName,
      });

      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error("Error creating archive:", error);
      throw new Error("Failed to create archive");
    }
  }

  // Video specific methods
  async uploadVideo(
    file: File,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      ...options,
      resource_type: "video",
    });
  }

  // Generate video thumbnail
  generateVideoThumbnail(
    publicId: string,
    options: {
      startOffset?: string;
      width?: number;
      height?: number;
      crop?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      start_offset: options.startOffset || "0",
      width: options.width || 300,
      height: options.height || 200,
      crop: options.crop || "fill",
      quality: "auto",
      secure: true,
    });
  }

  // Convert video format
  async convertVideo(
    publicId: string,
    targetFormat: string,
    quality: string = "auto"
  ): Promise<string> {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        resource_type: "video",
        type: "upload",
        format: targetFormat,
        quality,
        invalidate: true,
      });

      return result.secure_url;
    } catch (error) {
      console.error("Error converting video:", error);
      throw new Error("Failed to convert video");
    }
  }

  // Image specific methods
  async uploadImage(
    file: File,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      ...options,
      resource_type: "image",
    });
  }

  // Auto-enhance image
  generateEnhancedImage(
    publicId: string,
    enhancements: {
      autoContrast?: boolean;
      autoBrightness?: boolean;
      autoColor?: boolean;
      sharpen?: boolean;
      denoise?: boolean;
    } = {}
  ): string {
    const effects = [];

    if (enhancements.autoContrast) effects.push("auto_contrast");
    if (enhancements.autoBrightness) effects.push("auto_brightness");
    if (enhancements.autoColor) effects.push("auto_color");
    if (enhancements.sharpen) effects.push("sharpen");
    if (enhancements.denoise) effects.push("noise");

    return this.generateOptimizedUrl(publicId, {
      effect: effects.join(":"),
      quality: "auto",
      format: "auto",
    });
  }

  // Helper method to convert File to Buffer
  private async fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(Buffer.from(reader.result));
        } else {
          reject(new Error("Failed to convert file to buffer"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  // Validate file type and size
  validateFile(
    file: File,
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): { isValid: boolean; error?: string } {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/mov",
        "video/avi",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      allowedExtensions,
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`,
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    // Check file extension if specified
    if (allowedExtensions) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File extension .${fileExtension} is not allowed`,
        };
      }
    }

    return { isValid: true };
  }

  // Bulk operations
  async bulkUpload(
    files: File[],
    options: CloudinaryUploadOptions & {
      onProgress?: (completed: number, total: number) => void;
      batchSize?: number;
    } = {}
  ): Promise<CloudinaryUploadResult[]> {
    const { onProgress, batchSize = 5, ...uploadOptions } = options;
    const results: CloudinaryUploadResult[] = [];

    try {
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((file) => this.uploadFile(file, uploadOptions))
        );

        results.push(...batchResults);

        if (onProgress) {
          onProgress(Math.min(i + batchSize, files.length), files.length);
        }
      }

      return results;
    } catch (error) {
      console.error("Error in bulk upload:", error);
      throw new Error("Failed to upload files in bulk");
    }
  }
}

export const cloudinaryService = new CloudinaryService();
