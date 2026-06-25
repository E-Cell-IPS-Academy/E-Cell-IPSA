import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useCloudinaryUpload } from "../../shared/hooks/useCloudinaryUpload";
import { Spinner } from "../../shared/ui/Spinner";
import { cn } from "../../shared/lib/cn";

interface ImageUploaderProps {
  value?: string;
  onUploaded: (url: string, publicId: string) => void;
  onError?: (message: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

/**
 * Drag-and-drop / click image uploader backed by Cloudinary unsigned uploads.
 * Replaces the per-page upload widgets across the admin section.
 */
export function ImageUploader({
  value,
  onUploaded,
  onError,
  folder,
  label = "Upload image",
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload, uploading, progress } = useCloudinaryUpload();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError?.("Please choose an image file.");
      return;
    }
    try {
      const result = await upload(file, { folder, resourceType: "image" });
      onUploaded(result.secureUrl, result.publicId);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
          dragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded preview"
              className="max-h-32 rounded-lg object-contain"
            />
            <span className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-500 shadow-sm">
              <X
                className="h-4 w-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onUploaded("", "");
                }}
              />
            </span>
          </>
        ) : uploading ? (
          <>
            <Spinner />
            <p className="text-sm text-slate-500">Uploading… {progress}%</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-7 w-7 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-xs text-slate-400">
              Drag &amp; drop or click to browse
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
