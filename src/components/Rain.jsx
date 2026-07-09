import { useEffect, useRef } from 'react';

export function Rain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      len: Math.random() * 18 + 12, speed: Math.random() * 7 + 8,
      thick: Math.random() * 1.2 + 0.5,
    }));
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drops.forEach(d => {
        const g = ctx.createLinearGradient(d.x, d.y, d.x - 0.4, d.y + d.len);
        g.addColorStop(0, 'rgba(0,240,255,0.5)');
        g.addColorStop(1, 'rgba(0,240,255,0)');
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 0.4, d.y + d.len);
        ctx.strokeStyle = g; ctx.lineWidth = d.thick; ctx.stroke();
        d.y += d.speed;
        if (d.y > h + 30) { d.y = -20; d.x = Math.random() * w; }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.4 }} />;
}
