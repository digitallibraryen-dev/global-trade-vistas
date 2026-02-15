import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

const partners = [
  { name: "Alibaba", logo: "/logos/alibaba.png" },
  { name: "AliExpress", logo: "/logos/aliexpress.png" },
  { name: "Made-in-China", logo: "/logos/made-in-china.png" },
  { name: "Global Sources", logo: "/logos/globalsources.png" },
  { name: "DHgate", logo: "/logos/dhgate.png" },
  { name: "Taobao", logo: "/logos/taobao.png" },
  { name: "Tmall", logo: "/logos/tmall.png" },
  { name: "JD.com", logo: "/logos/jd.png" },
  { name: "Suning", logo: "/logos/suning.png" },
  { name: "DHL", logo: "/logos/dhl.png" },
  { name: "FedEx", logo: "/logos/fedex.png" },
  { name: "UPS", logo: "/logos/ups.png" },
  { name: "Maersk", logo: "/logos/maersk.png" },
  { name: "CMA CGM", logo: "/logos/cma-cgm.png" },
  { name: "Cainiao", logo: "/logos/cainiao.png" },
  { name: "DB Schenker", logo: "/logos/dbschenker.png" },
];

const TrustedPartnersSlider = () => {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 35,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth),
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  const logos = [...partners, ...partners];

  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="container-narrow text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {t("trustedPartners.tag", "Our Network")}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("trustedPartners.title", "Trusted Platforms & Logistics Partners")}
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          {t("trustedPartners.subtitle", "Connecting you with reliable suppliers and seamless shipping solutions from China to the world.")}
        </p>
      </div>

      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div ref={trackRef} className="flex w-max items-center gap-8 px-5">
          {logos.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group flex h-20 w-44 shrink-0 items-center justify-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="h-9 w-9 shrink-0 rounded-md object-contain opacity-70 transition-all duration-300 group-hover:opacity-100"
                loading="lazy"
              />
              <span className="text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-foreground leading-tight">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnersSlider;
