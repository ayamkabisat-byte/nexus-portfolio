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

function initAtmosphere(signal: AbortSignal) {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-atmosphere]');
  if (!canvas || reduceMotion()) return;

  const context2d = canvas.getContext('2d');
  if (!context2d) return;

  const theme = document.querySelector<HTMLElement>('[data-book-theme]')?.dataset.bookTheme || 'home';
  const palette: Record<string, string> = {
    home: '85,244,160',
    nexus: '85,244,160',
    sillage: '217,164,93',
    manifesto: '255,111,97',
    hydra: '212,175,87',
    lucidreamer: '139,140,255',
    capture: '142,203,255',
  };
  const rgb = palette[theme] || palette.home;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let width = 0;
  let height = 0;
  let frame = 0;

  type Particle = { x: number; y: number; speed: number; length: number; alpha: number; drift: number; size: number };
  let particles: Particle[] = [];

  const particleCount = () => Math.max(34, Math.min(78, Math.floor(window.innerWidth / 22)));
  const createParticle = (randomY = true): Particle => ({
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -40,
    speed: theme === 'home' ? 4 + Math.random() * 5 : 0.25 + Math.random() * 0.85,
    length: 16 + Math.random() * 42,
    alpha: 0.05 + Math.random() * 0.16,
    drift: -0.35 + Math.random() * 0.7,
    size: 0.7 + Math.random() * 1.8,
  });

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount() }, () => createParticle(true));
  };

  const drawHomeRain = (particle: Particle) => {
    context2d.beginPath();
    context2d.moveTo(particle.x, particle.y);
    context2d.lineTo(particle.x - particle.length * 0.18, particle.y + particle.length);
    context2d.strokeStyle = `rgba(${rgb},${particle.alpha})`;
    context2d.lineWidth = 0.65;
    context2d.stroke();
    particle.x += particle.drift - 0.25;
    particle.y += particle.speed;
  };

  const drawWorldParticle = (particle: Particle, time: number) => {
    particle.x += particle.drift * 0.12 + Math.sin(time * 0.00035 + particle.y) * 0.05;
    particle.y -= particle.speed;

    if (theme === 'capture') {
      context2d.fillStyle = `rgba(${rgb},${particle.alpha * 0.75})`;
      context2d.fillRect(particle.x, particle.y, particle.length * 0.45, 0.65);
      return;
    }

    if (theme === 'manifesto') {
      context2d.save();
      context2d.translate(particle.x, particle.y);
      context2d.rotate(time * 0.00015 + particle.x);
      context2d.fillStyle = `rgba(${rgb},${particle.alpha})`;
      context2d.fillRect(-particle.size, -particle.size, particle.size * 2.2, particle.size * 0.8);
      context2d.restore();
      return;
    }

    context2d.beginPath();
    context2d.arc(particle.x, particle.y, theme === 'sillage' ? particle.size * 1.8 : particle.size, 0, Math.PI * 2);
    context2d.fillStyle = `rgba(${rgb},${particle.alpha * (theme === 'sillage' ? 0.45 : 0.8)})`;
    context2d.fill();
  };

  const animate = (time: number) => {
    context2d.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (theme === 'home') drawHomeRain(particle);
      else drawWorldParticle(particle, time);

      const escaped = theme === 'home'
        ? particle.y > height + 70 || particle.x < -80
        : particle.y < -70 || particle.x < -80 || particle.x > width + 80;
      if (escaped) particles[index] = createParticle(false);
      if (theme !== 'home' && escaped) particles[index].y = height + 30;
    });

    frame = window.requestAnimationFrame(animate);
  };

  resize();
  window.addEventListener('resize', resize, { signal });
  frame = window.requestAnimationFrame(animate);
  signal.addEventListener('abort', () => window.cancelAnimationFrame(frame), { once: true });
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

