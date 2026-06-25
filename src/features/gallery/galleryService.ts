import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type {
  Album,
  AlbumFormValues,
  GalleryImage,
  GalleryImageFormValues,
  GalleryOverviewStats,
} from "./types";

const IMAGES_COLLECTION = "gallery_images";
const ALBUMS_COLLECTION = "gallery_albums";

/** Data-access layer for the public gallery. Pure Firestore reads — no UI. */
export async function listPublicImages(): Promise<GalleryImage[]> {
  const q = query(
    collection(db, IMAGES_COLLECTION),
    where("status", "==", "public"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryImage[];
}

export async function listAlbums(): Promise<Album[]> {
  const q = query(
    collection(db, ALBUMS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Album[];
}

/** Admin: every image regardless of status, newest first. */
export async function listAllImages(): Promise<GalleryImage[]> {
  const q = query(
    collection(db, IMAGES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryImage[];
}

/** Admin: create a single image document (image already uploaded to Cloudinary). */
export async function createImage(
  values: GalleryImageFormValues & {
    url: string;
    publicId: string;
    thumbnailUrl?: string;
  }
): Promise<void> {
  await addDoc(collection(db, IMAGES_COLLECTION), {
    ...values,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateImage(
  id: string,
  values: Partial<GalleryImage>
): Promise<void> {
  await updateDoc(doc(db, IMAGES_COLLECTION, id), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteImage(id: string): Promise<void> {
  await deleteDoc(doc(db, IMAGES_COLLECTION, id));
}

export async function createAlbum(values: AlbumFormValues): Promise<void> {
  await addDoc(collection(db, ALBUMS_COLLECTION), {
    ...values,
    description: values.description ?? "",
    imageCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function deleteAlbum(id: string): Promise<void> {
  await deleteDoc(doc(db, ALBUMS_COLLECTION, id));
}

/** Build a Cloudinary thumbnail URL from an uploaded image's secure URL. */
export function buildThumbnailUrl(
  url: string,
  width = 300,
  height = 200
): string {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const transform = `c_fill,q_auto,w_${width},h_${height}/`;
  return (
    url.slice(0, idx + marker.length) +
    transform +
    url.slice(idx + marker.length)
  );
}

/** Derive dashboard counters from the loaded image + album lists. */
export function computeOverviewStats(
  images: GalleryImage[],
  albums: Album[]
): GalleryOverviewStats {
  return {
    totalImages: images.length,
    totalAlbums: albums.length,
    totalViews: images.reduce((sum, img) => sum + (img.stats?.views ?? 0), 0),
    totalDownloads: images.reduce(
      (sum, img) => sum + (img.stats?.downloads ?? 0),
      0
    ),
    storageUsed: images.reduce((sum, img) => sum + (img.fileSize ?? 0), 0),
    featuredImages: images.filter((img) => img.isFeature).length,
    publicImages: images.filter((img) => img.status === "public").length,
    privateImages: images.filter((img) => img.status === "private").length,
  };
}
