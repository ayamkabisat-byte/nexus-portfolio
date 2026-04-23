import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Mail, Send, Database, Quote, RadioTower, Satellite, Calculator, FlaskConical, PenTool, X } from 'lucide-react';
import './App.css';

// ── DATA ─────────────────────────────────────────────────────────────────────

const BOOKS = [
  {
    id: 'nexus', title: 'NEXUS', genre: 'Sci-Fi Thriller',
    src: '/Cover_Nexus.webp',
    tagline: 'What if you could borrow the skills of another version of yourself?',
    synopsis: 'Luckas Lazuardi, an ordinary young man, discovers the Nexus Device—granting him access to borrow the abilities of his alternate selves across other universes. However, the pendant also acts as a beacon, drawing the attention of the Custodians and an inter-dimensional murderous Fugitive.\n\nNow, he must run, not just for his freedom, but to maintain his very existence across the multiverse.',
    link: 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self',
  },
  {
    id: 'sillage', title: 'SILLAGE', genre: 'Mystery / Crime',
    src: '/Cover_Sillage.webp',
    tagline: 'Scent is the most primal language that never lies.',
    synopsis: 'Raka, a quiet auditor, possesses a weapon unlike any other: a hyper-acute sense of smell. Realizing that scent is the most primal language that never lies, he begins peeling back the rotten layers of bureaucracy within his ministry.\n\nBut as the line between justice and revenge blurs, Raka must decide if he is the victim, or a new monster rising.',
  },
  {
    id: 'manifesto', title: 'MANIFESTO', genre: 'Dystopian Thriller',
    src: '/Cover_Manifesto.webp',
    tagline: 'An idea cannot be killed.',
    synopsis: 'A desperate father. A corrupt system. And a nightmare that fights back. Banyu stamps fake environmental reports by day. By night, his rage manifests as a masked entity that hunts the powerful in their dreams.\n\nBut the line between justice and blind terror is thin — and Banyu is losing control.',
  },
];

const LORE = [
  {
    id: 'nexus_device', tag: 'ARTIFACT', title: 'Nexus Device', sub: 'Quantum Inter-Dimensional Key',
    content: "A dull silver pendant with intricate geometric patterns and an obsidian-black stone. It's not just a tool, but a 'Key to the Multiverse'. It allows its user to borrow skills (Eternal Echoes) from alternative versions of themselves across universal boundaries.",
  },
  {
    id: 'custodians', tag: 'FACTION', title: 'Custodian Faction', sub: 'Cosmic Stability Guardians',
    content: 'An inter-dimensional organization tasked with preventing timeline incursions and reality-threatening paradoxes. They utilize cutting-edge technology like the unhackable, encrypted Portable Quantum Entanglement Communicator and Sequencer (PQECS).',
  },
  {
    id: 'classification', tag: 'CLASSIFIED', title: 'Anomaly Classification', sub: 'Power Tiers',
    content: 'Based on Custodian archives: Tier 1 (Echo) for non-invasive skill borrowing. Tier 2 (Manifestation) which violates local scientific laws, like telekinesis. Tier 3 (Warp) which is absolute reality bending — God Tier.',
  },
  {
    id: 'fugitive', tag: 'THREAT', title: 'The Fugitive', sub: 'Prime Multiverse Threat',
    content: 'A deviant Nexus user with a deadly cybernetic implant in his heart. Instead of borrowing, he steals abilities by murdering his alternate selves in other universes, tearing the fabric of reality to find his way back home.',
  },
];

const QUOTES = [
  { text: '"Every time I borrow the skills of my other selves, I lose a little memory of who I truly am."', by: 'Luckas Lazuardi', role: 'PRIME', color: 'var(--cyan)' },
  { text: '"My job was just to observe. But the protocols in my head are starting to feel like suggestions, not commands."', by: 'Natasha', role: 'CUSTODIAN', color: 'var(--amber)' },
  { text: '"There are twelve versions of you out there. The other eleven are trash."', by: 'Mysterious Variant', role: 'HUNTER', color: 'var(--red)' },
];