function initWorks(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-book-showcase]');
  const viewport = root?.querySelector<HTMLElement>('[data-showcase-viewport]');
  const track = root?.querySelector<HTMLElement>('[data-showcase-track]');
  if (!root || !viewport || !track) return;

  const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-showcase-card]'));
  if (!cards.length) return;

  const originalCount = Math.max(1, cards.length / 2);

  if (reduceMotion()) {
    cards.slice(originalCount).forEach((card) => card.remove());
    root.classList.add('is-static');
    return;
  }

  let halfWidth = 1;
  let position = 0;
  let targetVelocity = window.innerWidth < 760 ? -58 : -84;
  let velocity = targetVelocity;
  let frame = 0;
  let lastTime = performance.now();
  let paused = false;
  let dragging = false;
  let pointerStart = 0;
  let positionStart = 0;
  let draggedDistance = 0;
  let activeIndex = -1;

  const wrap = (value: number) => {
    if (!halfWidth) return value;
    return ((value % halfWidth) + halfWidth) % halfWidth - halfWidth;
  };

  const setActive = (index: number) => {
    const normalized = ((index % originalCount) + originalCount) % originalCount;
    if (normalized === activeIndex) return;

    activeIndex = normalized;
    root.dataset.activeBook = cards[normalized]?.dataset.showcaseSlug || '';

    cards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex % originalCount === normalized);
    });
  };

  const render = () => {
    gsap.set(track, { x: position, force3D: true });

    const viewportRect = viewport.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const center = trackRect.left + card.offsetLeft + card.offsetWidth / 2;
      const normalizedDistance = (center - viewportCenter) / Math.max(1, viewportRect.width * 0.54);
      const distance = Math.abs(normalizedDistance);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }

      const scale = gsap.utils.clamp(0.78, 1.08, 1.08 - distance * 0.23);
      const opacity = gsap.utils.clamp(0.36, 1, 1 - distance * 0.52);
      const rotateY = gsap.utils.clamp(-18, 18, normalizedDistance * -18);
      const y = Math.min(48, distance * 34);

      gsap.set(card, {
        scale,
        opacity,
        rotateY,
        y,
        z: (1 - distance) * 90,
        force3D: true,
      });
    });

    setActive(nearest);
  };

  const refreshMeasurements = () => {
    halfWidth = Math.max(1, cards[originalCount].offsetLeft - cards[0].offsetLeft);
    position = wrap(position);
    render();
  };

  const animate = (time: number) => {
    const delta = Math.min(48, time - lastTime) / 1000;
    lastTime = time;

    const desiredVelocity = paused || dragging ? 0 : targetVelocity;
    velocity += (desiredVelocity - velocity) * Math.min(1, delta * 7.5);

    if (!dragging) position = wrap(position + velocity * delta);
    render();

    frame = window.requestAnimationFrame(animate);
  };

  viewport.addEventListener('pointerenter', () => {
    paused = true;
  }, { signal });

  viewport.addEventListener('pointerleave', () => {
    if (!dragging) paused = false;
  }, { signal });

  viewport.addEventListener('pointerdown', (event) => {
    dragging = true;
    paused = true;
    pointerStart = event.clientX;
    positionStart = position;
    draggedDistance = 0;
    viewport.setPointerCapture(event.pointerId);
    root.classList.add('is-dragging');
  }, { signal });

  viewport.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    draggedDistance = event.clientX - pointerStart;
    position = wrap(positionStart + draggedDistance);
    render();
  }, { signal });

  const finishDrag = (event: PointerEvent) => {
    if (!dragging) return;

    dragging = false;
    root.classList.remove('is-dragging');

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(draggedDistance) > 8) {
      const suppressClick = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
      };
      viewport.addEventListener('click', suppressClick, { capture: true, once: true });
    }

    velocity = draggedDistance * 2.8;
    window.setTimeout(() => {
      paused = false;
    }, 240);
  };

  viewport.addEventListener('pointerup', finishDrag, { signal });
  viewport.addEventListener('pointercancel', finishDrag, { signal });

  root.addEventListener('focusin', () => {
    paused = true;
  }, { signal });

  root.addEventListener('focusout', () => {
    paused = false;
  }, { signal });

  let lastActivatedCard: HTMLElement | null = null;
  let lastActivationTime = 0;
  let activationResetTimer = 0;

  const openBook = (card: HTMLElement) => {
    const link = card as HTMLAnchorElement;
    if (!link.href) return;
    window.location.assign(link.href);
  };

  const markAwaitingSecondClick = (card: HTMLElement) => {
    cards.forEach((item) => item.classList.toggle('is-awaiting-enter', item === card));
    window.clearTimeout(activationResetTimer);
    activationResetTimer = window.setTimeout(() => {
      cards.forEach((item) => item.classList.remove('is-awaiting-enter'));
      lastActivatedCard = null;
      lastActivationTime = 0;
    }, 520);
  };

  cards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();

      // Keyboard activation must remain immediate and accessible.
      if (event.detail === 0) {
        openBook(card);
        return;
      }

      // A completed drag must never be interpreted as one of the two clicks.
      if (Math.abs(draggedDistance) > 8) {
        lastActivatedCard = null;
        lastActivationTime = 0;
        return;
      }

      const now = performance.now();
      const isSecondClick =
        lastActivatedCard === card &&
        now - lastActivationTime <= 500;

      setActive(index);
      paused = true;

      if (isSecondClick) {
        openBook(card);
        return;
      }

      lastActivatedCard = card;
      lastActivationTime = now;
      markAwaitingSecondClick(card);
    }, { signal });

    card.addEventListener('dblclick', (event) => {
      event.preventDefault();
      openBook(card);
    }, { signal });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      openBook(card);
    }, { signal });
  });

  window.addEventListener('resize', () => {
    targetVelocity = window.innerWidth < 760 ? -58 : -84;
    refreshMeasurements();
  }, { signal });

  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        });
      }

      try {
        await image.decode();
      } catch {
        // A failed image must not block the reel.
      }
    }),
  ).finally(refreshMeasurements);

  refreshMeasurements();
  frame = window.requestAnimationFrame(animate);

  signal.addEventListener('abort', () => {
    window.cancelAnimationFrame(frame);
    window.clearTimeout(activationResetTimer);
    gsap.killTweensOf(track);
    cards.forEach((card) => gsap.killTweensOf(card));
  }, { once: true });
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
    initAtmosphere(signal);
    initCursor(signal);
    initNavigation(signal);
    initReveals();
    initHero(signal);
    initWorks(signal);
    initArchive(signal);
    initBookHero(signal);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initSite);
document.addEventListener('astro:before-preparation', destroySite);
