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
  { name: "Turkey", flag: "🇹🇷", x: 52, y: 8 },
  { name: "Cyprus", flag: "🇨🇾", x: 38, y: 22 },
  { name: "Lebanon", flag: "🇱🇧", x: 36, y: 30 },
  { name: "Israel", flag: "🇮🇱", x: 33, y: 36 },
  { name: "Palestine", flag: "🇵🇸", x: 34, y: 39 },
  { name: "Syria", flag: "🇸🇾", x: 42, y: 20 },
  { name: "Jordan", flag: "🇯🇴", x: 38, y: 40 },
  { name: "Iraq", flag: "🇮🇶", x: 52, y: 28 },
  { name: "Iran", flag: "🇮🇷", x: 72, y: 25 },
  { name: "Kuwait", flag: "🇰🇼", x: 55, y: 42 },
  { name: "Bahrain", flag: "🇧🇭", x: 59, y: 48 },
  { name: "Qatar", flag: "🇶🇦", x: 60, y: 52 },
  { name: "Saudi Arabia", flag: "🇸🇦", x: 48, y: 58 },
  { name: "UAE", flag: "🇦🇪", x: 67, y: 52 },
  { name: "Oman", flag: "🇴🇲", x: 70, y: 62 },
  { name: "Yemen", flag: "🇾🇪", x: 52, y: 75 },
  { name: "Egypt", flag: "🇪🇬", x: 22, y: 48 },
  { name: "Morocco", flag: "🇲🇦", x: 5, y: 30 },
];

const MiddleEastSVGMap = () => (
  <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 20%, 15%)" />
        <stop offset="100%" stopColor="hsl(210, 25%, 12%)" />
      </linearGradient>
      <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 10%, 30%)" />
        <stop offset="100%" stopColor="hsl(210, 8%, 25%)" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Water background */}
    <rect width="800" height="500" fill="url(#waterGrad)" />

    {/* Morocco */}
    <path d="M 10,120 L 60,100 L 80,110 L 90,130 L 100,160 L 80,180 L 50,190 L 20,180 L 5,160 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Egypt */}
    <path d="M 140,190 L 180,170 L 210,180 L 220,200 L 230,240 L 220,280 L 200,300 L 170,290 L 150,260 L 140,230 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Turkey */}
    <path d="M 280,20 L 340,10 L 400,15 L 460,20 L 500,30 L 510,50 L 490,70 L 440,75 L 380,70 L 320,65 L 280,55 L 270,40 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Cyprus */}
    <path d="M 290,105 L 310,100 L 325,105 L 320,115 L 300,115 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Syria */}
    <path d="M 310,85 L 370,80 L 390,90 L 385,120 L 350,130 L 320,125 L 305,110 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Lebanon */}
    <path d="M 285,130 L 300,125 L 305,140 L 295,155 L 280,150 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Israel & Palestine */}
    <path d="M 265,160 L 280,155 L 290,165 L 285,195 L 270,200 L 260,185 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Jordan */}
    <path d="M 290,165 L 330,140 L 350,155 L 340,190 L 310,210 L 285,200 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Iraq */}
    <path d="M 390,90 L 440,85 L 480,100 L 490,130 L 480,170 L 440,180 L 400,170 L 385,140 L 385,120 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Iran */}
    <path d="M 490,60 L 550,40 L 620,50 L 660,80 L 670,120 L 660,160 L 630,190 L 580,200 L 530,180 L 500,150 L 490,130 L 480,100 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Kuwait */}
    <path d="M 445,190 L 465,185 L 475,200 L 465,215 L 445,210 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Saudi Arabia */}
    <path d="M 310,220 L 360,200 L 440,210 L 470,230 L 500,250 L 520,280 L 510,330 L 480,370 L 440,390 L 380,400 L 330,380 L 290,340 L 270,300 L 260,260 L 280,230 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Bahrain */}
    <path d="M 478,235 L 485,230 L 490,238 L 484,244 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Qatar */}
    <path d="M 490,245 L 500,240 L 505,255 L 498,270 L 488,265 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* UAE */}
    <path d="M 520,250 L 560,240 L 580,255 L 570,275 L 540,280 L 520,270 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Oman */}
    <path d="M 560,270 L 590,260 L 620,280 L 630,320 L 610,360 L 570,370 L 540,350 L 530,310 L 540,280 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Yemen */}
    <path d="M 370,400 L 430,390 L 480,380 L 510,390 L 520,420 L 490,450 L 430,460 L 370,440 L 350,420 Z"
      fill="url(#landGrad)" stroke="hsl(210, 15%, 40%)" strokeWidth="0.5" opacity="0.9" />

    {/* Decorative grid lines */}
    {[100, 200, 300, 400].map(y => (
      <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="hsl(210, 15%, 20%)" strokeWidth="0.3" strokeDasharray="4 8" />
    ))}
    {[100, 200, 300, 400, 500, 600, 700].map(x => (
      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="hsl(210, 15%, 20%)" strokeWidth="0.3" strokeDasharray="4 8" />
    ))}
  </svg>
);

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

        <div className="me-map-container relative mx-auto max-w-4xl">
          <div className="relative w-full">
            <MiddleEastSVGMap />

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
                <div
                  className={`absolute -top-10 whitespace-nowrap rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-lg transition-all duration-300 pointer-events-none z-10 ${
                    hoveredCountry === c.name
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  Active Clients in {c.name}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-card border-r border-b border-border/50 transform -translate-x-1/2 rotate-45" />
                </div>

                <span className="text-lg sm:text-xl md:text-2xl transition-transform duration-300 group-hover:scale-125 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
                  {c.flag}
                </span>

                <div className="w-px h-2 bg-primary/30 mt-0.5" />
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
