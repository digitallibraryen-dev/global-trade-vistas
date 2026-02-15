import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

interface Partner {
  name: string;
  logo: string;
  category: "sourcing" | "logistics";
}

const partners: Partner[] = [
  // Chinese Sourcing & Marketplace Platforms
  { name: "Alibaba", logo: "/logos/alibaba.svg", category: "sourcing" },
  { name: "AliExpress", logo: "/logos/aliexpress-new.svg", category: "sourcing" },
  { name: "Made-in-China", logo: "/logos/made-in-china.png", category: "sourcing" },
  { name: "Global Sources", logo: "/logos/globalsources.png", category: "sourcing" },
  { name: "1688", logo: "/logos/1688.png", category: "sourcing" },
  { name: "DHgate", logo: "/logos/dhgate.svg", category: "sourcing" },
  { name: "Taobao", logo: "/logos/taobao.svg", category: "sourcing" },
  { name: "Tmall", logo: "/logos/tmall.svg", category: "sourcing" },
  { name: "JD.com", logo: "/logos/jd.svg", category: "sourcing" },
  { name: "Suning", logo: "/logos/suning.png", category: "sourcing" },
  // Chinese Logistics
  { name: "SF Express", logo: "/logos/sf-express.png", category: "logistics" },
  { name: "China Post / EMS", logo: "/logos/china-post-ems.svg", category: "logistics" },
  { name: "Yunda Express", logo: "/logos/yunda.png", category: "logistics" },
  { name: "ZTO Express", logo: "/logos/zto-express.svg", category: "logistics" },
  { name: "Best Express", logo: "/logos/best-express.png", category: "logistics" },
  { name: "Cainiao", logo: "/logos/cainiao.svg", category: "logistics" },
  { name: "EMS China", logo: "/logos/ems-china.png", category: "logistics" },
  { name: "COSCO Shipping", logo: "/logos/cosco.svg", category: "logistics" },
  // Global Logistics
  { name: "DHL", logo: "/logos/dhl.svg", category: "logistics" },
  { name: "FedEx", logo: "/logos/fedex.svg", category: "logistics" },
  { name: "UPS", logo: "/logos/ups.svg", category: "logistics" },
  { name: "Maersk", logo: "/logos/maersk.svg", category: "logistics" },
  { name: "CMA CGM", logo: "/logos/cma-cgm.png", category: "logistics" },
  { name: "Kuehne+Nagel", logo: "/logos/kuehne-nagel.png", category: "logistics" },
  { name: "DB Schenker", logo: "/logos/dbschenker.svg", category: "logistics" },
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
      duration: 45,
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

        <div ref={trackRef} className="flex w-max items-center gap-6 px-5">
          {logos.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group flex h-20 w-48 shrink-0 items-center gap-3 rounded-xl border border-border bg-card/80 px-5 py-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="h-10 w-10 shrink-0 object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                loading="lazy"
              />
              <span className="whitespace-nowrap text-sm font-bold text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
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
