# Blog feature

A newspaper-style publication ("The E-Cell Chronicle") with a block-based
article editor. Data lives in the Firestore `blogs` collection; images live on
Cloudinary (only URLs + metadata are stored in Firestore).

## Where things are

| Path | What it is |
| --- | --- |
| `types.ts` | `BlogPost`, `ContentBlock` (the block model), categories |
| `lib/blocks.ts` | block factories, `blocksToHtml`, read-time, image collection |
| `lib/inline.ts` | tiny safe markup for paragraph text: `**bold**`, `*italic*`, `[link](url)` |
| `lib/legacy.ts` · `lib/sanitize.ts` | convert / sanitize old hand-written HTML posts |
| `lib/format.ts` | **publication name & tagline** (`PUBLICATION`), date helpers |
| `lib/imageUtils.ts` | Cloudinary `f_auto,q_auto` URLs, `srcset`, pre-upload downscaling |
| `blogService.ts` | Firestore reads/writes (derives `content` + `readTime` from blocks on save) |
| `components/public/*` | landing page: masthead, featured story, grid, feed, sidebar |
| `components/reader/*` | article page (also used by the admin Preview) |
| `components/editor/*` | the admin block editor |
| `styles/newspaper.css` | all editorial styling, scoped under `.np-root` |

Routes are unchanged: `/blog`, `/blog/[slug]`, `/admin/dashboard/blogs`.

## How content is stored

Each post has `blocks: ContentBlock[]` (structured, in order) **and** `content`
(an HTML rendering regenerated from the blocks on every save, so search,
exports and older code keep working). Posts written before the block editor
have only `content`; they still render (sanitized) and are converted to blocks
the first time they are opened in the editor — the original HTML is kept in
`legacyContent`.

The cover image (`featuredImage*`) is independent of images inside the body.
`media` lists every image uploaded for the post so it can be re-inserted.

## Adding a new block type

1. Add the interface to `types.ts` and to the `ContentBlock` union.
2. `lib/blocks.ts`: handle it in `createBlock`, `isBlockEmpty`,
   `blocksToPlainText` and `blocksToHtml` (TypeScript will flag each switch).
3. `components/reader/BlockRenderer.tsx`: render it.
4. `components/editor/blocks/`: an editor component; register it in
   `BlockEditor.tsx` and add an entry to `blockMeta.ts`.

## Notes

- Firestore rejects `undefined` — `stripUndefined` in `blogService.ts` guards
  every write; to *clear* a stored field write `""`/`0`, don't omit it.
- Public view counts use `recordView` (once per session). If your Firestore
  rules don't allow public writes to `viewCount`, it fails silently.
- Deleting an image in the editor detaches it from the post; the file stays in
  Cloudinary (unsigned uploads can't delete).
