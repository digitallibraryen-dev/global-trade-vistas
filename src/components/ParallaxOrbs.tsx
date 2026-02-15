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
        // Floating animation
        gsap.to(orb, {
          y: -15 + (i % 3) * 5,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.3,
        });

        // Parallax on scroll
        gsap.to(orb, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          y: (i % 2 === 0 ? -80 : 80) * (1 + i * 0.2),
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const colors = {
    primary: "hsl(var(--primary) / 0.08)",
    accent: "hsl(var(--accent) / 0.08)",
  };

  const orbConfigs = [
    { size: 200, top: "10%", left: "5%", color: variant === "accent" ? colors.accent : colors.primary },
    { size: 150, top: "60%", right: "8%", color: variant === "primary" ? colors.primary : colors.accent },
    { size: 100, top: "30%", right: "25%", color: colors.primary },
    { size: 180, bottom: "15%", left: "15%", color: colors.accent },
  ];

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {orbConfigs.map((orb, i) => (
        <div
          key={i}
          className="parallax-orb absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxOrbs;
