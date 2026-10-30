import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

// Bruma de atomizador: cada pocos segundos sale un "pssst" de partículas doradas
// que se frenan, suben despacio y se desvanecen. El cursor las aparta.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  hue: number;
}

const COLORS = [
  [246, 227, 200],
  [226, 194, 159],
  [201, 162, 126],
];

export function Mist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onMove);

    const spawn = (n: number, burst: boolean) => {
      for (let i = 0; i < n; i++) {
        const angle = burst ? -Math.PI / 2 + (Math.random() - 0.5) * 2.4 : Math.random() * Math.PI * 2;
        const speed = burst ? 1.5 + Math.random() * 5.5 : Math.random() * 0.3;
        particles.push({
          x: burst ? w / 2 + (Math.random() - 0.5) * 6 : Math.random() * w,
          y: burst ? h * 0.82 : Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 0.7 + Math.random() * (burst ? 2.4 : 1.4),
          life: 0,
          max: 160 + Math.random() * 260,
          hue: Math.floor(Math.random() * COLORS.length),
        });
      }
    };

    const draw = (still: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!still) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 90 * 90) {
            const f = (1 - Math.sqrt(d2) / 90) * 0.6;
            p.vx += (dx / 90) * f;
            p.vy += (dy / 90) * f;
          }
          p.vx *= 0.955;
          p.vy = p.vy * 0.955 - 0.006;
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          if (p.life > p.max) {
            particles.splice(i, 1);
            continue;
          }
        }
        const t = p.life / p.max;
        const alpha = Math.min(1, t * 8) * (1 - t);
        const [r, g, b] = COLORS[p.hue];
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.14})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduced) {
      spawn(140, false);
      particles.forEach((p) => (p.life = p.max * 0.3));
      draw(true);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
      };
    }

    let raf = 0;
    let frame = 0;
    const loop = () => {
      if (frame === 40 || frame % 330 === 40) spawn(260, true);
      if (frame % 12 === 0 && particles.length < 420) spawn(1, false);
      frame++;
      draw(false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div className="hero__emblem hero__emblem--wide mist" aria-hidden>
      <canvas ref={canvasRef} className="mist__canvas" />
    </div>
  );
}
