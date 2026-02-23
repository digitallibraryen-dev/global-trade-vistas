import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MiddleEastSVGMap from "./map/MiddleEastSVGMap";
import Flag3D from "./map/Flag3D";
import { middleEastCountries, MAP_BOUNDS } from "./map/countries";

gsap.registerPlugin(ScrollTrigger);

// Compute flag positions from real geographic centers (lon, lat) → percentage of map
function geoToPercent(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100,
    y: ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100,
  };
}

const flagPositions: Record<string, { x: number; y: number }> = {
  Turkey: geoToPercent(35, 39.5),
  Syria: geoToPercent(38.5, 35.5),
  Cyprus: geoToPercent(33.4, 35.1),
  Lebanon: geoToPercent(35.8, 33.9),
  Israel: geoToPercent(35, 31.5),
  Palestine: geoToPercent(35.3, 32),
  Jordan: geoToPercent(37, 31),
  Iraq: geoToPercent(43.5, 33.5),
  Iran: geoToPercent(53, 33),
  Kuwait: geoToPercent(47.5, 29.4),
  Bahrain: geoToPercent(50.5, 26),
  Qatar: geoToPercent(51.2, 25.5),
  UAE: geoToPercent(54, 24),
  "Saudi Arabia": geoToPercent(44, 24),
  Oman: geoToPercent(57, 21),
  Yemen: geoToPercent(47, 15.5),
  Egypt: geoToPercent(30, 27),
  Morocco: geoToPercent(-8, 32),
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
