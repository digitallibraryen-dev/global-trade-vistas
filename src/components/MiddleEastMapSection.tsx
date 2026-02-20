import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MiddleEastSVGMap from "./map/MiddleEastSVGMap";
import Flag3D from "./map/Flag3D";
import { middleEastCountries } from "./map/countries";

gsap.registerPlugin(ScrollTrigger);

// Flag positions as percentages of the map container
const flagPositions: Record<string, { x: number; y: number }> = {
  Turkey: { x: 40, y: 10 },
  Syria: { x: 44, y: 19 },
  Cyprus: { x: 35, y: 17 },
  Lebanon: { x: 38, y: 24 },
  Israel: { x: 37, y: 29 },
  Palestine: { x: 38, y: 30 },
  Jordan: { x: 42, y: 32 },
  Iraq: { x: 55, y: 24 },
  Iran: { x: 73, y: 22 },
  Kuwait: { x: 57, y: 36 },
  Bahrain: { x: 62, y: 43 },
  Qatar: { x: 63, y: 46 },
  UAE: { x: 70, y: 45 },
  "Saudi Arabia": { x: 49, y: 54 },
  Oman: { x: 73, y: 59 },
  Yemen: { x: 57, y: 74 },
  Egypt: { x: 27, y: 42 },
  Morocco: { x: 8, y: 26 },
};

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
        stagger: 0.06,
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

        <div className="me-map-container relative mx-auto max-w-5xl" style={{ perspective: "1200px" }}>
          <div className="relative w-full">
            <MiddleEastSVGMap hoveredCountry={hoveredCountry} onHover={setHoveredCountry} />

            {middleEastCountries.map((c, i) => {
              const pos = flagPositions[c.name];
              if (!pos) return null;
              return (
                <Flag3D
                  key={c.name}
                  name={c.name}
                  flag={c.flag}
                  x={pos.x}
                  y={pos.y}
                  isHovered={hoveredCountry === c.name}
                  onHover={setHoveredCountry}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatFlag3D {
          0%, 100% { transform: translateY(0) rotateY(0deg); }
          25% { transform: translateY(-4px) rotateY(5deg); }
          75% { transform: translateY(-2px) rotateY(-3deg); }
        }
        @media (max-width: 640px) {
          @keyframes floatFlag3D {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
        }
      `}</style>
    </section>
  );
};

export default MiddleEastMapSection;
