import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

// Dunas doradas en la franja baja de la portada: líneas onduladas que se mueven
// despacio, con un sol dorado que sale detrás al cargar. El cursor las desplaza un poco.

export function Dunes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
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

    let mx = 0;
    let smx = 0;
    const onMove = (e: PointerEvent) => (mx = e.clientX / window.innerWidth - 0.5);
    window.addEventListener("pointermove", onMove);

    const LINES = 9;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      smx += (mx - smx) * 0.04;
      ctx.clearRect(0, 0, w, h);

      // sol que sale detrás de las dunas
      const rise = reduced ? 1 : Math.min(1, t / 2.8);
      const ease = 1 - Math.pow(1 - rise, 3);
      const sunR = Math.min(w, h * 2) * 0.16;
      const sunY = h * 0.92 - ease * h * 0.5;
      const glow = ctx.createRadialGradient(w / 2, sunY, 0, w / 2, sunY, sunR * 2.6);
      glow.addColorStop(0, `rgba(226,194,159,${0.22 * ease})`);
      glow.addColorStop(1, "rgba(226,194,159,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = `rgba(246,227,200,${0.8 * ease})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(w / 2, sunY, sunR, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < LINES; i++) {
        const depth = i / (LINES - 1); // 0 = atrás, 1 = adelante
        const baseY = h * (0.38 + depth * 0.58);
        const amp = h * (0.05 + depth * 0.07);
        const speed = reduced ? 0 : 0.05 + depth * 0.12;
        const shift = smx * 40 * (0.3 + depth);
        const appear = reduced ? 1 : Math.min(1, Math.max(0, (t - 0.2 - (LINES - i) * 0.08) / 1.2));

        // relleno negro para tapar el sol detrás de cada duna
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y =
            baseY +
            Math.sin((x + shift) * 0.006 + t * speed + i * 1.7) * amp +
            Math.sin((x + shift) * 0.013 - t * speed * 0.7 + i) * amp * 0.35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = "#0a0a0b";
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          const y =
            baseY +
            Math.sin((x + shift) * 0.006 + t * speed + i * 1.7) * amp +
            Math.sin((x + shift) * 0.013 - t * speed * 0.7 + i) * amp * 0.35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const a = (0.4 + depth * 0.6) * appear;
        grad.addColorStop(0, `rgba(179,139,102,0)`);
        grad.addColorStop(0.5, `rgba(240,214,182,${a})`);
        grad.addColorStop(1, `rgba(179,139,102,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + depth * 1.1;
        ctx.stroke();
      }
    };

    let raf = 0;
    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };
    if (reduced) render(performance.now());
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="dunes" aria-hidden />;
}
