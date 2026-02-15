import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

interface Partner {
  name: string;
  color: string;
  category: "sourcing" | "logistics";
}

const partners: Partner[] = [
  // Chinese Sourcing & Marketplace Platforms
  { name: "Alibaba", color: "#FF6A00", category: "sourcing" },
  { name: "AliExpress", color: "#E43225", category: "sourcing" },
  { name: "Made-in-China", color: "#0066CC", category: "sourcing" },
  { name: "Global Sources", color: "#003399", category: "sourcing" },
  { name: "1688", color: "#FF4400", category: "sourcing" },
  { name: "DHgate", color: "#F57C00", category: "sourcing" },
  { name: "Taobao", color: "#FF5000", category: "sourcing" },
  { name: "Tmall", color: "#E4393C", category: "sourcing" },
  { name: "JD.com", color: "#C9141E", category: "sourcing" },
  { name: "Suning", color: "#F89E1C", category: "sourcing" },
  // Chinese Logistics
  { name: "SF Express", color: "#000000", category: "logistics" },
  { name: "China Post", color: "#006633", category: "logistics" },
  { name: "Yunda Express", color: "#003399", category: "logistics" },
  { name: "ZTO Express", color: "#003D79", category: "logistics" },
  { name: "Best Express", color: "#E60012", category: "logistics" },
  { name: "Cainiao", color: "#FF6A00", category: "logistics" },
  { name: "EMS China", color: "#003399", category: "logistics" },
  { name: "COSCO Shipping", color: "#003B6F", category: "logistics" },
  // Global Logistics
  { name: "DHL", color: "#D40511", category: "logistics" },
  { name: "FedEx", color: "#4D148C", category: "logistics" },
  { name: "UPS", color: "#351C15", category: "logistics" },
  { name: "Maersk", color: "#0077B5", category: "logistics" },
  { name: "CMA CGM", color: "#002B5C", category: "logistics" },
  { name: "Kuehne+Nagel", color: "#003A70", category: "logistics" },
  { name: "DB Schenker", color: "#EC0016", category: "logistics" },
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
              className="group flex h-16 shrink-0 items-center gap-3 rounded-xl border border-border bg-card/80 px-5 py-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            >
              {/* Brand color dot */}
              <span
                className="h-3 w-3 shrink-0 rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: p.color }}
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
