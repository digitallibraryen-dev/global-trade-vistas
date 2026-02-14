import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const categories = ["General", "Shipping", "Payments", "Quality Control", "Orders"];

const FAQPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    supabase
      .from("faq_items")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as any) || []);
        setLoading(false);
      });
  }, []);

  // If no DB items, fall back to static i18n items
  const staticItems = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;
  const useStatic = !loading && items.length === 0;

  const filteredItems = activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);
  const usedCategories = [...new Set(items.map((i) => i.category))];

  return (
    <>
      <Navbar />
      <PageHeader
        tag={t("faqPage.tag")}
        title={t("faqPage.title")}
        subtitle={t("faqPage.subtitle")}
      />
      <main className="section-padding">
        <div className="container-narrow max-w-3xl">
          {!useStatic && usedCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("faqPage.all")}
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {useStatic
                ? staticItems.map((f, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="rounded-xl border-none px-5 [&_svg]:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#003f7f]/30"
                      style={{ backgroundColor: '#003f7f' }}
                    >
                      <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-white/80 pb-4">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))
                : filteredItems.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="rounded-xl border-none px-5 [&_svg]:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#003f7f]/30"
                      style={{ backgroundColor: '#003f7f' }}
                    >
                      <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-white/80 pb-4">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
            </Accordion>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default FAQPage;
