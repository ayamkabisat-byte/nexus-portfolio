import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let controller: AbortController | null = null;
let context: ReturnType<typeof gsap.context> | null = null;
let ticker: ((time: number) => void) | null = null;

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(pointer: fine)').matches;

function destroySite() {
  controller?.abort();
  controller = null;

  if (ticker) {
    gsap.ticker.remove(ticker);
    ticker = null;
  }

  lenis?.destroy();
  lenis = null;

  context?.revert();
  context = null;

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

function initSmoothScroll(signal: AbortSignal) {
  if (reduceMotion()) return;

  lenis = new Lenis({
    duration: 1.08,
    smoothWheel: true,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.1,
  });

  lenis.on('scroll', ScrollTrigger.update);
  ticker = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener(
      'click',
      (event) => {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return;
        const target = document.querySelector(url.hash);
        if (!target) return;
        event.preventDefault();
        lenis?.scrollTo(target as HTMLElement, { offset: -58, duration: 1.15 });
        history.replaceState(null, '', url.hash);
      },
      { signal },
    );
  });
}

function initIntro() {
  const intro = document.querySelector<HTMLElement>('[data-intro]');
  if (!intro) return;

  let hasPlayed = false;
  try {
    hasPlayed = sessionStorage.getItem('md-intro-played') === 'true';
  } catch {
    hasPlayed = false;
  }

  if (hasPlayed || reduceMotion()) {
    intro.remove();
    return;
  }

  const progress = intro.querySelector<HTMLElement>('[data-intro-progress]');
  const word = intro.querySelector<HTMLElement>('.intro__word');
  const timeline = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      intro.remove();
      try {
        sessionStorage.setItem('md-intro-played', 'true');
      } catch {
        // Session storage can be unavailable in strict privacy modes.
      }
    },
  });

  timeline
    .to(progress, { scaleX: 1, duration: 0.72, ease: 'power2.inOut' })
    .fromTo(word, { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.48 }, 0.08)
    .to(word, { yPercent: -14, opacity: 0, duration: 0.5 }, 0.82)
    .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.72 }, 0.92);
}

function initCursor(signal: AbortSignal) {
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  const cursorText = cursor?.querySelector<HTMLElement>('[data-cursor-text]');
  if (!cursor || !cursorText || !finePointer()) return;

  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.34, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.34, ease: 'power3.out' });

  window.addEventListener(
    'pointermove',
    (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.style.opacity = '1';
    },
    { signal },
  );

  window.addEventListener(
    'pointerleave',
    () => {
      cursor.style.opacity = '0';
    },
    { signal },
  );

  document.querySelectorAll<HTMLElement>('a, button, [data-cursor-label]').forEach((element) => {
    element.addEventListener(
      'pointerenter',
      () => {
        cursorText.textContent = element.dataset.cursorLabel || 'OPEN';
        cursor.classList.add('is-active');
      },
      { signal },
    );
    element.addEventListener(
      'pointerleave',
      () => cursor.classList.remove('is-active'),
      { signal },
    );
  });
}

function initNavigation(signal: AbortSignal) {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!nav || !menu || !toggle) return;

  const updateScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 28);
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { signal, passive: true });

  let open = false;
  let previousFocus: HTMLElement | null = null;
  const focusable = () => [toggle, ...Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))];

  const setMenu = (next: boolean) => {
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.dataset.menuOpen = String(open);

    if (open) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      menu.classList.add('is-open');
      gsap.fromTo(
        menu,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.72, ease: 'power4.inOut' },
      );
      gsap.fromTo(
        menu.querySelectorAll('.menu__links a'),
        { yPercent: 70, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.055, duration: 0.72, ease: 'power3.out', delay: 0.25 },
      );
      window.setTimeout(() => menu.querySelector<HTMLElement>('[data-menu-link]')?.focus(), 420);
    } else {
      gsap.to(menu, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.62,
        ease: 'power4.inOut',
        onComplete: () => {
          menu.classList.remove('is-open');
          previousFocus?.focus();
        },
      });
    }
  };

  toggle.addEventListener('click', () => setMenu(!open), { signal });
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => setMenu(false), { signal });
  });

  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && open) {
        setMenu(false);
        return;
      }
      if (event.key !== 'Tab' || !open) return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    { signal },
  );
}

