import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

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

    // Keep ScrollTrigger's cached scroll position in sync with Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from gsap.ticker (ms -> s) instead of a separate rAF loop,
    // so Lenis and every GSAP/ScrollTrigger animation share one frame clock.
    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
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