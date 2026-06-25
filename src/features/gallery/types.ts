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

/** Shape the create/edit image form works with (no server-managed fields). */
export type GalleryImageFormValues = Omit<
  GalleryImage,
  "id" | "url" | "publicId" | "thumbnailUrl" | "createdAt" | "updatedAt"
>;

/** Shape the create-album form works with. */
export type AlbumFormValues = Pick<Album, "name" | "description">;

/** Aggregate counters shown on the admin dashboard cards. */
export interface GalleryOverviewStats {
  totalImages: number;
  totalAlbums: number;
  totalViews: number;
  totalDownloads: number;
  storageUsed: number;
  featuredImages: number;
  publicImages: number;
  privateImages: number;
}

export const GALLERY_STATUSES: GalleryStatus[] = [
  "public",
  "private",
  "archived",
];

export const GALLERY_CATEGORIES = [
  "events",
  "conferences",
  "workshops",
  "competitions",
  "networking",
  "general",
];

export const GALLERY_STATUS_TONE: Record<
  GalleryStatus,
  "success" | "warning" | "neutral"
> = {
  public: "success",
  private: "warning",
  archived: "neutral",
};

export const EMPTY_GALLERY_IMAGE: GalleryImageFormValues = {
  title: "",
  description: "",
  category: "",
  album: "",
  tags: [],
  eventName: "",
  eventDate: "",
  location: "",
  photographer: "",
  uploadedBy: "admin",
  isFeature: false,
  isFavorite: false,
  status: "public",
  fileSize: 0,
  dimensions: { width: 0, height: 0 },
  metadata: {},
  stats: { views: 0, downloads: 0, likes: 0, shares: 0 },
};

export const EMPTY_ALBUM: AlbumFormValues = {
  name: "",
  description: "",
};
