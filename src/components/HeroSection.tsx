import { useEffect, useRef, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const OrbitalBackground = lazy(() => import("@/components/OrbitalBackground"));

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1.2, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, duration: 1, ease: "power3.out", delay: 0.6 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.9, stagger: 0.15 });
    }, section);
    return () => ctx.revert();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden max-w-[100vw] bg-background">
      {/* Orbital animated background */}
      <Suspense fallback={null}>
        <OrbitalBackground />
      </Suspense>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20 pb-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <h1 className="hero-headline text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl uppercase">
            <span className="text-foreground">{t("hero.title1")} </span>
            <span className="text-primary">{t("hero.highlight")}</span>
            <br />
            <span className="text-foreground">{t("hero.title2")}</span>
          </h1>

          <p className="hero-sub mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollTo("#quote")}
              className="hero-cta flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors"
            >
              {t("hero.cta1")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="hero-cta flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-secondary-foreground transition-colors"
            >
              {t("hero.cta2")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
