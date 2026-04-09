import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";
import { useIsMobile } from "@/hooks/use-mobile";

import img1 from "@/assets/carousel-1.jpg";
import img2 from "@/assets/carousel-2.jpg";
import img3 from "@/assets/carousel-3.jpg";
import img4 from "@/assets/carousel-4.jpg";
import img5 from "@/assets/carousel-5.jpg";

gsap.registerPlugin(ScrollTrigger);

interface SlideData {
  image: string;
  titleKey: string;
  descKey: string;
}

const slides: SlideData[] = [
  { image: img1, titleKey: "carousel3d.slides.0.title", descKey: "carousel3d.slides.0.desc" },
  { image: img2, titleKey: "carousel3d.slides.1.title", descKey: "carousel3d.slides.1.desc" },
  { image: img3, titleKey: "carousel3d.slides.2.title", descKey: "carousel3d.slides.2.desc" },
  { image: img4, titleKey: "carousel3d.slides.3.title", descKey: "carousel3d.slides.3.desc" },
  { image: img5, titleKey: "carousel3d.slides.4.title", descKey: "carousel3d.slides.4.desc" },
];

const AUTO_SPEED_DESKTOP = 0.15;
const AUTO_SPEED_MOBILE = 0.25;

const Carousel3DSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startAngle: 0 });

  const count = slides.length;
  const step = 360 / count;
  const radius = isMobile ? 180 : 340;
  const cardW = isMobile ? 180 : 260;
  const cardH = isMobile ? 250 : 360;
  const containerH = isMobile ? 320 : 420;

  const getItemStyle = useCallback(
    (index: number, currentAngle: number) => {
      const itemAngle = currentAngle + index * step;
      const rad = (itemAngle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius;
      const normalizedZ = (z + radius) / (2 * radius);
      const scale = 0.55 + normalizedZ * 0.45;
      const opacity = 0.3 + normalizedZ * 0.7;
      const blur = Math.max(0, (1 - normalizedZ) * 4);

      return {
        transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex: Math.round(normalizedZ * 100),
      };
    },
    [step, radius]
  );

  // Animation loop
  useEffect(() => {
    const items = containerRef.current?.querySelectorAll<HTMLElement>(".carousel-item");
    if (!items) return;

    const animate = () => {
      if (!pausedRef.current) {
        angleRef.current += isMobile ? AUTO_SPEED_MOBILE : AUTO_SPEED_DESKTOP;
      }
      items.forEach((el, i) => {
        const style = getItemStyle(i, angleRef.current);
        Object.assign(el.style, {
          transform: style.transform,
          opacity: String(style.opacity),
          filter: style.filter,
          zIndex: String(style.zIndex),
        });
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getItemStyle]);

  // Click to focus
  const handleClick = (index: number) => {
    if (activeIndex === index) {
      // close
      setActiveIndex(null);
      pausedRef.current = false;
      return;
    }
    pausedRef.current = true;
    setActiveIndex(index);

    // Rotate so this item faces front (angle where cos = max → itemAngle = 0)
    const targetAngle = -index * step;
    // find shortest rotation
    let current = angleRef.current % 360;
    let diff = targetAngle - current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    gsap.to(angleRef, {
      current: angleRef.current + diff,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  // Mouse drag
  const onPointerDown = (e: React.PointerEvent) => {
    if (activeIndex !== null) return;
    dragRef.current = { active: true, startX: e.clientX, startAngle: angleRef.current };
    pausedRef.current = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    angleRef.current = dragRef.current.startAngle + dx * 0.3;
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (activeIndex === null) pausedRef.current = false;
  };

  return (
    <section className="section-padding overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10">
        <ScrollReveal animation="headline">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {t("carousel3d.tag")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("carousel3d.title")}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="paragraph" delay={0.2}>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-center">
            {t("carousel3d.subtitle")}
          </p>
        </ScrollReveal>

        {/* 3D Carousel */}
        <div
          className="relative mt-10 sm:mt-16 mx-auto select-none"
          style={{ perspective: isMobile ? "800px" : "1200px", height: `${containerH}px` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {slides.map((slide, i) => {
              const isActive = activeIndex === i;
              return (
                <div
                  key={i}
                  className="carousel-item absolute cursor-pointer transition-shadow duration-500"
                  style={{ width: `${cardW}px`, height: `${cardH}px`, willChange: "transform, opacity, filter" }}
                  onClick={() => handleClick(i)}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                      isActive ? "ring-2 ring-primary shadow-[0_0_40px_hsl(var(--primary)/0.3)]" : ""
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={t(slide.titleKey)}
                      loading="lazy"
                      width={260}
                      height={360}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isActive ? "scale-110" : "hover:scale-105"
                      }`}
                    />

                    {/* Always-visible title at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                      <h3 className="text-sm font-semibold text-white/90">{t(slide.titleKey)}</h3>
                    </div>

                    {/* Active overlay with description */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-5 transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <h3
                        className={`text-lg font-bold text-white transition-all duration-500 ${
                          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                      >
                        {t(slide.titleKey)}
                      </h3>
                      <p
                        className={`mt-2 text-sm text-white/80 leading-relaxed transition-all duration-500 delay-100 ${
                          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                      >
                        {t(slide.descKey)}
                      </p>
                    </div>
                  </div>

                  {/* Reflection */}
                  <div
                    className="absolute left-0 right-0 -bottom-2 h-16 rounded-b-2xl overflow-hidden opacity-20 pointer-events-none"
                    style={{ transform: "scaleY(-1)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)" }}
                  >
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel3DSection;
