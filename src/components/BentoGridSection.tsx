import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import flowHero from "@/assets/flow-hero.jpg";
import flowDetail from "@/assets/flow-detail.jpg";

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
  const mouseRef = useRef({ x: 0, y: 0 });

  /* ── Mouse-based parallax tracking ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current = { x: cx, y: cy };

    const tracked = section.querySelectorAll<HTMLElement>("[data-depth]");
    tracked.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "1");
      gsap.to(el, {
        x: cx * 20 * depth,
        y: cy * 15 * depth,
        duration: 0.8,
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

  /* ── Scroll-triggered animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* parallax on hero image */
      const heroImg = section.querySelector<HTMLElement>(".flow-hero-img");
      if (heroImg) {
        gsap.fromTo(heroImg, { y: -60 }, {
          y: 60,
          ease: "none",
          scrollTrigger: { trigger: heroImg.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      /* parallax on detail image */
      const detailImg = section.querySelector<HTMLElement>(".flow-detail-img");
      if (detailImg) {
        gsap.fromTo(detailImg, { y: -30 }, {
          y: 30,
          ease: "none",
          scrollTrigger: { trigger: detailImg.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      /* reveal elements from different directions */
      section.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const dir = el.dataset.reveal || "bottom";
        const from: gsap.TweenVars = {
          opacity: 0,
          filter: "blur(12px)",
          scale: 0.95,
        };
        if (dir === "left") from.x = -80;
        else if (dir === "right") from.x = 80;
        else from.y = 60;

        gsap.fromTo(el, from, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* ── Film grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Ambient background glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          data-depth="0.3"
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"
        />
        <div
          data-depth="0.5"
          className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]"
        />
      </div>

      <div className="container-narrow relative z-10">
        {/* ── Row 1: Large hero image + floating text ── */}
        <div className="relative mb-20 sm:mb-32">
          {/* Hero image block */}
          <div
            data-reveal="left"
            className="relative w-full lg:w-[75%] aspect-[16/9] rounded-3xl overflow-hidden group"
          >
            <div className="flow-hero-img absolute inset-0">
              <img
                src={flowHero}
                alt=""
                loading="lazy"
                width={1920}
                height={1080}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>

          {/* Floating text block, overlapping the image */}
          <div
            data-reveal="right"
            data-depth="1.5"
            className="relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 mt-8 lg:mt-0 lg:w-[45%] p-8 sm:p-10 rounded-2xl glass-strong transition-all duration-500 hover:shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.2)] hover:-translate-y-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">
              {t("flow.tag")}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] mb-4">
              {t("flow.headline")}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("flow.body")}
            </p>
          </div>
        </div>

        {/* ── Row 2: Floating stat + detail image + statement ── */}
        <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Floating statistic */}
          <div
            data-reveal="bottom"
            data-depth="2"
            className="lg:absolute lg:left-0 lg:top-0 lg:z-20 glass-strong rounded-2xl px-10 py-8 text-center transition-all duration-500 hover:shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.25)] hover:-translate-y-1"
          >
            <p className="text-6xl sm:text-7xl font-black text-foreground leading-none">
              <Counter target={98} suffix="%" />
            </p>
            <p className="text-sm text-muted-foreground mt-2 tracking-wide">
              {t("flow.statLabel")}
            </p>
          </div>

          {/* Detail image */}
          <div
            data-reveal="bottom"
            className="relative w-full lg:w-[50%] lg:mx-auto aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden group"
          >
            <div className="flow-detail-img absolute inset-0">
              <img
                src={flowDetail}
                alt=""
                loading="lazy"
                width={960}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
          </div>

          {/* Bold statement + CTA, offset right */}
          <div
            data-reveal="right"
            data-depth="1"
            className="lg:absolute lg:right-0 lg:bottom-8 lg:w-[40%] space-y-6"
          >
            <blockquote className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              "{t("flow.quote")}"
            </blockquote>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t("flow.quoteBody")}
            </p>
            <Button
              size="lg"
              className="glow-primary"
              onClick={() => navigate("/contact")}
            >
              {t("flow.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
