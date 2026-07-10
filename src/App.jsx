import { useState, useEffect } from 'react';
import { useLenis, makeAnchorClickHandler } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { BOOKS } from './data/content';
import { Rain } from './components/Rain';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { WorksSection } from './components/WorksSection';
import { LoreSection } from './components/LoreSection';
import { QuotesSection } from './components/QuotesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookModal } from './components/BookModal';
import { Cursor } from './components/Cursor';
import './App.css';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const lenisRef = useLenis();
  const handleAnchorClick = makeAnchorClickHandler(lenisRef);
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      <Cursor />
      <Rain />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '30%', width: 600, height: 600, background: 'radial-gradient(circle, oklch(0.82 0.14 145 / 0.08) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, oklch(0.82 0.14 75 / 0.05) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, oklch(0.65 0.18 25 / 0.05) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      <Nav scrolled={scrolled} handleAnchorClick={handleAnchorClick} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero handleAnchorClick={handleAnchorClick} onOpenBook={() => setActiveBook(BOOKS[0])} />
        <WorksSection onOpenBook={setActiveBook} />
        <LoreSection />
        <QuotesSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      {activeBook && <BookModal book={activeBook} onClose={() => setActiveBook(null)} />}
    </div>
  );
}
