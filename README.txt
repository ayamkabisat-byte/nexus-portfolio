VIDEO INTEGRATION — BASED ON CURRENT GitHub main

Expected local assets:
public/video/hero.mp4
public/video/nexus.mp4
public/video/sillage.mp4
public/video/manifesto.mp4
public/video/hydra.mp4
public/video/lucidreamer.mp4
public/video/capture.mp4

What changes:
1. hero.mp4 becomes the homepage cinematic background.
2. The old floating book stack in the homepage hero is removed so the video can breathe.
3. The moving/double-click book reel is NOT changed.
4. Every book page automatically uses video/<slug>.mp4.
5. Existing world WebP remains as the fallback/poster.
6. Existing transparent overlays and SVG world motifs remain above the videos.
7. Videos autoplay muted, loop, playsinline, pause off-screen, and pause when the tab is hidden.
8. prefers-reduced-motion falls back to the static WebP.

Install from repository root:

rm -rf /tmp/video-integration
mkdir -p /tmp/video-integration
unzip -q video-integration-current-main.zip -d /tmp/video-integration
cp -a /tmp/video-integration/video-integration-current-main/. ./

rm -rf .astro dist
pnpm run check
pnpm run build
pnpm run dev -- --host 0.0.0.0

IMPORTANT:
The GitHub remote checked while building this package did not yet contain
public/video/hero.mp4 or public/video/nexus.mp4. If the videos are already
in Codespaces locally, the patch still works immediately there. Push them
after you are satisfied with the preview.
