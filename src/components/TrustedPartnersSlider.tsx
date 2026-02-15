import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

const partners = [
  { name: "Alibaba", url: "https://logo.clearbit.com/alibaba.com" },
  { name: "AliExpress", url: "https://logo.clearbit.com/aliexpress.com" },
  { name: "Made-in-China", url: "https://logo.clearbit.com/made-in-china.com" },
  { name: "Global Sources", url: "https://logo.clearbit.com/globalsources.com" },
  { name: "1688", url: "https://logo.clearbit.com/1688.com" },
  { name: "DHgate", url: "https://logo.clearbit.com/dhgate.com" },
  { name: "Taobao", url: "https://logo.clearbit.com/taobao.com" },
  { name: "Tmall", url: "https://logo.clearbit.com/tmall.com" },
  { name: "JD.com", url: "https://logo.clearbit.com/jd.com" },
  { name: "DHL", url: "https://logo.clearbit.com/dhl.com" },
  { name: "FedEx", url: "https://logo.clearbit.com/fedex.com" },
  { name: "UPS", url: "https://logo.clearbit.com/ups.com" },
  { name: "Maersk", url: "https://logo.clearbit.com/maersk.com" },
  { name: "COSCO Shipping", url: "https://logo.clearbit.com/cosco.com" },
  { name: "SF Express", url: "https://logo.clearbit.com/sf-express.com" },
  { name: "CMA CGM", url: "https://logo.clearbit.com/cma-cgm.com" },
  { name: "Cainiao", url: "https://logo.clearbit.com/cainiao.com" },
  { name: "DB Schenker", url: "https://logo.clearbit.com/dbschenker.com" },
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
      duration: 40,
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

        <div ref={trackRef} className="flex w-max items-center gap-10 px-5">
          {logos.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-border bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              <img
                src={p.url}
                alt={p.name}
                className="max-h-10 max-w-full object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span className="hidden items-center justify-center text-xs font-semibold text-muted-foreground">
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
