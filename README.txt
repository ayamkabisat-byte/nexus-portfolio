DOUBLE-CLICK BOOK ENTER

Behavior:
- First click/tap selects and highlights a cover.
- Second click/tap on the same cover within 500 ms opens its book page.
- Native mouse double-click is supported.
- Enter still opens the focused book immediately for keyboard accessibility.
- Dragging the reel never counts as a click.
- Hover pauses the reel.

Install from the repository root:

  cp -a double-click-book-enter/. ./
  rm -rf .astro dist
  pnpm run check
  pnpm run build
  pnpm run dev -- --host 0.0.0.0

Changed files:
- src/components/Works.astro
- src/scripts/site.ts
- src/styles/global.css
