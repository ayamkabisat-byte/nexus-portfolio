# Build verification

Verified on 11 July 2026.

- `astro check`: 0 errors, 0 warnings, 0 hints.
- `astro build`: successful static production build.
- Generated routes: home, 404, six permanent book pages, robots.txt, web manifest, and sitemap.
- Social preview assets: one site image and six book-specific images at 1200 × 630.
- Tested configuration with both `/` and `/nexus-portfolio/` base paths.

Before production deployment, set `SITE_URL` and preserve the existing cover and author images listed in `public/KEEP_EXISTING_ASSETS.txt`.
