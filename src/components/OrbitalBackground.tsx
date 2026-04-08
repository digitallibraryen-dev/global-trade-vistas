import { useMemo, useRef, useEffect, useCallback, type RefObject } from "react";

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

interface Ripple {
  x: number;
  y: number;
  radius: number;
  lineWidth: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface SvgMetrics {
  rect: DOMRect;
  scale: number;
  offX: number;
  offY: number;
}

const ellipseToPath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}Z`;

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 360;
const OFFSCREEN_POINT = { x: -9999, y: -9999 };
const DIAMOND_SIZE = 8;
const DIAMONDS_PER_PATH = 4;
const BURST_RADIUS = 80;
const PARTICLE_COUNT = 20;
const MAX_PARTICLES = 200;
const MAX_RIPPLES = 10;

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

const getSvgMetrics = (svg: SVGSVGElement): SvgMetrics => {
  const rect = svg.getBoundingClientRect();
  // For preserveAspectRatio="xMidYMid slice", the SVG scales to COVER the container
  const scaleX = rect.width / VIEWBOX_WIDTH;
  const scaleY = rect.height / VIEWBOX_HEIGHT;
  const scale = Math.max(scaleX, scaleY);

  // Offset accounts for the clipped (overflowing) portion centered by "xMid YMid"
  const offX = (rect.width - VIEWBOX_WIDTH * scale) / 2;
  const offY = (rect.height - VIEWBOX_HEIGHT * scale) / 2;

  return { rect, scale, offX, offY };
};

const svgToScreen = (x: number, y: number, metrics: SvgMetrics) => ({
  x: x * metrics.scale + metrics.offX,
  y: y * metrics.scale + metrics.offY,
});

const isPointInsideRect = (clientX: number, clientY: number, rect: DOMRect) =>
  clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

const getDiamondPos = (e: Omit<EllipseDef, "id">, time: number, offset: number) => {
  const t = ((time + offset) % e.duration) / e.duration;
  const angle = t * Math.PI * 2;

  return {
    x: e.cx - e.rx * Math.cos(angle),
    y: e.cy + e.ry * Math.sin(angle),
  };
};

const OrbitalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef(OFFSCREEN_POINT);
  const burstCooldowns = useRef<Set<string>>(new Set());
  const startTimeRef = useRef(performance.now() / 1000);
  const rafRef = useRef<number>(0);

  const ellipses = useMemo<EllipseDef[]>(() => ELLIPSE_DEFS.map((e, i) => ({ ...e, id: `orb-${i}` })), []);

  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return OFFSCREEN_POINT;

    const metrics = getSvgMetrics(svg);
    return {
      x: (clientX - metrics.rect.left - metrics.offX) / metrics.scale,
      y: (clientY - metrics.rect.top - metrics.offY) / metrics.scale,
    };
  }, []);

  const setPointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) {
        mouseRef.current = OFFSCREEN_POINT;
        return;
      }

      const metrics = getSvgMetrics(svg);
      mouseRef.current = isPointInsideRect(clientX, clientY, metrics.rect)
        ? screenToSvg(clientX, clientY)
        : OFFSCREEN_POINT;
    },
    [screenToSvg]
  );

  const spawnBurst = useCallback((x: number, y: number) => {
    const particles = particlesRef.current;
    const ripples = ripplesRef.current;

    // Cap totals to prevent accumulation from rapid clicks
    if (ripples.length < MAX_RIPPLES) {
      ripples.push({
        x, y, radius: 6,
        lineWidth: 2.5 + Math.random() * 1.5,
        life: 1, maxLife: 0.7 + Math.random() * 0.25,
        hue: 214 + Math.random() * 18,
      });
    }

    const budget = Math.min(PARTICLE_COUNT, MAX_PARTICLES - particles.length);
    for (let i = 0; i < budget; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.65;
      const speed = 3.5 + Math.random() * 5.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 1.0 + Math.random() * 0.5,
        size: 6 + Math.random() * 7,
        hue: 210 + Math.random() * 22,
      });
    }
  }, []);

  const drawRipples = useCallback((ctx: CanvasRenderingContext2D, metrics: SvgMetrics) => {
    const ripples = ripplesRef.current;
    let writeIdx = 0;

    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      r.radius += 2.8;
      r.life -= 1 / 60 / r.maxLife;
      if (r.life <= 0) continue;

      const pt = svgToScreen(r.x, r.y, metrics);
      const a = r.life * 0.75;
      ctx.globalAlpha = a;
      ctx.strokeStyle = `hsla(${r.hue}, 100%, 56%, ${a})`;
      ctx.lineWidth = r.lineWidth;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r.radius / metrics.scale, 0, Math.PI * 2);
      ctx.stroke();

      if (writeIdx !== i) ripples[writeIdx] = r;
      writeIdx++;
    }
    ripples.length = writeIdx;
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, metrics: SvgMetrics) => {
    const particles = particlesRef.current;
    const cos45 = 0.7071;
    const sin45 = 0.7071;
    let writeIdx = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= 1 / 60 / p.maxLife;
      if (p.life <= 0) continue;

      const ptX = p.x * metrics.scale + metrics.offX;
      const ptY = p.y * metrics.scale + metrics.offY;
      const alpha = p.life * 0.95;
      const size = (p.size / metrics.scale) * (0.7 + p.life * 0.65);
      const hs = size / 2;

      // Manual rotation matrix instead of ctx.save/translate/rotate/restore
      ctx.setTransform(cos45, sin45, -sin45, cos45, ptX, ptY);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 62%, ${alpha})`;
      ctx.fillRect(-hs, -hs, size, size);

      // Bright core
      const cs = size * 0.42;
      const hcs = cs / 2;
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 88%, ${alpha})`;
      ctx.fillRect(-hcs, -hcs, cs, cs);

      if (writeIdx !== i) particles[writeIdx] = p;
      writeIdx++;
    }
    particles.length = writeIdx;

    // Reset transform
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0]?.clientX ?? 0 : (event as MouseEvent).clientX;
      const clientY = 'touches' in event ? event.touches[0]?.clientY ?? 0 : (event as MouseEvent).clientY;
      
      const svg = svgRef.current;
      if (!svg) return;
      const metrics = getSvgMetrics(svg);
      if (!isPointInsideRect(clientX, clientY, metrics.rect)) return;

      const clickSvg = screenToSvg(clientX, clientY);
      const now = performance.now() / 1000;
      const elapsed = now - startTimeRef.current;

      let bestDist = Infinity;
      let bestPos = { x: 0, y: 0 };

      for (let ei = 0; ei < ELLIPSE_DEFS.length; ei++) {
        const ellipse = ELLIPSE_DEFS[ei];
        for (let di = 0; di < DIAMONDS_PER_PATH; di++) {
          const offset = (ellipse.duration / DIAMONDS_PER_PATH) * di + (ei * 1.3) % ellipse.duration;
          const pos = getDiamondPos(ellipse, elapsed, offset);
          const dist = Math.hypot(pos.x - clickSvg.x, pos.y - clickSvg.y);
          if (dist < bestDist) {
            bestDist = dist;
            bestPos = pos;
          }
        }
      }

      if (bestDist < BURST_RADIUS) {
        spawnBurst(bestPos.x, bestPos.y);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: true });

    const animate = () => {
      const now = performance.now() / 1000;
      const elapsed = now - startTimeRef.current;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      const svg = svgRef.current;
      if (svg) {
        const metrics = getSvgMetrics(svg);
        drawRipples(ctx, metrics);
        drawParticles(ctx, metrics);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
    };
  }, [drawParticles, drawRipples, screenToSvg, spawnBurst]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 400 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {ellipses.map((ellipse) => (
            <path
              key={`path-def-${ellipse.id}`}
              id={ellipse.id}
              d={ellipseToPath(ellipse.cx, ellipse.cy, ellipse.rx, ellipse.ry)}
              fill="none"
            />
          ))}
        </defs>

        {ellipses.map((ellipse) => (
          <use
            key={`stroke-${ellipse.id}`}
            href={`#${ellipse.id}`}
            className="stroke-foreground/[0.08] dark:stroke-foreground/[0.1]"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {ellipses.map((ellipse, ellipseIndex) =>
          Array.from({ length: DIAMONDS_PER_PATH }).map((_, diamondIndex) => {
            const offset = (ellipse.duration / DIAMONDS_PER_PATH) * diamondIndex + (ellipseIndex * 1.3) % ellipse.duration;
            return (
              <rect
                key={`diamond-${ellipse.id}-${diamondIndex}`}
                width={DIAMOND_SIZE}
                height={DIAMOND_SIZE}
                x={-DIAMOND_SIZE / 2}
                y={-DIAMOND_SIZE / 2}
                rx="0.5"
                className="fill-primary"
              >
                <animateMotion dur={`${ellipse.duration}s`} repeatCount="indefinite" begin={`-${offset}s`} rotate="auto">
                  <mpath href={`#${ellipse.id}`} />
                </animateMotion>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="45"
                  to="405"
                  dur={`${ellipse.duration}s`}
                  repeatCount="indefinite"
                />
              </rect>
            );
          })
        )}
      </svg>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 1 }} />
    </div>
  );
};

export default OrbitalBackground;
