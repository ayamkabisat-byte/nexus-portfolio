import { useState, useEffect } from 'react';

export function BookModal({ book, onClose }) {
  const [stage, setStage] = useState('closed'); // closed → opening → open → closing

  const handleClose = () => {
    setStage('closing');
    setTimeout(() => { setStage('closed'); onClose(); }, 800);
  };

  useEffect(() => {
    setTimeout(() => setStage('opening'), 30);
    setTimeout(() => setStage('open'), 200);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isOpen    = stage === 'open';
  const isVisible = stage !== 'closed';
  const BW = 220;
  const BH = 360;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', perspective: 2000 }}>

      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,22,0.96)', backdropFilter: 'blur(12px)', opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s' }} />

      {/* Close button */}
      <button onClick={handleClose} aria-label="Close" style={{
        position: 'absolute', top: 24, right: 24, zIndex: 300,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.6)', borderRadius: '50%',
        width: 36, height: 36, fontSize: 16, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>✕</button>

      {/* 3D Book scene */}
      <div style={{
        position: 'relative', zIndex: 10,
        transformStyle: 'preserve-3d',
        transform: isVisible
          ? (isOpen ? `translateX(${BW / 2}px) scale(1)` : 'translateX(0px) scale(0.92)')
          : 'translateX(0px) scale(0.88)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.85s cubic-bezier(0.25,1,0.5,1), opacity 0.4s',
        width: BW, height: BH,
      }}>

        {/* Right page — synopsis */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: BW, height: BH,
          background: '#0d1a35',
          borderRadius: '0 10px 10px 0',
          border: '1px solid rgba(255,255,255,0.08)', borderLeft: 'none',
          boxShadow: '12px 0 40px rgba(0,0,0,0.6)',
          overflowY: 'auto',
          padding: '28px 24px 28px 20px',
          display: 'flex', flexDirection: 'column',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 18%)',
        }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 8 }}>{book.genre}</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 6 }}>{book.title}</h2>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.5 }}>{book.tagline}</p>
          <div style={{ width: 20, height: 1, background: 'var(--cyan)', marginBottom: 16, opacity: 0.5, flexShrink: 0 }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.85, color: 'rgba(255,255,255,0.65)', flex: 1, overflowY: 'auto' }}>
            {book.synopsis.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: 10 }}>{p}</p>)}
          </div>
          {book.link && (
            <a href={book.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              style={{ display: 'block', marginTop: 16, padding: '9px 16px', background: 'var(--cyan)', color: '#060d1f', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', letterSpacing: '0.05em', flexShrink: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = 0.82}
              onMouseLeave={e => e.target.style.opacity = 1}>Read First Chapter →</a>
          )}
        </div>

        {/* Cover — flips open */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: BW, height: BH,
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          transform: isOpen ? 'rotateY(-175deg)' : 'rotateY(0deg)',
          transition: 'transform 0.85s cubic-bezier(0.25,1,0.5,1)',
          zIndex: 10,
        }}>
          {/* Front face */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: '4px 10px 10px 4px', overflow: 'hidden', boxShadow: isOpen ? 'none' : '-6px 6px 30px rgba(0,0,0,0.8)', transition: 'box-shadow 0.4s' }}>
            <img src={book.src} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { if (!e.target.src.includes('placehold')) e.target.src = `https://placehold.co/220x360/0b1428/00F0FF?text=${book.title}`; }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: '100%', background: 'linear-gradient(to left,rgba(0,0,0,0.5),transparent)' }} />
          </div>
          {/* Back face — inside cover */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0a1428',
            borderRadius: '10px 4px 4px 10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 28, border: '1px solid rgba(255,255,255,0.06)',
            backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 20%)',
          }}>
            <div style={{ fontSize: 48, fontFamily: "'Playfair Display',serif", color: 'var(--cyan)', opacity: 0.12, lineHeight: 1, marginBottom: 16, fontWeight: 700 }}>"</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.8 }}>{book.tagline}</p>
            <div style={{ marginTop: 20, width: 24, height: 1, background: 'var(--cyan)', opacity: 0.3 }} />
            <p style={{ marginTop: 12, fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>FILE // CLASSIFIED</p>
          </div>
        </div>

        {/* Spine */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: BH, background: 'linear-gradient(to right,#050b1a,#0d1a35)', zIndex: 5, boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.5)' }} />
      </div>
    </div>
  );
}
