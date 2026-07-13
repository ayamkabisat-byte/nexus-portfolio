BOOK WORLD ATMOSPHERES — READY TO COPY

Folder structure is already matched to the Astro project.

Copy these folders into the repository root:
- public/worlds/*.webp
- src/components/BookAtmosphere.astro
- src/styles/book.css

Codespaces command:

  cp -a book-world-atmospheres-ready/. ./
  rm -rf .astro dist
  pnpm run check
  pnpm run build
  pnpm run dev -- --host 0.0.0.0

Generated files:
- public/worlds/nexus.webp
- public/worlds/sillage.webp
- public/worlds/manifesto.webp
- public/worlds/hydra.webp
- public/worlds/lucidreamer.webp
- public/worlds/capture.webp

Image dimensions: 1672 × 941 px, 16:9 WebP.
