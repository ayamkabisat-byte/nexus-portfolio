import { Mail, BookOpen, RadioTower } from 'lucide-react';
import { SplitText } from './SplitText';
import { useMagnetic } from '../hooks/useMagnetic';

const CHANNELS = [
  { label: 'Email', val: 'michaeldinko01@gmail.com', href: 'mailto:michaeldinko01@gmail.com', color: 'var(--cyan)', icon: <Mail size={14} /> },
  { label: 'Instagram', val: '@michaeldinko01', href: 'https://instagram.com/michaeldinko01', color: 'var(--amber)' },
  { label: 'Royal Road', val: 'NEXUS Fiction', href: 'https://www.royalroad.com/fiction/163820/nexus-echoes-of-another-self', color: 'var(--red)', icon: <BookOpen size={14} /> },
];

export function ContactSection() {
  const handleSubmit = (e) => { e.preventDefault(); };
  const magneticSubmit = useMagnetic(0.25);

  return (
    <section id="contact" style={{ maxWidth: 1100, margin: '0 auto 80px', padding: '0 2rem' }}>
      <div className="reveal section-header">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}><SplitText stagger={18}>Get in Touch</SplitText></h2>
      </div>
      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Channels */}
        <div className="reveal" style={{ padding: '40px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 32 }}>COMM CHANNELS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {CHANNELS.map(c => (
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
            <button ref={magneticSubmit} type="submit" data-cursor="hover" className="btn-primary" style={{ justifyContent: 'center', borderRadius: 10 }}>
              <RadioTower size={16} /> BROADCAST
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