const WORLDS = [
  { n: '01', title: 'The Auditor', icon: <Calculator size={20} />, color: 'var(--cyan)', desc: 'By day, he navigates the labyrinth of government bureaucracy in Jakarta. Numbers and reports are his weapons, providing the raw material of tension and power dynamics for his fiction.' },
  { n: '02', title: 'The Collector', icon: <FlaskConical size={20} />, color: 'var(--amber)', desc: 'A niche perfume collector who believes scent is the most primal language that never lies. This sensory obsession seeps deeply into his work, building dense atmospheres in every scene he writes.' },
  { n: '03', title: 'The Author', icon: <PenTool size={20} />, color: 'var(--red)', desc: 'By night, he transforms bureaucratic frustration and sensory obsession into sci-fi thrillers. Writing is his way of exploring the blurred line between justice and revenge — a thin boundary separating victims from monsters.' },
];

// ── RAIN CANVAS ───────────────────────────────────────────────────────────────

function Rain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      len: Math.random() * 18 + 12, speed: Math.random() * 7 + 8,
      thick: Math.random() * 1.2 + 0.5,
    }));
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drops.forEach(d => {
        const g = ctx.createLinearGradient(d.x, d.y, d.x - 0.4, d.y + d.len);
        g.addColorStop(0, 'rgba(0,240,255,0.5)');
        g.addColorStop(1, 'rgba(0,240,255,0)');
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 0.4, d.y + d.len);
        ctx.strokeStyle = g; ctx.lineWidth = d.thick; ctx.stroke();
        d.y += d.speed;
        if (d.y > h + 30) { d.y = -20; d.x = Math.random() * w; }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />;
}

// ── BOOK MODAL ────────────────────────────────────────────────────────────────

