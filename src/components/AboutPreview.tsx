import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import ScrollReveal from "./ScrollReveal";

const AboutPreview = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding">
      <div className="container-narrow max-w-3xl mx-auto text-center">
        <ScrollReveal animation="headline">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("aboutPreview.tag")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("aboutPreview.title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="paragraph" delay={0.3}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {t("aboutPreview.body")}
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.5}>
          <Link
            to="/about-us"
            className="btn-3d btn-3d-outline group mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary"
          >
            {t("aboutPreview.learnMore")} <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" data-icon />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutPreview;
