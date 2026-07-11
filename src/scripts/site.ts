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

function initWorks() {
  const section = document.querySelector<HTMLElement>('[data-works]');
  const stage = document.querySelector<HTMLElement>('[data-works-stage]');
  const ribbon = document.querySelector<HTMLElement>('[data-works-ribbon]');
  const deck = document.querySelector<HTMLElement>('[data-works-deck]');
  if (!section || !stage || !ribbon || !deck) return;

  const ribbonCards = gsap.utils.toArray<HTMLElement>('[data-ribbon-card]', ribbon);
  const cards = gsap.utils.toArray<HTMLElement>('[data-work-card]', deck);
  const title = section.querySelector<HTMLElement>('[data-works-title]');
  const intro = section.querySelector<HTMLElement>('[data-works-intro]');
  const assembled = section.querySelector<HTMLElement>('[data-works-assembled]');
  const progress = section.querySelector<HTMLElement>('[data-works-progress]');

  const images = Array.from(section.querySelectorAll<HTMLImageElement>('img'));
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
        // Failed decoding should not hold the rest of the scene.
      }
    }),
  ).finally(() => ScrollTrigger.refresh());

  const media = gsap.matchMedia();

  media.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
    type Point = { x: number; y: number };
    const clamp = gsap.utils.clamp;
    const lerp = (a: number, b: number, amount: number) => a + (b - a) * amount;
    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
    const smooth = (value: number) => value * value * (3 - 2 * value);

    const dimensions = () => ({
      width: stage.clientWidth,
      height: stage.clientHeight,
      cardWidth: cards[0]?.offsetWidth || 150,
      cardHeight: cards[0]?.offsetHeight || 255,
      ribbonWidth: ribbonCards[0]?.offsetWidth || 142,
      ribbonHeight: ribbonCards[0]?.offsetHeight || 213,
    });

    const points = () => {
      const dim = dimensions();
      return {
        p0: { x: -dim.width * 0.16, y: dim.height * 0.8 },
        p1: { x: dim.width * 0.18, y: dim.height * 0.74 },
        p2: { x: dim.width * 0.63, y: dim.height * 0.12 },
        p3: { x: dim.width * 1.16, y: dim.height * 0.02 },
      };
    };

    const bezier = (t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point => {
      const mt = 1 - t;
      return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
      };
    };

    const ribbonT = (progressValue: number, index: number) => clamp(0, 1, progressValue * 1.38 + index * 0.045 - 0.43);

    const pathPose = (progressValue: number, index: number) => {
      const path = points();
      const t = ribbonT(progressValue, index);
      const position = bezier(t, path.p0, path.p1, path.p2, path.p3);
      const ahead = bezier(Math.min(1, t + 0.012), path.p0, path.p1, path.p2, path.p3);
      const angle = Math.atan2(ahead.y - position.y, ahead.x - position.x) * (180 / Math.PI);
      const scale = 0.48 + Math.sin(t * Math.PI) * 0.62;
      const fadeIn = smooth(clamp(0, 1, t / 0.1));
      const fadeOut = 1 - smooth(clamp(0, 1, (t - 0.86) / 0.14));
      return { t, position, angle, scale, opacity: fadeIn * fadeOut };
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

    gsap.set([...ribbonCards, ...cards], {
      force3D: true,
      transformOrigin: '50% 50%',
      backfaceVisibility: 'hidden',
    });
    gsap.set(cards, { autoAlpha: 0 });
    cards.forEach((card) => gsap.set(card.querySelector('.work-card__meta'), { opacity: 0, y: 12 }));

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=340%',
      scrub: 1.05,
      pin: stage,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const dim = dimensions();

        ribbonCards.forEach((card, index) => {
          const pose = pathPose(p, index);
          const dockingIndex = index >= 6 ? index - 6 : -1;
          const dockStart = dockingIndex >= 0 ? 0.5 + dockingIndex * 0.055 : 2;
          const dock = dockingIndex >= 0 ? smooth(clamp(0, 1, (p - dockStart) / 0.18)) : 0;
          const depthTilt = lerp(38, -32, clamp(0, 1, pose.position.x / dim.width));

          gsap.set(card, {
            x: pose.position.x - dim.ribbonWidth / 2,
            y: pose.position.y - dim.ribbonHeight / 2,
            z: (pose.scale - 0.5) * 150,
            rotateZ: pose.angle * 0.16,
            rotateY: depthTilt,
            scale: pose.scale,
            opacity: pose.opacity * (1 - dock),
          });
        });

        cards.forEach((card, index) => {
          const ribbonIndex = index + 6;
          const pose = pathPose(p, ribbonIndex);
          const dockStart = 0.5 + index * 0.055;
          const rawDock = clamp(0, 1, (p - dockStart) / 0.18);
          const dock = easeOut(rawDock);
          const sourceX = pose.position.x - dim.width / 2;
          const sourceY = pose.position.y - dim.height / 2;
          const targetX = gridPose(index, 'x');
          const targetY = gridPose(index, 'y');
          const depthTilt = lerp(30, -25, clamp(0, 1, pose.position.x / dim.width));

          gsap.set(card, {
            x: lerp(sourceX, targetX, dock),
            y: lerp(sourceY, targetY, dock),
            z: lerp((pose.scale - 0.5) * 140, 0, dock),
            rotateY: lerp(depthTilt, 0, dock),
            rotateZ: lerp(pose.angle * 0.16, 0, dock),
            scale: lerp(pose.scale, 1, dock),
            autoAlpha: smooth(clamp(0, 1, rawDock * 1.75)),
          });

          gsap.set(card.querySelector('.work-card__meta'), {
            opacity: smooth(clamp(0, 1, (rawDock - 0.42) / 0.58)),
            y: lerp(12, 0, dock),
          });
        });

        const assembledProgress = smooth(clamp(0, 1, (p - 0.78) / 0.14));
        const introProgress = smooth(clamp(0, 1, (p - 0.3) / 0.18));
        stage.classList.toggle('is-assembled', p > 0.95);
        gsap.set(intro, { opacity: 1 - introProgress, y: -18 * introProgress });
        gsap.set(assembled, { opacity: assembledProgress, y: 16 * (1 - assembledProgress) });
        gsap.set(title, { scale: 1 + p * 0.045, opacity: lerp(0.04, 0.022, p) });
        gsap.set(progress, { scaleX: p });
      },
    });

    return () => {
      stage.classList.remove('is-assembled');
      trigger.kill();
      gsap.set([...ribbonCards, ...cards], { clearProps: 'all' });
      cards.forEach((card) => gsap.set(card.querySelector('.work-card__meta'), { clearProps: 'all' }));
      gsap.set([intro, assembled, title, progress].filter(Boolean), { clearProps: 'all' });
    };
  });

  media.add('(max-width: 860px), (prefers-reduced-motion: reduce)', () => {
    stage.classList.add('is-assembled');
    gsap.set(ribbon, { display: 'none' });
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
    return () => {
      stage.classList.remove('is-assembled');
      reveal.kill();
      gsap.set(ribbon, { clearProps: 'all' });
    };
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
    initAtmosphere(signal);
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
