import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Partner {
  name: string;
  logo: string;
  category: "sourcing" | "logistics";
}

const partners: Partner[] = [
  { name: "Alibaba", logo: "/logos/alibaba-hd.jpg", category: "sourcing" },
  { name: "AliExpress", logo: "/logos/aliexpress-hd.jpg", category: "sourcing" },
  { name: "Made-in-China", logo: "/logos/made-in-china.png", category: "sourcing" },
  { name: "Global Sources", logo: "/logos/globalsources.png", category: "sourcing" },
  { name: "Amazon", logo: "/logos/amazon-hd.png", category: "sourcing" },
  { name: "DHgate", logo: "/logos/dhgate.svg", category: "sourcing" },
  { name: "Taobao", logo: "/logos/taobao.svg", category: "sourcing" },
  { name: "Tmall", logo: "/logos/tmall.svg", category: "sourcing" },
  { name: "JD.com", logo: "/logos/jd.svg", category: "sourcing" },
  { name: "Suning", logo: "/logos/suning.png", category: "sourcing" },
  { name: "SF Express", logo: "/logos/sf-express-hd.jpg", category: "logistics" },
  { name: "China Post / EMS", logo: "/logos/china-post-ems.svg", category: "logistics" },
  { name: "Yunda Express", logo: "/logos/yunda.png", category: "logistics" },
  { name: "ZTO Express", logo: "/logos/zto-express.svg", category: "logistics" },
  { name: "Best Express", logo: "/logos/best-express.png", category: "logistics" },
  { name: "Cainiao", logo: "/logos/cainiao-hd.jpg", category: "logistics" },
  { name: "EMS China", logo: "/logos/ems-china-hd.jpg", category: "logistics" },
  { name: "COSCO Shipping", logo: "/logos/cosco.svg", category: "logistics" },
  { name: "DHL", logo: "/logos/dhl-hd.png", category: "logistics" },
  { name: "FedEx", logo: "/logos/fedex.svg", category: "logistics" },
  { name: "UPS", logo: "/logos/ups.svg", category: "logistics" },
  { name: "Maersk", logo: "/logos/maersk.svg", category: "logistics" },
  { name: "CMA CGM", logo: "/logos/cma-cgm.png", category: "logistics" },
  { name: "Kuehne+Nagel", logo: "/logos/kuehne-nagel-hd.png", category: "logistics" },
  { name: "DB Schenker", logo: "/logos/dbschenker.svg", category: "logistics" },
];

const TrustedPartnersSlider = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Header timeline animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
      tl.from(".partners-tag", { opacity: 0, y: 25, filter: "blur(6px)", duration: 0.6, ease: "power3.out" })
        .from(".partners-title", { opacity: 0, y: 35, filter: "blur(8px)", duration: 0.7, ease: "power3.out" }, "-=0.3")
        .from(".partners-subtitle", { opacity: 0, y: 20, filter: "blur(4px)", duration: 0.6, ease: "power3.out" }, "-=0.3")
        .from(".partners-track-wrap", { opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.2");

      tl.eventCallback("onComplete", () => {
        gsap.set([".partners-tag", ".partners-title", ".partners-subtitle"], { clearProps: "filter" });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Infinite scroll tween
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isRTL = document.documentElement.dir === "rtl";
    const totalWidth = track.scrollWidth / 2;

    tweenRef.current?.kill();
    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: isRTL ? totalWidth : -totalWidth,
      duration: 90,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => {
          const val = parseFloat(x);
          return ((val % totalWidth) + totalWidth) % totalWidth * (isRTL ? 1 : -1);
        }),
      },
    });

    return () => { tweenRef.current?.kill(); };
  }, [i18n.language]);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  const logos = [...partners, ...partners];

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30 overflow-hidden">
      <div className="container-narrow text-center mb-10">
        <p className="partners-tag text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {t("trustedPartners.tag", "Our Network")}
        </p>
        <h2 className="partners-title mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("trustedPartners.title", "Trusted Platforms & Logistics Partners")}
        </h2>
        <p className="partners-subtitle mt-3 text-muted-foreground max-w-2xl mx-auto">
          {t("trustedPartners.subtitle", "Connecting you with reliable suppliers and seamless shipping solutions from China to the world.")}
        </p>
      </div>

      <div
        className="partners-track-wrap relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
                className="h-10 w-10 shrink-0 object-contain transition-all duration-300 group-hover:scale-110"
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
