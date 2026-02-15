import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";

const FAQSection = () => {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow max-w-2xl">
        <ScrollReveal animation="headline" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("faq.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("faq.title")}</h2>
        </ScrollReveal>
        <ScrollReveal animation="card" stagger={0.1} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
          {items.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border-none px-5 [&_svg]:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#003f7f]/30"
              style={{ backgroundColor: '#003f7f' }}
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/80 pb-4">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={0.4} className="mt-12 text-center">
          <Link
            to="/faq"
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

export default FAQSection;
