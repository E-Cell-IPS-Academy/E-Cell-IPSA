import { orderBy, where } from "firebase/firestore";
import { useCollection } from "@/shared/hooks";
import { sortByCreatedAtDesc } from "@/shared/lib/sort";
import type { Album, GalleryImage } from "../types";

/**
 * Live subscription to public gallery images, newest first. Built on the shared
 * `useCollection` hook so listener cleanup and error handling are centralized.
 */
export function useGalleryImages() {
  const result = useCollection<GalleryImage>(
    "gallery_images",
    where("status", "==", "public")
  );
  return { ...result, data: sortByCreatedAtDesc(result.data) };
}

/** Live subscription to gallery albums, newest first. */
export function useAlbums() {
  return useCollection<Album>("gallery_albums", orderBy("createdAt", "desc"));
}
