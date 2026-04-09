import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CinematicHeroProps {
  tag: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: { label: string; onClick: () => void };
}

const CinematicHero = ({ tag, title, subtitle, image, cta }: CinematicHeroProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".chero-tag", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power3.out" });
      gsap.from(".chero-title", { opacity: 0, y: 40, filter: "blur(8px)", duration: 1, delay: 0.4, ease: "power3.out" });
      gsap.from(".chero-sub", { opacity: 0, y: 30, duration: 0.8, delay: 0.7, ease: "power3.out" });
      gsap.from(".chero-cta", { opacity: 0, y: 20, duration: 0.6, delay: 1, ease: "power3.out" });
      gsap.from(".chero-img", { scale: 1.15, duration: 2, delay: 0, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="chero-img absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="chero-tag text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-4">{tag}</p>
        <h1 className="chero-title text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">{title}</h1>
        {subtitle && (
          <p className="chero-sub mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
        {cta && (
          <button onClick={cta.onClick} className="chero-cta btn-3d mt-8 rounded-full bg-primary hover:bg-primary/90 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors">
            {cta.label}
          </button>
        )}
      </div>
    </section>
  );
};

export default CinematicHero;
