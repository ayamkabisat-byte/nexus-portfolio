import { BookOpen, Database } from 'lucide-react';
import { SplitText } from './SplitText';
import { useParallax } from '../hooks/useParallax';

export function Hero({ handleAnchorClick, onOpenBook }) {
  const parallax = useParallax();
  return (
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
          <a href="#works" onClick={handleAnchorClick} className="btn-primary"><BookOpen size={16} /> Explore Works</a>
          <a href="#lore" onClick={handleAnchorClick} className="btn-outline"><Database size={16} style={{ color: 'var(--cyan)' }} /> Access Lore Database</a>
        </div>
        {/* Floating book cover */}
        <div onClick={onOpenBook} className="animate-float"
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
  );
}
