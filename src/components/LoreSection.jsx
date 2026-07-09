import { useState } from 'react';
import { LORE } from '../data/content';

export function LoreSection() {
  const [activeLore, setActiveLore] = useState(LORE[0]);

  return (
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
  );
}
