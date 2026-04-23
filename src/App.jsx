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

// ── 3D BOOK MODAL ────────────────────────────────────────────────────────────

function BookModal({ book, onClose }) {
  const [stage, setStage] = useState('closed'); // closed → opening → open → closing

  useEffect(() => {
    setTimeout(() => setStage('opening'), 30);
    setTimeout(() => setStage('open'), 200);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setStage('closing');
    setTimeout(() => { setStage('closed'); onClose(); }, 800);
  };

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

// ── SPLIT TEXT — letter by letter reveal ─────────────────────────────────────

function SplitText({ children, tag: Tag = 'span', baseDelay = 0, stagger = 38, style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const chars = children.split('');
  return (
    <Tag ref={ref} style={{ display: 'inline', ...style }} aria-label={children}>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" style={{
          display: ch === ' ' ? 'inline' : 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) rotate(0deg)' : 'translateY(60px) rotate(6deg)',
          transition: `opacity 0.55s ease ${baseDelay + i * stagger}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * stagger}ms`,
        }}>{ch === ' ' ? '\u00A0' : ch}</span>
      ))}
    </Tag>
  );
}

// ── PARALLAX HOOK ─────────────────────────────────────────────────────────────

function useParallax() {
  const [py, setPy] = useState(0);
  useEffect(() => {
    const fn = () => setPy(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return py;
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [activeLore, setActiveLore] = useState(LORE[0]);
  const [navOpen, setNavOpen] = useState(false);
  const parallax = useParallax();
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const fn = (e) => { if (!e.target.closest('#mobile-nav') && !e.target.closest('#hamburger')) setNavOpen(false); };
    window.addEventListener('click', fn);
    return () => window.removeEventListener('click', fn);
  }, [navOpen]);

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
            <a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" className="nav-cta">START READING</a>
          </div>
          <button id="hamburger" onClick={() => setNavOpen(o => !o)}
            style={{ display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, width: 40, height: 40, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, zIndex: 150 }}
            className="hamburger-btn" aria-label="Toggle menu">
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: navOpen ? 'rotate(45deg) translate(4.5px,4.5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', opacity: navOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: navOpen ? 'rotate(-45deg) translate(4.5px,-4.5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div id="mobile-nav" style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(4,9,22,0.97)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: navOpen ? 1 : 0, pointerEvents: navOpen ? 'all' : 'none', transition: 'opacity 0.35s ease' }}>
        {['Works', 'Lore', 'About', 'Contact'].map((s, i) => (
          <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setNavOpen(false)}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em', padding: '10px 0', transform: navOpen ? 'translateY(0)' : 'translateY(20px)', opacity: navOpen ? 1 : 0, transition: `transform 0.4s ease ${i * 70}ms, opacity 0.4s ease ${i * 70}ms, color 0.2s` }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'} onMouseLeave={e => e.target.style.color = '#fff'}>{s}</a>
        ))}
        <a href="https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self" target="_blank" rel="noreferrer" onClick={() => setNavOpen(false)}
          style={{ marginTop: 24, padding: '12px 32px', border: '1px solid var(--cyan)', borderRadius: 100, color: 'var(--cyan)', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', transform: navOpen ? 'translateY(0)' : 'translateY(20px)', opacity: navOpen ? 1 : 0, transition: `all 0.4s ease ${4 * 70}ms` }}>START READING</a>
      </div>

      <main style={{ position: 'relative', zIndex: 2 }}>

        {/* ── HERO ── */}
        <section id="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 2rem 80px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 32, height: 1, background: 'var(--cyan)', opacity: 0.6 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.3em', color: 'var(--cyan)', textTransform: 'uppercase' }}>Sci-Fi Thriller · Author Portfolio</span>
          </div>

          <div style={{ position: 'relative', marginBottom: 24, transform: `translateY(${parallax * 0.18}px)` }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(64px, 8vw, 108px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.02em', textWrap: 'balance', color: '#fff' }}>
              <SplitText baseDelay={200} stagger={40}>Stories</SplitText><br />
              <SplitText baseDelay={520} stagger={40} style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>Between</SplitText><br />
              <SplitText baseDelay={840} stagger={40}>Worlds.</SplitText>
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
              <div style={{ aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', marginBottom: 24 }}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.filter = 'grayscale(0%) brightness(1)'; e.currentTarget.querySelector('.photo-overlay').style.opacity = 0; }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.filter = 'grayscale(100%) brightness(0.55)'; e.currentTarget.querySelector('.photo-overlay').style.opacity = 1; }}>
                <img src="/author.jpeg" alt="Michael Dinko" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.55)', transition: 'filter 0.7s ease' }}
                  onError={e => { e.target.style.background = '#0b1428'; }} />
                <div className="photo-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,31,0.75) 0%, transparent 50%)', transition: 'opacity 0.7s ease' }} />
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