function BookModal({ book, onClose }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setTimeout(() => setOpen(true), 30); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const handleClose = () => { setOpen(false); setTimeout(onClose, 600); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(6,13,31,0.94)', backdropFilter: 'blur(10px)', opacity: open ? 1 : 0, transition: 'opacity 0.6s' }} />

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 10, display: 'flex', maxWidth: 760, width: '100%',
        borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        opacity: open ? 1 : 0, transition: 'all 0.6s cubic-bezier(0.25,1,0.5,1)',
      }}>
        {/* Cover */}
        <div className="modal-cover" style={{ width: 200, flexShrink: 0, position: 'relative' }}>
          <img src={book.src} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { if (!e.target.src.includes('placehold')) e.target.src = `https://placehold.co/200x320/0b1428/00F0FF?text=${book.title}`; }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, rgba(11,20,40,1))' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#0b1428', padding: '2.5rem 2rem', overflowY: 'auto', maxHeight: '80vh', position: 'relative' }}>
          <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }} aria-label="Close">✕</button>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 8 }}>{book.genre}</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>{book.title}</h2>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>{book.tagline}</p>
          <div style={{ width: 32, height: 1, background: 'var(--cyan)', marginBottom: 24, opacity: 0.6 }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.9, color: 'rgba(255,255,255,0.75)' }}>
            {book.synopsis.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: 12 }}>{p}</p>)}
          </div>
          {book.link && (
            <a href={book.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="btn-primary" style={{ marginTop: 28, fontSize: 13 }}>
              Read First Chapter →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [activeLore, setActiveLore] = useState(LORE[0]);
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSubmit = (e) => { e.preventDefault(); };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      <Rain />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 600, height: 600, background: 'radial-gradient(circle, oklch(0.82 0.14 145 / 0.08) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, oklch(0.82 0.14 75 / 0.05) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, oklch(0.65 0.18 25 / 0.05) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? '12px 0' : '24px 0', transition: 'padding 0.4s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#home" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none', letterSpacing: '0.05em' }}>
            M.<span style={{ color: 'var(--cyan)' }}>Dinko</span>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {['Works', 'Lore', 'About', 'Contact'].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
            ))}
            <a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="nav-cta">
              START READING
            </a>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 2 }}>

        {/* ── HERO ── */}
        <section id="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 2rem 80px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 32, height: 1, background: 'var(--cyan)', opacity: 0.6 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.3em', color: 'var(--cyan)', textTransform: 'uppercase' }}>Sci-Fi Thriller · Author Portfolio</span>
          </div>

          <div className="reveal reveal-delay-1" style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(64px, 8vw, 108px)', fontWeight: 900, lineHeight: 0.92, color: '#fff', letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Stories<br />
              <em style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>Between</em><br />
              Worlds.
            </h1>
          </div>

          <p className="reveal reveal-delay-2" style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 420, marginBottom: 48 }}>
            Dystopian bureaucracies. Multiversal fugitives.<br />Scents that expose corruption.
          </p>

          <div className="reveal reveal-delay-3" style={{ display: 'flex', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="#works" className="btn-primary"><BookOpen size={16} /> Explore Works</a>
              <a href="#lore" className="btn-outline"><Database size={16} style={{ color: 'var(--cyan)' }} /> Access Lore Database</a>
            </div>
            {/* Floating book cover */}
            <div onClick={() => setActiveBook(BOOKS[0])} className="animate-float"
              style={{ width: 110, aspectRatio: '2/3', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', boxShadow: '8px 16px 40px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '8px 16px 40px rgba(0,0,0,0.7)'; }}>
              <img src="/Cover_Nexus.webp" alt="Nexus" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { if (!e.target.src.includes('placehold')) e.target.src = 'https://placehold.co/200x300/0b1428/00F0FF?text=NEXUS'; }} />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="reveal reveal-delay-4" style={{ position: 'absolute', bottom: 40, left: '2rem', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.3 }}>
            <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden' }}>
              <div className="animate-scroll-line" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'var(--cyan)' }} />
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl', color: '#fff' }}>Scroll</span>
          </div>
        </section>

        {/* ── WORKS ── */}
        <section id="works" style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
          <div className="reveal section-header">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Featured Works</h2>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>03 NOVELS</span>
          </div>
          <div className="works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {BOOKS.map((book, i) => (
              <div key={book.id} className={`book-card reveal reveal-delay-${i + 1}`} onClick={() => setActiveBook(book)}>
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

        {/* ── LORE DATABASE ── */}
        <section id="lore" style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
          <div className="reveal section-header">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Lore Database</h2>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>NEXUS · CLASSIFIED</span>
          </div>
          <div className="reveal lore-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
            {/* Sidebar */}
            <div className="lore-sidebar" style={{ background: 'rgba(6,13,31,0.6)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '8px 0' }}>
              <div style={{ padding: '12px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {['#ff5f57', '#ffbd2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>NEXUS_DB v2.4.1</span>
              </div>
              {LORE.map(item => (
                <button key={item.id} onClick={() => setActiveLore(item)}
                  className={`lore-btn ${activeLore.id === item.id ? 'active' : ''}`}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', background: 'transparent', border: 'none', borderLeft: `2px solid ${activeLore.id === item.id ? 'var(--cyan)' : 'transparent'}`, cursor: 'pointer' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: activeLore.id === item.id ? 'var(--cyan)' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 4 }}>{item.tag}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: activeLore.id === item.id ? '#fff' : 'rgba(255,255,255,0.5)' }}>{item.title}</div>
                </button>
              ))}
            </div>
            {/* Content */}
            <div style={{ padding: '36px 40px', background: 'rgba(11,20,40,0.4)', position: 'relative', minHeight: 280 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: 8 }}>[ENTRY // {activeLore.tag}]</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>{activeLore.title}</h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 28, letterSpacing: '0.1em' }}>{activeLore.sub}</p>
              <div style={{ width: 24, height: 1, background: 'var(--cyan)', marginBottom: 28, opacity: 0.5 }} />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 2, color: 'rgba(255,255,255,0.7)' }}>{activeLore.content}</p>
              <div style={{ position: 'absolute', bottom: 24, right: 28, fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.08)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>CUSTODIAN ARCHIVES // RESTRICTED</div>
            </div>
          </div>
        </section>

        {/* ── FRAGMENTS ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
          <div className="reveal section-header" style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>[ Fragments ]</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>RECOVERED TRANSMISSIONS FROM ACROSS THE MULTIVERSE</p>
          </div>
          <div className="quotes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {QUOTES.map((q, i) => (
              <div key={i} className={`quote-card reveal reveal-delay-${i + 1}`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = q.color + '44'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <div aria-hidden="true" style={{ fontFamily: "'Playfair Display', serif", fontSize: 100, lineHeight: 1, color: q.color, opacity: 0.07, position: 'absolute', top: -8, left: 20, fontWeight: 700 }}>"</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: 'italic', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: 24, position: 'relative', zIndex: 1 }}>{q.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 16, height: 1, background: q.color, opacity: 0.6 }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{q.by}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: q.color, textTransform: 'uppercase' }}>{q.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
          <div className="reveal section-header">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>The Author</h2>
          </div>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'start' }}>
            {/* Photo */}
            <div className="reveal photo-sticky" style={{ position: 'sticky', top: 120 }}>
              <div style={{ aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', marginBottom: 24 }}>
                <img src="/author.jpeg" alt="Michael Dinko" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }}
                  onError={e => { e.target.style.background = '#0b1428'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,31,0.7) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#fff' }}>Michael Dinko</h3>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>Jakarta, Indonesia</p>
                </div>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, paddingLeft: 16, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                "An identity fractured across three worlds, brought back together by a string of words."
              </p>
            </div>
            {/* Three worlds */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {WORLDS.map((item, i) => (
                <div key={i} className={`world-row reveal reveal-delay-${i + 1}`} style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: item.color, opacity: 0.6 }}>{item.n}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 2, color: 'rgba(255,255,255,0.55)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 2rem' }}>
          <div className="reveal section-header">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Get in Touch</h2>
          </div>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Channels */}
            <div className="reveal" style={{ padding: '40px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 32 }}>COMM CHANNELS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {[
                  { label: 'Email', val: 'michaeldinko01@gmail.com', href: 'mailto:michaeldinko01@gmail.com', color: 'var(--cyan)', icon: <Mail size={14} /> },
                  { label: 'Instagram', val: '@michaeldinko01', href: 'https://instagram.com/michaeldinko01', color: 'var(--amber)' },
                  { label: 'Royal Road', val: 'NEXUS Fiction', href: 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self', color: 'var(--red)', icon: <BookOpen size={14} /> },
                ].map(c => (
                  <div key={c.label}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{c.label}</span>
                    <a href={c.href} target="_blank" rel="noreferrer"
                      style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = c.color}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}>{c.val}</a>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40, padding: 20, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                  "Sometimes signals from another universe are clearer than chatter in an audit office."
                </p>
              </div>
            </div>
            {/* Form */}
            <div className="reveal reveal-delay-1" style={{ padding: '40px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 32 }}>TRANSMIT MESSAGE</p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input type="text" placeholder="Identifier (Name)" className="contact-input" />
                <input type="email" placeholder="Email Frequency" className="contact-input" />
                <textarea placeholder="Message Body" rows={4} className="contact-input" style={{ resize: 'none' }} />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', borderRadius: 10 }}>
                  <RadioTower size={16} /> BROADCAST
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 2rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', marginBottom: 8 }}>
          MICHAEL <span style={{ color: 'var(--cyan)' }}>DINKO</span>.
        </div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} Michael Dinko · All Rights Reserved
        </p>
      </footer>

      {/* Book Modal */}
      {activeBook && <BookModal book={activeBook} onClose={() => setActiveBook(null)} />}
    </div>
  );
}
