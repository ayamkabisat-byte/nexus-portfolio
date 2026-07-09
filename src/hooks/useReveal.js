import { useEffect } from 'react';

// Adds `.visible` to any `.reveal` element once it enters the viewport.
// Elements never go invisible again after — one-shot reveal, not a toggle.
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
