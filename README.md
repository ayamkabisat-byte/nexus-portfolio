# Michael Dinko — The Multiverse Archive

A static-first author portfolio rebuilt with Astro, GSAP, and Lenis. The design takes inspiration from fluid creative-studio websites while keeping the content centered on Michael Dinko's books, worldbuilding, and author identity.

## What is included

- Cinematic home page with kinetic hero typography.
- Scroll-driven six-book arc that assembles into a collection.
- Permanent detail pages for every book.
- Full-screen navigation.
- Interactive worldbuilding archive.
- Responsive mobile layouts.
- Reduced-motion and keyboard support.
- Unique title and meta description for each page.
- Canonical URLs.
- Open Graph and X/Twitter Card metadata.
- JSON-LD for `Person`, `WebSite`, and `Book`.
- Generated `robots.txt`, sitemap, web manifest, favicon, and social preview images.
- Configuration ready for a future custom domain.

## Existing image assets to preserve

This rebuild intentionally does **not** replace the original book covers or author portrait. Keep these files from the current repository inside `public/`:

```text
public/Cover_Nexus.webp
public/Cover_Sillage.webp
public/Cover_Manifesto.webp
public/Cover_Hydra.webp
public/Cover_Lucidreamer.webp
public/Cover_Capture.webp
public/author.jpeg
```

The new social-sharing graphics are included in `public/og/`.

## Run locally

```bash
npm install
npm run check
npm run dev -- --host 0.0.0.0
```

Open the forwarded port shown by Codespaces.

## Production build

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

The static output is written to `dist/`.

## Edit site identity

Edit:

```text
src/config/site.ts
```

This contains the author name, description, location, email, Instagram, Royal Road, and default SEO copy.

## Edit books

Edit:

```text
src/data/books.ts
```

Every object automatically creates:

- a card on the home page;
- a permanent `/books/<slug>/` page;
- unique SEO metadata;
- Book structured data;
- previous and next book navigation.

When adding a new book, also place the cover image in `public/` and add a 1200 × 630 social image in `public/og/`.

## Domain and SEO configuration

Copy the environment template:

```bash
cp .env.example .env
```

For Vercel, Netlify, Cloudflare Pages, or a custom domain:

```env
SITE_URL=https://yourdomain.com
BASE_PATH=/
GOOGLE_SITE_VERIFICATION=
```

For a GitHub Pages project URL before a custom domain:

```env
SITE_URL=https://ayamkabisat-byte.github.io/nexus-portfolio/
BASE_PATH=/nexus-portfolio/
```

After the custom domain is connected, change both values, rebuild, and redeploy. The canonical URLs, sitemap, robots file, Open Graph URLs, and structured data will follow the new domain.

## Recommended deployment

For the simplest custom-domain workflow, connect the GitHub repository to Vercel, Netlify, or Cloudflare Pages:

```text
Build command: npm run build
Output directory: dist
Node version: 22
```

Set `SITE_URL` and `BASE_PATH` in the hosting dashboard.

A manual GitHub Pages workflow is also included in `.github/workflows/deploy-pages.yml`.

## Search launch checklist

1. Replace `example.com` by setting `SITE_URL`.
2. Confirm every cover and the author portrait loads.
3. Run `npm run check` and `npm run build`.
4. Test `/robots.txt` and `/sitemap-index.xml` after deployment.
5. Verify the domain in Google Search Console.
6. Submit the sitemap.
7. Test the home and book URLs in a social-sharing preview debugger.
8. Keep page titles, descriptions, and visible page copy consistent.

## Design notes

The website deliberately avoids copying the literal visual objects of Noth or Trionn. It adopts their principles instead:

- monumental typography;
- editorial whitespace;
- one strong interaction per section;
- motion that connects sections;
- short, confident copy;
- tactile hover responses;
- static HTML underneath the animation layer.
