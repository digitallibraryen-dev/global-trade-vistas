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
const PARTICLE_COUNT = 18;

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

    ripples.push({
      x,
      y,
      radius: 4,
      lineWidth: 1.8 + Math.random() * 1.2,
      life: 1,
      maxLife: 0.55 + Math.random() * 0.2,
      hue: 214 + Math.random() * 18,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.65;
      const speed = 2.2 + Math.random() * 4.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.75 + Math.random() * 0.35,
        size: 3.2 + Math.random() * 3.8,
        hue: 210 + Math.random() * 22,
      });
    }
  }, []);

  const drawRipples = useCallback((ctx: CanvasRenderingContext2D, metrics: SvgMetrics) => {
    const ripples = ripplesRef.current;

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.radius += 2.8;
      ripple.life -= 1 / 60 / ripple.maxLife;

      if (ripple.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      const point = svgToScreen(ripple.x, ripple.y, metrics);
      const alpha = ripple.life * 0.75;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `hsla(${ripple.hue}, 100%, 56%, ${alpha})`;
      ctx.lineWidth = ripple.lineWidth;
      ctx.beginPath();
      ctx.arc(point.x, point.y, ripple.radius / metrics.scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, metrics: SvgMetrics) => {
    const particles = particlesRef.current;

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      particle.life -= 1 / 60 / particle.maxLife;

      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const point = svgToScreen(particle.x, particle.y, metrics);
      const alpha = particle.life * 0.95;
      const size = (particle.size / metrics.scale) * (0.7 + particle.life * 0.65);

      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(Math.PI / 4);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = `hsla(${particle.hue}, 100%, 60%, ${alpha})`;
      ctx.shadowBlur = 12;
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 62%, ${alpha})`;
      ctx.fillRect(-size / 2, -size / 2, size, size);

      ctx.shadowBlur = 0;
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 88%, ${alpha})`;
      ctx.fillRect(-(size * 0.42) / 2, -(size * 0.42) / 2, size * 0.42, size * 0.42);
      ctx.restore();
    }
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
