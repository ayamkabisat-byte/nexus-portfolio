import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isHovering = useRef(false);
  const [enabled] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    function onMove(e) {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);

      const hovering = !!e.target.closest('[data-cursor="hover"]');
      if (hovering && !isHovering.current) {
        isHovering.current = true;
        gsap.to(ring, { scale: 2.2, borderColor: 'var(--cyan)', duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      } else if (!hovering && isHovering.current) {
        isHovering.current = false;
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    }

    document.documentElement.style.cursor = 'none';
    window.addEventListener('mousemove', onMove);
    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: '50%',
        background: 'var(--cyan)', pointerEvents: 'none', zIndex: 9999,
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, width: 34, height: 34, borderRadius: '50%',
        border: '1px solid rgba(0,240,255,0.5)', pointerEvents: 'none', zIndex: 9998,
      }} />
    </>
  );
}
