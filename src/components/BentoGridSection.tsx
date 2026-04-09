import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import flowHero from "@/assets/flow-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ── Animated counter ── */
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
        duration: 2.4,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => setVal(Math.round(obj.v)),
      });
    });
    return () => ctx.revert();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const FlowSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Mouse-based tilt on floating elements ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;

    section.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "1");
      gsap.to(el, {
        x: cx * 18 * depth,
        y: cy * 12 * depth,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* Hero image parallax zoom */
      const heroImg = section.querySelector<HTMLElement>(".flow-parallax-img");
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.15 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      /* Staggered reveal sequence */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      // 1. Statistic fades & scales in
      tl.fromTo(
        section.querySelector(".flow-stat"),
        { opacity: 0, scale: 0.6, filter: "blur(16px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "back.out(1.4)" },
        0
      );

      // 2. Text appears from bottom with blur-to-clear
      tl.fromTo(
        section.querySelector(".flow-statement"),
        { opacity: 0, y: 60, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
        0.3
      );

      // 3. Small card slides in from the right
      tl.fromTo(
        section.querySelector(".flow-float-card"),
        { opacity: 0, x: 100, filter: "blur(10px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        0.5
      );

      // 4. CTA strip appears last with glow
      tl.fromTo(
        section.querySelector(".flow-cta-strip"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 lg:py-44 overflow-hidden"
    >
      {/* ── Ambient glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/4 blur-[100px]" />
      </div>

      <div className="container-narrow relative z-10">
        {/* ── Hero image block with overlapping elements ── */}
        <div className="relative">
          {/* Parallax image */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden">
            <div className="flow-parallax-img absolute inset-0 will-change-transform">
              <img
                src={flowHero}
                alt=""
                loading="lazy"
                width={1920}
                height={810}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
          </div>

          {/* ── Floating statistic – positioned above image ── */}
          <div
            data-depth="2.5"
            className="flow-stat absolute -top-8 sm:-top-12 left-6 sm:left-12 z-20 glass-strong rounded-2xl px-8 sm:px-12 py-6 sm:py-8 text-center transition-all duration-500 hover:shadow-[0_8px_50px_-8px_hsl(var(--primary)/0.3)] hover:-translate-y-1"
          >
            <p className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground leading-none tracking-tight">
              <Counter target={98} suffix="%" />
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 tracking-widest uppercase">
              {t("flow.statLabel")}
            </p>
          </div>

          {/* ── Small floating card – overlapping bottom-right ── */}
          <div
            data-depth="1.8"
            className="flow-float-card absolute -bottom-10 sm:-bottom-14 right-4 sm:right-10 z-20 glass-strong rounded-2xl p-6 sm:p-8 max-w-xs transition-all duration-500 hover:shadow-[0_8px_50px_-8px_hsl(var(--primary)/0.25)] hover:-translate-y-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">
              {t("flow.tag")}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("flow.body")}
            </p>
          </div>
        </div>

        {/* ── Bold centered statement ── */}
        <div className="flow-statement mt-24 sm:mt-32 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-[1.08] tracking-tight">
            {t("flow.headline")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t("flow.quote")}
          </p>
        </div>

        {/* ── Full-width CTA strip ── */}
        <div className="flow-cta-strip mt-16 sm:mt-20 flex justify-center">
          <Button
            size="lg"
            className="glow-primary text-base px-10 py-6"
            onClick={() => navigate("/contact")}
          >
            {t("flow.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
