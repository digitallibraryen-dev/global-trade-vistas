import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Country {
  name: string;
  flag: string;
  x: number; // % from left
  y: number; // % from top
}

const countries: Country[] = [
  { name: "Morocco", flag: "🇲🇦", x: 8, y: 32 },
  { name: "Egypt", flag: "🇪🇬", x: 30, y: 35 },
  { name: "Jordan", flag: "🇯🇴", x: 38, y: 28 },
  { name: "Iraq", flag: "🇮🇶", x: 48, y: 25 },
  { name: "Kuwait", flag: "🇰🇼", x: 55, y: 38 },
  { name: "Saudi Arabia", flag: "🇸🇦", x: 50, y: 52 },
  { name: "Bahrain", flag: "🇧🇭", x: 58, y: 45 },
  { name: "Qatar", flag: "🇶🇦", x: 60, y: 50 },
  { name: "UAE", flag: "🇦🇪", x: 65, y: 48 },
  { name: "Oman", flag: "🇴🇲", x: 70, y: 55 },
  { name: "Yemen", flag: "🇾🇪", x: 58, y: 65 },
];

const MiddleEastMapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade up
      gsap.from(".me-map-container", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // Staggered flag appearance
      gsap.from(".flag-pin", {
        scrollTrigger: { trigger: ".me-map-container", start: "top 75%" },
        opacity: 0,
        scale: 0,
        y: -20,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(2)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding gradient-dark relative overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Regional Reach
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Presence in the Middle East
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-muted-foreground text-sm leading-relaxed">
            Serving businesses across the Middle East and North Africa with dedicated local support and logistics infrastructure.
          </p>
        </div>

        {/* Map Container */}
        <div className="me-map-container relative mx-auto max-w-4xl">
          {/* SVG Map Background — simplified Middle East outline */}
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <svg
              viewBox="0 0 800 480"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid dots for corporate feel */}
              <defs>
                <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" className="fill-muted-foreground/10" />
                </pattern>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.08" />
                  <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="800" height="480" fill="url(#dotGrid)" />
              <ellipse cx="400" cy="240" rx="350" ry="200" fill="url(#mapGlow)" />

              {/* Simplified Middle East landmass */}
              <path
                d="M40,180 Q80,120 160,140 Q200,100 260,130 Q300,90 340,120 
                   Q360,100 400,110 Q440,80 500,100 Q540,90 580,120 
                   Q620,100 660,130 Q700,120 740,160
                   L750,200 Q720,240 700,280 Q660,320 620,340
                   Q580,380 520,370 Q480,390 440,360 
                   Q400,380 360,340 Q320,360 280,320
                   Q240,340 200,300 Q160,320 120,280
                   Q80,300 50,240 Z"
                className="fill-primary/5 stroke-primary/20"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Connection lines between countries */}
              {countries.map((c, i) => {
                if (i === 0) return null;
                const prev = countries[i - 1];
                return (
                  <line
                    key={`line-${i}`}
                    x1={prev.x * 8}
                    y1={prev.y * 4.8}
                    x2={c.x * 8}
                    y2={c.y * 4.8}
                    className="stroke-primary/10"
                    strokeWidth="0.5"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Dot markers for each country */}
              {countries.map((c) => (
                <g key={c.name}>
                  <circle
                    cx={c.x * 8}
                    cy={c.y * 4.8}
                    r="4"
                    className="fill-primary/30"
                  />
                  <circle
                    cx={c.x * 8}
                    cy={c.y * 4.8}
                    r="2"
                    className="fill-primary"
                  />
                </g>
              ))}
            </svg>

            {/* Flag Pins */}
            {countries.map((c, i) => (
              <div
                key={c.name}
                className="flag-pin absolute flex flex-col items-center cursor-pointer group"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  transform: "translate(-50%, -100%)",
                  animation: `floatFlag ${3 + i * 0.3}s ease-in-out infinite`,
                }}
                onMouseEnter={() => setHoveredCountry(c.name)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute -top-10 whitespace-nowrap rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-lg transition-all duration-300 pointer-events-none ${
                    hoveredCountry === c.name
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  Active Clients in {c.name}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-card border-r border-b border-border/50 transform -translate-x-1/2 rotate-45" />
                </div>

                {/* Flag */}
                <span
                  className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-125 drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                >
                  {c.flag}
                </span>

                {/* Pin line */}
                <div className="w-px h-3 bg-primary/30 mt-0.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes floatFlag {
          0%, 100% { transform: translate(-50%, -100%) translateY(0); }
          50% { transform: translate(-50%, -100%) translateY(-5px); }
        }
        @media (max-width: 640px) {
          @keyframes floatFlag {
            0%, 100% { transform: translate(-50%, -100%) translateY(0); }
            50% { transform: translate(-50%, -100%) translateY(-2px); }
          }
        }
      `}</style>
    </section>
  );
};

export default MiddleEastMapSection;
