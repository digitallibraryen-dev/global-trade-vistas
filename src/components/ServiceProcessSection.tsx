import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagnifyingGlass, Flask, CurrencyDollar, Boat, ChartBar, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ParallaxOrbs from "./ParallaxOrbs";

gsap.registerPlugin(ScrollTrigger);

const stepKeys = ["supplierResearch", "qualityInspection", "priceNegotiation", "shippingDelivery", "afterSales"] as const;
const stepIcons = [MagnifyingGlass, Flask, CurrencyDollar, Boat, ChartBar];

const ServiceProcessSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".process-node", {
        scrollTrigger: { trigger: ".process-flow", start: "top 80%" },
        opacity: 0,
        scale: 0.8,
        filter: "blur(6px)",
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.4)",
        clearProps: "filter",
      });
      gsap.from(".process-line", {
        scrollTrigger: { trigger: ".process-flow", start: "top 80%" },
        scaleX: 0,
        duration: 2,
        ease: "power2.out",
        delay: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative section-padding gradient-dark overflow-hidden">
      <ParallaxOrbs variant="primary" />
      <div className="container-narrow relative z-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("serviceProcess.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("serviceProcess.title")}</h2>
        </div>
        <div className="process-flow relative mt-16">
          <div className="process-line absolute left-[10%] right-[10%] top-10 hidden h-[2px] origin-left lg:block" style={{ backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--primary)) 0, hsl(var(--primary)) 8px, transparent 8px, transparent 16px)` }} />
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {stepKeys.map((key, i) => {
              const Icon = stepIcons[i];
              return (
                <div key={key} className="process-node group relative text-center">
                  <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full glass border border-primary/20 shadow-lg transition-all duration-300 group-hover:glow-primary group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full animate-[pulse_3s_ease-in-out_infinite] opacity-30 gradient-primary" />
                    <Icon size={32} weight="light" className="relative z-10 text-primary transition-colors duration-300 group-hover:text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{t(`serviceProcess.steps.${key}.title`)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`serviceProcess.steps.${key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t("serviceProcess.learnMoreHint")}</p>
          <Link
            to="/services"
            className="btn-3d group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-transparent px-6 py-3 text-sm font-semibold text-primary"
          >
            {t("aboutPreview.learnMore")}
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" data-icon />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcessSection;
