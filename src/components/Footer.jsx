export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 2rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', marginBottom: 8 }}>
        MICHAEL <span style={{ color: 'var(--cyan)' }}>DINKO</span>.
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        © {new Date().getFullYear()} Michael Dinko · All Rights Reserved
      </p>
    </footer>
  );
}
