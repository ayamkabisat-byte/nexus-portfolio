import { useRef, useEffect } from 'react';
import { BOOKS } from '../data/content';
import { SplitText } from './SplitText';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function WorksSection({ onOpenBook }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(gridRef.current.querySelectorAll('.book-card'));
      cards.forEach((card, i) => {
        const colOffset = (i % 3) * 6; // stagger trigger point slightly per column so a row reveals left→right, not all at once
        gsap.fromTo(card,
          {
            opacity: 0,
            scale: 0.3,
            x: 220,
            y: -160,
            rotateZ: 10,
            rotateX: 12,
            filter: 'blur(16px)',
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotateZ: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            ease: 'none', // scrub drives the easing itself — a separate ease here would fight it
            scrollTrigger: {
              trigger: card,
              start: `top ${95 - colOffset}%`,
              end: `top ${45 - colOffset}%`, // longer window = slower, smoother reveal
              scrub: 0.4,
            },
          }
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
