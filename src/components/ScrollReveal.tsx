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
  "fade-up": { opacity: 0, y: 50, filter: "blur(6px)" },
  "fade-in": { opacity: 0, filter: "blur(4px)" },
  "scale-in": { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  "slide-left": { opacity: 0, x: -50, filter: "blur(4px)" },
  "slide-right": { opacity: 0, x: 50, filter: "blur(4px)" },
};

const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 1,
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
        ease: "power4.out",
        clearProps: "filter",
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
