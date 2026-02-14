import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I deal with factories or intermediaries?",
    a: "We work directly with verified factories and first-tier suppliers. Our team visits manufacturing sites regularly to ensure quality and authenticity.",
  },
  {
    q: "Is quality guaranteed?",
    a: "Yes. We conduct pre-shipment inspections and quality control checks at every stage. We also offer third-party inspection coordination for added assurance.",
  },
  {
    q: "How long is the shipping time?",
    a: "Shipping time depends on the method: sea freight takes 25-40 days, air freight 5-10 days, and rail freight 15-20 days. We provide real-time tracking for all shipments.",
  },
  {
    q: "What are the payment terms?",
    a: "We typically work with 30% deposit upon order confirmation and 70% before shipment. Other arrangements can be negotiated based on order volume.",
  },
  {
    q: "Can you help with small orders?",
    a: "Absolutely. We work with businesses of all sizes and can help consolidate smaller orders to optimize shipping costs and minimum order requirements.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow max-w-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border-none px-5 [&_svg]:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#003f7f]/30"
              style={{ backgroundColor: '#003f7f' }}
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/80 pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
