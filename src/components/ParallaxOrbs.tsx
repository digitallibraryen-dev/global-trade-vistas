import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOrbsProps {
  variant?: "primary" | "accent" | "mixed";
}

const ParallaxOrbs = ({ variant = "mixed" }: ParallaxOrbsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const orbs = ref.current.querySelectorAll(".parallax-orb");
    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        // Cinematic floating with yoyo
        gsap.to(orb, {
          y: -20 + (i % 3) * 6,
          x: (i % 2 === 0 ? 8 : -8),
          duration: 4 + i * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });

        // Deep parallax on scroll — background speed layers
        const speed = i % 3 === 0 ? 0.5 : i % 3 === 1 ? 1 : 1.2;
        gsap.to(orb, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
          y: (i % 2 === 0 ? -100 : 100) * speed,
        });

        // Glow intensity increases on scroll
        gsap.fromTo(orb, 
          { opacity: 0.3 },
          {
            opacity: 0.7,
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const colors = {
    primary: "hsl(var(--primary) / 0.1)",
    accent: "hsl(var(--accent) / 0.1)",
  };

  const orbConfigs = [
    { size: 240, top: "8%", left: "3%", color: variant === "accent" ? colors.accent : colors.primary },
    { size: 180, top: "55%", right: "5%", color: variant === "primary" ? colors.primary : colors.accent },
    { size: 120, top: "25%", right: "22%", color: colors.primary },
    { size: 200, bottom: "10%", left: "12%", color: colors.accent },
    { size: 90, top: "40%", left: "45%", color: colors.primary },
  ];

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {orbConfigs.map((orb, i) => (
        <div
          key={i}
          className="parallax-orb absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: "blur(40px)",
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxOrbs;
