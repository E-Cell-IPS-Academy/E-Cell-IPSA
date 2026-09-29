"use client";

import type { ContentBlock } from "../../../types";
import { GalleryEditor, ImageBlockEditor } from "./ImageBlocks";
import { DividerEditor, HtmlEditor, VideoEditor } from "./MiscBlocks";
import { HeadingEditor, ListEditor, ParagraphEditor, QuoteEditor } from "./TextBlocks";

interface BlockEditorProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onInsertParagraphAfter: () => void;
}

/** Picks the right editing UI for a block's type. */
export function BlockEditor({ block, onChange, onInsertParagraphAfter }: BlockEditorProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphEditor block={block} onChange={onChange} onInsertAfter={onInsertParagraphAfter} />;
    case "heading":
      return <HeadingEditor block={block} onChange={onChange} />;
    case "image":
      return <ImageBlockEditor block={block} onChange={onChange} />;
    case "gallery":
      return <GalleryEditor block={block} onChange={onChange} />;
    case "quote":
      return <QuoteEditor block={block} onChange={onChange} />;
    case "list":
      return <ListEditor block={block} onChange={onChange} />;
    case "video":
      return <VideoEditor block={block} onChange={onChange} />;
    case "html":
      return <HtmlEditor block={block} onChange={onChange} />;
    case "divider":
      return <DividerEditor />;
  }
}