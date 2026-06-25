import { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeOverviewStats,
  createAlbum,
  createImage,
  deleteAlbum,
  deleteImage,
  listAllImages,
  listAlbums,
  updateImage,
} from "../galleryService";
import type {
  Album,
  AlbumFormValues,
  GalleryImage,
  GalleryImageFormValues,
} from "../types";

type CreateImagePayload = GalleryImageFormValues & {
  url: string;
  publicId: string;
  thumbnailUrl?: string;
};

/**
 * Owns admin gallery state and operations. Operations throw on failure so the
 * page can surface a toast; the lists reload after each mutation.
 */
export function useGalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [imagesData, albumsData] = await Promise.all([
        listAllImages(),
        listAlbums(),
      ]);
      setImages(imagesData);
      setAlbums(albumsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(
    () => computeOverviewStats(images, albums),
    [images, albums]
  );

  const addImage = useCallback(
    async (payload: CreateImagePayload) => {
      await createImage(payload);
      await reload();
    },
    [reload]
  );

  const editImage = useCallback(
    async (id: string, values: Partial<GalleryImage>) => {
      await updateImage(id, values);
      await reload();
    },
    [reload]
  );

  const removeImage = useCallback(
    async (id: string) => {
      await deleteImage(id);
      await reload();
    },
    [reload]
  );

  const toggleFeature = useCallback(
    async (image: GalleryImage) => {
      await updateImage(image.id, { isFeature: !image.isFeature });
      await reload();
    },
    [reload]
  );

  const toggleFavorite = useCallback(
    async (image: GalleryImage) => {
      await updateImage(image.id, { isFavorite: !image.isFavorite });
      await reload();
    },
    [reload]
  );

  const addAlbum = useCallback(
    async (values: AlbumFormValues) => {
      await createAlbum(values);
      await reload();
    },
    [reload]
  );

  const removeAlbum = useCallback(
    async (id: string) => {
      await deleteAlbum(id);
      await reload();
    },
    [reload]
  );

  return {
    images,
    albums,
    loading,
    stats,
    reload,
    addImage,
    editImage,
    removeImage,
    toggleFeature,
    toggleFavorite,
    addAlbum,
    removeAlbum,
  };
}
