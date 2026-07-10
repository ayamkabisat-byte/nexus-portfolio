import { useRef, useEffect } from 'react';
import { BOOKS } from '../data/content';
import { SplitText } from './SplitText';
import { gsap, ScrollTrigger } from '../lib/gsap';

// Deterministic per-card "scattered" starting pose — mimics cards mid-flight,
// tilted at different angles, before they settle flat into the grid.
const SCATTER = [
  { x: -70, y: -110, rotate: -13, rotateX: 10, scale: 1.18 },
  { x: 40, y: -150, rotate: 9, rotateX: -8, scale: 1.22 },
  { x: 110, y: -80, rotate: 16, rotateX: 12, scale: 1.15 },
  { x: -90, y: 70, rotate: -11, rotateX: -10, scale: 1.18 },
  { x: 30, y: 120, rotate: 7, rotateX: 9, scale: 1.2 },
  { x: 120, y: 60, rotate: 15, rotateX: -11, scale: 1.15 },
];

export function WorksSection({ onOpenBook }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(gridRef.current.querySelectorAll('.book-card'));
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 92%',
          end: 'top 15%', // long window = slow, smooth settle
          scrub: 0.6,
        },
      });
      cards.forEach((card, i) => {
        const s = SCATTER[i % SCATTER.length];
        tl.fromTo(card,
          { opacity: 0, x: s.x, y: s.y, rotate: s.rotate, rotateX: s.rotateX, scale: s.scale, filter: 'blur(8px)', transformPerspective: 800 },
          { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 1 },
          i * 0.45 // one-by-one: each card's settle starts after the previous, but all still scrubbed to the same scroll range
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="works" style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
      <div className="reveal section-header">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}><SplitText stagger={18}>Featured Works</SplitText></h2>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>{String(BOOKS.length).padStart(2, '0')} NOVELS</span>
      </div>
      <div ref={gridRef} className="works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, perspective: 1200 }}>
        {BOOKS.map((book) => (
          <div key={book.id} className="book-card" data-cursor="hover" onClick={() => onOpenBook(book)}>
            <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
              <img src={book.src} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { if (!e.target.src.includes('placehold')) e.target.src = `https://placehold.co/400x280/0b1428/00F0FF?text=${book.title}`; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,31,0.8) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 10px', background: 'rgba(6,13,31,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, backdropFilter: 'blur(8px)' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'var(--cyan)', textTransform: 'uppercase' }}>{book.genre}</span>
              </div>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '0.02em' }}>{book.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontStyle: 'italic', fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>{book.tagline}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cyan)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em' }}>
                <span>Open Book</span><span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

