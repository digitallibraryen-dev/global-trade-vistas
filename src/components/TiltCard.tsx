import { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className }: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const el = cardRef.current;
      const glow = glowRef.current;
      const sheen = sheenRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (8 * (0.5 - y)).toFixed(2);
      const rotateY = (8 * (x - 0.5)).toFixed(2);

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      el.style.transition = "transform 120ms cubic-bezier(0.03,0.98,0.52,0.99)";

      // Dynamic shadow
      const sx = parseFloat(rotateY) * -2;
      const sy = parseFloat(rotateX) * 2;
      el.style.boxShadow = `${sx}px ${sy + 10}px 35px -10px hsl(var(--primary) / 0.2), 0 5px 25px -5px hsl(var(--primary) / 0.1)`;

      // Glow border follows cursor
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, hsl(var(--accent) / 0.35), hsl(var(--primary) / 0.2) 40%, transparent 70%)`;
      }

      // Light sweep sheen
      if (sheen) {
        sheen.style.opacity = "0.15";
        sheen.style.background = `radial-gradient(400px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, hsl(0 0% 100% / 0.6), transparent 60%)`;
      }
    },
    [isMobile]
  );

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    const sheen = sheenRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.style.transition = "transform 400ms cubic-bezier(0.03,0.98,0.52,0.99)";
    el.style.boxShadow = "";
    if (glow) glow.style.opacity = "0";
    if (sheen) sheen.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "relative will-change-transform group",
        isMobile && "hover:scale-[1.02] transition-transform duration-300",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* RGB glow border overlay */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 z-0"
        style={{ borderRadius: "inherit" }}
      />
      {/* Light sweep sheen */}
      <div
        ref={sheenRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-10"
        style={{ borderRadius: "inherit" }}
      />
      {/* Content layers with parallax depth */}
      <div style={{ transform: "translateZ(30px)" }} className="relative z-[5]">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
