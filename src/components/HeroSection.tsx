import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Mouse parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!layerRef.current) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;

    const items = layerRef.current.querySelectorAll<HTMLElement>("[data-depth]");
    items.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0");
      const x = dx * depth * 30;
      const y = dy * depth * 20;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, duration: 1, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.8, stagger: 0.15 });
      gsap.from(".hero-bg-layer", { opacity: 0, duration: 1.5, ease: "power2.out", delay: 0.1 });
      gsap.from(".hero-float-item", { opacity: 0, scale: 0.5, duration: 1.2, ease: "back.out(1.4)", delay: 0.6, stagger: 0.15 });
    }, section);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden max-w-[100vw]">
      {/* BG gradient */}
      <div className="hero-bg-layer absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient-bg" />
        <div className="absolute w-[600px] h-[600px] rounded-full hero-orb-1 -top-40 -right-40 opacity-30" />
        <div className="absolute w-[400px] h-[400px] rounded-full hero-orb-2 bottom-10 -left-20 opacity-20" />
        <div className="absolute w-[300px] h-[300px] rounded-full hero-orb-3 top-1/3 right-1/4 opacity-15" />
        <div className="absolute inset-0 hero-grid-overlay opacity-[0.03]" />
      </div>

      {/* Floating 3D elements */}
      <div ref={layerRef} className="absolute inset-0 z-[3] pointer-events-none" aria-hidden="true">
        {/* Back layer — blurred, slow */}
        <span data-depth="0.3" className="hero-float-item hero-float-a absolute text-5xl opacity-[0.12] blur-[2px] top-[12%] right-[10%]">🌍</span>
        <span data-depth="0.2" className="hero-float-item hero-float-b absolute text-4xl opacity-[0.10] blur-[3px] bottom-[20%] left-[8%]">🚢</span>

        {/* Mid layer */}
        <span data-depth="0.6" className="hero-float-item hero-float-c absolute text-3xl opacity-[0.18] top-[28%] right-[22%]">📦</span>
        <span data-depth="0.5" className="hero-float-item hero-float-d absolute text-3xl opacity-[0.15] bottom-[30%] right-[14%]">✈️</span>

        {/* Front layer */}
        <span data-depth="1.0" className="hero-float-item hero-float-e absolute text-2xl opacity-[0.22] top-[18%] left-[60%]">📦</span>
        <span data-depth="0.8" className="hero-float-item hero-float-f absolute text-4xl opacity-[0.20] bottom-[15%] right-[30%]">🌍</span>
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/30 to-transparent pointer-events-none z-[4]" />

      {/* Content — foreground */}
      <div className="relative z-10 flex min-h-screen items-center section-padding pt-24">
        <div className="container-narrow">
          <div className="max-w-2xl">
            <h1 className="hero-headline text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              {t("hero.title1")}{" "}
              <span className="text-accent drop-shadow-[0_0_20px_hsl(200_90%_60%/0.6)]">
                {t("hero.highlight")}
              </span>{" "}
              {t("hero.title2")}
            </h1>
            <p className="hero-sub mt-6 max-w-lg text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.2)]">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={() => scrollTo("#quote")} className="hero-cta btn-3d rounded-lg gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg">
                {t("hero.cta1")}
              </button>
              <button onClick={() => scrollTo("#contact")} className="hero-cta btn-3d glass rounded-lg px-8 py-3.5 text-sm font-semibold text-white border-white/20">
                {t("hero.cta2")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