function initReveals() {
  if (reduceMotion()) return;

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.fromTo(
      element,
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });
}

function initHero(signal: AbortSignal) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const lines = hero.querySelectorAll<HTMLElement>('.hero__line > span');
  const object = hero.querySelector<HTMLElement>('[data-hero-object]');

  if (!reduceMotion()) {
    gsap.fromTo(
      lines,
      { yPercent: 112 },
      { yPercent: 0, duration: 1.15, stagger: 0.11, ease: 'power4.out', delay: 0.55 },
    );

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.75,
      },
    });

    timeline
      .to(lines[0], { xPercent: -12, opacity: 0.25, ease: 'none' }, 0)
      .to(lines[1], { xPercent: 11, opacity: 0.3, ease: 'none' }, 0)
      .to(lines[2], { xPercent: -6, opacity: 0.18, ease: 'none' }, 0)
      .to(object, { yPercent: -25, rotate: -8, scale: 0.85, opacity: 0, ease: 'none' }, 0);
  }

  if (object && finePointer() && !reduceMotion()) {
    const objectX = gsap.quickTo(object, 'x', { duration: 0.8, ease: 'power3.out' });
    const objectY = gsap.quickTo(object, 'y', { duration: 0.8, ease: 'power3.out' });
    window.addEventListener(
      'pointermove',
      (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 30;
        const y = (event.clientY / window.innerHeight - 0.5) * 24;
        objectX(x);
        objectY(y);
      },
      { signal },
    );
  }
}

function initWorks() {
  const section = document.querySelector<HTMLElement>('[data-works]');
  const stage = document.querySelector<HTMLElement>('[data-works-stage]');
  const deck = document.querySelector<HTMLElement>('[data-works-deck]');
  if (!section || !stage || !deck) return;

  const cards = gsap.utils.toArray<HTMLElement>('[data-work-card]', deck);
  const title = section.querySelector<HTMLElement>('[data-works-title]');
  const intro = section.querySelector<HTMLElement>('[data-works-intro]');
  const assembled = section.querySelector<HTMLElement>('[data-works-assembled]');
  const progress = section.querySelector<HTMLElement>('[data-works-progress]');

  const media = gsap.matchMedia();

  media.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
    const arc = [
      { x: -0.44, y: 0.1, rotateY: 57, rotateZ: -10, scale: 0.58, z: -210 },
      { x: -0.28, y: -0.04, rotateY: 39, rotateZ: -6, scale: 0.74, z: -100 },
      { x: -0.11, y: -0.15, rotateY: 16, rotateZ: -2, scale: 0.92, z: 5 },
      { x: 0.11, y: -0.14, rotateY: -16, rotateZ: 2, scale: 0.98, z: 28 },
      { x: 0.29, y: -0.04, rotateY: -40, rotateZ: 6, scale: 0.75, z: -105 },
      { x: 0.44, y: 0.1, rotateY: -57, rotateZ: 10, scale: 0.58, z: -210 },
    ];

    const dimensions = () => ({
      width: stage.clientWidth,
      height: stage.clientHeight,
      cardWidth: cards[0]?.offsetWidth || 150,
      cardHeight: cards[0]?.offsetHeight || 285,
    });

    const arcPose = (index: number, key: keyof (typeof arc)[number]) => {
      const pose = arc[index % arc.length];
      const dim = dimensions();
      if (key === 'x') return dim.width * pose.x;
      if (key === 'y') return dim.height * pose.y;
      return pose[key];
    };

    const gridPose = (index: number, axis: 'x' | 'y') => {
      const dim = dimensions();
      const column = index % 3;
      const row = Math.floor(index / 3);
      const gapX = Math.min(58, dim.width * 0.042);
      const gapY = Math.min(34, dim.height * 0.04);
      if (axis === 'x') return (column - 1) * (dim.cardWidth + gapX);
      return (row - 0.5) * (dim.cardHeight + gapY) + dim.height * 0.045;
    };

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=225%',
        scrub: 0.9,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.fromTo(
      cards,
      {
        x: (index) => arcPose(index, 'x'),
        y: (index) => arcPose(index, 'y'),
        z: (index) => arcPose(index, 'z'),
        rotateY: (index) => arcPose(index, 'rotateY'),
        rotateZ: (index) => arcPose(index, 'rotateZ'),
        scale: (index) => arcPose(index, 'scale'),
        opacity: 0,
      },
      { opacity: 1, duration: 0.18, stagger: 0.024 },
      0,
    );

    timeline.to(
      cards,
      {
        x: (index) => Number(arcPose(index, 'x')) - dimensions().width * 0.05,
        y: (index) => Number(arcPose(index, 'y')) - dimensions().height * 0.025,
        rotateY: (index) => Number(arcPose(index, 'rotateY')) * 0.72,
        rotateZ: (index) => Number(arcPose(index, 'rotateZ')) * 0.7,
        duration: 0.32,
        stagger: 0.018,
      },
      0.12,
    );

    timeline.to(
      cards,
      {
        x: (index) => gridPose(index, 'x'),
        y: (index) => gridPose(index, 'y'),
        z: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        duration: 0.82,
        stagger: 0.035,
        ease: 'power3.inOut',
      },
      0.38,
    );

    timeline.to(intro, { opacity: 0, y: -18, duration: 0.24 }, 0.38);
    timeline.to(assembled, { opacity: 1, y: 0, duration: 0.28 }, 0.84);
    timeline.to(title, { scale: 1.055, opacity: 0.035, duration: 0.7 }, 0.3);
    timeline.to(progress, { scaleX: 1, duration: 1.02 }, 0.05);

    return () => timeline.kill();
  });

  media.add('(max-width: 860px)', () => {
    gsap.set(cards, { clearProps: 'all' });
    const reveal = gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: deck,
          start: 'top 84%',
          once: true,
        },
      },
    );
    return () => reveal.kill();
  });
}

