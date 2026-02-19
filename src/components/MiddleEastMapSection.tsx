import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Country {
  name: string;
  flag: string;
  x: number;
  y: number;
}

const countries: Country[] = [
  { name: "Turkey", flag: "🇹🇷", x: 35, y: 10 },
  { name: "Cyprus", flag: "🇨🇾", x: 22, y: 22 },
  { name: "Lebanon", flag: "🇱🇧", x: 24, y: 28 },
  { name: "Israel", flag: "🇮🇱", x: 22, y: 34 },
  { name: "Palestine", flag: "🇵🇸", x: 20, y: 38 },
  { name: "Syria", flag: "🇸🇾", x: 36, y: 20 },
  { name: "Jordan", flag: "🇯🇴", x: 28, y: 38 },
  { name: "Iraq", flag: "🇮🇶", x: 46, y: 22 },
  { name: "Iran", flag: "🇮🇷", x: 68, y: 20 },
  { name: "Kuwait", flag: "🇰🇼", x: 50, y: 40 },
  { name: "Bahrain", flag: "🇧🇭", x: 56, y: 44 },
  { name: "Qatar", flag: "🇶🇦", x: 57, y: 50 },
  { name: "Saudi Arabia", flag: "🇸🇦", x: 46, y: 58 },
  { name: "UAE", flag: "🇦🇪", x: 65, y: 50 },
  { name: "Oman", flag: "🇴🇲", x: 68, y: 62 },
  { name: "Yemen", flag: "🇾🇪", x: 52, y: 78 },
  { name: "Egypt", flag: "🇪🇬", x: 12, y: 48 },
  { name: "Morocco", flag: "🇲🇦", x: 2, y: 30 },
];

const MiddleEastMapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".me-map-container", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

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
        <div className="me-map-container relative mx-auto max-w-5xl" style={{ perspective: "1200px" }}>
          <div
            className="relative w-full"
            style={{
              paddingBottom: "75%",
              transform: "rotateX(12deg) rotateY(-2deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              viewBox="0 0 800 600"
              className="absolute inset-0 w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.35" />
                </linearGradient>
                <filter id="mapShadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="hsl(var(--primary))" floodOpacity="0.12" />
                </filter>
                <radialGradient id="mapGlow3d" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Morocco (far left) */}
              <path
                d="M20,160 L60,140 L90,150 L100,180 L90,220 L60,240 L30,230 L15,200 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Egypt */}
              <path
                d="M100,220 L140,200 L170,210 L185,250 L180,300 L160,340 L130,350 L100,320 L90,280 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Turkey */}
              <path
                d="M180,30 L220,20 L280,25 L340,15 L400,25 L430,40 L420,70 L380,85 L320,80 L260,85 L210,75 L185,55 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Cyprus */}
              <path
                d="M175,110 L195,105 L210,115 L200,125 L180,125 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Syria */}
              <path
                d="M240,95 L310,90 L340,100 L345,140 L300,155 L260,150 L235,130 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Lebanon */}
              <path
                d="M215,135 L235,130 L240,150 L230,165 L215,160 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Israel + Palestine */}
              <path
                d="M200,165 L220,158 L230,170 L225,210 L210,230 L195,215 L190,190 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Jordan */}
              <path
                d="M230,170 L270,155 L290,180 L280,220 L250,240 L225,225 L225,200 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Iraq */}
              <path
                d="M310,90 L380,85 L420,100 L430,140 L420,180 L390,200 L350,210 L310,190 L300,155 L310,120 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Iran */}
              <path
                d="M430,40 L500,30 L570,50 L620,80 L640,130 L630,180 L600,210 L560,220 L520,200 L480,180 L440,170 L430,140 L420,100 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Kuwait */}
              <path
                d="M420,195 L445,190 L455,210 L445,225 L425,220 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Saudi Arabia */}
              <path
                d="M260,245 L320,220 L380,215 L430,230 L470,260 L490,300 L480,360 L450,410 L400,440 L350,450 L300,430 L270,390 L250,340 L245,290 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Bahrain */}
              <path
                d="M465,250 L475,245 L480,258 L472,265 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Qatar */}
              <path
                d="M478,270 L490,265 L495,285 L488,298 L478,295 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* UAE */}
              <path
                d="M498,280 L540,265 L570,280 L560,310 L530,320 L500,310 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Oman */}
              <path
                d="M530,320 L570,300 L600,320 L610,370 L590,410 L550,420 L510,400 L490,360 L500,330 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Yemen */}
              <path
                d="M350,450 L400,440 L450,420 L480,440 L470,480 L430,510 L380,520 L340,500 L330,470 Z"
                fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="1" filter="url(#mapShadow)"
              />

              {/* Glow overlay */}
              <ellipse cx="380" cy="280" rx="320" ry="220" fill="url(#mapGlow3d)" />

              {/* Country borders / internal lines */}
              {countries.map((c) => (
                <circle
                  key={`dot-${c.name}`}
                  cx={c.x * 8}
                  cy={c.y * 6}
                  r="3"
                  className="fill-primary/60"
                />
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
                  className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-125 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
                >
                  {c.flag}
                </span>

                {/* Pin line */}
                <div className="w-px h-2.5 bg-primary/30 mt-0.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

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
