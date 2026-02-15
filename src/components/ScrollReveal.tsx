import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Animation =
  | "fade-up"
  | "fade-in"
  | "scale-in"
  | "slide-left"
  | "slide-right"
  | "slide-down"
  | "headline"       // blur-to-clear luxury text
  | "paragraph"      // line-by-line text flow
  | "icon-bounce"    // bounce-in for icons
  | "card"           // card with rotation correction
  | "alternating";   // auto-alternating direction per child

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
}

const baseFrom: Record<string, gsap.TweenVars> = {
  "fade-up":      { opacity: 0, y: 40 },
  "fade-in":      { opacity: 0 },
  "scale-in":     { opacity: 0, scale: 0.92 },
  "slide-left":   { opacity: 0, x: -60 },
  "slide-right":  { opacity: 0, x: 60 },
  "slide-down":   { opacity: 0, y: -40 },
  "headline":     { opacity: 0, y: 60, filter: "blur(10px)" },
  "paragraph":    { opacity: 0, y: 25 },
  "icon-bounce":  { opacity: 0, scale: 0.7 },
  "card":         { opacity: 0, y: 40, rotation: 2 },
};

const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.9,
  className = "",
  stagger = 0,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduce motion on mobile
    const isMobile = window.innerWidth < 768;
    const motionScale = isMobile ? 0.6 : 1;

    const ctx = gsap.context(() => {
      if (animation === "alternating") {
        // Each child gets a different direction in sequence
        const directions = ["slide-right", "slide-left", "fade-up", "scale-in"];
        Array.from(el.children).forEach((child, i) => {
          const dir = directions[i % directions.length];
          const from = { ...baseFrom[dir] };
          // Scale down motion values for mobile
          if (from.x) from.x = (from.x as number) * motionScale;
          if (from.y) from.y = (from.y as number) * motionScale;

          gsap.from(child, {
            ...from,
            duration: duration + 0.1,
            delay: delay + i * (stagger || 0.15),
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        return;
      }

      if (animation === "headline") {
        gsap.from(el, {
          opacity: 0,
          y: 60 * motionScale,
          filter: "blur(10px)",
          duration: 1.2,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return;
      }

      if (animation === "paragraph") {
        const targets = stagger > 0 ? el.children : el;
        gsap.from(targets, {
          opacity: 0,
          y: 25 * motionScale,
          duration: 0.8,
          delay,
          stagger: stagger > 0 ? stagger : 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return;
      }

      if (animation === "icon-bounce") {
        const targets = stagger > 0 ? el.children : el;
        gsap.from(targets, {
          opacity: 0,
          scale: 0.7,
          duration: 0.6,
          delay,
          stagger: stagger > 0 ? stagger : 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return;
      }

      if (animation === "card") {
        const targets = stagger > 0 ? el.children : el;
        gsap.from(targets, {
          opacity: 0,
          y: 40 * motionScale,
          rotation: 2 * motionScale,
          duration: 0.8,
          delay,
          stagger: stagger > 0 ? stagger : 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return;
      }

      // Default animations
      const targets = stagger > 0 ? el.children : el;
      const fromVars = { ...baseFrom[animation] || baseFrom["fade-up"] };
      if (fromVars.x) fromVars.x = (fromVars.x as number) * motionScale;
      if (fromVars.y) fromVars.y = (fromVars.y as number) * motionScale;

      gsap.from(targets, {
        ...fromVars,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: animation === "scale-in" ? "back.out(1.2)" : "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
