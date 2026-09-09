/** Progressive enhancement for the six-book reel. Links remain usable without it. */
export function initWorldLibrary(root: HTMLElement): () => void {
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-world-panel]'));
  const books = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-reel-book]'));
  const summaries = Array.from(root.querySelectorAll<HTMLElement>('[data-world-summary]'));
  const reel = root.querySelector<HTMLElement>('[data-world-reel]');
  const pause = root.querySelector<HTMLButtonElement>('[data-world-pause]');
  const counter = root.querySelector<HTMLElement>('[data-world-counter]');
  const status = root.querySelector<HTMLElement>('[data-world-status]');
  const announcement = root.querySelector<HTMLElement>('[data-world-announcement]');
  if (!reel || !pause || !panels.length || books.length !== panels.length || summaries.length !== panels.length) return () => {};

  const controller = new AbortController();
  const { signal } = controller;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  let active = 0;
  let open = false;
  let userPaused = false;
  let hovered = false;
  let focused = false;
  let inView = false;
  let timer = 0;
  let focusFrame = 0;
  let opener: HTMLElement | null = null;
  let gesture: { id: number; x: number; y: number; moved: number } | null = null;
  let suppressClick = false;

  const clearTimer = () => { window.clearTimeout(timer); timer = 0; };
  const canRotate = () => !userPaused && !motion.matches && !open && !hovered && !focused && !gesture && inView && !document.hidden;
  const syncTimer = () => {
    clearTimer();
    pause.disabled = motion.matches;
    pause.textContent = motion.matches ? 'Reduced motion' : userPaused ? 'Play rotation' : 'Pause rotation';
    pause.setAttribute('aria-label', motion.matches ? 'Automatic rotation disabled for reduced motion' : userPaused ? 'Play automatic book rotation' : 'Pause automatic book rotation');
    if (status) status.textContent = open ? 'BOOK OPEN · ENTER THE WORLD' : canRotate() ? 'REEL MOVING · SELECT A WORLD' : 'REEL PAUSED · SELECT A WORLD';
    if (canRotate()) timer = window.setTimeout(() => select(active + 1, false, true), 5200);
  };

  const syncAccess = () => {
    reel.inert = open;
    reel.setAttribute('aria-hidden', String(open));
    panels.forEach((panel, i) => {
      panel.hidden = i !== active;
      panel.inert = i !== active || !open;
      panel.querySelector<HTMLElement>('[data-desktop-brief]')?.toggleAttribute('inert', mobile.matches);
      panel.querySelector<HTMLElement>('[data-mobile-brief]')?.toggleAttribute('inert', !mobile.matches);
      panel.querySelector<HTMLElement>('[data-book-toggle]')?.toggleAttribute('inert', mobile.matches);
    });
    summaries.forEach((summary, i) => { summary.hidden = open || i !== active; });
  };
  const focusBrief = () => {
    window.cancelAnimationFrame(focusFrame);
    focusFrame = window.requestAnimationFrame(() => {
      if (signal.aborted || !open) return;
      const brief = panels[active].querySelector<HTMLElement>(mobile.matches ? '[data-mobile-brief]' : '[data-desktop-brief]');
      brief?.querySelector<HTMLElement>('[data-book-close]')?.focus({ preventScroll: true });
    });
  };
  const render = () => {
    books.forEach((book, i) => {
      let offset = i - active;
      const half = Math.floor(books.length / 2);
      if (offset > half) offset -= books.length;
      if (offset < -half) offset += books.length;
      book.dataset.reelPosition = String(offset);
      book.classList.toggle('is-active', i === active);
      book.setAttribute('aria-pressed', String(i === active));
      book.setAttribute('aria-expanded', String(i === active && open));
      book.tabIndex = i === active ? 0 : -1;
      book.dataset.cursorLabel = `${i === active ? 'OPEN' : 'SELECT'} ${book.dataset.bookSlug?.toUpperCase()}`;
      panels[i].classList.toggle('is-open', i === active && open);
      panels[i].classList.toggle('is-active', i === active);
      const coverToggle = panels[i].querySelector('[data-book-toggle]');
      coverToggle?.setAttribute('aria-expanded', String(i === active && open));
      coverToggle?.setAttribute('aria-label', `${i === active && open ? 'Close' : 'Open'} ${book.dataset.bookSlug?.toUpperCase()} synopsis`);
    });
    root.classList.toggle('is-book-open', open);
    root.dataset.activeBook = panels[active].dataset.bookSlug || '';
    root.style.setProperty('--world-accent', panels[active].dataset.bookAccent || '#55f4a0');
    root.style.setProperty('--world-rgb', panels[active].dataset.bookRgb || '85, 244, 160');
    if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
    syncAccess();
  };
  const setOpen = (value: boolean, restoreFocus = true) => {
    if (value && !open) opener = document.activeElement instanceof HTMLElement ? document.activeElement : books[active];
    open = value;
    render();
    if (open) focusBrief();
    else {
      window.cancelAnimationFrame(focusFrame);
      if (restoreFocus) {
        const target = opener?.isConnected && !opener.closest('[hidden], [inert]') ? opener : books[active];
        target.focus({ preventScroll: true });
      }
    }
    syncTimer();
  };
  function select(index: number, focusBook = false, automatic = false) {
    const normalized = ((index % books.length) + books.length) % books.length;
    // Home/End on the current item must not open the book.
    if (normalized !== active) {
      open = false;
      active = normalized;
      render();
    }
    if (focusBook) books[active].focus({ preventScroll: true });
    if (!automatic && announcement) announcement.textContent = `${books[active].dataset.bookSlug?.toUpperCase()}, book ${active + 1} of ${books.length}`;
    syncTimer();
  }

  books.forEach((book, i) => {
    book.addEventListener('click', () => { if (i === active) setOpen(true); else select(i); }, { signal });
    book.addEventListener('keydown', (event) => {
      const indices: Record<string, number> = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: books.length - 1 };
      if (!(event.key in indices)) return; // Enter/Space use the native button click.
      event.preventDefault();
      select(indices[event.key], true);
    }, { signal });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-preview-book]').forEach((button) => {
    button.addEventListener('click', () => { select(Number(button.dataset.previewBook)); setOpen(true); }, { signal });
  });
  panels.forEach((panel) => {
    panel.querySelectorAll('[data-book-close]').forEach((button) => button.addEventListener('click', () => setOpen(false), { signal }));
    panel.querySelector('[data-book-toggle]')?.addEventListener('click', () => setOpen(!open), { signal });
  });
  root.querySelector('[data-world-prev]')?.addEventListener('click', () => select(active - 1), { signal });
  root.querySelector('[data-world-next]')?.addEventListener('click', () => select(active + 1), { signal });
  pause.addEventListener('click', () => { userPaused = !userPaused; syncTimer(); }, { signal });
  root.addEventListener('mouseenter', () => { hovered = true; syncTimer(); }, { signal });
  root.addEventListener('mouseleave', () => { hovered = false; syncTimer(); }, { signal });
  root.addEventListener('focusin', () => { focused = true; syncTimer(); }, { signal });
  root.addEventListener('focusout', (event) => {
    focused = event.relatedTarget instanceof Node && root.contains(event.relatedTarget);
    syncTimer();
  }, { signal });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); }
  }, { signal });

  reel.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
  reel.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick = false;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0 };
    syncTimer();
  }, { signal });
  window.addEventListener('pointermove', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    gesture.moved = Math.max(gesture.moved, Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y));
  }, { signal });
  window.addEventListener('pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    suppressClick = Math.max(gesture.moved, Math.hypot(dx, dy)) > 10;
    gesture = null;
    if (Math.abs(dx) >= 42 && Math.abs(dx) >= Math.abs(dy) * 1.15) select(active + (dx < 0 ? 1 : -1));
    else syncTimer();
  }, { signal });
  window.addEventListener('pointercancel', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    gesture = null;
    suppressClick = true;
    syncTimer();
  }, { signal });
  reel.addEventListener('click', (event) => {
    if (!suppressClick || event.detail === 0) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, { capture: true, signal });
  document.addEventListener('visibilitychange', syncTimer, { signal });
  motion.addEventListener('change', syncTimer, { signal });
  mobile.addEventListener('change', () => { syncAccess(); if (open) focusBrief(); }, { signal });
  const observer = new IntersectionObserver(([entry]) => { inView = !!entry?.isIntersecting; syncTimer(); }, { threshold: 0.15 });
  observer.observe(root);
  render();
  root.classList.add('is-ready');
  syncTimer();
  return () => {
    clearTimer();
    window.cancelAnimationFrame(focusFrame);
    controller.abort();
    observer.disconnect();
    root.classList.remove('is-ready', 'is-book-open');
  };
}
