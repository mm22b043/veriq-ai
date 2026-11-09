import React, { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Star field ──
    const STAR_COUNT = 320;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.012 + 0.004,
      twinkleOffset: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00008,
    }));

    // ── Nebula cloud blobs ──
    const NEBULA_COUNT = 9;
    const nebulas = Array.from({ length: NEBULA_COUNT }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      rx: 0.18 + Math.random() * 0.28,
      ry: 0.12 + Math.random() * 0.22,
      hue: 260 + Math.random() * 60, // violet–magenta range
      alpha: 0.06 + Math.random() * 0.09,
      speed: (Math.random() - 0.5) * 0.00006,
      angle: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.0003,
    }));

    // ── Cosmic dust particles ──
    const DUST_COUNT = 180;
    const dust = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.9 + 0.2,
      alpha: Math.random() * 0.4 + 0.05,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
      hue: 240 + Math.random() * 80,
    }));

    // ── Galaxy core ──
    const galaxy = { x: 0.5, y: 0.46 };

    const drawGalaxyCore = (W, H, t) => {
      const cx = galaxy.x * W;
      const cy = galaxy.y * H;
      const pulse = 1 + Math.sin(t * 0.0004) * 0.08;

      // Outer diffuse glow
      let grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320 * pulse);
      grad.addColorStop(0, 'rgba(200,140,255,0.13)');
      grad.addColorStop(0.3, 'rgba(140,80,255,0.07)');
      grad.addColorStop(0.65, 'rgba(80,40,160,0.04)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 320 * pulse, 240 * pulse, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Mid glow
      grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130 * pulse);
      grad.addColorStop(0, 'rgba(230,180,255,0.22)');
      grad.addColorStop(0.4, 'rgba(170,80,255,0.12)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130 * pulse, 100 * pulse, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36 * pulse);
      grad.addColorStop(0, 'rgba(255,240,255,0.95)');
      grad.addColorStop(0.2, 'rgba(220,170,255,0.6)');
      grad.addColorStop(0.6, 'rgba(140,60,220,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 36 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Spiral arms (subtle)
      for (let arm = 0; arm < 2; arm++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(arm * Math.PI + t * 0.00006);
        for (let i = 0; i < 60; i++) {
          const frac = i / 60;
          const angle = frac * Math.PI * 2.5;
          const radius = frac * 200 * pulse;
          const sx = Math.cos(angle) * radius;
          const sy = Math.sin(angle) * radius * 0.55;
          const a = (1 - frac) * 0.07;
          ctx.beginPath();
          ctx.arc(sx, sy, (1 - frac) * 3.5 + 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(190,130,255,${a})`;
          ctx.fill();
        }
        ctx.restore();
      }
    };

    const drawNebulas = (W, H, t) => {
      nebulas.forEach((n) => {
        // drift
        n.x += n.speed * Math.cos(n.angle);
        n.y += n.speed * Math.sin(n.angle) * 0.5;
        n.angle += n.rotation;
        if (n.x < -0.3) n.x = 1.3;
        if (n.x > 1.3) n.x = -0.3;
        if (n.y < -0.3) n.y = 1.3;
        if (n.y > 1.3) n.y = -0.3;

        const cx = n.x * W;
        const cy = n.y * H;
        const rx = n.rx * W;
        const ry = n.ry * H;
        const alphaPulse = n.alpha * (0.85 + Math.sin(t * 0.0003 + n.angle) * 0.15);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(n.angle * 0.5);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        grad.addColorStop(0, `hsla(${n.hue}, 80%, 70%, ${alphaPulse})`);
        grad.addColorStop(0.45, `hsla(${n.hue + 20}, 70%, 50%, ${alphaPulse * 0.5})`);
        grad.addColorStop(1, `hsla(${n.hue}, 60%, 30%, 0)`);

        ctx.scale(1, ry / rx);
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });
    };

    const drawStars = (W, H, t) => {
      stars.forEach((s) => {
        s.x += s.drift;
        if (s.x > 1) s.x = 0;
        if (s.x < 0) s.x = 1;

        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.alpha * (0.4 + 0.6 * twinkle);
        const r = s.r * (0.7 + 0.3 * twinkle);

        const sx = s.x * W;
        const sy = s.y * H;

        // Glow halo for bigger stars
        if (s.r > 1.0) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
          glow.addColorStop(0, `rgba(220,200,255,${alpha * 0.5})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,220,255,${alpha})`;
        ctx.fill();
      });
    };

    const drawDust = (W, H) => {
      dust.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x > 1) d.x = 0;
        if (d.x < 0) d.x = 1;
        if (d.y > 1) d.y = 0;
        if (d.y < 0) d.y = 1;

        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 70%, 75%, ${d.alpha})`;
        ctx.fill();
      });
    };

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Deep space base gradient
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
      bg.addColorStop(0, '#1a0a2e');
      bg.addColorStop(0.3, '#120820');
      bg.addColorStop(0.65, '#080510');
      bg.addColorStop(1, '#030208');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Edge vignette
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,10,0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      drawNebulas(W, H, t);
      drawGalaxyCore(W, H, t);
      drawDust(W, H);
      drawStars(W, H, t);

      t++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}

