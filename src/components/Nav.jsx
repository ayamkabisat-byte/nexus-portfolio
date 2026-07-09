import { useState, useEffect } from 'react';

const SECTIONS = ['Works', 'Lore', 'About', 'Contact'];
const READ_NOW_LINK = 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self';

export function Nav({ scrolled, handleAnchorClick }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const fn = (e) => { if (!e.target.closest('#mobile-nav') && !e.target.closest('#hamburger')) setNavOpen(false); };
    window.addEventListener('click', fn);
    return () => window.removeEventListener('click', fn);
  }, [navOpen]);

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? '12px 0' : '24px 0', transition: 'padding 0.4s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#home" onClick={handleAnchorClick} style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none', letterSpacing: '0.05em' }}>
            M.<span style={{ color: 'var(--cyan)' }}>Dinko</span>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {SECTIONS.map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} onClick={handleAnchorClick} className="nav-link">{s}</a>
            ))}
            <a href={READ_NOW_LINK} target="_blank" rel="noreferrer" className="nav-cta">START READING</a>
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
        {SECTIONS.map((s, i) => (
          <a key={s} href={`#${s.toLowerCase()}`} onClick={(e) => { handleAnchorClick(e); setNavOpen(false); }}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em', padding: '10px 0', transform: navOpen ? 'translateY(0)' : 'translateY(20px)', opacity: navOpen ? 1 : 0, transition: `transform 0.4s ease ${i * 70}ms, opacity 0.4s ease ${i * 70}ms, color 0.2s` }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'} onMouseLeave={e => e.target.style.color = '#fff'}>{s}</a>
        ))}
        <a href={READ_NOW_LINK} target="_blank" rel="noreferrer" onClick={() => setNavOpen(false)}
          style={{ marginTop: 24, padding: '12px 32px', border: '1px solid var(--cyan)', borderRadius: 100, color: 'var(--cyan)', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', transform: navOpen ? 'translateY(0)' : 'translateY(20px)', opacity: navOpen ? 1 : 0, transition: `all 0.4s ease ${4 * 70}ms` }}>START READING</a>
      </div>
    </>
  );
}
