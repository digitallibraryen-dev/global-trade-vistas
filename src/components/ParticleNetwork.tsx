import { useEffect, useRef, useCallback } from "react";

/**
 * Theme-aware animated background with diamond particles
 * moving along predefined curved paths (orbital / magnetic field aesthetic).
 *
 * Reads CSS custom-property colors so it adapts to light / dark automatically.
 */

/* ── helpers ─────────────────────────────────────────────── */

/** Parse an HSL CSS variable value like "215 80% 50%" into an {h,s,l} object */
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

/* ── path definitions ─────────────────────────────────────── */

interface CurvePath {
  /** control-point arrays (cubic bezier segments) normalised 0-1 */
  points: [number, number][];
}

/** Build a set of smooth curved paths that look like orbital / magnetic field lines */
function buildPaths(w: number, h: number): CurvePath[] {
  const raw: [number, number][][] = [
    // large sweeping arcs
    [[0, 0.25], [0.25, 0.1], [0.5, 0.15], [0.75, 0.05], [1, 0.2]],
    [[0, 0.5], [0.2, 0.35], [0.5, 0.4], [0.8, 0.3], [1, 0.45]],
    [[0, 0.75], [0.15, 0.6], [0.4, 0.65], [0.7, 0.55], [1, 0.7]],
    [[0, 0.9], [0.3, 0.8], [0.6, 0.85], [0.9, 0.75], [1, 0.9]],
    // crossing diagonals
    [[0, 0.1], [0.3, 0.4], [0.6, 0.6], [1, 0.95]],
    [[0, 0.95], [0.35, 0.65], [0.65, 0.35], [1, 0.1]],
    // tighter curves
    [[0.1, 0], [0.15, 0.3], [0.2, 0.6], [0.25, 1]],
    [[0.5, 0], [0.45, 0.25], [0.55, 0.55], [0.5, 1]],
    [[0.85, 0], [0.8, 0.35], [0.9, 0.7], [0.85, 1]],
    // extra orbitals
    [[0, 0.4], [0.2, 0.2], [0.5, 0.3], [0.8, 0.15], [1, 0.35]],
    [[0, 0.6], [0.25, 0.75], [0.5, 0.7], [0.75, 0.8], [1, 0.6]],
  ];

  return raw.map((pts) => ({
    points: pts.map(([x, y]) => [x * w, y * h] as [number, number]),
  }));
}

/** Evaluate a point on a polyline-smoothed path at t ∈ [0,1] using Catmull-Rom */
function evalPath(path: [number, number][], t: number): [number, number] {
  const n = path.length - 1;
  const seg = Math.min(Math.floor(t * n), n - 1);
  const local = t * n - seg;

  const p0 = path[Math.max(seg - 1, 0)];
  const p1 = path[seg];
  const p2 = path[Math.min(seg + 1, n)];
  const p3 = path[Math.min(seg + 2, n)];

  const catmull = (a: number, b: number, c: number, d: number, u: number) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      0.5 *
      (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3)
    );
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
  speed: number; // units per frame (normalised 0-1 over path length)
  dir: 1 | -1;
  size: number;
  glowRadius: number;
}

const PARTICLE_COUNT = 45;
const PATH_LINE_SEGMENTS = 80;

const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const pathsRef = useRef<CurvePath[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef({ bg: "", line: "", particle: "", glow: "" });

  /* Read CSS variables from :root */
  const readThemeColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = parseHSL(style.getPropertyValue("--primary").trim() || "215 80% 50%");
    const accent = parseHSL(style.getPropertyValue("--accent").trim() || "200 90% 60%");
    const bg = parseHSL(style.getPropertyValue("--background").trim() || "220 30% 6%");

    colorsRef.current = {
      bg: hslStr(bg.h, bg.s, bg.l),
      line: hslStr(primary.h, primary.s, primary.l, 0.12),
      particle: hslStr(accent.h, accent.s, Math.min(accent.l + 10, 80)),
      glow: hslStr(accent.h, accent.s, accent.l, 0.5),
    };
  }, []);

  const initParticles = useCallback((pathCount: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        pathIdx: Math.floor(Math.random() * pathCount),
        t: Math.random(),
        speed: 0.0008 + Math.random() * 0.0012,
        dir: Math.random() > 0.5 ? 1 : -1,
        size: 2.5 + Math.random() * 2,
        glowRadius: 8 + Math.random() * 8,
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

    // Observe theme changes (class toggle on <html>)
    const observer = new MutationObserver(() => readThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const { bg, line, particle, glow } = colorsRef.current;

      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const paths = pathsRef.current;

      // Draw path lines (subtle grid)
      ctx.strokeStyle = line;
      ctx.lineWidth = 0.8;
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

      // Update & draw particles
      const particles = particlesRef.current;
      for (const p of particles) {
        // Move
        p.t += p.speed * p.dir;
        if (p.t >= 1) {
          p.t = 1;
          p.dir = -1;
        } else if (p.t <= 0) {
          p.t = 0;
          p.dir = 1;
        }

        const path = paths[p.pathIdx];
        if (!path) continue;
        const [px, py] = evalPath(path.points, p.t);

        // Glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.glowRadius);
        grad.addColorStop(0, glow);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(px - p.glowRadius, py - p.glowRadius, p.glowRadius * 2, p.glowRadius * 2);

        // Diamond shape (rotated square)
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
