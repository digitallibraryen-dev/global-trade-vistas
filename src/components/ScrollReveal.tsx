import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Animation = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
}

const animationMap: Record<Animation, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-in": { opacity: 0 },
  "scale-in": { opacity: 0, scale: 0.92 },
  "slide-left": { opacity: 0, x: -40 },
  "slide-right": { opacity: 0, x: 40 },
};

const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
  stagger = 0,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger > 0 ? el.children : el;
    const fromVars = animationMap[animation];

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        ...fromVars,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
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
