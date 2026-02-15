import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const stepKeys = ["submit", "search", "quality", "negotiate", "shipment"] as const;
const stepIcons = [PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck];

const HowItWorksSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-item", { scrollTrigger: { trigger: ".steps-container", start: "top 80%" }, opacity: 0, y: 40, duration: 0.6, stagger: 0.15, ease: "power3.out" });
      gsap.from(".step-line", { scrollTrigger: { trigger: ".steps-container", start: "top 80%" }, scaleX: 0, duration: 1.5, ease: "power2.out", delay: 0.3 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="section-padding gradient-dark">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("howItWorks.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("howItWorks.title")}</h2>
        </div>
        <div className="steps-container relative mt-16">
          <div className="step-line absolute left-0 right-0 top-8 hidden h-[2px] origin-left gradient-primary lg:block" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {stepKeys.map((key, i) => {
              const Icon = stepIcons[i];
              return (
                <div key={key} className="step-item relative text-center">
                  <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-lg">
                    <Icon size={28} weight="light" className="text-primary-foreground" />
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">{t("howItWorks.step")} {i + 1}</div>
                  <h3 className="text-sm font-semibold text-foreground">{t(`howItWorks.steps.${key}.title`)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`howItWorks.steps.${key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t("howItWorks.learnMoreHint")}</p>
          <Link
            to="/how-it-works"
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

export default HowItWorksSection;
