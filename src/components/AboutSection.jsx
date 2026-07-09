import { WORLDS } from '../data/content';

export function AboutSection() {
  return (
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
  );
}
