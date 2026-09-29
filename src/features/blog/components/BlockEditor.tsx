"use client";

import { useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import {
    ChevronDown,
    ChevronUp,
    Copy,
    GripVertical,
    Heading,
    Image as ImageIcon,
    Images,
    List as ListIcon,
    Minus,
    Plus,
    Quote,
    Trash2,
    Type,
    Video,
    Code,
} from "lucide-react";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
    BLOCK_LABELS,
    INSERTABLE_BLOCKS,
    createBlock,
    newBlockId,
    optimizeImage,
} from "../types";
import type { BlockImage, BlockType, ContentBlock } from "../types";

export interface BlockEditorProps {
    blocks: ContentBlock[];
    onChange: (blocks: ContentBlock[]) => void;
    /** Cloudinary folder used for images dropped or picked inside the body. */
    folder?: string;
    onError?: (message: string) => void;
    /**
     * Optional direct uploader. When supplied, image files can be dropped
     * straight onto the editor. Without it, images are added via the picker.
     */
    uploadImage?: (file: File) => Promise<{ url: string; publicId?: string }>;
}

const BLOCK_ICONS: Record<BlockType, typeof Type> = {
    paragraph: Type,
    heading: Heading,
    image: ImageIcon,
    gallery: Images,
    quote: Quote,
    list: ListIcon,
    divider: Minus,
    video: Video,
    html: Code,
};

/* -------------------------------------------------------------------------- */

