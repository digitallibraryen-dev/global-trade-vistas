import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobeHemisphereWest, ShieldCheck, TrendUp, Package, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import slider1 from "@/assets/bento-slider-1.jpg";
import slider2 from "@/assets/bento-slider-2.jpg";
import slider3 from "@/assets/bento-slider-3.jpg";

gsap.registerPlugin(ScrollTrigger);

const slides = [slider1, slider2, slider3];

const BentoGridSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const iv = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(iv);
  }, []);

  // GSAP slide transition
  useEffect(() => {
    const imgs = sliderRef.current?.querySelectorAll(".bento-slide");
    if (!imgs) return;
    imgs.forEach((img, i) => {
      gsap.to(img, {
        opacity: i === current ? 1 : 0,
        scale: i === current ? 1 : 1.08,
        duration: 1.2,
        ease: "power3.inOut",
      });
    });
  }, [current]);

  // Scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: GlobeHemisphereWest, value: "15+", label: t("bento.countries") },
    { icon: ShieldCheck, value: "99.8%", label: t("bento.accuracy") },
    { icon: TrendUp, value: "3x", label: t("bento.faster") },
    { icon: Package, value: "50K+", label: t("bento.shipments") },
  ];

  return (
    <section ref={sectionRef} className="section-padding overflow-hidden">
      <div className="container-narrow">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">

          {/* Main Slider Card — spans 2 cols, 2 rows */}
          <div className="bento-card group relative col-span-1 md:col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
            <div ref={sliderRef} className="absolute inset-0">
              {slides.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="bento-slide absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                {t("bento.tag")}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                {t("bento.title")}
              </h2>
              <p className="text-sm text-white/70 max-w-md">{t("bento.subtitle")}</p>
              {/* Slide indicators */}
              <div className="flex gap-2 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-primary" : "w-4 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          {stats.map((s, i) => (
            <div
              key={i}
              className="bento-card group relative rounded-2xl glass-strong p-5 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
              <s.icon size={28} weight="duotone" className="text-primary relative z-10" />
              <div className="relative z-10">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <div className="bento-card group relative col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl bg-primary/5 border border-primary/10 p-6 flex items-center justify-between overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20">
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors duration-500" />
            <div className="relative z-10">
              <h3 className="font-semibold text-foreground text-lg">{t("bento.ctaTitle")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("bento.ctaDesc")}</p>
            </div>
            <Button
              onClick={() => navigate("/services")}
              className="relative z-10 shrink-0 gap-2 glow-primary"
            >
              {t("bento.ctaBtn")} <ArrowRight size={16} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
