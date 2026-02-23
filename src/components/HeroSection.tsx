import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import HeroMap from "./HeroMap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, duration: 1, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.8, stagger: 0.15 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden gradient-dark">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center section-padding pt-24">
        <div className="container-narrow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="max-w-xl">
              <h1 className="hero-headline text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                {t("hero.title1")}{" "}
                <span className="text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                  {t("hero.highlight")}
                </span>{" "}
                {t("hero.title2")}
              </h1>
              <p className="hero-sub mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                {t("hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => scrollTo("#quote")} className="hero-cta btn-3d rounded-lg gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg">
                  {t("hero.cta1")}
                </button>
                <button onClick={() => scrollTo("#contact")} className="hero-cta btn-3d glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground border-border/30">
                  {t("hero.cta2")}
                </button>
              </div>
            </div>

            {/* Map - transparent, no background box */}
            <div className="flex items-center justify-center">
              <HeroMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
