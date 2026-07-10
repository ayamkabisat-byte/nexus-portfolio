import { useRef, useEffect } from 'react';
import { BOOKS } from '../data/content';
import { gsap, ScrollTrigger } from '../lib/gsap';

function bezierPoint(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

const CARD_W = 130;
const CARD_H = 176;

export function ArcCarousel({ triggerRef }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const N = BOOKS.length;
      // Each card starts "loaded" at its own point along the first 40% of the
      // curve (spread out, visible at rest — not stacked). As scroll advances,
      // every card moves forward by the same amount, like beads on a belt.
      const idleT = (i) => (N > 1 ? (i / (N - 1)) * 0.4 : 0);
      const travelMultiplier = 1.45;

      const getPoints = () => {
        const w = window.innerWidth, h = window.innerHeight;
        return {
          p0: { x: w * 0.7, y: h * 0.62 },
          p1: { x: w * 0.66, y: h * 0.08 },
          p2: { x: w * 0.2, y: h * -0.12 },
          p3: { x: w * -0.35, y: h * -0.3 },
        };
      };
      let pts = getPoints();
      const onResize = () => { pts = getPoints(); };
      window.addEventListener('resize', onResize);

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          cardsRef.current.forEach((el, i) => {
            if (!el) return;
            const t = gsap.utils.clamp(0, 1, idleT(i) + p * travelMultiplier);
            const pos = bezierPoint(t, pts.p0, pts.p1, pts.p2, pts.p3);
            const posAhead = bezierPoint(Math.min(1, t + 0.02), pts.p0, pts.p1, pts.p2, pts.p3);
            const angle = Math.atan2(posAhead.y - pos.y, posAhead.x - pos.x) * (180 / Math.PI);
            const scale = 0.55 + 0.5 * Math.sin(Math.min(1, t) * Math.PI); // biggest mid-curve
            const fadeOut = t > 0.92 ? gsap.utils.mapRange(0.92, 1, 1, 0, t) : 1;
            gsap.set(el, {
              x: pos.x - CARD_W / 2, y: pos.y - CARD_H / 2,
              rotate: angle * 0.12,
              scale: Math.max(0.4, scale),
              opacity: fadeOut,
            });
          });
        },
      });

      return () => { window.removeEventListener('resize', onResize); st.kill(); };
    }, containerRef);
    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {BOOKS.map((book, i) => (
        <div key={book.id} ref={(el) => (cardsRef.current[i] = el)}
          style={{ position: 'absolute', top: 0, left: 0, width: CARD_W, height: CARD_H, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', willChange: 'transform, opacity' }}>
          <img src={book.src} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { if (!e.target.src.includes('placehold')) e.target.src = `https://placehold.co/260x352/0b1428/00F0FF?text=${book.title}`; }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,31,0.55) 0%, transparent 55%)' }} />
        </div>
      ))}
    </div>
  );
}
