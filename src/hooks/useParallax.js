import { useState, useEffect } from 'react';

// Tracks window.scrollY for parallax transforms. Kept as its own hook (and
// consumed only by Hero.jsx) so scroll-driven re-renders don't ripple into
// components that don't need the value.
export function useParallax() {
  const [py, setPy] = useState(0);
  useEffect(() => {
    const fn = () => setPy(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return py;
}
