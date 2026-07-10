import { QUOTES } from '../data/content';
import { SplitText } from './SplitText';

export function QuotesSection() {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 2rem' }}>
      <div className="reveal section-header" style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}><SplitText stagger={18}>[ Fragments ]</SplitText></h2>
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
  );
}
