# Phase 4 navigation and accessibility repair

Based on `phase-4/homepage-book-showcase` at `e6e45d3`. The cinematic archive, original covers, opening-book animation, and all six bespoke book pages are retained.

## Changes

- Restore the `js` marker on Astro navigation; keep the native cursor usable.
- Make closed navigation inert, pause smooth scrolling while open, clean up animations on navigation, and respect reduced motion.
- Keep TOP on the current book page; give the homepage one semantic H1.
- Replace the unused legacy double-click reel with the Phase 4 controller in `src/scripts/world-library.ts`.
- Use native button activation, separate swipe from click, move/restore focus, and exclude invisible controls from keyboard access.
- Pause rotation on hover, focus, open book, hidden tab, offscreen section, and reduced-motion preference. An explicit Pause remains paused until Play is selected.
- Keep book title, genre, tagline, and direct links available beneath the reel. Provide ordinary cover links if enhancement cannot initialize.
- Keep the opening book on mobile, with a separate readable 16px synopsis and 44px close target below it. Desktop synopsis scrolls independently when needed.
- Connect World Index entries to their books and prevent stale panels during rapid selection.

## Verification

- `npm run test`: six controller regression tests passed. The fixture simulates DOM events and timers; it is not a real-browser visual test.
- `npm run build`: Astro check reported zero errors, warnings, or hints; eight static pages built successfully.
- Generated HTML: exactly one H1 on each page; all local links and anchors resolve; six reel books and the static fallback are present.
- `git diff --check`: passed.
- Local browser preview was blocked with `ERR_BLOCKED_BY_CLIENT`. Visual layout and real touch gestures still need review before production deployment.

## Browser review before release

1. Visit a book, use INDEX to return to World Index, and confirm INDEX remains visible without refreshing.
2. Open each book using click and Enter/Space. Confirm the close control receives focus; Escape restores focus to the opener.
3. Swipe left/right, then tap. Swiping must only select a book; the following tap must still work.
4. Check 360px, 390px, 768px, and desktop layouts, including the full title and mobile synopsis.
5. Pause rotation, move focus away, switch tabs, and return. It must remain paused.
6. Check reduced motion and JavaScript disabled: content and ordinary book links must remain available.
7. Open/close the menu repeatedly, navigate using keyboard, and verify TOP stays within each book page.

Run tests with Node 22.18+ or Node 24 (TypeScript stripping is used); no additional test dependencies are required.
