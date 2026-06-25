import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Album, GalleryImage } from "./types";

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
