import { useRef, useCallback, useEffect } from "react";

interface TiltOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export const useTilt = <T extends HTMLElement>(options: TiltOptions = {}) => {
  const { max = 8, perspective = 1000, scale = 1.02, speed = 400 } = options;
  const ref = useRef<T>(null);

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      const rotateX = (max * (0.5 - y)).toFixed(2);
      const rotateY = (max * (x - 0.5)).toFixed(2);

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      el.style.transition = `transform ${speed * 0.3}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

      // Dynamic shadow
      const shadowX = parseFloat(rotateY) * -2;
      const shadowY = parseFloat(rotateX) * 2;
      el.style.boxShadow = `${shadowX}px ${shadowY + 8}px 30px -10px hsl(var(--primary) / 0.15), 0 4px 20px -5px hsl(var(--primary) / 0.08)`;
    },
    [max, perspective, scale, speed]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    el.style.boxShadow = "";
  }, [perspective, speed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleLeave);
    };
  }, [handleMove, handleLeave]);

  return ref;
};
