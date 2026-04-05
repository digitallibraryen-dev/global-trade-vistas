import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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
      gsap.from(".hero-diamond", { opacity: 0, scale: 0, duration: 0.6, ease: "back.out(1.7)", delay: 1.2, stagger: 0.1 });
    }, section);

    return () => ctx.revert();
  }, []);

  // Floating diamond animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const diamonds = section.querySelectorAll<HTMLElement>(".hero-diamond");
    const ctx = gsap.context(() => {
      diamonds.forEach((d, i) => {
        gsap.to(d, {
          y: `random(-20, 20)`,
          x: `random(-15, 15)`,
          duration: 4 + i * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Diamond positions (scattered around the hero)
  const diamonds = [
    { top: "12%", left: "5%", size: 12 },
    { top: "15%", right: "8%", size: 10 },
    { top: "55%", right: "6%", size: 14 },
    { top: "60%", left: "3%", size: 10 },
    { top: "80%", left: "15%", size: 8 },
    { top: "35%", left: "10%", size: 8 },
    { top: "75%", right: "12%", size: 12 },
    { bottom: "8%", left: "45%", size: 10 },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden max-w-[100vw] bg-[#050505]">
      {/* Concentric circle patterns */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {[340, 480, 620, 760, 900].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/[0.06]"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Arc lines (partial circles) for depth */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="500" cy="500" rx="250" ry="250" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
        <ellipse cx="500" cy="500" rx="380" ry="380" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
        <ellipse cx="500" cy="500" rx="180" ry="420" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" transform="rotate(25 500 500)" />
        <ellipse cx="500" cy="500" rx="300" ry="460" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" transform="rotate(-20 500 500)" />
        <ellipse cx="500" cy="500" rx="200" ry="350" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" transform="rotate(60 500 500)" />
        <ellipse cx="500" cy="500" rx="420" ry="300" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" transform="rotate(-40 500 500)" />
      </svg>

      {/* Floating blue diamonds */}
      {diamonds.map((d, i) => (
        <div
          key={i}
          className="hero-diamond absolute z-[2]"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
          }}
        >
          <div
            className="rotate-45 bg-[#4F6BFF]"
            style={{ width: d.size, height: d.size }}
          />
        </div>
      ))}

      {/* Content — centered foreground */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20 pb-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <h1 className="hero-headline text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl uppercase">
            <span className="text-white">{t("hero.title1")} </span>
            <span className="text-[#4F6BFF]">{t("hero.highlight")}</span>
            <br />
            <span className="text-white">{t("hero.title2")}</span>
          </h1>

          <p className="hero-sub mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/70">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 w-full max-w-xs sm:max-w-sm">
            <button
              onClick={() => scrollTo("#quote")}
              className="hero-cta w-full flex items-center justify-center gap-2 rounded-full bg-[#4F6BFF] hover:bg-[#3d57e6] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors"
            >
              {t("hero.cta1")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="hero-cta w-full flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors"
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