function initArchive(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-archive]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-archive-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-panel]'));

  const activate = (id: string) => {
    const current = panels.find((panel) => !panel.hidden);
    const next = panels.find((panel) => panel.dataset.archivePanel === id);
    if (!next || current === next) return;

    tabs.forEach((tab) => {
      const active = tab.dataset.archiveTab === id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    if (reduceMotion()) {
      panels.forEach((panel) => { panel.hidden = panel !== next; });
      return;
    }

    const revealNext = () => {
      next.hidden = false;
      gsap.fromTo(
        next,
        { opacity: 0, y: 22, filter: 'blur(7px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' },
      );
    };

    if (current) {
      gsap.to(current, {
        opacity: 0,
        y: -16,
        filter: 'blur(6px)',
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          current.hidden = true;
          gsap.set(current, { clearProps: 'all' });
          revealNext();
        },
      });
    } else {
      revealNext();
    }
  };

  tabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener('click', () => activate(tab.dataset.archiveTab || ''), { signal });
    tab.addEventListener(
      'keydown',
      (event) => {
        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return;
        event.preventDefault();
        const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
        const nextIndex = (index + direction + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activate(tabs[nextIndex].dataset.archiveTab || '');
      },
      { signal },
    );
  });
}

function initBookHero(signal: AbortSignal) {
  const hero = document.querySelector<HTMLElement>('[data-book-hero]');
  const cover = document.querySelector<HTMLElement>('[data-book-cover]');
  if (!hero || !cover || reduceMotion()) return;

  gsap.fromTo(
    cover,
    { y: 55, rotate: -4, opacity: 0 },
    { y: 0, rotate: 0, opacity: 1, duration: 1.05, ease: 'power4.out', delay: 0.25 },
  );
  gsap.fromTo(
    hero.querySelectorAll('.book-hero__copy > *'),
    { y: 35, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.09, duration: 0.9, ease: 'power3.out', delay: 0.42 },
  );

  gsap.to(cover, {
    yPercent: -18,
    rotate: 2,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    },
  });

  if (finePointer()) {
    const xTo = gsap.quickTo(cover, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(cover, 'y', { duration: 0.8, ease: 'power3.out' });
    hero.addEventListener(
      'pointermove',
      (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 18;
        const y = (event.clientY / window.innerHeight - 0.5) * 14;
        xTo(x);
        yTo(y);
      },
      { signal },
    );
  }
}

function initSite() {
  destroySite();
  controller = new AbortController();
  const { signal } = controller;

  context = gsap.context(() => {
    initIntro();
    initSmoothScroll(signal);
    initCursor(signal);
    initNavigation(signal);
    initReveals();
    initHero(signal);
    initWorks();
    initArchive(signal);
    initBookHero(signal);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initSite);
document.addEventListener('astro:before-preparation', destroySite);
