import { useMemo, useRef, useEffect, useCallback } from "react";

interface EllipseDef {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  id: string;
  duration: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

const ellipseToPath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}Z`;

const DIAMOND_SIZE = 8;
const DIAMONDS_PER_PATH = 4;
const BURST_RADIUS = 30; // proximity threshold in SVG units
const PARTICLE_COUNT = 12;

const ELLIPSE_DEFS: Omit<EllipseDef, "id">[] = (() => {
  const defs: Omit<EllipseDef, "id">[] = [];
  for (let i = 0; i < 6; i++) {
    const scale = 80 + i * 45;
    defs.push({ cx: -50, cy: -30, rx: scale * 1.05, ry: scale, duration: 18 + i * 4 + (i % 2) * 3 });
  }
  for (let i = 0; i < 6; i++) {
    const scale = 80 + i * 45;
    defs.push({ cx: 450, cy: -30, rx: scale * 1.05, ry: scale, duration: 20 + i * 4 + (i % 2) * 2 });
  }
  for (let i = 0; i < 6; i++) {
    const scale = 100 + i * 50;
    defs.push({ cx: 200, cy: 420, rx: scale * 1.15, ry: scale, duration: 22 + i * 5 + (i % 3) * 2 });
  }
  return defs;
})();

/** Get diamond position on ellipse at time t */
const getDiamondPos = (e: Omit<EllipseDef, "id">, time: number, offset: number) => {
  const t = ((time + offset) % e.duration) / e.duration;
  const angle = t * Math.PI * 2;
  return {
    x: e.cx + e.rx * Math.cos(angle),
    y: e.cy + e.ry * Math.sin(angle),
  };
};

const OrbitalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const burstCooldowns = useRef<Set<string>>(new Set());
  const startTimeRef = useRef(performance.now() / 1000);
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(false);

  const ellipses = useMemo<EllipseDef[]>(
    () => ELLIPSE_DEFS.map((e, i) => ({ ...e, id: `orb-${i}` })),
    []
  );

  // Convert screen coords to SVG viewBox coords
  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: -9999, y: -9999 };
    const rect = svg.getBoundingClientRect();
    // viewBox is 0 0 400 360, preserveAspectRatio xMidYMid slice
    const vbW = 400, vbH = 360;
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;
    const scale = Math.max(scaleX, scaleY); // "slice" uses max
    const visW = rect.width * scale;
    const visH = rect.height * scale;
    const offX = (vbW - visW) / 2;
    const offY = (vbH - visH) / 2;
    return {
      x: (clientX - rect.left) * scale + offX,
      y: (clientY - rect.top) * scale + offY,
    };
  }, []);

  const spawnBurst = useCallback((x: number, y: number) => {
    const particles = particlesRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 2 + Math.random() * 3,
        hue: 220 + Math.random() * 40, // blue range
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = screenToSvg(e.clientX, e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = screenToSvg(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("mouseleave", handleLeave);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const animate = () => {
      const now = performance.now() / 1000;
      const elapsed = now - startTimeRef.current;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const cooldowns = burstCooldowns.current;

      // Check diamond proximity and spawn bursts
      for (let ei = 0; ei < ELLIPSE_DEFS.length; ei++) {
        const e = ELLIPSE_DEFS[ei];
        for (let d = 0; d < DIAMONDS_PER_PATH; d++) {
          const offset = (e.duration / DIAMONDS_PER_PATH) * d + (ei * 1.3) % e.duration;
          const pos = getDiamondPos(e, elapsed, offset);
          const dx = pos.x - mouse.x;
          const dy = pos.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const key = `${ei}-${d}`;

          if (dist < BURST_RADIUS && !cooldowns.has(key)) {
            cooldowns.add(key);
            spawnBurst(pos.x, pos.y);
            setTimeout(() => cooldowns.delete(key), 800);
          }
        }
      }

      // Draw particles (convert SVG coords to screen coords)
      const svg = svgRef.current;
      if (svg) {
        const rect = svg.getBoundingClientRect();
        const vbW = 400, vbH = 360;
        const scaleX = vbW / rect.width;
        const scaleY = vbH / rect.height;
        const scale = Math.max(scaleX, scaleY);
        const visW = rect.width * scale;
        const visH = rect.height * scale;
        const offX = (vbW - visW) / 2;
        const offY = (vbH - visH) / 2;

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life -= 1 / 60 / p.maxLife;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Convert SVG coords to screen coords
          const sx = (p.x - offX) / scale;
          const sy = (p.y - offY) / scale;
          const alpha = p.life * 0.9;
          const s = p.size / scale * (0.5 + p.life * 0.5);

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.PI / 4);
          ctx.globalAlpha = alpha;

          // Glow
          ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha})`;
          ctx.fillRect(-s / 2, -s / 2, s, s);

          // Bright core
          ctx.shadowBlur = 0;
          ctx.globalAlpha = alpha * 0.8;
          ctx.fillStyle = `hsla(${p.hue}, 80%, 85%, ${alpha})`;
          const cs = s * 0.5;
          ctx.fillRect(-cs / 2, -cs / 2, cs, cs);

          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [screenToSvg, spawnBurst]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 400 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {ellipses.map((e) => (
            <path
              key={`path-def-${e.id}`}
              id={e.id}
              d={ellipseToPath(e.cx, e.cy, e.rx, e.ry)}
              fill="none"
            />
          ))}
        </defs>

        {/* Visible strokes */}
        {ellipses.map((e) => (
          <use
            key={`stroke-${e.id}`}
            href={`#${e.id}`}
            className="stroke-foreground/[0.08] dark:stroke-foreground/[0.1]"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Animated diamond markers */}
        {ellipses.map((e, i) =>
          Array.from({ length: DIAMONDS_PER_PATH }).map((_, d) => {
            const offset = (e.duration / DIAMONDS_PER_PATH) * d + (i * 1.3) % e.duration;
            return (
              <rect
                key={`diamond-${e.id}-${d}`}
                width={DIAMOND_SIZE}
                height={DIAMOND_SIZE}
                x={-DIAMOND_SIZE / 2}
                y={-DIAMOND_SIZE / 2}
                rx="0.5"
                className="fill-primary"
              >
                <animateMotion dur={`${e.duration}s`} repeatCount="indefinite" begin={`-${offset}s`} rotate="auto">
                  <mpath href={`#${e.id}`} />
                </animateMotion>
                <animateTransform attributeName="transform" type="rotate" from="45" to="405" dur={`${e.duration}s`} repeatCount="indefinite" />
              </rect>
            );
          })
        )}
      </svg>

      {/* Canvas overlay for particle bursts */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default OrbitalBackground;
