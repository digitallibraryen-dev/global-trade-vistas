import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CountryFlag {
  name: string;
  flag: string;
  x: number;
  y: number;
}

const countries: CountryFlag[] = [
  { name: "Turkey", flag: "🇹🇷", x: 40, y: 8 },
  { name: "Iraq", flag: "🇮🇶", x: 55, y: 24 },
  { name: "Iran", flag: "🇮🇷", x: 73, y: 20 },
  { name: "Jordan", flag: "🇯🇴", x: 42, y: 31 },
  { name: "Kuwait", flag: "🇰🇼", x: 58, y: 36 },
  { name: "Bahrain", flag: "🇧🇭", x: 62, y: 42 },
  { name: "Qatar", flag: "🇶🇦", x: 64, y: 46 },
  { name: "UAE", flag: "🇦🇪", x: 70, y: 44 },
  { name: "Saudi Arabia", flag: "🇸🇦", x: 49, y: 54 },
  { name: "Oman", flag: "🇴🇲", x: 74, y: 58 },
  { name: "Yemen", flag: "🇾🇪", x: 57, y: 74 },
];

const HeroMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-map-svg", {
        opacity: 0,
        scale: 0.9,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(".hero-flag", {
        opacity: 0,
        scale: 0,
        y: -15,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(2)",
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[900px] mx-auto">
      {/* Inline SVG Map - transparent, borders only */}
      <svg
        className="hero-map-svg w-full h-auto"
        viewBox="0 0 1000 700"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))" }}
      >
        <defs>
          <linearGradient id="heroLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210, 15%, 92%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(210, 10%, 85%)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="heroLandHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          </linearGradient>
          <filter id="heroShadow">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>

        {/* Country shapes - transparent fill, visible borders */}
        {[
          { name: "Turkey", path: "M 220,60 L 260,45 L 310,40 L 360,35 L 410,30 L 460,35 L 510,40 L 550,50 L 580,65 L 560,85 L 530,95 L 500,100 L 460,105 L 420,100 L 380,95 L 340,100 L 310,95 L 280,90 L 250,80 L 230,70 Z" },
          { name: "Syria", path: "M 380,105 L 420,100 L 460,105 L 490,115 L 500,140 L 490,160 L 460,170 L 430,165 L 400,155 L 385,140 L 375,120 Z" },
          { name: "Lebanon", path: "M 375,160 L 385,155 L 392,165 L 388,180 L 378,185 L 370,175 Z" },
          { name: "Israel", path: "M 365,190 L 378,185 L 385,195 L 382,215 L 375,230 L 368,225 L 360,210 L 358,200 Z" },
          { name: "Jordan", path: "M 385,195 L 420,175 L 450,185 L 460,200 L 450,230 L 430,250 L 400,260 L 382,240 L 375,230 L 382,215 Z" },
          { name: "Iraq", path: "M 490,115 L 530,105 L 570,110 L 600,125 L 620,150 L 625,180 L 610,210 L 580,230 L 550,240 L 520,235 L 490,220 L 470,200 L 460,170 L 490,160 Z" },
          { name: "Iran", path: "M 620,70 L 670,55 L 720,50 L 770,60 L 810,80 L 840,110 L 850,150 L 840,190 L 820,220 L 790,245 L 750,260 L 710,265 L 670,255 L 640,235 L 625,210 L 625,180 L 620,150 L 600,125 L 610,100 L 615,85 Z" },
          { name: "Kuwait", path: "M 560,245 L 580,238 L 595,250 L 590,268 L 575,275 L 558,265 Z" },
          { name: "Bahrain", path: "M 610,298 L 618,293 L 624,300 L 620,310 L 612,308 Z" },
          { name: "Qatar", path: "M 622,310 L 632,305 L 638,318 L 635,335 L 625,338 L 618,325 Z" },
          { name: "UAE", path: "M 650,300 L 700,285 L 740,295 L 745,315 L 730,335 L 695,340 L 665,335 L 645,320 Z" },
          { name: "Saudi Arabia", path: "M 400,270 L 450,250 L 500,245 L 550,250 L 570,275 L 595,290 L 620,310 L 640,330 L 650,360 L 640,400 L 620,430 L 580,460 L 530,480 L 480,485 L 430,470 L 390,440 L 360,400 L 350,360 L 355,320 L 370,290 Z" },
          { name: "Oman", path: "M 700,340 L 740,325 L 770,340 L 790,370 L 800,410 L 790,450 L 770,480 L 740,495 L 710,490 L 680,470 L 660,440 L 650,400 L 660,370 L 680,350 Z" },
          { name: "Yemen", path: "M 480,490 L 530,485 L 580,470 L 620,445 L 650,460 L 670,490 L 660,530 L 630,555 L 580,565 L 530,560 L 490,540 L 470,515 Z" },
          { name: "Egypt", path: "M 180,210 L 220,195 L 260,200 L 300,210 L 340,230 L 355,260 L 360,300 L 350,340 L 330,370 L 300,385 L 260,390 L 220,380 L 190,360 L 175,330 L 170,290 L 170,250 Z" },
        ].map((country) => {
          const isHovered = hoveredCountry === country.name;
          return (
            <path
              key={country.name}
              d={country.path}
              fill={isHovered ? "url(#heroLandHover)" : "url(#heroLandGrad)"}
              stroke={isHovered ? "hsl(var(--primary))" : "rgba(255,255,255,0.25)"}
              strokeWidth={isHovered ? "1.5" : "0.8"}
              filter="url(#heroShadow)"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          );
        })}
      </svg>

      {/* Circular 3D Flags */}
      {countries.map((c, i) => {
        const isHovered = hoveredCountry === c.name;
        return (
          <div
            key={c.name}
            className="hero-flag absolute flex flex-col items-center cursor-pointer"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredCountry(c.name)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            {/* Tooltip */}
            <div
              className={`absolute -top-10 whitespace-nowrap rounded-full bg-card/90 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-foreground shadow-xl transition-all duration-300 pointer-events-none z-20 ${
                isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-90"
              }`}
            >
              {c.name}
            </div>

            {/* Circular flag */}
            <div
              className="relative flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: c.name === "Bahrain" || c.name === "Qatar" ? 24 : 32,
                height: c.name === "Bahrain" || c.name === "Qatar" ? 24 : 32,
                border: "2px solid rgba(255,255,255,0.8)",
                boxShadow: isHovered
                  ? "0 4px 20px rgba(0,0,0,0.4), 0 0 15px hsl(var(--primary) / 0.4)"
                  : "0 3px 10px rgba(0,0,0,0.3)",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)",
              }}
            >
              <span
                className="leading-none"
                style={{
                  fontSize: c.name === "Bahrain" || c.name === "Qatar" ? 14 : 18,
                }}
              >
                {c.flag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroMap;
