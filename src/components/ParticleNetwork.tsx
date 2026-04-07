import { useEffect, useRef, useCallback } from "react";

/**
 * Theme-aware animated hero background with:
 * - 3 concentric circles centered at bottom-center
 * - 6 radial curved lines emanating from center
 * - Blue diamond particles moving along all paths
 */

/* ── helpers ─────────────────────────────────────────────── */

function parseHSL(raw: string): { h: number; s: number; l: number } {
  const parts = raw.trim().split(/\s+/);
  return {
    h: parseFloat(parts[0]) || 0,
    s: parseFloat(parts[1]) || 0,
    l: parseFloat(parts[2]) || 0,
  };
}

function hslStr(h: number, s: number, l: number, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

/* ── path building ────────────────────────────────────────── */

interface PathDef {
  points: [number, number][];
}

/** Build 3 concentric circles + 6 radial curves from center bottom */
function buildPaths(w: number, h: number): PathDef[] {
  const cx = w / 2;
  const cy = h * 0.95; // center at bottom
  const paths: PathDef[] = [];

  // 3 concentric circles (approximated with many points)
  const radii = [Math.min(w, h) * 0.35, Math.min(w, h) * 0.55, Math.min(w, h) * 0.8];
  const circleSegments = 60;

  for (const r of radii) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= circleSegments; i++) {
      const angle = (i / circleSegments) * Math.PI * 2;
      pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
    paths.push({ points: pts });
  }

  // 6 radial curved lines from center outward
  const maxRadius = Math.max(w, h) * 0.9;
  const radialAngles = [
    -Math.PI / 6,       // 30° right
    -Math.PI / 3,       // 60° right
    -Math.PI / 2,       // straight up
    -2 * Math.PI / 3,   // 60° left
    -5 * Math.PI / 6,   // 30° left
    -Math.PI,           // left
  ];

  for (const baseAngle of radialAngles) {
    const pts: [number, number][] = [];
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const r = t * maxRadius;
      // Add subtle curve by oscillating the angle
      const curveAmount = Math.sin(t * Math.PI) * 0.15;
      const angle = baseAngle + curveAmount;
      pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
    paths.push({ points: pts });
  }

  return paths;
}

/** Evaluate a point on a polyline at t ∈ [0,1] using Catmull-Rom */
function evalPath(path: [number, number][], t: number): [number, number] {
  const n = path.length - 1;
  if (n <= 0) return path[0] || [0, 0];
  const seg = Math.min(Math.floor(t * n), n - 1);
  const local = t * n - seg;

  const p0 = path[Math.max(seg - 1, 0)];
  const p1 = path[seg];
  const p2 = path[Math.min(seg + 1, n)];
  const p3 = path[Math.min(seg + 2, n)];

  const catmull = (a: number, b: number, c: number, d: number, u: number) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
  };

  return [
    catmull(p0[0], p1[0], p2[0], p3[0], local),
    catmull(p0[1], p1[1], p2[1], p3[1], local),
  ];
}

/* ── component ────────────────────────────────────────────── */

interface Particle {
  pathIdx: number;
  t: number;
  speed: number;
  dir: 1 | -1;
  size: number;
  glowRadius: number;
}

const PARTICLE_COUNT = 30;
const PATH_LINE_SEGMENTS = 120;

const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const pathsRef = useRef<PathDef[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef({ bg: "", line: "", particle: "", glow: "" });

  const readThemeColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = parseHSL(style.getPropertyValue("--primary").trim() || "215 80% 50%");
    const accent = parseHSL(style.getPropertyValue("--accent").trim() || "200 90% 60%");
    const bg = parseHSL(style.getPropertyValue("--background").trim() || "220 30% 6%");

    colorsRef.current = {
      bg: hslStr(bg.h, bg.s, bg.l),
      line: hslStr(primary.h, primary.s, primary.l, 0.1),
      particle: hslStr(accent.h, accent.s, Math.min(accent.l + 10, 80)),
      glow: hslStr(accent.h, accent.s, accent.l, 0.45),
    };
  }, []);

  const initParticles = useCallback((pathCount: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        pathIdx: Math.floor(Math.random() * pathCount),
        t: Math.random(),
        speed: 0.0006 + Math.random() * 0.001,
        dir: Math.random() > 0.5 ? 1 : -1,
        size: 3 + Math.random() * 3,
        glowRadius: 10 + Math.random() * 10,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pathsRef.current = buildPaths(w, h);
      if (particlesRef.current.length === 0) {
        initParticles(pathsRef.current.length);
      }
    };

    resize();
    readThemeColors();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => readThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const { bg, line, particle, glow } = colorsRef.current;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const paths = pathsRef.current;

      // Draw path lines
      ctx.strokeStyle = line;
      ctx.lineWidth = 0.7;
      for (const path of paths) {
        ctx.beginPath();
        for (let i = 0; i <= PATH_LINE_SEGMENTS; i++) {
          const t = i / PATH_LINE_SEGMENTS;
          const [px, py] = evalPath(path.points, t);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Update & draw particles as diamonds
      const particles = particlesRef.current;
      for (const p of particles) {
        p.t += p.speed * p.dir;
        if (p.t >= 1) { p.t = 1; p.dir = -1; }
        else if (p.t <= 0) { p.t = 0; p.dir = 1; }

        const path = paths[p.pathIdx];
        if (!path) continue;
        const [px, py] = evalPath(path.points, p.t);

        // Glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.glowRadius);
        grad.addColorStop(0, glow);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(px - p.glowRadius, py - p.glowRadius, p.glowRadius * 2, p.glowRadius * 2);

        // Diamond (rotated square)
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = particle;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [initParticles, readThemeColors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};

export default ParticleNetwork;
