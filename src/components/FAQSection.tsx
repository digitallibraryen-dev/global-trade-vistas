import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow max-w-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("faq.tag")}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("faq.title")}</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
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
      </div>
    </section>
  );
};

export default FAQSection;
