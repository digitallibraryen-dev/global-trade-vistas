import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Globe,
  ShieldCheck,
  Lightning,
  TrendUp,
  Package,
  Handshake,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import bentoHero from "@/assets/bento-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ── animated counter ── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => setVal(Math.round(obj.v)),
      });
    });
    return () => ctx.revert();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const featureIcons = [Globe, ShieldCheck, Lightning, Package, Handshake];

const BentoGridSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* parallax on hero image */
      const heroImg = section.querySelector<HTMLElement>(".bento-hero-img");
      if (heroImg) {
        gsap.fromTo(heroImg, { y: -30 }, {
          y: 30,
          ease: "none",
          scrollTrigger: { trigger: heroImg.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      /* staggered card reveal */
      const cards = section.querySelectorAll<HTMLElement>(".bento-card");
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const features = Array.from({ length: 5 }, (_, i) => ({
    Icon: featureIcons[i],
    title: t(`bento.features.${i}.title`),
    desc: t(`bento.features.${i}.desc`),
  }));

  return (
    <section ref={sectionRef} className="section-padding overflow-hidden">
      <div className="container-narrow">
        {/* grid: 4 cols on lg, 2 on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[200px]">

          {/* ─── Hero card (large, spans 2×2) ─── */}
          <div className="bento-card group relative rounded-2xl overflow-hidden sm:col-span-2 sm:row-span-2 cursor-pointer transition-all duration-500 hover:shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.3)] hover:-translate-y-1">
            <div className="bento-hero-img absolute inset-0">
              <img src={bentoHero} alt="" loading="lazy" width={1280} height={720} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{t("bento.heroTag")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">{t("bento.heroTitle")}</h2>
              <p className="text-sm text-white/70 max-w-md">{t("bento.heroDesc")}</p>
            </div>
          </div>

          {/* ─── Feature cards (small) ─── */}
          {features.slice(0, 3).map((f, i) => (
            <div key={i} className="bento-card group glass-strong rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:glow-primary transition-shadow duration-300">
                <f.Icon size={22} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}

          {/* ─── Stat card (medium, spans 2 cols) ─── */}
          <div className="bento-card glass-strong rounded-2xl p-6 sm:col-span-2 flex items-center gap-6 transition-all duration-500 hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
            <div className="shrink-0">
              <TrendingUp size={40} weight="duotone" className="text-primary" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground">
                <Counter target={98} suffix="%" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{t("bento.statLabel")}</p>
            </div>
          </div>

          {/* ─── Remaining feature cards ─── */}
          {features.slice(3).map((f, i) => (
            <div key={i + 3} className="bento-card group glass-strong rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:glow-primary transition-shadow duration-300">
                <f.Icon size={22} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}

          {/* ─── CTA card (medium, spans 2 cols) ─── */}
          <div className="bento-card glass-strong rounded-2xl p-6 sm:col-span-2 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
            <p className="text-lg font-semibold text-foreground mb-2">{t("bento.ctaTitle")}</p>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">{t("bento.ctaDesc")}</p>
            <Button size="lg" className="glow-primary" onClick={() => navigate("/contact")}>
              {t("bento.ctaBtn")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
