import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock, Users, CheckCircle } from "@phosphor-icons/react";

const BASE_DATE = new Date("2025-01-01T00:00:00Z");
const BASE_COUNT = 1721;

const getClientCount = () => {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24));
  // Deterministic pseudo-random increment per day (1-3)
  let total = BASE_COUNT;
  for (let i = 0; i < diffDays; i++) {
    const seed = (i * 7 + 3) % 3; // yields 0,1,2
    total += seed + 1; // yields 1,2,3
  }
  return total;
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const clientCount = useMemo(() => getClientCount(), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-sub", { opacity: 0, y: 40, duration: 1, ease: "power3.out", delay: 0.5 });
      gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.8, stagger: 0.15 });
      gsap.from(".hero-spline", { opacity: 0, duration: 1.5, ease: "power2.out", delay: 0.3 });
      gsap.from(".hero-stat", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", delay: 1.1, stagger: 0.12 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: ShieldCheck, value: "100%", label: t("hero.statVerified") },
    { icon: Clock, value: "24/7", label: t("hero.statSupport") },
    { icon: Users, value: `${clientCount.toLocaleString()}+`, label: t("hero.statClients") },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div className="hero-spline absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/herobannerfortransportandlogisticscompanygmw2425-GYw1Ka0Iu2NG1giJfqOEBM46/"
          frameBorder="0" width="100%" height="100%"
          className="pointer-events-none" title="3D Hero Background" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none z-[2]" />
        <div className="absolute bottom-0 right-0 w-[220px] h-[60px] pointer-events-none z-[5]" style={{ backgroundColor: "#003f7f" }} />
      </div>

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
              <Link to="/contact" className="hero-cta btn-3d rounded-lg gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg inline-flex items-center">
                {t("hero.ctaContact")}
              </Link>
              <Link to="/services" className="hero-cta btn-3d glass rounded-lg px-8 py-3.5 text-sm font-semibold text-white border-white/20 inline-flex items-center">
                {t("hero.ctaServices")}
              </Link>
            </div>

            {/* Stats Badges */}
            <div className="mt-10 flex flex-wrap gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="hero-stat flex items-center gap-3 rounded-xl px-5 py-3 backdrop-blur-md bg-white/10 border border-white/15"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm bg-white/15">
                    <s.icon size={22} weight="light" className="text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white leading-tight">{s.value}</div>
                    <div className="text-xs text-white/70">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
