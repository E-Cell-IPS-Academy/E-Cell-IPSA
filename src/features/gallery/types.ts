import type { Timestamp } from "firebase/firestore";
import type { WithId } from "@/shared/hooks";

export type GalleryStatus = "public" | "private" | "archived";

export interface GalleryDimensions {
  width: number;
  height: number;
}

export interface GalleryMetadata {
  camera?: string;
  settings?: string;
  dateCreated?: string;
}

export interface GalleryStats {
  views: number;
  downloads: number;
  likes: number;
  shares: number;
}

/** A single gallery image document (`gallery_images` collection). */
export interface GalleryImage extends WithId {
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
  status: GalleryStatus;
  fileSize: number;
  dimensions: GalleryDimensions;
  metadata: GalleryMetadata;
  stats: GalleryStats;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** An album document (`gallery_albums` collection). */
export interface Album extends WithId {
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt?: Timestamp;
}
