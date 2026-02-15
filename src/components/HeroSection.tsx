import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations with blur-to-clear
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(12px)", duration: 1.4, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, filter: "blur(8px)", duration: 1.1, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, filter: "blur(6px)", duration: 0.9, ease: "power3.out", delay: 0.8, stagger: 0.15 });
      gsap.from(".hero-spline", { opacity: 0, duration: 1.8, ease: "power2.out", delay: 0.3 });

      // Parallax depth on scroll — hero content moves faster (foreground)
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: -80,
        opacity: 0.3,
        ease: "none",
      });

      // Background moves slower (parallax depth)
      gsap.to(".hero-spline", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: 50,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div className="hero-spline absolute inset-0 z-0" style={{ willChange: "transform" }}>
        <iframe
          src="https://my.spline.design/herobannerfortransportandlogisticscompanygmw2425-GYw1Ka0Iu2NG1giJfqOEBM46/"
          frameBorder="0" width="100%" height="100%"
          className="pointer-events-none" title="3D Hero Background" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none z-[2]" />
        <div className="absolute bottom-0 right-0 w-[220px] h-[60px] pointer-events-none z-[5]" style={{ backgroundColor: "#003f7f" }} />
      </div>

      <div className="hero-content relative z-10 flex min-h-screen items-center section-padding pt-24" style={{ willChange: "transform, opacity" }}>
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
