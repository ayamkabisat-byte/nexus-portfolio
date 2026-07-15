# Complete auto-moving book showcase

Paket ini mengubah bagian `Featured Works` menjadi galeri portfolio horizontal yang bergerak otomatis seperti referensi video. Setiap panel tetap berupa tautan ke halaman buku masing-masing.

## Termasuk

- Carousel horizontal infinite, 6 buku diduplikasi menjadi 12 panel visual untuk looping.
- Bergerak otomatis, pause saat hover/focus, dapat di-drag, tombol prev/next, dan wheel impulse.
- Panel lebar berisi atmosfer dunia + cover buku 3D + judul/genre/tagline.
- Klik panel menuju `/books/<slug>/`.
- 6 atmosfer fullscreen WebP.
- 6 overlay transparan WebP.
- 7 Open Graph JPG (homepage + 6 buku).
- SEO diubah memakai `og/home.jpg` dan `og/<slug>.jpg`.

## Yang tidak ditimpa

Paket tidak menyertakan `public/Cover_*.webp`. Cover asli Anda tetap dipakai dari repository.

## Cara memasang

Upload ZIP ke root repository, lalu:

```bash
cd /workspaces/nexus-portfolio
rm -rf /tmp/md-complete-showcase
mkdir -p /tmp/md-complete-showcase
unzip -q michael-dinko-complete-showcase.zip -d /tmp/md-complete-showcase
cp -a /tmp/md-complete-showcase/michael-dinko-complete-showcase/. ./
rm -rf .astro dist
pnpm run check
pnpm run build
pnpm run dev -- --host 0.0.0.0
```

Buka port 4321 lalu hard refresh.

## Aset

- Background: `public/worlds/<slug>.webp` — 1672×941
- Overlay: `public/worlds/overlays/<slug>.webp` — 1600×1200 transparan
- Open Graph: `public/og/<slug>.jpg` — 1200×630
- Homepage Open Graph: `public/og/home.jpg`

## Mengatur kecepatan

Buka `src/scripts/site.ts`, cari:

```ts
let targetVelocity = window.innerWidth < 760 ? -18 : -30;
```

Angka lebih negatif = lebih cepat ke kiri. Contoh desktop lebih pelan: `-22`.

## Mengatur ukuran panel

Buka `src/styles/global.css`, cari:

```css
--showcase-card-width: clamp(560px, 63vw, 960px);
```

## Validasi lokal

Kode TypeScript telah diperiksa sintaksnya. Build Astro final tetap dijalankan di Codespaces karena dependency tersedia di sana.