export function BlockEditor({
    blocks,
    onChange,
    folder = "blogs/content",
    onError,
    uploadImage,
}: BlockEditorProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [menuAt, setMenuAt] = useState<number | null>(null);
    const uploadingRef = useRef(false);

    const replace = (index: number, next: ContentBlock) =>
        onChange(blocks.map((b, i) => (i === index ? next : b)));

    const insertAt = (index: number, type: BlockType) => {
        const next = [...blocks];
        next.splice(index, 0, createBlock(type));
        onChange(next);
        setMenuAt(null);
    };

    const move = (from: number, to: number) => {
        if (to < 0 || to >= blocks.length || from === to) return;
        const next = [...blocks];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        onChange(next);
    };

    const remove = (index: number) =>
        onChange(blocks.filter((_, i) => i !== index));

    const duplicate = (index: number) => {
        const next = [...blocks];
        next.splice(index + 1, 0, { ...blocks[index], id: newBlockId() });
        onChange(next);
    };

    /* ----- drag to reorder ----- */
    const handleDragStart = (index: number) => setDragIndex(index);
    const handleDragOver = (index: number) => (e: DragEvent) => {
        if (dragIndex === null) return;
        e.preventDefault();
        setOverIndex(index);
    };
    const handleDrop = (index: number) => (e: DragEvent) => {
        e.preventDefault();
        if (dragIndex !== null) move(dragIndex, index);
        setDragIndex(null);
        setOverIndex(null);
    };

    /* ----- drop image files to upload ----- */
    const handleFileDrop = async (index: number, e: DragEvent) => {
        const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
            f.type.startsWith("image/")
        );
        if (files.length === 0 || !uploadImage || uploadingRef.current) return;
        e.preventDefault();
        uploadingRef.current = true;
        try {
            const uploaded = await Promise.all(files.map((f) => uploadImage(f)));
            const added: ContentBlock[] =
                uploaded.length === 1
                    ? [
                        {
                            id: newBlockId(),
                            type: "image",
                            url: uploaded[0].url,
                            publicId: uploaded[0].publicId,
                            alt: "",
                            caption: "",
                            align: "full",
                        },
                    ]
                    : [
                        {
                            id: newBlockId(),
                            type: "gallery",
                            columns: uploaded.length > 2 ? 3 : 2,
                            caption: "",
                            images: uploaded.map((u) => ({
                                url: u.url,
                                publicId: u.publicId,
                                alt: "",
                            })),
                        },
                    ];
            const next = [...blocks];
            next.splice(index, 0, ...added);
            onChange(next);
        } catch {
            onError?.("Could not upload that image. Try again.");
        } finally {
            uploadingRef.current = false;
        }
    };

    return (
        <div className="space-y-2">
            <Inserter
                open={menuAt === 0}
                onToggle={() => setMenuAt(menuAt === 0 ? null : 0)}
                onPick={(t) => insertAt(0, t)}
                onFileDrop={(e) => handleFileDrop(0, e)}
                acceptsFiles={!!uploadImage}
                label={blocks.length === 0 ? "Add the first block" : undefined}
            />

            {blocks.map((block, index) => {
                const Icon = BLOCK_ICONS[block.type];
                return (
                    <div key={block.id}>
                        <div
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnd={() => {
                                setDragIndex(null);
                                setOverIndex(null);
                            }}
                            onDragOver={handleDragOver(index)}
                            onDrop={handleDrop(index)}
                            className={`rounded-lg border bg-white transition-colors ${overIndex === index && dragIndex !== null
                                    ? "border-indigo-400 ring-2 ring-indigo-100"
                                    : "border-slate-200"
                                } ${dragIndex === index ? "opacity-50" : ""}`}
                        >
                            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                                <GripVertical
                                    className="h-4 w-4 cursor-grab text-slate-300"
                                    aria-hidden
                                />
                                <Icon className="h-4 w-4 text-slate-400" aria-hidden />
                                <span className="text-xs font-medium text-slate-600">
                                    {BLOCK_LABELS[block.type]}
                                </span>
                                <span className="text-xs text-slate-300">#{index + 1}</span>

                                <div className="ml-auto flex items-center gap-0.5">
                                    <IconBtn
                                        label="Move up"
                                        disabled={index === 0}
                                        onClick={() => move(index, index - 1)}
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </IconBtn>
                                    <IconBtn
                                        label="Move down"
                                        disabled={index === blocks.length - 1}
                                        onClick={() => move(index, index + 1)}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </IconBtn>
                                    <IconBtn label="Duplicate" onClick={() => duplicate(index)}>
                                        <Copy className="h-4 w-4" />
                                    </IconBtn>
                                    <IconBtn
                                        label="Remove block"
                                        danger
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </IconBtn>
                                </div>
                            </div>

                            <div className="p-3">
                                <BlockFields
                                    block={block}
                                    folder={folder}
                                    onError={onError}
                                    onChange={(next) => replace(index, next)}
                                />
                            </div>
                        </div>

                        <Inserter
                            open={menuAt === index + 1}
                            onToggle={() => setMenuAt(menuAt === index + 1 ? null : index + 1)}
                            onPick={(t) => insertAt(index + 1, t)}
                            onFileDrop={(e) => handleFileDrop(index + 1, e)}
                            acceptsFiles={!!uploadImage}
                        />
                    </div>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Insert control between blocks                                              */
/* -------------------------------------------------------------------------- */

function Inserter({
    open,
    onToggle,
    onPick,
    onFileDrop,
    acceptsFiles,
    label,
}: {
    open: boolean;
    onToggle: () => void;
    onPick: (type: BlockType) => void;
    onFileDrop: (e: DragEvent) => void;
    acceptsFiles: boolean;
    label?: string;
}) {
    const [hot, setHot] = useState(false);
    return (
        <div
            onDragOver={(e) => {
                if (acceptsFiles && e.dataTransfer?.types.includes("Files")) {
                    e.preventDefault();
                    setHot(true);
                }
            }}
            onDragLeave={() => setHot(false)}
            onDrop={(e) => {
                setHot(false);
                onFileDrop(e);
            }}
            className={`group relative flex items-center gap-2 py-1 ${hot ? "rounded-lg bg-indigo-50 ring-1 ring-indigo-200" : ""
                }`}
        >
            <div className="h-px flex-1 bg-slate-200" />
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
            >
                <Plus className="h-3.5 w-3.5" />
                {label ?? (hot ? "Drop image here" : "Add block")}
            </button>
            <div className="h-px flex-1 bg-slate-200" />

            {open && (
                <div className="absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                    <div className="grid grid-cols-3 gap-1">
                        {INSERTABLE_BLOCKS.map((t) => {
                            const Icon = BLOCK_ICONS[t];
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => onPick(t)}
                                    className="flex w-28 items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-100"
                                >
                                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                                    {BLOCK_LABELS[t]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function IconBtn({
    children,
    label,
    onClick,
    disabled,
    danger,
}: {
    children: ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className={`rounded p-1 transition-colors disabled:opacity-30 ${danger
                    ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }`}
        >
            {children}
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Per-type fields                                                            */
/* -------------------------------------------------------------------------- */

function BlockFields({
    block,
    folder,
    onError,
    onChange,
}: {
    block: ContentBlock;
    folder: string;
    onError?: (m: string) => void;
    onChange: (b: ContentBlock) => void;
}) {
    switch (block.type) {
        case "paragraph":
            return (
                <div className="space-y-2">
                    <Textarea
                        rows={4}
                        value={block.text}
                        placeholder="Write the paragraph. Inline <strong>, <em> and <a> are supported."
                        onChange={(e) => onChange({ ...block, text: e.target.value })}
                    />
                    <Check
                        label="Style as opening standfirst"
                        checked={!!block.lead}
                        onChange={(v) => onChange({ ...block, lead: v })}
                    />
                </div>
            );

        case "heading":
            return (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[7rem_1fr]">
                    <Select
                        value={String(block.level)}
                        onChange={(e) =>
                            onChange({
                                ...block,
                                level: Number(e.target.value) as 2 | 3 | 4,
                            })
                        }
                    >
                        <option value="2">Section</option>
                        <option value="3">Sub-section</option>
                        <option value="4">Minor</option>
                    </Select>
                    <Input
                        value={block.text}
                        placeholder="Heading text"
                        onChange={(e) => onChange({ ...block, text: e.target.value })}
                    />
                </div>
            );

        case "image":
            return (
                <div className="space-y-3">
                    <ImageUploader
                        label=""
                        value={block.url}
                        folder={folder}
                        onUploaded={(url, publicId) =>
                            onChange({ ...block, url, publicId })
                        }
                        onError={onError}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Input
                            label="Alt text"
                            value={block.alt}
                            placeholder="Describe the image for screen readers"
                            onChange={(e) => onChange({ ...block, alt: e.target.value })}
                        />
                        <Select
                            label="Width"
                            value={block.align}
                            onChange={(e) =>
                                onChange({
                                    ...block,
                                    align: e.target.value as typeof block.align,
                                })
                            }
                        >
                            <option value="full">Full column width</option>
                            <option value="center">Centred, inset</option>
                            <option value="left">Float left, text wraps</option>
                            <option value="right">Float right, text wraps</option>
                        </Select>
                    </div>
                    <Input
                        label="Caption"
                        value={block.caption ?? ""}
                        placeholder="Optional caption printed under the image"
                        onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    />
                </div>
            );

        case "gallery":
            return (
                <GalleryFields
                    block={block}
                    folder={folder}
                    onError={onError}
                    onChange={onChange}
                />
            );

        case "quote":
            return (
                <div className="space-y-3">
                    <Textarea
                        rows={3}
                        value={block.text}
                        placeholder="The quote"
                        onChange={(e) => onChange({ ...block, text: e.target.value })}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Input
                            label="Attribution"
                            value={block.attribution ?? ""}
                            placeholder="Name, role"
                            onChange={(e) =>
                                onChange({ ...block, attribution: e.target.value })
                            }
                        />
                        <Select
                            label="Treatment"
                            value={block.variant}
                            onChange={(e) =>
                                onChange({
                                    ...block,
                                    variant: e.target.value as typeof block.variant,
                                })
                            }
                        >
                            <option value="pull">Pull quote (large)</option>
                            <option value="block">Block quote (inline)</option>
                        </Select>
                    </div>
                </div>
            );

        case "list":
            return (
                <div className="space-y-3">
                    <Select
                        value={block.style}
                        onChange={(e) =>
                            onChange({
                                ...block,
                                style: e.target.value as typeof block.style,
                            })
                        }
                    >
                        <option value="bulleted">Bulleted</option>
                        <option value="numbered">Numbered</option>
                    </Select>
                    <div className="space-y-2">
                        {block.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-5 text-right text-xs text-slate-400">
                                    {block.style === "numbered" ? `${i + 1}.` : "•"}
                                </span>
                                <Input
                                    className="flex-1"
                                    value={item}
                                    placeholder="List item"
                                    onChange={(e) =>
                                        onChange({
                                            ...block,
                                            items: block.items.map((it, j) =>
                                                j === i ? e.target.value : it
                                            ),
                                        })
                                    }
                                />
                                <IconBtn
                                    label="Remove item"
                                    danger
                                    onClick={() =>
                                        onChange({
                                            ...block,
                                            items: block.items.filter((_, j) => j !== i),
                                        })
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </IconBtn>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => onChange({ ...block, items: [...block.items, ""] })}
                    >
                        Add item
                    </Button>
                </div>
            );

        case "divider":
            return (
                <p className="text-xs text-slate-400">
                    A thin rule marking a break in the article.
                </p>
            );

        case "video":
            return (
                <div className="space-y-3">
                    <Input
                        label="Video URL"
                        value={block.url}
                        placeholder="https://www.youtube.com/watch?v=…"
                        onChange={(e) => onChange({ ...block, url: e.target.value })}
                    />
                    <Input
                        label="Caption"
                        value={block.caption ?? ""}
                        onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    />
                </div>
            );

        case "html":
            return (
                <Textarea
                    rows={6}
                    value={block.html}
                    placeholder="<p>Raw HTML</p>"
                    hint="Escape hatch for embeds. Only trusted admins should use this."
                    onChange={(e) => onChange({ ...block, html: e.target.value })}
                />
            );

        default:
            return null;
    }
}

function GalleryFields({
    block,
    folder,
    onError,
    onChange,
}: {
    block: Extract<ContentBlock, { type: "gallery" }>;
    folder: string;
    onError?: (m: string) => void;
    onChange: (b: ContentBlock) => void;
}) {
    const setImages = (images: BlockImage[]) => onChange({ ...block, images });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                    label="Columns"
                    value={String(block.columns)}
                    onChange={(e) =>
                        onChange({ ...block, columns: Number(e.target.value) as 2 | 3 })
                    }
                >
                    <option value="2">Two across</option>
                    <option value="3">Three across</option>
                </Select>
                <Input
                    label="Gallery caption"
                    value={block.caption ?? ""}
                    onChange={(e) => onChange({ ...block, caption: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {block.images.map((img, i) => (
                    <div
                        key={`${img.url}-${i}`}
                        className="space-y-1.5 rounded border border-slate-200 p-2"
                    >
                        <img
                            src={optimizeImage(img.url, 400)}
                            alt={img.alt}
                            className="h-24 w-full rounded object-cover"
                        />
                        <Input
                            value={img.alt}
                            placeholder="Alt text"
                            onChange={(e) =>
                                setImages(
                                    block.images.map((im, j) =>
                                        j === i ? { ...im, alt: e.target.value } : im
                                    )
                                )
                            }
                        />
                        <div className="flex items-center gap-1">
                            <Input
                                className="flex-1"
                                value={img.caption ?? ""}
                                placeholder="Caption"
                                onChange={(e) =>
                                    setImages(
                                        block.images.map((im, j) =>
                                            j === i ? { ...im, caption: e.target.value } : im
                                        )
                                    )
                                }
                            />
                            <IconBtn
                                label="Move left"
                                disabled={i === 0}
                                onClick={() => {
                                    const next = [...block.images];
                                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                                    setImages(next);
                                }}
                            >
                                <ChevronUp className="h-4 w-4 -rotate-90" />
                            </IconBtn>
                            <IconBtn
                                label="Remove image"
                                danger
                                onClick={() => setImages(block.images.filter((_, j) => j !== i))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </IconBtn>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded border border-dashed border-slate-300 p-3">
                <p className="mb-2 text-xs text-slate-500">Add another image</p>
                <ImageUploader
                    label=""
                    value=""
                    folder={folder}
                    onUploaded={(url, publicId) =>
                        setImages([...block.images, { url, publicId, alt: "" }])
                    }
                    onError={onError}
                />
            </div>
        </div>
    );
}

function Check({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            {label}
        </label>
    );
}