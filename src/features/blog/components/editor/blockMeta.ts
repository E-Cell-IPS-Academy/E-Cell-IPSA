import {
  Heading2,
  Images,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  TextQuote,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BlockType, ContentBlock } from "../../types";
import { createBlock } from "../../lib/blocks";

export interface BlockOption {
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  create: () => ContentBlock;
}

/** Everything the author can insert, in menu order. */
export const BLOCK_OPTIONS: BlockOption[] = [
  { key: "paragraph", label: "Paragraph", hint: "Body text", icon: Pilcrow, create: () => createBlock("paragraph") },
  { key: "heading", label: "Heading", hint: "H2 · H3 · H4", icon: Heading2, create: () => createBlock("heading") },
  { key: "image", label: "Image", hint: "With caption", icon: ImageIcon, create: () => createBlock("image") },
  { key: "gallery", label: "Gallery", hint: "Several images", icon: Images, create: () => createBlock("gallery") },
  { key: "quote", label: "Quote", hint: "Inline quotation", icon: Quote, create: () => createBlock("quote") },
  {
    key: "pull",
    label: "Pull quote",
    hint: "Large highlight",
    icon: TextQuote,
    create: () => ({ ...(createBlock("quote") as ContentBlock & { type: "quote" }), variant: "pull" as const }),
  },
  { key: "bullets", label: "Bulleted list", hint: "• items", icon: List, create: () => createBlock("list") },
  {
    key: "numbers",
    label: "Numbered list",
    hint: "1. 2. 3.",
    icon: ListOrdered,
    create: () => ({ ...(createBlock("list") as ContentBlock & { type: "list" }), ordered: true }),
  },
  { key: "divider", label: "Divider", hint: "Section break", icon: Minus, create: () => createBlock("divider") },
  { key: "video", label: "Video", hint: "YouTube · Vimeo", icon: Video, create: () => createBlock("video") },
];

export const BLOCK_LABEL: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  gallery: "Gallery",
  quote: "Quote",
  list: "List",
  divider: "Divider",
  video: "Video",
};

export const BLOCK_ICON: Record<BlockType, LucideIcon> = {
  heading: Heading2,
  paragraph: Pilcrow,
  image: ImageIcon,
  gallery: Images,
  quote: Quote,
  list: List,
  divider: Minus,
  video: Video,
};
