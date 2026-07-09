import { useState, useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars -- `Tag` is used below as a dynamic JSX component
export function SplitText({ children, tag: Tag = 'span', baseDelay = 0, stagger = 38, style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const chars = children.split('');
  return (
    <Tag ref={ref} style={{ display: 'inline', ...style }} aria-label={children}>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" style={{
          display: ch === ' ' ? 'inline' : 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) rotate(0deg)' : 'translateY(60px) rotate(6deg)',
          transition: `opacity 0.55s ease ${baseDelay + i * stagger}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * stagger}ms`,
        }}>{ch === ' ' ? '\u00A0' : ch}</span>
      ))}
    </Tag>
  );
}
