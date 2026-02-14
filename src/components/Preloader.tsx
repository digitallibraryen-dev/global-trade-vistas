import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate progress bar
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].val);
          setProgress(val);
          if (progressRef.current) {
            progressRef.current.style.width = val + "%";
          }
        },
      }
    );

    // Fade out preloader
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      {/* Radial glow background */}
      <div className="absolute inset-0 gradient-radial-glow" />

      {/* Company name */}
      <h1 className="relative mb-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        <span className="gradient-primary bg-clip-text text-transparent">
          Almonesi
        </span>
      </h1>
      <p className="relative mb-12 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Global Trade
      </p>

      {/* Progress bar */}
      <div className="relative w-64 sm:w-80">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-secondary">
          <div
            ref={progressRef}
            className="h-full rounded-full gradient-primary transition-none"
            style={{ width: "0%" }}
          />
        </div>
        <span
          ref={percentRef}
          className="mt-3 block text-center text-xs font-medium text-muted-foreground tabular-nums"
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default Preloader;
