import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import middleEastMap from "@/assets/middle-east-map.jpg";

gsap.registerPlugin(ScrollTrigger);

interface Country {
  name: string;
  flag: string;
  x: number; // % from left
  y: number; // % from top
}

const countries: Country[] = [
  { name: "Turkey", flag: "🇹🇷", x: 38, y: 8 },
  { name: "Cyprus", flag: "🇨🇾", x: 22, y: 24 },
  { name: "Lebanon", flag: "🇱🇧", x: 24, y: 32 },
  { name: "Israel", flag: "🇮🇱", x: 21, y: 38 },
  { name: "Palestine", flag: "🇵🇸", x: 19, y: 44 },
  { name: "Syria", flag: "🇸🇾", x: 35, y: 22 },
  { name: "Jordan", flag: "🇯🇴", x: 29, y: 42 },
  { name: "Iraq", flag: "🇮🇶", x: 48, y: 22 },
  { name: "Iran", flag: "🇮🇷", x: 72, y: 18 },
  { name: "Kuwait", flag: "🇰🇼", x: 52, y: 42 },
  { name: "Bahrain", flag: "🇧🇭", x: 59, y: 46 },
  { name: "Qatar", flag: "🇶🇦", x: 60, y: 52 },
  { name: "Saudi Arabia", flag: "🇸🇦", x: 47, y: 60 },
  { name: "UAE", flag: "🇦🇪", x: 68, y: 52 },
  { name: "Oman", flag: "🇴🇲", x: 70, y: 65 },
  { name: "Yemen", flag: "🇾🇪", x: 52, y: 80 },
  { name: "Egypt", flag: "🇪🇬", x: 12, y: 52 },
  { name: "Morocco", flag: "🇲🇦", x: 3, y: 32 },
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
        <div className="me-map-container relative mx-auto max-w-4xl">
          <div className="relative w-full">
            {/* Map Image */}
            <img
              src={middleEastMap}
              alt="Middle East Map"
              className="w-full h-auto rounded-2xl opacity-80 dark:invert dark:opacity-30"
              draggable={false}
            />

            {/* Flag Pins overlaid on top */}
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
                  className={`absolute -top-10 whitespace-nowrap rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-lg transition-all duration-300 pointer-events-none z-10 ${
                    hoveredCountry === c.name
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  Active Clients in {c.name}
                  <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-card border-r border-b border-border/50 transform -translate-x-1/2 rotate-45" />
                </div>

                {/* Flag */}
                <span className="text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-125 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
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
