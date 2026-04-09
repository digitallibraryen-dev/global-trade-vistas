import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";

import img1 from "@/assets/carousel-1.jpg";
import img2 from "@/assets/carousel-2.jpg";
import img3 from "@/assets/carousel-3.jpg";
import img4 from "@/assets/carousel-4.jpg";
import img5 from "@/assets/carousel-5.jpg";
import img6 from "@/assets/carousel-6.jpg";

gsap.registerPlugin(ScrollTrigger);

interface SlideData {
  image: string;
  titleKey: string;
  descKey: string;
}

const slides: SlideData[] = [
  { image: img1, titleKey: "carousel3d.items.0.title", descKey: "carousel3d.items.0.desc" },
  { image: img2, titleKey: "carousel3d.items.1.title", descKey: "carousel3d.items.1.desc" },
  { image: img3, titleKey: "carousel3d.items.2.title", descKey: "carousel3d.items.2.desc" },
  { image: img4, titleKey: "carousel3d.items.3.title", descKey: "carousel3d.items.3.desc" },
  { image: img5, titleKey: "carousel3d.items.4.title", descKey: "carousel3d.items.4.desc" },
  { image: img6, titleKey: "carousel3d.items.5.title", descKey: "carousel3d.items.5.desc" },
];

const RADIUS = 420;
const AUTO_SPEED = 0.15; // degrees per frame

const Carousel3DSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startAngle: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const count = slides.length;
  const step = 360 / count;

  const getItemAngle = (i: number) => i * step;

  const positionItems = useCallback(
    (angle: number) => {
      const scene = sceneRef.current;
      if (!scene) return;
      const items = scene.querySelectorAll<HTMLElement>(".c3d-item");
      items.forEach((el, i) => {
        const a = ((getItemAngle(i) + angle) % 360 + 360) % 360;
        const rad = (a * Math.PI) / 180;
        const z = RADIUS * Math.cos(rad);
        const x = RADIUS * Math.sin(rad);
        // normalized 0‑1 where 1 = front
        const norm = (z + RADIUS) / (2 * RADIUS);
        const scale = 0.55 + 0.45 * norm;
        const blur = (1 - norm) * 4;
        const opacity = 0.3 + 0.7 * norm;

        el.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${Math.round(norm * 100)}`;
      });
    },
    [count]
  );

  // Auto-rotate
  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current && !dragRef.current.active && activeIndex === null) {
        angleRef.current = (angleRef.current + AUTO_SPEED) % 360;
        positionItems(angleRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [positionItems, activeIndex]);

  // Drag
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onDown = (e: PointerEvent) => {
      if (activeIndex !== null) return;
      dragRef.current = { active: true, startX: e.clientX, startAngle: angleRef.current };
      scene.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      angleRef.current = dragRef.current.startAngle + dx * 0.3;
      positionItems(angleRef.current);
    };
    const onUp = () => {
      dragRef.current.active = false;
    };

    scene.addEventListener("pointerdown", onDown);
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerup", onUp);
    scene.addEventListener("pointercancel", onUp);
    return () => {
      scene.removeEventListener("pointerdown", onDown);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerup", onUp);
      scene.removeEventListener("pointercancel", onUp);
    };
  }, [positionItems, activeIndex]);

  // Click to focus
  const handleClick = (i: number) => {
    if (activeIndex === i) {
      setActiveIndex(null);
      return;
    }
    // Rotate so clicked item faces front (angle 0)
    const target = -getItemAngle(i);
    gsap.to(angleRef, {
      current: target,
      duration: 0.8,
      ease: "power3.inOut",
      onUpdate: () => positionItems(angleRef.current),
      onComplete: () => setActiveIndex(i),
    });
  };

  const handleClose = () => setActiveIndex(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 bg-background"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10">
        <ScrollReveal animation="headline">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {t("carousel3d.tag")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("carousel3d.title")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {t("carousel3d.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Scene */}
        <div
          className="relative mx-auto select-none"
          style={{ perspective: "1200px", height: "420px", maxWidth: "1000px" }}
        >
          <div
            ref={sceneRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d" }}
          >
            {slides.map((s, i) => (
              <div
                key={i}
                className="c3d-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-shadow duration-500"
                style={{
                  width: "340px",
                  height: "220px",
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter, opacity",
                }}
                onClick={() => handleClick(i)}
              >
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                    activeIndex === i
                      ? "ring-2 ring-primary shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
                      : "hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                  }`}
                >
                  <img
                    src={s.image}
                    alt={t(s.titleKey)}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      activeIndex === i ? "scale-110" : ""
                    }`}
                    loading="lazy"
                    width={960}
                    height={640}
                    draggable={false}
                  />
                  {/* Dark overlay + content on active */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 transition-opacity duration-500 ${
                      activeIndex === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h3
                      className={`text-lg font-bold text-white transition-all duration-500 ${
                        activeIndex === i
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      {t(s.titleKey)}
                    </h3>
                    <p
                      className={`mt-1 text-sm text-white/80 transition-all duration-700 delay-100 ${
                        activeIndex === i
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      {t(s.descKey)}
                    </p>
                  </div>
                  {/* Reflection / bottom glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close hint */}
        {activeIndex !== null && (
          <p
            onClick={handleClose}
            className="mt-6 text-center text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
          >
            {t("carousel3d.clickToClose")}
          </p>
        )}
      </div>
    </section>
  );
};

export default Carousel3DSection;
