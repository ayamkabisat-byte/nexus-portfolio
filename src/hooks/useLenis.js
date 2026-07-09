import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

export function makeAnchorClickHandler(lenisRef, { offset = -76, onNavigate } = {}) {
  return function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    onNavigate?.();

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.3 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
}