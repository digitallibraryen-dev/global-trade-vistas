import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const items = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      tl.from(".faq-tag", { opacity: 0, y: 25, filter: "blur(6px)", duration: 0.6, ease: "power3.out" })
        .from(".faq-title", { opacity: 0, y: 35, filter: "blur(8px)", duration: 0.7, ease: "power3.out" }, "-=0.3")
        .from(".faq-item", { opacity: 0, y: 30, filter: "blur(4px)", duration: 0.5, stagger: 0.08, ease: "power3.out", clearProps: "filter" }, "-=0.3")
        .from(".faq-cta", { opacity: 0, y: 20, filter: "blur(4px)", duration: 0.6, ease: "power3.out", clearProps: "filter" }, "-=0.2");

      tl.eventCallback("onComplete", () => {
        gsap.set([".faq-tag", ".faq-title"], { clearProps: "filter" });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={ref} className="section-padding">
      <div className="container-narrow max-w-2xl">
        <div className="text-center">
          <p className="faq-tag text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("faq.tag")}</p>
          <h2 className="faq-title mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("faq.title")}</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="faq-item rounded-xl border-none px-5 [&_svg]:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#003f7f]/30"
              style={{ backgroundColor: '#003f7f' }}
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/80 pb-4">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="faq-cta mt-12 text-center">
          <Link
            to="/faq"
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

export default FAQSection;
