import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ScrollReveal from "./ScrollReveal";

interface Partner {
  name: string;
  logo: string;
}

const row1: Partner[] = [
  { name: "Alibaba", logo: "/logos/alibaba-hd.jpg" },
  { name: "AliExpress", logo: "/logos/aliexpress-hd.jpg" },
  { name: "Made-in-China", logo: "/logos/made-in-china.png" },
  { name: "Global Sources", logo: "/logos/globalsources.png" },
  { name: "Amazon", logo: "/logos/amazon-hd.png" },
  { name: "DHgate", logo: "/logos/dhgate.svg" },
  { name: "Taobao", logo: "/logos/taobao.svg" },
  { name: "Tmall", logo: "/logos/tmall.svg" },
  { name: "JD.com", logo: "/logos/jd.svg" },
];

const row2: Partner[] = [
  { name: "Suning", logo: "/logos/suning.png" },
  { name: "SF Express", logo: "/logos/sf-express-hd.jpg" },
  { name: "China Post / EMS", logo: "/logos/china-post-ems.svg" },
  { name: "Yunda Express", logo: "/logos/yunda.png" },
  { name: "ZTO Express", logo: "/logos/zto-express.svg" },
  { name: "Best Express", logo: "/logos/best-express.png" },
  { name: "Cainiao", logo: "/logos/cainiao-hd.jpg" },
  { name: "EMS China", logo: "/logos/ems-china-hd.jpg" },
  { name: "YTO Express", logo: "/logos/yto-express.png" },
];

const row3: Partner[] = [
  { name: "COSCO Shipping", logo: "/logos/cosco.svg" },
  { name: "DHL", logo: "/logos/dhl-hd.png" },
  { name: "FedEx", logo: "/logos/fedex.svg" },
  { name: "UPS", logo: "/logos/ups.svg" },
  { name: "Maersk", logo: "/logos/maersk.svg" },
  { name: "CMA CGM", logo: "/logos/cma-cgm.png" },
  { name: "Kuehne+Nagel", logo: "/logos/kuehne-nagel-hd.png" },
  { name: "DB Schenker", logo: "/logos/dbschenker.svg" },
  { name: "Evergreen", logo: "/logos/evergreen.png" },
];

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <div className="flex h-16 w-56 shrink-0 items-center justify-between rounded-2xl border border-border/50 bg-card px-5 py-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
    <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground">
      {partner.name}
    </span>
    <img
      src={partner.logo}
      alt={`${partner.name} logo`}
      className="h-8 w-8 shrink-0 object-contain"
      loading="lazy"
      decoding="async"
      width={32}
      height={32}
    />
  </div>
);

interface ScrollRowProps {
  partners: Partner[];
  direction: "left" | "right";
  speed?: number;
}

const ScrollRow = ({ partners, direction, speed = 60 }: ScrollRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateAnimation = () => {
      const singleSetWidth = track.scrollWidth / 2;
      if (!singleSetWidth) return;

      const startX = direction === "left" ? 0 : -singleSetWidth;
      const endX = direction === "left" ? -singleSetWidth : 0;

      tweenRef.current?.kill();
      gsap.set(track, { x: startX });

      tweenRef.current = gsap.to(track, {
        x: endX,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    updateAnimation();
    window.addEventListener("resize", updateAnimation);

    return () => {
      window.removeEventListener("resize", updateAnimation);
      tweenRef.current?.kill();
    };
  }, [direction, speed]);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  const logos = [...partners, ...partners];

  return (
    <div
      className="overflow-hidden"
      dir="ltr"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={trackRef} className="flex w-max items-center gap-4 py-2">
        {logos.map((p, i) => (
          <PartnerCard key={`${p.name}-${i}`} partner={p} />
        ))}
      </div>
    </div>
  );
};

const TrustedPartnersSlider = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <ScrollReveal animation="headline" className="container-narrow text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {t("trustedPartners.tag", "Our Network")}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("trustedPartners.title", "Trusted Platforms & Logistics Partners")}
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          {t("trustedPartners.subtitle", "Connecting you with reliable suppliers and seamless shipping solutions from China to the world.")}
        </p>
      </ScrollReveal>

      <div className="relative space-y-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <ScrollRow partners={row1} direction="left" speed={70} />
        <ScrollRow partners={row2} direction="right" speed={80} />
        <ScrollRow partners={row3} direction="left" speed={75} />
      </div>
    </section>
  );
};

export default TrustedPartnersSlider;
