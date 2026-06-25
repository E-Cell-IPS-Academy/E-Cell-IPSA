import { useMemo, useState } from "react";
import {
  FolderPlus,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  Modal,
  Select,
  Spinner,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useGalleryAdmin } from "./hooks/useGalleryAdmin";
import { GalleryCard } from "./components/GalleryCard";
import { GalleryUploadForm } from "./components/GalleryUploadForm";
import { GalleryEditForm } from "./components/GalleryEditForm";
import { AlbumForm } from "./components/AlbumForm";
import { GalleryDetails } from "./components/GalleryDetails";
import { formatFileSize } from "./components/formatFileSize";
import { GALLERY_CATEGORIES, GALLERY_STATUSES } from "./types";
import type {
  AlbumFormValues,
  GalleryImage,
  GalleryImageFormValues,
} from "./types";
import type { UploadedImagePayload } from "./components/GalleryUploadForm";

type ModalMode = "upload" | "edit" | "view" | "album" | null;

const toFormValues = (img: GalleryImage): GalleryImageFormValues => ({
  title: img.title,
  description: img.description ?? "",
  category: img.category,
  album: img.album ?? "",
  tags: img.tags ?? [],
  eventName: img.eventName ?? "",
  eventDate: img.eventDate ?? "",
  location: img.location ?? "",
  photographer: img.photographer ?? "",
  uploadedBy: img.uploadedBy,
  isFeature: img.isFeature,
  isFavorite: img.isFavorite,
  status: img.status,
  fileSize: img.fileSize,
  dimensions: img.dimensions,
  metadata: img.metadata,
  stats: img.stats,
});

export function GalleryAdminPage() {
  const {
    images,
    albums,
    loading,
    stats,
    addImage,
    editImage,
    removeImage,
    toggleFeature,
    toggleFavorite,
    addAlbum,
  } = useGalleryAdmin();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [albumFilter, setAlbumFilter] = useState("all");
  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return images.filter((img) => {
      const matchesSearch =
        img.title.toLowerCase().includes(term) ||
        (img.description ?? "").toLowerCase().includes(term) ||
        (img.tags ?? []).some((tag) => tag.toLowerCase().includes(term));
      const matchesCategory =
        categoryFilter === "all" || img.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || img.status === statusFilter;
      const matchesAlbum = albumFilter === "all" || img.album === albumFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesAlbum;
    });
  }, [images, search, categoryFilter, statusFilter, albumFilter]);

  const closeModal = () => {
    setMode(null);
    setSelected(null);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      prev.length === filtered.length ? [] : filtered.map((i) => i.id)
    );

  const wrap = async (fn: () => Promise<void>, errorMessage: string) => {
    try {
      await fn();
    } catch {
      toast.error(errorMessage);
    }
  };

  const handleUpload = async (uploads: UploadedImagePayload[]) => {
    setSubmitting(true);
    try {
      for (const payload of uploads) {
        const { url, publicId, thumbnailUrl, ...values } = payload;
        await addImage({ ...values, url, publicId, thumbnailUrl });
      }
      toast.success(`${uploads.length} image(s) uploaded`);
      closeModal();
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values: GalleryImageFormValues) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await editImage(selected.id, values);
      toast.success("Image updated");
      closeModal();
    } catch {
      toast.error("Failed to update image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAlbum = async (values: AlbumFormValues) => {
    setSubmitting(true);
    try {
      await addAlbum(values);
      toast.success("Album created");
      closeModal();
    } catch {
      toast.error("Failed to create album");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (bulkDelete) {
        for (const id of selectedIds) await removeImage(id);
        toast.success(`${selectedIds.length} image(s) deleted`);
        setSelectedIds([]);
        setBulkDelete(false);
      } else if (pendingDelete) {
        await removeImage(pendingDelete.id);
        toast.success("Image deleted");
        setPendingDelete(null);
      }
    } catch {
      toast.error("Failed to delete image(s)");
    } finally {
      setDeleting(false);
    }
  };

  const statCards = [
    { label: "Images", value: stats.totalImages },
    { label: "Albums", value: stats.totalAlbums },
    { label: "Views", value: stats.totalViews.toLocaleString() },
    { label: "Downloads", value: stats.totalDownloads.toLocaleString() },
    { label: "Storage", value: formatFileSize(stats.storageUsed) },
    { label: "Featured", value: stats.featuredImages },
    { label: "Public", value: stats.publicImages },
    { label: "Private", value: stats.privateImages },
  ];

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Upload, organize, and manage event photos."
        actions={
          <>
            <Button
              variant="outline"
              leftIcon={<FolderPlus className="h-4 w-4" />}
              onClick={() => setMode("album")}
            >
              New album
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setMode("upload")}
            >
              Upload images
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {statCards.map((card) => (
          <Card key={card.label} className="p-4">
            <p className="text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by title, description, or tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            className="lg:w-44"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </Select>
          <Select
            className="lg:w-44"
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
          >
            <option value="all">All albums</option>
            {albums.map((album) => (
              <option key={album.id} value={album.name}>
                {album.name}
              </option>
            ))}
          </Select>
          <Select
            className="lg:w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {GALLERY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="font-medium">{selectedIds.length} selected</span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {selectedIds.length === filtered.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setBulkDelete(true)}
            >
              Delete selected
            </Button>
          </div>
        )}
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-10 w-10" />}
          title="No images found"
          description="Try adjusting your filters, or upload your first images."
          action={
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setMode("upload")}
            >
              Upload images
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((image) => (
            <GalleryCard
              key={image.id}
              image={image}
              selected={selectedIds.includes(image.id)}
              onToggleSelect={toggleSelect}
              onView={(img) => {
                setSelected(img);
                setMode("view");
              }}
              onEdit={(img) => {
                setSelected(img);
                setMode("edit");
              }}
              onDelete={setPendingDelete}
              onToggleFeature={(img) =>
                wrap(
                  () => toggleFeature(img),
                  "Failed to update feature status"
                )
              }
              onToggleFavorite={(img) =>
                wrap(
                  () => toggleFavorite(img),
                  "Failed to update favorite status"
                )
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={mode === "upload"}
        onClose={closeModal}
        size="xl"
        title="Upload images"
      >
        <GalleryUploadForm
          albums={albums}
          submitting={submitting}
          onSubmit={handleUpload}
          onCancel={closeModal}
          onError={(message) => toast.error(message)}
        />
      </Modal>

      <Modal
        open={mode === "edit"}
        onClose={closeModal}
        size="xl"
        title="Edit image"
      >
        {selected && (
          <GalleryEditForm
            initialValues={toFormValues(selected)}
            albums={albums}
            submitting={submitting}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        open={mode === "view"}
        onClose={closeModal}
        size="lg"
        title={selected?.title ?? "Image details"}
      >
        {selected && <GalleryDetails image={selected} />}
      </Modal>

      <Modal
        open={mode === "album"}
        onClose={closeModal}
        size="md"
        title="Create album"
      >
        <AlbumForm
          submitting={submitting}
          onSubmit={handleCreateAlbum}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete || bulkDelete}
        title={bulkDelete ? "Delete images" : "Delete image"}
        message={
          bulkDelete
            ? `Delete ${selectedIds.length} selected image(s)? This cannot be undone.`
            : `Delete "${pendingDelete?.title}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setPendingDelete(null);
          setBulkDelete(false);
        }}
      />
    </div>
  );
}
