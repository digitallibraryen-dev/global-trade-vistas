import { useMemo } from "react";

interface EllipseDef {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  id: string;
  duration: number;
}

/** Convert ellipse params to an SVG <path> d-string (two arcs) */
const ellipseToPath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}Z`;

const OrbitalBackground = () => {
  const ellipses = useMemo<EllipseDef[]>(() => {
    const defs: EllipseDef[] = [];
    let idx = 0;

    // Cluster 1: Top-Left
    for (let i = 0; i < 6; i++) {
      const scale = 25 + i * 12;
      defs.push({ cx: -15, cy: -10, rx: scale * 1.05, ry: scale, id: `orb-${idx++}`, duration: 18 + i * 4 + (i % 2) * 3 });
    }

    // Cluster 2: Top-Right
    for (let i = 0; i < 6; i++) {
      const scale = 25 + i * 12;
      defs.push({ cx: 115, cy: -10, rx: scale * 1.05, ry: scale, id: `orb-${idx++}`, duration: 20 + i * 4 + (i % 2) * 2 });
    }

    // Cluster 3: Bottom-Center
    for (let i = 0; i < 6; i++) {
      const scale = 30 + i * 14;
      defs.push({ cx: 50, cy: 115, rx: scale * 1.15, ry: scale, id: `orb-${idx++}`, duration: 22 + i * 5 + (i % 3) * 2 });
    }

    return defs;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
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
            strokeWidth="0.15"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Animated diamond markers */}
        {ellipses.map((e, i) => (
          <g key={`diamond-${e.id}`}>
            {/* Glow */}
            <rect width="1.6" height="1.6" x="-0.8" y="-0.8" rx="0.1" className="fill-primary/40" style={{ filter: "blur(0.4px)" }}>
              <animateMotion dur={`${e.duration}s`} repeatCount="indefinite" begin={`-${(i * 2.7) % e.duration}s`} rotate="auto">
                <mpath href={`#${e.id}`} />
              </animateMotion>
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${e.duration}s`} repeatCount="indefinite" />
            </rect>

            {/* Solid diamond */}
            <rect width="1" height="1" x="-0.5" y="-0.5" rx="0.05" className="fill-primary">
              <animateMotion dur={`${e.duration}s`} repeatCount="indefinite" begin={`-${(i * 2.7) % e.duration}s`} rotate="auto">
                <mpath href={`#${e.id}`} />
              </animateMotion>
              <animateTransform attributeName="transform" type="rotate" from="45" to="405" dur={`${e.duration}s`} repeatCount="indefinite" />
            </rect>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default OrbitalBackground;
