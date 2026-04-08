import { Link } from "react-router-dom";
import { PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";

const stepKeys = ["submit", "search", "quality", "negotiate", "shipment"] as const;
const stepIcons = [PaperPlaneTilt, MagnifyingGlass, ShieldCheck, Handshake, Truck];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="section-padding gradient-dark">
      <div className="container-narrow">
        <ScrollReveal animation="headline" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("howItWorks.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("howItWorks.title")}</h2>
        </ScrollReveal>
        <ScrollReveal animation="alternating" stagger={0.12} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {stepKeys.map((key, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={key} className="relative text-center">
                <ScrollReveal animation="icon-bounce">
                  <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-lg">
                    <Icon size={28} weight="light" className="text-primary-foreground" />
                  </div>
                </ScrollReveal>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">{t("howItWorks.step")} {i + 1}</div>
                <h3 className="text-sm font-semibold text-foreground">{t(`howItWorks.steps.${key}.title`)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`howItWorks.steps.${key}.desc`)}</p>
              </div>
            );
          })}
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.5} className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t("howItWorks.learnMoreHint")}</p>
          <Link
            to="/how-it-works"
            className="btn-3d btn-3d-outline group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary"
          >
            {t("aboutPreview.learnMore")}
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" data-icon />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowItWorksSection;
