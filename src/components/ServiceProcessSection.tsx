import { Link } from "react-router-dom";
import { MagnifyingGlass, Flask, CurrencyDollar, Boat, ChartBar, ArrowRight } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";

const stepKeys = ["supplierResearch", "qualityInspection", "priceNegotiation", "shippingDelivery", "afterSales"] as const;
const stepIcons = [MagnifyingGlass, Flask, CurrencyDollar, Boat, ChartBar];

const ServiceProcessSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding gradient-dark overflow-hidden">
      <div className="container-narrow">
        <ScrollReveal animation="headline" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("serviceProcess.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("serviceProcess.title")}</h2>
        </ScrollReveal>
        <ScrollReveal animation="alternating" stagger={0.15} className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {stepKeys.map((key, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={key} className="group relative text-center">
                <ScrollReveal animation="icon-bounce">
                  <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full glass border border-primary/20 shadow-lg transition-all duration-300 group-hover:glow-primary group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full animate-[pulse_3s_ease-in-out_infinite] opacity-30 gradient-primary" />
                    <Icon size={32} weight="light" className="relative z-10 text-primary transition-colors duration-300 group-hover:text-accent" />
                  </div>
                </ScrollReveal>
                <h3 className="text-sm font-semibold text-foreground">{t(`serviceProcess.steps.${key}.title`)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`serviceProcess.steps.${key}.desc`)}</p>
              </div>
            );
          })}
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.5} className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t("serviceProcess.learnMoreHint")}</p>
          <Link
            to="/services"
            className="btn-3d group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-transparent px-6 py-3 text-sm font-semibold text-primary"
          >
            {t("aboutPreview.learnMore")}
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" data-icon />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServiceProcessSection;
