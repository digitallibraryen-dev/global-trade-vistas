import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const AboutPreview = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("aboutPreview.tag")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("aboutPreview.title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {t("aboutPreview.body")}
          </p>
          <Link
            to="/about-us"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            {t("aboutPreview.learnMore")} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPreview;
